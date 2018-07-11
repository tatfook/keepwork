<template>
  <div class="email-bind">
    <el-form class="email-bind-form" ref='emailForm' :inline="true" :rules="emailBindRules" label-width="140px" :model='emailFormData'>
      <el-form-item label="邮箱绑定:" prop="email">
        <el-input class="email-bind-form-item-content" size='small' v-model="emailFormData.email" v-if="!isUserBindEmail"></el-input>
        <div class="email-bind-form-item-content" v-if="isUserBindEmail">{{userEmail}}</div>
        <span class="el-form-item__error" v-show="emailError">{{emailError}}</span>
      </el-form-item>
      <el-form-item>
        <el-button size="small" class="email-bind-form-item-button" @click="toggleBindEmail">
          {{isUserBindEmail ? '解绑':'绑定'}}
        </el-button>
      </el-form-item>
    </el-form>
    <CodeVerifyDialog :isCodeDialogVisible='isCodeDialogVisible' :codeDialogDatas='emailCodeDialogDatas' codeType='email' @close='handleClose'></CodeVerifyDialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
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
        email: ''
      },
      emailCodeDialogDatas: {
        type: '',
        value: '',
        bind: undefined
      },
      isCodeDialogVisible: false
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile'
    }),
    userEmail() {
      let { email } = this.userProfile
      return email
    },
    isUserBindEmail() {
      if (this.userEmail) {
        this.emailFormData = {}
        return true
      }
      return false
    }
  },
  methods: {
    ...mapActions({
      userGetByEmail: 'user/getByEmail'
    }),
    async toggleBindEmail() {
      let emailForm = this.$refs.emailForm
      if (this.isUserBindEmail) {
        this.emailCodeDialogDatas = {
          type: 'email',
          value: this.userEmail,
          bind: false
        }
        emailForm.clearValidate()
        this.isCodeDialogVisible = true
        return
      }
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
            value: this.emailFormData.email,
            bind: true
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
    handleClose() {
      this.isCodeDialogVisible = false
    }
  },
  components: {
    CodeVerifyDialog
  }
}
</script>
<style lang="scss">
.email-bind {
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
}
</style>
