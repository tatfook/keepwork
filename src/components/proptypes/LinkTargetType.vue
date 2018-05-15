<template>
  <!-- <el-input class="link-type" :placeholder='editingKey' v-model='inputTypeValue' clearable @change='updateValue' @focus='getFocus'></el-input> -->
  <el-select class="link-target-type" v-model='linkTargetValue' :placeholder='$t("field." + editingKey)' @change='updateValue' size='mini' @focus='getFocus'>
    <el-option v-for="targetType in linkTargets" :key='targetType.value' :label='targetType.label' :value='targetType.value'></el-option>
  </el-select>
</template>
<script>

import protypesBaseMixin from './protypes.base.mixin'

export default {
  name: 'LinkTargetType',
  props: {
    editingKey: String,
    originValue: String
  },
  data() {
    let self = this

    return {
      linkTargets: [
        {
          label: self.$t('editor.selfWindowOpen'),
          value: '_self'
        },
        {
          label: self.$t('editor.newWindowOpen'),
          value: '_blank'
        }
      ]
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
  width: auto;

  .el-input__inner {
    color: #909399;
  }
}
</style>
