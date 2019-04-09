'use strict'

const DEFAULT_STACK_SIZE = 30

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
    this.maxLength = maxLength || DEFAULT_STACK_SIZE
    this.stack = [this.initialItem]
    this.position = 0
    this.current = undefined
  }
}

export default SimpleUndo
