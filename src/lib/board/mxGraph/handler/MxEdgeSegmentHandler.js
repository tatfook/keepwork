/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
import MxEdgeHandler from './MxEdgeHandler'
import MxUtils from '../util/MxUtils'
import MxElbowEdgeHandler from './MxElbowEdgeHandler'
import MxPoint from '../util/MxPoint'
import MxConstants from '../util/MxConstants'
import MxRectangle from '../util/MxRectangle'
export default class MxEdgeSegmentHandler {
  constructor(state) {
    MxEdgeHandler.call(this, state)
  }
}

/**
 * Extends MxEdgeHandler.
 */
MxUtils.extend(MxEdgeSegmentHandler, MxElbowEdgeHandler)

/**
 * Function: getCurrentPoints
 *
 * Returns the current absolute points.
 */
MxEdgeSegmentHandler.prototype.getCurrentPoints = function() {
  let pts = this.state.absolutePoints

  if (pts !== null) {
    // Special case for straight edges where we add a virtual middle handle for moving the edge
    if (
      pts.length === 2 ||
      (pts.length === 3 &&
        ((pts[0].x === pts[1].x && pts[1].x === pts[2].x) ||
          (pts[0].y === pts[1].y && pts[1].y === pts[2].y)))
    ) {
      let cx = pts[0].x + (pts[pts.length - 1].x - pts[0].x) / 2
      let cy = pts[0].y + (pts[pts.length - 1].y - pts[0].y) / 2

      pts = [
        pts[0],
        new MxPoint(cx, cy),
        new MxPoint(cx, cy),
        pts[pts.length - 1]
      ]
    }
  }

  return pts
}

/**
 * Function: getPreviewPoints
 *
 * Updates the given preview state taking into account the state of the constraint handler.
 */
MxEdgeSegmentHandler.prototype.getPreviewPoints = function(point) {
  if (this.isSource || this.isTarget) {
    return MxElbowEdgeHandler.prototype.getPreviewPoints.apply(this, arguments)
  } else {
    let pts = this.getCurrentPoints()
    let last = this.convertPoint(pts[0].clone(), false)
    point = this.convertPoint(point.clone(), false)
    let result = []

    for (let i = 1; i < pts.length; i++) {
      let pt = this.convertPoint(pts[i].clone(), false)

      if (i === this.index) {
        if (Math.round(last.x - pt.x) === 0) {
          last.x = point.x
          pt.x = point.x
        }

        if (Math.round(last.y - pt.y) === 0) {
          last.y = point.y
          pt.y = point.y
        }
      }

      if (i < pts.length - 1) {
        result.push(pt)
      }

      last = pt
    }

    // Replaces single point that intersects with source or target
    if (result.length === 1) {
      let source = this.state.getVisibleTerminalState(true)
      let target = this.state.getVisibleTerminalState(false)
      let scale = this.state.view.getScale()
      let tr = this.state.view.getTranslate()

      let x = result[0].x * scale + tr.x
      let y = result[0].y * scale + tr.y

      if (
        (source !== null && MxUtils.contains(source, x, y)) ||
        (target !== null && MxUtils.contains(target, x, y))
      ) {
        result = [point, point]
      }
    }

    return result
  }
}

/**
 * Function: updatePreviewState
 *
 * Overridden to perform optimization of the edge style result.
 */
