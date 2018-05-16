<template>
  <el-input type='textarea' ref='autosizeTextarea' class="autosize-input-type" :autosize="{ minRows:7, maxRows: maxRows }" resize='none' :placeholder="$t('field.' + editingKey)" v-model='inputTypeValue' @change='updateValue' @focus='getFocus' @blur='blurEventHandler' @input='inputValue'></el-input>
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
      maxRows: blurMinRows,
      onFocus: false
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
      this.onFocus = true
      this.maxRows = focusMinRows
      this.$nextTick(function() {
        this.$refs.autosizeTextarea.resizeTextarea()
      })
    },
    blurEventHandler() {
      this.maxRows = blurMinRows
      this.onFocus = false
      this.$nextTick(function() {
        this.$refs.autosizeTextarea.resizeTextarea()
      })
    },
    inputValue(newVal) {
      // sometimes input event can be triggered without focus, for example, the grammarly plugin for chrome
      if (!this.onFocus) this.updateValue(newVal)
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
