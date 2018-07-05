import _ from 'lodash'
import Vue from 'vue'
import md5 from 'blueimp-md5'
import { mdToJson, jsonToMd } from './mdParser/yaml'
import CmdHelper, { MARKDOWN_CMD, MOD_CMD_BEGIN, MOD_CMD_END} from './cmdHelper'
import ModAdaptor from './modAdaptor'

const blockHelper = {
  buildJson(block) {
    if (CmdHelper.isValidCmd(block.cmd)) {
      if (CmdHelper.isOldCmd(block.cmd)) {
        const targetCmd = CmdHelper.targetCmd(block.cmd)
        const data = ModAdaptor.transfer(block.md, block.cmd, targetCmd)
        Vue.set(block, 'data', data)
        this.updateCmd(block, targetCmd)
        this.buildMarkdown(block)
      } else {
        const data = this.isMarkdownMod(block)
          ? { md: { data: this.mdText(block) } }
          : mdToJson(this.mdText(block))
        Vue.set(block, 'data', data)
      }
    } else {
      Vue.set(block, 'data', {})
    }
  },

  buildKey(block) {
    block.key = md5(this.text(block), block.uuid)
    block.modKey = md5(this.text(block))
  },

  buildMarkdown(block) {
    if (!block.data) return
    let newMd = this.isMarkdownMod(block)
      ? block.data.md.data
      : jsonToMd(block.data)
    newMd = newMd.split('\n')
    block.lengthDiff = newMd.length - block.md.length
    block.md = newMd
    this.buildKey(block)
  },

  isMarkdownMod(block) {
    return block && block.cmd === MARKDOWN_CMD
  },

  isOnEdit(block, lineNumber) {
    return (
      lineNumber >= this.contentBegin(block) &&
      lineNumber < this.contentBegin(block) + block.md.length
    )
  },

  isOnCursor(block, beginLine) {
    return CmdHelper.isMarkdownCmd(block.cmd)
      ? beginLine >= block.lineBegin && beginLine < block.lineBegin + block.md.length
      : beginLine >= block.lineBegin && beginLine <= block.lineBegin + block.md.length + 1
  },

  updateCmd(block, cmd) {
    block.cmd = cmd
    block.modType = 'Mod' + block.cmd
  },

  updateJson(block, jsonData) {
    Vue.set(block, 'data', _.cloneDeep(jsonData))
    this.buildMarkdown(block)
  },

  updateJsonValue(block, key, value) {
    Vue.set(block.data, key, value)
    this.buildMarkdown(block)
  },

  updateMarkdown(block, mdLines) {
    block.lengthDiff = mdLines.length - block.md.length
    block.md = mdLines
    this.buildJson(block)
    this.buildKey(block)
  },

  addLine(block, line) {
    block.md.push(line)
  },

  modifyBegin(block, diff) {
    block.lineBegin += diff
  },

  contentBegin(block) {
    return this.isMarkdownMod(block) ? block.lineBegin : block.lineBegin + 1
  },

  textLength(block) {
    return this.lines(block).length
  },

  lines(block) {
    if (block.cmd !== MARKDOWN_CMD) {
      let headLine = MOD_CMD_BEGIN + block.cmd
      let endLine = MOD_CMD_END
      return _.flatten([headLine, block.md, endLine])
    } else {
      return block.md
    }
  },

  endLine(block) {
    return block.lineBegin + this.lines(block).length
  },

  text(block) {
    return this.lines(block).join('\n')
  },

  mdText(block) {
    return block.md.join('\n')
  }
}

export default blockHelper
