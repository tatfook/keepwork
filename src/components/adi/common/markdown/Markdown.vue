<template>
  <vue-markdown class="markdown-body comp-markdown" :toc="true" :source='properties.data ? properties.data : $t(options.emptyData)' toc-anchor-link-symbol="" toc-anchor-class="iconfont icon-link_"/>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import compBaseMixin from '../comp.base.mixin'
import 'github-markdown-css/github-markdown.css'

export default {
  name: 'AdiMarkdown',
  mixins: [compBaseMixin],
  components: {
    VueMarkdown
  }
}
</script>

<style lang="scss">
.comp-markdown {
  color: unset;

  p {
    margin: 0;
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

