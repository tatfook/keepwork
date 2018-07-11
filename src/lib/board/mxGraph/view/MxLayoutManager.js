/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxLayoutManager
 *
 * Implements a layout manager that runs a given layout after any changes to the graph:
 *
 * Example:
 *
 * (code)
 * var layoutMgr = new MxLayoutManager(graph);
 * layoutMgr.getLayout = function(cell)
 * {
 *   return layout;
 * };
 * (end)
 *
 * Event: MxEvent.LAYOUT_CELLS
 *
 * Fires between begin- and endUpdate after all cells have been layouted in
 * <layoutCells>. The <code>cells</code> property contains all cells that have
 * been passed to <layoutCells>.
 *
 * Constructor: MxLayoutManager
 *
 * Constructs a new automatic layout for the given graph.
 *
 * Arguments:
 *
 * graph - Reference to the enclosing graph.
 */
import MxUtils from '../util/MxUtils'
import MxEventSource from '../util/MxEventSource'
import MxEvent from '../util/MxEvent'
import MxDictionary from '../util/MxDictionary'
import MxRootChange from '../io/MxRootChange'
import MxChildChange from '../io/MxChildChange'
import { MxTerminalChange } from '../model/MxGraphModel'
import MxEventObject from '../util/MxEventObject'

export default class MxLayoutManager {
  constructor(graph) {
    // Executes the layout before the changes are dispatched
    this.undoHandler = MxUtils.bind(this, function(sender, evt) {
      if (this.isEnabled()) {
        this.beforeUndo(evt.getProperty('edit'))
      }
    })

    // Notifies the layout of a move operation inside a parent
    this.moveHandler = MxUtils.bind(this, function(sender, evt) {
      if (this.isEnabled()) {
        this.cellsMoved(evt.getProperty('cells'), evt.getProperty('event'))
      }
    })

    this.setGraph(graph)
  }
}

/**
 * Extends MxEventSource.
 */
MxLayoutManager.prototype = new MxEventSource()
MxLayoutManager.prototype.constructor = MxLayoutManager

/**
 * Variable: graph
 *
 * Reference to the enclosing <mxGraph>.
 */
MxLayoutManager.prototype.graph = null

/**
 * Variable: bubbling
 *
 * Specifies if the layout should bubble along
 * the cell hierarchy. Default is true.
 */
MxLayoutManager.prototype.bubbling = true

/**
 * Variable: enabled
 *
 * Specifies if event handling is enabled. Default is true.
 */
MxLayoutManager.prototype.enabled = true

/**
 * Variable: updateHandler
 *
 * Holds the function that handles the endUpdate event.
 */
MxLayoutManager.prototype.updateHandler = null

/**
 * Variable: moveHandler
 *
 * Holds the function that handles the move event.
 */
MxLayoutManager.prototype.moveHandler = null

/**
 * Function: isEnabled
 *
 * Returns true if events are handled. This implementation
 * returns <enabled>.
 */
MxLayoutManager.prototype.isEnabled = function() {
  return this.enabled
}

/**
 * Function: setEnabled
 *
 * Enables or disables event handling. This implementation
 * updates <enabled>.
 *
 * Parameters:
 *
 * enabled - Boolean that specifies the new enabled state.
 */
MxLayoutManager.prototype.setEnabled = function(enabled) {
  this.enabled = enabled
}

/**
 * Function: isBubbling
 *
 * Returns true if a layout should bubble, that is, if the parent layout
 * should be executed whenever a cell layout (layout of the children of
 * a cell) has been executed. This implementation returns <bubbling>.
 */
MxLayoutManager.prototype.isBubbling = function() {
  return this.bubbling
}

/**
 * Function: setBubbling
 *
 * Sets <bubbling>.
 */
MxLayoutManager.prototype.setBubbling = function(value) {
  this.bubbling = value
}

/**
 * Function: getGraph
 *
 * Returns the graph that this layout operates on.
 */
MxLayoutManager.prototype.getGraph = function() {
  return this.graph
}

/**
 * Function: setGraph
 *
 * Sets the graph that the layouts operate on.
 */
MxLayoutManager.prototype.setGraph = function(graph) {
  if (this.graph !== null) {
    var model = this.graph.getModel()
    model.removeListener(this.undoHandler)
    this.graph.removeListener(this.moveHandler)
  }

  this.graph = graph

  if (this.graph !== null) {
    let model = this.graph.getModel()
    model.addListener(MxEvent.BEFORE_UNDO, this.undoHandler)
    this.graph.addListener(MxEvent.MOVE_CELLS, this.moveHandler)
  }
}

/**
 * Function: getLayout
 *
 * Returns the layout to be executed for the given graph and parent.
 */
MxLayoutManager.prototype.getLayout = function(parent) {
  return null
}

