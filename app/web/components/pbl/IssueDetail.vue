<template>
  <el-dialog v-if="show" :visible.sync="show" :before-close="handleClose" class="issue-detail-dialog">
    <h4 slot="title" class="issue-detail-title">一个新项目/我的项目/果果</h4>
    <div class="issue-detail">
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'IssueDetail',
  props: {
    show: Boolean
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss">
.issue-detail-dialog {
  .el-dialog {
    max-width: 900px;
    .el-dialog__header{
      padding: 0;
      margin: 0;
      .el-dialog__headerbtn{
        top:10px;
      }
    }
    .el-dialog__body {
      padding: 6px 20px;
    }
  }
  .issue-detail-title{
    font-size: 12px;
    background: #f4f5f5;
    margin: 0;
    padding-left: 16px;
    line-height: 40px;
    color: #909399;
  }
  .issue-detail {
  }
}
</style>

