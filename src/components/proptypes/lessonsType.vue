<template>
  <div class="menu-type">
    <el-button plain type='primary' size='mini' @click='isLPEditorShow = true'>{{this.$t('editor.openLessonPackageEditor')}}</el-button>
    <lessonsDataEditor :isEditorShow='isLPEditorShow' :originalLessonsData='originValue' @finishEditing='finishEditing' @cancel='cancel'></lessonsDataEditor>
  </div>

</template>
<script>
import lessonsDataEditor from "./lessonsDataEditor";
export default {
  name: 'lessonsType',
  props: {
    editingKey: String,
    originValue: Object
  },
  data() {
    return {
      isLPEditorShow: false
    }
  },
  methods:{
    cancel(){
      this.isLPEditorShow = false
    },
    finishEditing(resultLessonsData){
      this.isLPEditorShow = false
      var tempChangedDataObj = {};
      tempChangedDataObj[this.editingKey] = resultLessonsData;
      this.$emit('onPropertyChange', tempChangedDataObj);
    }
  },
  components: {
    lessonsDataEditor
  }
}
</script>
<style scoped>
.el-button {
  font-size: 16px;
}
</style>
