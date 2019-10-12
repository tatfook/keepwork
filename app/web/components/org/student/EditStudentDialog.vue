<template>
  <el-dialog title="个人信息" :visible.sync="isDialogVisible" width="1018px" custom-class="edit-student-dialog" :before-close="handleClose">
    <div class="edit-student-dialog-sidebar">
      <div class="edit-student-dialog-sidebar-item" :class="{active:activeComp=='StudentBasic'}">基本信息</div>
      <div class="edit-student-dialog-sidebar-item">修改家长手机号</div>
    </div>
    <div class="edit-student-dialog-content">
      <student-basic />
    </div>
  </el-dialog>

</template>
<script>
import StudentBasic from './common/StudentBasic'
export default {
  name: 'EditStudentDialog',
  props: {
    isDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeComp: 'StudentBasic'
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  },
  components: {
    StudentBasic
  }
}
</script>
<style lang="scss" scoped>
/deep/.edit-student-dialog {
  border-radius: 6px;
  overflow: hidden;
  &-sidebar {
    width: 192px;
    padding: 36px 24px;
    background-color: #fff;
    box-sizing: border-box;
    &-item {
      border: 1px solid #d2d2d2;
      height: 42px;
      line-height: 42px;
      text-align: center;
      color: #666;
      border-radius: 4px;
      margin-bottom: 18px;
      cursor: pointer;
      &.active {
        background-color: #409eff;
        color: #fff;
        border-color: #409eff;
      }
    }
  }
  &-content {
    flex: 1;
    margin-left: 15px;
    background-color: #fff;
  }
  .el-dialog__header {
    padding-bottom: 20px;
  }
  .el-dialog__title {
    font-size: 16px;
    line-height: 16px;
    font-weight: bold;
  }
  .el-dialog__body {
    padding: 0;
    display: flex;
    background-color: #cdd4dc;
    padding-top: 15px;
  }
}
</style>
