import MxShape from './MxShape'
import MxUtils from '../util/MxUtils'
import MxConstants from '../util/MxConstants'
/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxArrowConnector
 *
 * Extends <MxShape> to implement an new rounded arrow shape with support for
 * waypoints and double arrows. (The shape is used to represent edges, not
 * vertices.) This shape is registered under <MxConstants.SHAPE_ARROW_CONNECTOR>
 * in <mxCellRenderer>.
 *
 * Constructor: MxArrowConnector
 *
 * Constructs a new arrow shape.
 *
 * Parameters:
 *
 * points - Array of <mxPoints> that define the points. This is stored in
 * <MxShape.points>.
 * fill - String that defines the fill color. This is stored in <fill>.
 * stroke - String that defines the stroke color. This is stored in <stroke>.
 * strokewidth - Optional integer that defines the stroke width. Default is
 * 1. This is stored in <strokewidth>.
 * arrowWidth - Optional integer that defines the arrow width. Default is
 * <MxConstants.ARROW_WIDTH>. This is stored in <arrowWidth>.
 * spacing - Optional integer that defines the spacing between the arrow shape
 * and its endpoints. Default is <MxConstants.ARROW_SPACING>. This is stored in
 * <spacing>.
 * endSize - Optional integer that defines the size of the arrowhead. Default
 * is <MxConstants.ARROW_SIZE>. This is stored in <endSize>.
 */

export default class MxArrowConnector {
  constructor(points, fill, stroke, strokewidth, arrowWidth, spacing, endSize) {
    MxShape.call(this)
    this.points = points
    this.fill = fill
    this.stroke = stroke
    this.strokewidth = (strokewidth !== null) ? strokewidth : 1
    this.arrowWidth = (arrowWidth !== null) ? arrowWidth : MxConstants.ARROW_WIDTH
    this.arrowSpacing = (spacing !== null) ? spacing : MxConstants.ARROW_SPACING
    this.startSize = MxConstants.ARROW_SIZE / 5
    this.endSize = MxConstants.ARROW_SIZE / 5
  };
}

/**
 * Extends MxShape.
 */
MxUtils.extend(MxArrowConnector, MxShape)

/**
 * letiable: useSvgBoundingBox
 *
 * Allows to use the SVG bounding box in SVG. Default is false for performance
 * reasons.
 */
MxArrowConnector.prototype.useSvgBoundingBox = true

/**
 * letiable: resetStyles
 *
 * Overrides MxShape to reset spacing.
 */
MxArrowConnector.prototype.resetStyles = function() {
  MxShape.prototype.resetStyles.apply(this, arguments)

  this.arrowSpacing = MxConstants.ARROW_SPACING
}

/**
 * Overrides apply to get smooth transition from default start- and endsize.
 */
MxArrowConnector.prototype.apply = function(state) {
  MxShape.prototype.apply.apply(this, arguments)

  if (this.style !== null) {
    this.startSize = MxUtils.getNumber(this.style, MxConstants.STYLE_STARTSIZE, MxConstants.ARROW_SIZE / 5) * 3
    this.endSize = MxUtils.getNumber(this.style, MxConstants.STYLE_ENDSIZE, MxConstants.ARROW_SIZE / 5) * 3
  }
}

/**
 * Function: augmentBoundingBox
 *
 * Augments the bounding box with the edge width and markers.
 */
MxArrowConnector.prototype.augmentBoundingBox = function(bbox) {
  MxShape.prototype.augmentBoundingBox.apply(this, arguments)

  let w = this.getEdgeWidth()

  if (this.isMarkerStart()) {
    w = Math.max(w, this.getStartArrowWidth())
  }

  if (this.isMarkerEnd()) {
    w = Math.max(w, this.getEndArrowWidth())
  }

  bbox.grow((w / 2 + this.strokewidth) * this.scale)
}

/**
 * Function: paintEdgeShape
 *
 * Paints the line shape.
 */
