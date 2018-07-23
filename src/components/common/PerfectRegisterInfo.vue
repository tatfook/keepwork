<template>
    <el-form class="register-dialog-form" :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item prop="username">
        <el-input v-model="ruleForm.username" placeholder="账户名"></el-input>
      </el-form-item>
      <div class="register-dialog-form-tip">
        登录账号注册后不可更改<br>
        可以使用英文字母、数字组合（例如：keep123<br>
        系统默认个人网址地址:<br>
        https://release.keepwork.com/???
      </div>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm.password" :placeholder="$t('common.password')" @keyup.enter.native="register('ruleForm')"></el-input>
      </el-form-item>
      <el-form-item prop="phoneNumber">
        <el-input v-model="ruleForm.phoneNumber" placeholder="输入手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-row class="send-auth">
          <el-col class="send-auth-code">
              <el-input v-model="authCode" placeholder="验证码"></el-input>
          </el-col>
          <el-col class="send-auth-send-code">
              <el-button :loading="sendCodeLoading" :disabled="sendCodeDisabled || !ruleForm.phoneNumber" type="primary" class="send-code-button" @click.stop="sendAuthCode">
                <span v-if="sendCodeDisabled">{{$t('user.resend')}}({{count}}s)</span>
                <span v-else>{{$t('user.sendCodes')}}</span>
              </el-button>
          </el-col>
        </el-row> 
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" :loading='registerLoading'  type="primary" @click="register('ruleForm')">完善信息</el-button>
      </el-form-item>
    </el-form>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'LoginDialog',
  props: {
    show: Boolean,
    forceLogin: {
      required: false,
      default: false,
      type: Boolean
    }
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
      count: 60,
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
  methods: {
    ...mapActions({
      userLogin: 'user/login',
      userThirdLogin: 'user/thirdLogin',
      verifyCellphoneOne: 'user/verifyCellphoneOne',
      userRegister: 'user/register'
    }),
    handleClose() {
      !this.forceLogin && this.$emit('close')
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
            bind: true,
            setRealNameInfo: true,
            cellphone: this.ruleForm.phoneNumber
          }
          this.registerLoading = true
          //进行注册
          let registerInfo = await this.userRegister(payload).catch(e => {
            console.log('e',e)
            this.registerLoading = false
          })
          console.log('registerInfo',registerInfo)
          //注册成功进行登录
          if(registerInfo.error.id === 0){
            this.registerLoading = false
            this.handleClose()
            this.loading = true
            let loginInfo = await this.userLogin(payload).catch(e => {
              console.error(e)
              this.loading = false
            })
            console.log('loginInfo',loginInfo)
            this.loading = false
            //尝试手机号尝试实名认证
            //尝试绑定手机号
          }else{
            this.showMessage('error', this.$t('user.registerFailed'))
          }
        } else {
          return false
        }
      })
    },
    async sendAuthCode() {
      this.sendCodeLoading = true
      let payload = {
        // setRealNameInfo: true,
        cellphone: this.ruleForm.phoneNumber
      }
      let info = await this.verifyCellphoneOne(payload).catch(e => {
            console.error(e)
          })
      this.sendCodeLoading = false
      let smsId = _.get(info, 'data.smsId')
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
      if (message === '号码格式有误') {
        this.showMessage('error', this.$t('user.smsCodeSentFailed'))
        return
      }
      if (message === '短信验证码发送过频繁') {
        this.showMessage('error', this.$t('user.sendingFrequent'))
        return
      }
      if (message === '验证码超出同模板同号码天发送上限') {
        this.showMessage('error', this.$t('user.codeExceedsTheSendingLimit'))
        return
      }
      let message2 =
        info.message && info.message.slice(0, 6)
      if (message2 === '手机号已绑定') {
        this.showMessage('error', this.$t('user.hasBeenBoundToOtherAccounts'))
        return
      }
    },
  }
}
</script>
<style lang="scss">
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
</style>