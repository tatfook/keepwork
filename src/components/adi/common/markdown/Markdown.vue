<template>
  <vue-markdown :class="getClass" :toc="true" :source='properties.data ? properties.data : $t(options.emptyData)' toc-anchor-link-symbol="" toc-anchor-class="iconfont icon-link_"/>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import compBaseMixin from '../comp.base.mixin'
import 'github-markdown-css/github-markdown.css'
import { Base64 } from 'js-base64'
import jss from 'jss'
import preset from 'jss-preset-default'

export default {
  name: 'AdiMarkdown',
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

      return this.sheet.classes[className] + 'markdown-body' + 'comp-markdown'
    }
  },
  components: {
    VueMarkdown
  }
}
</script>

<style lang="scss">
.comp-markdown {
  color: unset;
  font-size: unset;

  p {
    word-wrap: break-word;
  }

  .icon-link_:before{
    width: 100px;
    height: 100px;
    font-size: 20px;
    margin-left: -23px;
    opacity: 0;
  }

  .icon-link_:hover:before{
    opacity: 1;
  }

  .icon-link_:hover{
    text-decoration: none;
  }

  h1,h2,h3,h4,h5,h6{
    &:hover{
      .icon-link_:before{
        opacity: 1;
      }
    }
  }
}
</style>

