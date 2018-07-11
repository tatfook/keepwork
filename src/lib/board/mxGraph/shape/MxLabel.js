import MxRectangleShape from './MxRectangleShape'
import MxUtils from '../util/MxUtils'
import MxConstants from '../util/MxConstants'
import MxShape from './MxShape'
import MxRectangle from '../util/MxRectangle'
/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxLabel
 *
 * Extends <MxShape> to implement an image shape with a label.
 * This shape is registered under <MxConstants.SHAPE_LABEL> in
 * <mxCellRenderer>.
 *
 * Constructor: MxLabel
 *
 * Constructs a new label shape.
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
export default class MxLabel {
  constructor(bounds, fill, stroke, strokewidth) {
    MxRectangleShape.call(this, bounds, fill, stroke, strokewidth)
  };
}

/**
 * Extends MxShape.
 */
MxUtils.extend(MxLabel, MxRectangleShape)

/**
 * letiable: imageSize
 *
 * Default width and height for the image. Default is
 * <MxConstants.DEFAULT_IMAGESIZE>.
 */
MxLabel.prototype.imageSize = MxConstants.DEFAULT_IMAGESIZE

/**
 * letiable: spacing
 *
 * Default value for image spacing. Default is 2.
 */
MxLabel.prototype.spacing = 2

/**
 * letiable: indicatorSize
 *
 * Default width and height for the indicicator. Default is 10.
 */
MxLabel.prototype.indicatorSize = 10

/**
 * letiable: indicatorSpacing
 *
 * Default spacing between image and indicator. Default is 2.
 */
MxLabel.prototype.indicatorSpacing = 2

/**
 * Function: init
 *
 * Initializes the shape and the <indicator>.
 */
MxLabel.prototype.init = function(container) {
  MxShape.prototype.init.apply(this, arguments)

  if (this.IndicatorShape !== null) {
    this.indicator = new this.IndicatorShape()
    this.indicator.dialect = this.dialect
    this.indicator.init(this.node)
  }
}

/**
 * Function: redraw
 *
 * Reconfigures this shape. This will update the colors of the indicator
 * and reconfigure it if required.
 */
MxLabel.prototype.redraw = function() {
  if (this.indicator !== null) {
    this.indicator.fill = this.indicatorColor
    this.indicator.stroke = this.indicatorStrokeColor
    this.indicator.gradient = this.indicatorGradientColor
    this.indicator.direction = this.indicatorDirection
  }

  MxShape.prototype.redraw.apply(this, arguments)
}

/**
 * Function: isHtmlAllowed
 *
 * Returns true for non-rounded, non-rotated shapes with no glass gradient and
 * no indicator shape.
 */
MxLabel.prototype.isHtmlAllowed = function() {
  return MxRectangleShape.prototype.isHtmlAllowed.apply(this, arguments) && this.indicatorColor == null && this.IndicatorShape == null
}

/**
 * Function: paintForeground
 *
 * Generic background painting implementation.
 */
MxLabel.prototype.paintForeground = function(c, x, y, w, h) {
  this.paintImage(c, x, y, w, h)
  this.paintIndicator(c, x, y, w, h)

  MxRectangleShape.prototype.paintForeground.apply(this, arguments)
}

/**
 * Function: paintImage
 *
 * Generic background painting implementation.
 */
MxLabel.prototype.paintImage = function(c, x, y, w, h) {
  if (this.image !== null) {
    let bounds = this.getImageBounds(x, y, w, h)
    c.image(bounds.x, bounds.y, bounds.width, bounds.height, this.image, false, false, false)
  }
}

/**
 * Function: getImageBounds
 *
 * Generic background painting implementation.
 */
