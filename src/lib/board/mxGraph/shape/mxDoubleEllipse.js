import MxShape from './MxShape'
import MxUtils from '../util/MxUtils'
import MxConstants from '../util/MxConstants'
import MxRectangle from '../util/MxRectangle'

/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxDoubleEllipse
 *
 * Extends <MxShape> to implement a double ellipse shape. This shape is
 * registered under <MxConstants.SHAPE_DOUBLE_ELLIPSE> in <mxCellRenderer>.
 * Use the following override to only fill the inner ellipse in this shape:
 *
 * (code)
 * MxDoubleEllipse.prototype.paintVertexShape = function(c, x, y, w, h)
 * {
 *   c.ellipse(x, y, w, h);
 *   c.stroke();
 *
 *   let inset = MxUtils.getValue(this.style, MxConstants.STYLE_MARGIN, Math.min(3 + this.strokewidth, Math.min(w / 5, h / 5)));
 *   x += inset;
 *   y += inset;
 *   w -= 2 * inset;
 *   h -= 2 * inset;
 *
 *   if (w > 0 && h > 0)
 *   {
 *     c.ellipse(x, y, w, h);
 *   }
 *
 *   c.fillAndStroke();
 * };
 * (end)
 *
 * Constructor: MxDoubleEllipse
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

export default class MxDoubleEllipse {
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
MxUtils.extend(MxDoubleEllipse, MxShape)

/**
 * letiable: vmlScale
 *
 * Scale for improving the precision of VML rendering. Default is 10.
 */
MxDoubleEllipse.prototype.vmlScale = 10

/**
 * Function: paintBackground
 *
 * Paints the background.
 */
MxDoubleEllipse.prototype.paintBackground = function(c, x, y, w, h) {
  c.ellipse(x, y, w, h)
  c.fillAndStroke()
}

/**
 * Function: paintForeground
 *
 * Paints the foreground.
 */
MxDoubleEllipse.prototype.paintForeground = function(c, x, y, w, h) {
  if (!this.outline) {
    let margin = MxUtils.getValue(this.style, MxConstants.STYLE_MARGIN, Math.min(3 + this.strokewidth, Math.min(w / 5, h / 5)))
    x += margin
    y += margin
    w -= 2 * margin
    h -= 2 * margin

    // FIXME: Rounding issues in IE8 standards mode (not in 1.x)
    if (w > 0 && h > 0) {
      c.ellipse(x, y, w, h)
    }

    c.stroke()
  }
}

/**
 * Function: getLabelBounds
 *
 * Returns the bounds for the label.
 */
MxDoubleEllipse.prototype.getLabelBounds = function(rect) {
  let margin = (MxUtils.getValue(this.style, MxConstants.STYLE_MARGIN, Math.min(3 + this.strokewidth,
    Math.min(rect.width / 5 / this.scale, rect.height / 5 / this.scale)))) * this.scale

  return new MxRectangle(rect.x + margin, rect.y + margin, rect.width - 2 * margin, rect.height - 2 * margin)
}