/**
 * Function: beforeUndo
 *
 * Called from the undoHandler.
 *
 * Parameters:
 *
 * cell - Array of <mxCells> that have been moved.
 * evt - Mouse event that represents the mousedown.
 */
MxLayoutManager.prototype.beforeUndo = function(undoableEdit) {
  var cells = this.getCellsForChanges(undoableEdit.changes)
  var model = this.getGraph().getModel()

  // Adds all descendants
  var tmp = []

  for (var i = 0; i < cells.length; i++) {
    tmp = tmp.concat(model.getDescendants(cells[i]))
  }

  cells = tmp

  // Adds all parent ancestors
  if (this.isBubbling()) {
    tmp = model.getParents(cells)

    while (tmp.length > 0) {
      cells = cells.concat(tmp)
      tmp = model.getParents(tmp)
    }
  }

  this.executeLayoutForCells(cells)
}

/**
 * Function: executeLayout
 *
 * Executes the given layout on the given parent.
 */
MxLayoutManager.prototype.executeLayoutForCells = function(cells) {
  // Adds reverse to this array to avoid duplicate execution of leafes
  // Works like capture/bubble for events, first executes all layout
  // from top to bottom and in reverse order and removes duplicates.
  var sorted = MxUtils.sortCells(cells, true)
  sorted = sorted.concat(sorted.slice().reverse())
  this.layoutCells(sorted)
}

/**
 * Function: cellsMoved
 *
 * Called from the moveHandler.
 *
 * Parameters:
 *
 * cell - Array of <mxCells> that have been moved.
 * evt - Mouse event that represents the mousedown.
 */
MxLayoutManager.prototype.cellsMoved = function(cells, evt) {
  if (cells !== null && evt !== null) {
    var point = MxUtils.convertPoint(this.getGraph().container,
      MxEvent.getClientX(evt), MxEvent.getClientY(evt))
    var model = this.getGraph().getModel()

    // Checks if a layout exists to take care of the moving if the
    // parent itself is not being moved
    for (var i = 0; i < cells.length; i++) {
      var parent = model.getParent(cells[i])

      if (MxUtils.indexOf(cells, parent) < 0) {
        var layout = this.getLayout(parent)

        if (layout !== null) {
          layout.moveCell(cells[i], point.x, point.y)
        }
      }
    }
  }
}

/**
 * Function: getCellsForEdit
 *
 * Returns the cells to be layouted for the given sequence of changes.
 */
MxLayoutManager.prototype.getCellsForChanges = function(changes) {
  var dict = new MxDictionary()
  var result = []

  for (var i = 0; i < changes.length; i++) {
    var change = changes[i]

    if (change instanceof MxRootChange) {
      return []
    } else {
      var cells = this.getCellsForChange(change)

      for (var j = 0; j < cells.length; j++) {
        if (cells[j] !== null && !dict.get(cells[j])) {
          dict.put(cells[j], true)
          result.push(cells[j])
        }
      }
    }
  }

  return result
}

/**
 * Function: getCellsForChange
 *
 * Executes all layouts which have been scheduled during the
 * changes.
 */
MxLayoutManager.prototype.getCellsForChange = function(change) {
  var model = this.getGraph().getModel()

  if (change instanceof MxChildChange) {
    return [change.child, change.previous, model.getParent(change.child)]
  } else if (change instanceof MxTerminalChange || change instanceof mxGeometryChange) {
    return [change.cell, model.getParent(change.cell)]
  } else if (change instanceof mxVisibleChange || change instanceof mxStyleChange) {
    return [change.cell]
  }

  return []
}

/**
 * Function: layoutCells
 *
 * Executes all layouts which have been scheduled during the
 * changes.
 */
MxLayoutManager.prototype.layoutCells = function(cells) {
  if (cells.length > 0) {
    // Invokes the layouts while removing duplicates
    var model = this.getGraph().getModel()

    model.beginUpdate()
    try {
      var last = null

      for (var i = 0; i < cells.length; i++) {
        if (cells[i] !== model.getRoot() && cells[i] !== last) {
          if (this.executeLayout(this.getLayout(cells[i]), cells[i])) {
            last = cells[i]
          }
        }
      }

      this.fireEvent(new MxEventObject(MxEvent.LAYOUT_CELLS, 'cells', cells))
    } finally {
      model.endUpdate()
    }
  }
}

/**
 * Function: executeLayout
 *
 * Executes the given layout on the given parent.
 */
MxLayoutManager.prototype.executeLayout = function(layout, parent) {
  var result = false

  if (layout !== null && parent !== null) {
    layout.execute(parent)
    result = true
  }

  return result
}

/**
 * Function: destroy
 *
 * Removes all handlers from the <graph> and deletes the reference to it.
 */
MxLayoutManager.prototype.destroy = function() {
  this.setGraph(null)
}
