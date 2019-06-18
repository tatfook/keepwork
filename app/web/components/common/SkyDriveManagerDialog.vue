<template>
  <el-dialog v-if='show' :title="this.$t('skydrive.skyDrive')" class="skydrive-manager-dialog" :close-on-click-modal="false" :visible.sync="show" width="960px" :before-close="handleClose" :append-to-body='true'>
    <sky-drive ref='skyDriveManager' :isInsertable="isInsertable" :isApplicable="isApplicable" :isImageShow="isImageShow" :isVideoShow="isVideoShow" :isNoMediaFileShow="isNoMediaFileShow" @close='handleClose'></sky-drive>
  </el-dialog>
</template>

<script>
import SkyDriveManager from './SkyDriveManager'

export default {
  name: 'SkyDriveManagerDialog',
  props: {
    show: Boolean,
    isInsertable: {
      type: Boolean,
      default: false
    },
    isApplicable: {
      type: Boolean,
      default: false
    },
    isImageShow: {
      type: Boolean,
      default: true
    },
    isVideoShow: {
      type: Boolean,
      default: true
    },
    isNoMediaFileShow: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleClose(event) {
      let { uploadingFiles } = this.$refs.skyDriveManager
      let that = this
      let uploadingFileIndex = _.findIndex(uploadingFiles, ['state', 'doing'])
      if (uploadingFileIndex >= 0) {
        this.$confirm(
          this.$t('skydrive.fileUploading'),
          this.$t('editor.closeDialogTitle'),
          {
            confirmButtonText: this.$t('common.Sure'),
            cancelButtonText: this.$t('common.Cancel'),
            type: 'warning'
          }
        )
          .then(() => {
            that.$emit('close', event)
          })
          .catch(() => {})
      } else {
        this.$emit('close', event)
      }
    }
  },
  components: {
    'sky-drive': SkyDriveManager
  }
}
</script>

<style lang="scss">
.skydrive-manager-dialog {
  > .el-dialog {
    border-radius: 10px;
    overflow: hidden;
    .el-dialog__header {
      padding: 32px 36px 0;
      background-color: #e8e8e8;
    }
    .el-dialog__body {
      padding: 0;
    }
    .el-loading-mask {
      left: -35px;
      right: -35px;
    }
  }
}
</style>
