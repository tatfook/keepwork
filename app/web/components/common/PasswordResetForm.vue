<template>
  <el-form
    class="password-reset-form"
    :model="ruleForm"
    :rules="rules"
    ref="passwordResetForm"
  >
    <h3 class="password-reset-form-title">重置密码</h3>
    <el-form-item prop="phoneOrEmail">
      <el-input
        v-model="ruleForm.phoneOrEmail"
        placeholder="请输入手机号/邮箱"
      ></el-input>
    </el-form-item>
    <el-form-item prop="captcha">
      <el-input
        v-model="ruleForm.captcha"
        placeholder="输入验证码"
      >
        <el-button
          type="primary"
          :class="['password-reset-form-send', { 'disabled':  disabledSendButton }]"
          :disabled="disabledSendButton"
          :loading="isSendCode"
          slot="suffix"
          @click="sendCode"
        > {{disabledSendButton ? `${count}s后重发` : '发送验证码' }} </el-button>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="ruleForm.password"
        type="password"
        placeholder="设置新密码"
      ></el-input>
    </el-form-item>
    <el-form-item prop="rePassword">
      <el-input
        v-model="ruleForm.rePassword"
        type="password"
        placeholder="确认新密码"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        class="password-reset-form-confirm"
        :loading='isLoading'
        type="primary"
        @click="passwordReset('ruleForm')"
      >确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions } from 'vuex'
const EMAIL_REG =  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
const PHONE_REG = /^1[3-9][0-9]{9}$/
export default {
  name: 'PasswordResetForm',
  data() {
    const validatePhoneOrEmail = (rule, value, callback) => {
      if (PHONE_REG.test(value) || EMAIL_REG.test(value)) {
        callback()
        } else {
        callback(new Error('请输入正确的手机号或者邮箱'))
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else {
        if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'))
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
            message: '邮箱或者密码不能为空',
            trigger: 'blur'
          },
          {
          validator: validatePhoneOrEmail, trigger: 'blur'
          }
        ],
        captcha: [
          {
            required: true,
            message: '验证码不能为空',
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
          this.$message.error('重置密码失败')
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
              this.users = await this.getCodeByCellphone({ cellphone: phoneOrEmail })
            }
            if (EMAIL_REG.test(phoneOrEmail)) {
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
            this.isSendCode = false
            this.$message.error('您的请求过于频繁，请明天再试')
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
    padding-left: 2px;
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
