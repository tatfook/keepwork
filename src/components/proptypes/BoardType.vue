<template>
  <el-button @click="openEditor">编辑</el-button>
</template>
<script>
import protypesBaseMixin from './protypes.base.mixin'

export default {
  name: 'BoardType',
  mixins: [protypesBaseMixin],
  props: {
    editingKey: String,
    originValue: String,
    prop: Object
  },
  data() {
    return {
      inputTypeValue: this.originValue
    }
  },
  methods: {
    openEditor() {
      this.prop.click()
    },
    updateValue(newVal) {
      var tempChangedDataObj = {}
      tempChangedDataObj[this.editingKey] = newVal
      this.$emit('onPropertyChange', tempChangedDataObj)
    },
    getFocus() {
      this.$emit('onChangeValue')
    }
  }
}
</script>
<style>
.input-type .el-input__inner {
  border: none;
  border-bottom: 1px solid #e4e7ed;
  font-size: 16px;
  padding: 18px 0 0;
  border-radius: 0;
}
.input-type .el-input__suffix {
  top: 10px;
}
</style>
