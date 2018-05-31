<template>
  <el-dialog v-if='show' :title="title" class="new-website-dialog" :close-on-click-modal="false" :visible.sync="show" width="960px" :before-close="handleClose">
    <SkyDriveManager :mediaLibrary='mediaLibrary' @close='handleClose'/>
  </el-dialog>
</template>

<script>
import SkyDriveManager from './SkyDriveManager'

export default {
  name: 'SkyDriveManagerDialog',
  props: {
    show: Boolean,
    mediaLibrary: Boolean
  },
  data() {
    return {
      title: this.mediaLibrary ? '图库' : '网盘'
    }
  },
  async mounted() {
  },
  computed: {
  },
  methods: {
    handleClose(event) {
      this.$emit('close', event)
    }
  },
  components: {
    SkyDriveManager
  }
}
</script>

<style lang="scss">
</style>
