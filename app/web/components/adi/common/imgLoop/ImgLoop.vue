<template>
  <div class="comp-imgloop">
    <el-carousel :class="getClass" :height="'100%'">
      <el-carousel-item v-for="(item, index) in forImgs" :key="index">
        <a v-if="!item.type || item.type === 'images'" :target="item.target" :href="item.link">
          <div class="imgs" :style="loadImg(item)"></div>
        </a>
        <div class="video" v-if="item.type === 'videos'" @click="openVideo(item)">
          <div class="iconfont icon-video5" />
          <video v-if="updateDom" :src="item.video" autoplay="true" playloop="true" muted="true" :poster="item.poster"></video>
        </div>
      </el-carousel-item>
    </el-carousel>
    <el-dialog :visible.sync="isOpenVideo">
      <video-player v-if="isOpenVideo" :src='curVideo' :autoplay='curAutoPlay' :playloop='curAutoPlay'/>
    </el-dialog>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import { setTimeout } from 'timers'
import jss from 'jss'
import preset from 'jss-preset-default'
import videoPlayer from '@/components/common/VideoPlayer'

export default {
  name: 'AdiImgLoop',
  mixins: [compBaseMixin],
  components: {
    videoPlayer
  },
  data() {
    return {
      updateDom: true,
      isOpenVideo: false,
      curVideo: '',
      curAutoPlay: false,
      curPlayLoop: false
    }
  },
  watch: {
    forImgs() {
      this.refresh()
    }
  },
  methods: {
    refresh() {
      this.updateDom = false
      setTimeout(() => {this.updateDom = true}, 0)
    },
    loadImg(item) {
      if (item && item.img) {
        return this.generateStyleString({
          'background-image': 'url(' + item.img + ')'
        })
      } else {
        if (this.options.emptyGallery && this.options.emptyGallery.img) {
          return this.generateStyleString({
            'background-image': 'url(' + this.options.emptyGallery.img + ')'
          })
        } else {
          return {}
        }
      }
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
    getMobileHeight() {
      if (typeof this.options.img != 'object') {
        return this.auto
      }

      return this.getValue(
        this.properties.mobileHeight,
        this.options.img.defaultMobileHeight
      )
    },
    openVideo(item) {
      this.curVideo = item.video
      this.curAutoPlay = item.autoplay
      this.curPlayLoop = item.playloop

      this.isOpenVideo = true
    }
  },
  computed: {
    forImgs() {
      if (!this.properties.data || this.properties.data && this.properties.data.length === 0) {
        return [
          {
            img: this.options.emptyGallery.img,
            link: this.options.emptyGallery.link,
            target: this.options.emptyGallery.target,
            autoplay: this.options.emptyGallery.autoplay,
            playloop: this.options.emptyGallery.playloop,
            poster: this.options.emptyGallery.poster
          }
        ]
      } else {
        return this.properties.data
      }
    },
    getClass() {
      let className = 'comp-imgLoop'
      let style = {
        [className]: {
          height: this.getWebHeight()
        },
        '@media only screen and (max-width: 767px)': {
          [className]: {
            height: this.getMobileHeight()
          }
        }
      }

      if (this.sheet) {
        this.sheet.detach()
      }

      this.sheet = jss.createStyleSheet(style)
      this.sheet.attach()

      return this.sheet.classes[className]
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-imgloop {
  .imgs {
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: cover;

    video {
      width: 100%;
      height: 100%;
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

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
