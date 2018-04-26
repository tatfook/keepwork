<template>
  <div class="menu-type">
    <el-button plain type='primary' size='mini' @click='isMenuEditorShow = true'>{{$t('editor.openMenuEditor')}}</el-button>
    <treeDataEditor :isEditorShow='isMenuEditorShow' :originalTreeData='originValue' @finishEditing='finishEditing' @cancel='cancel'></treeDataEditor>
  </div>

</template>
<script>
import treeDataEditor from "./treeDataEditor.vue";
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
  methods:{
    cancel(){
      this.isMenuEditorShow = false
    },
    finishEditing(resultMenuData){
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
