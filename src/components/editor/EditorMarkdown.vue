<template>
  <div class='kp-md-editor'>
    <codemirror :options='options' :value='code' @change='updateMarkdown' />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { codemirror } from 'vue-codemirror-lite'
import 'codemirror/mode/markdown/markdown'

export default {
  name: 'EditorMarkdown',
  components: {
    codemirror
  },
  computed: {
    ...mapGetters({
      code: 'code'
    }),
    options() {
      return {
        mode: 'markdown'
      }
    }
  },
  methods: {
    updateMarkdown(code) {
      this.$store.dispatch('updateMarkDown', code)
    }
  }
}
</script>

<style>

</style>
