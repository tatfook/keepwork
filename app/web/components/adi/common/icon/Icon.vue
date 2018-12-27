<template>
  <div class='comp-icon'>
    <a v-if='isImage'
       :target='target'
       :href='link'>
      <div class="img">
        <img :src="src"
             :style="getStyle">
      </div>
    </a>
    <div v-if='isVideo'
         class="video"
         @click="openPlayDialog">
      <div class="iconfont icon-video5" />
      <video v-if="updateDom"
             :autoplay="autoplay"
             :loop="playloop"
             muted
             :src="src"
             :poster="poster" />
    </div>
    <el-dialog :visible.sync="isOpenVideo">
      <video-player v-if="isOpenVideo"
                    :src='src'
                    :autoplay='autoplay'
                    :playloop='playloop' />
    </el-dialog>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import jss from 'jss'
import preset from 'jss-preset-default'
import Media from '@/components/adi/common/media/media.types'
import videoPlayer from '@/components/common/VideoPlayer'
import { setTimeout } from 'timers'

jss.setup(preset())

export default {
  name: 'AdiMedia',
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
    }
  },
  computed: {
    src() {
      return this.properties.src ? this.properties.src : this.options.emptyMedia
    },
    isImage() {
      return Media.isImage(this.src)
    },
    isVideo() {
      return Media.isVideo(this.src)
    },
    target() {
      return this.properties.target
        ? this.properties.target
        : this.options.target
    },
    link() {
      return this.properties.link ? this.properties.link : this.options.link
    },
    autoplay() {
      return this.properties.autoplay
        ? this.properties.autoplay
        : this.options.autoplay
    },
    playloop() {
      return this.properties.playloop
        ? this.properties.playloop
        : this.options.playloop
    },
    poster() {
      return this.properties.poster
        ? this.properties.poster
        : this.options.poster
    },
    getStyle() {
      return this.generateStyleString({
        width: this.getWebWidth()
      })
    }
  },
  methods: {
    refresh() {
      this.updateDom = false
      setTimeout(() => {
        this.updateDom = true
      }, 0)
    },
    parsePx(value) {
      if (value) {
        return parseInt(value) + 'px!important'
      } else {
        return 'auto!important'
      }
    },
    getValue(propertiesValue, optionsValue) {
      if (propertiesValue) {
        return this.parsePx(propertiesValue)
      } else {
        return this.parsePx(optionsValue)
      }
    },
    getWebWidth() {
      return this.options.img
        ? this.getValue(
            this.properties.webWidth,
            this.options.img.defaultWebWidth
          )
        : '100%!important'
    },
    openPlayDialog() {
      this.isOpenVideo = true
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-icon {
  a {
    .img {
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      min-width: 87px;
      img {
        display: block;
        width: auto;
        height: auto;
        max-width: 185px;
        max-height: 87px;
      }
    }
  }

  .video {
    min-width: 87px;
    width: 100%;
    height: 100%;
    background-color: black;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .icon-video5 {
      font-size: 35px;
      color: #409eff;
      opacity: 0.7;
      position: absolute;
      z-index: 1;
    }

    video {
      max-width: 185px;
      max-height: 87px;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.8;
    }
  }
}
</style>
