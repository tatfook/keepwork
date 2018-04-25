<template>
    <div class="menu-type">
        <el-button plain type='primary' size='mini' @click='isMenuEditorShow = true'>打开图片编辑器</el-button>
        <treeDataEditor :isEditorShow='isMenuEditorShow' :originalTreeData='originValue' @finishEditing='finishEditing' @cancel='cancel'></treeDataEditor>
    </div>

</template>
<script>
import treeDataEditor from './treeGalleryDataEditor.vue'
export default {
  name: 'MenuType',
  props: {
    editingKey: String,
    originValue: Array
  },
  data() {
    return {
      isMenuEditorShow: false
    }
  },
  methods: {
    cancel() {
      this.isMenuEditorShow = false
    },
    finishEditing(resultMenuData) {
      this.isMenuEditorShow = false
      var tempChangedDataObj = {}
      tempChangedDataObj[this.editingKey] = resultMenuData
      this.$emit('onPropertyChange', tempChangedDataObj)
    }
  },
  components: {
    treeDataEditor
  }
}
</script>
<style scoped>
.el-button {
  font-size: 16px;
}
</style>
