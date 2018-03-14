<template>
  <div class='kp-md-editor'>
    <codemirror ref='mdEditor' :options='options' :value='code' @changes='updateMarkdown' />
  </div>
</template>

<script>
import Parser from '@/lib/mod/parser'
import { mapGetters } from 'vuex'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
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
      code: 'code',
      modList: 'modList'
    }),
    options() {
      return {
        mode: 'markdown',
        lineNumbers: true,
        line: true
      }
    },
    editor() {
      return this.$refs.mdEditor.editor
    }
  },
  methods: {
    updateMarkdown(editor, changes) {
      let code = editor.getValue()
      if (changes.length > 1)
        return this.$store.dispatch('updateMarkDown', code)

      let change = changes[0]
      let mod = Parser.getActiveBlock(this.modList, change.from.line)

      if (!mod) {
        return this.$store.dispatch('updateMarkDown', code)
      }

      if (
        !Parser.isModMarkdown(mod, change.removed) ||
        !Parser.isModMarkdown(mod, change.text)
      ) {
        return this.$store.dispatch('updateMarkDown', code)
      }

      this.$store.dispatch('updateMarkDownBlock', {
        code,
        mod
      })
    }
  }
}
</script>

<style>

</style>
