import MxPolyline from './MxPolyline'
import MxUtils from '../util/MxUtils'
import MxConstants from '../util/MxConstants'
import MxMarker from './MxMarker'
import MxShape from './MxShape'

/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxConnector
 *
 * Extends <MxShape> to implement a connector shape. The connector
 * shape allows for arrow heads on either side.
 *
 * This shape is registered under <MxConstants.SHAPE_CONNECTOR> in
 * <mxCellRenderer>.
 *
 * Constructor: MxConnector
 *
 * Constructs a new connector shape.
 *
 * Parameters:
 *
 * points - Array of <mxPoints> that define the points. This is stored in
 * <MxShape.points>.
 * stroke - String that defines the stroke color. This is stored in <stroke>.
 * Default is 'black'.
 * strokewidth - Optional integer that defines the stroke width. Default is
 * 1. This is stored in <strokewidth>.
 */

export default class MxConnector {
  constructor(points, stroke, strokewidth) {
    MxPolyline.call(this, points, stroke, strokewidth)
  }
}

/**
 * Extends MxPolyline.
 */
MxUtils.extend(MxConnector, MxPolyline)

/**
 * Function: updateBoundingBox
 *
 * Updates the <boundingBox> for this shape using <createBoundingBox> and
 * <augmentBoundingBox> and stores the result in <boundingBox>.
 */
MxConnector.prototype.updateBoundingBox = function() {
  this.useSvgBoundingBox = this.style !== null && this.style[MxConstants.STYLE_CURVED] === 1
  MxShape.prototype.updateBoundingBox.apply(this, arguments)
}

/**
 * Function: paintEdgeShape
 *
 * Paints the line shape.
 */
MxConnector.prototype.paintEdgeShape = function(c, pts) {
  // The indirection via functions for markers is needed in
  // order to apply the offsets before painting the line and
  // paint the markers after painting the line.
  let sourceMarker = this.createMarker(c, pts, true)
  let targetMarker = this.createMarker(c, pts, false)

  MxPolyline.prototype.paintEdgeShape.apply(this, arguments)

  // Disables shadows, dashed styles and fixes fill color for markers
  c.setFillColor(this.stroke)
  c.setShadow(false)
  c.setDashed(false)

  if (sourceMarker !== null) {
    sourceMarker()
  }

  if (targetMarker !== null) {
    targetMarker()
  }
}

/**
 * Function: createMarker
 *
 * Prepares the marker by adding offsets in pts and returning a function to
 * paint the marker.
 */
MxConnector.prototype.createMarker = function(c, pts, source) {
  let result = null
  let n = pts.length
  let type = MxUtils.getValue(this.style, (source) ? MxConstants.STYLE_STARTARROW : MxConstants.STYLE_ENDARROW)
  let p0 = (source) ? pts[1] : pts[n - 2]
  let pe = (source) ? pts[0] : pts[n - 1]

  if (type !== null && p0 !== null && pe !== null) {
    let count = 1

    // Uses next non-overlapping point
    while (count < n - 1 && Math.round(p0.x - pe.x) === 0 && Math.round(p0.y - pe.y) === 0) {
      p0 = (source) ? pts[1 + count] : pts[n - 2 - count]
      count++
    }

    // Computes the norm and the inverse norm
    let dx = pe.x - p0.x
    let dy = pe.y - p0.y

    let dist = Math.max(1, Math.sqrt(dx * dx + dy * dy))

    let unitX = dx / dist
    let unitY = dy / dist

    let size = MxUtils.getNumber(this.style, (source) ? MxConstants.STYLE_STARTSIZE : MxConstants.STYLE_ENDSIZE, MxConstants.DEFAULT_MARKERSIZE)

    // Allow for stroke width in the end point used and the
    // orthogonal vectors describing the direction of the marker
    let filled = this.style[(source) ? MxConstants.STYLE_STARTFILL : MxConstants.STYLE_ENDFILL] !== 0

    result = MxMarker.createMarker(c, this, type, pe, unitX, unitY, size, source, this.strokewidth, filled)
  }

  return result
}

/**
 * Function: augmentBoundingBox
 *
 * Augments the bounding box with the strokewidth and shadow offsets.
 */
MxConnector.prototype.augmentBoundingBox = function(bbox) {
  MxShape.prototype.augmentBoundingBox.apply(this, arguments)

  // Adds marker sizes
  let size = 0

  if (MxUtils.getValue(this.style, MxConstants.STYLE_STARTARROW, MxConstants.NONE) !== MxConstants.NONE) {
    size = MxUtils.getNumber(this.style, MxConstants.STYLE_STARTSIZE, MxConstants.DEFAULT_MARKERSIZE) + 1
  }

  if (MxUtils.getValue(this.style, MxConstants.STYLE_ENDARROW, MxConstants.NONE) !== MxConstants.NONE) {
    size = Math.max(size, MxUtils.getNumber(this.style, MxConstants.STYLE_ENDSIZE, MxConstants.DEFAULT_MARKERSIZE)) + 1
  }

  bbox.grow(size * this.scale)
}
