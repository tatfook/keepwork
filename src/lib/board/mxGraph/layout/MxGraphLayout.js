import MxDictionary from '../util/MxDictionary'
import MxConstants from '../util/MxConstants'
import MxPoint from '../util/MxPoint'
import MxGeometry from '../model/MxGeometry'
import MxRectangle from '../util/MxRectangle'
/**
 * Copyright (c) 2006-2018, JGraph Ltd
 * Copyright (c) 2006-2018, Gaudenz Alder
 */
/**
 * Class: MxGraphLayout
 *
 * Base class for all layout algorithms in mxGraph. Main public functions are
 * <move> for handling a moved cell within a layouted parent, and <execute> for
 * running the layout on a given parent cell.
 *
 * Known Subclasses:
 *
 * <mxCircleLayout>, <mxCompactTreeLayout>, <mxCompositeLayout>,
 * <mxFastOrganicLayout>, <mxParallelEdgeLayout>, <mxPartitionLayout>,
 * <mxStackLayout>
 *
 * Constructor: MxGraphLayout
 *
 * Constructs a new layout using the given layouts.
 *
 * Arguments:
 *
 * graph - Enclosing
 */

export default class MxGraphLayout {
  constructor(graph) {
    this.graph = graph
  };
}

/**
 * Variable: graph
 *
 * Reference to the enclosing <mxGraph>.
 */
MxGraphLayout.prototype.graph = null

/**
 * Variable: useBoundingBox
 *
 * Boolean indicating if the bounding box of the label should be used if
 * its available. Default is true.
 */
MxGraphLayout.prototype.useBoundingBox = true

/**
 * Variable: parent
 *
 * The parent cell of the layout, if any
 */
MxGraphLayout.prototype.parent = null

/**
 * Function: moveCell
 *
 * Notified when a cell is being moved in a parent that has automatic
 * layout to update the cell state (eg. index) so that the outcome of the
 * layout will position the vertex as close to the point (x, y) as
 * possible.
 *
 * Empty implementation.
 *
 * Parameters:
 *
 * cell - <mxCell> which has been moved.
 * x - X-coordinate of the new cell location.
 * y - Y-coordinate of the new cell location.
 */
MxGraphLayout.prototype.moveCell = function(cell, x, y) { }

/**
 * Function: execute
 *
 * Executes the layout algorithm for the children of the given parent.
 *
 * Parameters:
 *
 * parent - <mxCell> whose children should be layed out.
 */
MxGraphLayout.prototype.execute = function(parent) { }

/**
 * Function: getGraph
 *
 * Returns the graph that this layout operates on.
 */
MxGraphLayout.prototype.getGraph = function() {
  return this.graph
}

/**
 * Function: getConstraint
 *
 * Returns the constraint for the given key and cell. The optional edge and
 * source arguments are used to return inbound and outgoing routing-
 * constraints for the given edge and vertex. This implementation always
 * returns the value for the given key in the style of the given cell.
 *
 * Parameters:
 *
 * key - Key of the constraint to be returned.
 * cell - <mxCell> whose constraint should be returned.
 * edge - Optional <mxCell> that represents the connection whose constraint
 * should be returned. Default is null.
 * source - Optional boolean that specifies if the connection is incoming
 * or outgoing. Default is null.
 */
MxGraphLayout.prototype.getConstraint = function(key, cell, edge, source) {
  let state = this.graph.view.getState(cell)
  let style = (state !== null) ? state.style : this.graph.getCellStyle(cell)

  return (style !== null) ? style[key] : null
}

/**
 * Function: traverse
 *
 * Traverses the (directed) graph invoking the given function for each
 * visited vertex and edge. The function is invoked with the current vertex
 * and the incoming edge as a parameter. This implementation makes sure
 * each vertex is only visited once. The function may return false if the
 * traversal should stop at the given vertex.
 *
 * Example:
 *
 * (code)
 * mxLog.show();
 * let cell = graph.getSelectionCell();
 * graph.traverse(cell, false, function(vertex, edge)
 * {
 *   mxLog.debug(graph.getLabel(vertex));
 * });
 * (end)
 *
 * Parameters:
 *
 * vertex - <mxCell> that represents the vertex where the traversal starts.
 * directed - Optional boolean indicating if edges should only be traversed
 * from source to target. Default is true.
 * func - Visitor function that takes the current vertex and the incoming
 * edge as arguments. The traversal stops if the function returns false.
 * edge - Optional <mxCell> that represents the incoming edge. This is
 * null for the first step of the traversal.
 * visited - Optional <MxDictionary> of cell paths for the visited cells.
 */
MxGraphLayout.traverse = function(vertex, directed, func, edge, visited) {
  if (func !== null && vertex !== null) {
    directed = (directed !== null) ? directed : true
    visited = visited || new MxDictionary()

    if (!visited.get(vertex)) {
      visited.put(vertex, true)
      let result = func(vertex, edge)

      if (result === null || result) {
        let edgeCount = this.graph.model.getEdgeCount(vertex)

        if (edgeCount > 0) {
          for (let i = 0; i < edgeCount; i++) {
            let e = this.graph.model.getEdgeAt(vertex, i)
            let isSource = this.graph.model.getTerminal(e, true) === vertex

            if (!directed || isSource) {
              let next = this.graph.view.getVisibleTerminal(e, !isSource)
              this.traverse(next, directed, func, e, visited)
            }
          }
        }
      }
    }
  }
}

