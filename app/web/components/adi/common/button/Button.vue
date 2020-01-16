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
import _ from 'lodash'
import compBaseMixin from '../comp.base.mixin'
import jss from 'jss'

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
      return properties.name ? properties.name : this.$t(options.emptyInput)
    },
    getLink() {
      let properties = this.properties
      let options = this.options
      return properties.link ? properties.link : options.emptyLink
    },
    getTarget() {
      let properties = this.properties
      let options = this.options
      return properties.target ? properties.target : options.emptyLinkTarget
    },
    hasImg() {
      return this.options.img && this.options.img.src
    },
    backgroundConcealment(){
      if(this.properties.src){
        let style = {
          'background-color': 'transparent!important'
        }
        return style
      }
    },
    buttonStyle() {
      let style = {
        width: this.properties.width && parseInt(this.properties.width) + 'px',
        height: this.properties.height && parseInt(this.properties.height) + 'px',
        color: this.properties.color || '',
        'background-image': 'url(' + (this.properties.src || '') + ')',
        'font-size': this.properties.fontSize && parseInt(this.properties.fontSize) + 'px'
      }
      return this.generateStyleString(_.merge({}, this.options.buttonStyle, style, this.backgroundConcealment))
    },
    buttonImgStyle() {
      return this.generateStyleString({
        width: this.options.img && this.options.img.width,
        height: this.options.img && this.options.img.height,
        'background-image': 'url(' + (this.options.img && this.options.img.src || '') + ')'
      })
    },
    getClassStyle() {
      switch (this.options.elBtn) {
        case 'default':
          return 'el-button el-button--default'
        case 'primary':
          return 'el-button el-button--primary'
        case 'success':
          return 'el-button el-button--success'
        case 'info':
          return 'el-button el-button--info'
        case 'warning':
          return 'el-button el-button--warning'
        case 'danger':
          return 'el-button el-button--danger'
        default:
          return ''
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

      if (!this.sheet) {
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
    background-position: center;
    background-size: cover;
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
