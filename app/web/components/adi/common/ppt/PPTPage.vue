<template>
  <div class="ppt-page">
    <template v-for="item in showList">
      <transition name="el-fade-in-linear" :key="item.downloadUrl + item.page">
        <video-player v-if="item.type === 'videos'" v-show="item.page === currentPage" :src="item.downloadUrl"></video-player>
        <img v-else-if="item.type === 'images'" v-show="item.page === currentPage" class="ppt-page-img" :src="item.downloadUrl" :alt="item.filename" />
        <!-- <img v-else-if="item.type === 'images'" v-show="item.page === currentPage" class="fullscreen-ppt-img" v-lazy="item.downloadUrl" :alt="item.filename" /> -->
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
      defautl() {
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
  },
  mounted() {
    console.log(this.showList)
  }
}
</script>

<style lang="scss" scoped>
.ppt-page {
  &-img {
    width: 100%;
    height: 100%;
    max-height: 100%;
    object-fit: contain;
    position: absolute;
  }
  &-percent {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
}
</style>