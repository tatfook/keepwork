<template>
  <div class="comp-img">
    <a v-if='isImage'
       :target='target'
       :href='link'>
      <div>
        <img :src="getSrc" />
      </div>
    </a>
    <div class="video"
         v-if='isVideo'
         @click="openPlayDialog">
      <div class="iconfont icon-video5" />
      <video v-if="updateDom"
             :autoplay="autoplay"
             :loop="playloop"
             muted
             :src="getSrc"
             :poster="poster" />
    </div>
    <el-dialog :visible.sync="isOpenVideo">
      <video-player v-if="isOpenVideo"
                    :src='getSrc'
                    :autoplay='autoplay'
                    :playloop='playloop' />
    </el-dialog>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import Media from '@/components/adi/common/media/media.types'
import videoPlayer from '@/components/common/VideoPlayer'
import { setTimeout } from 'timers'

export default {
  name: 'AdiImg',
  mixins: [compBaseMixin],
  components: {
    videoPlayer
  },
  data() {
    return {
      updateDom: true,
      isOpenVideo: false
    }
  },
  watch: {
    poster() {
      this.refresh()
    },
    playloop() {
      this.refresh()
    },
    autoplay() {
      this.refresh()
    }
  },
  computed: {
    target() {
      return this.properties.target
        ? this.properties.target
        : this.options.target
    },
    link() {
      return this.properties.link ? this.properties.link : this.options.link
    },
    autoplay() {
      if (typeof this.properties.autoplay === 'boolean') {
        return this.properties.autoplay
      } else {
        return this.options.autoplay
      }
    },
    playloop() {
      if (typeof this.properties.playloop === 'boolean') {
        return this.properties.playloop
      } else {
        return this.options.playloop
      }
    },
    poster() {
      return this.properties.poster
        ? this.properties.poster
        : this.options.poster
    },
    isImage() {
      return Media.isImage(this.getSrc)
    },
    isVideo() {
      return Media.isVideo(this.getSrc)
    },
    getSrc() {
      if (!this.properties.src && !this.options.emptyMedia) {
        return ''
      }

      if (!this.properties.src) {
        return this.options.emptyMedia
      }

      return this.properties.src || ''
    }
  },
  methods: {
    refresh() {
      this.updateDom = false
      setTimeout(() => {
        this.updateDom = true
      }, 0)
    },
    openPlayDialog() {
      this.isOpenVideo = true
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-img {
  img {
    width: 100%;
    height: 100%;
  }

  .video {
    width: 100%;
    height: 100%;
    background-color: black;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .icon-video5 {
      font-size: 65px;
      color: #409eff;
      opacity: 0.7;
      position: absolute;
      z-index: 1;
    }

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.8;
    }
  }
}
</style>