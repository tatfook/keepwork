/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxCellHighlight
 *
 * A helper class to highlight cells. Here is an example for a given cell.
 *
 * (code)
 * let highlight = new MxCellHighlight(graph, '#ff0000', 2);
 * highlight.highlight(graph.view.getState(cell)));
 * (end)
 *
 * Constructor: MxCellHighlight
 *
 * Constructs a cell highlight.
 */
import MxConstants from '../util/MxConstants'
import MxUtils from '../util/MxUtils'
import MxEvent from '../util/MxEvent'
import MxRectangle from '../util/MxRectangle'
import MxClient from '../MxClient'

export default class MxCellHighlight {
  constructor(graph, highlightColor, strokeWidth, dashed) {
    if (graph !== null) {
      this.graph = graph
      this.highlightColor = (highlightColor !== null) ? highlightColor : MxConstants.DEFAULT_VALID_COLOR
      this.strokeWidth = (strokeWidth !== null) ? strokeWidth : MxConstants.HIGHLIGHT_STROKEWIDTH
      this.dashed = (dashed !== null) ? dashed : false
      this.opacity = MxConstants.HIGHLIGHT_OPACITY

      // Updates the marker if the graph changes
      this.repaintHandler = MxUtils.bind(this, function() {
        // Updates reference to state
        if (this.state !== null) {
          let tmp = this.graph.view.getState(this.state.cell)

          if (tmp === null) {
            this.hide()
          } else {
            this.state = tmp
            this.repaint()
          }
        }
      })

      this.graph.getView().addListener(MxEvent.SCALE, this.repaintHandler)
      this.graph.getView().addListener(MxEvent.TRANSLATE, this.repaintHandler)
      this.graph.getView().addListener(MxEvent.SCALE_AND_TRANSLATE, this.repaintHandler)
      this.graph.getModel().addListener(MxEvent.CHANGE, this.repaintHandler)

      // Hides the marker if the current root changes
      this.resetHandler = MxUtils.bind(this, function() {
        this.hide()
      })

      this.graph.getView().addListener(MxEvent.DOWN, this.resetHandler)
      this.graph.getView().addListener(MxEvent.UP, this.resetHandler)
    }
  };
}

/**
 * Variable: keepOnTop
 *
 * Specifies if the highlights should appear on top of everything
 * else in the overlay pane. Default is false.
 */
MxCellHighlight.prototype.keepOnTop = false

/**
 * Variable: graph
 *
 * Reference to the enclosing <mxGraph>.
 */
MxCellHighlight.prototype.graph = true

/**
 * Variable: state
 *
 * Reference to the <mxCellState>.
 */
MxCellHighlight.prototype.state = null

/**
 * Variable: spacing
 *
 * Specifies the spacing between the highlight for vertices and the vertex.
 * Default is 2.
 */
MxCellHighlight.prototype.spacing = 2

/**
 * Variable: resetHandler
 *
 * Holds the handler that automatically invokes reset if the highlight
 * should be hidden.
 */
MxCellHighlight.prototype.resetHandler = null

/**
 * Function: setHighlightColor
 *
 * Sets the color of the rectangle used to highlight drop targets.
 *
 * Parameters:
 *
 * color - String that represents the new highlight color.
 */
MxCellHighlight.prototype.setHighlightColor = function(color) {
  this.highlightColor = color

  if (this.shape !== null) {
    this.shape.stroke = color
  }
}

/**
 * Function: drawHighlight
 *
 * Creates and returns the highlight shape for the given state.
 */
MxCellHighlight.prototype.drawHighlight = function() {
  this.shape = this.createShape()
  this.repaint()

  if (!this.keepOnTop && this.shape.node.parentNode.firstChild !== this.shape.node) {
    this.shape.node.parentNode.insertBefore(this.shape.node, this.shape.node.parentNode.firstChild)
  }
}

/**
 * Function: createShape
 *
 * Creates and returns the highlight shape for the given state.
 */
