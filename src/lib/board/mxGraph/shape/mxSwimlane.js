import MxShape from './MxShape'
import MxUtils from '../util/MxUtils'
import MxRectangle from './MxRectangle'
import MxConstants from '../util/MxConstants'

/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxSwimlane
 *
 * Extends <MxShape> to implement a swimlane shape. This shape is registered
 * under <MxConstants.SHAPE_SWIMLANE> in <mxCellRenderer>. Use the
 * <MxConstants.STYLE_STYLE_STARTSIZE> to define the size of the title
 * region, <MxConstants.STYLE_SWIMLANE_FILLCOLOR> for the content area fill,
 * <MxConstants.STYLE_SEPARATORCOLOR> to draw an additional vertical separator
 * and <MxConstants.STYLE_SWIMLANE_LINE> to hide the line between the title
 * region and the content area. The <MxConstants.STYLE_HORIZONTAL> affects
 * the orientation of this shape, not only its label.
 *
 * Constructor: mxSwimlane
 *
 * Constructs a new swimlane shape.
 *
 * Parameters:
 *
 * bounds - <MxRectangle> that defines the bounds. This is stored in
 * <MxShape.bounds>.
 * fill - String that defines the fill color. This is stored in <fill>.
 * stroke - String that defines the stroke color. This is stored in <stroke>.
 * strokewidth - Optional integer that defines the stroke width. Default is
 * 1. This is stored in <strokewidth>.
 */

