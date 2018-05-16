<template>
  <el-dialog class="tree-data-dialog" :title="$t('editor.pageListLogic')" :visible.sync="isDialogShow" width="900px" :before-close="handleClose" center>
    <p>{{$t('editor.supportWildcard')}}</p>
    <p>{{$t('editor.supportBooleanCalculation')}}</p>
    <el-input type="textarea" :rows="20" v-model='inputTypeValue' @change='updateValue' @focus='getFocus'></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{$t('el.messagebox.cancel')}}</el-button>
      <el-button type="primary" @click="finishEditingData">{{$t('el.messagebox.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'filterDataEditor',
  props: {
    editingKey: String,
    originValue: String,
    originalTreeData: String,
    isEditorShow: Boolean
  },
  data() {
    return {
      treeData: this.originalTreeData,
      defaultProps: {
        children: 'child',
        label: 'name'
      }
    }
  },
  computed: {
    isDialogShow() {
      return this.isEditorShow
    },
    inputTypeValue: {
      get() {
        return this.originValue
      },
      set() {}
    }
  },
  methods: {
    handleClose() {
      this.$emit('cancel', null)
    },
    finishEditingData() {
      this.handleClose()
      this.$emit('confirm', this.treeData)
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

<style lang='scss'>
</style>
