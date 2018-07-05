import MxShape from './MxShape'
import MxUtils from '../util/MxUtils'
import MxPoint from '../util/MxPoint'
import MxConstants from '../util/MxConstants'
/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxRhombus
 *
 * Extends <MxShape> to implement a rhombus (aka diamond) shape.
 * This shape is registered under <MxConstants.SHAPE_RHOMBUS>
 * in <mxCellRenderer>.
 *
 * Constructor: mxRhombus
 *
 * Constructs a new rhombus shape.
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
export default class mxRhombus {
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
MxUtils.extend(mxRhombus, MxShape)

/**
 * Function: paintVertexShape
 *
 * Generic painting implementation.
 */
mxRhombus.prototype.paintVertexShape = function(c, x, y, w, h) {
  var hw = w / 2
  var hh = h / 2

  var arcSize = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2
  c.begin()
  this.addPoints(c, [new MxPoint(x + hw, y), new MxPoint(x + w, y + hh), new MxPoint(x + hw, y + h), new MxPoint(x, y + hh)], this.isRounded, arcSize, true)
  c.fillAndStroke()
}
