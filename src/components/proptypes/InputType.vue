<template>
  <el-input class="input-type" :placeholder="$t('field.' + editingKey)" v-model='inputTypeValue' clearable @change='updateValue' @focus='getFocus'></el-input>
</template>
<script>
import protypesBaseMixin from './protypes.base.mixin'

export default {
  name: 'InputType',
  props: {
    editingKey: String,
    originValue: String
  },
  computed: {
    inputTypeValue: {
      get() {
        return this.originValue
      },
      set() {}
    }
  },
  methods: {
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
