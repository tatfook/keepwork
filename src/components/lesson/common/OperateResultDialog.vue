<template>
  <el-dialog class="operate-result-dialog" :class="{'operate-result-dialog-danger': infoDialogData.type === 'danger'}" :visible.sync="isInfoDialogVisible" width="560px" :before-close="handleClose">
    <i class="iconfont" :class="iconClass"></i>
    <div class="operate-result-dialog-para" :class="{'operate-result-dialog-danger-text': index === 0}" v-for="(para, index) in infoDialogData.paras" :key="index">{{para}}</div>
    <span slot="footer" class="operate-result-dialog-footer">
      <el-button @click="handleClose" v-if="cancelButtonText">{{cancelButtonText}}</el-button>
      <el-button type="primary" @click="handleEnsure">{{continueButtonText || $t('common.Sure')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'OperateResultDialog',
  props: {
    infoDialogData: Object,
    isInfoDialogVisible: Boolean
  },
  computed: {
    continueButtonText() {
      return _.get(this.infoDialogData, 'continueButtonText')
    },
    cancelButtonText() {
      return _.get(this.infoDialogData, 'cancelButtonText')
    },
    iconClass() {
      let iconClassName = ''
      switch (this.infoDialogData.iconType) {
        case 'submit':
          iconClassName = 'icon-submit'
          break
        case 'delete':
          iconClassName = 'icon-delete'
          break
        case 'release':
          iconClassName = 'icon-Release'
          break
        case 'revoca':
          iconClassName = 'icon-recall'
          break
        default:
          break
      }
      return iconClassName
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleEnsure() {
      this.$emit('close', this.infoDialogData.continueFnNameAfterEnsure)
    }
  }
}
</script>

<style lang="scss">
.operate-result-dialog {
  text-align: center;
  .el-dialog {
    max-width: 100%;
  }
  .el-icon-close {
    font-size: 20px;
    color: #cecece;
    font-weight: bold;
  }
  .el-dialog__body {
    font-size: 16px;
    color: #414141;
    padding: 30px 20px 0;
  }
  &-danger {
    &-text {
      color: #f75858;
    }
  }
  .iconfont {
    font-size: 88px;
    color: #cecece;
    line-height: 1;
    margin-bottom: 28px;
    display: inline-block;
  }
  .el-dialog__footer {
    padding: 30px 0;
    text-align: center;
  }
  .el-button {
    width: 103px;
    font-size: 17px;
  }
  .el-button + .el-button {
    margin-left: 30px;
  }
  &-para {
    margin-bottom: 14px;
  }
}
</style>
