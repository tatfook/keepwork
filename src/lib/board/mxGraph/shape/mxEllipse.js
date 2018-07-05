import MxShape from './MxShape'
import MxUtils from '../util/MxUtils'

/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxEllipse
 *
 * Extends <MxShape> to implement an ellipse shape.
 * This shape is registered under <mxConstants.SHAPE_ELLIPSE>
 * in <mxCellRenderer>.
 *
 * Constructor: MxEllipse
 *
 * Constructs a new ellipse shape.
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

export default class MxEllipse {
  constructor(bounds, fill, stroke, strokewidth) {
    MxShape.call(this)
    this.bounds = bounds
    this.fill = fill
    this.stroke = stroke
    this.strokewidth = (strokewidth != null) ? strokewidth : 1
  };
}

/**
 * Extends MxShape.
 */
MxUtils.extend(MxEllipse, MxShape)

/**
 * Function: paintVertexShape
 *
 * Paints the ellipse shape.
 */
MxEllipse.prototype.paintVertexShape = function(c, x, y, w, h) {
  c.ellipse(x, y, w, h)
  c.fillAndStroke()
}
