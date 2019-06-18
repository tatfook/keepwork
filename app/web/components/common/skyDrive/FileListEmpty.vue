<template>
  <div class="file-list-empty">
    <img src="@/assets/img/media_library_empty.png">
    <div class="file-list-empty-tip">{{ $t('skydrive.nothingHere') }}</div>
    <file-uploader :uploadText="uploadText" :isDropable="false" :viewType="viewType" :uploadType="uploadType"></file-uploader>
  </div>
</template>
<script>
import FileUploader from './FileUploader'
export default {
  name: 'FileListEmpty',
  props: {
    uploadType: String,
    uploadText: String,
    viewType: {
      validator: value => {
        return ['table', 'thumb'].indexOf(value) !== -1
      }
    }
  },
  components: {
    FileUploader
  }
}
</script>
<style lang="scss" scoped>
.file-list-empty {
  text-align: center;
  padding-top: 60px;
  &-tip {
    margin: 32px auto;
  }
}
</style>
