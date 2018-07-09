/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxElbowEdgeHandler
 *
 * Graph event handler that reconnects edges and modifies control points and
 * the edge label location. Uses <mxTerminalMarker> for finding and
 * highlighting new source and target vertices. This handler is automatically
 * created in <mxGraph.createHandler>. It extends <MxEdgeHandler>.
 *
 * Constructor: MxEdgeHandler
 *
 * Constructs an edge handler for the specified <mxCellState>.
 *
 * Parameters:
 *
 * state - <mxCellState> of the cell to be modified.
 */
import MxEdgeHandler from './MxEdgeHandler'
import MxUtils from '../util/MxUtils'
import MxClient from '../MxClient'
import MxConstants from '../util/MxConstants'
import MxEvent from '../util/MxEvent'
import MxPoint from '../util/MxPoint'
import MxEdgeStyle from '../view/MxEdgeStyle'
import MxResources from '../util/MxResources'
import MxRectangle from '../util/MxRectangle'
export default class MxElbowEdgeHandler {
  constructor(state) {
    MxEdgeHandler.call(this, state)
  }
}

/**
 * Extends MxEdgeHandler.
 */
MxUtils.extend(MxElbowEdgeHandler, MxEdgeHandler)

/**
 * Specifies if a double click on the middle handle should call
 * <mxGraph.flipEdge>. Default is true.
 */
MxElbowEdgeHandler.prototype.flipEnabled = true

/**
 * Variable: doubleClickOrientationResource
 *
 * Specifies the resource key for the tooltip to be displayed on the single
 * control point for routed edges. If the resource for this key does not
 * exist then the value is used as the error message. Default is
 * 'doubleClickOrientation'.
 */
MxElbowEdgeHandler.prototype.doubleClickOrientationResource = (MxClient.language !== 'none') ? 'doubleClickOrientation' : ''

/**
 * Function: createBends
 *
 * Overrides <MxEdgeHandler.createBends> to create custom bends.
 */
MxElbowEdgeHandler.prototype.createBends = function() {
  let bends = []

  // Source
  let bend = this.createHandleShape(0)
  this.initBend(bend)
  bend.setCursor(MxConstants.CURSOR_TERMINAL_HANDLE)
  bends.push(bend)

  // Virtual
  bends.push(this.createVirtualBend(MxUtils.bind(this, function(evt) {
    if (!MxEvent.isConsumed(evt) && this.flipEnabled) {
      this.graph.flipEdge(this.state.cell, evt)
      MxEvent.consume(evt)
    }
  })))
  this.points.push(new MxPoint(0, 0))

  // Target
  bend = this.createHandleShape(2)
  this.initBend(bend)
  bend.setCursor(MxConstants.CURSOR_TERMINAL_HANDLE)
  bends.push(bend)

  return bends
}

/**
 * Function: createVirtualBend
 *
 * Creates a virtual bend that supports double clicking and calls
 * <mxGraph.flipEdge>.
 */
MxElbowEdgeHandler.prototype.createVirtualBend = function(dblClickHandler) {
  let bend = this.createHandleShape()
  this.initBend(bend, dblClickHandler)

  bend.setCursor(this.getCursorForBend())

  if (!this.graph.isCellBendable(this.state.cell)) {
    bend.node.style.display = 'none'
  }

  return bend
}

/**
 * Function: getCursorForBend
 *
 * Returns the cursor to be used for the bend.
 */
MxElbowEdgeHandler.prototype.getCursorForBend = function() {
  return (this.state.style[MxConstants.STYLE_EDGE] === MxEdgeStyle.TopToBottom || this.state.style[MxConstants.STYLE_EDGE] === MxConstants.EDGESTYLE_TOPTOBOTTOM || ((this.state.style[MxConstants.STYLE_EDGE] === MxEdgeStyle.ElbowConnector || this.state.style[MxConstants.STYLE_EDGE] === MxConstants.EDGESTYLE_ELBOW) && this.state.style[MxConstants.STYLE_ELBOW] === MxConstants.ELBOW_VERTICAL))
    ? 'row-resize' : 'col-resize'
}

/**
 * Function: getTooltipForNode
 *
 * Returns the tooltip for the given node.
 */
MxElbowEdgeHandler.prototype.getTooltipForNode = function(node) {
  let tip = null

  if (this.bends !== null && this.bends[1] !== null && (node === this.bends[1].node || node.parentNode === this.bends[1].node)) {
    tip = this.doubleClickOrientationResource
    tip = MxResources.get(tip) || tip // translate
  }

  return tip
}

/**
 * Function: convertPoint
 *
 * Converts the given point in-place from screen to unscaled, untranslated
 * graph coordinates and applies the grid.
 *
 * Parameters:
 *
 * point - <MxPoint> to be converted.
 * gridEnabled - Boolean that specifies if the grid should be applied.
 */
MxElbowEdgeHandler.prototype.convertPoint = function(point, gridEnabled) {
  let scale = this.graph.getView().getScale()
  let tr = this.graph.getView().getTranslate()
  let origin = this.state.origin

  if (gridEnabled) {
    point.x = this.graph.snap(point.x)
    point.y = this.graph.snap(point.y)
  }

  point.x = Math.round(point.x / scale - tr.x - origin.x)
  point.y = Math.round(point.y / scale - tr.y - origin.y)

  return point
}

/**
 * Function: redrawInnerBends
 *
 * Updates and redraws the inner bends.
 *
 * Parameters:
 *
 * p0 - <MxPoint> that represents the location of the first point.
 * pe - <MxPoint> that represents the location of the last point.
 */
MxElbowEdgeHandler.prototype.redrawInnerBends = function(p0, pe) {
  let g = this.graph.getModel().getGeometry(this.state.cell)
  let pts = this.state.absolutePoints
  let pt = null

  // Keeps the virtual bend on the edge shape
  if (pts.length > 1) {
    p0 = pts[1]
    pe = pts[pts.length - 2]
  } else if (g.points !== null && g.points.length > 0) {
    pt = pts[0]
  }

  if (pt === null) {
    pt = new MxPoint(p0.x + (pe.x - p0.x) / 2, p0.y + (pe.y - p0.y) / 2)
  } else {
    pt = new MxPoint(this.graph.getView().scale * (pt.x + this.graph.getView().translate.x + this.state.origin.x),
      this.graph.getView().scale * (pt.y + this.graph.getView().translate.y + this.state.origin.y))
  }

  // Makes handle slightly bigger if the yellow  label handle
  // exists and intersects this green handle
  let b = this.bends[1].bounds
  let w = b.width
  let h = b.height
  let bounds = new MxRectangle(Math.round(pt.x - w / 2), Math.round(pt.y - h / 2), w, h)

  if (this.manageLabelHandle) {
    this.checkLabelHandle(bounds)
  } else if (this.handleImage === null && this.labelShape.visible && MxUtils.intersects(bounds, this.labelShape.bounds)) {
    w = MxConstants.HANDLE_SIZE + 3
    h = MxConstants.HANDLE_SIZE + 3
    bounds = new MxRectangle(Math.floor(pt.x - w / 2), Math.floor(pt.y - h / 2), w, h)
  }

  this.bends[1].bounds = bounds
  this.bends[1].redraw()

  if (this.manageLabelHandle) {
    this.checkLabelHandle(this.bends[1].bounds)
  }
}
