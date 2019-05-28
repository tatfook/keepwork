<template>
  <el-select class="link-target-type" v-model='linkTargetValue' :placeholder='$t("field." + editingKey)' @input='updateValue' size='mini' @focus='getFocus'>
    <el-option v-for="targetType in linkTargets" :key='targetType.value' :label='targetType.label' :value='targetType.value'></el-option>
  </el-select>
</template>

<script>
import protypesBaseMixin from './protypes.base.mixin'

export default {
  name: 'LinkTargetType',
  mixins: [protypesBaseMixin],
  props: {
    originValue: String
  },
  mounted() {
    this.linkTargetValue = this.targetVal
  },
  data() {
    let self = this
    return {
      linkTargetValue: '',
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
    targetVal() {
      return this.originValue
        ? this.originValue
        : (this.optionsData && this.optionsData.emptyLinkTarget) || ''
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
    }
  },
  watch: {
    originValue(value) {
      this.linkTargetValue = this.targetVal
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
