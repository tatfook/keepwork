import _ from 'lodash'
const diffpatcher = require('jsondiffpatch')

export default {
  truncate(undoManager) {
    while (undoManager.stack.length > undoManager.maxLength) {
      undoManager.stack.shift()
    }
  },
  init(undoManager, initialItem) {
    undoManager.current = _.cloneDeep(initialItem)
    this.clear(undoManager)
  },
  clear(undoManager) {
    undoManager.stack = []
    undoManager.position = -1
  },
  save(undoManager, item) {
    if (undoManager.position >= undoManager.maxLength) {
      this.truncate(undoManager)
    }
    undoManager.position = Math.min(
      undoManager.position,
      undoManager.stack.length - 1
    )

    undoManager.stack = undoManager.stack.slice(0, undoManager.position + 1)
    const delta = diffpatcher.diff(undoManager.current, item)
    undoManager.stack.push(delta)
    undoManager.current = _.cloneDeep(item)
    undoManager.position++
  },
  undo(undoManager, callback) {
    if (this.canUndo(undoManager)) {
      const delta = undoManager.stack[undoManager.position--]
      const reverseDelta = diffpatcher.reverse(delta)
      const item = diffpatcher.patch(undoManager.current, reverseDelta)
      undoManager.current = _.cloneDeep(item)
      if (callback && item) {
        callback(item)
      }
    }
  },
  redo(undoManager, callback) {
    if (this.canRedo(undoManager)) {
      const delta = undoManager.stack[++undoManager.position]
      const item = diffpatcher.patch(undoManager.current, delta)
      undoManager.current = _.cloneDeep(item)
      if (callback && item) {
        callback(item)
      }
    }
  },
  canUndo(undoManager) {
    return undoManager ? undoManager.position > -1 : false
  },
  canRedo(undoManager) {
    return undoManager.position + 1 < this.count(undoManager)
  },
  count(undoManager) {
    return undoManager.stack.length
  },
  currentItem(undoManager) {
    return undoManager.current
  }
}
