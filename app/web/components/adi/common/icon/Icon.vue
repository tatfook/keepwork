<template>
  <div class='comp-icon'>
    <a :target='target' :href='link'>
      <div class="img">
        <img :src="src" :style="getStyle">
      </div>
    </a>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import jss from 'jss'
import preset from 'jss-preset-default'

jss.setup(preset())

export default {
  name: 'AdiMedia',
  mixins: [compBaseMixin],
  computed: {
    src() {
      return this.properties.src ? this.properties.src : this.options.emptyMedia
    },
    target() {
      return this.properties.target
        ? this.properties.target
        : this.options.emptyLinkTarget
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

<style lang="scss" scoped>
.comp-icon {
  a {
    .img {
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      max-height: 87px;
      min-width: 87px;
      img {
        display: block;
        width: auto;
        max-width: 185px;
        height: auto;
      }
    }
  }
}
</style>
