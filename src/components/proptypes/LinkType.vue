<template>
  <div ref='inputWrapper'>
    <el-input class="link-type" :placeholder='$t("field."+editingKey)' :clearable='!isMediaSrc' v-model='inputTypeValue' @focus='getFocus'>
      <i v-if="isMediaSrc" @click="insertImg" slot="suffix" class="el-input__icon el-icon-picture-outline"></i>
    </el-input>
    <SkyDriveManagerDialog v-if="isMediaSrc" :mediaLibrary='true' :show='isSkyDriveManagerDialogShow' @close='closeSkyDriveManagerDialog' />
  </div>
</template>
<script>
import protypesBaseMixin from './protypes.base.mixin'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'

export default {
  name: 'LinkType',
  props: {
    editingKey: String,
    originValue: String
  },
  data() {
    return {
      lastUpdatedValue: this.originValue,
      inputTypeValue: this.originValue,
      isMediaSrc: this.editingKey==='src',
      isSkyDriveManagerDialogShow: false
    }
  },
  watch: {
    inputTypeValue(newVal) {
      this.updateValue(newVal)
    }
  },
  methods: {
    updateValue(newVal) {
      if (this.lastUpdatedValue === newVal) return
      this.lastUpdatedValue = newVal
      var tempChangedDataObj = {}
      tempChangedDataObj[this.editingKey] = newVal
      this.$emit('onPropertyChange', tempChangedDataObj)
    },
    getFocus() {
      this.updateValue(this.inputTypeValue)
    },
    insertImg() {
      this.openSkyDriveManagerDialog()
    },
    openSkyDriveManagerDialog() {
      this.isSkyDriveManagerDialogShow = true
    },
    closeSkyDriveManagerDialog({ url }) {
      this.isSkyDriveManagerDialogShow = false
      if (!url) return
      this.inputTypeValue = url
    }
  },
  components: {
    SkyDriveManagerDialog
  }
}
</script>
<style>
.link-type .el-input__inner {
  border: none;
  border-bottom: 1px solid #e4e7ed;
  font-size: 16px;
  padding: 18px 0 0;
  border-radius: 0;
}
.link-type .el-input__suffix {
  top: 10px;
}
.link-type .el-icon-picture-outline {
  cursor: pointer;
}
</style>
