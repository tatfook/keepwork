/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxRectangle
 *
 * Extends <MxPoint> to implement a 2-dimensional rectangle with double
 * precision coordinates.
 *
 * Constructor: MxRectangle
 *
 * Constructs a new rectangle for the optional parameters. If no parameters
 * are given then the respective default values are used.
 */
import MxPoint from './MxPoint'

export default class MxRectangle {
  constructor(x, y, width, height) {
    MxPoint.call(this, x, y)

    this.width = width !== null ? width : 0
    this.height = height !== null ? height : 0
  }
}

/**
 * Extends MxPoint.
 */
MxRectangle.prototype = new MxPoint()
MxRectangle.prototype.constructor = MxRectangle

/**
 * Variable: width
 *
 * Holds the width of the rectangle. Default is 0.
 */
MxRectangle.prototype.width = null

/**
 * Variable: height
 *
 * Holds the height of the rectangle. Default is 0.
 */
MxRectangle.prototype.height = null

/**
 * Function: setRect
 *
 * Sets this rectangle to the specified values
 */
MxRectangle.prototype.setRect = function(x, y, w, h) {
  this.x = x
  this.y = y
  this.width = w
  this.height = h
}

/**
 * Function: getCenterX
 *
 * Returns the x-coordinate of the center point.
 */
MxRectangle.prototype.getCenterX = function() {
  return this.x + this.width / 2
}

/**
 * Function: getCenterY
 *
 * Returns the y-coordinate of the center point.
 */
MxRectangle.prototype.getCenterY = function() {
  return this.y + this.height / 2
}

/**
 * Function: add
 *
 * Adds the given rectangle to this rectangle.
 */
MxRectangle.prototype.add = function(rect) {
  if (rect !== null) {
    let minX = Math.min(this.x, rect.x)
    let minY = Math.min(this.y, rect.y)
    let maxX = Math.max(this.x + this.width, rect.x + rect.width)
    let maxY = Math.max(this.y + this.height, rect.y + rect.height)

    this.x = minX
    this.y = minY
    this.width = maxX - minX
    this.height = maxY - minY
  }
}

/**
 * Function: intersect
 *
 * Changes this rectangle to where it overlaps with the given rectangle.
 */
MxRectangle.prototype.intersect = function(rect) {
  if (rect !== null) {
    let r1 = this.x + this.width
    let r2 = rect.x + rect.width

    let b1 = this.y + this.height
    let b2 = rect.y + rect.height

    this.x = Math.max(this.x, rect.x)
    this.y = Math.max(this.y, rect.y)
    this.width = Math.min(r1, r2) - this.x
    this.height = Math.min(b1, b2) - this.y
  }
}

/**
 * Function: grow
 *
 * Grows the rectangle by the given amount, that is, this method subtracts
 * the given amount from the x- and y-coordinates and adds twice the amount
 * to the width and height.
 */
MxRectangle.prototype.grow = function(amount) {
  this.x -= amount
  this.y -= amount
  this.width += 2 * amount
  this.height += 2 * amount
}

/**
 * Function: getPoint
 *
 * Returns the top, left corner as a new <MxPoint>.
 */
MxRectangle.prototype.getPoint = function() {
  return new MxPoint(this.x, this.y)
}

/**
 * Function: rotate90
 *
 * Rotates this rectangle by 90 degree around its center point.
 */
MxRectangle.prototype.rotate90 = function() {
  let t = (this.width - this.height) / 2
  this.x += t
  this.y -= t
  let tmp = this.width
  this.width = this.height
  this.height = tmp
}

/**
 * Function: equals
 *
 * Returns true if the given object equals this rectangle.
 */
MxRectangle.prototype.equals = function(obj) {
  return (
    obj !== null &&
    obj.x === this.x &&
    obj.y === this.y &&
    obj.width === this.width &&
    obj.height === this.height
  )
}

/**
 * Function: fromRectangle
 *
 * Returns a new <MxRectangle> which is a copy of the given rectangle.
 */
MxRectangle.fromRectangle = function(rect) {
  return new MxRectangle(rect.x, rect.y, rect.width, rect.height)
}
