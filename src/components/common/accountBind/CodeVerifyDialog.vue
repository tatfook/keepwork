label<template>
  <div class="label">
    <el-dialog class="account-binding-dialog" :visible.sync="isCodeDialogVisible" width="600px" :before-close="handleClose" :append-to-body="true">
      <span slot='title'>{{dialogTitle}}</span>
      <el-form :inline="true">
        <el-form-item :label='inputLabel'>
          <el-input v-model="codeDialogDatas.code" type="small"></el-input>
          <span class="el-form-item__error" v-show="codeDialogDatas.codeError">{{codeDialogDatas.codeError}}</span>
        </el-form-item>
        <el-form-item>
          <el-button class="account-binding-dialog-code-button" size="small" @click="sendCode">发送验证码</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="VerifyCode" :disabled="!codeDialogDatas.codeSent">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'CodeVerifyDialog',
  props: {
    codeDialogDatas: Object,
    isCodeDialogVisible: Boolean,
    codeType: String
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile'
    }),
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
    }
  },
  data() {
    return {}
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
      this.$emit('close')
    },
    async VerifyCode() {
      switch (this.codeDialogDatas.type) {
        case 'email':
          await this.verifyEmailCode()
          break
        case 'cellphone':
          break
        default:
          break
      }
      this.handleClose()
    },
    async verifyEmailCode() {
      let { username } = this.userProfile
      await this.userVerifyEmailTwo({
        username: username,
        bind: this.codeDialogDatas.bind,
        isApi: true,
        verifyCode: this.codeDialogDatas.code
      })
      this.showMessage('success', `${this.codeDialogDatas.bind ? '绑定' : '解绑'}成功`)
    },
    async sendCode() {
      switch (this.codeDialogDatas.type) {
        case 'email':
          let result = await this.userVerifyEmailOne({
            email: this.codeDialogDatas.value,
            bind: this.codeDialogDatas.bind
          })
          this.codeDialogDatas.codeSent = true
          this.showMessage('success', '邮件发送成功')
          break
        case 'cellphone':
          break
        default:
          break
      }
    }
  }
}
</script>