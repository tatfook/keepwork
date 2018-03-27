<template>
    <el-input type='textarea' ref='autosizeTextarea' class="autosize-input-type" :autosize="{ maxRows: maxRows}" resize='none' :placeholder='editingKey' v-model='inputTypeValue' @change='updateValue' @focus='getFocus' @blur='blurEventHandler'></el-input>
</template>
<script>
const blurMaxRows = 2
const focusMaxRows = 20
export default {
  name: 'LinkType',
  props: {
    editingKey: String,
    originValue: String
  },
  data() {
    return {
      maxRows: blurMaxRows
    }
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
      this.maxRows = focusMaxRows
      this.$nextTick(function() {
        this.$refs.autosizeTextarea.resizeTextarea()
      })
    },
    blurEventHandler(){
      this.maxRows = blurMaxRows
      this.$nextTick(function() {
        this.$refs.autosizeTextarea.resizeTextarea()
      })
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
