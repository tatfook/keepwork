<template>
  <vue-markdown
    class="markdown-body comp-markdown"
    :toc="true"
    :source='validData'
    toc-anchor-link-symbol=""
    toc-anchor-class="iconfont icon-link_"/>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiMarkdown',
  mixins: [compBaseMixin],
  computed: {
    validData() {
      let isEmpty = !(this.properties.data && this.properties.data.trim())
      if (isEmpty && this.editMode) return this.$t(this.options.emptyData)
      return this.properties.data
    }
  },
  components: {
    VueMarkdown
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

