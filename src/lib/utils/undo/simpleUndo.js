'use strict'

class SimpleUndo {
  /**
   * SimpleUndo is a very basic javascript undo/redo stack for managing histories of basically anything.
   *
   * options are: {
   *  maxLength : the maximum number of items in history
   * }
   *
   */
  constructor(maxLength) {
    this.initialItem = null
    this.maxLength = maxLength || 30
    this.stack = [this.initialItem]
    this.position = 0
  }
}

export default SimpleUndo
