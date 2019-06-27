<template>
  <el-dialog :visible.sync="showApplyDialog" width="450px" :before-close="closeApplyDialog" custom-class="apply-way-dialog" :lock-scroll="false">
    <h3 class="apply-way-dialog-title">我要报名</h3>
    <p class="apply-way-dialog-buttons">
      <span class="apply-way-dialog-buttons-button" @click="applyWay('http://fks3jraffxdd6act.mikecrm.com/cT0jaMi')">公开组报名</span>
      <span class="apply-way-dialog-buttons-button" @click="applyWay('http://fks3jraffxdd6act.mikecrm.com/YfPlpuu')">学生组报名</span>
    </p>
  </el-dialog>
</template>
<script>
export default {
  name: 'ApplyWayDialog',
  props: {
    showApplyDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeApplyDialog() {
      this.$emit('close')
    },
    applyWay(url) {
      window.open(url)
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .apply-way-dialog {
  box-shadow: none;
  background: url('../../assets/contests/awardExplain.png') no-repeat top center;
  min-height: 330px;
  .el-dialog__header {
  }
  .el-dialog__body {
    padding: 0 40px;
  }
  &-title {
    font-size: 30px;
    color: rgb(210, 72, 11);
    border-bottom: 2px solid rgb(224, 225, 220);
    text-align: center;
    margin: 0 20px;
  }
  &-text {
    font-size: 20px;
  }
  &-buttons {
    display: flex;
    justify-content: center;
    padding-top: 60px;
    &-button {
      padding: 24px;
      background: rgb(0, 65, 149);
      color: #fff;
      margin: 10px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 20px;
    }
  }
}
@media screen and (max-width: 768px) {
  /deep/ .apply-way-dialog {
    width: 80% !important;
    .el-dialog__body {
      padding: 0 10px;
    }
    &-title {
      font-size: 20px;
    }
    &-text {
      font-size: 18px;
    }
    &-buttons {
      display: block;
      padding-top: 20px;
      &-button {
        display: block;
        text-align: center;
      }
    }
  }
}
</style>


