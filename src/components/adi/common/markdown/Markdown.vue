<template>
  <vue-markdown class="markdown-body comp-markdown" :source='properties.data ? properties.data : $t(options.emptyData)' />
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
}
</style>

