<template>
    <div class="menu-type">
        <el-button plain type='primary' size='mini' @click='isGalleryEditorShow = true'>{{$t('editor.openGalleryEditor')}}</el-button>
        <galleryDataEditor :isEditorShow='isGalleryEditorShow' :originalTreeData='originValue' @finishEditing='finishEditing' @cancel='cancel'></galleryDataEditor>
    </div>

</template>
<script>
import galleryDataEditor from './galleryDataEditor.vue'
export default {
  name: 'GalleryType',
  props: {
    editingKey: String,
    originValue: Array
  },
  data() {
    return {
      isGalleryEditorShow: false
    }
  },
  methods: {
    cancel() {
      this.isGalleryEditorShow = false
    },
    finishEditing(resultGalleryData) {
      this.isGalleryEditorShow = false
      var tempChangedDataObj = {}
      tempChangedDataObj[this.editingKey] = resultGalleryData
      this.$emit('onPropertyChange', tempChangedDataObj)
    }
  },
  components: {
    galleryDataEditor
  }
}
</script>
<style scoped>
.el-button {
  font-size: 16px;
}
</style>
