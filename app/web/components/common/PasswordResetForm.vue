<template>
  <el-form
    class="password-reset-form"
    :model="ruleForm"
    :rules="rules"
    ref="passwordResetForm"
  >
    <h3 class="password-reset-form-title">{{$t('user.passwordReset')}}</h3>
    <el-form-item prop="phoneOrEmail">
      <el-input
        v-model="ruleForm.phoneOrEmail"
        :placeholder="$t('user.inputPhoneOrEmail')"
      ></el-input>
    </el-form-item>
    <el-form-item prop="captcha">
      <el-input
        v-model="ruleForm.captcha"
        :placeholder="$t('user.inputVerificationCode')"
      >
        <el-button
          type="primary"
          :class="['password-reset-form-send', { 'disabled':  disabledSendButton }]"
          :disabled="disabledSendButton"
          :loading="isSendCode"
          slot="suffix"
          @click="sendCode"
        > {{disabledSendButton ? `${count}${$t('user.countResend')}` : $t('user.sendCodes') }} </el-button>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="ruleForm.password"
        type="password"
        :placeholder="$t('user.newPassword')"
      ></el-input>
    </el-form-item>
    <el-form-item prop="rePassword">
      <el-input
        v-model="ruleForm.rePassword"
        type="password"
        :placeholder="$t('user.reNewPassword')"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        class="password-reset-form-confirm"
        :loading='isLoading'
        type="primary"
        @click="passwordReset('ruleForm')"
      >{{$t('common.OK')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions } from 'vuex'
import { keepwork } from '@/api'
const EMAIL_REG =  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
const PHONE_REG = /^1[3-9][0-9]{9}$/
export default {
  name: 'PasswordResetForm',
  data() {
    const validatePhoneOrEmail = (rule, value, callback) => {
      if (PHONE_REG.test(value) || EMAIL_REG.test(value)) {
        callback()
        } else {
        callback(new Error(this.$t('user.worongEmailOrPhone')))
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('user.reNewPwdRequired')))
      } else {
        if (value !== this.ruleForm.password) {
          callback(new Error(this.$t('user.twoPwdInconsistent')))
        } else {
          callback()
        }
      }
    }
    return {
      isLoading: false,
      hasSended: false,
      isSendCode: false,
      timer: null,
      users: null,
      count: 60,
      ruleForm: {
        phoneOrEmail: '',
        code: '',
        password: '',
        rePassword: ''
      },
      rules: {
        phoneOrEmail: [
          {
            required: true,
            message: this.$t('user.worongEmailOrPhone'),
            trigger: 'blur'
          },
          {
          validator: validatePhoneOrEmail, trigger: 'blur'
          }
        ],
        captcha: [
          {
            required: true,
            message: this.$t('user.inputVerificationCode'),
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
        rePassword: [
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
          },
          {
            validator: validatePassword, trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    disabledSendButton() {
      return this.count !== 60
    }
  },
  methods: {
    ...mapActions({
      getCodeByEmail: 'user/getCodeByEmail',
      getCodeByCellphone: 'user/getCodeByCellphone',
      userPasswordReset: 'user/passwordReset',
      userLogin: 'user/login'
    }),
    async passwordReset() {
      this.$refs.passwordResetForm.validate(async valid => {
        if (!valid) return
        this.isLoading = true
        const { captcha, phoneOrEmail: key, password } = this.ruleForm
        const payload = {
          captcha,
          key,
          password
        }
        const result = await this.userPasswordReset(payload).catch(e => {
          if (e.response.data.code === 5) {
            return this.$message.error(this.$t('user.verificationCodeError'))
          }
          this.$message.error(this.$t('common.failure'))
        })
        if (result == 'OK') {
          await this.userLogin({
            username: key,
            password
          }).catch(e => console.error(e))
          window.location.href = window.location.origin
        }
        this.isLoading = false
      })
    },
    sendCode() {
      this.$refs.passwordResetForm.validateField('phoneOrEmail', async (err, value, value2, value3) => {
        if (!err) {
          try {
            this.isSendCode = true
            const phoneOrEmail = this.ruleForm.phoneOrEmail
            if (PHONE_REG.test(phoneOrEmail)) {
              const res = await keepwork.user.searchByField({ cellphone: phoneOrEmail})
              if (res.count === 0) {
                 this.isSendCode = false
                 return this.$message.error(this.$t('user.phoneNotBound'))
              }
              this.users = await this.getCodeByCellphone({ cellphone: phoneOrEmail })
            }
            if (EMAIL_REG.test(phoneOrEmail)) {
              const res = await keepwork.user.searchByField({ email: phoneOrEmail})
              if (res.count === 0) {
                this.isSendCode = false
                return this.$message.error(this.$t('user.emailNotBound'))
              }
              this.users = await this.getCodeByEmail({ email: phoneOrEmail })
            }
            this.isSendCode = false
            this.count--
            this.timer = setInterval(() => {
              if (this.count > 0) {
                this.count--
              } else {
                clearInterval(this.timer)
                this.count = 60
              }
            }, 1000)
          } catch (error) {
            console.error(error)
            this.isSendCode = false
            this.$message.error(this.$t('user.sendingFrequent'))
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.password-reset-form {
  padding: 0 32px;
  &-title {
    font-size: 18px;
    height: 25px;
    color: #303133;
    padding: 20px 0 0;
    margin: 0 0 32px;
  }
  &-send {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    padding-left: 12px;
    padding-right: 12px;
    min-width: 85px;
    &.disabled {
      color: #909399;
      background: #e8e8e8;
      border: none;
      &:hover {
        color: #909399;
        background: #e8e8e8;
        border: none;
      }
    }
    span {
      font-size: 12px;
    }
  }
  &-confirm {
    width: 100%;
    margin-top: 6px;
  }
  .el-form-item {
    margin-bottom: 16px;
  }
  .el-input__suffix {
    right: 1px;
  }
}
</style>
