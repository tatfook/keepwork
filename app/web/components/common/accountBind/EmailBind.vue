<template>
  <div class="email-bind">
    <el-form class="email-bind-form" ref='emailForm' :inline="true" :rules="emailBindRules" label-width="100px" :model='emailFormData'>
      <el-form-item prop="email">
        <span slot="label">{{$t('user.emailBind')}}</span>
        <span class="icon-wrap"><i class="iconfont icon-bangdingyouxiang"></i></span>
        <el-input class="email-bind-form-item-content" size='small' v-model="emailFormData.email" v-if="!isUserBindEmail"></el-input>
        <span class="el-form-item__error" v-show="emailError">{{emailError}}</span>
        <div class="email-bind-form-item-content" v-if="isUserBindEmail">{{userEmail}}</div>
        <span class="el-form-item__error" v-show="emailError">{{emailError}}</span>
      </el-form-item>
      <el-form-item>
        <el-button size="small" class="email-bind-form-item-button" :class="{'phone-bind-form-item-button-unbund':isUserBindEmail}" @click="toggleBindEmail">
          {{isUserBindEmail ? $t('user.unbunding') : $t('user.binding')}}
        </el-button>
      </el-form-item>
    </el-form>
    <code-verify-dialog :isCodeDialogVisible='isCodeDialogVisible' :codeDialogDatas='emailCodeDialogDatas' codeType='email' @close='handleClose'></code-verify-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import CodeVerifyDialog from './CodeVerifyDialog'
import { keepwork } from '@/api'
const EmailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/

export default {
  name: 'EmailBind',
  data() {
    let emailValidater = (rule, value, callback) => {
      this.emailError = ''
      if (value == '') {
        return
      }
      if (!EmailReg.test(value)) {
        callback(new Error(this.$t('user.wrongEmailFormat')))
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
      isCodeDialogVisible: false,
      emailError: ''
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
      let newestUserInfo = await keepwork.user.getProfile().catch(e => {
        window.location.reload()
      })
      if (
        newestUserInfo.username !== this.userProfile.username ||
        !newestUserInfo
      ) {
        window.location.reload()
      }
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
      if (this.emailFormData.email == '') {
        this.emailError = this.$t('user.wrongEmailFormat')
        return
      }
      emailForm.validate(async valid => {
        if (valid) {
          let isEmailBinded = await this.isEmailBinded()
          if (isEmailBinded) {
            emailForm.clearValidate()
            this.emailError = this.$t('user.emailHasBeenBoundToOtherAccounts')
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
      return result
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
    height: 46px;
    line-height: 46px;
    display: flex;
    margin-bottom: 22px;
    padding-top: 8px;
    &-item-content {
      width: 180px;
      padding-right: 56px;
    }
    &-item-button {
      color: #1989fa;
      border-color: #1989fa;
      &-unbund {
        color: #333;
        border-color: #bcbcbc;
      }
    }
    .el-form-item__label {
      padding-right: 26px;
      color: #333;
    }
    .el-form-item__content {
      display: inline-flex;
      align-items: center;
    }
    .el-form-item {
      display: inline-flex;
      align-items: center;
      vertical-align: center !important;
    }
    .iconfont {
      font-size: 36px;
      margin-right: 26px;
    }
  }
}
</style>
