<template>
  <div class='comp-icon'>
    <a :target='target' :href='link'>
      <div v-if='isImage' :style="getStyle" class="img">
        <img :src="src">
      </div>
      <!-- <video v-else-if='isVideo' :src='src'></video> -->
      <div class="svg" v-if="isBase64Svg" v-html="svg" :style="svgFill"></div>
    </a>
  </div>
</template>

<script>
import Media from './icon.types'
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
    // isVideo() {
    //   return Media.isVideo(this.src)
    // },
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
    getStyle() {
      return this.generateStyleString({
        width: this.getWebWidth(),
      })
    },
    svgFill() {
      return this.generateStyleString({
        width: this.getWebWidth(),
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

<style lang="scss">
.comp-icon {
  .svg {
    svg {
      width: auto;
      height: auto;
    }
  }
}
</style>
<style lang="scss" scoped>
.comp-icon {
  a {
    .img {
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      height: 87px;
      img {
        display: block;
        width: auto;
        max-width: 185px;
        height: auto;
      }
    }
    .svg {
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      height: 87px;
      svg {
        max-width: 185px;
      }
    }
  }
}
</style>