export default class mxSwimlane {
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
MxUtils.extend(mxSwimlane, MxShape)

/**
 * letiable: imageSize
 *
 * Default imagewidth and imageheight if an image but no imagewidth
 * and imageheight are defined in the style. Value is 16.
 */
mxSwimlane.prototype.imageSize = 16

/**
 * Function: getGradientBounds
 *
 * Returns the bounding box for the gradient box for this shape.
 */
mxSwimlane.prototype.getTitleSize = function() {
  return Math.max(0, MxUtils.getValue(this.style, MxConstants.STYLE_STARTSIZE, MxConstants.DEFAULT_STARTSIZE))
}

/**
 * Function: getGradientBounds
 *
 * Returns the bounding box for the gradient box for this shape.
 */
mxSwimlane.prototype.getLabelBounds = function(rect) {
  let start = this.getTitleSize()
  let bounds = new MxRectangle(rect.x, rect.y, rect.width, rect.height)
  let horizontal = this.isHorizontal()

  let flipH = MxUtils.getValue(this.style, MxConstants.STYLE_FLIPH, 0) === 1
  let flipV = MxUtils.getValue(this.style, MxConstants.STYLE_FLIPV, 0) === 1

  // East is default
  let shapeVertical = (this.direction === MxConstants.DIRECTION_NORTH || this.direction === MxConstants.DIRECTION_SOUTH)
  let realHorizontal = horizontal === !shapeVertical

  let realFlipH = !realHorizontal && flipH !== (this.direction === MxConstants.DIRECTION_SOUTH || this.direction === MxConstants.DIRECTION_WEST)
  let realFlipV = realHorizontal && flipV !== (this.direction === MxConstants.DIRECTION_SOUTH || this.direction === MxConstants.DIRECTION_WEST)

  // Shape is horizontal
  if (!shapeVertical) {
    let tmp = Math.min(bounds.height, start * this.scale)

    if (realFlipH || realFlipV) {
      bounds.y += bounds.height - tmp
    }

    bounds.height = tmp
  } else {
    let tmp = Math.min(bounds.width, start * this.scale)

    if (realFlipH || realFlipV) {
      bounds.x += bounds.width - tmp
    }

    bounds.width = tmp
  }

  return bounds
}

/**
 * Function: getGradientBounds
 *
 * Returns the bounding box for the gradient box for this shape.
 */
mxSwimlane.prototype.getGradientBounds = function(c, x, y, w, h) {
  let start = this.getTitleSize()

  if (this.isHorizontal()) {
    start = Math.min(start, h)
    return new MxRectangle(x, y, w, start)
  } else {
    start = Math.min(start, w)
    return new MxRectangle(x, y, start, h)
  }
}

/**
 * Function: getArcSize
 *
 * Returns the arcsize for the swimlane.
 */
mxSwimlane.prototype.getArcSize = function(w, h, start) {
  let f = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100

  return start * f * 3
}

/**
 * Function: paintVertexShape
 *
 * Paints the swimlane vertex shape.
 */
mxSwimlane.prototype.isHorizontal = function() {
  return MxUtils.getValue(this.style, MxConstants.STYLE_HORIZONTAL, 1) === 1
}

/**
 * Function: paintVertexShape
 *
 * Paints the swimlane vertex shape.
 */
mxSwimlane.prototype.paintVertexShape = function(c, x, y, w, h) {
  let start = this.getTitleSize()
  let fill = MxUtils.getValue(this.style, MxConstants.STYLE_SWIMLANE_FILLCOLOR, MxConstants.NONE)
  let swimlaneLine = MxUtils.getValue(this.style, MxConstants.STYLE_SWIMLANE_LINE, 1) === 1
  let r = 0

  if (this.isHorizontal()) {
    start = Math.min(start, h)
  } else {
    start = Math.min(start, w)
  }

  c.translate(x, y)

  if (!this.isRounded) {
    this.paintSwimlane(c, x, y, w, h, start, fill, swimlaneLine)
  } else {
    r = this.getArcSize(w, h, start)
    this.paintRoundedSwimlane(c, x, y, w, h, start, r, fill, swimlaneLine)
  }

  let sep = MxUtils.getValue(this.style, MxConstants.STYLE_SEPARATORCOLOR, MxConstants.NONE)
  this.paintSeparator(c, x, y, w, h, start, sep)

  if (this.image !== null) {
    let bounds = this.getImageBounds(x, y, w, h)
    c.image(bounds.x - x, bounds.y - y, bounds.width, bounds.height,
      this.image, false, false, false)
  }

  if (this.glass) {
    c.setShadow(false)
    this.paintGlassEffect(c, 0, 0, w, start, r)
  }
}

/**
 * Function: paintSwimlane
 *
 * Paints the swimlane vertex shape.
 */
mxSwimlane.prototype.paintSwimlane = function(c, x, y, w, h, start, fill, swimlaneLine) {
  if (fill !== MxConstants.NONE) {
    c.save()
    c.setFillColor(fill)
    c.rect(0, 0, w, h)
    c.fillAndStroke()
    c.restore()
    c.setShadow(false)
  }

  c.begin()

  if (start === 0) {
    start = h
  }

  if (this.isHorizontal()) {
    c.moveTo(0, start)
    c.lineTo(0, 0)
    c.lineTo(w, 0)
    c.lineTo(w, start)

    if (swimlaneLine || start >= h) {
      c.close()
    }

    c.fillAndStroke()

    // Transparent content area
    if (start < h && fill === MxConstants.NONE) {
      c.pointerEvents = false

      c.begin()
      c.moveTo(0, start)
      c.lineTo(0, h)
      c.lineTo(w, h)
      c.lineTo(w, start)
      c.stroke()
    }
  } else {
    c.moveTo(start, 0)
    c.lineTo(0, 0)
    c.lineTo(0, h)
    c.lineTo(start, h)

    if (swimlaneLine || start >= w) {
      c.close()
    }

    c.fillAndStroke()

    // Transparent content area
    if (start < w && fill === MxConstants.NONE) {
      c.pointerEvents = false

      c.begin()
      c.moveTo(start, 0)
      c.lineTo(w, 0)
      c.lineTo(w, h)
      c.lineTo(start, h)
      c.stroke()
    }
  }
}

/**
 * Function: paintRoundedSwimlane
 *
 * Paints the swimlane vertex shape.
 */
mxSwimlane.prototype.paintRoundedSwimlane = function(c, x, y, w, h, start, r, fill, swimlaneLine) {
  r = Math.min(h - start, Math.min(start, r))

  if (fill !== MxConstants.NONE) {
    c.save()
    c.setFillColor(fill)
    c.roundrect(0, 0, w, h, r, r)
    c.fillAndStroke()
    c.restore()
    c.setShadow(false)
  }

  c.begin()

  if (this.isHorizontal()) {
    c.moveTo(w, start)
    c.lineTo(w, r)
    c.quadTo(w, 0, w - Math.min(w / 2, r), 0)
    c.lineTo(Math.min(w / 2, r), 0)
    c.quadTo(0, 0, 0, r)
    c.lineTo(0, start)

    if (swimlaneLine || start >= h) {
      c.close()
    }

    c.fillAndStroke()

    // Transparent content area
    if (start < h && fill === MxConstants.NONE) {
      c.pointerEvents = false

      c.begin()
      c.moveTo(0, start)
      c.lineTo(0, h - r)
      c.quadTo(0, h, Math.min(w / 2, r), h)
      c.lineTo(w - Math.min(w / 2, r), h)
      c.quadTo(w, h, w, h - r)
      c.lineTo(w, start)
      c.stroke()
    }
  } else {
    c.moveTo(start, 0)
    c.lineTo(r, 0)
    c.quadTo(0, 0, 0, Math.min(h / 2, r))
    c.lineTo(0, h - Math.min(h / 2, r))
    c.quadTo(0, h, r, h)
    c.lineTo(start, h)

    if (swimlaneLine || start >= w) {
      c.close()
    }

    c.fillAndStroke()

    // Transparent content area
    if (start < w && fill === MxConstants.NONE) {
      c.pointerEvents = false

      c.begin()
      c.moveTo(start, h)
      c.lineTo(w - r, h)
      c.quadTo(w, h, w, h - Math.min(h / 2, r))
      c.lineTo(w, Math.min(h / 2, r))
      c.quadTo(w, 0, w - r, 0)
      c.lineTo(start, 0)
      c.stroke()
    }
  }
}

/**
 * Function: paintSwimlane
 *
 * Paints the swimlane vertex shape.
 */
mxSwimlane.prototype.paintSeparator = function(c, x, y, w, h, start, color) {
  if (color !== MxConstants.NONE) {
    c.setStrokeColor(color)
    c.setDashed(true)
    c.begin()

    if (this.isHorizontal()) {
      c.moveTo(w, start)
      c.lineTo(w, h)
    } else {
      c.moveTo(start, 0)
      c.lineTo(w, 0)
    }

    c.stroke()
    c.setDashed(false)
  }
}

/**
 * Function: getImageBounds
 *
 * Paints the swimlane vertex shape.
 */
mxSwimlane.prototype.getImageBounds = function(x, y, w, h) {
  if (this.isHorizontal()) {
    return new MxRectangle(x + w - this.imageSize, y, this.imageSize, this.imageSize)
  } else {
    return new MxRectangle(x, y, this.imageSize, this.imageSize)
  }
}
