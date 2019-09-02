<template>
  <el-dialog v-if='show' :title="this.$t('skydrive.skyDrive')" class="skydrive-manager-dialog" :close-on-click-modal="false" :visible.sync="show" width="960px" :before-close="handleClose" :append-to-body='true'>
    <sky-drive ref='skyDriveManager' :isInsertable="isInsertable" :isApplicable="isApplicable" :isImageShow="isImageShow" :isVideoShow="isVideoShow" :isMultipleSelectMode="isMultipleSelectMode" :isNoMediaFileShow="isNoMediaFileShow" @close='handleClose'></sky-drive>
  </el-dialog>
</template>

<script>
import _ from 'lodash'
import SkyDriveManager from './SkyDriveManager'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'SkyDriveManagerDialog',
  props: {
    show: Boolean,
    isMultipleSelectMode: {
      type: Boolean,
      default: false
    },
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
  computed: {
    ...mapGetters({
      uploadingFiles: 'skydrive/uploadingFiles'
    }),
    stateDoingFiles() {
      return _.filter(this.uploadingFiles, ['state', 'doing']) || []
    }
  },
  methods: {
    ...mapActions({
      removeFromUploadQue: 'skydrive/removeFromUploadQue'
    }),
    handleClose(filesWithUrl) {
      let that = this
      filesWithUrl = _.isFunction(filesWithUrl) ? [] : filesWithUrl
      if (this.stateDoingFiles.length > 0) {
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
            _.map(this.stateDoingFiles, file => this.removeFromUploadQue(file))
            if (this.isMultipleSelectMode)
              return that.$emit('close', filesWithUrl)
            that.$emit('close', filesWithUrl[0])
          })
          .catch(() => {})
      } else {
        if (this.isMultipleSelectMode) return this.$emit('close', filesWithUrl)
        this.$emit('close', filesWithUrl[0])
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