/**
 * Function: isAncestor
 *
 * Returns true if the given parent is an ancestor of the given child.
 *
 * Parameters:
 *
 * parent - <mxCell> that specifies the parent.
 * child - <mxCell> that specifies the child.
 * traverseAncestors - boolean whether to
 */
MxGraphLayout.prototype.isAncestor = function(parent, child, traverseAncestors) {
  if (!traverseAncestors) {
    return (this.graph.model.getParent(cell) === parent)
  }

  if (child === parent) {
    return false
  }

  while (child !== null && child !== parent) {
    child = this.graph.model.getParent(child)
  }

  return child === parent
}

/**
 * Function: isVertexMovable
 *
 * Returns a boolean indicating if the given <mxCell> is movable or
 * bendable by the algorithm. This implementation returns true if the given
 * cell is movable in the graph.
 *
 * Parameters:
 *
 * cell - <mxCell> whose movable state should be returned.
 */
MxGraphLayout.prototype.isVertexMovable = function(cell) {
  return this.graph.isCellMovable(cell)
}

/**
 * Function: isVertexIgnored
 *
 * Returns a boolean indicating if the given <mxCell> should be ignored by
 * the algorithm. This implementation returns false for all vertices.
 *
 * Parameters:
 *
 * vertex - <mxCell> whose ignored state should be returned.
 */
MxGraphLayout.prototype.isVertexIgnored = function(vertex) {
  return !this.graph.getModel().isVertex(vertex) || !this.graph.isCellVisible(vertex)
}

/**
 * Function: isEdgeIgnored
 *
 * Returns a boolean indicating if the given <mxCell> should be ignored by
 * the algorithm. This implementation returns false for all vertices.
 *
 * Parameters:
 *
 * cell - <mxCell> whose ignored state should be returned.
 */
MxGraphLayout.prototype.isEdgeIgnored = function(edge) {
  let model = this.graph.getModel()

  return !model.isEdge(edge) || !this.graph.isCellVisible(edge) || model.getTerminal(edge, true) === null || model.getTerminal(edge, false) === null
}

/**
 * Function: setEdgeStyleEnabled
 *
 * Disables or enables the edge style of the given edge.
 */
MxGraphLayout.prototype.setEdgeStyleEnabled = function(edge, value) {
  this.graph.setCellStyles(MxConstants.STYLE_NOEDGESTYLE,
    (value) ? '0' : '1', [edge])
}

/**
 * Function: setOrthogonalEdge
 *
 * Disables or enables orthogonal end segments of the given edge.
 */
MxGraphLayout.prototype.setOrthogonalEdge = function(edge, value) {
  this.graph.setCellStyles(MxConstants.STYLE_ORTHOGONAL,
    (value) ? '1' : '0', [edge])
}

/**
 * Function: getParentOffset
 *
 * Determines the offset of the given parent to the parent
 * of the layout
 */
MxGraphLayout.prototype.getParentOffset = function(parent) {
  let result = new MxPoint()

  if (parent !== null && parent !== this.parent) {
    let model = this.graph.getModel()

    if (model.isAncestor(this.parent, parent)) {
      let parentGeo = model.getGeometry(parent)

      while (parent !== this.parent) {
        result.x = result.x + parentGeo.x
        result.y = result.y + parentGeo.y

        parent = model.getParent(parent)
        parentGeo = model.getGeometry(parent)
      }
    }
  }

  return result
}

/**
 * Function: setEdgePoints
 *
 * Replaces the array of MxPoints in the geometry of the given edge
 * with the given array of MxPoints.
 */
MxGraphLayout.prototype.setEdgePoints = function(edge, points) {
  if (edge !== null) {
    let model = this.graph.model
    let geometry = model.getGeometry(edge)

    if (geometry === null) {
      geometry = new MxGeometry()
      geometry.setRelative(true)
    } else {
      geometry = geometry.clone()
    }

    if (this.parent !== null && points !== null) {
      let parent = model.getParent(edge)

      let parentOffset = this.getParentOffset(parent)

      for (let i = 0; i < points.length; i++) {
        points[i].x = points[i].x - parentOffset.x
        points[i].y = points[i].y - parentOffset.y
      }
    }

    geometry.points = points
    model.setGeometry(edge, geometry)
  }
}

/**
 * Function: setVertexLocation
 *
 * Sets the new position of the given cell taking into account the size of
 * the bounding box if <useBoundingBox> is true. The change is only carried
 * out if the new location is not equal to the existing location, otherwise
 * the geometry is not replaced with an updated instance. The new or old
 * bounds are returned (including overlapping labels).
 *
 * Parameters:
 *
 * cell - <mxCell> whose geometry is to be set.
 * x - Integer that defines the x-coordinate of the new location.
 * y - Integer that defines the y-coordinate of the new location.
 */
