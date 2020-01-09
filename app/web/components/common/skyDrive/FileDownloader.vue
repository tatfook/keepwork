<template>
  <el-button class="file-downloader" type="text" @click="downloadFiles" :disabled='selectedFiles.length == 0'>
    <i class="iconfont icon-xiazai1"></i>
    <span v-if="isTextShow">下载</span>
  </el-button>
</template>

<script>
export default {
  name: 'FileDownloader',
  props: {
    selectedFiles: {
      type: Array,
      default: [],
    },
    isTextShow: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    downloadFiles() {
      this.selectedFiles.map(file => this.download(file))
    },
    async download(file) {
      let downloadUrl = file.downloadUrl
      if (!downloadUrl) return
      let { filename } = file
      let a = document.createElement('a')
      a.target = '_blank'
      a.style.display = 'none'
      a.href = `${downloadUrl}&attname=${filename}`
      a.download = filename || ''
      document.body.appendChild(a)
      a.click()
    },
  },
}
</script>
<style lang="scss" scoped>
.file-downloader {
  color: inherit;
  padding: 0;
  &.is-disabled {
    color: #c0c4cc;
  }
  &:hover {
    color: #3ba4ff;
  }
}
.iconfont {
  margin-right: 4px;
}
</style>
