export default {
  truncate(undoManager) {
    while (undoManager.stack.length > undoManager.maxLength) {
      undoManager.stack.shift()
    }
  },
  init(undoManager, initialItem) {
    undoManager.initialItem = initialItem
    this.clear(undoManager)
  },
  clear(undoManager) {
    undoManager.stack = [undoManager.initialItem]
    undoManager.position = 0
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
    undoManager.stack.push(item)
    undoManager.position++
  },
  undo(undoManager, callback) {
    if (this.canUndo(undoManager)) {
      var item = undoManager.stack[--undoManager.position]
      if (callback && item) {
        callback(item.newCode, item.cursor)
      }
    }
  },
  redo(undoManager, callback) {
    if (this.canRedo(undoManager)) {
      var item = undoManager.stack[++undoManager.position]
      if (callback && item) {
        callback(item.newCode, item.cursor)
      }
    }
  },
  canUndo(undoManager) {
    return undoManager.position > 0
  },
  canRedo(undoManager) {
    return undoManager.position < this.count(undoManager)
  },
  count(undoManager) {
    return undoManager.stack.length - 1 // -1 because of initial item
  }
}
