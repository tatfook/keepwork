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
      title: this.mediaLibrary ? this.$t('skydrive.mediaLibrary') : this.$t('skydrive.skyDrive')
    }
  },
  async mounted() {
  },
  computed: {
  },
  methods: {
    handleClose(event) {
      console.log('00000')
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
