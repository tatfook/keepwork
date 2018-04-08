<template>
  <vue-markdown class="comp-markdown" :source='properties.data' />
</template>

<script>
import VueMarkdown from 'vue-markdown'
import compBaseMixin from '../comp.base.mixin'

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
  p {
    margin: 0;
  }
}
</style>

