import MxShape from './MxShape'
import MxUtils from '../util/MxUtils'
import MxConstants from '../util/MxConstants'
/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxPolyline
 *
 * Extends <MxShape> to implement a polyline (a line with multiple points).
 * This shape is registered under <MxConstants.SHAPE_POLYLINE> in
 * <mxCellRenderer>.
 *
 * Constructor: MxPolyline
 *
 * Constructs a new polyline shape.
 *
 * Parameters:
 *
 * points - Array of <mxPoints> that define the points. This is stored in
 * <MxShape.points>.
 * stroke - String that defines the stroke color. Default is 'black'. This is
 * stored in <stroke>.
 * strokewidth - Optional integer that defines the stroke width. Default is
 * 1. This is stored in <strokewidth>.
 */

export default class MxPolyline {
  constructor(points, stroke, strokewidth) {
    MxShape.call(this)
    this.points = points
    this.stroke = stroke
    this.strokewidth = (strokewidth !== null) ? strokewidth : 1
  };
}

/**
 * Extends MxShape.
 */
MxUtils.extend(MxPolyline, MxShape)

/**
 * Function: getRotation
 *
 * Returns 0.
 */
MxPolyline.prototype.getRotation = function() {
  return 0
}

/**
 * Function: getShapeRotation
 *
 * Returns 0.
 */
MxPolyline.prototype.getShapeRotation = function() {
  return 0
}

/**
 * Function: isPaintBoundsInverted
 *
 * Returns false.
 */
MxPolyline.prototype.isPaintBoundsInverted = function() {
  return false
}

/**
 * Function: paintEdgeShape
 *
 * Paints the line shape.
 */
MxPolyline.prototype.paintEdgeShape = function(c, pts) {
  if (this.style == null || this.style[MxConstants.STYLE_CURVED] !== 1) {
    this.paintLine(c, pts, this.isRounded)
  } else {
    this.paintCurvedLine(c, pts)
  }
}

/**
 * Function: paintLine
 *
 * Paints the line shape.
 */
MxPolyline.prototype.paintLine = function(c, pts, rounded) {
  let arcSize = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2
  c.begin()
  this.addPoints(c, pts, rounded, arcSize, false)
  c.stroke()
}

/**
 * Function: paintLine
 *
 * Paints the line shape.
 */
MxPolyline.prototype.paintCurvedLine = function(c, pts) {
  c.begin()

  let pt = pts[0]
  let n = pts.length

  c.moveTo(pt.x, pt.y)

  for (let i = 1; i < n - 2; i++) {
    let p0 = pts[i]
    let p1 = pts[i + 1]
    let ix = (p0.x + p1.x) / 2
    let iy = (p0.y + p1.y) / 2

    c.quadTo(p0.x, p0.y, ix, iy)
  }

  let p0 = pts[n - 2]
  let p1 = pts[n - 1]

  c.quadTo(p0.x, p0.y, p1.x, p1.y)
  c.stroke()
}
