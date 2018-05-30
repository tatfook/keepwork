<template>
  <el-dialog v-if='show' :title="title" class="new-website-dialog" :close-on-click-modal="false" :visible.sync="show" width="960px" :before-close="handleClose">
    <SkyDriveManager @close='handleClose'/>
  </el-dialog>
</template>

<script>
import SkyDriveManager from './SkyDriveManager'

export default {
  name: 'SkyDriveManagerDialog',
  props: {
    show: Boolean
  },
  data() {
    return {
      title: '网盘'
    }
  },
  async mounted() {
  },
  computed: {
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  },
  components: {
    SkyDriveManager
  }
}
</script>

<style lang="scss">
</style>
