import MxShape from './MxShape'
import MxUtils from '../util/MxUtils'
import MxConstants from '../util/MxConstants'

/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxRectangleShape
 *
 * Extends <MxShape> to implement a rectangle shape.
 * This shape is registered under <MxConstants.SHAPE_RECTANGLE>
 * in <mxCellRenderer>.
 *
 * Constructor: MxRectangleShape
 *
 * Constructs a new rectangle shape.
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

export default class MxRectangleShape {
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
MxUtils.extend(MxRectangleShape, MxShape)

/**
 * Function: isHtmlAllowed
 *
 * Returns true for non-rounded, non-rotated shapes with no glass gradient.
 */
MxRectangleShape.prototype.isHtmlAllowed = function() {
  let events = true

  if (this.style !== null) {
    events = MxUtils.getValue(this.style, MxConstants.STYLE_POINTER_EVENTS, '1') === '1'
  }

  return !this.isRounded && !this.glass && this.rotation === 0 && (events || (this.fill !== null && this.fill !== MxConstants.NONE))
}

/**
 * Function: paintBackground
 *
 * Generic background painting implementation.
 */
MxRectangleShape.prototype.paintBackground = function(c, x, y, w, h) {
  let events = true

  if (this.style !== null) {
    events = MxUtils.getValue(this.style, MxConstants.STYLE_POINTER_EVENTS, '1') === '1'
  }

  if (events || (this.fill !== null && this.fill !== MxConstants.NONE) || (this.stroke !== null && this.stroke !== MxConstants.NONE)) {
    if (!events && (this.fill == null || this.fill === MxConstants.NONE)) {
      c.pointerEvents = false
    }

    if (this.isRounded) {
      let r = 0

      if (MxUtils.getValue(this.style, MxConstants.STYLE_ABSOLUTE_ARCSIZE, 0) === '1') {
        r = Math.min(w / 2, Math.min(h / 2, MxUtils.getValue(this.style,
          MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2))
      } else {
        let f = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE,
          MxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100
        r = Math.min(w * f, h * f)
      }

      c.roundrect(x, y, w, h, r, r)
    } else {
      c.rect(x, y, w, h)
    }

    c.fillAndStroke()
  }
}

/**
 * Function: paintForeground
 *
 * Generic background painting implementation.
 */
MxRectangleShape.prototype.paintForeground = function(c, x, y, w, h) {
  if (this.glass && !this.outline && this.fill !== null && this.fill !== MxConstants.NONE) {
    this.paintGlassEffect(c, x, y, w, h, this.getArcSize(w + this.strokewidth, h + this.strokewidth))
  }
}
