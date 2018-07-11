import MxDictionary from '../util/mxDictionary'
import MxPoint from '../util/MxPoint'
import MxUtils from '../util/MxUtils'

/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 *
 * Class: MxCellStatePreview
 *
 * Implements a live preview for moving cells.
 *
 * Constructor: MxCellStatePreview
 *
 * Constructs a move preview for the given graph.
 *
 * Parameters:
 *
 * graph - Reference to the enclosing <mxGraph>.
 */
export default class MxCellStatePreview {
  constructor(graph) {
    this.deltas = new MxDictionary()
    this.graph = graph
  }
}

/**
 * Variable: graph
 *
 * Reference to the enclosing <mxGraph>.
 */
MxCellStatePreview.prototype.graph = null

/**
 * Variable: deltas
 *
 * Reference to the enclosing <mxGraph>.
 */
MxCellStatePreview.prototype.deltas = null

/**
 * Variable: count
 *
 * Contains the number of entries in the map.
 */
MxCellStatePreview.prototype.count = 0

/**
 * Function: isEmpty
 *
 * Returns true if this contains no entries.
 */
MxCellStatePreview.prototype.isEmpty = function() {
  return this.count === 0
}

/**
 * Function: moveState
 */
MxCellStatePreview.prototype.moveState = function(state, dx, dy, add, includeEdges) {
  add = (add !== null) ? add : true
  includeEdges = (includeEdges !== null) ? includeEdges : true

  var delta = this.deltas.get(state.cell)

  if (delta === null) {
    // Note: Deltas stores the point and the state since the key is a string.
    delta = {point: new MxPoint(dx, dy), state: state}
    this.deltas.put(state.cell, delta)
    this.count++
  } else if (add) {
    delta.point.x += dx
    delta.point.y += dy
  } else {
    delta.point.x = dx
    delta.point.y = dy
  }

  if (includeEdges) {
    this.addEdges(state)
  }

  return delta.point
}

/**
 * Function: show
 */
MxCellStatePreview.prototype.show = function(visitor) {
  this.deltas.visit(MxUtils.bind(this, function(key, delta) {
    this.translateState(delta.state, delta.point.x, delta.point.y)
  }))

  this.deltas.visit(MxUtils.bind(this, function(key, delta) {
    this.revalidateState(delta.state, delta.point.x, delta.point.y, visitor)
  }))
}

/**
 * Function: translateState
 */
MxCellStatePreview.prototype.translateState = function(state, dx, dy) {
  if (state !== null) {
    var model = this.graph.getModel()

    if (model.isVertex(state.cell)) {
      state.view.updateCellState(state)
      var geo = model.getGeometry(state.cell)

      // Moves selection cells and non-relative vertices in
      // the first phase so that edge terminal points will
      // be updated in the second phase
      if ((dx !== 0 || dy !== 0) && geo !== null && (!geo.relative || this.deltas.get(state.cell) !== null)) {
        state.x += dx
        state.y += dy
      }
    }

    var childCount = model.getChildCount(state.cell)

    for (var i = 0; i < childCount; i++) {
      this.translateState(state.view.getState(model.getChildAt(state.cell, i)), dx, dy)
    }
  }
}

/**
 * Function: revalidateState
 */
MxCellStatePreview.prototype.revalidateState = function(state, dx, dy, visitor) {
  if (state !== null) {
    var model = this.graph.getModel()

    // Updates the edge terminal points and restores the
    // (relative) positions of any (relative) children
    if (model.isEdge(state.cell)) {
      state.view.updateCellState(state)
    }

    var geo = this.graph.getCellGeometry(state.cell)
    var pState = state.view.getState(model.getParent(state.cell))

    // Moves selection vertices which are relative
    if ((dx !== 0 || dy !== 0) && geo !== null && geo.relative &&
      model.isVertex(state.cell) && (pState === null ||
      model.isVertex(pState.cell) || this.deltas.get(state.cell) !== null)) {
      state.x += dx
      state.y += dy
    }

    this.graph.cellRenderer.redraw(state)

    // Invokes the visitor on the given state
    if (visitor !== null) {
      visitor(state)
    }

    var childCount = model.getChildCount(state.cell)

    for (var i = 0; i < childCount; i++) {
      this.revalidateState(this.graph.view.getState(model.getChildAt(state.cell, i)), dx, dy, visitor)
    }
  }
}

/**
 * Function: addEdges
 */
MxCellStatePreview.prototype.addEdges = function(state) {
  var model = this.graph.getModel()
  var edgeCount = model.getEdgeCount(state.cell)

  for (var i = 0; i < edgeCount; i++) {
    var s = state.view.getState(model.getEdgeAt(state.cell, i))

    if (s !== null) {
      this.moveState(s, 0, 0)
    }
  }
}
