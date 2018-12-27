<template>
  <div class='comp-media'>
    <a v-if='isImage' :target='target' :href='link'>
      <div class="img" :class="getImgClass">
        <img :src="src">
      </div>
    </a>
    <div class="video" v-if='isVideo' @click="openPlayDialog">
      <div class="iconfont icon-video5" />
      <video v-if="updateDom && poster" :class="getVideoClass" :src='src' :poster="poster"></video>
      <video v-if="updateDom && !poster" :class="getVideoClass" autoplay loop muted :src='src'></video>
    </div>
    <el-dialog :visible.sync="isOpenVideo">
      <video-player v-if="isOpenVideo" :src='src' :autoplay='autoplay' :playloop='playloop' />
    </el-dialog>
  </div>
</template>

<script>
import Media from './media.types'
import compBaseMixin from '../comp.base.mixin'
import jss from 'jss'
import preset from 'jss-preset-default'
import { setTimeout } from 'timers'
import videoPlayer from '@/components/common/VideoPlayer'

jss.setup(preset())

export default {
  name: 'AdiMedia',
  mixins: [compBaseMixin],
  components: {videoPlayer},
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
    isImage() {
      return Media.isImage(this.src)
    },
    isVideo() {
      return Media.isVideo(this.src)
    },
    src() {
      return this.properties.src ? this.properties.src : this.options.emptyMedia
    },
    target() {
      return this.properties.target
        ? this.properties.target
        : this.options.target
    },
    link() {
      return this.properties.link
        ? this.properties.link
        : this.options.link
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
    getImgClass() {
      let imgClassName = 'comp-media-img'
      let style = {
        [imgClassName]: {
          height: this.getWebHeight(),
          width: this.getWebWidth(),
          'margin-top':
            this.options.space && this.parsePx(this.options.space.webMarginTop),
          'margin-bottom':
            this.options.space &&
            this.parsePx(this.options.space.webMarginBottom),
          'padding-top':
            this.options.space &&
            this.parsePx(this.options.space.webPaddingTop),
          'padding-bottom':
            this.options.space &&
            this.parsePx(this.options.space.webPaddingBottom)
        },
        '@media only screen and (max-width: 767px)': {
          [imgClassName]: {
            height: this.getMobileHeight(),
            width: this.getMobileWidth(),
            'margin-top':
              this.options.space &&
              this.parsePx(this.options.space.mobileMarginTop),
            'margin-bottom':
              this.options.space &&
              this.parsePx(this.options.space.mobileMarginBottom),
            'padding-top':
              this.options.space &&
              this.parsePx(this.options.space.mobilePaddingTop),
            'padding-bottom':
              this.options.space &&
              this.parsePx(this.options.space.mobilePaddingBottom)
          }
        }
      }

      if (this.sheet) {
        this.sheet.detach()
      }

      this.sheet = jss.createStyleSheet(style)
      this.sheet.attach()

      return this.sheet.classes[imgClassName]
    },
    getVideoClass() {
      let imgClassName = 'comp-media-img'
      let style = {
        [imgClassName]: {
          'max-height': this.getWebHeight(),
          'max-width': this.getWebWidth(),
          'margin-top':
            this.options.space && this.parsePx(this.options.space.webMarginTop),
          'margin-bottom':
            this.options.space &&
            this.parsePx(this.options.space.webMarginBottom),
          'padding-top':
            this.options.space &&
            this.parsePx(this.options.space.webPaddingTop),
          'padding-bottom':
            this.options.space &&
            this.parsePx(this.options.space.webPaddingBottom)
        },
        '@media only screen and (max-width: 767px)': {
          [imgClassName]: {
            'max-height': this.getMobileHeight(),
            'max-width': this.getMobileWidth(),
            'margin-top':
              this.options.space &&
              this.parsePx(this.options.space.mobileMarginTop),
            'margin-bottom':
              this.options.space &&
              this.parsePx(this.options.space.mobileMarginBottom),
            'padding-top':
              this.options.space &&
              this.parsePx(this.options.space.mobilePaddingTop),
            'padding-bottom':
              this.options.space &&
              this.parsePx(this.options.space.mobilePaddingBottom)
          }
        }
      }

      if (this.sheet) {
        this.sheet.detach()
      }

      this.sheet = jss.createStyleSheet(style)
      this.sheet.attach()

      return this.sheet.classes[imgClassName]
    },
    auto() {
      return [['auto'], '!important']
    },
    fullWidth() {
      return [['100%'], '!important']
    }
  },
  methods: {
    refresh() {
      this.updateDom = false
      setTimeout(() => {this.updateDom = true}, 0)
    },
    parsePx(value) {
      let returnValue = 'auto'

      if (typeof value == 'number' || typeof value == 'string') {
        if (!isNaN(parseInt(value))) {
          returnValue = parseInt(value) + 'px'
        }
      }

      return [[returnValue], '!important']
    },
    getValue(propertiesValue, optionsValue) {
      if (propertiesValue) {
        return this.parsePx(propertiesValue)
      } else {
        return this.parsePx(optionsValue)
      }
    },
    getWebHeight() {
      if (typeof this.options.img != 'object') {
        return this.auto
      }

      return this.getValue(
        this.properties.webHeight,
        this.options.img.defaultWebHeight
      )
    },
    getWebWidth() {
      if (typeof this.options.img != 'object') {
        return this.fullWidth
      }

      return this.getValue(
        this.properties.webWidth,
        this.options.img.defaultWebWidth
      )
    },
    getMobileHeight() {
      if (typeof this.options.img != 'object') {
        return this.auto
      }

      return this.getValue(
        this.properties.mobileHeight,
        this.options.img.defaultMobileHeight
      )
    },
    getMobileWidth() {
      if (typeof this.options.img != 'object') {
        return this.fullWidth
      }

      return this.getValue(
        this.properties.mobileWidth,
        this.options.img.defaultMobileWidth
      )
    },
    openPlayDialog() {
      this.isOpenVideo = true
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-media {
  width: 100%;
  height: 100%;
  a {
    .img {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;

      img {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        object-fit: cover;
      }
    }
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
      color: #409EFF;
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