MxArrowConnector.prototype.paintEdgeShape = function(c, pts) {
  // Geometry of arrow
  let strokeWidth = this.strokewidth

  if (this.outline) {
    strokeWidth = Math.max(1, MxUtils.getNumber(this.style, MxConstants.STYLE_STROKEWIDTH, this.strokewidth))
  }

  let startWidth = this.getStartArrowWidth() + strokeWidth
  let endWidth = this.getEndArrowWidth() + strokeWidth
  let edgeWidth = this.outline ? this.getEdgeWidth() + strokeWidth : this.getEdgeWidth()
  let openEnded = this.isOpenEnded()
  let markerStart = this.isMarkerStart()
  let markerEnd = this.isMarkerEnd()
  let spacing = (openEnded) ? 0 : this.arrowSpacing + strokeWidth / 2
  let startSize = this.startSize + strokeWidth
  let endSize = this.endSize + strokeWidth
  let isRounded = this.isArrowRounded()

  // Base vector (between first points)
  let pe = pts[pts.length - 1]

  // Finds first non-overlapping point
  let i0 = 1

  while (i0 < pts.length - 1 && pts[i0].x === pts[0].x && pts[i0].y === pts[0].y) {
    i0++
  }

  let dx = pts[i0].x - pts[0].x
  let dy = pts[i0].y - pts[0].y
  let dist = Math.sqrt(dx * dx + dy * dy)

  if (dist === 0) {
    return
  }

  // Computes the norm and the inverse norm
  let nx = dx / dist
  let nx1 = nx
  let nx2 = nx
  let ny = dy / dist
  let ny2 = ny
  let ny1 = ny
  let orthx = edgeWidth * ny
  let orthy = -edgeWidth * nx

  // Stores the inbound function calls in reverse order in fns
  let fns = []

  if (isRounded) {
    c.setLineJoin('round')
  } else if (pts.length > 2) {
    // Only mitre if there are waypoints
    c.setMiterLimit(1.42)
  }

  c.begin()

  let startNx = nx
  let startNy = ny

  if (markerStart && !openEnded) {
    this.paintMarker(c, pts[0].x, pts[0].y, nx, ny, startSize, startWidth, edgeWidth, spacing, true)
  } else {
    let outStartX = pts[0].x + orthx / 2 + spacing * nx
    let outStartY = pts[0].y + orthy / 2 + spacing * ny
    let inEndX = pts[0].x - orthx / 2 + spacing * nx
    let inEndY = pts[0].y - orthy / 2 + spacing * ny

    if (openEnded) {
      c.moveTo(outStartX, outStartY)

      fns.push(function() {
        c.lineTo(inEndX, inEndY)
      })
    } else {
      c.moveTo(inEndX, inEndY)
      c.lineTo(outStartX, outStartY)
    }
  }

  let dx1 = 0
  let dy1 = 0
  let dist1 = 0

  for (let i = 0; i < pts.length - 2; i++) {
    // Work out in which direction the line is bending
    let pos = MxUtils.relativeCcw(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y, pts[i + 2].x, pts[i + 2].y)

    dx1 = pts[i + 2].x - pts[i + 1].x
    dy1 = pts[i + 2].y - pts[i + 1].y

    dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1)

    if (dist1 !== 0) {
      nx1 = dx1 / dist1
      ny1 = dy1 / dist1

      let tmp1 = nx * nx1 + ny * ny1
      let tmp
      tmp = Math.max(Math.sqrt((tmp1 + 1) / 2), 0.04)

      // Work out the normal orthogonal to the line through the control point and the edge sides intersection
      nx2 = (nx + nx1)
      ny2 = (ny + ny1)

      let dist2 = Math.sqrt(nx2 * nx2 + ny2 * ny2)

      if (dist2 !== 0) {
        nx2 = nx2 / dist2
        ny2 = ny2 / dist2

        // Higher strokewidths require a larger minimum bend, 0.35 covers all but the most extreme cases
        let strokeWidthFactor = Math.max(tmp, Math.min(this.strokewidth / 200 + 0.04, 0.35))
        let angleFactor = (pos !== 0 && isRounded) ? Math.max(0.1, strokeWidthFactor) : Math.max(tmp, 0.06)

        let outX = pts[i + 1].x + ny2 * edgeWidth / 2 / angleFactor
        let outY = pts[i + 1].y - nx2 * edgeWidth / 2 / angleFactor
        let inX = pts[i + 1].x - ny2 * edgeWidth / 2 / angleFactor
        let inY = pts[i + 1].y + nx2 * edgeWidth / 2 / angleFactor

        if (pos === 0 || !isRounded) {
          // If the two segments are aligned, or if we're not drawing curved sections between segments
          // just draw straight to the intersection point
          c.lineTo(outX, outY);

          (function(x, y) {
            fns.push(function() {
              c.lineTo(x, y)
            })
          })(inX, inY)
        } else if (pos === -1) {
          let c1x = inX + ny * edgeWidth
          let c1y = inY - nx * edgeWidth
          let c2x = inX + ny1 * edgeWidth
          let c2y = inY - nx1 * edgeWidth
          c.lineTo(c1x, c1y)
          c.quadTo(outX, outY, c2x, c2y);

          (function(x, y) {
            fns.push(function() {
              c.lineTo(x, y)
            })
          })(inX, inY)
        } else {
          c.lineTo(outX, outY);

          (function(x, y) {
            let c1x = outX - ny * edgeWidth
            let c1y = outY + nx * edgeWidth
            let c2x = outX - ny1 * edgeWidth
            let c2y = outY + nx1 * edgeWidth

            fns.push(function() {
              c.quadTo(x, y, c1x, c1y)
            })
            fns.push(function() {
              c.lineTo(c2x, c2y)
            })
          })(inX, inY)
        }

        nx = nx1
        ny = ny1
      }
    }
  }

  orthx = edgeWidth * ny1
  orthy = -edgeWidth * nx1

  if (markerEnd && !openEnded) {
    this.paintMarker(c, pe.x, pe.y, -nx, -ny, endSize, endWidth, edgeWidth, spacing, false)
  } else {
    c.lineTo(pe.x - spacing * nx1 + orthx / 2, pe.y - spacing * ny1 + orthy / 2)

    let inStartX = pe.x - spacing * nx1 - orthx / 2
    let inStartY = pe.y - spacing * ny1 - orthy / 2

    if (!openEnded) {
      c.lineTo(inStartX, inStartY)
    } else {
      c.moveTo(inStartX, inStartY)

      fns.splice(0, 0, function() {
        c.moveTo(inStartX, inStartY)
      })
    }
  }

  for (let i = fns.length - 1; i >= 0; i--) {
    fns[i]()
  }

  if (openEnded) {
    c.end()
    c.stroke()
  } else {
    c.close()
    c.fillAndStroke()
  }

  // Workaround for shadow on top of base arrow
  c.setShadow(false)

  // Need to redraw the markers without the low miter limit
  c.setMiterLimit(4)

  if (isRounded) {
    c.setLineJoin('flat')
  }

  if (pts.length > 2) {
    // Only to repaint markers if no waypoints
    // Need to redraw the markers without the low miter limit
    c.setMiterLimit(4)
    if (markerStart && !openEnded) {
      c.begin()
      this.paintMarker(c, pts[0].x, pts[0].y, startNx, startNy, startSize, startWidth, edgeWidth, spacing, true)
      c.stroke()
      c.end()
    }

    if (markerEnd && !openEnded) {
      c.begin()
      this.paintMarker(c, pe.x, pe.y, -nx, -ny, endSize, endWidth, edgeWidth, spacing, true)
      c.stroke()
      c.end()
    }
  }
}

