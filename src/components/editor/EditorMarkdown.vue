<template>
  <div class='kp-md-editor'>
    <codemirror ref='mdEditor' :options='options' :value='code' @change='updateMarkdown' />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { codemirror } from 'vue-codemirror-lite'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/javascript-hint.js'

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
    },
    editor() {
      return this.$refs.mdEditor.editor
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
