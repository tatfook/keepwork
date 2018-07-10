<template>
  <div class="phone-bind">
    <el-form class="phone-bind-form" :inline="true" :model='phoneFormData' label-width="140px">
      <el-form-item label="手机绑定:" prop="cellphone">
        <el-input class="phone-bind-form-item-content" size='small' v-model="phoneFormData.cellphone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" class="phone-bind-form-item-button" @click="toggleBindPhone">绑定</el-button>
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