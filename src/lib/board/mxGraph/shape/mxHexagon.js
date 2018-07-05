import MxActor from './MxActor'
import MxUtils from '../util/MxUtils'
import MxConstants from '../util/MxConstants'
import MxPoint from '../util/MxPoint'
/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxHexagon
 *
 * Implementation of the hexagon shape.
 *
 * Constructor: MxHexagon
 *
 * Constructs a new hexagon shape.
 */

export default class MxHexagon {
  constructor() {
    MxActor.call(this)
  };
}

/**
 * Extends MxActor.
 */
MxUtils.extend(MxHexagon, MxActor)

/**
 * Function: redrawPath
 *
 * Draws the path for this shape.
 */
MxHexagon.prototype.redrawPath = function(c, x, y, w, h) {
  var arcSize = MxUtils.getValue(this.style, MxConstants.STYLE_ARCSIZE, MxConstants.LINE_ARCSIZE) / 2
  this.addPoints(c, [new MxPoint(0.25 * w, 0), new MxPoint(0.75 * w, 0), new MxPoint(w, 0.5 * h), new MxPoint(0.75 * w, h), new MxPoint(0.25 * w, h), new MxPoint(0, 0.5 * h)], this.isRounded, arcSize, true)
}
