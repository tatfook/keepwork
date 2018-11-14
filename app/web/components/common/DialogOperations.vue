<template>
  <div class="dialog-operations">
    <el-button :disabled="isSaveBtnDisabled" type="primary" @click="handleSave">{{$t('editor.save')}}</el-button>
    <el-button @click="handleClose">{{$t('editor.cancel')}}</el-button>
  </div>
</template>
<script>
export default {
  name: 'DialogOperations',
  props: {
    isSaveBtnDisabled: Boolean
  },
  methods: {
    handleSave() {
      this.$emit('save')
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-operations {
  text-align: center;
  -ms-flex-item-align: end;
  align-self: flex-end;
  padding-bottom: 26px;
  .el-button {
    width: 80px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    padding: 0;
    margin-bottom: 20px;
  }
  .el-button + .el-button {
    margin-left: 0;
  }
}
</style>