MxCellHighlight.prototype.createShape = function() {
  let shape = this.graph.cellRenderer.createShape(this.state)

  shape.svgStrokeTolerance = this.graph.tolerance
  shape.points = this.state.absolutePoints
  shape.apply(this.state)
  shape.stroke = this.highlightColor
  shape.opacity = this.opacity
  shape.isDashed = this.dashed
  shape.isShadow = false

  shape.dialect = (this.graph.dialect !== MxConstants.DIALECT_SVG) ? MxConstants.DIALECT_VML : MxConstants.DIALECT_SVG
  shape.init(this.graph.getView().getOverlayPane())
  MxEvent.redirectMouseEvents(shape.node, this.graph, this.state)

  if (this.graph.dialect !== MxConstants.DIALECT_SVG) {
    shape.pointerEvents = false
  } else {
    shape.svgPointerEvents = 'stroke'
  }

  return shape
}

/**
 * Function: repaint
 *
 * Updates the highlight after a change of the model or view.
 */
MxCellHighlight.prototype.getStrokeWidth = function(state) {
  return this.strokeWidth
}

/**
 * Function: repaint
 *
 * Updates the highlight after a change of the model or view.
 */
MxCellHighlight.prototype.repaint = function() {
  if (this.state !== null && this.shape !== null) {
    this.shape.scale = this.state.view.scale

    if (this.graph.model.isEdge(this.state.cell)) {
      this.shape.strokewidth = this.getStrokeWidth()
      this.shape.points = this.state.absolutePoints
      this.shape.outline = false
    } else {
      this.shape.bounds = new MxRectangle(this.state.x - this.spacing, this.state.y - this.spacing,
        this.state.width + 2 * this.spacing, this.state.height + 2 * this.spacing)
      this.shape.rotation = Number(this.state.style[MxConstants.STYLE_ROTATION] || '0')
      this.shape.strokewidth = this.getStrokeWidth() / this.state.view.scale
      this.shape.outline = true
    }

    // Uses cursor from shape in highlight
    if (this.state.shape !== null) {
      this.shape.setCursor(this.state.shape.getCursor())
    }

    // Workaround for event transparency in VML with transparent color
    // is to use a non-transparent color with near zero opacity
    if (MxClient.IS_QUIRKS || document.documentMode === 8) {
      if (this.shape.stroke === 'transparent') {
        // KNOWN: Quirks mode does not seem to catch events if
        // we do not force an update of the DOM via a change such
        // as mxLog.debug. Since IE6 is EOL we do not add a fix.
        this.shape.stroke = 'white'
        this.shape.opacity = 1
      } else {
        this.shape.opacity = this.opacity
      }
    }

    this.shape.redraw()
  }
}

/**
 * Function: hide
 *
 * Resets the state of the cell marker.
 */
MxCellHighlight.prototype.hide = function() {
  this.highlight(null)
}

/**
 * Function: mark
 *
 * Marks the <markedState> and fires a <mark> event.
 */
MxCellHighlight.prototype.highlight = function(state) {
  if (this.state !== state) {
    if (this.shape !== null) {
      this.shape.destroy()
      this.shape = null
    }

    this.state = state

    if (this.state !== null) {
      this.drawHighlight()
    }
  }
}

/**
 * Function: isHighlightAt
 *
 * Returns true if this highlight is at the given position.
 */
MxCellHighlight.prototype.isHighlightAt = function(x, y) {
  let hit = false

  // Quirks mode is currently not supported as it used a different coordinate system
  if (this.shape !== null && document.elementFromPoint !== null && !MxClient.IS_QUIRKS) {
    let elt = document.elementFromPoint(x, y)

    while (elt !== null) {
      if (elt === this.shape.node) {
        hit = true
        break
      }

      elt = elt.parentNode
    }
  }

  return hit
}

/**
 * Function: destroy
 *
 * Destroys the handler and all its resources and DOM nodes.
 */
MxCellHighlight.prototype.destroy = function() {
  this.graph.getView().removeListener(this.resetHandler)
  this.graph.getView().removeListener(this.repaintHandler)
  this.graph.getModel().removeListener(this.repaintHandler)

  if (this.shape !== null) {
    this.shape.destroy()
    this.shape = null
  }
}
