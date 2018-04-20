<template>
  <div class="menu-type">
    <el-button plain type='primary' size='mini' @click='isQAEditorShow = true'>Open Quizz Editor</el-button>
    <quizzDataEditor :isEditorShow='isQAEditorShow' @finishEditing='finishEditing' @cancel='cancel'></quizzDataEditor>
  </div>

</template>
<script>
import quizzDataEditor from "./quizzDataEditor";
export default {
  name: 'QuizzType',
  props: {
    editingKey: String
  },
  data() {
    return {
      isQAEditorShow: false
    }
  },
  methods:{
    cancel(){
      this.isQAEditorShow = false
    },
    finishEditing(resultMenuData){
      this.isQAEditorShow = false
      var tempChangedDataObj = {}
      tempChangedDataObj[this.editingKey] = resultMenuData
      this.$emit('onPropertyChange', tempChangedDataObj)
    }
  },
  components: {
    quizzDataEditor
  }
}
</script>
<style scoped>
.el-button {
  font-size: 16px;
}
</style>
