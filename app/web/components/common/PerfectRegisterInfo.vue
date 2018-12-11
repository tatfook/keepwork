<template>
    <el-form class="register-dialog-form" :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item prop="username">
        <el-input v-model="ruleForm.username" :placeholder="$t('common.accountName')"></el-input>
      </el-form-item>
      <div class="register-dialog-form-tip">
        {{$t('common.accountNoChange')}}<br>
        {{$t('common.useLettersOrNumber')}}<br>
        {{$t('common.defaultAddress')}}<br>
        <span class="defaultAddress">{{nowOrigin}}/{{ruleForm.username}}</span>
      </div>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm.password" :placeholder="$t('common.password')" @keyup.enter.native="register('ruleForm')"></el-input>
      </el-form-item>
      <el-form-item prop="phoneNumber">
        <el-input v-model="ruleForm.phoneNumber" :placeholder="$t('user.inputPhoneNumber')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-row class="send-auth">
          <el-col class="send-auth-code">
              <el-input v-model="authCode" :placeholder="$t('common.authCode')"></el-input>
          </el-col>
          <el-col class="send-auth-send-code">
              <el-button :loading="sendCodeLoading" :disabled="sendCodeDisabled || !this.isCellphoneVerify" type="primary" class="send-code-button" @click.stop="sendAuthCode">
                <span v-if="sendCodeDisabled">{{$t('user.resend')}}({{count}}s)</span>
                <span v-else>{{$t('user.sendCodes')}}</span>
              </el-button>
          </el-col>
        </el-row> 
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" :loading='registerLoading'  type="primary" @click="register('ruleForm')">{{$t('common.perfectInfo')}}</el-button>
      </el-form-item>
    </el-form>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PerfectRegisterInfo',
  props: {
    show: Boolean,
    userThreeService: Object
  },
  data() {
    let validatePhoneNumber = (rule, value, callback) => {
      if (!/^1\d{10}$/.test(value)) {
        callback(new Error(this.$t('user.wrongNumberFormat')))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      registerLoading: false,
      sendCodeLoading: false,
      authCode: '',
      sendCodeDisabled: false,
      nowOrigin: document.location.origin,
      count: 60,
      smsId: '',
      ruleForm: {
        username: '',
        password: '',
        phoneNumber: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: this.$t('common.inputUsername'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('common.inputPassword'),
            trigger: 'blur'
          }
        ],
        phoneNumber: [
          {
            required: true,
            message: this.$t('user.inputPhoneNumber'),
            trigger: 'blur'
          },
          { validator: validatePhoneNumber, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    isCellphoneVerify() {
      return /^1\d{10}$/.test(this.ruleForm.phoneNumber)
    }
  },
  methods: {
    ...mapActions({
      userLogin: 'user/login',
      userThirdLogin: 'user/thirdLogin',
      verifyCellphoneOne: 'user/verifyCellphoneOne',
      userRegister: 'user/register',
      verifyCellphoneTwo: 'user/verifyCellphoneTwo',
      thirdRegister: 'user/thirdRegister'
    }),
    handleClose() {
      this.$emit('close')
    },
    showMessage(type, message) {
      this.$message({
        message,
        type,
        showClose: true
      })
    },
    async register(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let payload = {
            username: this.ruleForm.username,
            password: this.ruleForm.password,
            threeService: this.userThreeService,
            bind: true,
            setRealNameInfo: true,
            cellphone: this.ruleForm.phoneNumber,
            smsCode: this.authCode,
            smsId: this.smsId
          }
          this.registerLoading = true
          //第三方进行注册
          let thirdRegisterInfo = await this.thirdRegister(payload).catch(e => {
            this.showMessage('error', this.$t('common.registerFailed'))
            this.registerLoading = false
          })
          //注册成功进行登录
          if(thirdRegisterInfo.error.id === 0){
            this.registerLoading = false
            this.loading = true
            let loginInfo = await this.userLogin(payload).catch(e => {
              console.error(e)
              this.loading = false
            })
            this.handleClose()
            this.loading = false
          }else{
            switch (thirdRegisterInfo.error.message) {
              case '用户名已存在':
                this.showMessage('error', this.$t('common.existAccount'))
                this.registerLoading = false
                break
              case '验证码错误':
                this.showMessage('error', this.$t('user.verificationCodeError'))
                this.registerLoading = false
                break
              default:
                this.showMessage('error', this.$t('common.registerFailed'))
                this.registerLoading = false
                break
            }
          }
        } else {
          return false
        }
      })
    },
    async sendAuthCode() {
      this.sendCodeLoading = true
      let payload = {
        cellphone: this.ruleForm.phoneNumber
      }
      let info = await this.verifyCellphoneOne(payload).catch(e => {
            console.error(e)
          })
      this.sendCodeLoading = false
      this.smsId = _.get(info, 'data.smsId')
      let message = info.error && info.error.message
      if (message === 'success') {
        this.showMessage('success', this.$t('user.smsCodeSentSuccess'))
        this.sendCodeDisabled = true
        this.timer = setInterval(() => {
          if (this.count > 0) {
            this.count--
          } else {
            this.sendCodeDisabled = false
            clearInterval(this.timer)
            this.timer = null
            this.count = 60
          }
        }, 1000)
        return
      }
      // if (message === '号码格式有误') {
      //   this.showMessage('error', this.$t('user.smsCodeSentFailed'))
      //   return
      // }
      // if (message === '短信验证码发送过频繁') {
      //   this.showMessage('error', this.$t('user.sendingFrequent'))
      //   return
      // }
      // if (message === '验证码超出同模板同号码天发送上限') {
      //   this.showMessage('error', this.$t('user.codeExceedsTheSendingLimit'))
      //   return
      // }
      // let message2 =
      //   info.message && info.message.slice(0, 6)
      // if (message2 === '手机号已绑定') {
      //   this.showMessage('error', this.$t('user.hasBeenBoundToOtherAccounts'))
      //   return
      // }
    },
  }
}
</script>
<style lang="scss">
.perfect-register-info{
.register-dialog {
  &.force-login {
    .el-dialog__header {
      .el-dialog__headerbtn {
        display: none;
      }
    }
  }
  .el-dialog {
    .el-dialog__header{
      padding: 0;
    }
    width: 34%;
    min-width: 478px;
    padding: 40px 0 40px 0;
  }
  &-form {
    border: 1px solid #ccc;
    padding:50px 30px 10px;
    width: 22%;
    box-shadow: 2px 2px 3px #cccccc, -2px -2px 3px #cccccc;
    margin: 80px auto 0;
    .el-form-item__content {
      .el-input__inner {
        &:focus {
          box-shadow: 1px 1px 3px #daeaf6, -1px -1px 3px #daeaf6;
        }
      }
    }
    &-tip{
      line-height: 18px;
      margin-bottom: 18px;
      .defaultAddress{
        color: #ff0000;
        font-weight: 700;
      }
    }
    .send-auth{
      display: flex;
      &-code{
        flex: 1
      }
      &-send-code{
        width: 116px;
        margin-left: 8px;
        .send-code-button {
          width: 100%;
        }
      }
    }
    &-operate {
      text-align: right;
      cursor: pointer;
      a {
        text-decoration: none;
        color: inherit;
      }
    }
    &-operate_signIn {
      text-align: right;
      a {
        display: inline-block;
        text-decoration: none;
        height: 20px;
        border-bottom: 1px solid #3977ad;
        color: #286090;
        cursor: pointer;
      }
    }
    .login-btn {
      width: 100%;
      margin: 20px 0;
      height: 44px;
      padding: 10px 16px;
      font-size: 18px;
      border-radius: 6px;
    }
  }
}
}
</style>