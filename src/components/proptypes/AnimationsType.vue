<template>
  <div class="menu-type">
    <el-button plain type='primary' size='mini' @click='isAnimationsEditorShow = true'>Add Animations</el-button>
    <animationsDataEditor :isEditorShow='isAnimationsEditorShow'  @finishEditing='finishEditing' @cancel='cancel'></animationsDataEditor>
  </div>
</template>
<script>
import animationsDataEditor from "./animationsDataEditor";
export default {
  name: 'AnimationsType',
  props: {
    editingKey: String
  },
  data() {
    return {
      isAnimationsEditorShow: false
    }
  },
  methods:{
    cancel(){
      this.isAnimationsEditorShow = false
    },
    finishEditing(resultMenuData){
      this.isAnimationsEditorShow = false
      var tempChangedDataObj = {}
      tempChangedDataObj[this.editingKey] = resultMenuData
      this.$emit('onPropertyChange', tempChangedDataObj)
    }
  },
  components: {
    animationsDataEditor
  }
}
</script>
<style scoped>
.el-button {
  font-size: 16px;
}
</style>