/**
 * Function: paintEdgeShape
 *
 * Paints the line shape.
 */
MxArrowConnector.prototype.paintMarker = function(c, ptX, ptY, nx, ny, size, arrowWidth, edgeWidth, spacing, initialMove) {
  let widthArrowRatio = edgeWidth / arrowWidth
  let orthx = edgeWidth * ny / 2
  let orthy = -edgeWidth * nx / 2

  let spaceX = (spacing + size) * nx
  let spaceY = (spacing + size) * ny

  if (initialMove) {
    c.moveTo(ptX - orthx + spaceX, ptY - orthy + spaceY)
  } else {
    c.lineTo(ptX - orthx + spaceX, ptY - orthy + spaceY)
  }

  c.lineTo(ptX - orthx / widthArrowRatio + spaceX, ptY - orthy / widthArrowRatio + spaceY)
  c.lineTo(ptX + spacing * nx, ptY + spacing * ny)
  c.lineTo(ptX + orthx / widthArrowRatio + spaceX, ptY + orthy / widthArrowRatio + spaceY)
  c.lineTo(ptX + orthx + spaceX, ptY + orthy + spaceY)
}

/**
 * Function: isArrowRounded
 *
 * Returns wether the arrow is rounded
 */
MxArrowConnector.prototype.isArrowRounded = function() {
  return this.isRounded
}

/**
 * Function: getStartArrowWidth
 *
 * Returns the width of the start arrow
 */
MxArrowConnector.prototype.getStartArrowWidth = function() {
  return MxConstants.ARROW_WIDTH
}

/**
 * Function: getEndArrowWidth
 *
 * Returns the width of the end arrow
 */
MxArrowConnector.prototype.getEndArrowWidth = function() {
  return MxConstants.ARROW_WIDTH
}

/**
 * Function: getEdgeWidth
 *
 * Returns the width of the body of the edge
 */
MxArrowConnector.prototype.getEdgeWidth = function() {
  return MxConstants.ARROW_WIDTH / 3
}

/**
 * Function: isOpenEnded
 *
 * Returns whether the ends of the shape are drawn
 */
MxArrowConnector.prototype.isOpenEnded = function() {
  return false
}

/**
 * Function: isMarkerStart
 *
 * Returns whether the start marker is drawn
 */
MxArrowConnector.prototype.isMarkerStart = function() {
  return (MxUtils.getValue(this.style, MxConstants.STYLE_STARTARROW, MxConstants.NONE) !== MxConstants.NONE)
}

/**
 * Function: isMarkerEnd
 *
 * Returns whether the end marker is drawn
 */
MxArrowConnector.prototype.isMarkerEnd = function() {
  return (MxUtils.getValue(this.style, MxConstants.STYLE_ENDARROW, MxConstants.NONE) !== MxConstants.NONE)
}
