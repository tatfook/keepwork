<template>
  <el-dialog v-if='show' class="website-setting-dialog" :title="title" :visible.sync="show" :before-close="handleClose">
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
  data() {
    return {
      title: `//${location.host}/${this.sitePath}`
    }
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
  &-dialog {
    .el-dialog {
      width: 1000px;
      min-height: 700px;
    }
    .el-dialog__header {
      box-shadow: 0 2px 2px #b5b5b5;
      z-index: 10;
      position: relative;
    }
    .el-dialog__body {
      padding: 0;
      border-top: 15px solid #cdd4dc;
    }
  }
}
</style>
