<template>
  <div class="sub-mod-type">
    <el-button plain type='primary' size='mini' @click='intoSubMod'>{{$t('editor.edit')}}</el-button>
  </div>

</template>
<script>
import protypesBaseMixin from './protypes.base.mixin'
export default {
  name: 'SubModType',
  mixins: [protypesBaseMixin],
  methods:{
    intoSubMod() {
      this.$store.dispatch('intoSubMod', this.editingKey)
    }
  }
}
</script>
<style scoped>
.el-button {
  font-size: 16px;
}
</style>
