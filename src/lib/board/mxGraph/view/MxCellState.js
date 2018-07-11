import MxPoint from '../util/MxPoint'
import MxRectangle from '../util/'

/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxCellState
 *
 * Represents the current state of a cell in a given <mxGraphView>.
 *
 * For edges, the edge label position is stored in <absoluteOffset>.
 *
 * The size for oversize labels can be retrieved using the boundingBox property
 * of the <text> field as shown below.
 *
 * (code)
 * var bbox = (state.text !== null) ? state.text.boundingBox : null;
 * (end)
 *
 * Constructor: MxCellState
 *
 * Constructs a new object that represents the current state of the given
 * cell in the specified view.
 *
 * Parameters:
 *
 * view - <mxGraphView> that contains the state.
 * cell - <mxCell> that this state represents.
 * style - Array of key, value pairs that constitute the style.
 */
export default class MxCellState {
  constructor(view, cell, style) {
    this.view = view
    this.cell = cell
    this.style = style

    this.origin = new MxPoint()
    this.absoluteOffset = new MxPoint()
  }
}

/**
 * Extends MxRectangle.
 */
MxCellState.prototype = new MxRectangle()
MxCellState.prototype.constructor = MxCellState

/**
 * Variable: view
 *
 * Reference to the enclosing <mxGraphView>.
 */
MxCellState.prototype.view = null

/**
 * Variable: cell
 *
 * Reference to the <mxCell> that is represented by this state.
 */
MxCellState.prototype.cell = null

/**
 * Variable: style
 *
 * Contains an array of key, value pairs that represent the style of the
 * cell.
 */
MxCellState.prototype.style = null

/**
 * Variable: invalid
 *
 * Specifies if the state is invalid. Default is true.
 */
MxCellState.prototype.invalid = true

/**
 * Variable: origin
 *
 * <MxPoint> that holds the origin for all child cells. Default is a new
 * empty <MxPoint>.
 */
MxCellState.prototype.origin = null

/**
 * Variable: absolutePoints
 *
 * Holds an array of <mxPoints> that represent the absolute points of an
 * edge.
 */
MxCellState.prototype.absolutePoints = null

/**
 * Variable: absoluteOffset
 *
 * <MxPoint> that holds the absolute offset. For edges, this is the
 * absolute coordinates of the label position. For vertices, this is the
 * offset of the label relative to the top, left corner of the vertex.
 */
MxCellState.prototype.absoluteOffset = null

/**
 * Variable: visibleSourceState
 *
 * Caches the visible source terminal state.
 */
MxCellState.prototype.visibleSourceState = null

/**
 * Variable: visibleTargetState
 *
 * Caches the visible target terminal state.
 */
MxCellState.prototype.visibleTargetState = null

/**
 * Variable: terminalDistance
 *
 * Caches the distance between the end points for an edge.
 */
MxCellState.prototype.terminalDistance = 0

/**
 * Variable: length
 *
 * Caches the length of an edge.
 */
MxCellState.prototype.length = 0

/**
 * Variable: segments
 *
 * Array of numbers that represent the cached length of each segment of the
 * edge.
 */
MxCellState.prototype.segments = null

/**
 * Variable: shape
 *
 * Holds the <mxShape> that represents the cell graphically.
 */
MxCellState.prototype.shape = null

/**
 * Variable: text
 *
 * Holds the <mxText> that represents the label of the cell. Thi smay be
 * null if the cell has no label.
 */
MxCellState.prototype.text = null

/**
 * Variable: unscaledWidth
 *
 * Holds the unscaled width of the state.
 */
MxCellState.prototype.unscaledWidth = null

/**
 * Function: getPerimeterBounds
 *
 * Returns the <MxRectangle> that should be used as the perimeter of the
 * cell.
 *
 * Parameters:
 *
 * border - Optional border to be added around the perimeter bounds.
 * bounds - Optional <MxRectangle> to be used as the initial bounds.
 */
MxCellState.prototype.getPerimeterBounds = function(border, bounds) {
  border = border || 0
  bounds = (bounds !== null) ? bounds : new MxRectangle(this.x, this.y, this.width, this.height)

  if (this.shape !== null && this.shape.stencil !== null && this.shape.stencil.aspect === 'fixed') {
    var aspect = this.shape.stencil.computeAspect(this.style, bounds.x, bounds.y, bounds.width, bounds.height)

    bounds.x = aspect.x
    bounds.y = aspect.y
    bounds.width = this.shape.stencil.w0 * aspect.width
    bounds.height = this.shape.stencil.h0 * aspect.height
  }

  if (border !== 0) {
    bounds.grow(border)
  }

  return bounds
}

/**
 * Function: setAbsoluteTerminalPoint
 *
 * Sets the first or last point in <absolutePoints> depending on isSource.
 *
 * Parameters:
 *
 * point - <MxPoint> that represents the terminal point.
 * isSource - Boolean that specifies if the first or last point should
 * be assigned.
 */
