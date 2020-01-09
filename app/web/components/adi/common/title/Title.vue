<template>
  <div class="comp-title">
    <a :target='getTarget' :href="getLink">
      <h1 :class="getClass">{{ properties.name ? properties.name : $t(options.emptyInput) }}</h1>
    </a>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import jss from 'jss'

export default {
  name: 'AdiTitle',
  mixins: [compBaseMixin],
  methods: {},
  computed: {
    getTarget() {
      let properties = this.properties
      let options = this.options
      return properties.target ? properties.target : options.emptyLinkTarget
    },
    getLink() {
      let properties = this.properties
      let options = this.options
      return properties.link ? properties.link : options.emptyLink
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
a {
  text-decoration: none;
  color: unset;

  h1 {
    margin: 0;
    font-size: unset;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
