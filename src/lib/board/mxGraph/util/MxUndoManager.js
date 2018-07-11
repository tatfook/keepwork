/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxUndoManager
 *
 * Implements a command history. When changing the graph model, an
 * <mxUndoableChange> object is created at the start of the transaction (when
 * model.beginUpdate is called). All atomic changes are then added to this
 * object until the last model.endUpdate call, at which point the
 * <mxUndoableEdit> is dispatched in an event, and added to the history inside
 * <MxUndoManager>. This is done by an event listener in
 * <mxEditor.installUndoHandler>.
 *
 * Each atomic change of the model is represented by an object (eg.
 * <mxRootChange>, <mxChildChange>, <mxTerminalChange> etc) which contains the
 * complete undo information. The <MxUndoManager> also listens to the
 * <mxGraphView> and stores it's changes to the current root as insignificant
 * undoable changes, so that drilling (step into, step up) is undone.
 *
 * This means when you execute an atomic change on the model, then change the
 * current root on the view and click undo, the change of the root will be
 * undone together with the change of the model so that the display represents
 * the state at which the model was changed. However, these changes are not
 * transmitted for sharing as they do not represent a state change.
 *
 * Example:
 *
 * When adding an undo manager to a graph, make sure to add it
 * to the model and the view as well to maintain a consistent
 * display across multiple undo/redo steps.
 *
 * (code)
 * let undoManager = new MxUndoManager();
 * let listener = function(sender, evt)
 * {
 *   undoManager.undoableEditHappened(evt.getProperty('edit'));
 * };
 * graph.getModel().addListener(MxEvent.UNDO, listener);
 * graph.getView().addListener(MxEvent.UNDO, listener);
 * (end)
 *
 * The code creates a function that informs the undoManager
 * of an undoable edit and binds it to the undo event of
 * <mxGraphModel> and <mxGraphView> using
 * <MxEventSource.addListener>.
 *
 * Event: MxEvent.CLEAR
 *
 * Fires after <clear> was invoked. This event has no properties.
 *
 * Event: MxEvent.UNDO
 *
 * Fires afer a significant edit was undone in <undo>. The <code>edit</code>
 * property contains the <mxUndoableEdit> that was undone.
 *
 * Event: MxEvent.REDO
 *
 * Fires afer a significant edit was redone in <redo>. The <code>edit</code>
 * property contains the <mxUndoableEdit> that was redone.
 *
 * Event: MxEvent.ADD
 *
 * Fires after an undoable edit was added to the history. The <code>edit</code>
 * property contains the <mxUndoableEdit> that was added.
 *
 * Constructor: MxUndoManager
 *
 * Constructs a new undo manager with the given history size. If no history
 * size is given, then a default size of 100 steps is used.
 */

import MxEventSource from './MxEventSource'
import MxEventObject from './MxEventObject'
import MxEvent from './MxEvent'

export default class MxUndoManager {
  constructor(size) {
    this.size = size !== null ? size : 100
    this.clear()
  }
}

/**
 * Extends MxEventSource.
 */
MxUndoManager.prototype = new MxEventSource()
MxUndoManager.prototype.constructor = MxUndoManager

/**
 * Variable: size
 *
 * Maximum command history size. 0 means unlimited history. Default is
 * 100.
 */
MxUndoManager.prototype.size = null

/**
 * Variable: history
 *
 * Array that contains the steps of the command history.
 */
MxUndoManager.prototype.history = null

/**
 * Variable: indexOfNextAdd
 *
 * Index of the element to be added next.
 */
MxUndoManager.prototype.indexOfNextAdd = 0

/**
 * Function: isEmpty
 *
 * Returns true if the history is empty.
 */
MxUndoManager.prototype.isEmpty = function() {
  return this.history.length === 0
}

/**
 * Function: clear
 *
 * Clears the command history.
 */
MxUndoManager.prototype.clear = function() {
  this.history = []
  this.indexOfNextAdd = 0
  this.fireEvent(new MxEventObject(MxEvent.CLEAR))
}

/**
 * Function: canUndo
 *
 * Returns true if an undo is possible.
 */
MxUndoManager.prototype.canUndo = function() {
  return this.indexOfNextAdd > 0
}

/**
 * Function: undo
 *
 * Undoes the last change.
 */
MxUndoManager.prototype.undo = function() {
  while (this.indexOfNextAdd > 0) {
    let edit = this.history[--this.indexOfNextAdd]
    edit.undo()

    if (edit.isSignificant()) {
      this.fireEvent(new MxEventObject(MxEvent.UNDO, 'edit', edit))
      break
    }
  }
}

/**
 * Function: canRedo
 *
 * Returns true if a redo is possible.
 */
MxUndoManager.prototype.canRedo = function() {
  return this.indexOfNextAdd < this.history.length
}

/**
 * Function: redo
 *
 * Redoes the last change.
 */
MxUndoManager.prototype.redo = function() {
  let n = this.history.length

  while (this.indexOfNextAdd < n) {
    let edit = this.history[this.indexOfNextAdd++]
    edit.redo()

    if (edit.isSignificant()) {
      this.fireEvent(new MxEventObject(MxEvent.REDO, 'edit', edit))
      break
    }
  }
}

/**
 * Function: undoableEditHappened
 *
 * Method to be called to add new undoable edits to the <history>.
 */
MxUndoManager.prototype.undoableEditHappened = function(undoableEdit) {
  this.trim()

  if (this.size > 0 && this.size === this.history.length) {
    this.history.shift()
  }

  this.history.push(undoableEdit)
  this.indexOfNextAdd = this.history.length
  this.fireEvent(new MxEventObject(MxEvent.ADD, 'edit', undoableEdit))
}

/**
 * Function: trim
 *
 * Removes all pending steps after <indexOfNextAdd> from the history,
 * invoking die on each edit. This is called from <undoableEditHappened>.
 */
MxUndoManager.prototype.trim = function() {
  if (this.history.length > this.indexOfNextAdd) {
    let edits = this.history.splice(
      this.indexOfNextAdd,
      this.history.length - this.indexOfNextAdd
    )

    for (let i = 0; i < edits.length; i++) {
      edits[i].die()
    }
  }
}
