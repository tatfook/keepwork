<template>
  <div class='comp-label'>
    <a :target='properties.target ? properties.target : options.emptyTarget' :href='properties.link ? properties.link : options.emptyLink'>
      <label :class="getClass"> {{properties.text ? properties.text : options.emptyText }} </label>
    </a>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import { Base64 } from 'js-base64'
import jss from 'jss'
import preset from 'jss-preset-default'

export default {
  name: 'AdiLabel',
  mixins: [compBaseMixin],
  computed: {
    getClass() {
      let className = 'comp-space'
      let style = {
        [className]: {
          'margin-top': this.options.space && this.parsePx(this.options.space.webMarginTop),
          'margin-bottom': this.options.space && this.parsePx(this.options.space.webMarginBottom),
          'padding-top': this.options.space && this.parsePx(this.options.space.webPaddingTop),
          'padding-bottom': this.options.space && this.parsePx(this.options.space.webPaddingBottom)
        },
        '@media only screen and (max-width: 767px)': {
          [className]: {
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

      return this.sheet.classes[className]
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

<style lang="scss" scoped>
.comp-label {
  a {
    text-decoration: none;
    color: unset;

    label {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
