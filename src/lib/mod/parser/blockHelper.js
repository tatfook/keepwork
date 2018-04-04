import _ from 'lodash'
import md5 from 'blueimp-md5'
import { mdToJson, jsonToMd } from './mdParser'
const MARKDOWN_CMD = 'Markdown'
const MOD_CMD_BEGIN = '```@'
const MOD_CMD_END = '```'

const blockHelper = {
  buildJson(block) {
    block.data = this.isMarkdownMod(block)
      ? { md: { data: this.mdText(block) } }
      : mdToJson(this.mdText(block))
  },

  buildKey(block) {
    block.key = md5(this.text(block), block.lineBegin)
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
    return block.cmd === MARKDOWN_CMD
  },

  isOnEdit(block, lineNumber) {
    return (
      lineNumber >= this.contentBegin(block) &&
      lineNumber < this.contentBegin(block) + block.md.length
    )
  },

  contentBegin(block) {
    return this.isMarkdownMod(block) ? block.lineBegin : block.lineBegin + 1
  },

  updateJson(block, jsonData) {
    block.data = _.cloneDeep(jsonData)
    this.buildMarkdown(block)
  },

  updateJsonValue(block, key, value) {
    _.set(block, ['data', key], value)
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
    this.buildKey(block)
  },

  textLength(block) {
    return block.md.length + 2
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
    return block.lineBegin + this.textLength(block)
  },

  text(block) {
    return this.lines(block).join('\n')
  },

  mdText(block) {
    return block.md.join('\n')
  }
}

export default blockHelper
