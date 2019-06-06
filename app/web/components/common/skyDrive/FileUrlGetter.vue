<template>
  <el-button :disabled="isDisabled" class="file-url-getter" type="text" @click="handleClick">
    <i v-if="operateType == 'copy'" class="iconfont icon-copy"></i>
    <i v-else class="iconfont icon-insert"></i>
  </el-button>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'FileUrlGetter',
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    },
    selectFile: {
      type: Object,
      required: true
    },
    operateType: {
      validator: value => {
        return ['copy', 'insert'].indexOf(value) !== -1
      }
    }
  },
  computed: {
    ...mapGetters({
      activePageInfo: 'activePageInfo',
      userRawUrlByFileId: 'user/rawUrlByFileId',
      userSiteFileBySitePathAndFileId: 'user/siteFileBySitePathAndFileId'
    }),
    isEditorPage() {
      return _.get(this.$route, 'name') === 'Editor'
    }
  },
  methods: {
    ...mapActions({
      userUseFileInSite: 'user/useFileInSite',
      userGetFileRawUrl: 'user/getFileRawUrl'
    }),
    async getSiteFileUrl() {
      let { sitepath: sitePath } = this.activePageInfo
      let fileId = this.selectFile.id
      await this.userUseFileInSite({ fileId, sitePath }).catch()
      return this.userSiteFileBySitePathAndFileId({ fileId, sitePath })
    },
    async getFileRawUrl() {
      let fileId = this.selectFile.id
      await this.userGetFileRawUrl({ fileId })
      return this.userRawUrlByFileId({ fileId })
    },
    async handleGetUrl() {
      return this.isEditorPage
        ? await this.getSiteFileUrl()
        : await this.getFileRawUrl()
    },
    async handleClick() {
      let file = this.selectFile
      let linkPrefix = await this.handleGetUrl()
      let link = `${linkPrefix}#${file.filename ? file.filename : ''}`
      if (this.operateType == 'copy') {
        this.handleCopy(link)
        return
      }
      this.handleInsert(link)
    },
    handleInsert(link) {
      this.$emit('close', {
        file: this.selectFile,
        url: link
      })
    },
    async handleCopy(link) {
      await this.$confirm(link, {
        customClass: 'file-url-getter-messagebox',
        confirmButtonText: this.$t('common.copy'),
        cancelButtonText: this.$t('common.Cancel')
      })
      this.$copyText(link).catch(e => {
        console.error(e)
        this.$message({
          showClose: true,
          message: this.$t('editor.copyFail'),
          type: 'error'
        })
      })
      this.$message({
        showClose: true,
        message: this.$t('editor.copySuccess'),
        type: 'success'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.file-url-getter {
  padding: 0;
  color: #606266;
  &-messagebox {
    word-break: break-all;
  }
}
</style>
