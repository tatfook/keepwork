<template>
  <div class="menu-type">
    <el-button plain type='primary' size='mini' @click='isMenuEditorShow = true'>打开菜单编辑器</el-button>
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
      console.log('cancel parent')
      this.isMenuEditorShow = false
    },
    finishEditing(resultMenuData){
      this.isMenuEditorShow = false
      console.log(resultMenuData)
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
