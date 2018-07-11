label<template>
  <div class="label">
    <el-dialog class="account-binding-dialog" :visible.sync="isCodeDialogVisible" width="600px" :before-close="handleClose" :append-to-body="true">
      <span slot='title'>{{dialogTitle}}</span>
      <el-form :inline="true">
        <el-form-item :label='inputLabel'>
          <el-input v-model="code" type="small"></el-input>
          <span class="el-form-item__error" v-show="codeError">{{codeError}}</span>
        </el-form-item>
        <el-form-item>
          <el-button class="account-binding-dialog-code-button" :loading="isSendingCode" size="small" :disabled="isCounting" @click="sendCode">{{isCounting ?`${countDown}秒后重新发送`:'发送验证码'}}</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="VerifyCode" :disabled="isVerifyCodeAvailable">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'CodeVerifyDialog',
  props: {
    codeDialogDatas: Object,
    isCodeDialogVisible: Boolean,
    codeType: String
  },
  computed: {
    dialogTitle() {
      let title = ''
      switch (this.codeType) {
        case 'email':
          title = `邮箱绑定 > ${this.codeDialogDatas.value}`
          break
        case 'cellphone':
          title = `手机绑定 > ${this.codeDialogDatas.value}`
          break
        default:
          break
      }
      return title
    },
    inputLabel() {
      let label = ''
      switch (this.codeType) {
        case 'email':
          label = '邮箱验证码:'
          break
        case 'cellphone':
          label = '手机验证码:'
          break
        default:
          break
      }
      return label
    },
    isCounting() {
      return this.countDownTimer && this.countDown >= 0 && this.countDown <= 60
    },
    isVerifyCodeAvailable() {
      return !this.isCodeSent || !this.code
    }
  },
  data() {
    return {
      countDownTimer: undefined,
      countDown: undefined,
      codeError: '',
      code: '',
      isCodeSent: false,
      smsId: '',
      isSendingCode: false
    }
  },
  methods: {
    ...mapActions({
      userVerifyEmailOne: 'user/verifyEmailOne',
      userVerifyEmailTwo: 'user/verifyEmailTwo',
      userVerifyCellphoneOne: 'user/verifyCellphoneOne',
      userVerifyCellphoneTwo: 'user/verifyCellphoneTwo'
    }),
    showMessage(type, message) {
      this.$message({
        message,
        type,
        showClose: true
      })
    },
    handleClose() {
      this.resetDatas()
      this.$emit('close')
    },
    resetDatas() {
      if (this.countDownTimer) {
        this.countDown = undefined
        clearTimeout(this.countDownTimer)
      }
      this.code = ''
      this.codeError = ''
      this.isCodeSent = false
    },
    async VerifyCode() {
      let result
      switch (this.codeDialogDatas.type) {
        case 'email':
          result = await this.verifyEmailCode()
          break
        case 'cellphone':
          result = await this.verifyPhoneCode()
          break
        default:
          break
      }
      if (result === 'success') {
        this.handleClose()
      }
    },
    async verifyEmailCode() {
      let message = await this.userVerifyEmailTwo({
        bind: this.codeDialogDatas.bind,
        isApi: true,
        verifyCode: this.code
      })
      if (message === 'success') {
        this.showMessage(
          'success',
          `${this.codeDialogDatas.bind ? '绑定' : '解绑'}成功`
        )
      } else {
        this.codeError = message
        this.showMessage(
          'error',
          `${this.codeDialogDatas.bind ? '绑定' : '解绑'}失败`
        )
      }
      return message
    },
    async verifyPhoneCode() {
      let result = await this.userVerifyCellphoneTwo({
        bind: this.codeDialogDatas.bind,
        smsCode: this.code,
        smsId: this.smsId
      })
      console.log(result)
      if (result.data) {
        this.showMessage(
          'success',
          `${this.codeDialogDatas.bind ? '绑定' : '解绑'}成功`
        )
      } else {
        this.codeError = result.error.message
        this.showMessage(
          'error',
          `${this.codeDialogDatas.bind ? '绑定' : '解绑'}失败`
        )
      }
      return result.data ? 'success' : result.error.message
    },
    async sendCode() {
      this.codeError = ''
      switch (this.codeDialogDatas.type) {
        case 'email':
          this.isSendingCode = true
          let result = await this.userVerifyEmailOne({
            email: this.codeDialogDatas.value,
            bind: this.codeDialogDatas.bind
          })
          this.isSendingCode = false
          this.isCodeSent = true
          this.showMessage('success', '邮件发送成功')
          this.startTimer()
          break
        case 'cellphone':
          this.isSendingCode = true
          let phoneResult = await this.userVerifyCellphoneOne({
            bind: this.codeDialogDatas.bind,
            cellphone: this.codeDialogDatas.value
          })
          this.isSendingCode = false
          let smsId = _.get(phoneResult, 'data.smsId')
          if (smsId) {
            this.smsId = smsId
            this.isCodeSent = true
            this.showMessage('success', '短信发送成功')
            this.startTimer()
          } else {
            this.codeError = phoneResult.message
            this.showMessage('error', '短信发送失败')
          }
          break
        default:
          break
      }
    },
    startTimer() {
      this.countDown = 60
      this.countDownTimer = setInterval(() => {
        this.countDown--
      }, 1000)
    }
  }
}
</script>
<style lang="scss">
.account-binding-dialog {
  .el-form-item__error {
    bottom: 100%;
    top: auto;
    padding: 0 0 4px;
  }

  &-code-button {
    font-size: 16px;
    color: #1989fa;
    border-color: #1989fa;
    width: 148px;
    text-align: center;
    padding: 8px 0;
    border-radius: 34px;
  }
  .el-dialog__header {
    font-size: 16px;
    border-bottom: 1px solid #d1d1d1;
    padding: 10px 25px;
  }
  .el-dialog__headerbtn {
    top: 13px;
  }
  .el-form {
    padding: 25px 0 0 33px;
  }
  .el-input {
    width: 257px;
    margin-right: 8px;
  }
  .el-form-item__label {
    padding-right: 16px;
  }
}
</style>
