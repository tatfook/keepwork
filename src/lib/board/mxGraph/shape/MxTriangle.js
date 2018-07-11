import MxActor from './MxActor'
import MxUtils from '../util/MxUtils'
import MxConstants from '../util/MxConstants'
import MxPoint from '../util/MxPoint'
/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxTriangle
 *
 * Implementation of the triangle shape.
 *
 * Constructor: mxTriangle
 *
 * Constructs a new triangle shape.
 */

export default class mxTriangle {
  constructor() {
    MxActor.call(this)
  };
}

/**
 * Extends MxActor.
 */
MxUtils.extend(mxTriangle, MxActor)

/**
 * Function: redrawPath
 *
 * Draws the path for this shape.
 */
mxTriangle.prototype.redrawPath = function(c, x, y, w, h) {
  var arcSize = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2
  this.addPoints(c, [new MxPoint(0, 0), new MxPoint(w, 0.5 * h), new MxPoint(0, h)], this.isRounded, arcSize, true)
}
