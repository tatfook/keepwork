import MxShape from './MxShape'
import MxUtils from '../util/MxUtils'
import MxConstants from '../util/MxConstants'
import MxClient from '../MxClient'
import MxRectangleShape from './MxRectangleShape'
/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxImageShape
 *
 * Extends <MxShape> to implement an image shape. This shape is registered
 * under <MxConstants.SHAPE_IMAGE> in <mxCellRenderer>.
 *
 * Constructor: MxImageShape
 *
 * Constructs a new image shape.
 *
 * Parameters:
 *
 * bounds - <mxRectangle> that defines the bounds. This is stored in
 * <MxShape.bounds>.
 * image - String that specifies the URL of the image. This is stored in
 * <image>.
 * fill - String that defines the fill color. This is stored in <fill>.
 * stroke - String that defines the stroke color. This is stored in <stroke>.
 * strokewidth - Optional integer that defines the stroke width. Default is
 * 0. This is stored in <strokewidth>.
 */

export default class MxImageShape {
  constructor(bounds, image, fill, stroke, strokewidth) {
    MxShape.call(this)
    this.bounds = bounds
    this.image = image
    this.fill = fill
    this.stroke = stroke
    this.strokewidth = (strokewidth !== null) ? strokewidth : 1
    this.shadow = false
  };
}

/**
 * Extends MxShape.
 */
MxUtils.extend(MxImageShape, MxRectangleShape)

/**
 * letiable: preserveImageAspect
 *
 * Switch to preserve image aspect. Default is true.
 */
MxImageShape.prototype.preserveImageAspect = true

/**
 * Function: getSvgScreenOffset
 *
 * Disables offset in IE9 for crisper image output.
 */
MxImageShape.prototype.getSvgScreenOffset = function() {
  return 0
}

/**
 * Function: apply
 *
 * Overrides <MxShape.apply> to replace the fill and stroke colors with the
 * respective values from <MxConstants.STYLE_IMAGE_BACKGROUND> and
 * <MxConstants.STYLE_IMAGE_BORDER>.
 *
 * Applies the style of the given <mxCellState> to the shape. This
 * implementation assigns the following styles to local fields:
 *
 * - <MxConstants.STYLE_IMAGE_BACKGROUND> => fill
 * - <MxConstants.STYLE_IMAGE_BORDER> => stroke
 *
 * Parameters:
 *
 * state - <mxCellState> of the corresponding cell.
 */

MxImageShape.prototype.apply = function(state) {
  MxShape.prototype.apply.apply(this, arguments)

  this.fill = null
  this.stroke = null
  this.gradient = null

  if (this.style !== null) {
    this.preserveImageAspect = MxUtils.getNumber(this.style, MxConstants.STYLE_IMAGE_ASPECT, 1) === 1

    // Legacy support for imageFlipH/V
    this.flipH = this.flipH || MxUtils.getValue(this.style, 'imageFlipH', 0) === 1
    this.flipV = this.flipV || MxUtils.getValue(this.style, 'imageFlipV', 0) === 1
  }
}

/**
 * Function: isHtmlAllowed
 *
 * Returns true if HTML is allowed for this shape. This implementation always
 * returns false.
 */
MxImageShape.prototype.isHtmlAllowed = function() {
  return !this.preserveImageAspect
}

/**
 * Function: createHtml
 *
 * Creates and returns the HTML DOM node(s) to represent
 * this shape. This implementation falls back to <createVml>
 * so that the HTML creation is optional.
 */
MxImageShape.prototype.createHtml = function() {
  let node = document.createElement('div')
  node.style.position = 'absolute'

  return node
}

/**
 * Function: paintVertexShape
 *
 * Generic background painting implementation.
 */
MxImageShape.prototype.paintVertexShape = function(c, x, y, w, h) {
  if (this.image !== null) {
    let fill = MxUtils.getValue(this.style, MxConstants.STYLE_IMAGE_BACKGROUND, null)
    let stroke = MxUtils.getValue(this.style, MxConstants.STYLE_IMAGE_BORDER, null)

    if (fill !== null) {
      // Stroke rendering required for shadow
      c.setFillColor(fill)
      c.setStrokeColor(stroke)
      c.rect(x, y, w, h)
      c.fillAndStroke()
    }

    // FlipH/V are implicit via MxShape.updateTransform
    c.image(x, y, w, h, this.image, this.preserveImageAspect, false, false)

    stroke = MxUtils.getValue(this.style, MxConstants.STYLE_IMAGE_BORDER, null)

    if (stroke !== null) {
      c.setShadow(false)
      c.setStrokeColor(stroke)
      c.rect(x, y, w, h)
      c.stroke()
    }
  } else {
    MxRectangleShape.prototype.paintBackground.apply(this, arguments)
  }
}

/**
 * Function: redraw
 *
 * Overrides <MxShape.redraw> to preserve the aspect ratio of images.
 */
MxImageShape.prototype.redrawHtmlShape = function() {
  this.node.style.left = Math.round(this.bounds.x) + 'px'
  this.node.style.top = Math.round(this.bounds.y) + 'px'
  this.node.style.width = Math.max(0, Math.round(this.bounds.width)) + 'px'
  this.node.style.height = Math.max(0, Math.round(this.bounds.height)) + 'px'
  this.node.innerHTML = ''

  if (this.image !== null) {
    let fill = MxUtils.getValue(this.style, MxConstants.STYLE_IMAGE_BACKGROUND, '')
    let stroke = MxUtils.getValue(this.style, MxConstants.STYLE_IMAGE_BORDER, '')
    this.node.style.backgroundColor = fill
    this.node.style.borderColor = stroke

    // VML image supports PNG in IE6
    let useVml = MxClient.IS_IE6 || ((document.documentMode == null || document.documentMode <= 8) && this.rotation !== 0)
    let img = document.createElement((useVml) ? MxClient.VML_PREFIX + ':image' : 'img')
    img.setAttribute('border', '0')
    img.style.position = 'absolute'
    img.src = this.image

    let filter = (this.opacity < 100) ? 'alpha(opacity=' + this.opacity + ')' : ''
    this.node.style.filter = filter

    if (this.flipH && this.flipV) {
      filter += 'progid:DXImageTransform.Microsoft.BasicImage(rotation=2)'
    } else if (this.flipH) {
      filter += 'progid:DXImageTransform.Microsoft.BasicImage(mirror=1)'
    } else if (this.flipV) {
      filter += 'progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)'
    }

    if (img.style.filter !== filter) {
      img.style.filter = filter
    }

    if (img.nodeName === 'image') {
      img.style.rotation = this.rotation
    } else if (this.rotation !== 0) {
      // LATER: Add flipV/H support
      MxUtils.setPrefixedStyle(img.style, 'transform', 'rotate(' + this.rotation + 'deg)')
    } else {
      MxUtils.setPrefixedStyle(img.style, 'transform', '')
    }

    // Known problem: IE clips top line of image for certain angles
    img.style.width = this.node.style.width
    img.style.height = this.node.style.height

    this.node.style.backgroundImage = ''
    this.node.appendChild(img)
  } else {
    this.setTransparentBackgroundImage(this.node)
  }
}
