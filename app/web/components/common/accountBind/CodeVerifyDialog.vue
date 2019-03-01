label<template>
  <div class="label">
    <el-dialog class="account-binding-dialog" :visible.sync="isCodeDialogVisible" width="600px" :before-close="handleClose" :append-to-body="true">
      <span slot='title'>{{dialogTitle}}</span>
      <el-form :inline="true" @submit.native.prevent>
        <el-form-item :label='inputLabel'>
          <el-input v-model="code" type="small"></el-input>
          <span class="el-form-item__error" v-show="codeError">{{codeError}}</span>
        </el-form-item>
        <el-form-item>
          <el-button class="account-binding-dialog-code-button" :loading="isSendingCode" size="small" :disabled="isCounting" @click="sendCode">{{isCounting ?`${countDown}${$t('user.countDownResend')}`: $t('user.sendCodes')}}</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="VerifyCode" :disabled="isVerifyCodeAvailable">{{$t('common.Sure')}}</el-button>
        <el-button @click="handleClose">{{$t('common.Cancel')}}</el-button>
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
          title = `${this.$t('user.emailBind')} > ${this.codeDialogDatas.value}`
          break
        case 'cellphone':
          title = `${this.$t('user.phoneBind')} > ${this.codeDialogDatas.value}`
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
          label = this.$t('user.emailVerificationCode')
          break
        case 'cellphone':
          label = this.$t('user.smsCode')
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
          result = await this.verifyEmailCode().catch(e => console.error(e))
          break
        case 'cellphone':
          result = await this.verifyPhoneCode().catch(e => console.error(e))
          break
        default:
          break
      }
      if (result == true) {
        this.handleClose()
      }
    },
    async verifyEmailCode() {
      let message = await this.userVerifyEmailTwo({
        captcha: this.code,
        email: this.codeDialogDatas.value,
        isBind: this.codeDialogDatas.bind
      })
      if (message == true) {
        this.showMessage(
          'success',
          `${this.codeDialogDatas.bind ? this.$t('user.bindingSuccess') : this.$t('user.unbundingSuccess')}`
        )
      } else {
        this.codeError = message
        this.showMessage(
          'error',
          `${this.codeDialogDatas.bind ? this.$t('user.bindingFailed') : this.$t('user.unBundingFailure')}`
        )
      }
      return message
    },
    async verifyPhoneCode() {
      let result = await this.userVerifyCellphoneTwo({
        isBind: this.codeDialogDatas.bind,
        captcha: this.code,
        cellphone: this.codeDialogDatas.value
      })
      if (result == 'OK') {
        this.showMessage(
          'success',
          `${this.codeDialogDatas.bind ? this.$t('user.bindingSuccess') : this.$t('user.unbundingSuccess')}`
        )
        result = true
      } else {
        this.codeError = result.error.message
        this.showMessage(
          'error',
          `${this.codeDialogDatas.bind ? this.$t('user.bindingFailed') : this.$t('user.unBundingFailure')}`
        )
      }
      return result
    },
    async sendCode() {
      this.codeError = ''
      switch (this.codeDialogDatas.type) {
        case 'email':
          this.isSendingCode = true
          let result = await this.userVerifyEmailOne({
            email: this.codeDialogDatas.value
          })
          this.isSendingCode = false
          this.isCodeSent = true
          this.showMessage('success', this.$t('user.mailSentSuccess'))
          this.startTimer()
          break
        case 'cellphone':
          this.isSendingCode = true
          let phoneResult = await this.userVerifyCellphoneOne({
            bind: this.codeDialogDatas.bind,
            cellphone: this.codeDialogDatas.value
          })
          this.isSendingCode = false
          // let smsId = _.get(phoneResult, 'data.smsId')
          if (phoneResult === 'OK') {
            // this.smsId = smsId
            this.isCodeSent = true
            this.showMessage('success', this.$t('user.smsCodeSentSuccess'))
            this.startTimer()
          } else {
            this.codeError = phoneResult
            this.showMessage('error', this.$t('user.smsCodeSentFailed'))
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
