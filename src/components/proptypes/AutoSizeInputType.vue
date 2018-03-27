<template>
    <el-input type='textarea' class="autosize-input-type" :autosize="{ maxRows: 10}" resize='none' :placeholder='editingKey' v-model='inputTypeValue' @change='updateValue' @focus='getFocus'></el-input>
</template>
<script>
export default {
  name: 'LinkType',
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
.autosize-input-type .el-textarea__inner {
  font-size: 16px;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid #e4e7ed;
}
</style>
