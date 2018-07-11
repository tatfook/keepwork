import MxUtils from '../util/MxUtils'
import MxConstants from '../util/MxConstants'
import MxCellState from './MxCellState'
import MxPoint from '../util/MxPoint'
import MxRectangle from '../util/MxRectangle'

/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
const MxEdgeStyle = {
  /**
   * Class: MxEdgeStyle
   *
   * Provides various edge styles to be used as the values for
   * <MxConstants.STYLE_EDGE> in a cell style.
   *
   * Example:
   *
   * (code)
   * var style = stylesheet.getDefaultEdgeStyle();
   * style[MxConstants.STYLE_EDGE] = MxEdgeStyle.ElbowConnector;
   * (end)
   *
   * Sets the default edge style to <ElbowConnector>.
   *
   * Custom edge style:
   *
   * To write a custom edge style, a function must be added to the MxEdgeStyle
   * object as follows:
   *
   * (code)
   * MxEdgeStyle.MyStyle = function(state, source, target, points, result)
   * {
   *   if (source !== null && target !== null)
   *   {
   *     var pt = new MxPoint(target.getCenterX(), source.getCenterY());
   *
   *     if (MxUtils.contains(source, pt.x, pt.y))
   *     {
   *       pt.y = source.y + source.height;
   *     }
   *
   *     result.push(pt);
   *   }
   * };
   * (end)
   *
   * In the above example, a right angle is created using a point on the
   * horizontal center of the target vertex and the vertical center of the source
   * vertex. The code checks if that point intersects the source vertex and makes
   * the edge straight if it does. The point is then added into the result array,
   * which acts as the return value of the function.
   *
   * The new edge style should then be registered in the <mxStyleRegistry> as follows:
   * (code)
   * mxStyleRegistry.putValue('myEdgeStyle', MxEdgeStyle.MyStyle);
   * (end)
   *
   * The custom edge style above can now be used in a specific edge as follows:
   *
   * (code)
   * model.setStyle(edge, 'edgeStyle=myEdgeStyle');
   * (end)
   *
   * Note that the key of the <mxStyleRegistry> entry for the function should
   * be used in string values, unless <mxGraphView.allowEval> is true, in
   * which case you can also use MxEdgeStyle.MyStyle for the value in the
   * cell style above.
   *
   * Or it can be used for all edges in the graph as follows:
   *
   * (code)
   * var style = graph.getStylesheet().getDefaultEdgeStyle();
   * style[MxConstants.STYLE_EDGE] = MxEdgeStyle.MyStyle;
   * (end)
   *
   * Note that the object can be used directly when programmatically setting
   * the value, but the key in the <mxStyleRegistry> should be used when
   * setting the value via a key, value pair in a cell style.
   *
   * Function: EntityRelation
   *
   * Implements an entity relation style for edges (as used in database
   * schema diagrams). At the time the function is called, the result
   * array contains a placeholder (null) for the first absolute point,
   * that is, the point where the edge and source terminal are connected.
   * The implementation of the style then adds all intermediate waypoints
   * except for the last point, that is, the connection point between the
   * edge and the target terminal. The first ant the last point in the
   * result array are then replaced with mxPoints that take into account
   * the terminal's perimeter and next point on the edge.
   *
   * Parameters:
   *
   * state - <MxCellState> that represents the edge to be updated.
   * source - <MxCellState> that represents the source terminal.
   * target - <MxCellState> that represents the target terminal.
   * points - List of relative control points.
   * result - Array of <mxPoints> that represent the actual points of the
   * edge.
   */
  EntityRelation: function(state, source, target, points, result) {
    var view = state.view
    var graph = view.graph
    var segment =
      MxUtils.getValue(
        state.style,
        MxConstants.STYLE_SEGMENT,
        MxConstants.ENTITY_SEGMENT
      ) * view.scale

    var pts = state.absolutePoints
    var p0 = pts[0]
    var pe = pts[pts.length - 1]

    var isSourceLeft = false

    if (p0 !== null) {
      source = new MxCellState()
      source.x = p0.x
      source.y = p0.y
    } else if (source !== null) {
      var constraint = MxUtils.getPortConstraints(
        source,
        state,
        true,
        MxConstants.DIRECTION_MASK_NONE
      )

      if (
        constraint !== MxConstants.DIRECTION_MASK_NONE &&
        constraint !==
          MxConstants.DIRECTION_MASK_WEST + MxConstants.DIRECTION_MASK_EAST
      ) {
        isSourceLeft = constraint === MxConstants.DIRECTION_MASK_WEST
      } else {
        var sourceGeometry = graph.getCellGeometry(source.cell)

        if (sourceGeometry.relative) {
          isSourceLeft = sourceGeometry.x <= 0.5
        } else if (target !== null) {
          isSourceLeft = target.x + target.width < source.x
        }
      }
    } else {
      return
    }

    var isTargetLeft = true

    if (pe !== null) {
      target = new MxCellState()
      target.x = pe.x
      target.y = pe.y
    } else if (target !== null) {
      let constraint = MxUtils.getPortConstraints(
        target,
        state,
        false,
        MxConstants.DIRECTION_MASK_NONE
      )

      if (
        constraint !== MxConstants.DIRECTION_MASK_NONE &&
        constraint !==
          MxConstants.DIRECTION_MASK_WEST + MxConstants.DIRECTION_MASK_EAST
      ) {
        isTargetLeft = constraint === MxConstants.DIRECTION_MASK_WEST
      } else {
        var targetGeometry = graph.getCellGeometry(target.cell)

        if (targetGeometry.relative) {
          isTargetLeft = targetGeometry.x <= 0.5
        } else if (source !== null) {
          isTargetLeft = source.x + source.width < target.x
        }
      }
    }

    if (source !== null && target !== null) {
      var x0 = isSourceLeft ? source.x : source.x + source.width
      var y0 = view.getRoutingCenterY(source)

      var xe = isTargetLeft ? target.x : target.x + target.width
      var ye = view.getRoutingCenterY(target)

      var seg = segment

      var dx = isSourceLeft ? -seg : seg
      var dep = new MxPoint(x0 + dx, y0)

      dx = isTargetLeft ? -seg : seg
      var arr = new MxPoint(xe + dx, ye)

      // Adds intermediate points if both go out on same side
      if (isSourceLeft === isTargetLeft) {
        var x = isSourceLeft
          ? Math.min(x0, xe) - segment
          : Math.max(x0, xe) + segment

        result.push(new MxPoint(x, y0))
        result.push(new MxPoint(x, ye))
      } else if ((dep.x < arr.x) === isSourceLeft) {
        var midY = y0 + (ye - y0) / 2

        result.push(dep)
        result.push(new MxPoint(dep.x, midY))
        result.push(new MxPoint(arr.x, midY))
        result.push(arr)
      } else {
        result.push(dep)
        result.push(arr)
      }
    }
  },

  /**
   * Function: Loop
   *
   * Implements a self-reference, aka. loop.
   */
  Loop: function(state, source, target, points, result) {
    var pts = state.absolutePoints

    var p0 = pts[0]
    var pe = pts[pts.length - 1]

    if (p0 !== null && pe !== null) {
      if (points !== null && points.length > 0) {
        for (var i = 0; i < points.length; i++) {
          var pt = points[i]
          pt = state.view.transformControlPoint(state, pt)
          result.push(new MxPoint(pt.x, pt.y))
        }
      }

      return
    }

    if (source !== null) {
      var view = state.view
      var graph = view.graph
      let pt = points !== null && points.length > 0 ? points[0] : null

      if (pt !== null) {
        pt = view.transformControlPoint(state, pt)

        if (MxUtils.contains(source, pt.x, pt.y)) {
          pt = null
        }
      }

      var x = 0
      var dx = 0
      var y = 0
      var dy = 0

      var seg =
        MxUtils.getValue(
          state.style,
          MxConstants.STYLE_SEGMENT,
          graph.gridSize
        ) * view.scale
      var dir = MxUtils.getValue(
        state.style,
        MxConstants.STYLE_DIRECTION,
        MxConstants.DIRECTION_WEST
      )

      if (
        dir === MxConstants.DIRECTION_NORTH ||
        dir === MxConstants.DIRECTION_SOUTH
      ) {
        x = view.getRoutingCenterX(source)
        dx = seg
      } else {
        y = view.getRoutingCenterY(source)
        dy = seg
      }

      if (pt === null || pt.x < source.x || pt.x > source.x + source.width) {
        if (pt !== null) {
          x = pt.x
          dy = Math.max(Math.abs(y - pt.y), dy)
        } else {
          if (dir === MxConstants.DIRECTION_NORTH) {
            y = source.y - 2 * dx
          } else if (dir === MxConstants.DIRECTION_SOUTH) {
            y = source.y + source.height + 2 * dx
          } else if (dir === MxConstants.DIRECTION_EAST) {
            x = source.x - 2 * dy
          } else {
            x = source.x + source.width + 2 * dy
          }
        }
      } else if (pt !== null) {
        x = view.getRoutingCenterX(source)
        dx = Math.max(Math.abs(x - pt.x), dy)
        y = pt.y
        dy = 0
      }

      result.push(new MxPoint(x - dx, y - dy))
      result.push(new MxPoint(x + dx, y + dy))
    }
  },

  /**
   * Function: ElbowConnector
   *
   * Uses either <SideToSide> or <TopToBottom> depending on the horizontal
   * flag in the cell style. <SideToSide> is used if horizontal is true or
   * unspecified. See <EntityRelation> for a description of the
   * parameters.
   */
  ElbowConnector: function(state, source, target, points, result) {
    var pt = points !== null && points.length > 0 ? points[0] : null

    var vertical = false
    var horizontal = false

    if (source !== null && target !== null) {
      if (pt !== null) {
        var left = Math.min(source.x, target.x)
        var right = Math.max(source.x + source.width, target.x + target.width)

        var top = Math.min(source.y, target.y)
        var bottom = Math.max(
          source.y + source.height,
          target.y + target.height
        )

        pt = state.view.transformControlPoint(state, pt)

        vertical = pt.y < top || pt.y > bottom
        horizontal = pt.x < left || pt.x > right
      } else {
        let left = Math.max(source.x, target.x)
        let right = Math.min(source.x + source.width, target.x + target.width)

        vertical = left === right

        if (!vertical) {
          let top = Math.max(source.y, target.y)
          let bottom = Math.min(
            source.y + source.height,
            target.y + target.height
          )

          horizontal = top === bottom
        }
      }
    }

    if (
      !horizontal &&
      (vertical ||
        state.style[MxConstants.STYLE_ELBOW] === MxConstants.ELBOW_VERTICAL)
    ) {
      MxEdgeStyle.TopToBottom(state, source, target, points, result)
    } else {
      MxEdgeStyle.SideToSide(state, source, target, points, result)
    }
  },

  /**
   * Function: SideToSide
   *
   * Implements a vertical elbow edge. See <EntityRelation> for a description
   * of the parameters.
   */
  SideToSide: function(state, source, target, points, result) {
    var view = state.view
    var pt = points !== null && points.length > 0 ? points[0] : null
    var pts = state.absolutePoints
    var p0 = pts[0]
    var pe = pts[pts.length - 1]

    if (pt !== null) {
      pt = view.transformControlPoint(state, pt)
    }

    if (p0 !== null) {
      source = new MxCellState()
      source.x = p0.x
      source.y = p0.y
    }

    if (pe !== null) {
      target = new MxCellState()
      target.x = pe.x
      target.y = pe.y
    }

    if (source !== null && target !== null) {
      var l = Math.max(source.x, target.x)
      var r = Math.min(source.x + source.width, target.x + target.width)

      var x = pt !== null ? pt.x : Math.round(r + (l - r) / 2)

      var y1 = view.getRoutingCenterY(source)
      var y2 = view.getRoutingCenterY(target)

      if (pt !== null) {
        if (pt.y >= source.y && pt.y <= source.y + source.height) {
          y1 = pt.y
        }

        if (pt.y >= target.y && pt.y <= target.y + target.height) {
          y2 = pt.y
        }
      }

      if (
        !MxUtils.contains(target, x, y1) &&
        !MxUtils.contains(source, x, y1)
      ) {
        result.push(new MxPoint(x, y1))
      }

      if (
        !MxUtils.contains(target, x, y2) &&
        !MxUtils.contains(source, x, y2)
      ) {
        result.push(new MxPoint(x, y2))
      }

      if (result.length === 1) {
        if (pt !== null) {
          if (
            !MxUtils.contains(target, x, pt.y) &&
            !MxUtils.contains(source, x, pt.y)
          ) {
            result.push(new MxPoint(x, pt.y))
          }
        } else {
          var t = Math.max(source.y, target.y)
          var b = Math.min(source.y + source.height, target.y + target.height)

          result.push(new MxPoint(x, t + (b - t) / 2))
        }
      }
    }
  },

  /**
   * Function: TopToBottom
   *
   * Implements a horizontal elbow edge. See <EntityRelation> for a
   * description of the parameters.
   */
  TopToBottom: function(state, source, target, points, result) {
    var view = state.view
    var pt = points !== null && points.length > 0 ? points[0] : null
    var pts = state.absolutePoints
    var p0 = pts[0]
    var pe = pts[pts.length - 1]

    if (pt !== null) {
      pt = view.transformControlPoint(state, pt)
    }

    if (p0 !== null) {
      source = new MxCellState()
      source.x = p0.x
      source.y = p0.y
    }

    if (pe !== null) {
      target = new MxCellState()
      target.x = pe.x
      target.y = pe.y
    }

    if (source !== null && target !== null) {
      var t = Math.max(source.y, target.y)
      var b = Math.min(source.y + source.height, target.y + target.height)

      var x = view.getRoutingCenterX(source)

      if (pt !== null && pt.x >= source.x && pt.x <= source.x + source.width) {
        x = pt.x
      }

      var y = pt !== null ? pt.y : Math.round(b + (t - b) / 2)

      if (!MxUtils.contains(target, x, y) && !MxUtils.contains(source, x, y)) {
        result.push(new MxPoint(x, y))
      }

      if (pt !== null && pt.x >= target.x && pt.x <= target.x + target.width) {
        x = pt.x
      } else {
        x = view.getRoutingCenterX(target)
      }

      if (!MxUtils.contains(target, x, y) && !MxUtils.contains(source, x, y)) {
        result.push(new MxPoint(x, y))
      }

      if (result.length === 1) {
        if (pt !== null && result.length === 1) {
          if (
            !MxUtils.contains(target, pt.x, y) &&
            !MxUtils.contains(source, pt.x, y)
          ) {
            result.push(new MxPoint(pt.x, y))
          }
        } else {
          var l = Math.max(source.x, target.x)
          var r = Math.min(source.x + source.width, target.x + target.width)

          result.push(new MxPoint(l + (r - l) / 2, y))
        }
      }
    }
  },

  /**
   * Function: SegmentConnector
   *
   * Implements an orthogonal edge style. Use <mxEdgeSegmentHandler>
   * as an interactive handler for this style.
   */
  SegmentConnector: function(state, source, target, hints, result) {
    // Creates array of all way- and terminalpoints
    var pts = state.absolutePoints
    var tol = Math.max(1, state.view.scale)

    // Whether the first segment outgoing from the source end is horizontal
    var lastPushed = result.length > 0 ? result[0] : null
    var horizontal = true
    var hint = null

    // Adds waypoints only if outside of tolerance
    function pushPoint(pt) {
      if (
        lastPushed === null ||
        Math.abs(lastPushed.x - pt.x) >= tol ||
        Math.abs(lastPushed.y - pt.y) >= tol
      ) {
        result.push(pt)
        lastPushed = pt
      }

      return lastPushed
    }

    // Adds the first point
    var pt = pts[0]

    if (pt === null && source !== null) {
      pt = new MxPoint(
        state.view.getRoutingCenterX(source),
        state.view.getRoutingCenterY(source)
      )
    } else if (pt !== null) {
      pt = pt.clone()
    }

    pt.x = Math.round(pt.x)
    pt.y = Math.round(pt.y)

    var lastInx = pts.length - 1

    // Adds the waypoints
    if (hints !== null && hints.length > 0) {
      // Converts all hints and removes nulls
      var newHints = []

      for (var i = 0; i < hints.length; i++) {
        var tmp = state.view.transformControlPoint(state, hints[i])

        if (tmp !== null) {
          tmp.x = Math.round(tmp.x)
          tmp.y = Math.round(tmp.y)
          newHints.push(tmp)
        }
      }

      if (newHints.length === 0) {
        return
      }

      hints = newHints

      // Aligns source and target hint to fixed points
      if (pt !== null && hints[0] !== null) {
        if (Math.abs(hints[0].x - pt.x) < tol) {
          hints[0].x = pt.x
        }

        if (Math.abs(hints[0].y - pt.y) < tol) {
          hints[0].y = pt.y
        }
      }

      var pe = pts[lastInx]

      if (pe !== null && hints[hints.length - 1] !== null) {
        if (Math.abs(hints[hints.length - 1].x - pe.x) < tol) {
          hints[hints.length - 1].x = pe.x
        }

        if (Math.abs(hints[hints.length - 1].y - pe.y) < tol) {
          hints[hints.length - 1].y = pe.y
        }
      }

      hint = hints[0]

      var currentTerm = source
      var currentPt = pts[0]
      var hozChan = false
      var vertChan = false
      var currentHint = hint

      if (currentPt !== null) {
        currentPt.x = Math.round(currentPt.x)
        currentPt.y = Math.round(currentPt.y)
        currentTerm = null
      }

      // Check for alignment with fixed points and with channels
      // at source and target segments only
      for (let i = 0; i < 2; i++) {
        var fixedVertAlign = currentPt !== null && currentPt.x === currentHint.x
        var fixedHozAlign = currentPt !== null && currentPt.y === currentHint.y

        var inHozChan =
          currentTerm !== null &&
          (currentHint.y >= currentTerm.y &&
            currentHint.y <= currentTerm.y + currentTerm.height)
        var inVertChan =
          currentTerm !== null &&
          (currentHint.x >= currentTerm.x &&
            currentHint.x <= currentTerm.x + currentTerm.width)

        hozChan = fixedHozAlign || (currentPt === null && inHozChan)
        vertChan = fixedVertAlign || (currentPt === null && inVertChan)

        // If the current hint falls in both the hor and vert channels in the case
        // of a floating port, or if the hint is exactly co-incident with a
        // fixed point, ignore the source and try to work out the orientation
        // from the target end
        if (
          i === 0 &&
          ((hozChan && vertChan) || (fixedVertAlign && fixedHozAlign))
        ) {
        } else {
          if (
            currentPt !== null &&
            (!fixedHozAlign && !fixedVertAlign) &&
            (inHozChan || inVertChan)
          ) {
            horizontal = !inHozChan
            break
          }

          if (vertChan || hozChan) {
            horizontal = hozChan

            if (i === 1) {
              // Work back from target end
              horizontal = hints.length % 2 === 0 ? hozChan : vertChan
            }

            break
          }
        }

        currentTerm = target
        currentPt = pts[lastInx]

        if (currentPt !== null) {
          currentPt.x = Math.round(currentPt.x)
          currentPt.y = Math.round(currentPt.y)
          currentTerm = null
        }

        currentHint = hints[hints.length - 1]

        if (fixedVertAlign && fixedHozAlign) {
          hints = hints.slice(1)
        }
      }

      if (
        horizontal &&
        ((pts[0] !== null && pts[0].y !== hint.y) ||
          (pts[0] === null &&
            source !== null &&
            (hint.y < source.y || hint.y > source.y + source.height)))
      ) {
        pushPoint(new MxPoint(pt.x, hint.y))
      } else if (
        !horizontal &&
        ((pts[0] !== null && pts[0].x !== hint.x) ||
          (pts[0] === null &&
            source !== null &&
            (hint.x < source.x || hint.x > source.x + source.width)))
      ) {
        pushPoint(new MxPoint(hint.x, pt.y))
      }

      if (horizontal) {
        pt.y = hint.y
      } else {
        pt.x = hint.x
      }

      for (let i = 0; i < hints.length; i++) {
        horizontal = !horizontal
        hint = hints[i]

        // mxLog.show();
        // mxLog.debug('hint', i, hint.x, hint.y);

        if (horizontal) {
          pt.y = hint.y
        } else {
          pt.x = hint.x
        }

        pushPoint(pt.clone())
      }
    } else {
      hint = pt
      // FIXME: First click in connect preview toggles orientation
      horizontal = true
    }

    // Adds the last point
    pt = pts[lastInx]

    if (pt === null && target !== null) {
      pt = new MxPoint(
        state.view.getRoutingCenterX(target),
        state.view.getRoutingCenterY(target)
      )
    }

    if (pt !== null) {
      pt.x = Math.round(pt.x)
      pt.y = Math.round(pt.y)

      if (hint !== null) {
        if (
          horizontal &&
          ((pts[lastInx] !== null && pts[lastInx].y !== hint.y) ||
            (pts[lastInx] === null &&
              target !== null &&
              (hint.y < target.y || hint.y > target.y + target.height)))
        ) {
          pushPoint(new MxPoint(pt.x, hint.y))
        } else if (
          !horizontal &&
          ((pts[lastInx] !== null && pts[lastInx].x !== hint.x) ||
            (pts[lastInx] === null &&
              target !== null &&
              (hint.x < target.x || hint.x > target.x + target.width)))
        ) {
          pushPoint(new MxPoint(hint.x, pt.y))
        }
      }
    }

    // Removes bends inside the source terminal for floating ports
    if (pts[0] === null && source !== null) {
      while (
        result.length > 1 &&
        result[1] !== null &&
        MxUtils.contains(source, result[1].x, result[1].y)
      ) {
        result.splice(1, 1)
      }
    }

    // Removes bends inside the target terminal
    if (pts[lastInx] === null && target !== null) {
      while (
        result.length > 1 &&
        result[result.length - 1] !== null &&
        MxUtils.contains(
          target,
          result[result.length - 1].x,
          result[result.length - 1].y
        )
      ) {
        result.splice(result.length - 1, 1)
      }
    }

    // Removes last point if inside tolerance with end point
    if (
      pe !== null &&
      result[result.length - 1] !== null &&
      Math.abs(pe.x - result[result.length - 1].x) < tol &&
      Math.abs(pe.y - result[result.length - 1].y) < tol
    ) {
      result.splice(result.length - 1, 1)

      // Lines up second last point in result with end point
      if (result[result.length - 1] !== null) {
        if (Math.abs(result[result.length - 1].x - pe.x) < tol) {
          result[result.length - 1].x = pe.x
        }

        if (Math.abs(result[result.length - 1].y - pe.y) < tol) {
          result[result.length - 1].y = pe.y
        }
      }
    }
  },

  orthBuffer: 10,

  orthPointsFallback: true,

  dirVectors: [[-1, 0], [0, -1], [1, 0], [0, 1], [-1, 0], [0, -1], [1, 0]],

  wayPoints1: [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0]
  ],

  routePatterns: [
    [
      [513, 2308, 2081, 2562],
      [513, 1090, 514, 2184, 2114, 2561],
      [513, 1090, 514, 2564, 2184, 2562],
      [513, 2308, 2561, 1090, 514, 2568, 2308]
    ],
    [
      [514, 1057, 513, 2308, 2081, 2562],
      [514, 2184, 2114, 2561],
      [514, 2184, 2562, 1057, 513, 2564, 2184],
      [514, 1057, 513, 2568, 2308, 2561]
    ],
    [
      [1090, 514, 1057, 513, 2308, 2081, 2562],
      [2114, 2561],
      [1090, 2562, 1057, 513, 2564, 2184],
      [1090, 514, 1057, 513, 2308, 2561, 2568]
    ],
    [
      [2081, 2562],
      [1057, 513, 1090, 514, 2184, 2114, 2561],
      [1057, 513, 1090, 514, 2184, 2562, 2564],
      [1057, 2561, 1090, 514, 2568, 2308]
    ]
  ],

  inlineRoutePatterns: [
    [null, [2114, 2568], null, null],
    [null, [514, 2081, 2114, 2568], null, null],
    [null, [2114, 2561], null, null],
    [[2081, 2562], [1057, 2114, 2568], [2184, 2562], null]
  ],
  vertexSeperations: [],

  limits: [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]],

  LEFT_MASK: 32,

  TOP_MASK: 64,

  RIGHT_MASK: 128,

  BOTTOM_MASK: 256,

  LEFT: 1,

  TOP: 2,

  RIGHT: 4,

  BOTTOM: 8,

  // TODO remove magic numbers
  SIDE_MASK: 480,
  // MxEdgeStyle.LEFT_MASK | MxEdgeStyle.TOP_MASK | MxEdgeStyle.RIGHT_MASK
  // | MxEdgeStyle.BOTTOM_MASK,

  CENTER_MASK: 512,

  SOURCE_MASK: 1024,

  TARGET_MASK: 2048,

  VERTEX_MASK: 3072,
  // MxEdgeStyle.SOURCE_MASK | MxEdgeStyle.TARGET_MASK,

  getJettySize: function(state, source, target, points, isSource) {
    var value = MxUtils.getValue(
      state.style,
      isSource
        ? MxConstants.STYLE_SOURCE_JETTY_SIZE
        : MxConstants.STYLE_TARGET_JETTY_SIZE,
      MxUtils.getValue(
        state.style,
        MxConstants.STYLE_JETTY_SIZE,
        MxEdgeStyle.orthBuffer
      )
    )

    if (value === 'auto') {
      // Computes the automatic jetty size
      var type = MxUtils.getValue(
        state.style,
        isSource ? MxConstants.STYLE_STARTARROW : MxConstants.STYLE_ENDARROW,
        MxConstants.NONE
      )

      if (type !== MxConstants.NONE) {
        var size = MxUtils.getNumber(
          state.style,
          isSource ? MxConstants.STYLE_STARTSIZE : MxConstants.STYLE_ENDSIZE,
          MxConstants.DEFAULT_MARKERSIZE
        )
        value =
          Math.max(
            2,
            Math.ceil((size + MxEdgeStyle.orthBuffer) / MxEdgeStyle.orthBuffer)
          ) * MxEdgeStyle.orthBuffer
      } else {
        value = 2 * MxEdgeStyle.orthBuffer
      }
    }

    return value
  },

  /**
   * Function: OrthConnector
   *
   * Implements a local orthogonal router between the given
   * cells.
   *
   * Parameters:
   *
   * state - <MxCellState> that represents the edge to be updated.
   * source - <MxCellState> that represents the source terminal.
   * target - <MxCellState> that represents the target terminal.
   * points - List of relative control points.
   * result - Array of <mxPoints> that represent the actual points of the
   * edge.
   *
   */
  OrthConnector: function(state, source, target, points, result) {
    var graph = state.view.graph
    var sourceEdge =
      source === null ? false : graph.getModel().isEdge(source.cell)
    var targetEdge =
      target === null ? false : graph.getModel().isEdge(target.cell)

    var pts = state.absolutePoints
    var p0 = pts[0]
    var pe = pts[pts.length - 1]

    var sourceX = source !== null ? source.x : p0.x
    var sourceY = source !== null ? source.y : p0.y
    var sourceWidth = source !== null ? source.width : 0
    var sourceHeight = source !== null ? source.height : 0

    var targetX = target !== null ? target.x : pe.x
    var targetY = target !== null ? target.y : pe.y
    var targetWidth = target !== null ? target.width : 0
    var targetHeight = target !== null ? target.height : 0

    var scaledSourceBuffer =
      state.view.scale *
      MxEdgeStyle.getJettySize(state, source, target, points, true)
    var scaledTargetBuffer =
      state.view.scale *
      MxEdgeStyle.getJettySize(state, source, target, points, false)

    // Workaround for loop routing within buffer zone
    if (source !== null && target === source) {
      scaledTargetBuffer = Math.max(scaledSourceBuffer, scaledTargetBuffer)
      scaledSourceBuffer = scaledTargetBuffer
    }

    var totalBuffer = scaledTargetBuffer + scaledSourceBuffer
    var tooShort = false

    // Checks minimum distance for fixed points and falls back to segment connector
    if (p0 !== null && pe !== null) {
      let dx = pe.x - p0.x
      let dy = pe.y - p0.y

      tooShort = dx * dx + dy * dy < totalBuffer * totalBuffer
    }

    if (
      tooShort ||
      (MxEdgeStyle.orthPointsFallback &&
        (points !== null && points.length > 0)) ||
      sourceEdge ||
      targetEdge
    ) {
      MxEdgeStyle.SegmentConnector(state, source, target, points, result)

      return
    }

    // Determine the side(s) of the source and target vertices
    // that the edge may connect to
    // portConstraint [source, target]
    var portConstraint = [
      MxConstants.DIRECTION_MASK_ALL,
      MxConstants.DIRECTION_MASK_ALL
    ]
    var rotation = 0

    if (source !== null) {
      portConstraint[0] = MxUtils.getPortConstraints(
        source,
        state,
        true,
        MxConstants.DIRECTION_MASK_ALL
      )
      rotation = MxUtils.getValue(source.style, MxConstants.STYLE_ROTATION, 0)

      if (rotation !== 0) {
        var newRect = MxUtils.getBoundingBox(
          new MxRectangle(sourceX, sourceY, sourceWidth, sourceHeight),
          rotation
        )
        sourceX = newRect.x
        sourceY = newRect.y
        sourceWidth = newRect.width
        sourceHeight = newRect.height
      }
    }

    if (target !== null) {
      portConstraint[1] = MxUtils.getPortConstraints(
        target,
        state,
        false,
        MxConstants.DIRECTION_MASK_ALL
      )
      rotation = MxUtils.getValue(target.style, MxConstants.STYLE_ROTATION, 0)

      if (rotation !== 0) {
        let newRect = MxUtils.getBoundingBox(
          new MxRectangle(targetX, targetY, targetWidth, targetHeight),
          rotation
        )
        targetX = newRect.x
        targetY = newRect.y
        targetWidth = newRect.width
        targetHeight = newRect.height
      }
    }

    // Avoids floating point number errors
    sourceX = Math.round(sourceX * 10) / 10
    sourceY = Math.round(sourceY * 10) / 10
    sourceWidth = Math.round(sourceWidth * 10) / 10
    sourceHeight = Math.round(sourceHeight * 10) / 10

    targetX = Math.round(targetX * 10) / 10
    targetY = Math.round(targetY * 10) / 10
    targetWidth = Math.round(targetWidth * 10) / 10
    targetHeight = Math.round(targetHeight * 10) / 10

    var dir = [0, 0]

    // Work out which faces of the vertices present against each other
    // in a way that would allow a 3-segment connection if port constraints
    // permitted.
    // geo -> [source, target] [x, y, width, height]
    var geo = [
      [sourceX, sourceY, sourceWidth, sourceHeight],
      [targetX, targetY, targetWidth, targetHeight]
    ]
    var buffer = [scaledSourceBuffer, scaledTargetBuffer]

    for (var i = 0; i < 2; i++) {
      MxEdgeStyle.limits[i][1] = geo[i][0] - buffer[i]
      MxEdgeStyle.limits[i][2] = geo[i][1] - buffer[i]
      MxEdgeStyle.limits[i][4] = geo[i][0] + geo[i][2] + buffer[i]
      MxEdgeStyle.limits[i][8] = geo[i][1] + geo[i][3] + buffer[i]
    }

    // Work out which quad the target is in
    var sourceCenX = geo[0][0] + geo[0][2] / 2.0
    var sourceCenY = geo[0][1] + geo[0][3] / 2.0
    var targetCenX = geo[1][0] + geo[1][2] / 2.0
    var targetCenY = geo[1][1] + geo[1][3] / 2.0

    let dx = sourceCenX - targetCenX
    let dy = sourceCenY - targetCenY

    var quad = 0

    if (dx < 0) {
      if (dy < 0) {
        quad = 2
      } else {
        quad = 1
      }
    } else {
      if (dy <= 0) {
        quad = 3

        // Special case on x = 0 and negative y
        if (dx === 0) {
          quad = 2
        }
      }
    }

    // Check for connection constraints
    var currentTerm = null

    if (source !== null) {
      currentTerm = p0
    }

    var constraint = [[0.5, 0.5], [0.5, 0.5]]

    for (let i = 0; i < 2; i++) {
      if (currentTerm !== null) {
        constraint[i][0] = (currentTerm.x - geo[i][0]) / geo[i][2]

        if (Math.abs(currentTerm.x - geo[i][0]) <= 1) {
          dir[i] = MxConstants.DIRECTION_MASK_WEST
        } else if (Math.abs(currentTerm.x - geo[i][0] - geo[i][2]) <= 1) {
          dir[i] = MxConstants.DIRECTION_MASK_EAST
        }

        constraint[i][1] = (currentTerm.y - geo[i][1]) / geo[i][3]

        if (Math.abs(currentTerm.y - geo[i][1]) <= 1) {
          dir[i] = MxConstants.DIRECTION_MASK_NORTH
        } else if (Math.abs(currentTerm.y - geo[i][1] - geo[i][3]) <= 1) {
          dir[i] = MxConstants.DIRECTION_MASK_SOUTH
        }
      }

      currentTerm = null

      if (target !== null) {
        currentTerm = pe
      }
    }

    var sourceTopDist = geo[0][1] - (geo[1][1] + geo[1][3])
    var sourceLeftDist = geo[0][0] - (geo[1][0] + geo[1][2])
    var sourceBottomDist = geo[1][1] - (geo[0][1] + geo[0][3])
    var sourceRightDist = geo[1][0] - (geo[0][0] + geo[0][2])

    MxEdgeStyle.vertexSeperations[1] = Math.max(sourceLeftDist - totalBuffer, 0)
    MxEdgeStyle.vertexSeperations[2] = Math.max(sourceTopDist - totalBuffer, 0)
    MxEdgeStyle.vertexSeperations[4] = Math.max(
      sourceBottomDist - totalBuffer,
      0
    )
    MxEdgeStyle.vertexSeperations[3] = Math.max(
      sourceRightDist - totalBuffer,
      0
    )

    // ================================================================================
    // Start of source and target direction determination

    // Work through the preferred orientations by relative positioning
    // of the vertices and list them in preferred and available order

    var dirPref = []
    var horPref = []
    var vertPref = []

    horPref[0] =
      sourceLeftDist >= sourceRightDist
        ? MxConstants.DIRECTION_MASK_WEST
        : MxConstants.DIRECTION_MASK_EAST
    vertPref[0] =
      sourceTopDist >= sourceBottomDist
        ? MxConstants.DIRECTION_MASK_NORTH
        : MxConstants.DIRECTION_MASK_SOUTH

    horPref[1] = MxUtils.reversePortConstraints(horPref[0])
    vertPref[1] = MxUtils.reversePortConstraints(vertPref[0])

    var preferredHorizDist =
      sourceLeftDist >= sourceRightDist ? sourceLeftDist : sourceRightDist
    var preferredVertDist =
      sourceTopDist >= sourceBottomDist ? sourceTopDist : sourceBottomDist

    var prefOrdering = [[0, 0], [0, 0]]
    var preferredOrderSet = false

    // If the preferred port isn't available, switch it
    for (let i = 0; i < 2; i++) {
      if (dir[i] !== 0x0) {
        continue
      }

      if ((horPref[i] & portConstraint[i]) === 0) {
        horPref[i] = MxUtils.reversePortConstraints(horPref[i])
      }

      if ((vertPref[i] & portConstraint[i]) === 0) {
        vertPref[i] = MxUtils.reversePortConstraints(vertPref[i])
      }

      prefOrdering[i][0] = vertPref[i]
      prefOrdering[i][1] = horPref[i]
    }

    if (preferredVertDist > 0 && preferredHorizDist > 0) {
      // Possibility of two segment edge connection
      if (
        (horPref[0] & portConstraint[0]) > 0 &&
        (vertPref[1] & portConstraint[1]) > 0
      ) {
        prefOrdering[0][0] = horPref[0]
        prefOrdering[0][1] = vertPref[0]
        prefOrdering[1][0] = vertPref[1]
        prefOrdering[1][1] = horPref[1]
        preferredOrderSet = true
      } else if (
        (vertPref[0] & portConstraint[0]) > 0 &&
        (horPref[1] & portConstraint[1]) > 0
      ) {
        prefOrdering[0][0] = vertPref[0]
        prefOrdering[0][1] = horPref[0]
        prefOrdering[1][0] = horPref[1]
        prefOrdering[1][1] = vertPref[1]
        preferredOrderSet = true
      }
    }

    if (preferredVertDist > 0 && !preferredOrderSet) {
      prefOrdering[0][0] = vertPref[0]
      prefOrdering[0][1] = horPref[0]
      prefOrdering[1][0] = vertPref[1]
      prefOrdering[1][1] = horPref[1]
      preferredOrderSet = true
    }

    if (preferredHorizDist > 0 && !preferredOrderSet) {
      prefOrdering[0][0] = horPref[0]
      prefOrdering[0][1] = vertPref[0]
      prefOrdering[1][0] = horPref[1]
      prefOrdering[1][1] = vertPref[1]
      preferredOrderSet = true
    }

    // The source and target prefs are now an ordered list of
    // the preferred port selections
    // It the list can contain gaps, compact it

    for (let i = 0; i < 2; i++) {
      if (dir[i] !== 0x0) {
        continue
      }

      if ((prefOrdering[i][0] & portConstraint[i]) === 0) {
        prefOrdering[i][0] = prefOrdering[i][1]
      }

      dirPref[i] = prefOrdering[i][0] & portConstraint[i]
      dirPref[i] |= (prefOrdering[i][1] & portConstraint[i]) << 8
      dirPref[i] |= (prefOrdering[1 - i][i] & portConstraint[i]) << 16
      dirPref[i] |= (prefOrdering[1 - i][1 - i] & portConstraint[i]) << 24

      if ((dirPref[i] & 0xf) === 0) {
        dirPref[i] = dirPref[i] << 8
      }

      if ((dirPref[i] & 0xf00) === 0) {
        dirPref[i] = (dirPref[i] & 0xf) | (dirPref[i] >> 8)
      }

      if ((dirPref[i] & 0xf0000) === 0) {
        dirPref[i] = (dirPref[i] & 0xffff) | ((dirPref[i] & 0xf000000) >> 8)
      }

      dir[i] = dirPref[i] & 0xf

      if (
        portConstraint[i] === MxConstants.DIRECTION_MASK_WEST ||
        portConstraint[i] === MxConstants.DIRECTION_MASK_NORTH ||
        portConstraint[i] === MxConstants.DIRECTION_MASK_EAST ||
        portConstraint[i] === MxConstants.DIRECTION_MASK_SOUTH
      ) {
        dir[i] = portConstraint[i]
      }
    }

    // ================================================================================
    // End of source and target direction determination

    var sourceIndex = dir[0] === MxConstants.DIRECTION_MASK_EAST ? 3 : dir[0]
    var targetIndex = dir[1] === MxConstants.DIRECTION_MASK_EAST ? 3 : dir[1]

    sourceIndex -= quad
    targetIndex -= quad

    if (sourceIndex < 1) {
      sourceIndex += 4
    }

    if (targetIndex < 1) {
      targetIndex += 4
    }

    var routePattern =
      MxEdgeStyle.routePatterns[sourceIndex - 1][targetIndex - 1]

    MxEdgeStyle.wayPoints1[0][0] = geo[0][0]
    MxEdgeStyle.wayPoints1[0][1] = geo[0][1]

    switch (dir[0]) {
      case MxConstants.DIRECTION_MASK_WEST:
        MxEdgeStyle.wayPoints1[0][0] -= scaledSourceBuffer
        MxEdgeStyle.wayPoints1[0][1] += constraint[0][1] * geo[0][3]
        break
      case MxConstants.DIRECTION_MASK_SOUTH:
        MxEdgeStyle.wayPoints1[0][0] += constraint[0][0] * geo[0][2]
        MxEdgeStyle.wayPoints1[0][1] += geo[0][3] + scaledSourceBuffer
        break
      case MxConstants.DIRECTION_MASK_EAST:
        MxEdgeStyle.wayPoints1[0][0] += geo[0][2] + scaledSourceBuffer
        MxEdgeStyle.wayPoints1[0][1] += constraint[0][1] * geo[0][3]
        break
      case MxConstants.DIRECTION_MASK_NORTH:
        MxEdgeStyle.wayPoints1[0][0] += constraint[0][0] * geo[0][2]
        MxEdgeStyle.wayPoints1[0][1] -= scaledSourceBuffer
        break
    }

    var currentIndex = 0

    // Orientation, 0 horizontal, 1 vertical
    var lastOrientation =
      (dir[0] &
        (MxConstants.DIRECTION_MASK_EAST | MxConstants.DIRECTION_MASK_WEST)) >
      0
        ? 0
        : 1
    var initialOrientation = lastOrientation
    var currentOrientation = 0

    for (let i = 0; i < routePattern.length; i++) {
      var nextDirection = routePattern[i] & 0xf

      // Rotate the index of this direction by the quad
      // to get the real direction
      var directionIndex =
        nextDirection === MxConstants.DIRECTION_MASK_EAST ? 3 : nextDirection

      directionIndex += quad

      if (directionIndex > 4) {
        directionIndex -= 4
      }

      var direction = MxEdgeStyle.dirVectors[directionIndex - 1]

      currentOrientation = directionIndex % 2 > 0 ? 0 : 1
      // Only update the current index if the point moved
      // in the direction of the current segment move,
      // otherwise the same point is moved until there is
      // a segment direction change
      if (currentOrientation !== lastOrientation) {
        currentIndex++
        // Copy the previous way point into the new one
        // We can't base the new position on index - 1
        // because sometime elbows turn out not to exist,
        // then we'd have to rewind.
        MxEdgeStyle.wayPoints1[currentIndex][0] =
          MxEdgeStyle.wayPoints1[currentIndex - 1][0]
        MxEdgeStyle.wayPoints1[currentIndex][1] =
          MxEdgeStyle.wayPoints1[currentIndex - 1][1]
      }

      var tar = (routePattern[i] & MxEdgeStyle.TARGET_MASK) > 0
      var sou = (routePattern[i] & MxEdgeStyle.SOURCE_MASK) > 0
      var side = (routePattern[i] & MxEdgeStyle.SIDE_MASK) >> 5
      side = side << quad

      if (side > 0xf) {
        side = side >> 4
      }

      var center = (routePattern[i] & MxEdgeStyle.CENTER_MASK) > 0

      if ((sou || tar) && side < 9) {
        var limit = 0
        var souTar = sou ? 0 : 1

        if (center && currentOrientation === 0) {
          limit = geo[souTar][0] + constraint[souTar][0] * geo[souTar][2]
        } else if (center) {
          limit = geo[souTar][1] + constraint[souTar][1] * geo[souTar][3]
        } else {
          limit = MxEdgeStyle.limits[souTar][side]
        }

        if (currentOrientation === 0) {
          var lastX = MxEdgeStyle.wayPoints1[currentIndex][0]
          var deltaX = (limit - lastX) * direction[0]

          if (deltaX > 0) {
            MxEdgeStyle.wayPoints1[currentIndex][0] += direction[0] * deltaX
          }
        } else {
          var lastY = MxEdgeStyle.wayPoints1[currentIndex][1]
          var deltaY = (limit - lastY) * direction[1]

          if (deltaY > 0) {
            MxEdgeStyle.wayPoints1[currentIndex][1] += direction[1] * deltaY
          }
        }
      } else if (center) {
        // Which center we're travelling to depend on the current direction
        MxEdgeStyle.wayPoints1[currentIndex][0] +=
          direction[0] *
          Math.abs(MxEdgeStyle.vertexSeperations[directionIndex] / 2)
        MxEdgeStyle.wayPoints1[currentIndex][1] +=
          direction[1] *
          Math.abs(MxEdgeStyle.vertexSeperations[directionIndex] / 2)
      }

      if (
        currentIndex > 0 &&
        MxEdgeStyle.wayPoints1[currentIndex][currentOrientation] ===
          MxEdgeStyle.wayPoints1[currentIndex - 1][currentOrientation]
      ) {
        currentIndex--
      } else {
        lastOrientation = currentOrientation
      }
    }

    for (let i = 0; i <= currentIndex; i++) {
      if (i === currentIndex) {
        // Last point can cause last segment to be in
        // same direction as jetty/approach. If so,
        // check the number of points is consistent
        // with the relative orientation of source and target
        // jx. Same orientation requires an even
        // number of turns (points), different requires
        // odd.
        var targetOrientation =
          (dir[1] &
            (MxConstants.DIRECTION_MASK_EAST |
              MxConstants.DIRECTION_MASK_WEST)) >
          0
            ? 0
            : 1
        var sameOrient = targetOrientation === initialOrientation ? 0 : 1

        // (currentIndex + 1) % 2 is 0 for even number of points,
        // 1 for odd
        if (sameOrient !== (currentIndex + 1) % 2) {
          // The last point isn't required
          break
        }
      }

      result.push(
        new MxPoint(
          Math.round(MxEdgeStyle.wayPoints1[i][0]),
          Math.round(MxEdgeStyle.wayPoints1[i][1])
        )
      )
    }

    // Removes duplicates
    var index = 1

    while (index < result.length) {
      if (
        result[index - 1] === null ||
        result[index] === null ||
        result[index - 1].x !== result[index].x ||
        result[index - 1].y !== result[index].y
      ) {
        index++
      } else {
        result.splice(index, 1)
      }
    }
  },

  getRoutePattern: function(dir, quad, dx, dy) {
    var sourceIndex = dir[0] === MxConstants.DIRECTION_MASK_EAST ? 3 : dir[0]
    var targetIndex = dir[1] === MxConstants.DIRECTION_MASK_EAST ? 3 : dir[1]

    sourceIndex -= quad
    targetIndex -= quad

    if (sourceIndex < 1) {
      sourceIndex += 4
    }
    if (targetIndex < 1) {
      targetIndex += 4
    }

    var result = window.routePatterns[sourceIndex - 1][targetIndex - 1]

    if (dx === 0 || dy === 0) {
      if (
        window.inlineRoutePatterns[sourceIndex - 1][targetIndex - 1] !== null
      ) {
        result = window.inlineRoutePatterns[sourceIndex - 1][targetIndex - 1]
      }
    }

    return result
  }
}

export default MxEdgeStyle
