const uuid = require('uuid/v1')
const { MARKDOWN_CMD } = require('./cmdHelper')

class ModBlock {
  constructor(cmd, lineBegin) {
    this.cmd = cmd || MARKDOWN_CMD
    this.modType = 'Mod' + this.cmd
    this.lineBegin = lineBegin || 1 // line number in editor
    this.md = []
    this.lengthDiff = 0
    this.data = null // data-binding
    this.key = null // data-binding
    this.modKey = null
    this.uuid = uuid()
  }
}
module.exports = ModBlock
