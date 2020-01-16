<template>
  <div class='comp-label'>
    <a :target='properties.target ? properties.target : options.emptyLinkTarget' :href='properties.link ? properties.link : options.emptyLink'>
      <label :class="getClass"> {{properties.text ? properties.text : options.emptyText }} </label>
    </a>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import jss from 'jss'

export default {
  name: 'AdiLabel',
  mixins: [compBaseMixin],
  computed: {
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
