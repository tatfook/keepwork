'use strict'

class SimpleUndo {
  /**
   * SimpleUndo is a very basic javascript undo/redo stack for managing histories of basically anything.
   *
   * options are: {
   *  maxLength : the maximum number of items in history
   *  onUpdate : a function to call to notify of changes in history. Will be called on `save`, `undo`, `redo` and `clear`
   * }
   *
   */
  constructor(maxLength, onUpdate) {
    this.onUpdate = onUpdate || function() {}
    this.initialItem = null
    this.maxLength = maxLength || 10
    this.clear()
  }

  truncate(limit) {
    while (this.stack.length > limit) {
      this.stack.shift()
    }
  }

  clear() {
    this.stack = [this.initialItem]
    this.position = 0
    this.onUpdate()
  }

  save(item) {
    if (this.position >= this.maxLength) this.truncate(this.maxLength)
    this.position = Math.min(this.position, this.stack.length - 1)

    this.stack = this.stack.slice(0, this.position + 1)
    this.stack.push(item)
    this.position++
    this.onUpdate()
  }

  undo(callback) {
    if (this.canUndo()) {
      var item = this.stack[--this.position]
      this.onUpdate()

      if (callback) {
        callback(item)
      }
    }
  }

  redo(callback) {
    if (this.canRedo()) {
      var item = this.stack[++this.position]
      this.onUpdate()

      if (callback) {
        callback(item)
      }
    }
  }

  canUndo() {
    return this.position > 0
  }

  canRedo() {
    return this.position < this.count()
  }

  count() {
    return this.stack.length - 1 // -1 because of initial item
  }
}

export default SimpleUndo
