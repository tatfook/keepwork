<template>
  <el-button class="file-deleter" type="text" @click="removeFiles" :disabled='selectedFiles.length == 0'>
    <i class="iconfont icon-delete1"></i>
    <span v-show="isTextShow">{{$t('common.remove')}}</span>
  </el-button>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'FileDeleter',
  props: {
    isTextShow: {
      type: Boolean,
      default: true
    },
    selectedFiles: {
      type: Array,
      default: []
    }
  },
  methods: {
    ...mapActions({
      userRemoveFileFromSkyDrive: 'user/removeFileFromSkyDrive'
    }),
    async removeFiles() {
      await this.$confirm(
        '删除文件可能会导致相关网站引用的文件失效，确定要删除吗？',
        this.$t('editor.delNotice'),
        {
          confirmButtonText: this.$t('common.OK'),
          cancelButtonText: this.$t('common.Cancel'),
          type: 'warning'
        }
      )
      this.$emit('changeLoadingState', true)
      await Promise.all(
        this.selectedFiles.map(file =>
          this.userRemoveFileFromSkyDrive({ file }).catch()
        )
      )
      this.$emit('changeLoadingState', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.file-deleter {
  color: inherit;
  padding: 0;
  &.is-disabled {
    color: #c0c4cc;
  }
}
.iconfont {
  margin-right: 4px;
}
</style>
