<template>
  <el-dialog v-if='show' class="website-setting-dialog" :visible.sync="show" width="760px" :before-close="handleClose">
    <WebsiteSettingLayout @close='handleClose' :sitePath='sitePath'/>
  </el-dialog>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import WebsiteSettingLayout from './WebsiteSettingLayout'

export default {
  name: 'WebsiteSettingDialog',
  props: {
    show: Boolean,
    sitePath: String,
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  },
  components: {
    WebsiteSettingLayout
  }
}
</script>

<style lang='scss'>
.website-setting {
  &-layout-item {
    &.active {
      box-shadow: 0 0 1px blue;
    }
  }
  &-style-item {
    &.active {
      box-shadow: 0 0 1px blue;
    }
  }
}
</style>
