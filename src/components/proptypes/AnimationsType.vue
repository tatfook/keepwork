<template>
  <div class="menu-type">
    <el-button plain type='primary' @click="openAnimationsDialog">Add Animations</el-button>
    <animationsDataEditor :show='isAnimationsEditorShow' @finish='finish' @cancel='cancel'></animationsDataEditor>
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
    openAnimationsDialog(){
      this.isAnimationsEditorShow = true
    },
    finish(data){
      this.isAnimationsEditorShow = false
      var tmp = {}
      tmp[this.editingKey] = data
      this.$emit('onPropertyChange', tmp)
    }
  },
  components: {
    animationsDataEditor
  }
}
</script>
