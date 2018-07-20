<template>
  <div :class="getClass">
    <vue-markdown
      :toc="true"
      :source="validData"
      toc-anchor-link-symbol=""
      toc-anchor-class="iconfont icon-link_"/>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import compBaseMixin from '../comp.base.mixin'
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

      return 'markdown-body ' + 'comp-markdown ' + this.sheet.classes[className]
    },
    validData() {
      let isEmpty = !(this.properties.data && this.properties.data.trim())
      if (isEmpty && this.editMode) return this.$t(this.options.emptyData)
      return this.properties.data
    }
  },
  components: {
    VueMarkdown
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
@import 'github-markdown-css/github-markdown.css';
@import 'highlight.js/styles/github-gist.css';

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

