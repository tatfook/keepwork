<template>
  <div class='kp-md-editor'>
    <codemirror ref='mdEditor' :options='options' :value='code' @changes='updateMarkdown' />
  </div>
</template>

<script>
import Parser from '@/lib/mod/parser'
import CmdHelper from '@/lib/mod/parser/cmdHelper'
import BlockHelper from '@/lib/mod/parser/blockHelper'
import { mapGetters, mapActions } from 'vuex'
import { codemirror } from 'vue-codemirror'
import _CodeMirror from 'codemirror'
import Mousetrap from 'mousetrap'
import { gConst } from '@/lib/global'

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
import 'codemirror/addon/selection/active-line.js'

const CodeMirror = window.CodeMirror || _CodeMirror

export default {
  name: 'EditorMarkdown',
  data() {
    return {
      gConst
    }
  },
  components: {
    codemirror
  },
  created() {
    CodeMirror.registerHelper('fold', 'wikiCmdFold', this.wikiCmdFold)
  },
  mounted() {
    this.foldCodes(this.editor)
    this.editor.on('drop', this.onDropFile)
    this.editor.on('paste', this.onPaste)
    this.editor.on('mousedown', this.handleClick)
  },
  watch: {
    activeMod(newActiveMod, oldActiveMod) {
      newActiveMod && this.highlightCodeByMod(newActiveMod)
    },
    cursorPos(newCursor, oldCursor) {
      newCursor &&
        this.$nextTick(() => {
          this.editor.setCursor(CodeMirror.Pos(newCursor.line, newCursor.ch))
        })
    }
  },
  computed: {
    ...mapGetters({
      code: 'code',
      modList: 'modList',
      activeMod: 'activeMod',
      cursorPos: 'cursorPos'
    }),
    options() {
      const save = () => Mousetrap.trigger('mod+s')
      const undo = () => Mousetrap.trigger('mod+z')
      const redo = () => Mousetrap.trigger('mod+y')

      const newTab = cm => {
        if (cm.somethingSelected()) {
          cm.indentSelection('add')
        } else {
          const str = cm.getOption()
            ? '\t'
            : Array(cm.getOption('indentUnit') + 1).join(' ')
          cm.replaceSelection(str, 'end', '+input')
        }
      }
      return {
        mode: 'markdown',
        lineNumbers: true,
        line: true,
        lineWrapping: true,
        tabSize: 2,
        indentWithTabs: false,
        styleActiveLine: true,
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
        undoDepth: 0,
        dragDrop: true,
        allowDropFileTypes: ['jpg', 'jpeg'], // codemirror will automatically parse the dropped file and insert the content into editing area, eg: js, svg, xml...
        extraKeys: {
          'Ctrl-S': save,
          'Cmd-S': save,
          'Ctrl-Z': undo,
          'Cmd-Z': undo,
          'Ctrl-Y': redo,
          'Cmd-Y': redo,
          'Ctrl-Space': 'autocomplete',
          'Cmd-Space': 'autocomplete',
          Tab: newTab
        }
      }
    },
    editor() {
      return this.$refs.mdEditor.codemirror
    },
    activeCursorLine() {
      const cursor = this.editor.getCursor()
      return cursor.sticky ? cursor.line : this.editor.lastLine()
    }
  },
  methods: {
    ...mapActions({
      gitlabUploadFile: 'gitlab/uploadFile',
      userUploadFileToSkyDrive: 'user/uploadFileToSkyDrive',
      setActiveMod: 'setActiveMod'
    }),
    addMod() {
      this.$store.dispatch('setAddingArea', {
        area: gConst.ADDING_AREA_MARKDOWN,
        cursorPosition: this.activeCursorLine
      })
      this.$store.dispatch('setActiveManagePaneComponent', 'ModsList') // TODO: move wintype defination to gConst
    },
    highlightCodeByMod(mod) {
      let lineBegin = mod.lineBegin
      let lineEnd = mod.md.length + lineBegin
      if (mod.modType === 'ModMarkdown' && mod.md[0] === '```') {
        lineEnd -= 2
      }
      this.clearHighlight()
      for (let i = lineBegin - 1; i <= lineEnd; i++) {
        this.editor.addLineClass(i, 'gutter', 'mark-text')
      }
    },
    clearHighlight() {
      let lineCount = this.editor.lineCount()
      while (lineCount--) {
        this.editor.removeLineClass(lineCount, 'gutter', 'mark-text')
      }
    },
    handleClick(codeMirror) {
      this.clearHighlight()
      this.$nextTick(() => {
        let line = codeMirror.getCursor().line
        let mod = Parser.getActiveBlock(this.modList, line)
        if (mod) {
          this.highlightCodeByMod(mod)
          mod.key && this.setActiveMod(mod.key)
        }
      })
    },
    checkInModCode(line) {
      return Parser.getActiveBlock(this.modList, line)
    },
    updateMarkdown(editor, changes) {
      let code = editor.getValue()
      let cursor = editor.getCursor()
      if (code === undefined) return
      if (code === this.code) {
        // update by ADI
        this.foldCodes(editor)
        return
      }

      if (changes.length > 1) {
        return this.$store.dispatch('updateMarkDown', {
          code,
          cursor
        })
      }

      let change = changes[0]
      let mod = Parser.getActiveBlock(this.modList, change.from.line)

      if (!mod) {
        return this.$store.dispatch('updateMarkDown', {
          code,
          cursor
        })
      }
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
        Parser.willAffectModData(mod, removed) ||
        Parser.willAffectModData(mod, text)
      ) {
        // if there are some changes affect the mod data, will try to rebuild all
        return this.$store.dispatch('updateMarkDown', {
          code,
          cursor
        })
      }
      const key = mod.key
      const modType = mod.modType
      this.$store.dispatch('updateMarkDownBlock', {
        code,
        key,
        modType,
        cursor
      })
    },
    foldCodes(cm) {
      for (var l = cm.firstLine(); l <= cm.lastLine(); ++l) {
        // function isOnEdit only check the content of a mod, doesn't include the mod cmd
        // and cm.firstLine() equal to 0, but the line number start with 1,
        // that's why we use l + 2 here to check if it is the cmd line
        // if (!this.activeMod || !BlockHelper.isOnEdit(this.activeMod, l + 2))

        // fold all
        cm.foldCode({ line: l, ch: 0 }, null, 'fold')
      }
    },
    wikiCmdFold(cm, start) {
      let line = cm.getLine(start.line)
      if (!line || !CmdHelper.isCmdLine(line)) return
      let end = start.line + 1
      let lastLineNo = cm.lastLine()
      while (end < lastLineNo) {
        line = cm.getLine(end)
        if (line) {
          if (CmdHelper.isCmdEnd(line)) break
          else if (CmdHelper.isCmdLine(line)) {
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
      this.addNewLine(cursor.line, '---')
      this.editor.setCursor(CodeMirror.Pos(cursor.line + 2, 0))
      this.editor.focus()
    },
    insertLink(txt, url, coords) {
      let replaceStr = ''
      if (txt) {
        replaceStr += '[' + txt + ']'
      } else if (!coords && this.editor.somethingSelected()) {
        replaceStr += '[' + this.editor.getSelection() + ']'
      } else {
        replaceStr += '[]'
      }
      replaceStr += url ? `(${url})` : '()'
      coords
        ? this.editor.replaceRange(replaceStr, coords)
        : this.editor.replaceSelection(replaceStr)
      this.editor.focus()
    },
    insertFile(txt, url, coords) {
      let replaceStr = ''
      if (txt) {
        replaceStr += '![' + txt + ']'
      } else if (!coords && this.editor.somethingSelected()) {
        replaceStr += '![' + this.editor.getSelection() + ']'
      } else {
        replaceStr += '![]'
      }

      replaceStr += url ? `(${url})` : '()'
      coords
        ? this.editor.replaceRange(replaceStr, coords)
        : this.editor.replaceSelection(replaceStr)
      this.editor.focus()
    },
    addNewLine(lineNo, content) {
      // add new line after line {lineNo}
      if (!lineNo) lineNo = this.editor.getCursor().line
      let replaceStr = content ? `${content}\n` : '\n'
      this.editor.replaceRange(
        replaceStr,
        CodeMirror.Pos(lineNo + 1, 0),
        CodeMirror.Pos(lineNo + 1, 0)
      )
      return lineNo + 1
    },
    getEmptyLine(lineNo) {
      var content = this.editor.getLine(lineNo)
      while (content) {
        content = this.editor.getLine(++lineNo)
      }
      if (undefined === content) {
        this.editor.replaceRange('\n', { line: lineNo, ch: 0 })
      }
      return lineNo
    },
    replaceLine(lineNo, content) {
      const originalContent = this.editor.getLine(lineNo)
      const offsetX = originalContent && originalContent.length
      this.editor.replaceRange(
        content,
        CodeMirror.Pos(lineNo, 0),
        CodeMirror.Pos(lineNo, offsetX)
      )
    },
    async uploadFile(file, coords) {
      if (file.size <= this.gConst.GIT_FILE_UPLOAD_MAX_SIZE) {
        // use skyDrive
        let url = await this.userUploadFileToSkyDrive({
          file,
          onProgress(progress) {
            console.log(progress)
          }
        }).catch(err => console.error(err))

        if (!url) {
          this.insertLink(null, '***Upload Failed!***', coords)
        } else if (/image\/\w+/.test(file.type)) {
          this.insertFile(null, url, coords)
        } else {
          this.insertLink(file.name, url, coords)
        }

        // gitlab
        // let fileReader = new FileReader()
        // fileReader.onload = async () => {
        //   const path = await this.gitlabUploadFile({
        //     fileName: file.name,
        //     content: fileReader.result
        //   })
        //   if (!path) {
        //     this.insertLink(null, '***Upload Failed!***', coords)
        //   } else if (/image\/\w+/.test(file.type)) {
        //     this.insertFile(null, path, coords)
        //   } else {
        //     this.insertLink(file.name, path, coords)
        //   }
        // }
        // fileReader.readAsDataURL(file)
      }
    },
    onDropFile(cm, evt) {
      let files = evt.dataTransfer.files
      const coords = cm.coordsChar({ left: evt.x, top: evt.y })
      _.forEach(files, file => {
        this.uploadFile(file, coords)
      })
      return false
    },
    onPaste(cm, evt) {
      if (evt.clipboardData && evt.clipboardData.files.length > 0) {
        let files = evt.clipboardData.files
        _.forEach(files, file => {
          this.uploadFile(file)
        })
      }
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
.mark-text {
  border-right: 4px solid #ffac36;
}
.mark-bg {
  background: #ffe193;
}
</style>

