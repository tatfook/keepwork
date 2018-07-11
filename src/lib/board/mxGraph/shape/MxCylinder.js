import MxShape from './MxShape'
import MxUtils from '../util/MxUtils'

/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxCylinder
 *
 * Extends <MxShape> to implement an cylinder shape. If a
 * custom shape with one filled area and an overlay path is
 * needed, then this shape's <redrawPath> should be overridden.
 * This shape is registered under <mxConstants.SHAPE_CYLINDER>
 * in <mxCellRenderer>.
 *
 * Constructor: MxCylinder
 *
 * Constructs a new cylinder shape.
 *
 * Parameters:
 *
 * bounds - <mxRectangle> that defines the bounds. This is stored in
 * <MxShape.bounds>.
 * fill - String that defines the fill color. This is stored in <fill>.
 * stroke - String that defines the stroke color. This is stored in <stroke>.
 * strokewidth - Optional integer that defines the stroke width. Default is
 * 1. This is stored in <strokewidth>.
 */

export default class MxCylinder {
  constructor(bounds, fill, stroke, strokewidth) {
    MxShape.call(this)
    this.bounds = bounds
    this.fill = fill
    this.stroke = stroke
    this.strokewidth = (strokewidth !== null) ? strokewidth : 1
  };
}

/**
 * Extends MxShape.
 */
MxUtils.extend(MxCylinder, MxShape)

/**
 * letiable: maxHeight
 *
 * Defines the maximum height of the top and bottom part
 * of the cylinder shape.
 */
MxCylinder.prototype.maxHeight = 40

/**
 * letiable: svgStrokeTolerance
 *
 * Sets stroke tolerance to 0 for SVG.
 */
MxCylinder.prototype.svgStrokeTolerance = 0

/**
 * Function: paintVertexShape
 *
 * Redirects to redrawPath for subclasses to work.
 */
MxCylinder.prototype.paintVertexShape = function(c, x, y, w, h) {
  c.translate(x, y)
  c.begin()
  this.redrawPath(c, x, y, w, h, false)
  c.fillAndStroke()

  c.setShadow(false)

  c.begin()
  this.redrawPath(c, x, y, w, h, true)
  c.stroke()
}

/**
 * Function: redrawPath
 *
 * Draws the path for this shape.
 */
MxCylinder.prototype.redrawPath = function(c, x, y, w, h, isForeground) {
  let dy = Math.min(this.maxHeight, Math.round(h / 5))

  if ((isForeground && this.fill !== null) || (!isForeground && this.fill == null)) {
    c.moveTo(0, dy)
    c.curveTo(0, 2 * dy, w, 2 * dy, w, dy)

    // Needs separate shapes for correct hit-detection
    if (!isForeground) {
      c.stroke()
      c.begin()
    }
  }

  if (!isForeground) {
    c.moveTo(0, dy)
    c.curveTo(0, -dy / 3, w, -dy / 3, w, dy)
    c.lineTo(w, h - dy)
    c.curveTo(w, h + dy / 3, 0, h + dy / 3, 0, h - dy)
    c.close()
  }
}
