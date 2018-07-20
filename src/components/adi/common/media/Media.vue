<template>
  <div class='comp-media'>
    <a :target='target' :href='link'>
      <div :class="getImgClass" v-if='isImage'>
        <img :src="src">
      </div>
      <video v-else-if='isVideo' :src='src'></video>
      <div class="svg" v-if="isBase64Svg" v-html="svg" :style="svgFill"></div>
    </a>
  </div>
</template>

<script>
import Media from './media.types'
import compBaseMixin from '../comp.base.mixin'
import { Base64 } from 'js-base64'
import jss from 'jss'
import preset from 'jss-preset-default'

jss.setup(preset())

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
    getImgClass() {
      let imgClassName = 'comp-media-img'
      let style = {
        [imgClassName]: {
          'height': this.parsePx(this.options.img && this.options.img.defaultWebHeight),
          'width': this.parsePx(this.properties.webWidth) || this.parsePx(this.options.img && this.options.img.defaultWebWidth),
          'margin-top': this.options.space && this.parsePx(this.options.space.webMarginTop),
          'margin-bottom': this.options.space && this.parsePx(this.options.space.webMarginBottom),
          'padding-top': this.options.space && this.parsePx(this.options.space.webPaddingTop),
          'padding-bottom': this.options.space && this.parsePx(this.options.space.webPaddingBottom)
        },
        '@media only screen and (max-width: 767px)': {
          [imgClassName]: {
            'height': this.parsePx(this.options.img && this.options.img.defaultMobileHeight),
            'width': this.parsePx(this.properties.webWidth) || this.parsePx(this.options.img && this.options.img.defaultMobileWidth),
            'margin-top': this.options.space && this.parsePx(this.options.space.mobileMarginTop),
            'margin-bottom': this.options.space && this.parsePx(this.options.space.mobileMarginBottom),
            'padding-top': this.options.space && this.parsePx(this.options.space.mobilePaddingTop),
            'padding-bottom': this.options.space && this.parsePx(this.options.space.mobilePaddingBottom)
          }
        }
      }

      if(!this.sheet) {
        this.sheet = jss.createStyleSheet(style)
        this.sheet.attach()
      }

      return 'img ' + this.sheet.classes[imgClassName]
    },
    svgFill() {
      return this.generateStyleString({
        fill: this.options.svgFillColor
      })
    }
  },
  methods: {
    parsePx(value) {
      if(value) {
        return parseInt(value) + 'px!important'
      } else {
        return 'auto!important'
      }
    },
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
}
</style>
