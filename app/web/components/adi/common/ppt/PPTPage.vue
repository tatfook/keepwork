<template>
  <div class="ppt-page">
    <template v-for="item in showList">
      <transition name="el-fade-in-linear" :key="item.downloadUrl + item.page">
        <video-player v-if="item.type === 'videos' && item.page === currentPage" :autoSize="true"  class="ppt-page-video"  :src="item.downloadUrl"></video-player>
        <img v-else-if="item.type === 'images'" v-show="item.page === currentPage" class="ppt-page-img" :src="item.downloadUrl" :alt="item.filename" />
      </transition>
    </template>
    <el-progress class="ppt-page-percent" :stroke-width="2" :percentage="percent" :show-text="false"></el-progress>
  </div>
</template>

<script>
import videoPlayer from '@/components/common/VideoPlayer'
export default {
  name: 'PPTPage',
  props: {
    showList: {
      type: Array,
      default() {
        return []
      }
    },
    currentPage: {
      type: Number,
      default: 1
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  components: {
    videoPlayer
  }
}
</script>

<style lang="scss" scoped>
.ppt-page {
  height: 100%;
  &-img {
    width: 100%;
    height: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  &-video {
    height: 100%;
    max-height: 100%;
    width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  &-percent {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  /deep/ .video-js {
    width: 100vw;
    height: 100vh;
  }
  /deep/ .vjs-control-bar {
    position: absolute;
    bottom: 0;
  }
}
</style>