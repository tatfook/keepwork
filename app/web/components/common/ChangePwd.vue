<template>
  <div class="change-pwd" v-loading='loading'>
    <el-form class="change-pwd-form" :rules='pwdRules' ref="resetPwdForm" :model="pwdFormDatas" label-width="130px">
      <el-form-item :label="$t('user.oldPwd')" prop='oldpassword'>
        <el-input v-model="pwdFormDatas.oldpassword" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.newPwd')" prop='newpassword'>
        <el-input v-model="pwdFormDatas.newpassword" size="small"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.reNewPwd')" prop='reNewpassword'>
        <el-input v-model="pwdFormDatas.reNewpassword" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="savePassword" class="change-pwd-form-confirm-button">{{$t('common.Sure')}}</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'ChangePwd',
  props: {
    isChangePwdPaneActive: Boolean
  },
  data() {
    let validatePass2 = (rule, value, callback) => {
      if (value !== this.pwdFormDatas.newpassword) {
        callback(new Error(`${this.$t('user.twoPwdInconsistent')}`))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      pwdFormDatas: {
        oldpassword: '',
        newpassword: '',
        reNewpassword: ''
      },
      pwdRules: {
        oldpassword: [
          {
            required: true,
            message: this.$t('user.oldPwdRequired'),
            trigger: 'blur'
          },
          {
            min: 6,
            message: this.$t('user.pwdMinLen'),
            trigger: 'blur'
          }
        ],
        newpassword: [
          {
            required: true,
            message: this.$t('user.newPwdRequired'),
            trigger: 'blur'
          },
          {
            min: 6,
            message: this.$t('user.pwdMinLen'),
            trigger: 'blur'
          }
        ],
        reNewpassword: [
          {
            required: true,
            message: this.$t('user.reNewPwdRequired'),
            trigger: 'blur'
          },
          {
            min: 6,
            message: this.$t('user.pwdMinLen'),
            trigger: 'blur'
          },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions({
      userChangePwd: 'user/changePwd'
    }),
    showMessage(type, message) {
      this.$message({
        message,
        type,
        showClose: true
      })
    },
    async sendPwdToBack() {
      this.loading = true
      let result = await this.userChangePwd({
        newpassword: this.pwdFormDatas.newpassword,
        oldpassword: this.pwdFormDatas.oldpassword
      })
      if (result === true) {
        this.showMessage('success', this.$t('common.saveSuccess'))
      } else {
        this.showMessage('error', this.$t('user.pwdIncorrect'))
      }
      this.pwdFormDatas = {}
      this.loading = false
    },
    async savePassword() {
      this.$refs.resetPwdForm.validate(valid => {
        if (valid) {
          this.sendPwdToBack()
        }
      })
    },
    resetDatas() {
      this.$refs.resetPwdForm.resetFields()
    },
    handleClose() {
      console.log()
      this.$emit('close')
    }
  },
  watch: {
    isChangePwdPaneActive(value) {
      if (value === false) {
        this.resetDatas()
      }
    }
  }
}
</script>
<style lang="scss">
.change-pwd-form {
  .el-form-item {
    margin-bottom: 30px;
  }
  .el-form-item__label {
    padding-right: 22px;
  }
  .el-form-item.is-required .el-form-item__label:before {
    display: none;
  }
  &-confirm-button {
    width: 120px;
    height: 40px;
  }
}
</style>
