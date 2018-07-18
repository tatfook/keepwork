<template>
  <div class='kp-md-editor'>
    <codemirror ref='mdEditor' :options='options' :value='code' @changes='updateMarkdown' />
  </div>
</template>

<script>
import Parser from '@/lib/mod/parser'
import CmdHelper from '@/lib/mod/parser/cmdHelper'
import BlockHelper from '@/lib/mod/parser/blockHelper'
import formatDate from '@/lib/utils/formatDate'
import waitForMilliSeconds from '@/lib/utils/waitForMilliSeconds'
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
      gConst,
      qiniuUploadSubscriptions: {}
    }
  },
  components: {
    codemirror
  },
  created() {
    CodeMirror.registerHelper('fold', 'wikiCmdFold', this.wikiCmdFold)
  },
  mounted() {
    this.foldAllCodes(this.editor)
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
      activePageInfo: 'activePageInfo',
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
      return cursor.line || this.editor.lastLine()
      // return cursor.sticky ? cursor.line : this.editor.lastLine()
    }
  },
  methods: {
    ...mapActions({
      gitlabUploadFile: 'gitlab/uploadFile',
      userUploadFileAndUseInSite: 'user/uploadFileAndUseInSite',
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
      if (mod.modType === 'ModMarkdown') return
      let lineBegin = mod.lineBegin - 1
      let lineEnd = BlockHelper.endLine(mod) - 1
      this.clearHighlight()
      for (let i = lineBegin; i < lineEnd; i++) {
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
        let mod = Parser.getBlockByCursorLine(this.modList || [], line)
        if (mod) {
          this.highlightCodeByMod(mod)
          let currentActiveModKey = this.activeMod && this.activeMod.key
          if (mod.key !== currentActiveModKey) this.setActiveMod(mod.key)
        }
      })
    },
    checkIfInComposing(change) {
      // see https://codemirror.net/doc/manual.html#selection_origin
      // When it starts with *, it will always replace the previous event (if that had the same origin)
      return (
        change.origin &&
        change.origin[0] === '*' &&
        change.removed &&
        change.removed[0] === ''
      )
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

      if (this.checkIfInComposing(change)) return
      let mod = Parser.getActiveBlock(this.modList, change.from.line + 1)
      if (!mod) {
        return this.$store.dispatch('updateMarkDown', {
          code,
          cursor
        })
      }

      // the new input might create a new cmd
      let text = _.cloneDeep(change.text)
      if (text.length > 0) {
        if (text[0] !== '') text[0] = editor.getLine(change.from.line)
        if (text[text.length - 1] !== '')
          text[text.length - 1] = editor.getLine(change.to.line)
      }
      // the last line of removed code might broke the cmd
      let removed = _.cloneDeep(change.removed)
      if (removed.length > 0) {
        if (removed[0] !== '') removed[0] = editor.getLine(change.from.line)
        if (removed[removed.length - 1] !== '')
          removed[removed.length - 1] = editor.getLine(change.to.line)
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
      let mod = Parser.getBlockByCursorLine(this.modList, this.cursorPos.line)
      let lineBegin = mod && mod.lineBegin - 1
      let lineEnd = mod && mod.lineBegin + mod.md.length
      for (let line = cm.firstLine(); line <= cm.lastLine(); ++line) {
        mod && lineBegin <= line && line <= lineEnd
          ? cm.foldCode({ line: line, ch: 0 }, null, 'unfold')
          : cm.foldCode({ line: line, ch: 0 }, null, 'fold')
      }
    },
    foldAllCodes(cm) {
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

      let cursorLineNo = coords ? coords.line : this.editor.getCursor().line
      let lineContent = this.editor.getLine(cursorLineNo)
      replaceStr += url ? `(${url})` : '()'
      replaceStr = lineContent ? '\n' + replaceStr : replaceStr
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

      let cursorLineNo = coords ? coords.line : this.editor.getCursor().line
      let lineContent = this.editor.getLine(cursorLineNo)
      replaceStr += url ? `(${url})` : '()'
      replaceStr = lineContent ? '\n' + replaceStr : replaceStr
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
      let lineNo = coords ? coords.line : this.editor.getCursor().line
      let originText = this.editor.getLine(lineNo)
      if (originText) {
        this.replaceLine(lineNo, originText + '\n' + this.$t('editor.readFileFromLocal'))
        lineNo++
      } else {
        this.replaceLine(lineNo, this.$t('editor.readFileFromLocal'))
      }
      let filename = `${(formatDate()||'').replace(/\s|\:/g, '_')}-${(Date.now()+'').replace(/\d*(\d{3})$/,'$1')}-${file.name}`

      await this.userUploadFileAndUseInSite({
        file,
        filename,
        sitePath: this.activePageInfo.sitepath,
        onStart: subscirbtion => {
          this.replaceLine(lineNo, this.$t('editor.uploadingToSkyDriveText'))
          this.qiniuUploadSubscriptions[file.name] = subscirbtion
        },
        onProgress: progress => {
          this.replaceLine(lineNo, this.$t('editor.uploadingToSkyDriveText'))
        }
      }).then(async ({file, url}) => {
        this.replaceLine(lineNo, '')
        this.$emit('insertBigfile', {file, url: `${url}#${file.filename}`})
      }).catch(err => {
        console.error(err)
        this.replaceLine(lineNo, '')
        this.insertLink(null, '***Upload Failed!***', coords)
      })
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

