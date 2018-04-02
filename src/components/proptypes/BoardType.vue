<template>
  <el-button plain type='primary' size='mini' @click.native='openEditor'>打开绘图板</el-button>
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
      console.log(this.prop)
      // this.prop.click()
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
<style scoped>
.el-button {
  font-size: 16px;
}
</style>
