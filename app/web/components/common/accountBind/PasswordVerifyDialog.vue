<template>
  <div class="label">
    <el-dialog class="password-verify-dialog" v-loading='loading' :visible.sync="isPwdDialogVisible" width="506px" :before-close="handleClose" :append-to-body="true">
      <span slot='title'>{{dialogTitle}}</span>
      <el-form :inline="true" @submit.native.prevent>
        <el-form-item :label='inputLabel'>
          <el-input ref="passwordInput" type="password" v-model="password" size="small" autofocus></el-input>
          <span class="el-form-item__error" v-show="pwdError">{{pwdError}}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="unBoundAccount" :disabled="!password">{{$t('common.Sure')}}</el-button>
        <el-button @click="handleClose">{{$t('common.Cancel')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'PasswordVerifyDialog',
  props: {
    pwdDialogData: Object,
    isPwdDialogVisible: Boolean,
    codeType: String
  },
  computed: {
    dialogTitle() {
      let title = this.$t('user.unbunding') + ' > ' + this.pwdDialogData.value
      return title
    },
    inputLabel() {
      let label = this.$t('user.inputLoginPwd') + ':'
      return label
    }
  },
  data() {
    return {
      pwdError: '',
      password: '',
      loading: false
    }
  },
  methods: {
    ...mapActions({
      userUnbindEmail: 'user/unbindEmail',
      userUnbindCellphone: 'user/unbindCellphone',
      userThreeServiceUnbind: 'user/threeServiceUnbind'
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
      this.pwdError = ''
      this.password = ''
    },
    async unBoundAccount() {
      this.loading = true
      let result = {}
      switch (this.pwdDialogData.type) {
        case 'email':
          result = await this.userUnbindEmail({
            password: this.password,
            email: this.pwdDialogData.value,
            isBind: false
          })
          break
        case 'cellphone':
          result = await this.userUnbindCellphone({
            password: this.password,
            cellphone: this.pwdDialogData.value,
            isBind: false
          })
          break
        case 'threeService':
          result = await this.userThreeServiceUnbind({
            password: this.password,
            id: this.pwdDialogData.serviceId,
            username: this.pwdDialogData.username
          })
          break
        default:
          break
      }
      if (result.status === 'success') {
        this.handleClose()
        this.showMessage(
          'success',
          `${this.$t('user.unbundingSuccess')}`
        )
      } else {
        this.pwdError =  this.$t('user.unBundingFailure') + ',' + this.$t('user.pleaseCheckPwd')
      }
      this.loading = false
    }
  },
  watch: {
    isPwdDialogVisible: function(val) {
      let that = this
      if (val === true) {
        this.$nextTick(() => {
          this.$refs.passwordInput.focus()
        })
      }
    }
  }
}
</script>
<style lang="scss">
.password-verify-dialog {
  .el-form-item__error {
    bottom: 100%;
    top: auto;
    padding: 0 0 4px;
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
    padding: 25px 0 0 18px;
  }
  .el-input {
    width: 305px;
    margin-right: 8px;
  }
  .el-form-item__label {
    padding-right: 16px;
  }
}
</style>
