/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxAbstractCanvas2D
 *
 * Base class for all canvases. A description of the public API is available in <mxXmlCanvas2D>.
 * All color values of <MxConstants.NONE> will be converted to null in the state.
 *
 * Constructor: MxAbstractCanvas2D
 *
 * Constructs a new abstract canvas.
 */

import MxUrlConverter from './MxUrlConverter'
import MxConstants from './MxConstants'
import MxUtils from './MxUtils'
import MxPoint from './MxPoint'

export default class MxAbstractCanvas2D {
  constructor(converter) {
    /**
     * Variable: converter
     *
     * Holds the <MxUrlConverter> to convert image URLs.
     */
    this.converter = this.createUrlConverter()

    this.reset()
  }
}

/**
 * Variable: state
 *
 * Holds the current state.
 */
MxAbstractCanvas2D.prototype.state = null

/**
 * Variable: states
 *
 * Stack of states.
 */
MxAbstractCanvas2D.prototype.states = null

/**
 * Variable: path
 *
 * Holds the current path as an array.
 */
MxAbstractCanvas2D.prototype.path = null

/**
 * Variable: rotateHtml
 *
 * Switch for rotation of HTML. Default is false.
 */
MxAbstractCanvas2D.prototype.rotateHtml = true

/**
 * Variable: lastX
 *
 * Holds the last x coordinate.
 */
MxAbstractCanvas2D.prototype.lastX = 0

/**
 * Variable: lastY
 *
 * Holds the last y coordinate.
 */
MxAbstractCanvas2D.prototype.lastY = 0

/**
 * Variable: moveOp
 *
 * Contains the string used for moving in paths. Default is 'M'.
 */
MxAbstractCanvas2D.prototype.moveOp = 'M'

/**
 * Variable: lineOp
 *
 * Contains the string used for moving in paths. Default is 'L'.
 */
MxAbstractCanvas2D.prototype.lineOp = 'L'

/**
 * Variable: quadOp
 *
 * Contains the string used for quadratic paths. Default is 'Q'.
 */
MxAbstractCanvas2D.prototype.quadOp = 'Q'

/**
 * Variable: curveOp
 *
 * Contains the string used for bezier curves. Default is 'C'.
 */
MxAbstractCanvas2D.prototype.curveOp = 'C'

/**
 * Variable: closeOp
 *
 * Holds the operator for closing curves. Default is 'Z'.
 */
MxAbstractCanvas2D.prototype.closeOp = 'Z'

/**
 * Variable: pointerEvents
 *
 * Boolean value that specifies if events should be handled. Default is false.
 */
MxAbstractCanvas2D.prototype.pointerEvents = false

/**
 * Function: createUrlConverter
 *
 * Create a new <MxUrlConverter> and returns it.
 */
MxAbstractCanvas2D.prototype.createUrlConverter = function() {
  return new MxUrlConverter()
}

/**
 * Function: reset
 *
 * Resets the state of this canvas.
 */
MxAbstractCanvas2D.prototype.reset = function() {
  this.state = this.createState()
  this.states = []
}

/**
 * Function: createState
 *
 * Creates the state of the this canvas.
 */
MxAbstractCanvas2D.prototype.createState = function() {
  return {
    dx: 0,
    dy: 0,
    scale: 1,
    alpha: 1,
    fillAlpha: 1,
    strokeAlpha: 1,
    fillColor: null,
    gradientFillAlpha: 1,
    gradientColor: null,
    gradientAlpha: 1,
    gradientDirection: null,
    strokeColor: null,
    strokeWidth: 1,
    dashed: false,
    dashPattern: '3 3',
    fixDash: false,
    lineCap: 'flat',
    lineJoin: 'miter',
    miterLimit: 10,
    fontColor: '#000000',
    fontBackgroundColor: null,
    fontBorderColor: null,
    fontSize: MxConstants.DEFAULT_FONTSIZE,
    fontFamily: MxConstants.DEFAULT_FONTFAMILY,
    fontStyle: 0,
    shadow: false,
    shadowColor: MxConstants.SHADOWCOLOR,
    shadowAlpha: MxConstants.SHADOW_OPACITY,
    shadowDx: MxConstants.SHADOW_OFFSET_X,
    shadowDy: MxConstants.SHADOW_OFFSET_Y,
    rotation: 0,
    rotationCx: 0,
    rotationCy: 0
  }
}

/**
 * Function: format
 *
 * Rounds all numbers to integers.
 */
MxAbstractCanvas2D.prototype.format = function(value) {
  return Math.round(parseFloat(value))
}

/**
 * Function: addOp
 *
 * Adds the given operation to the path.
 */