MxCellState.prototype.setAbsoluteTerminalPoint = function(point, isSource) {
  if (isSource) {
    if (this.absolutePoints === null) {
      this.absolutePoints = []
    }

    if (this.absolutePoints.length === 0) {
      this.absolutePoints.push(point)
    } else {
      this.absolutePoints[0] = point
    }
  } else {
    if (this.absolutePoints === null) {
      this.absolutePoints = []
      this.absolutePoints.push(null)
      this.absolutePoints.push(point)
    } else if (this.absolutePoints.length === 1) {
      this.absolutePoints.push(point)
    } else {
      this.absolutePoints[this.absolutePoints.length - 1] = point
    }
  }
}

/**
 * Function: setCursor
 *
 * Sets the given cursor on the shape and text shape.
 */
MxCellState.prototype.setCursor = function(cursor) {
  if (this.shape !== null) {
    this.shape.setCursor(cursor)
  }

  if (this.text !== null) {
    this.text.setCursor(cursor)
  }
}

/**
 * Function: getVisibleTerminal
 *
 * Returns the visible source or target terminal cell.
 *
 * Parameters:
 *
 * source - Boolean that specifies if the source or target cell should be
 * returned.
 */
MxCellState.prototype.getVisibleTerminal = function(source) {
  var tmp = this.getVisibleTerminalState(source)

  return (tmp !== null) ? tmp.cell : null
}

/**
 * Function: getVisibleTerminalState
 *
 * Returns the visible source or target terminal state.
 *
 * Parameters:
 *
 * source - Boolean that specifies if the source or target state should be
 * returned.
 */
MxCellState.prototype.getVisibleTerminalState = function(source) {
  return (source) ? this.visibleSourceState : this.visibleTargetState
}

/**
 * Function: setVisibleTerminalState
 *
 * Sets the visible source or target terminal state.
 *
 * Parameters:
 *
 * terminalState - <MxCellState> that represents the terminal.
 * source - Boolean that specifies if the source or target state should be set.
 */
MxCellState.prototype.setVisibleTerminalState = function(terminalState, source) {
  if (source) {
    this.visibleSourceState = terminalState
  } else {
    this.visibleTargetState = terminalState
  }
}

/**
 * Function: getCellBounds
 *
 * Returns the unscaled, untranslated bounds.
 */
MxCellState.prototype.getCellBounds = function() {
  return this.cellBounds
}

/**
 * Function: getPaintBounds
 *
 * Returns the unscaled, untranslated paint bounds. This is the same as
 * <getCellBounds> but with a 90 degree rotation if the shape's
 * isPaintBoundsInverted returns true.
 */
MxCellState.prototype.getPaintBounds = function() {
  return this.paintBounds
}

/**
 * Function: updateCachedBounds
 *
 * Updates the cellBounds and paintBounds.
 */
MxCellState.prototype.updateCachedBounds = function() {
  var tr = this.view.translate
  var s = this.view.scale
  this.cellBounds = new MxRectangle(this.x / s - tr.x, this.y / s - tr.y, this.width / s, this.height / s)
  this.paintBounds = MxRectangle.fromRectangle(this.cellBounds)

  if (this.shape !== null && this.shape.isPaintBoundsInverted()) {
    this.paintBounds.rotate90()
  }
}

/**
 * Destructor: setState
 *
 * Copies all fields from the given state to this state.
 */
MxCellState.prototype.setState = function(state) {
  this.view = state.view
  this.cell = state.cell
  this.style = state.style
  this.absolutePoints = state.absolutePoints
  this.origin = state.origin
  this.absoluteOffset = state.absoluteOffset
  this.boundingBox = state.boundingBox
  this.terminalDistance = state.terminalDistance
  this.segments = state.segments
  this.length = state.length
  this.x = state.x
  this.y = state.y
  this.width = state.width
  this.height = state.height
  this.unscaledWidth = state.unscaledWidth
}

/**
 * Function: clone
 *
 * Returns a clone of this <MxPoint>.
 */
MxCellState.prototype.clone = function() {
  var clone = new MxCellState(this.view, this.cell, this.style)

  // Clones the absolute points
  if (this.absolutePoints !== null) {
    clone.absolutePoints = []

    for (var i = 0; i < this.absolutePoints.length; i++) {
      clone.absolutePoints[i] = this.absolutePoints[i].clone()
    }
  }

  if (this.origin !== null) {
    clone.origin = this.origin.clone()
  }

  if (this.absoluteOffset !== null) {
    clone.absoluteOffset = this.absoluteOffset.clone()
  }

  if (this.boundingBox !== null) {
    clone.boundingBox = this.boundingBox.clone()
  }

  clone.terminalDistance = this.terminalDistance
  clone.segments = this.segments
  clone.length = this.length
  clone.x = this.x
  clone.y = this.y
  clone.width = this.width
  clone.height = this.height
  clone.unscaledWidth = this.unscaledWidth

  return clone
}

/**
 * Destructor: destroy
 *
 * Destroys the state and all associated resources.
 */
MxCellState.prototype.destroy = function() {
  this.view.graph.cellRenderer.destroy(this)
}
