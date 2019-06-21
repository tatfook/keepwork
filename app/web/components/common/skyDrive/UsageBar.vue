<template>
  <div class="usage-bar">
    {{ $t('skydrive.usage') }}
    <el-progress class="usage-bar-progress" :percentage="info.usedPercentWithUpload || 0" :color="skyDriveUsedColors" :show-text="false" :stroke-width='11'></el-progress>
    {{ info.usedWithUpload | biteToG }}GB / {{ info.total | biteToG }}GB
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'UsageBar',
  data() {
    return {
      skyDriveUsedColors: [
        {
          color: '#3ba4ff',
          percentage: 70
        },
        {
          color: '#f97b00',
          percentage: 90
        },
        {
          color: '#ff1e02',
          percentage: 100
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      uploadingFileSize: 'skydrive/uploadingFileSize',
      userSkyDriveInfo: 'user/skyDriveInfo'
    }),
    info() {
      let { total = 0, used = 0 } = this.userSkyDriveInfo || {}
      let usedWithUpload = used + this.uploadingFileSize
      let usedPercentWithUpload = ((100 * usedWithUpload) / total).toFixed(2)
      return {
        total,
        usedWithUpload,
        usedPercentWithUpload: _.toNumber(
          usedPercentWithUpload < 0
            ? 0
            : usedPercentWithUpload > 100
            ? 100
            : usedPercentWithUpload
        )
      }
    }
  },
  filters: {
    biteToG: (bite = 0) =>
      (bite / (1024 * 1024 * 1024))
        .toFixed(2)
        .toString()
        .replace(/\.*0*$/, '')
  }
}
</script>
<style lang="scss" scoped>
.usage-bar {
  &-progress {
    width: 187px;
    display: inline-block;
    margin-right: 20px;
    .el-progress-bar__outer {
      background-color: #f5f5f5;
    }
  }
}
</style>
