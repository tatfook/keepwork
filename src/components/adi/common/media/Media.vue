<template>
  <div class='comp-media'>
    <a :target='target' :href='link'>
      <div class="img" v-if='isImage' :style="loadImg"></div>
      <video v-else-if='isVideo' :src='src'></video>
      <div class="svg" v-if="isBase64Svg" v-html="svg" :style="svgFill"></div>
    </a>
  </div>
</template>

<script>
import Media from './media.types'
import compBaseMixin from '../comp.base.mixin'
import { Base64 } from 'js-base64'

export default {
  name: 'AdiMedia',
  mixins: [compBaseMixin],
  computed: {
    svg() {
      if (this.isBase64Svg) {
        let base64Svg = this.src.split(',')[1] ? this.src.split(',')[1] : ''

        return Base64.decode(base64Svg)
      }
    },
    isImage() {
      return Media.isImage(this.src)
    },
    isVideo() {
      return Media.isVideo(this.src)
    },
    isBase64Svg() {
      return Media.isBase64Svg(this.src)
    },
    src() {
      return this.properties.src ? this.properties.src : this.options.emptySrc
    },
    target() {
      return this.properties.target
        ? this.properties.target
        : this.options.emptyTarget
    },
    link() {
      return this.properties.link
        ? this.properties.link
        : this.options.emptyLink
    },
    loadImg() {
      return this.generateStyleString({
        'background-image': 'url(' + this.src + ')'
      })
    },
    svgFill() {
      return this.generateStyleString({
        fill: this.options.svgFillColor
      })
    }
  }
}
</script>

<style lang="scss">
.comp-media {
  .svg {
    svg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

<style lang="scss" scoped>
.comp-media {
  width: 100%;
  height: 100%;

  .img {
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: cover;
  }
}
</style>
