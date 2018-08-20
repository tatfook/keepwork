<template>
  <div class="menu-type">
    <el-button plain type='primary' size='mini' @click='isQAEditorShow = true'>{{this.$t('card.openQuizEditor')}}</el-button>
    <quiz-data-editor :isEditorShow='isQAEditorShow' :originalQuizData='originValue' @finishEditing='finishEditing' @cancel='cancel'></quiz-data-editor>
  </div>

</template>
<script>
import quizDataEditor from "./quizDataEditor";
export default {
  name: 'QuizType',
  props: {
    editingKey: String,
    originValue: Array
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
    finishEditing(resultQuizData){

      this.isQAEditorShow = false
      var tempChangedDataObj = {};
      tempChangedDataObj[this.editingKey] = resultQuizData;
      this.$emit('onPropertyChange', tempChangedDataObj);
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
