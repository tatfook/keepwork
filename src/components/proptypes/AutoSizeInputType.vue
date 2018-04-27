<template>
  <el-input type='textarea' ref='autosizeTextarea' class="autosize-input-type" :autosize="{ minRows: 7 }" resize='none' :placeholder='editingKey' v-model='inputTypeValue' @focus='getFocus' @blur='updateValue'></el-input>
</template>
<script>
export default {
  name: 'AutoSizeInputType',
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
    updateValue(evt) {
      const newVal = evt.srcElement.value
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
