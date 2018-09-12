<template>
  <div class="sub-mod-type">
    <el-button plain type='primary' size='mini' @click='addItem'>{{$t('editor.add')}}</el-button>

  </div>

</template>
<script>
import protypesBaseMixin from './protypes.base.mixin'
export default {
  name: 'SubModType',
  mixins: [protypesBaseMixin],
  methods:{
    addItem() {
      this.$store.dispatch('updateActiveModAttributeList', {
        key: this.editingKey,
        action: 'ADD'
      })
    }
  }
}
</script>
<style scoped>
.el-button {
  font-size: 16px;
}
</style>
