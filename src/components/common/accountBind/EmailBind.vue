<template>
  <div class="email-bind">
    <el-form class="account-binding-form account-binding-email" ref='emailForm' :inline="true" :rules="emailBindRules" label-width="140px" :model='emailFormData'>
      <el-form-item label="邮箱绑定:" prop="email">
        <el-input class="account-binding-form-item-content" size='small' v-model="emailFormData.email"></el-input>
        <span class="el-form-item__error" v-show="emailError">{{emailError}}</span>
      </el-form-item>
      <el-form-item>
        <el-button size="small" class="account-binding-form-item-button" @click="toggleBindEmail">绑定</el-button>
      </el-form-item>
    </el-form>
    <CodeVerifyDialog :isCodeDialogVisible='isCodeDialogVisible' :codeDialogDatas='emailCodeDialogDatas' codeType='email' @close='handleClose'></CodeVerifyDialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import CodeVerifyDialog from './CodeVerifyDialog'
const EmailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
export default {
  name: 'EmailBind',
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
      emailBindRules: {
        email: [{ validator: emailValidater, trigger: 'change' }]
      },
      emailFormData: {
        email: '1873070425@qq.com'
      },
      emailCodeDialogDatas: {
        type: '',
        value: ''
      },
      isCodeDialogVisible: false
    }
  },
  methods: {
    ...mapActions({
      userGetByEmail: 'user/getByEmail'
    }),
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
          this.emailCodeDialogDatas = {
            type: 'email',
            value: this.emailFormData.email
          }
          this.isCodeDialogVisible = true
        }
      })
    },
    async isEmailBinded() {
      let email = this.emailFormData.email
      let result = await this.userGetByEmail({ email })
      return result ? true : false
    },
    handleClose(){
      this.isCodeDialogVisible = false
    }
  },
  components: {
    CodeVerifyDialog
  }
}
</script>