MxLabel.prototype.getImageBounds = function(x, y, w, h) {
  let align = MxUtils.getValue(this.style, MxConstants.STYLE_IMAGE_ALIGN, MxConstants.ALIGN_LEFT)
  let valign = MxUtils.getValue(this.style, MxConstants.STYLE_IMAGE_VERTICAL_ALIGN, MxConstants.ALIGN_MIDDLE)
  let width = MxUtils.getNumber(this.style, MxConstants.STYLE_IMAGE_WIDTH, MxConstants.DEFAULT_IMAGESIZE)
  let height = MxUtils.getNumber(this.style, MxConstants.STYLE_IMAGE_HEIGHT, MxConstants.DEFAULT_IMAGESIZE)
  let spacing = MxUtils.getNumber(this.style, MxConstants.STYLE_SPACING, this.spacing) + 5

  if (align === MxConstants.ALIGN_CENTER) {
    x += (w - width) / 2
  } else if (align === MxConstants.ALIGN_RIGHT) {
    x += w - width - spacing
  } else {
    // default is left
    x += spacing
  }

  if (valign === MxConstants.ALIGN_TOP) {
    y += spacing
  } else if (valign === MxConstants.ALIGN_BOTTOM) {
    y += h - height - spacing
  } else {
    // default is middle
    y += (h - height) / 2
  }

  return new MxRectangle(x, y, width, height)
}

/**
 * Function: paintIndicator
 *
 * Generic background painting implementation.
 */
MxLabel.prototype.paintIndicator = function(c, x, y, w, h) {
  if (this.indicator !== null) {
    this.indicator.bounds = this.getIndicatorBounds(x, y, w, h)
    this.indicator.paint(c)
  } else if (this.indicatorImage !== null) {
    let bounds = this.getIndicatorBounds(x, y, w, h)
    c.image(bounds.x, bounds.y, bounds.width, bounds.height, this.indicatorImage, false, false, false)
  }
}

/**
 * Function: getIndicatorBounds
 *
 * Generic background painting implementation.
 */
MxLabel.prototype.getIndicatorBounds = function(x, y, w, h) {
  let align = MxUtils.getValue(this.style, MxConstants.STYLE_IMAGE_ALIGN, MxConstants.ALIGN_LEFT)
  let valign = MxUtils.getValue(this.style, MxConstants.STYLE_IMAGE_VERTICAL_ALIGN, MxConstants.ALIGN_MIDDLE)
  let width = MxUtils.getNumber(this.style, MxConstants.STYLE_INDICATOR_WIDTH, this.indicatorSize)
  let height = MxUtils.getNumber(this.style, MxConstants.STYLE_INDICATOR_HEIGHT, this.indicatorSize)
  let spacing = this.spacing + 5

  if (align === MxConstants.ALIGN_RIGHT) {
    x += w - width - spacing
  } else if (align === MxConstants.ALIGN_CENTER) {
    x += (w - width) / 2
  } else {
    // default is left
    x += spacing
  }

  if (valign === MxConstants.ALIGN_BOTTOM) {
    y += h - height - spacing
  } else if (valign === MxConstants.ALIGN_TOP) {
    y += spacing
  } else {
    // default is middle
    y += (h - height) / 2
  }

  return new MxRectangle(x, y, width, height)
}
/**
 * Function: redrawHtmlShape
 *
 * Generic background painting implementation.
 */
MxLabel.prototype.redrawHtmlShape = function() {
  MxRectangleShape.prototype.redrawHtmlShape.apply(this, arguments)

  // Removes all children
  while (this.node.hasChildNodes()) {
    this.node.removeChild(this.node.lastChild)
  }

  if (this.image !== null) {
    let node = document.createElement('img')
    node.style.position = 'relative'
    node.setAttribute('border', '0')

    let bounds = this.getImageBounds(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height)
    bounds.x -= this.bounds.x
    bounds.y -= this.bounds.y

    node.style.left = Math.round(bounds.x) + 'px'
    node.style.top = Math.round(bounds.y) + 'px'
    node.style.width = Math.round(bounds.width) + 'px'
    node.style.height = Math.round(bounds.height) + 'px'

    node.src = this.image

    this.node.appendChild(node)
  }
}