MxAbstractCanvas2D.prototype.addOp = function() {
  if (this.path !== null) {
    this.path.push(arguments[0])

    if (arguments.length > 2) {
      let s = this.state

      for (let i = 2; i < arguments.length; i += 2) {
        this.lastX = arguments[i - 1]
        this.lastY = arguments[i]

        this.path.push(this.format((this.lastX + s.dx) * s.scale))
        this.path.push(this.format((this.lastY + s.dy) * s.scale))
      }
    }
  }
}

/**
 * Function: rotatePoint
 *
 * Rotates the given point and returns the result as an <MxPoint>.
 */
MxAbstractCanvas2D.prototype.rotatePoint = function(x, y, theta, cx, cy) {
  let rad = theta * (Math.PI / 180)

  return MxUtils.getRotatedPoint(
    new MxPoint(x, y),
    Math.cos(rad),
    Math.sin(rad),
    new MxPoint(cx, cy)
  )
}

/**
 * Function: save
 *
 * Saves the current state.
 */
MxAbstractCanvas2D.prototype.save = function() {
  this.states.push(this.state)
  this.state = MxUtils.clone(this.state)
}

/**
 * Function: restore
 *
 * Restores the current state.
 */
MxAbstractCanvas2D.prototype.restore = function() {
  if (this.states.length > 0) {
    this.state = this.states.pop()
  }
}

/**
 * Function: setLink
 *
 * Sets the current link. Hook for subclassers.
 */
MxAbstractCanvas2D.prototype.setLink = function(link) {
  // nop
}

/**
 * Function: scale
 *
 * Scales the current state.
 */
MxAbstractCanvas2D.prototype.scale = function(value) {
  this.state.scale *= value
  this.state.strokeWidth *= value
}

/**
 * Function: translate
 *
 * Translates the current state.
 */
MxAbstractCanvas2D.prototype.translate = function(dx, dy) {
  this.state.dx += dx
  this.state.dy += dy
}

/**
 * Function: rotate
 *
 * Rotates the current state.
 */
MxAbstractCanvas2D.prototype.rotate = function(theta, flipH, flipV, cx, cy) {
  // nop
}

/**
 * Function: setAlpha
 *
 * Sets the current alpha.
 */
MxAbstractCanvas2D.prototype.setAlpha = function(value) {
  this.state.alpha = value
}

/**
 * Function: setFillAlpha
 *
 * Sets the current solid fill alpha.
 */
MxAbstractCanvas2D.prototype.setFillAlpha = function(value) {
  this.state.fillAlpha = value
}

/**
 * Function: setStrokeAlpha
 *
 * Sets the current stroke alpha.
 */
MxAbstractCanvas2D.prototype.setStrokeAlpha = function(value) {
  this.state.strokeAlpha = value
}

/**
 * Function: setFillColor
 *
 * Sets the current fill color.
 */
MxAbstractCanvas2D.prototype.setFillColor = function(value) {
  if (value === MxConstants.NONE) {
    value = null
  }

  this.state.fillColor = value
  this.state.gradientColor = null
}

/**
 * Function: setGradient
 *
 * Sets the current gradient.
 */
MxAbstractCanvas2D.prototype.setGradient = function(
  color1,
  color2,
  x,
  y,
  w,
  h,
  direction,
  alpha1,
  alpha2
) {
  let s = this.state
  s.fillColor = color1
  s.gradientFillAlpha = alpha1 !== null ? alpha1 : 1
  s.gradientColor = color2
  s.gradientAlpha = alpha2 !== null ? alpha2 : 1
  s.gradientDirection = direction
}

/**
 * Function: setStrokeColor
 *
 * Sets the current stroke color.
 */
MxAbstractCanvas2D.prototype.setStrokeColor = function(value) {
  if (value === MxConstants.NONE) {
    value = null
  }

  this.state.strokeColor = value
}

/**
 * Function: setStrokeWidth
 *
 * Sets the current stroke width.
 */
MxAbstractCanvas2D.prototype.setStrokeWidth = function(value) {
  this.state.strokeWidth = value
}

/**
 * Function: setDashed
 *
 * Enables or disables dashed lines.
 */
MxAbstractCanvas2D.prototype.setDashed = function(value, fixDash) {
  this.state.dashed = value
  this.state.fixDash = fixDash
}

/**
 * Function: setDashPattern
 *
 * Sets the current dash pattern.
 */
MxAbstractCanvas2D.prototype.setDashPattern = function(value) {
  this.state.dashPattern = value
}

/**
 * Function: setLineCap
 *
 * Sets the current line cap.
 */
MxAbstractCanvas2D.prototype.setLineCap = function(value) {
  this.state.lineCap = value
}

/**
 * Function: setLineJoin
 *
 * Sets the current line join.
 */
MxAbstractCanvas2D.prototype.setLineJoin = function(value) {
  this.state.lineJoin = value
}

/**
 * Function: setMiterLimit
 *
 * Sets the current miter limit.
 */
MxAbstractCanvas2D.prototype.setMiterLimit = function(value) {
  this.state.miterLimit = value
}

