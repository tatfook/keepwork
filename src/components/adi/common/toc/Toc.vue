<template>
  <div>
    <div id="toc"></div>
    <vue-markdown class="toc-source" :watches='["toc"]' :show="show" :source="code" toc-id="toc" :toc="toc" :toc-first-level="1"/>
  </div>
</template>
<script>
import VueMarkdown from 'vue-markdown'
import compBaseMixin from '../comp.base.mixin'
import { mapGetters } from 'vuex'

export default {
  name: 'AdiToc',
  data() {
    return {
      toc: false,
      show: false
    }
  },
  mixins: [compBaseMixin],
  components: {
    VueMarkdown
  },
  computed: {
    ...mapGetters({
      code: 'code'
    })
  },
  methods: {},
  created() {
    let self = this

    setTimeout(() => {
      self.toc = true
      self.show = true

      document.querySelector(".toc-source").remove()
    }, 0)
  }
}
</script>
<style lang="scss" scoped>
</style>
