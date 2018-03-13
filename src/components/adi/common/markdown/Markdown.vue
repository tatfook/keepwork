<template>
  <vue-markdown :source='source.data' />
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
