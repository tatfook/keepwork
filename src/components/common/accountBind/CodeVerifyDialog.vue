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
          <el-button class="account-binding-dialog-code-button" size="small" :disabled="isCounting" @click="sendCode">{{isCounting ?`${countDown}秒后重新发送`:'发送验证码'}}</el-button>
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
      isCodeSent: false
    }
  },
  methods: {
    ...mapActions({
      userVerifyEmailOne: 'user/verifyEmailOne',
      userVerifyEmailTwo: 'user/verifyEmailTwo'
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
    async sendCode() {
      switch (this.codeDialogDatas.type) {
        case 'email':
          let result = await this.userVerifyEmailOne({
            email: this.codeDialogDatas.value,
            bind: this.codeDialogDatas.bind
          })
          this.isCodeSent = true
          this.showMessage('success', '邮件发送成功')
          break
        case 'cellphone':
          break
        default:
          break
      }
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
}
</style>
