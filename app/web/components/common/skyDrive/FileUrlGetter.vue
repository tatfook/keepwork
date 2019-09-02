<template>
  <el-button :disabled="isDisabled" class="file-url-getter" :class="{'file-url-getter-button': isApplyButtonType}" :type="type" @click="handleClick">
    <i v-if="operateType == 'copy' && !isApplyButtonType" class="iconfont icon-copy"></i>
    <i v-if="operateType == 'insert' && !isApplyButtonType" class="iconfont icon-insert"></i>
    <span v-if="isApplyButtonType">{{$t('common.apply')}}</span>
  </el-button>
</template>

<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'FileUrlGetter',
  props: {
    isApplyButtonType: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    selectFiles: {
      type: Array,
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
    isSiteMode() {
      return Boolean(_.get(this.activePageInfo, 'sitepath'))
    },
    type() {
      return this.isApplyButtonType ? 'primary' : 'text'
    }
  },
  methods: {
    ...mapActions({
      userUseFileInSite: 'user/useFileInSite',
      userGetFileRawUrl: 'user/getFileRawUrl'
    }),
    async getSiteFileUrl(file) {
      let { sitepath: sitePath } = this.activePageInfo
      let fileId = file.id
      await this.userUseFileInSite({ fileId, sitePath }).catch()
      return this.userSiteFileBySitePathAndFileId({ fileId, sitePath })
    },
    async getFileRawUrl(file) {
      let fileId = file.id
      await this.userGetFileRawUrl({ fileId })
      return this.userRawUrlByFileId({ fileId })
    },
    async handleGetUrl(file) {
      return this.isSiteMode
        ? await this.getSiteFileUrl(file)
        : await this.getFileRawUrl(file)
    },
    async getFileLink(file) {
      let linkPrefix = await this.handleGetUrl(file)
      return `${linkPrefix}#${file.filename ? file.filename : ''}`
    },
    async handleClick() {
      let filesWithUrl = []
      for (let index = 0; index < this.selectFiles.length; index++) {
        const file = this.selectFiles[index];
        filesWithUrl.push({
          ...file,
          url: await this.getFileLink(file)
        })
      }
      if (this.operateType == 'copy') {
        this.handleCopy(filesWithUrl[0].url)
        return
      }
      this.handleInsert(filesWithUrl)
    },
    handleInsert(filesWithUrl) {
      this.$emit('close', filesWithUrl)
    },
    async handleCopy(link) {
      await this.$confirm(link, {
        customClass: 'file-url-getter-messagebox',
        confirmButtonText: this.$t('common.copy'),
        cancelButtonText: this.$t('common.Cancel')
      })
      this.$copyText(link).catch(e => {
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
  color: inherit;
  &:hover {
    color: #3ba4ff;
  }
  &.is-disabled:hover {
    color: #fff;
  }
  &-button {
    padding: 9px 30px;
    font-size: 14px;
    color: #fff;
    &:hover {
      color: #fff;
    }
  }
}
</style>
<style lang="scss">
.file-url-getter {
  &-messagebox {
    word-break: break-all;
  }
}
</style>
