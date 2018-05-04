<template>
  <div class='kp-md-editor'>
    <codemirror ref='mdEditor' :options='options' :value='code' @changes='updateMarkdown' />
  </div>
</template>

<script>
import Parser from '@/lib/mod/parser'
import BlockHelper from '@/lib/mod/parser/blockHelper'
import { mapGetters } from 'vuex'
import { codemirror } from 'vue-codemirror'
import _CodeMirror from 'codemirror'
import Mousetrap from 'mousetrap'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/fold/markdown-fold'
import 'codemirror/addon/lint/json-lint'

const CodeMirror = window.CodeMirror || _CodeMirror

export default {
  name: 'EditorMarkdown',
  components: {
    codemirror
  },
  created() {
    CodeMirror.registerHelper('fold', 'wikiCmdFold', this.wikiCmdFold)
  },
  mounted() {
    this.foldCodes(this.editor)
  },
  computed: {
    ...mapGetters({
      code: 'code',
      modList: 'modList',
      activeMod: 'activeMod'
    }),
    options() {
      let save = () => Mousetrap.trigger('mod+s')
      return {
        mode: 'markdown',
        lineNumbers: true,
        line: true,
        lineWrapping: true,
        foldGutter: true,
        foldOptions: {
          rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.wikiCmdFold),
          clearOnEnter: false
        },
        gutters: [
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter',
          'CodeMirror-lint-markers'
        ],
        matchBrackets: true,
        extraKeys: {
          'Ctrl-S': save,
          'Cmd-S': save,
          'Ctrl-Space': 'autocomplete',
          'Cmd-Space': 'autocomplete'
        }
      }
    },
    editor() {
      return this.$refs.mdEditor.codemirror
    }
  },
  methods: {
    updateMarkdown(editor, changes) {
      let code = editor.getValue()

      if (code === undefined) return
      if (code === this.code) {
        // update by ADI
        this.foldCodes(editor)
        return
      }

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
      const key = mod.key
      const modType = mod.modType
      this.$store.dispatch('updateMarkDownBlock', { code, key, modType })
    },
    foldCodes(cm) {
      for (var l = cm.firstLine(); l <= cm.lastLine(); ++l) {
        // function isOnEdit only check the content of a mod, doesn't include the mod cmd
        // and cm.firstLine() equal to 0, but the line number start with 1,
        // that's why we use l + 2 here to check if it is the cmd line
        if (!this.activeMod || !BlockHelper.isOnEdit(this.activeMod, l + 2))
          cm.foldCode({ line: l, ch: 0 }, null, 'fold')
      }
    },
    wikiCmdFold(cm, start) {
      let line = cm.getLine(start.line)
      if (!line || !line.match(/^```[@\/]/)) return
      let end = start.line + 1
      let lastLineNo = cm.lastLine()
      while (end < lastLineNo) {
        line = cm.getLine(end)
        if (line) {
          if (line.match(/^```$/)) break
          else if (line.match(/^```@/)) {
            end--
            break
          }
        }
        end++
      }
      return {
        from: CodeMirror.Pos(start.line),
        to: CodeMirror.Pos(end, cm.getLine(end).length)
      }
    },
    setFontStyle(style) {
      let wrapper = ''
      if (style === 'bold') wrapper = '**'
      else if (style === 'italic') wrapper = '*'

      if (this.editor.somethingSelected()) {
        let selection = this.editor.getSelection()
        let replaceStr =
          wrapper + selection.replace(/\n/g, wrapper + '\n' + wrapper) + wrapper
        this.editor.replaceSelection(replaceStr)
      }
    },
    insertHeadline(level) {
      let preChar = ''
      while (level > 0) {
        preChar += '#'
        level--
      }
      preChar += ' '

      let cursor = this.editor.getCursor()
      let content = this.editor.getLine(cursor.line)

      let iSpace = 0
      let chrCmp = ''
      for (let i = 0; i < content.length; i++) {
        chrCmp = content.substr(i, 1)
        if (chrCmp == '#') {
          continue
        } else {
          if (chrCmp == ' ') {
            iSpace = i + 1
          }
          break
        }
      }
      this.editor.replaceRange(
        preChar,
        CodeMirror.Pos(cursor.line, 0),
        CodeMirror.Pos(cursor.line, iSpace)
      )
      this.editor.focus()
    },
    insertCode() {
      let selection = this.editor.getSelection()
      let replaceStr = '```\n' + selection + '\n```'
      this.editor.replaceSelection(replaceStr)

      let cursor = this.editor.getCursor()
      this.editor.setCursor(CodeMirror.Pos(cursor.line - 1, cursor.ch))
      this.editor.focus()
    },
    insertLine() {
      let cursor = this.editor.getCursor()
      this.editor.replaceRange(
        '---\n',
        CodeMirror.Pos(cursor.line + 1, 0),
        CodeMirror.Pos(cursor.line + 1, 0)
      )
      this.editor.setCursor(CodeMirror.Pos(cursor.line + 2, 0))
      this.editor.focus()
    },
    insertLink() {
      let replaceStr = ''
      if (this.editor.somethingSelected()) {
        replaceStr += '[' + this.editor.getSelection() + ']'
      } else {
        replaceStr += '[]'
      }
      this.editor.replaceSelection(replaceStr + '(' + ')')
      if (replaceStr == '[]') {
        this.editor.setCursor(
          CodeMirror.Pos(
            this.editor.getCursor().line,
            this.editor.getCursor().ch - 3
          )
        )
      }
      this.editor.focus()
    },
    insertImage(txt, url) {
      let replaceStr = ''
      if (txt) {
        replaceStr += '![' + txt + ']'
      } else if (this.editor.somethingSelected()) {
        replaceStr += '![' + this.editor.getSelection() + ']'
      } else {
        replaceStr += '![]'
      }

      if (url) {
        replaceStr += '(' + url + ')'
      } else {
        replaceStr += '(' + dat + ')'
      }

      this.editor.replaceSelection(replaceStr)
      this.editor.focus()
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
.kp-md-editor .CodeMirror {
  height: 100%;
}
.kp-md-editor .CodeMirror-gutters {
  background-color: transparent;
  border: none;
}
</style>
