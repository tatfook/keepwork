<template>
  <div class="sub-mod-type">
    <el-button plain type='primary' size='mini' @click='addItem'>{{$t('editor.add')}}</el-button>
    <div v-for="(item, index) in cardValue.collection" :key="index">
      <span> {{index + 1}} </span>
      <button @click="editItem(index)"> edit </button>
      <button @click="deleteItem(index)"> delete </button>
    </div>
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
    },
    deleteItem(index) {
      this.$store.dispatch('updateActiveModAttributeList', {
        key: this.editingKey,
        action: 'DELETE',
        index
      })
    },
    editItem(index) {
      this.$store.dispatch('updateActiveModAttributeList', {
        key: this.editingKey,
        action: 'EDIT',
        index
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
