<template>
  <div class="comp-button" :class="getClass">
    <a v-if="!options.clickEvent" :class="getClassStyle" :target='getTarget' :href="getLink" :style="buttonStyle">
        <div v-if="hasImg" class="img" :style="buttonImgStyle"></div>
        {{ getButtonName }}
    </a>
    <a v-if="options.clickEvent" :class="getClassStyle" @click='callback' :style="buttonStyle">
        <div v-if="hasImg" class="img" :style="buttonImgStyle"></div>
        {{ getButtonName }}
    </a>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import { Base64 } from 'js-base64'
import jss from 'jss'
import preset from 'jss-preset-default'

export default {
  name: 'AdiButton',
  mixins: [compBaseMixin],
  methods: {
    callback() {
      this.options.callback()
    }
  },
  computed: {
    getButtonName() {
      let properties = this.properties
      let options = this.options
      return properties.name ? properties.name : this.$t(options.emptyName)
    },
    getLink() {
      let properties = this.properties
      let options = this.options
      return properties.link ? properties.link : options.emptyLink
    },
    getTarget() {
      let properties = this.properties
      let options = this.options
      return properties.target ? properties.target : options.emptyTarget
    },
    hasImg() {
      return true
    },
    buttonStyle() {
      let style = {
        width: this.properties.width && parseInt(this.properties.width) + 'px',
        height: this.properties.height && parseInt(this.properties.height) + 'px',
        color: this.properties.color || '',
        'background-image': 'url(' + this.properties.src || '' + ')',
        'font-size': this.properties.fontSize && parseInt(this.properties.fontSize) + 'px'
      }
      return this.generateStyleString(_.merge({}, style, this.options.buttonStyle))
    },
    buttonImgStyle() {
      return this.generateStyleString({
        width: this.options.img && this.options.img.width,
        height: this.options.img && this.options.img.height,
        'background-image': 'url(' + this.options.img && this.options.img.src || '' + ')'
      })
    },
    getClassStyle() {
      switch (this.options.elBtn) {
        case 'default':
          return 'el-button el-button--default'
          break
        case 'primary':
          return 'el-button el-button--primary'
          break
        case 'success':
          return 'el-button el-button--success'
          break
        case 'info':
          return 'el-button el-button--info'
          break
        case 'warning':
          return 'el-button el-button--warning'
          break
        case 'danger':
          return 'el-button el-button--danger'
          break
        default:
          return ''
          break
      }
    },
    getClass() {
      let className = 'comp-space'
      let style = {
        [className]: {
          'margin-top': this.options.space && this.options.space.webMarginTop + '!important',
          'margin-bottom': this.options.space && this.options.space.webMarginBottom + '!important',
          'padding-top': this.options.space && this.options.space.webPaddingTop + '!important',
          'padding-bottom': this.options.space && this.options.space.webPaddingBottom + '!important'
        },
        '@media only screen and (max-width: 767px)': {
          [className]: {
            'margin-top': this.options.space && this.options.space.mobileMarginTop + '!important',
            'margin-bottom': this.options.space && this.options.space.mobileMarginBottom + '!important',
            'padding-top': this.options.space && this.options.space.mobilePaddingTop + '!important',
            'padding-bottom': this.options.space && this.options.space.mobilePaddingBottom + '!important'
          }
        }
      }

      if(!this.sheet) {
        this.sheet = jss.createStyleSheet(style)
        this.sheet.attach()
      }

      return this.sheet.classes[className]
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-button {
  a {
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
    white-space: nowrap;
    padding: 6px 0px;
    border-radius: 4px;
    touch-action: manipulation;
    user-select: none;
    width: 100%;
    min-height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: unset;
    color: unset;
    background-repeat: no-repeat;
    .img {
      margin-right: 10px;
      background-position: center;
      background-size: cover;
    }
  }
}
</style>
<style lang="scss">
.comp-button {
  .el-button {
    font-size: unset;
  }
}
</style>
