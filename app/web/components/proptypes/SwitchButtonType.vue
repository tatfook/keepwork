<template>
  <div>
    {{$t(originValue.desc)}}
    <el-tooltip :content="isToolTip" placement="top">
      <el-switch v-model="inputTypeValue.value" active-color="#13ce66" inactive-color="#ff4949" clearable @input='updateValue' @focus='getFocus'></el-switch>
    </el-tooltip>
  </div>
</template>
<script>
import protypesBaseMixin from './protypes.base.mixin'

export default {
  name: 'SwitchButtonType',
  mixins: [protypesBaseMixin],
  props: {
    originValue: Object
  },
  computed: {
    inputTypeValue: {
      get() {
        return this.originValue
      },
      set() {}
    },
    isToolTip () {
      if (this.inputTypeValue.value){
        return this.$t("tips.clickToHide")
      } else {
        return this.$t("tips.clickToShow")
      }
    },
  },
  methods: {
    updateValue(newVal) {
      let tempChangedDataObj = {
        [this.editingKey]: { desc: this.inputTypeValue.desc, value: newVal }
      }
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
