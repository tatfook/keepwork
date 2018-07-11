/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxUndoableEdit
 *
 * Implements a composite undoable edit. Here is an example for a custom change
 * which gets executed via the model:
 *
 * (code)
 * function CustomChange(model, name)
 * {
 *   this.model = model;
 *   this.name = name;
 *   this.previous = name;
 * };
 *
 * CustomChange.prototype.execute = function()
 * {
 *   let tmp = this.model.name;
 *   this.model.name = this.previous;
 *   this.previous = tmp;
 * };
 *
 * let name = prompt('Enter name');
 * graph.model.execute(new CustomChange(graph.model, name));
 * (end)
 *
 * Event: MxEvent.EXECUTED
 *
 * Fires between START_EDIT and END_EDIT after an atomic change was executed.
 * The <code>change</code> property contains the change that was executed.
 *
 * Event: MxEvent.START_EDIT
 *
 * Fires before a set of changes will be executed in <undo> or <redo>.
 * This event contains no properties.
 *
 * Event: MxEvent.END_EDIT
 *
 * Fires after a set of changeswas executed in <undo> or <redo>.
 * This event contains no properties.
 *
 * Constructor: MxUndoableEdit
 *
 * Constructs a new undoable edit for the given source.
 */

import MxEventObject from './MxEventObject.js'
import MxEvent from './MxEvent.js'

export default class MxUndoableEdit {
  constructor(source, significant) {
    this.source = source
    this.changes = []
    this.significant = significant !== null ? significant : true
  }
}

/**
 * Variable: source
 *
 * Specifies the source of the edit.
 */
MxUndoableEdit.prototype.source = null

/**
 * Variable: changes
 *
 * Array that contains the changes that make up this edit. The changes are
 * expected to either have an undo and redo function, or an execute
 * function. Default is an empty array.
 */
MxUndoableEdit.prototype.changes = null

/**
 * Variable: significant
 *
 * Specifies if the undoable change is significant.
 * Default is true.
 */
MxUndoableEdit.prototype.significant = null

/**
 * Variable: undone
 *
 * Specifies if this edit has been undone. Default is false.
 */
MxUndoableEdit.prototype.undone = false

/**
 * Variable: redone
 *
 * Specifies if this edit has been redone. Default is false.
 */
MxUndoableEdit.prototype.redone = false

/**
 * Function: isEmpty
 *
 * Returns true if the this edit contains no changes.
 */
MxUndoableEdit.prototype.isEmpty = function() {
  return this.changes.length === 0
}

/**
 * Function: isSignificant
 *
 * Returns <significant>.
 */
MxUndoableEdit.prototype.isSignificant = function() {
  return this.significant
}

/**
 * Function: add
 *
 * Adds the specified change to this edit. The change is an object that is
 * expected to either have an undo and redo, or an execute function.
 */
MxUndoableEdit.prototype.add = function(change) {
  this.changes.push(change)
}

/**
 * Function: notify
 *
 * Hook to notify any listeners of the changes after an <undo> or <redo>
 * has been carried out. This implementation is empty.
 */
MxUndoableEdit.prototype.notify = function() {}

/**
 * Function: die
 *
 * Hook to free resources after the edit has been removed from the command
 * history. This implementation is empty.
 */
MxUndoableEdit.prototype.die = function() {}

/**
 * Function: undo
 *
 * Undoes all changes in this edit.
 */
MxUndoableEdit.prototype.undo = function() {
  if (!this.undone) {
    this.source.fireEvent(new MxEventObject(MxEvent.START_EDIT))
    let count = this.changes.length

    for (let i = count - 1; i >= 0; i--) {
      let change = this.changes[i]

      if (change.execute !== null) {
        change.execute()
      } else if (change.undo !== null) {
        change.undo()
      }

      // New global executed event
      this.source.fireEvent(
        new MxEventObject(MxEvent.EXECUTED, 'change', change)
      )
    }

    this.undone = true
    this.redone = false
    this.source.fireEvent(new MxEventObject(MxEvent.END_EDIT))
  }

  this.notify()
}

/**
 * Function: redo
 *
 * Redoes all changes in this edit.
 */
MxUndoableEdit.prototype.redo = function() {
  if (!this.redone) {
    this.source.fireEvent(new MxEventObject(MxEvent.START_EDIT))
    let count = this.changes.length

    for (let i = 0; i < count; i++) {
      let change = this.changes[i]

      if (change.execute !== null) {
        change.execute()
      } else if (change.redo !== null) {
        change.redo()
      }

      // New global executed event
      this.source.fireEvent(
        new MxEventObject(MxEvent.EXECUTED, 'change', change)
      )
    }

    this.undone = false
    this.redone = true
    this.source.fireEvent(new MxEventObject(MxEvent.END_EDIT))
  }

  this.notify()
}
