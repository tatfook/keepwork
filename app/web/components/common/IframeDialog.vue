<template>
    <el-dialog :title="showIframeDialog.title" :visible.sync="showDialog" :before-close="handleClose" class="iframe-dialog">
      <i class="el-icon-error content_icon"></i>
      <span class="content_txt">{{showIframeDialog.message}}</span>
      <span slot="footer">
        <el-button size="small" @click="handleClose()">{{$t('editor.cancel')}}</el-button>
        <el-button size="small" type="primary" @click="confirm()">{{$t('editor.confirm')}}</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'IframeDialog',
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      showIframeDialog: 'showIframeDialog'
    }),
    showDialog() {
      return this.showIframeDialog.dialogShow
    }
  },
  methods: {
    ...mapActions({
      toggleIframeDialog: 'toggleIframeDialog'
    }),
    handleClose() {
      let data = {
        dialogShow: false, 
        title: this.showIframeDialog.title, 
        message: this.showIframeDialog.message, 
        result: false 
      }
      this.toggleIframeDialog(data)
    },
    confirm() {
      let data = {
        dialogShow: false, 
        title: this.showIframeDialog.title, 
        message: this.showIframeDialog.message, 
        result: true
      }
      this.toggleIframeDialog(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.iframe-dialog {

  .content_icon {
    color: #f56c6c;
    font-size: 24px;
  }

  .content_txt {
    padding-left: 12px;
    font-size: 14px;
  }
}
</style>

<style lang="scss">
.iframe-dialog {

  .el-dialog {
    margin-top: 30vh !important; 
    width: 32% !important;

    .el-dialog__body {
      display: flex;
      align-items: center;
      padding-top: 15px;
      padding-bottom: 15px;
    }
  }
}
</style>
