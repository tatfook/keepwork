<template>
  <div :class="getClass">
    <vue-markdown :toc="true" :source="validData" :postrender="postrender" toc-anchor-link-symbol="" toc-anchor-class="iconfont icon-link_" />
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import compBaseMixin from '../comp.base.mixin'
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
          'margin-top':
            this.options.space &&
            this.options.space.webMarginTop + '!important',
          'margin-bottom':
            this.options.space &&
            this.options.space.webMarginBottom + '!important',
          'padding-top':
            this.options.space &&
            this.options.space.webPaddingTop + '!important',
          'padding-bottom':
            this.options.space &&
            this.options.space.webPaddingBottom + '!important'
        },
        '@media only screen and (max-width: 767px)': {
          [className]: {
            'margin-top':
              this.options.space &&
              this.options.space.mobileMarginTop + '!important',
            'margin-bottom':
              this.options.space &&
              this.options.space.mobileMarginBottom + '!important',
            'padding-top':
              this.options.space &&
              this.options.space.mobilePaddingTop + '!important',
            'padding-bottom':
              this.options.space &&
              this.options.space.mobilePaddingBottom + '!important'
          }
        }
      }

      if (!this.sheet) {
        this.sheet = jss.createStyleSheet(style)
        this.sheet.attach()
      }

      return 'markdown-body comp-markdown ' + this.sheet.classes[className]
    },
    validData() {
      let isEmpty = !(this.properties.data && this.properties.data.trim())
      if (isEmpty && this.options.emptyAutoSizeInput)
        return this.$t(this.options.emptyAutoSizeInput)
      return this.properties.data
    }
  },
  methods: {
    stripScripts(htmlData) {
      var div = document.createElement('div')
      div.innerHTML = htmlData
      var scripts = div.getElementsByTagName('script')
      var i = scripts.length
      while (i--) {
        scripts[i].parentNode.removeChild(scripts[i])
      }
      return div.innerHTML
    },
    postrender(htmlData) {
      if (!this.options.enableScript) htmlData = this.stripScripts(htmlData)
      return htmlData
    }
  },
  components: {
    VueMarkdown
  }
}
</script>

<style lang="scss">
@import '~github-markdown-css/github-markdown.css';
@import '~highlight.js/styles/atom-one-light.css';
@import '~katex/dist/katex.min.css';

.comp-markdown {
  color: unset;
  font-size: unset;
  strong {
    font-weight: bolder;
  }
  p {
    word-wrap: break-word;
    font-size: 14px;
    margin-top: 8px;
    margin-bottom: 8px;
  }
  code {
    font-size: 14px;
  }

  .icon-link_:before {
    width: 100px;
    height: 100px;
    font-size: 20px;
    margin-left: -23px;
    opacity: 0;
  }

  .icon-link_:hover:before {
    opacity: 1;
  }

  .icon-link_:hover {
    text-decoration: none;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    &:hover {
      .icon-link_:before {
        opacity: 1;
      }
    }
  }
}
@media print {
  .comp-markdown {
    font-size: 14px;
    font-family: '宋体';
    p {
      font-size: 14px;
      margin: 0;
      padding: 8px 0;
    }
    pre {
      line-height: 1.2;
      & > code {
        font-size: 12px;
        color: inherit;
        font-weight: normal;
      }
    }
    code {
      color: #bb3825;
      font-weight: bold;
      font-family: '宋体';
      background-color: transparent;
    }
    li + li {
      margin-top: 0;
    }
    blockquote {
      margin-bottom: 0;
      padding: 0 1em;
    }
    .icon-link_ {
      display: none;
    }
  }
}
</style>

