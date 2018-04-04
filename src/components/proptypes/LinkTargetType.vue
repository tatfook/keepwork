<template>
  <!-- <el-input class="link-type" :placeholder='editingKey' v-model='inputTypeValue' clearable @change='updateValue' @focus='getFocus'></el-input> -->
  <el-select class="link-target-type" v-model='linkTargetValue' placeholder='请选择' @change='updateValue' size='mini' @focus='getFocus'>
    <el-option v-for="targetType in linkTargets" :key='targetType.value' :label='targetType.label' :value='targetType.value'></el-option>
  </el-select>
</template>
<script>
const LinkTargetOptions = [
  {
    label: '本窗口打开',
    value: '_self'
  },
  {
    label: '新窗口打开',
    value: '_blank'
  }
]
import protypesBaseMixin from './protypes.base.mixin'

export default {
  name: 'LinkTargetType',
  props: {
    editingKey: String,
    originValue: String
  },
  data() {
    return {
      linkTargets: LinkTargetOptions
    }
  },
  computed: {
    linkTargetValue: {
      get() {
        return this.originValue
      },
      set() {}
    }
  },
  methods: {
    updateValue(newVal) {
      this.linkTargetValue = newVal
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
<style lang='scss'>
.link-target-type {
  margin-top: 11px;
  width: 108px;

  .el-input__inner {
    color: #909399;
  }
}
</style>
