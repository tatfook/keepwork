<template>
  <el-dialog v-if='show' :title="title" class="new-website-dialog" :close-on-click-modal="false" :visible.sync="show" width="960px" :before-close="handleClose">
    <SkyDriveManager ref='skyDriveManager' :mediaLibrary='mediaLibrary' @close='handleClose'/>
  </el-dialog>
</template>

<script>
import SkyDriveManager from './SkyDriveManager'

export default {
  name: 'SkyDriveManagerDialog',
  props: {
    show: Boolean,
    mediaLibrary: Boolean
  },
  data() {
    return {
      title: this.mediaLibrary ? this.$t('skydrive.mediaLibrary') : this.$t('skydrive.skyDrive')
    }
  },
  async mounted() {
  },
  computed: {
  },
  methods: {
    handleClose(event) {
      let { uploadingFiles } = this.$refs.skyDriveManager
      let that = this
      let uploadingFileIndex = _.findIndex(that.uploadingFiles, ['state', 'doing'])
      if (uploadingFileIndex >= 0) {
        this.$confirm('还有文件正在上传中，关闭后文件将取消上传，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$emit('close', event)
        }).catch(() => {});
      }else{
        this.$emit('close', event)
      }
    }
  },
  components: {
    SkyDriveManager
  }
}
</script>

<style lang="scss">
</style>
