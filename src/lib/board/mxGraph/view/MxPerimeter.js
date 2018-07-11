/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */

import MxPoint from '../util/MxPoint'
import MxUtils from '../util/MxUtils'
import MxConstants from '../util/MxConstants'

const MxPerimeter =
{
  /**
   * Class: mxPerimeter
   *
   * Provides various perimeter functions to be used in a style
   * as the value of <MxConstants.STYLE_PERIMETER>. Perimeters for
   * rectangle, circle, rhombus and triangle are available.
   *
   * Example:
   *
   * (code)
   * <add as="perimeter">mxPerimeter.RectanglePerimeter</add>
   * (end)
   *
   * Or programmatically:
   *
   * (code)
   * style[MxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
   * (end)
   *
   * When adding new perimeter functions, it is recommended to use the
   * mxPerimeter-namespace as follows:
   *
   * (code)
   * mxPerimeter.CustomPerimeter = function (bounds, vertex, next, orthogonal)
   * {
   *   var x = 0; // Calculate x-coordinate
   *   var y = 0; // Calculate y-coordainte
   *
   *   return new MxPoint(x, y);
   * }
   * (end)
   *
   * The new perimeter should then be registered in the <mxStyleRegistry> as follows:
   * (code)
   * mxStyleRegistry.putValue('customPerimeter', mxPerimeter.CustomPerimeter);
   * (end)
   *
   * The custom perimeter above can now be used in a specific vertex as follows:
   *
   * (code)
   * model.setStyle(vertex, 'perimeter=customPerimeter');
   * (end)
   *
   * Note that the key of the <mxStyleRegistry> entry for the function should
   * be used in string values, unless <mxGraphView.allowEval> is true, in
   * which case you can also use mxPerimeter.CustomPerimeter for the value in
   * the cell style above.
   *
   * Or it can be used for all vertices in the graph as follows:
   *
   * (code)
   * var style = graph.getStylesheet().getDefaultVertexStyle();
   * style[MxConstants.STYLE_PERIMETER] = mxPerimeter.CustomPerimeter;
   * (end)
   *
   * Note that the object can be used directly when programmatically setting
   * the value, but the key in the <mxStyleRegistry> should be used when
   * setting the value via a key, value pair in a cell style.
   *
   * The parameters are explained in <RectanglePerimeter>.
   *
   * Function: RectanglePerimeter
   *
   * Describes a rectangular perimeter for the given bounds.
   *
   * Parameters:
   *
   * bounds - <mxRectangle> that represents the absolute bounds of the
   * vertex.
   * vertex - <mxCellState> that represents the vertex.
   * next - <MxPoint> that represents the nearest neighbour point on the
   * given edge.
   * orthogonal - Boolean that specifies if the orthogonal projection onto
   * the perimeter should be returned. If this is false then the intersection
   * of the perimeter and the line between the next and the center point is
   * returned.
   */
  RectanglePerimeter: function(bounds, vertex, next, orthogonal) {
    var cx = bounds.getCenterX()
    var cy = bounds.getCenterY()
    var dx = next.x - cx
    var dy = next.y - cy
    var alpha = Math.atan2(dy, dx)
    var p = new MxPoint(0, 0)
    var pi = Math.PI
    var pi2 = Math.PI / 2
    var beta = pi2 - alpha
    var t = Math.atan2(bounds.height, bounds.width)

    if (alpha < -pi + t || alpha > pi - t) {
      // Left edge
      p.x = bounds.x
      p.y = cy - bounds.width * Math.tan(alpha) / 2
    } else if (alpha < -t) {
      // Top Edge
      p.y = bounds.y
      p.x = cx - bounds.height * Math.tan(beta) / 2
    } else if (alpha < t) {
      // Right Edge
      p.x = bounds.x + bounds.width
      p.y = cy + bounds.width * Math.tan(alpha) / 2
    } else {
      // Bottom Edge
      p.y = bounds.y + bounds.height
      p.x = cx + bounds.height * Math.tan(beta) / 2
    }

    if (orthogonal) {
      if (next.x >= bounds.x &&
        next.x <= bounds.x + bounds.width) {
        p.x = next.x
      } else if (next.y >= bounds.y &&
             next.y <= bounds.y + bounds.height) {
        p.y = next.y
      }
      if (next.x < bounds.x) {
        p.x = bounds.x
      } else if (next.x > bounds.x + bounds.width) {
        p.x = bounds.x + bounds.width
      }
      if (next.y < bounds.y) {
        p.y = bounds.y
      } else if (next.y > bounds.y + bounds.height) {
        p.y = bounds.y + bounds.height
      }
    }

    return p
  },

  /**
   * Function: EllipsePerimeter
   *
   * Describes an elliptic perimeter. See <RectanglePerimeter>
   * for a description of the parameters.
   */
  EllipsePerimeter: function(bounds, vertex, next, orthogonal) {
    var x = bounds.x
    var y = bounds.y
    var a = bounds.width / 2
    var b = bounds.height / 2
    var cx = x + a
    var cy = y + b
    var px = next.x
    var py = next.y

    // Calculates straight line equation through
    // point and ellipse center y = d * x + h
    var dx = parseInt(px - cx)
    var dy = parseInt(py - cy)

    if (dx === 0 && dy !== 0) {
      return new MxPoint(cx, cy + b * dy / Math.abs(dy))
    } else if (dx === 0 && dy === 0) {
      return new MxPoint(px, py)
    }

    if (orthogonal) {
      if (py >= y && py <= y + bounds.height) {
        var ty = py - cy
        var tx = Math.sqrt(a * a * (1 - (ty * ty) / (b * b))) || 0

        if (px <= x) {
          tx = -tx
        }

        return new MxPoint(cx + tx, py)
      }

      if (px >= x && px <= x + bounds.width) {
        let tx = px - cx
        let ty = Math.sqrt(b * b * (1 - (tx * tx) / (a * a))) || 0

        if (py <= y) {
          ty = -ty
        }

        return new MxPoint(px, cy + ty)
      }
    }

    // Calculates intersection
    var d = dy / dx
    var h = cy - d * cx
    var e = a * a * d * d + b * b
    var f = -2 * cx * e
    var g = a * a * d * d * cx * cx +
        b * b * cx * cx -
        a * a * b * b
    var det = Math.sqrt(f * f - 4 * e * g)

    // Two solutions (perimeter points)
    var xout1 = (-f + det) / (2 * e)
    var xout2 = (-f - det) / (2 * e)
    var yout1 = d * xout1 + h
    var yout2 = d * xout2 + h
    var dist1 = Math.sqrt(Math.pow((xout1 - px), 2) +
          Math.pow((yout1 - py), 2))
    var dist2 = Math.sqrt(Math.pow((xout2 - px), 2) +
          Math.pow((yout2 - py), 2))

    // Correct solution
    var xout = 0
    var yout = 0

    if (dist1 < dist2) {
      xout = xout1
      yout = yout1
    } else {
      xout = xout2
      yout = yout2
    }

    return new MxPoint(xout, yout)
  },

  /**
   * Function: RhombusPerimeter
   *
   * Describes a rhombus (aka diamond) perimeter. See <RectanglePerimeter>
   * for a description of the parameters.
   */
  RhombusPerimeter: function(bounds, vertex, next, orthogonal) {
    var x = bounds.x
    var y = bounds.y
    var w = bounds.width
    var h = bounds.height

    var cx = x + w / 2
    var cy = y + h / 2

    var px = next.x
    var py = next.y

    // Special case for intersecting the diamond's corners
    if (cx === px) {
      if (cy > py) {
        return new MxPoint(cx, y) // top
      } else {
        return new MxPoint(cx, y + h) // bottom
      }
    } else if (cy === py) {
      if (cx > px) {
        return new MxPoint(x, cy) // left
      } else {
        return new MxPoint(x + w, cy) // right
      }
    }

    var tx = cx
    var ty = cy

    if (orthogonal) {
      if (px >= x && px <= x + w) {
        tx = px
      } else if (py >= y && py <= y + h) {
        ty = py
      }
    }

    // In which quadrant will the intersection be?
    // set the slope and offset of the border line accordingly
    if (px < cx) {
      if (py < cy) {
        return MxUtils.intersection(px, py, tx, ty, cx, y, x, cy)
      } else {
        return MxUtils.intersection(px, py, tx, ty, cx, y + h, x, cy)
      }
    } else if (py < cy) {
      return MxUtils.intersection(px, py, tx, ty, cx, y, x + w, cy)
    } else {
      return MxUtils.intersection(px, py, tx, ty, cx, y + h, x + w, cy)
    }
  },

  /**
   * Function: TrianglePerimeter
   *
   * Describes a triangle perimeter. See <RectanglePerimeter>
   * for a description of the parameters.
   */
  TrianglePerimeter: function(bounds, vertex, next, orthogonal) {
    var direction = (vertex !== null)
      ? vertex.style[MxConstants.STYLE_DIRECTION] : null
    var vertical = direction === MxConstants.DIRECTION_NORTH ||
      direction === MxConstants.DIRECTION_SOUTH

    var x = bounds.x
    var y = bounds.y
    var w = bounds.width
    var h = bounds.height

    var cx = x + w / 2
    var cy = y + h / 2

    var start = new MxPoint(x, y)
    var corner = new MxPoint(x + w, cy)
    var end = new MxPoint(x, y + h)

    if (direction === MxConstants.DIRECTION_NORTH) {
      start = end
      corner = new MxPoint(cx, y)
      end = new MxPoint(x + w, y + h)
    } else if (direction === MxConstants.DIRECTION_SOUTH) {
      corner = new MxPoint(cx, y + h)
      end = new MxPoint(x + w, y)
    } else if (direction === MxConstants.DIRECTION_WEST) {
      start = new MxPoint(x + w, y)
      corner = new MxPoint(x, cy)
      end = new MxPoint(x + w, y + h)
    }

    var dx = next.x - cx
    var dy = next.y - cy

    var alpha = (vertical) ? Math.atan2(dx, dy) : Math.atan2(dy, dx)
    var t = (vertical) ? Math.atan2(w, h) : Math.atan2(h, w)

    var base = false

    if (direction === MxConstants.DIRECTION_NORTH ||
      direction === MxConstants.DIRECTION_WEST) {
      base = alpha > -t && alpha < t
    } else {
      base = alpha < -Math.PI + t || alpha > Math.PI - t
    }

    var result = null

    if (base) {
      if (orthogonal && ((vertical && next.x >= start.x && next.x <= end.x) ||
        (!vertical && next.y >= start.y && next.y <= end.y))) {
        if (vertical) {
          result = new MxPoint(next.x, start.y)
        } else {
          result = new MxPoint(start.x, next.y)
        }
      } else {
        if (direction === MxConstants.DIRECTION_NORTH) {
          result = new MxPoint(x + w / 2 + h * Math.tan(alpha) / 2,
            y + h)
        } else if (direction === MxConstants.DIRECTION_SOUTH) {
          result = new MxPoint(x + w / 2 - h * Math.tan(alpha) / 2,
            y)
        } else if (direction === MxConstants.DIRECTION_WEST) {
          result = new MxPoint(x + w, y + h / 2 +
            w * Math.tan(alpha) / 2)
        } else {
          result = new MxPoint(x, y + h / 2 -
            w * Math.tan(alpha) / 2)
        }
      }
    } else {
      if (orthogonal) {
        var pt = new MxPoint(cx, cy)

        if (next.y >= y && next.y <= y + h) {
          pt.x = (vertical) ? cx : (
            (direction === MxConstants.DIRECTION_WEST)
              ? x + w : x)
          pt.y = next.y
        } else if (next.x >= x && next.x <= x + w) {
          pt.x = next.x
          pt.y = (!vertical) ? cy : (
            (direction === MxConstants.DIRECTION_NORTH)
              ? y + h : y)
        }

        // Compute angle
        dx = next.x - pt.x
        dy = next.y - pt.y

        cx = pt.x
        cy = pt.y
      }

      if ((vertical && next.x <= x + w / 2) ||
        (!vertical && next.y <= y + h / 2)) {
        result = MxUtils.intersection(next.x, next.y, cx, cy,
          start.x, start.y, corner.x, corner.y)
      } else {
        result = MxUtils.intersection(next.x, next.y, cx, cy,
          corner.x, corner.y, end.x, end.y)
      }
    }

    if (result === null) {
      result = new MxPoint(cx, cy)
    }

    return result
  },

  /**
   * Function: HexagonPerimeter
   *
   * Describes a hexagon perimeter. See <RectanglePerimeter>
   * for a description of the parameters.
   */
  HexagonPerimeter: function(bounds, vertex, next, orthogonal) {
    var x = bounds.x
    var y = bounds.y
    var w = bounds.width
    var h = bounds.height

    var cx = bounds.getCenterX()
    var cy = bounds.getCenterY()
    var px = next.x
    var py = next.y
    var dx = px - cx
    var dy = py - cy
    var alpha = -Math.atan2(dy, dx)
    var pi = Math.PI
    var pi2 = Math.PI / 2

    var result = new MxPoint(cx, cy)

    var direction = (vertex !== null) ? MxUtils.getValue(
      vertex.style, MxConstants.STYLE_DIRECTION,
      MxConstants.DIRECTION_EAST) : MxConstants.DIRECTION_EAST
    var vertical = direction === MxConstants.DIRECTION_NORTH ||
        direction === MxConstants.DIRECTION_SOUTH
    var a = new MxPoint()
    var b = new MxPoint()

    // Only consider corrects quadrants for the orthogonal case.
    if (
      ((px < x) && (py < y)) || ((px < x) && (py > y + h)) ||
      ((px > x + w) && (py < y)) || ((px > x + w) && (py > y + h))
    ) {
      orthogonal = false
    }

    if (orthogonal) {
      if (vertical) {
        // Special cases where intersects with hexagon corners
        if (px === cx) {
          if (py <= y) {
            return new MxPoint(cx, y)
          } else if (py >= y + h) {
            return new MxPoint(cx, y + h)
          }
        } else if (px < x) {
          if (py === y + h / 4) {
            return new MxPoint(x, y + h / 4)
          } else if (py === y + 3 * h / 4) {
            return new MxPoint(x, y + 3 * h / 4)
          }
        } else if (px > x + w) {
          if (py === y + h / 4) {
            return new MxPoint(x + w, y + h / 4)
          } else if (py === y + 3 * h / 4) {
            return new MxPoint(x + w, y + 3 * h / 4)
          }
        } else if (px === x) {
          if (py < cy) {
            return new MxPoint(x, y + h / 4)
          } else if (py > cy) {
            return new MxPoint(x, y + 3 * h / 4)
          }
        } else if (px === x + w) {
          if (py < cy) {
            return new MxPoint(x + w, y + h / 4)
          } else if (py > cy) {
            return new MxPoint(x + w, y + 3 * h / 4)
          }
        }
        if (py === y) {
          return new MxPoint(cx, y)
        } else if (py === y + h) {
          return new MxPoint(cx, y + h)
        }

        if (px < cx) {
          if ((py > y + h / 4) && (py < y + 3 * h / 4)) {
            a = new MxPoint(x, y)
            b = new MxPoint(x, y + h)
          } else if (py < y + h / 4) {
            a = new MxPoint(x - Math.floor(0.5 * w), y +
                Math.floor(0.5 * h))
            b = new MxPoint(x + w, y - Math.floor(0.25 * h))
          } else if (py > y + 3 * h / 4) {
            a = new MxPoint(x - Math.floor(0.5 * w), y +
                Math.floor(0.5 * h))
            b = new MxPoint(x + w, y + Math.floor(1.25 * h))
          }
        } else if (px > cx) {
          if ((py > y + h / 4) && (py < y + 3 * h / 4)) {
            a = new MxPoint(x + w, y)
            b = new MxPoint(x + w, y + h)
          } else if (py < y + h / 4) {
            a = new MxPoint(x, y - Math.floor(0.25 * h))
            b = new MxPoint(x + Math.floor(1.5 * w), y +
                Math.floor(0.5 * h))
          } else if (py > y + 3 * h / 4) {
            a = new MxPoint(x + Math.floor(1.5 * w), y +
                Math.floor(0.5 * h))
            b = new MxPoint(x, y + Math.floor(1.25 * h))
          }
        }
      } else {
        // Special cases where intersects with hexagon corners
        if (py === cy) {
          if (px <= x) {
            return new MxPoint(x, y + h / 2)
          } else if (px >= x + w) {
            return new MxPoint(x + w, y + h / 2)
          }
        } else if (py < y) {
          if (px === x + w / 4) {
            return new MxPoint(x + w / 4, y)
          } else if (px === x + 3 * w / 4) {
            return new MxPoint(x + 3 * w / 4, y)
          }
        } else if (py > y + h) {
          if (px === x + w / 4) {
            return new MxPoint(x + w / 4, y + h)
          } else if (px === x + 3 * w / 4) {
            return new MxPoint(x + 3 * w / 4, y + h)
          }
        } else if (py === y) {
          if (px < cx) {
            return new MxPoint(x + w / 4, y)
          } else if (px > cx) {
            return new MxPoint(x + 3 * w / 4, y)
          }
        } else if (py === y + h) {
          if (px < cx) {
            return new MxPoint(x + w / 4, y + h)
          } else if (py > cy) {
            return new MxPoint(x + 3 * w / 4, y + h)
          }
        }
        if (px === x) {
          return new MxPoint(x, cy)
        } else if (px === x + w) {
          return new MxPoint(x + w, cy)
        }

        if (py < cy) {
          if ((px > x + w / 4) && (px < x + 3 * w / 4)) {
            a = new MxPoint(x, y)
            b = new MxPoint(x + w, y)
          } else if (px < x + w / 4) {
            a = new MxPoint(x - Math.floor(0.25 * w), y + h)
            b = new MxPoint(x + Math.floor(0.5 * w), y -
                Math.floor(0.5 * h))
          } else if (px > x + 3 * w / 4) {
            a = new MxPoint(x + Math.floor(0.5 * w), y -
                Math.floor(0.5 * h))
            b = new MxPoint(x + Math.floor(1.25 * w), y + h)
          }
        } else if (py > cy) {
          if ((px > x + w / 4) && (px < x + 3 * w / 4)) {
            a = new MxPoint(x, y + h)
            b = new MxPoint(x + w, y + h)
          } else if (px < x + w / 4) {
            a = new MxPoint(x - Math.floor(0.25 * w), y)
            b = new MxPoint(x + Math.floor(0.5 * w), y +
                Math.floor(1.5 * h))
          } else if (px > x + 3 * w / 4) {
            a = new MxPoint(x + Math.floor(0.5 * w), y +
                Math.floor(1.5 * h))
            b = new MxPoint(x + Math.floor(1.25 * w), y)
          }
        }
      }

      var tx = cx
      var ty = cy

      if (px >= x && px <= x + w) {
        tx = px

        if (py < cy) {
          ty = y + h
        } else {
          ty = y
        }
      } else if (py >= y && py <= y + h) {
        ty = py

        if (px < cx) {
          tx = x + w
        } else {
          tx = x
        }
      }

      result = MxUtils.intersection(tx, ty, next.x, next.y, a.x, a.y, b.x, b.y)
    } else {
      if (vertical) {
        var beta = Math.atan2(h / 4, w / 2)

        // Special cases where intersects with hexagon corners
        if (alpha === beta) {
          return new MxPoint(x + w, y + Math.floor(0.25 * h))
        } else if (alpha === pi2) {
          return new MxPoint(x + Math.floor(0.5 * w), y)
        } else if (alpha === (pi - beta)) {
          return new MxPoint(x, y + Math.floor(0.25 * h))
        } else if (alpha === -beta) {
          return new MxPoint(x + w, y + Math.floor(0.75 * h))
        } else if (alpha === (-pi2)) {
          return new MxPoint(x + Math.floor(0.5 * w), y + h)
        } else if (alpha === (-pi + beta)) {
          return new MxPoint(x, y + Math.floor(0.75 * h))
        }

        if ((alpha < beta) && (alpha > -beta)) {
          a = new MxPoint(x + w, y)
          b = new MxPoint(x + w, y + h)
        } else if ((alpha > beta) && (alpha < pi2)) {
          a = new MxPoint(x, y - Math.floor(0.25 * h))
          b = new MxPoint(x + Math.floor(1.5 * w), y +
              Math.floor(0.5 * h))
        } else if ((alpha > pi2) && (alpha < (pi - beta))) {
          a = new MxPoint(x - Math.floor(0.5 * w), y +
              Math.floor(0.5 * h))
          b = new MxPoint(x + w, y - Math.floor(0.25 * h))
        } else if (((alpha > (pi - beta)) && (alpha <= pi)) ||
            ((alpha < (-pi + beta)) && (alpha >= -pi))) {
          a = new MxPoint(x, y)
          b = new MxPoint(x, y + h)
        } else if ((alpha < -beta) && (alpha > -pi2)) {
          a = new MxPoint(x + Math.floor(1.5 * w), y +
              Math.floor(0.5 * h))
          b = new MxPoint(x, y + Math.floor(1.25 * h))
        } else if ((alpha < -pi2) && (alpha > (-pi + beta))) {
          a = new MxPoint(x - Math.floor(0.5 * w), y +
              Math.floor(0.5 * h))
          b = new MxPoint(x + w, y + Math.floor(1.25 * h))
        }
      } else {
        let beta = Math.atan2(h / 2, w / 4)

        // Special cases where intersects with hexagon corners
        if (alpha === beta) {
          return new MxPoint(x + Math.floor(0.75 * w), y)
        } else if (alpha === (pi - beta)) {
          return new MxPoint(x + Math.floor(0.25 * w), y)
        } else if ((alpha === pi) || (alpha === -pi)) {
          return new MxPoint(x, y + Math.floor(0.5 * h))
        } else if (alpha === 0) {
          return new MxPoint(x + w, y + Math.floor(0.5 * h))
        } else if (alpha === -beta) {
          return new MxPoint(x + Math.floor(0.75 * w), y + h)
        } else if (alpha === (-pi + beta)) {
          return new MxPoint(x + Math.floor(0.25 * w), y + h)
        }

        if ((alpha > 0) && (alpha < beta)) {
          a = new MxPoint(x + Math.floor(0.5 * w), y -
              Math.floor(0.5 * h))
          b = new MxPoint(x + Math.floor(1.25 * w), y + h)
        } else if ((alpha > beta) && (alpha < (pi - beta))) {
          a = new MxPoint(x, y)
          b = new MxPoint(x + w, y)
        } else if ((alpha > (pi - beta)) && (alpha < pi)) {
          a = new MxPoint(x - Math.floor(0.25 * w), y + h)
          b = new MxPoint(x + Math.floor(0.5 * w), y -
              Math.floor(0.5 * h))
        } else if ((alpha < 0) && (alpha > -beta)) {
          a = new MxPoint(x + Math.floor(0.5 * w), y +
              Math.floor(1.5 * h))
          b = new MxPoint(x + Math.floor(1.25 * w), y)
        } else if ((alpha < -beta) && (alpha > (-pi + beta))) {
          a = new MxPoint(x, y + h)
          b = new MxPoint(x + w, y + h)
        } else if ((alpha < (-pi + beta)) && (alpha > -pi)) {
          a = new MxPoint(x - Math.floor(0.25 * w), y)
          b = new MxPoint(x + Math.floor(0.5 * w), y +
              Math.floor(1.5 * h))
        }
      }

      result = MxUtils.intersection(cx, cy, next.x, next.y, a.x, a.y, b.x, b.y)
    }

    if (result === null) {
      return new MxPoint(cx, cy)
    }

    return result
  }
}

export default MxPerimeter
