<template>
  <div v-loading='loading' @click.stop="handleDialogClick">
    <el-row class="website-setting-layout" type="flex">
      <el-col :span="18" class="website-setting-layouts">
        用户资料
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'userData',
  data() {
    return {
      loading: false
    }
  }
}
</script>
<style lang='scss'>
</style>