MxGraphLayout.prototype.setVertexLocation = function(cell, x, y) {
  let model = this.graph.getModel()
  let geometry = model.getGeometry(cell)
  let result = null

  if (geometry !== null) {
    result = new MxRectangle(x, y, geometry.width, geometry.height)

    // Checks for oversize labels and shifts the result
    // TODO: Use mxUtils.getStringSize for label bounds
    if (this.useBoundingBox) {
      let state = this.graph.getView().getState(cell)

      if (state !== null && state.text !== null && state.text.boundingBox !== null) {
        let scale = this.graph.getView().scale
        let box = state.text.boundingBox

        if (state.text.boundingBox.x < state.x) {
          x += (state.x - box.x) / scale
          result.width = box.width
        }

        if (state.text.boundingBox.y < state.y) {
          y += (state.y - box.y) / scale
          result.height = box.height
        }
      }
    }

    if (this.parent !== null) {
      let parent = model.getParent(cell)

      if (parent !== null && parent !== this.parent) {
        let parentOffset = this.getParentOffset(parent)

        x = x - parentOffset.x
        y = y - parentOffset.y
      }
    }

    if (geometry.x !== x || geometry.y !== y) {
      geometry = geometry.clone()
      geometry.x = x
      geometry.y = y

      model.setGeometry(cell, geometry)
    }
  }

  return result
}

/**
 * Function: getVertexBounds
 *
 * Returns an <MxRectangle> that defines the bounds of the given cell or
 * the bounding box if <useBoundingBox> is true.
 */
MxGraphLayout.prototype.getVertexBounds = function(cell) {
  let geo = this.graph.getModel().getGeometry(cell)

  // Checks for oversize label bounding box and corrects
  // the return value accordingly
  // TODO: Use mxUtils.getStringSize for label bounds
  if (this.useBoundingBox) {
    let state = this.graph.getView().getState(cell)

    if (state !== null && state.text !== null && state.text.boundingBox !== null) {
      let scale = this.graph.getView().scale
      let tmp = state.text.boundingBox

      let dx0 = Math.max(state.x - tmp.x, 0) / scale
      let dy0 = Math.max(state.y - tmp.y, 0) / scale
      let dx1 = Math.max((tmp.x + tmp.width) - (state.x + state.width), 0) / scale
      let dy1 = Math.max((tmp.y + tmp.height) - (state.y + state.height), 0) / scale

      geo = new MxRectangle(geo.x - dx0, geo.y - dy0, geo.width + dx0 + dx1, geo.height + dy0 + dy1)
    }
  }

  if (this.parent !== null) {
    let parent = this.graph.getModel().getParent(cell)
    geo = geo.clone()

    if (parent !== null && parent !== this.parent) {
      let parentOffset = this.getParentOffset(parent)
      geo.x = geo.x + parentOffset.x
      geo.y = geo.y + parentOffset.y
    }
  }

  return new MxRectangle(geo.x, geo.y, geo.width, geo.height)
}

/**
 * Function: arrangeGroups
 *
 * Shortcut to <mxGraph.updateGroupBounds> with moveGroup set to true.
 */
MxGraphLayout.prototype.arrangeGroups = function(cells, border, topBorder, rightBorder, bottomBorder, leftBorder) {
  return this.graph.updateGroupBounds(cells, border, true, topBorder, rightBorder, bottomBorder, leftBorder)
}

/**
 * Class: WeightedCellSorter
 *
 * A utility class used to track cells whilst sorting occurs on the weighted
 * sum of their connected edges. Does not violate (x.compareTo(y)===0) ===
 * (x.equals(y))
 *
 * Constructor: WeightedCellSorter
 *
 * Constructs a new weighted cell sorted for the given cell and weight.
 */
function WeightedCellSorter(cell, weightedValue) {
  this.cell = cell
  this.weightedValue = weightedValue
}

/**
 * Variable: weightedValue
 *
 * The weighted value of the cell stored.
 */
WeightedCellSorter.prototype.weightedValue = 0

/**
 * Variable: nudge
 *
 * Whether or not to flip equal weight values.
 */
WeightedCellSorter.prototype.nudge = false

/**
 * Variable: visited
 *
 * Whether or not this cell has been visited in the current assignment.
 */
WeightedCellSorter.prototype.visited = false

/**
 * Variable: rankIndex
 *
 * The index this cell is in the model rank.
 */
WeightedCellSorter.prototype.rankIndex = null

/**
 * Variable: cell
 *
 * The cell whose median value is being calculated.
 */
WeightedCellSorter.prototype.cell = null

/**
 * Function: compare
 *
 * Compares two WeightedCellSorters.
 */
WeightedCellSorter.prototype.compare = function(a, b) {
  if (a !== null && b !== null) {
    if (b.weightedValue > a.weightedValue) {
      return -1
    } else if (b.weightedValue < a.weightedValue) {
      return 1
    } else {
      if (b.nudge) {
        return -1
      } else {
        return 1
      }
    }
  } else {
    return 0
  }
}
