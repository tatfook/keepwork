import _ from 'lodash'
import md5 from 'blueimp-md5'
import { mdToJson, jsonToMd } from './mdParser'
const MARKDOWN_CMD = 'Markdown'
const MOD_CMD_BEGIN = '```@'
const MOD_CMD_END = '```'

class ModBlock {
  constructor(cmd, lineBegin) {
    this.cmd = cmd || MARKDOWN_CMD
    this.modType = 'Mod' + this.cmd
    this.lineBegin = lineBegin
    this.md = []
    this.lengthDiff = 0
    this.data = null // data-binding
    this.key = null // data-binding
    this.modKey = null
  }

  buildJson() {
    this.data = this.isMarkdownMod()
      ? { md: { data: this.text() } }
      : mdToJson(this.text())
  }

  buildKey() {
    this.key = md5(this.text(), this.lineBegin)
    this.modKey = md5(this.text())
  }

  isMarkdownMod() {
    return this.cmd === MARKDOWN_CMD
  }

  isOnEdit(lineNumber) {
    return (
      lineNumber >= this.contentBegin() &&
      lineNumber < this.contentBegin() + this.md.length
    )
  }

  contentBegin() {
    return this.isMarkdownMod() ? this.lineBegin : this.lineBegin + 1
  }

  updateJson(jsonData) {
    let newMd = this.isMarkdownMod() ? jsonData.md.data : jsonToMd(jsonData)
    this.lengthDiff = newMd.length - this.md.length
    this.md = newMd.split('\n')
    this.data = _.cloneDeep(jsonData)
    this.buildKey()
  }

  updateJsonValue(key, value) {
    let data = _.cloneDeep(this.data)
    data[key] = value
    this.updateJson(data)
  }

  updateMarkdown(mdLines) {
    this.lengthDiff = mdLines.length - this.md.length
    this.md = mdLines
    this.buildJson()
    this.buildKey()
  }

  addLine(line) {
    this.md.push(line)
  }

  modifyBegin(diff) {
    this.lineBegin += diff
    this.buildKey()
  }

  textLength() {
    return this.md.length + 2
  }

  lines() {
    if (this.cmd !== MARKDOWN_CMD) {
      let headLine = MOD_CMD_BEGIN + this.cmd
      let endLine = MOD_CMD_END
      return _.flatten([headLine, this.md, endLine])
    } else {
      return this.md
    }
  }

  text() {
    return this.lines().join('\n')
  }
}

export default ModBlock