MxEdgeSegmentHandler.prototype.updatePreviewState = function(
  edge,
  point,
  terminalState,
  me
) {
  MxEdgeHandler.prototype.updatePreviewState.apply(this, arguments)

  // Checks and corrects preview by running edge style again
  if (!this.isSource && !this.isTarget) {
    point = this.convertPoint(point.clone(), false)
    let pts = edge.absolutePoints
    let pt0 = pts[0]
    let pt1 = pts[1]

    let result = []

    for (let i = 2; i < pts.length; i++) {
      let pt2 = pts[i]

      // Merges adjacent segments only if more than 2 to allow for straight edges
      if (
        (Math.round(pt0.x - pt1.x) !== 0 || Math.round(pt1.x - pt2.x) !== 0) &&
        (Math.round(pt0.y - pt1.y) !== 0 || Math.round(pt1.y - pt2.y) !== 0)
      ) {
        result.push(this.convertPoint(pt1.clone(), false))
      }

      pt0 = pt1
      pt1 = pt2
    }

    let source = this.state.getVisibleTerminalState(true)
    let target = this.state.getVisibleTerminalState(false)
    let rpts = this.state.absolutePoints

    // A straight line is represented by 3 handles
    if (
      result.length === 0 &&
      (Math.round(pts[0].x - pts[pts.length - 1].x) === 0 ||
        Math.round(pts[0].y - pts[pts.length - 1].y) === 0)
    ) {
      result = [point, point]
    } else if (
      pts.length === 5 &&
      result.length === 2 &&
      source !== null &&
      target !== null &&
      rpts !== null &&
      Math.round(rpts[0].x - rpts[rpts.length - 1].x) === 0
    ) {
      let view = this.graph.getView()
      let scale = view.getScale()
      let tr = view.getTranslate()

      let y0 = view.getRoutingCenterY(source) / scale - tr.y

      // Use fixed connection point y-coordinate if one exists
      let sc = this.graph.getConnectionConstraint(edge, source, true)

      if (sc !== null) {
        let pt = this.graph.getConnectionPoint(source, sc)

        if (pt !== null) {
          this.convertPoint(pt, false)
          y0 = pt.y
        }
      }

      let ye = view.getRoutingCenterY(target) / scale - tr.y

      // Use fixed connection point y-coordinate if one exists
      let tc = this.graph.getConnectionConstraint(edge, target, false)

      if (tc) {
        let pt = this.graph.getConnectionPoint(target, tc)

        if (pt !== null) {
          this.convertPoint(pt, false)
          ye = pt.y
        }
      }

      result = [new MxPoint(point.x, y0), new MxPoint(point.x, ye)]
    }

    this.points = result

    // LATER: Check if points and result are different
    edge.view.updateFixedTerminalPoints(edge, source, target)
    edge.view.updatePoints(edge, this.points, source, target)
    edge.view.updateFloatingTerminalPoints(edge, source, target)
  }
}

/**
 * Overriden to merge edge segments.
 */
MxEdgeSegmentHandler.prototype.connect = function(
  edge,
  terminal,
  isSource,
  isClone,
  me
) {
  let model = this.graph.getModel()
  let geo = model.getGeometry(edge)
  let result = null

  // Merges adjacent edge segments
  if (geo !== null && geo.points !== null && geo.points.length > 0) {
    let pts = this.abspoints
    let pt0 = pts[0]
    let pt1 = pts[1]
    result = []

    for (let i = 2; i < pts.length; i++) {
      let pt2 = pts[i]

      // Merges adjacent segments only if more than 2 to allow for straight edges
      if (
        (Math.round(pt0.x - pt1.x) !== 0 || Math.round(pt1.x - pt2.x) !== 0) &&
        (Math.round(pt0.y - pt1.y) !== 0 || Math.round(pt1.y - pt2.y) !== 0)
      ) {
        result.push(this.convertPoint(pt1.clone(), false))
      }

      pt0 = pt1
      pt1 = pt2
    }
  }

  model.beginUpdate()
  try {
    if (result !== null) {
      let geo = model.getGeometry(edge)

      if (geo !== null) {
        geo = geo.clone()
        geo.points = result

        model.setGeometry(edge, geo)
      }
    }

    edge = MxEdgeHandler.prototype.connect.apply(this, arguments)
  } finally {
    model.endUpdate()
  }

  return edge
}

/**
 * Function: getTooltipForNode
 *
 * Returns no tooltips.
 */
MxEdgeSegmentHandler.prototype.getTooltipForNode = function(node) {
  return null
}

/**
 * Function: createBends
 *
 * Adds custom bends for the center of each segment.
 */
