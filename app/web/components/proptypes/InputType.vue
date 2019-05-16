<template>
  <el-input class="input-type" :placeholder="$t('field.' + inputPlaceholder())" v-model="inputValue" clearable @input='updateValue' @focus='getFocus'></el-input>
</template>
<script>
import protypesBaseMixin from './protypes.base.mixin'

export default {
  name: 'InputType',
  mixins: [protypesBaseMixin],
  props: {
    originValue: String
  },
  data() {
    return {
      inputValue: ''
    }
  },
  mounted() {
    this.inputValue = this.inputTypeValue
  },
  watch: {
    originValue(value) {
      this.inputValue = value
    }
  },
  computed: {
    inputTypeValue() {
      return this.originValue ? this.originValue : (this.optionsData && this.$t(this.optionsData.emptyInput) || '')
    }
  },
  methods: {
    updateValue(newVal) {
      let tempChangedDataObj = {}
      tempChangedDataObj[this.editingKey] = newVal
      this.$emit('onPropertyChange', tempChangedDataObj)
    },
    getFocus() {
      this.$emit('onChangeValue')
    },
    inputPlaceholder() {
      if (this.optionsData) {
        if (this.optionsData.emptyInputPlaceholder) {
          return this.optionsData.emptyInputPlaceholder
        } else {
          return this.editingKey
        }
      } else {
        return this.editingKey
      }
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
