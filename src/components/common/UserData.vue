<template>
  <div v-loading='loading' @click.stop="handleDialogClick">
    <el-row class="website-setting-layout" type="flex">
      <el-col :span="18" class="website-setting-layouts">
    用户资料
      </el-col>
      <el-col :span="6" class="website-setting-btns">
        <el-button type="primary" @click="handleSave">{{$t('editor.save')}}</el-button>
        <el-button @click="handleClose">{{$t('editor.cancel')}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash'
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
export default {}
</script>
<style lang='scss'>
</style>
