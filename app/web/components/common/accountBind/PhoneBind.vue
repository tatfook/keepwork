<template>
  <div class="phone-bind">
    <el-form class="phone-bind-form" ref='phoneForm' :inline="true" :model='phoneFormData' :rules="phoneBindRules" label-width="140px">
      <el-form-item prop="cellphone">
        <span slot="label">{{$t('user.phoneBind')}}</span>
        <el-input class="phone-bind-form-item-content" size='small' v-model="phoneFormData.cellphone" v-if="!isUserBindPhone"></el-input>
        <span class="el-form-item__error" v-show="phoneError">{{phoneError}}</span>
        <div class="phone-bind-form-item-content" v-if="isUserBindPhone">{{userPhone}}</div>
        <span class="el-form-item__error" v-show="phoneError">{{phoneError}}</span>
      </el-form-item>
      <el-form-item>
        <el-button size="small" class="phone-bind-form-item-button" :class="{'phone-bind-form-item-button-unbund':isUserBindPhone}" @click="toggleBindPhone">{{isUserBindPhone ? $t('user.unbunding') : $t('user.binding')}}</el-button>
      </el-form-item>
    </el-form>
    <code-verify-dialog :isCodeDialogVisible='isCodeDialogVisible' :codeDialogDatas='phoneCodeDialogDatas' codeType='cellphone' @close='handleClose'></code-verify-dialog>
    <password-verify-dialog :isPwdDialogVisible='isPwdDialogVisible' :pwdDialogData='pwdDialogData' @close='handlePwdDialogClose'></password-verify-dialog>
  </div>
</template>
<script>
import CodeVerifyDialog from './CodeVerifyDialog'
import { mapActions, mapGetters } from 'vuex'
import PasswordVerifyDialog from './PasswordVerifyDialog'
const PhoneReg = /[0-9]{11}/
export default {
  name: 'PhoneBind',
  data() {
    let phoneValidater = (rule, value, callback) => {
      this.phoneError = ''
      if (value == '') {
        return
      }
      if (!PhoneReg.test(value)) {
        callback(new Error(this.$t('user.wrongNumberFormat')))
      } else {
        callback()
      }
    }
    return {
      phoneFormData: {
        cellphone: ''
      },
      phoneCodeDialogDatas: {
        type: '',
        value: '',
        bind: undefined
      },
      phoneBindRules: {
        cellphone: [{ validator: phoneValidater, trigger: 'change' }]
      },
      isCodeDialogVisible: false,
      pwdDialogData: {
        type: '',
        value: ''
      },
      isPwdDialogVisible: false,
      phoneError: ''
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile'
    }),
    userPhone() {
      let { cellphone } = this.userProfile
      return cellphone
    },
    isUserBindPhone() {
      if (this.userPhone) {
        this.phoneFormData = {}
        return true
      }
      return false
    }
  },
  methods: {
    ...mapActions({
      userGetByCellphone: 'user/getByCellphone'
    }),
    async toggleBindPhone() {
      let phoneForm = this.$refs.phoneForm
      if (this.isUserBindPhone) {
        this.pwdDialogData = {
          type: 'cellphone',
          value: this.userPhone
        }
        phoneForm.clearValidate()
        this.isPwdDialogVisible = true
        return
      }
      if (this.phoneFormData.cellphone == '') {
        this.phoneError = this.$t('user.wrongNumberFormat')
        return
      }
      phoneForm.validate(async valid => {
        if (valid) {
          let isCellphoneBinded = await this.isCellphoneBInded()
          if (isCellphoneBinded) {
            phoneForm.clearValidate()
            this.phoneError = this.$t('user.cellphoneHasBeenBoundToOtherAccounts')
            return
          }
          this.phoneCodeDialogDatas = {
            type: 'cellphone',
            value: this.phoneFormData.cellphone,
            bind: true
          }
          this.isCodeDialogVisible = true
        }
      })
    },
    async isCellphoneBInded() {
      let cellphone = this.phoneFormData.cellphone
      let result = await this.userGetByCellphone({ cellphone })
      return result
    },
    handleClose() {
      this.isCodeDialogVisible = false
    },
    handlePwdDialogClose() {
      this.isPwdDialogVisible = false
    }
  },
  components: {
    CodeVerifyDialog,
    PasswordVerifyDialog
  }
}
</script>
<style lang="scss">
.phone-bind {
  &-form {
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
      padding-right: 56px;
      color: #333;
    }
  }
}
</style>
