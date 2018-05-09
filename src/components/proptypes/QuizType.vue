<template>
  <div class="menu-type">
    <el-button plain type='primary' size='mini' @click='isQAEditorShow = true'>Open Quiz Editor</el-button>
    <quizDataEditor :isEditorShow='isQAEditorShow' @finishEditing='finishEditing' @cancel='cancel'></quizDataEditor>
  </div>

</template>
<script>
import quizDataEditor from "./quizDataEditor";
export default {
  name: 'QuizType',
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
    quizDataEditor
  }
}
</script>
<style scoped>
.el-button {
  font-size: 16px;
}
</style>
