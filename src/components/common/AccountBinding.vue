<template>
  <div class="account-binding">
    <el-form class="account-binding-form account-binding-email" ref='emailForm' :inline="true" :rules="bindingRules" :model='userBindings' label-width="140px">
      <el-form-item label="邮箱绑定:" prop="email">
        <el-input class="account-binding-form-item-content" size='small' v-model="userBindings.email"></el-input>
        <span class="el-form-item__error" v-show="emailError">{{emailError}}</span>
      </el-form-item>
      <el-form-item>
        <el-button size="small" class="account-binding-form-item-button" @click="toggleBindEmail">绑定</el-button>
      </el-form-item>
    </el-form>
    <el-form class="account-binding-form account-binding-phone" :rules="bindingRules" :inline="true" :model='userBindings' label-width="140px">
      <el-form-item label="手机绑定:" prop="cellphone">
        <el-input class="account-binding-form-item-content" size='small' v-model="userBindings.cellphone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" class="account-binding-form-item-button" @click="toggleBindPhone">绑定</el-button>
      </el-form-item>
    </el-form>
    <el-dialog class="account-binding-dialog" :visible.sync="isCodeDialogVisible" width="600px" :before-close="handleClose" :append-to-body="true">
      <span slot='title'>{{codeDialogDatas.dialogTitle}}</span>
      <el-form :inline="true">
        <el-form-item :label='codeDialogDatas.inputLabel'>
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
import { mapActions, mapGetters } from 'vuex'
const EmailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
export default {
  name: 'AccountBinding',
  data() {
    let emailValidater = (rule, value, callback) => {
      if (!EmailReg.test(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    return {
      emailError: '',
      isCodeDialogVisible: false,
      codeDialogDatas: {
        type: '',
        value: '',
        dialogTitle: '',
        inputLabel: '',
        code: '',
        codeId: '',
        codeError: '',
        codeSent: false
      },
      userBindings: {
        email: '1873070425@qq.com',
        cellphone: ''
      },
      bindingRules: {
        email: [{ validator: emailValidater, trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile'
    })
  },
  methods: {
    ...mapActions({
      userGetByEmail: 'user/getByEmail',
      userVerifyEmailOne: 'user/verifyEmailOne',
      userVerifyEmailTwo: 'user/verifyEmailTwo'
    }),
    async toggleBindPhone() {
      this.showCodeDialog('cellphone')
    },
    async toggleBindEmail() {
      let that = this
      let emailForm = this.$refs.emailForm
      emailForm.validate(async valid => {
        if (valid) {
          let isEmailBinded = await this.isEmailBinded()
          if (isEmailBinded) {
            emailForm.clearValidate()
            this.emailError = '该邮箱已被绑定！'
            return
          }
          this.showCodeDialog('email')
        }
      })
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
    },
    async verifyEmailCode() {
      let { username } = this.userProfile
      let result = await this.userVerifyEmailTwo({
        username: username,
        bind: true,
        isApi: true,
        verifyCode: this.codeDialogDatas.code
      })
      console.log(result)
    },
    async sendCode() {
      switch (this.codeDialogDatas.type) {
        case 'email':
          let result = await this.userVerifyEmailOne({
            email: this.codeDialogDatas.value,
            bind: true
          })
          this.codeDialogDatas.codeSent = true
          this.showMessage('success', '邮件发送成功')
          break
        case 'cellphone':
          break
        default:
          break
      }
    },
    showMessage(type, message) {
      this.$message({
        message,
        type,
        showClose: true
      })
    },
    showCodeDialog(type) {
      let value = this.userBindings[type]
      switch (type) {
        case 'email':
          this.codeDialogDatas = {
            type: type,
            value: value,
            dialogTitle: `邮箱绑定 > ${value}`,
            inputLabel: `邮箱验证码:`,
            code: '',
            codeId: '',
            codeSent: false
          }
          break
        case 'cellphone':
          this.codeDialogDatas = {
            type: type,
            value: value,
            dialogTitle: `手机绑定 > ${value}`,
            inputLabel: `短信验证码:`,
            code: '',
            codeId: '',
            codeSent: false
          }
          break
        default:
          break
      }
      this.isCodeDialogVisible = true
    },
    async isEmailBinded() {
      let email = this.userBindings.email
      let result = await this.userGetByEmail({ email })
      return result ? true : false
    },
    handleClose() {
      this.isCodeDialogVisible = false
      this.codeDialogParams = {}
    }
  }
}
</script>
<style lang="scss">
.account-binding {
  padding: 55px 15px 15px 56px;
  &-form {
    &-item-content {
      width: 180px;
      padding-right: 56px;
    }
    &-item-button {
      color: #1989fa;
      border-color: #1989fa;
    }
    .el-form-item__label {
      padding-right: 56px;
      color: #333;
    }
  }
  &-dialog {
    &-code-button {
      font-size: 16px;
      color: #1989fa;
      border-color: #1989fa;
      padding: 8px 32px;
      border-radius: 34px;
    }
    .el-dialog__header {
      font-size: 16px;
      border-bottom: 1px solid #d1d1d1;
      padding: 10px 25px;
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
}
</style>
