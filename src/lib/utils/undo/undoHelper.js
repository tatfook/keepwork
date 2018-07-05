import _ from 'lodash'

const defaultUndoManager = { position: 0 }
export default {
  truncate(undoManager) {
    while (undoManager.stack.length > undoManager.maxLength) {
      undoManager.stack.shift()
    }
  },
  init(undoManager, initialItem) {
    undoManager.initialItem = _.cloneDeep(initialItem)
    this.clear(undoManager)
  },
  clear(undoManager = defaultUndoManager) {
    undoManager.stack = [undoManager.initialItem]
    undoManager.position = 0
  },
  save(undoManager = defaultUndoManager, item) {
    if (undoManager.position >= undoManager.maxLength) {
      this.truncate(undoManager)
    }
    undoManager.position = Math.min(
      undoManager.position,
      undoManager.stack.length - 1
    )

    undoManager.stack = undoManager.stack.slice(0, undoManager.position + 1)
    undoManager.stack.push(item)
    undoManager.position++
  },
  undo(undoManager = defaultUndoManager, callback) {
    if (this.canUndo(undoManager)) {
      var item = undoManager.stack[--undoManager.position]
      if (callback && item) {
        callback(item.newCode, item.cursor)
      }
    }
  },
  redo(undoManager = defaultUndoManager, callback) {
    if (this.canRedo(undoManager)) {
      var item = undoManager.stack[++undoManager.position]
      if (callback && item) {
        callback(item.newCode, item.cursor)
      }
    }
  },
  canUndo(undoManager = defaultUndoManager) {
    return undoManager ? undoManager.position > 0 : false
  },
  canRedo(undoManager = defaultUndoManager) {
    return undoManager.position < this.count(undoManager)
  },
  count(undoManager) {
    return undoManager.stack.length - 1 // -1 because of initial item
  },
  currentItem(undoManager = defaultUndoManager) {
    return undoManager.stack[undoManager.position] || {}
  }
}
