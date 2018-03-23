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
        line: true,
        lineWrapping: true
      }
    },
    editor() {
      return this.$refs.mdEditor.editor
    }
  },
  methods: {
    updateMarkdown(editor, changes) {
      let code = editor.getValue()

      if (code === undefined || code === this.code) return

      if (changes.length > 1)
        return this.$store.dispatch('updateMarkDown', code)

      let change = changes[0]
      let mod = Parser.getActiveBlock(this.modList, change.from.line)

      if (!mod) return this.$store.dispatch('updateMarkDown', code)

      // the new input might create a new cmd
      let text = _.cloneDeep(change.text)
      if (text[0] !== '') text[0] = editor.getLine(change.from.line)
      if (text[text.length - 1] !== '')
        text[text.length - 1] = editor.getLine(change.to.line)

      // the last line of removed code might broke the cmd
      let removed = _.cloneDeep(change.removed)
      if (removed.length > 1) {
        let oldMdLines = this.code.split('\n')
        removed[removed.length - 1] = oldMdLines[change.to.line]
      }

      if (
        !Parser.isModMarkdown(mod, removed) ||
        !Parser.isModMarkdown(mod, text)
      ) {
        // if there are some changes affect the mod data, will try to build all
        return this.$store.dispatch('updateMarkDown', code)
      }

      this.$store.dispatch('updateMarkDownBlock', { code, mod })
    }
  }
}
</script>

<style scoped>
.kp-md-editor {
  flex: 1;
  overflow: auto;
}
.vue-codemirror {
  height: 100%;
}
</style>
<style lang="css">
.CodeMirror {
  height: 100%;
}
.CodeMirror-gutters {
  background-color: transparent;
  border: none;
}
</style>
