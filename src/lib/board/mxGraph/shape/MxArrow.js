import MxShape from './MxShape'
import MxUtils from '../util/MxUtils'
import MxConstants from '../util/MxConstants'
/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxArrow
 *
 * Extends <MxShape> to implement an arrow shape. (The shape
 * is used to represent edges, not vertices.)
 * This shape is registered under <MxConstants.SHAPE_ARROW>
 * in <mxCellRenderer>.
 *
 * Constructor: MxArrow
 *
 * Constructs a new arrow shape.
 *
 * Parameters:
 *
 * points - Array of <mxPoints> that define the points. This is stored in
 * <MxShape.points>.
 * fill - String that defines the fill color. This is stored in <fill>.
 * stroke - String that defines the stroke color. This is stored in <stroke>.
 * strokewidth - Optional integer that defines the stroke width. Default is
 * 1. This is stored in <strokewidth>.
 * arrowWidth - Optional integer that defines the arrow width. Default is
 * <MxConstants.ARROW_WIDTH>. This is stored in <arrowWidth>.
 * spacing - Optional integer that defines the spacing between the arrow shape
 * and its endpoints. Default is <MxConstants.ARROW_SPACING>. This is stored in
 * <spacing>.
 * endSize - Optional integer that defines the size of the arrowhead. Default
 * is <MxConstants.ARROW_SIZE>. This is stored in <endSize>.
 */

export default class MxArrow {
  constructor(points, fill, stroke, strokewidth, arrowWidth, spacing, endSize) {
    MxShape.call(this)
    this.points = points
    this.fill = fill
    this.stroke = stroke
    this.strokewidth = (strokewidth != null) ? strokewidth : 1
    this.arrowWidth = (arrowWidth != null) ? arrowWidth : MxConstants.ARROW_WIDTH
    this.spacing = (spacing != null) ? spacing : MxConstants.ARROW_SPACING
    this.endSize = (endSize != null) ? endSize : MxConstants.ARROW_SIZE
  };
}

/**
 * Extends MxShape.
 */
MxUtils.extend(MxArrow, MxShape)

/**
 * Function: augmentBoundingBox
 *
 * Augments the bounding box with the edge width and markers.
 */
MxArrow.prototype.augmentBoundingBox = function(bbox) {
  MxShape.prototype.augmentBoundingBox.apply(this, arguments)

  let w = Math.max(this.arrowWidth, this.endSize)
  bbox.grow((w / 2 + this.strokewidth) * this.scale)
}

/**
 * Function: paintEdgeShape
 *
 * Paints the line shape.
 */
MxArrow.prototype.paintEdgeShape = function(c, pts) {
  // Geometry of arrow
  let spacing = MxConstants.ARROW_SPACING
  let width = MxConstants.ARROW_WIDTH
  let arrow = MxConstants.ARROW_SIZE

  // Base vector (between end points)
  let p0 = pts[0]
  let pe = pts[pts.length - 1]
  let dx = pe.x - p0.x
  let dy = pe.y - p0.y
  let dist = Math.sqrt(dx * dx + dy * dy)
  let length = dist - 2 * spacing - arrow

  // Computes the norm and the inverse norm
  let nx = dx / dist
  let ny = dy / dist
  let basex = length * nx
  let basey = length * ny
  let floorx = width * ny / 3
  let floory = -width * nx / 3

  // Computes points
  let p0x = p0.x - floorx / 2 + spacing * nx
  let p0y = p0.y - floory / 2 + spacing * ny
  let p1x = p0x + floorx
  let p1y = p0y + floory
  let p2x = p1x + basex
  let p2y = p1y + basey
  let p3x = p2x + floorx
  let p3y = p2y + floory
  // p4 not necessary
  let p5x = p3x - 3 * floorx
  let p5y = p3y - 3 * floory

  c.begin()
  c.moveTo(p0x, p0y)
  c.lineTo(p1x, p1y)
  c.lineTo(p2x, p2y)
  c.lineTo(p3x, p3y)
  c.lineTo(pe.x - spacing * nx, pe.y - spacing * ny)
  c.lineTo(p5x, p5y)
  c.lineTo(p5x + floorx, p5y + floory)
  c.close()

  c.fillAndStroke()
}
