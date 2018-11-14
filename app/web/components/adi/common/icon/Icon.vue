<template>
  <div class='comp-icon'>
    <a :target='target' :href='link'>
      <div v-if='isImage' class="img">
        <img :src="src" :style="getStyle">
      </div>
      <div v-else-if='isVideo' class="video">
        <video v-if="updateDom" :src='src' :autoplay="autoplay" :loop="playloop" :poster="poster" controls="controls"></video>
      </div>
    </a>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import jss from 'jss'
import preset from 'jss-preset-default'
import Media from '@/components/adi/common/media/media.types'
import { setTimeout } from 'timers';

jss.setup(preset())

export default {
  name: 'AdiMedia',
  mixins: [compBaseMixin],
  data() {
    return {
      updateDom: true
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
    getStyle() {
      return this.generateStyleString({
        width: this.getWebWidth(),
      })
    }
  },
  methods: {
    refresh() {
      this.updateDom = false
      setTimeout(() => {this.updateDom = true}, 0)
    },
    parsePx(value) {
      if(value) {
        return parseInt(value) + 'px!important'
      } else {
        return 'auto!important'
      }
    },
    getValue(propertiesValue,optionsValue) {
      if (propertiesValue) {
        return this.parsePx(propertiesValue)
      } else {
        return  this.parsePx(optionsValue)
      }
    },
    getWebWidth() {
      return this.options.img ? this.getValue(this.properties.webWidth, this.options.img.defaultWebWidth) : '100%!important'
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
    .video {
      min-width: 87px;
      video {
        width: auto;
        height: auto;
        max-width: 185px;
        max-height: 87px;
        object-fit: cover;
      }
    }
  }
}
</style>
