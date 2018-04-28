<template>
  <el-input type='textarea' ref='autosizeTextarea' class="autosize-input-type" :autosize="{ minRows:7, maxRows: maxRows }" resize='none' :placeholder='editingKey' v-model='inputTypeValue' @change='updateValue' @focus='getFocus' @blur='blurEventHandler'></el-input>
</template>
<script>
const blurMinRows = 7
const focusMinRows = 20

export default {
  name: 'AutoSizeInputType',
  props: {
    editingKey: String,
    originValue: String
  },
  data() {
    return {
      maxRows: blurMinRows
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
      this.maxRows = focusMinRows
      this.$nextTick(function() {
        this.$refs.autosizeTextarea.resizeTextarea()
      })
    },
    blurEventHandler() {
      this.maxRows = blurMinRows
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
