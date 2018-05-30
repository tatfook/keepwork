<template>
  <div>
    <el-input class="link-type" :placeholder='$t("field."+editingKey)' v-model='inputTypeValue' clearable @change='updateValue' @focus='getFocus'>
      <i v-if="editingKey==='src'" @click="insertImg" slot="suffix" class="el-input__icon el-icon-picture-outline"></i>
    </el-input>
    <SkyDriveManagerDialog v-if="editingKey==='src'" :show='isSkyDriveManagerDialogShow' @close='closeSkyDriveManagerDialog' />
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
      isSkyDriveManagerDialogShow: false
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
      this.updateValue(url)
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