/**
 * Function: setFontColor
 *
 * Sets the current font color.
 */
MxAbstractCanvas2D.prototype.setFontColor = function(value) {
  if (value === MxConstants.NONE) {
    value = null
  }

  this.state.fontColor = value
}

/**
 * Function: setFontColor
 *
 * Sets the current font color.
 */
MxAbstractCanvas2D.prototype.setFontBackgroundColor = function(value) {
  if (value === MxConstants.NONE) {
    value = null
  }

  this.state.fontBackgroundColor = value
}

/**
 * Function: setFontColor
 *
 * Sets the current font color.
 */
MxAbstractCanvas2D.prototype.setFontBorderColor = function(value) {
  if (value === MxConstants.NONE) {
    value = null
  }

  this.state.fontBorderColor = value
}

/**
 * Function: setFontSize
 *
 * Sets the current font size.
 */
MxAbstractCanvas2D.prototype.setFontSize = function(value) {
  this.state.fontSize = parseFloat(value)
}

/**
 * Function: setFontFamily
 *
 * Sets the current font family.
 */
MxAbstractCanvas2D.prototype.setFontFamily = function(value) {
  this.state.fontFamily = value
}

/**
 * Function: setFontStyle
 *
 * Sets the current font style.
 */
MxAbstractCanvas2D.prototype.setFontStyle = function(value) {
  if (value === null) {
    value = 0
  }

  this.state.fontStyle = value
}

/**
 * Function: setShadow
 *
 * Enables or disables and configures the current shadow.
 */
MxAbstractCanvas2D.prototype.setShadow = function(enabled) {
  this.state.shadow = enabled
}

/**
 * Function: setShadowColor
 *
 * Enables or disables and configures the current shadow.
 */
MxAbstractCanvas2D.prototype.setShadowColor = function(value) {
  if (value === MxConstants.NONE) {
    value = null
  }

  this.state.shadowColor = value
}

/**
 * Function: setShadowAlpha
 *
 * Enables or disables and configures the current shadow.
 */
MxAbstractCanvas2D.prototype.setShadowAlpha = function(value) {
  this.state.shadowAlpha = value
}

/**
 * Function: setShadowOffset
 *
 * Enables or disables and configures the current shadow.
 */
MxAbstractCanvas2D.prototype.setShadowOffset = function(dx, dy) {
  this.state.shadowDx = dx
  this.state.shadowDy = dy
}

/**
 * Function: begin
 *
 * Starts a new path.
 */
MxAbstractCanvas2D.prototype.begin = function() {
  this.lastX = 0
  this.lastY = 0
  this.path = []
}

/**
 * Function: moveTo
 *
 *  Moves the current path the given coordinates.
 */
MxAbstractCanvas2D.prototype.moveTo = function(x, y) {
  this.addOp(this.moveOp, x, y)
}

/**
 * Function: lineTo
 *
 * Draws a line to the given coordinates. Uses moveTo with the op argument.
 */
MxAbstractCanvas2D.prototype.lineTo = function(x, y) {
  this.addOp(this.lineOp, x, y)
}

/**
 * Function: quadTo
 *
 * Adds a quadratic curve to the current path.
 */
MxAbstractCanvas2D.prototype.quadTo = function(x1, y1, x2, y2) {
  this.addOp(this.quadOp, x1, y1, x2, y2)
}

/**
 * Function: curveTo
 *
 * Adds a bezier curve to the current path.
 */
MxAbstractCanvas2D.prototype.curveTo = function(x1, y1, x2, y2, x3, y3) {
  this.addOp(this.curveOp, x1, y1, x2, y2, x3, y3)
}

/**
 * Function: arcTo
 *
 * Adds the given arc to the current path. This is a synthetic operation that
 * is broken down into curves.
 */
MxAbstractCanvas2D.prototype.arcTo = function(
  rx,
  ry,
  angle,
  largeArcFlag,
  sweepFlag,
  x,
  y
) {
  let curves = MxUtils.arcToCurves(
    this.lastX,
    this.lastY,
    rx,
    ry,
    angle,
    largeArcFlag,
    sweepFlag,
    x,
    y
  )

  if (curves !== null) {
    for (let i = 0; i < curves.length; i += 6) {
      this.curveTo(
        curves[i],
        curves[i + 1],
        curves[i + 2],
        curves[i + 3],
        curves[i + 4],
        curves[i + 5]
      )
    }
  }
}

/**
 * Function: close
 *
 * Closes the current path.
 */
MxAbstractCanvas2D.prototype.close = function(x1, y1, x2, y2, x3, y3) {
  this.addOp(this.closeOp)
}

/**
 * Function: end
 *
 * Empty implementation for backwards compatibility. This will be removed.
 */
MxAbstractCanvas2D.prototype.end = function() {}