MxEdgeSegmentHandler.prototype.start = function(x, y, index) {
  MxEdgeHandler.prototype.start.apply(this, arguments)

  if (this.bends[index] !== null && !this.isSource && !this.isTarget) {
    MxUtils.setOpacity(this.bends[index].node, 100)
  }
}

/**
 * Function: createBends
 *
 * Adds custom bends for the center of each segment.
 */
MxEdgeSegmentHandler.prototype.createBends = function() {
  let bends = []

  // Source
  let bend = this.createHandleShape(0)
  this.initBend(bend)
  bend.setCursor(MxConstants.CURSOR_TERMINAL_HANDLE)
  bends.push(bend)

  let pts = this.getCurrentPoints()

  // Waypoints (segment handles)
  if (this.graph.isCellBendable(this.state.cell)) {
    if (this.points === null) {
      this.points = []
    }

    for (let i = 0; i < pts.length - 1; i++) {
      bend = this.createVirtualBend()
      bends.push(bend)
      let horizontal = Math.round(pts[i].x - pts[i + 1].x) === 0

      // Special case where dy is 0 as well
      if (Math.round(pts[i].y - pts[i + 1].y) === 0 && i < pts.length - 2) {
        horizontal = Math.round(pts[i].x - pts[i + 2].x) === 0
      }

      bend.setCursor(horizontal ? 'col-resize' : 'row-resize')
      this.points.push(new MxPoint(0, 0))
    }
  }

  // Target
  bend = this.createHandleShape(pts.length)
  this.initBend(bend)
  bend.setCursor(MxConstants.CURSOR_TERMINAL_HANDLE)
  bends.push(bend)

  return bends
}

/**
 * Function: redraw
 *
 * Overridden to invoke <refresh> before the redraw.
 */
MxEdgeSegmentHandler.prototype.redraw = function() {
  this.refresh()
  MxEdgeHandler.prototype.redraw.apply(this, arguments)
}

/**
 * Function: redrawInnerBends
 *
 * Updates the position of the custom bends.
 */
MxEdgeSegmentHandler.prototype.redrawInnerBends = function(p0, pe) {
  if (this.graph.isCellBendable(this.state.cell)) {
    let pts = this.getCurrentPoints()

    if (pts !== null && pts.length > 1) {
      let straight = false

      // Puts handle in the center of straight edges
      if (
        pts.length === 4 &&
        Math.round(pts[1].x - pts[2].x) === 0 &&
        Math.round(pts[1].y - pts[2].y) === 0
      ) {
        straight = true

        if (Math.round(pts[0].y - pts[pts.length - 1].y) === 0) {
          let cx = pts[0].x + (pts[pts.length - 1].x - pts[0].x) / 2
          pts[1] = new MxPoint(cx, pts[1].y)
          pts[2] = new MxPoint(cx, pts[2].y)
        } else {
          let cy = pts[0].y + (pts[pts.length - 1].y - pts[0].y) / 2
          pts[1] = new MxPoint(pts[1].x, cy)
          pts[2] = new MxPoint(pts[2].x, cy)
        }
      }

      for (let i = 0; i < pts.length - 1; i++) {
        if (this.bends[i + 1] !== null) {
          let p0 = pts[i]
          let pe = pts[i + 1]
          let pt = new MxPoint(
            p0.x + (pe.x - p0.x) / 2,
            p0.y + (pe.y - p0.y) / 2
          )
          let b = this.bends[i + 1].bounds
          this.bends[i + 1].bounds = new MxRectangle(
            Math.floor(pt.x - b.width / 2),
            Math.floor(pt.y - b.height / 2),
            b.width,
            b.height
          )
          this.bends[i + 1].redraw()

          if (this.manageLabelHandle) {
            this.checkLabelHandle(this.bends[i + 1].bounds)
          }
        }
      }

      if (straight) {
        MxUtils.setOpacity(this.bends[1].node, this.virtualBendOpacity)
        MxUtils.setOpacity(this.bends[3].node, this.virtualBendOpacity)
      }
    }
  }
}
