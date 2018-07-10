/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxPoint
 *
 * Implements a 2-dimensional vector with double precision coordinates.
 *
 * Constructor: MxPoint
 *
 * Constructs a new point for the optional x and y coordinates. If no
 * coordinates are given, then the default values for <x> and <y> are used.
 */
import MxUtils from './MxUtils.js'

export default class MxPoint {
  constructor(x, y) {
    this.x = x != null ? x : 0
    this.y = y != null ? y : 0
  }
}

/**
 * Variable: x
 *
 * Holds the x-coordinate of the point. Default is 0.
 */
MxPoint.prototype.x = null

/**
 * Variable: y
 *
 * Holds the y-coordinate of the point. Default is 0.
 */
MxPoint.prototype.y = null

/**
 * Function: equals
 *
 * Returns true if the given object equals this point.
 */
MxPoint.prototype.equals = function(obj) {
  return obj != null && obj.x === this.x && obj.y === this.y
}

/**
 * Function: clone
 *
 * Returns a clone of this <MxPoint>.
 */
MxPoint.prototype.clone = function() {
  // Handles subclasses as well
  return MxUtils.clone(this)
}
