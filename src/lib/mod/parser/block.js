import _ from 'lodash'
import Vue from 'vue'
import md5 from 'blueimp-md5'
import { mdToJson, jsonToMd } from './mdParser'
const MARKDOWN_CMD = 'Markdown'

class ModBlock {
  constructor(cmd, lineBegin) {
    this.cmd = cmd || MARKDOWN_CMD
    this.modType = 'Mod' + this.cmd
    this.lineBegin = lineBegin
    this.md = []
    this.lengthDiff = 0
    this.data = null // data-binding
    this.key = null // data-binding
    this.oldKey = null
    this.modKey = null
  }

  buildJson() {
    this.data = this.isMarkdownMod()
      ? { md: { data: this.text() } }
      : mdToJson(this.md)
  }

  buildHash() {
    Vue.set(this, 'key', md5(this.data, this.lineBegin))
    Vue.set(this, 'modKey', md5(this.data))
  }

  isMarkdownMod() {
    return this.cmd === MARKDOWN_CMD
  }

  updateJson(jsonData) {
    let newMd
    if (this.isMarkdownMod()) {
      newMd = jsonData.md.data // hardcode for markdown mod
    } else {
      newMd = jsonToMd(jsonData)
    }
    this.lengthDiff = newMd.length - this.md.length
    this.md = newMd.split('\n')
    this.oldKey = this.key
    Vue.set(this, 'data', jsonData)
    this.buildHash()
  }

  addLine(line) {
    this.md.push(line)
  }

  modifyBegin(diff) {
    this.lineBegin += diff
  }

  textLength() {
    return this.md.length + 2
  }

  lines() {
    if (this.cmd !== MARKDOWN_CMD) {
      let headLine = '```@' + this.cmd
      let endLine = '```'
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
