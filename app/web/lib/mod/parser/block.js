import uuid from '@/lib/utils/uuid'
import { MARKDOWN_CMD } from './cmdHelper'

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

export default ModBlock
