<template>
  <div class="phone-bind">
    <el-form class="account-binding-form account-binding-phone" :inline="true" :model='phoneFormData' label-width="140px">
      <el-form-item label="手机绑定:" prop="cellphone">
        <el-input class="account-binding-form-item-content" size='small' v-model="phoneFormData.cellphone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" class="account-binding-form-item-button" @click="toggleBindPhone">绑定</el-button>
      </el-form-item>
    </el-form>
    <CodeVerifyDialog :isCodeDialogVisible='isCodeDialogVisible' :codeDialogDatas='phoneCodeDialogDatas' codeType='cellphone' @close='handleClose'></CodeVerifyDialog>
  </div>
</template>
<script>
import CodeVerifyDialog from './CodeVerifyDialog'
export default {
  name: 'PhoneBind',
  data() {
    return {
      phoneFormData: {
        cellphone: ''
      },
      phoneCodeDialogDatas: {
        type: '',
        value: ''
      },
      isCodeDialogVisible: false
    }
  },
  methods: {
    async toggleBindPhone() {
      this.phoneCodeDialogDatas = {
        type: 'cellphone',
        value: this.phoneFormData.cellphone
      }
      this.isCodeDialogVisible = true
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
