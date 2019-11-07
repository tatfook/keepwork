<template>
  <div class="register-comp">
    <account-encrypt :refreshAfterFinish="true" />
    <el-form v-show="isRegisterDialogShow" class="register-dialog-form" :model="ruleForm" :rules="rules" ref="ruleForm">
      <h3 class="register-title">{{$t('common.register')}}</h3>
      <el-form-item prop="username" :error="usernameError">
        <el-popover placement="top" width="264" trigger="manual" content="" :value="isPopoverVisible">
          <el-input slot="reference" @focus="handleUsernameInputFocus" v-model.trim="ruleForm.username" :placeholder="$t('common.accountName')"></el-input>
          <div class="register-dialog-form-tip">
            {{$t('common.accountNoChange')}}<br>
            {{$t('common.useLettersOrNumber')}}<br>
            {{$t('common.defaultAddress')}}<br>
            <span class="defaultAddress">{{nowOrigin}}/{{ruleForm.username}}</span>
          </div>
        </el-popover>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model.trim="ruleForm.password" :placeholder="$t('common.password')" @keyup.enter.native="register('ruleForm')"></el-input>
      </el-form-item>
      <el-form-item prop="svgCaptcha">
        <el-row class="send-auth">
          <el-col class="send-auth-code">
            <el-input v-model.trim="ruleForm.svgCaptcha" placeholder="请输入验证码"></el-input>
          </el-col>
          <el-col class="send-auth-send-code">
            <div v-loading="isSvgCaptchaLoading" v-html="captchaSvg.captcha" @click="changeSvgCaptcha"></div>
          </el-col>
        </el-row>
      </el-form-item>
      <h3 class="register-title">实名认证（推荐）</h3>
      <el-form-item prop="phoneNumber">
        <el-input v-model.trim="ruleForm.phoneNumber" :placeholder="$t('user.inputPhoneNumber')"></el-input>
      </el-form-item>
      <el-form-item prop="authCode">
        <el-row class="send-auth">
          <el-col class="send-auth-code">
            <el-input v-model.trim="ruleForm.authCode" :placeholder="$t('common.authCode')"></el-input>
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
        <div class="agreement">
          <el-checkbox v-model="checkedAgreement">{{$t('common.regardAsAgreed')}}<a href="/agreement" target="_blank">{{$t('common.userAgreement')}}</a></el-checkbox>
        </div>
        <el-button class="login-btn" :disabled="!checkedAgreement" :loading='registerLoading' type="primary" @click="register('ruleForm')">{{$t('common.register')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { keepwork } from '@/api'
import { checkSensitiveWords } from '@/lib/utils/sensitive'
import AccountEncrypt from '@/components/common/AccountEncrypt'

export default {
  name: 'RegisterDialog',
  props: {
    isDialogShow: {
      default: undefined
    }
  },
  mounted() {
    this.changeSvgCaptcha()
  },
  data() {
    let validateUsername = async (rule, value, callback) => {
      if (!/^[A-Za-z]/.test(value)) {
        return callback(new Error('用户名必须以字母开头'))
      }
      if (value.length > 20) {
        return callback(new Error('用户名不能超过20位'))
      }
      if (!/^[A-Za-z\d]+$/.test(value)) {
        return callback(new Error('用户名只能包含数字、字母'))
      }
      let isSensitive = await this.checkSensitive([value])
      if (isSensitive) {
        return callback(new Error(this.$t('common.containsSensitiveWords')))
      }
      let res = await keepwork.user.getUser(value.toLowerCase()).catch(err => {
        return callback()
      })
      if (res) {
        return callback(new Error(this.$t('common.existAccount')))
      }
      return callback()
    }
    let validateAuthCode = (rule, value, callback) => {
      let { phoneNumber } = this.ruleForm
      if (phoneNumber && !value) {
        callback(new Error(this.$t('user.inputVerificationCode')))
      } else {
        callback()
      }
    }
    let validateSvgCaptcha = async (rule, value, callback) => {
      let isSvgCaptchaCorrect = await this.verifySvgCaptcha()
      if (!isSvgCaptchaCorrect) {
        callback(new Error('图形验证码错误'))
      } else {
        callback()
      }
    }
    return {
      isRegisterDialogShow: true,
      captchaSvg: {},
      isSvgCaptchaLoading: false,
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
        svgCaptcha: '',
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
            validator: validateUsername,
            trigger: 'blur'
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
        svgCaptcha: [
          {
            required: true,
            message: this.$t('user.inputVerificationCode'),
            trigger: 'blur'
          },
          {
            validator: validateSvgCaptcha,
            trigger: 'blur'
          }
        ],
        phoneNumber: [
          {
            message: this.$t('user.inputPhoneNumber'),
            trigger: 'blur'
          },
          { len: 11, message: this.$t('user.wrongNumberFormat') }
        ],
        authCode: [
          {
            validator: validateAuthCode,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    isCellphoneVerify() {
      return /^1\d{10}$/.test(this.ruleForm.phoneNumber)
    },
    isPopoverVisible() {
      return _.isBoolean(this.isDialogShow)
        ? this.visible && this.isDialogShow
        : this.visible
    }
  },
  methods: {
    ...mapActions({
      toggleAccountEncrypt: 'user/toggleAccountEncrypt',
      getSvgCaptcha: 'user/getSvgCaptcha',
      userVerifySvgCaptcha: 'user/verifySvgCaptcha',
      userLogin: 'user/login',
      userThirdLogin: 'user/thirdLogin',
      verifyCellphoneOne: 'user/verifyCellphoneOne',
      userRegister: 'user/register',
      verifyCellphoneTwo: 'user/verifyCellphoneTwo'
    }),
    async changeSvgCaptcha() {
      this.isSvgCaptchaLoading = true
      this.captchaSvg = await this.getSvgCaptcha()
      this.isSvgCaptchaLoading = false
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
    async checkSensitive(checkedWords) {
      let result = await checkSensitiveWords({ checkedWords }).catch()
      return result && result.length > 0
    },
    async verifySvgCaptcha() {
      return await this.userVerifySvgCaptcha({
        key: this.captchaSvg.key,
        captcha: this.ruleForm.svgCaptcha
      })
    },
    showAccountEncrypt() {
      this.isRegisterDialogShow = false
      this.toggleAccountEncrypt(true)
    },
    async register(formName) {
      if (this.usernameError) return
      this.$refs[formName].validate(async valid => {
        if (valid && !this.usernameError) {
          let { username, password, phoneNumber, authCode } = this.ruleForm
          let payload = {
            username: username.toLowerCase(),
            password: password.toLowerCase(),
            cellphone: phoneNumber ? phoneNumber : null,
            captcha: phoneNumber ? authCode : null
          }
          this.registerLoading = true
          await this.userRegister(payload)
            .then(res => {
              this.registerLoading = false
              this.showAccountEncrypt()
            })
            .catch(e => {
              let code = _.get(e.response, 'data.code')
              const registerCodeMsgObj = {
                code0: '服务器繁忙,请稍后重试…',
                code1: '用户名或密码错误',
                code2: this.$t('common.notValidAccount'),
                code3: this.$t('common.existAccount'),
                code4: this.$t('user.verificationCodeExpiration'),
                code5: this.$t('user.verificationCodeError'),
                code5: '创建git用户失败',
                code8: this.$t('common.containsSensitiveWords')
              }
              let errorMsg =
                registerCodeMsgObj[`code${code}`] ||
                this.$t('common.registerFailed')
              this.showMessage('error', errorMsg)
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
      try {
        let info = await this.verifyCellphoneOne(payload)
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
          this.sendCodeLoading = false
          return
        } else {
          this.$message.error(this.$t('user.smsCodeSentFailed'))
          this.sendCodeLoading = false
        }
      } catch (error) {
        if (_.includes(_.get(error, 'response.data'), '请求次数过多')) {
          this.$message.error(this.$t('common.tooManyRequests'))
          this.sendCodeLoading = false
        }
      }
    }
  },
  components: {
    AccountEncrypt
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
    padding: 1px 0 10px 0;
  }
  &-form {
    max-width: 352px;
    margin: 80px auto 10px;
    box-shadow: 1px 1px 5px #ccc;
    padding: 0 32px;
    position: relative;
    box-sizing: border-box;
    .register-title {
      padding: 20px 0 0;
      margin: 32px 0 20px 0;
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
          padding: 12px 0;
        }
      }
    }
    .agreement {
      .el-checkbox {
        display: flex;
        align-items: center;
      }
      .el-checkbox__label {
        display: inline-block;
        word-break: break-word;
        white-space: normal;
      }
      a {
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
    svg {
      height: 40px;
      background-color: #e9f4ff;
      width: 100%;
      border-radius: 4px;
      cursor: pointer;
      display: block;
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
