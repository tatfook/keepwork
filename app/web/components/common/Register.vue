<template>
  <el-form class="register-dialog-form" :model="ruleForm" :rules="rules" ref="ruleForm">
    <h3 class="register-title">{{$t('common.register')}}</h3>
    <el-form-item prop="username" :error="usernameError">
      <el-popover placement="top" width="264" trigger="manual" content="" v-model="visible">
        <el-input slot="reference" @focus="handleUsernameInputFocus" @blur="isExist" v-model.trim="ruleForm.username" :placeholder="$t('common.accountName')"></el-input>
        <div class="register-dialog-form-tip">
          {{$t('common.accountNoChange')}}<br>
          {{$t('common.useLettersOrNumber')}}<br>
          {{$t('common.defaultAddress')}}<br>
          <span class="defaultAddress">{{nowOrigin}}/{{ruleForm.username}}</span>
        </div>
      </el-popover>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="ruleForm.password" :placeholder="$t('common.password')" @keyup.enter.native="register('ruleForm')"></el-input>
    </el-form-item>
    <el-form-item prop="phoneNumber">
      <el-input v-model="ruleForm.phoneNumber" :placeholder="$t('user.inputPhoneNumber')"></el-input>
    </el-form-item>
    <el-form-item prop="authCode">
      <el-row class="send-auth">
        <el-col class="send-auth-code">
          <el-input v-model="ruleForm.authCode" :placeholder="$t('common.authCode')"></el-input>
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
      <div class="agreement"><el-checkbox v-model="checkedAgreement">{{$t('common.regardAsAgreed')}}<a href="/agreement" target="_blank">{{$t('common.userAgreement')}}</a></el-checkbox></div>
      <el-button class="login-btn" :disabled="!checkedAgreement" :loading='registerLoading' type="primary" @click="register('ruleForm')">{{$t('common.register')}}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { keepwork } from '@/api'

export default {
  name: 'RegisterDialog',
  props: {
    show: Boolean
  },
  data() {
    let validateUsername = (rule, value, callback) => {
      if (/^[0-9]/.test(value)) {
        callback(new Error(this.$t('common.usernameCannotWithNumber')))
      } else {
        callback()
      }
    }
    return {
      usernameError: '',
      visible: false,
      envIsForDevelopment: process.env.NODE_ENV === 'development',
      loading: false,
      registerLoading: false,
      sendCodeLoading: false,
      sendCodeDisabled: false,
      nowOrigin: document.location.origin,
      count: 60,
      smsId: '',
      checkedAgreement: false,
      ruleForm: {
        username: '',
        password: '',
        phoneNumber: '',
        authCode: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: this.$t('common.inputUsername'),
            trigger: 'blur'
          },
          {
            validator: validateUsername
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('common.inputPassword'),
            trigger: 'blur'
          },
          {
            min: 6,
            message: this.$t('common.minPassword')
          },
          {
            max: 24,
            message: this.$t('common.maxPassword')
          }
        ],
        phoneNumber: [
          {
            required: true,
            message: this.$t('user.inputPhoneNumber'),
            trigger: 'blur'
          },
          { len: 11, message: this.$t('user.wrongNumberFormat') }
        ],
        authCode: [
          {
            required: true,
            message: this.$t('user.inputVerificationCode'),
            trigger: 'blur'
          }
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
      verifyCellphoneTwo: 'user/verifyCellphoneTwo'
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
    handleUsernameInputFocus() {
      this.visible = true
      this.usernameError = ''
    },
    isExist() {
      this.visible = false
      if (!this.ruleForm.username) return
      keepwork.user
        .getUser(this.ruleForm.username)
        .then(res => {
          if (res) {
            this.usernameError = this.$t('common.existAccount')
          }
        })
        .catch(e => {
          this.usernameError = ''
        })
    },
    async register(formName) {
      if (this.usernameError) return
      this.$refs[formName].validate(async valid => {
        if (valid && !this.usernameError) {
          let payload = {
            username: this.ruleForm.username,
            password: this.ruleForm.password,
            cellphone: this.ruleForm.phoneNumber,
            captcha: this.ruleForm.authCode
          }
          this.registerLoading = true
          await this.userRegister(payload)
            .then(res => {
              this.registerLoading = false
              this.handleClose()
              if(this.$route.name == 'Register'){
                window.location.href = '/'
              }else{
                window.location.reload()
              }
            })
            .catch(e => {
              if (e.response.data.code == 4) {
                this.showMessage(
                  'error',
                  this.$t('user.verificationCodeExpiration')
                )
              } else if (e.response.data.code == 5) {
                this.showMessage('error', this.$t('user.verificationCodeError'))
              } else if (e.response.data.code == 2) {
                this.showMessage('error', this.$t('common.notValidAccount'))
              } else {
                this.showMessage('error', this.$t('common.registerFailed'))
              }
              this.registerLoading = false
            })
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
      if (info === 'OK') {
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
      } else {
        this.$message.error(this.$t('user.smsCodeSentFailed'))
        this.sendCodeLoading = false
      }
    }
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
    .el-dialog__header {
      padding: 0;
    }
    max-width: 352px;
    padding: 40px 0 10px 0;
  }
  &-form {
    padding: 0 32px;
    margin: 0 auto;
    position: relative;
    .register-title {
      padding: 20px 0 0;
      margin: 0 auto 30px;
      font-size: 18px;
      color: #303133;
    }
    .el-form-item {
      margin-bottom: 18px;
    }
    .el-form-item__content {
      .el-input__inner {
        &:focus {
          box-shadow: 1px 1px 3px #daeaf6, -1px -1px 3px #daeaf6;
        }
      }
    }
    &-tip {
      line-height: 18px;
      margin-bottom: 18px;
      font-size: 12px;
      .defaultAddress {
        color: #409eff;
        font-weight: 700;
      }
    }
    .send-auth {
      display: flex;
      &-code {
        flex: 1;
      }
      &-send-code {
        width: 116px;
        margin-left: 8px;
        .send-code-button {
          width: 100%;
        }
      }
    }
    .agreement{
      .el-checkbox{
        display: flex;
        align-items: center;
      }
      .el-checkbox__label{
        display: inline-block;
        word-break: break-word;
        white-space: normal;
       }
      a{
        text-decoration: none;
        color: #409efe;
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
    &-three-login {
      a {
        display: inline-block;
        width: 24%;
        text-align: center;
        img {
          cursor: pointer;
        }
      }
      .title {
        margin: 35px 0;
        padding: 20px 0 35px;
        text-align: center;
        position: relative;
        span {
          background: #fff;
          position: relative;
          z-index: 2;
          padding: 0 4px;
        }
        &::after {
          content: '';
          height: 2px;
          width: 100%;
          position: absolute;
          right: 0;
          top: 40%;
          background: #d6e6f4;
        }
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
@media screen and (max-width: 768px) {
  .register-dialog {
    .el-dialog {
      width: 90%;
    }
  }
}
</style>