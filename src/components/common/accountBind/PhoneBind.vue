<template>
  <div class="phone-bind">
    <el-form class="phone-bind-form" ref='phoneForm' :inline="true" :model='phoneFormData' :rules="phoneBindRules" label-width="140px">
      <el-form-item label="手机绑定:" prop="cellphone">
        <el-input class="phone-bind-form-item-content" size='small' v-model="phoneFormData.cellphone" v-if="!isUserBindPhone"></el-input>
        <div class="phone-bind-form-item-content" v-if="isUserBindPhone">{{userPhone}}</div>
      </el-form-item>
      <el-form-item>
        <el-button size="small" class="phone-bind-form-item-button" @click="toggleBindPhone">{{isUserBindPhone ? '解绑':'绑定'}}</el-button>
      </el-form-item>
    </el-form>
    <CodeVerifyDialog :isCodeDialogVisible='isCodeDialogVisible' :codeDialogDatas='phoneCodeDialogDatas' codeType='cellphone' @close='handleClose'></CodeVerifyDialog>
  </div>
</template>
<script>
import CodeVerifyDialog from './CodeVerifyDialog'
import { mapGetters } from 'vuex'
const PhoneReg = /[0-9]{11}/
export default {
  name: 'PhoneBind',
  data() {
    let phoneValidater = (rule, value, callback) => {
      if (!PhoneReg.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      phoneFormData: {
        cellphone: '18965103835'
      },
      phoneCodeDialogDatas: {
        type: '',
        value: '',
        bind: undefined
      },
      phoneBindRules: {
        cellphone: [{ validator: phoneValidater, trigger: 'change' }]
      },
      isCodeDialogVisible: false
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
    async toggleBindPhone() {
      let phoneForm = this.$refs.phoneForm
      if (this.isUserBindPhone) {
        this.phoneCodeDialogDatas = {
          type: 'cellphone',
          value: this.userPhone,
          bind: false
        }
        phoneForm.clearValidate()
        this.isCodeDialogVisible = true
        return
      }
      phoneForm.validate(async valid => {
        if (valid) {
          this.phoneCodeDialogDatas = {
            type: 'cellphone',
            value: this.phoneFormData.cellphone,
            bind: true
          }
          this.isCodeDialogVisible = true
        }
      })
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
.phone-bind {
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