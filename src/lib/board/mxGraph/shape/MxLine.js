import MxShape from './MxShape'
import MxUtils from '../util/MxUtils'

/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxLine
 *
 * Extends <MxShape> to implement a horizontal line shape.
 * This shape is registered under <mxConstants.SHAPE_LINE> in
 * <mxCellRenderer>.
 *
 * Constructor: MxLine
 *
 * Constructs a new line shape.
 *
 * Parameters:
 *
 * bounds - <mxRectangle> that defines the bounds. This is stored in
 * <MxShape.bounds>.
 * stroke - String that defines the stroke color. Default is 'black'. This is
 * stored in <stroke>.
 * strokewidth - Optional integer that defines the stroke width. Default is
 * 1. This is stored in <strokewidth>.
 */
export default class MxLine {
  constructor(bounds, stroke, strokewidth) {
    MxShape.call(this)
    this.bounds = bounds
    this.stroke = stroke
    this.strokewidth = (strokewidth != null) ? strokewidth : 1
  };
}

/**
 * Extends MxShape.
 */
MxUtils.extend(MxLine, MxShape)

/**
 * Function: paintVertexShape
 *
 * Redirects to redrawPath for subclasses to work.
 */
MxLine.prototype.paintVertexShape = function(c, x, y, w, h) {
  var mid = y + h / 2

  c.begin()
  c.moveTo(x, mid)
  c.lineTo(x + w, mid)
  c.stroke()
}
