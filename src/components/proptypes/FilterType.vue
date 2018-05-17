<template>
  <div class="filter-type">
    <p>{{$t('editor.matchingRule')}}</p>
    <el-button plain type="info" @click='editorShow'>{{$t('editor.openRegularExpressionEditor')}}</el-button>
    <el-input type='textarea' :autosize="{ minRows:7, maxRows: 14 }" v-model='inputTypeValue' @change='updateValue' @focus='getFocus'></el-input>
    <filterDataEditor :isEditorShow='isEditorShow' :originalTreeData='originValue' @confirm='finishData' @cancel='cancel'></filterDataEditor>
  </div>
</template>

<script>
import filterDataEditor from './filterDataEditor.vue'
export default {
  name: 'PageListType',
  props: {
    editingKey: String,
    originValue: String
  },
  data() {
    return {
      isEditorShow: false
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
    editorShow() {
      this.isEditorShow = true
    },
    cancel() {
      this.isEditorShow = false
    },
    finishData(resultMenuData) {
      this.isEditorShow = false
      var tempChangedDataObj = {}
      tempChangedDataObj[this.editingKey] = resultMenuData
      this.$emit('onPropertyChange', tempChangedDataObj)
    },
    updateValue(newVal) {
      var tempChangedDataObj = {}
      tempChangedDataObj[this.editingKey] = newVal
      this.$emit('onPropertyChange', tempChangedDataObj)
    },
    getFocus() {
      this.$emit('onChangeValue')
    }
  },
  components: {
    filterDataEditor
  }
}
</script>

<style  lang='scss' scoped>
.filter-type {
  .el-button {
    float: right;
    width: 18%;
    height: 80px;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 16px;
    color: black;
    border-radius: 5px;
  }
  .el-textarea {
    float: right;
    margin-right: 10px;
    width: 68%;
  }
}
</style>

<style lang='scss'>
.filter-type {
  .el-dialog--center .el-dialog__body {
    padding: 0 25px 30px 25px;
  }
}
</style>

