import MxGraphLayout from './MxGraphLayout'
import MxDictionary from '../util/MxDictionary'
import MxCellPath from '../model/MxCellPath'
import MxRectangle from '../util/MxRectangle'
import MxUtils from '../util/MxUtils'
import MxPoint from '../util/MxPoint'
import { WeightedCellSorter } from '../../mxGraphLayout'
/**
 * Copyright (c) 2006-2018, JGraph Ltd
 * Copyright (c) 2006-2018, Gaudenz Alder
 */
/**
 * Class: MxCompactTreeLayout
 *
 * Extends <MxGraphLayout> to implement a compact tree (Moen) algorithm. This
 * layout is suitable for graphs that have no cycles (trees). Vertices that are
 * not connected to the tree will be ignored by this layout.
 *
 * Example:
 *
 * (code)
 * let layout = new MxCompactTreeLayout(graph);
 * layout.execute(graph.getDefaultParent());
 * (end)
 *
 * Constructor: MxCompactTreeLayout
 *
 * Constructs a new compact tree layout for the specified graph
 * and orientation.
 */
export default class MxCompactTreeLayout {
  constructor(graph, horizontal, invert) {
    MxGraphLayout.call(this, graph)
    this.horizontal = (horizontal !== null) ? horizontal : true
    this.invert = (invert !== null) ? invert : false
  };
}

/**
 * Extends MxGraphLayout.
 */
MxCompactTreeLayout.prototype = new MxGraphLayout()
MxCompactTreeLayout.prototype.constructor = MxCompactTreeLayout

/**
 * letiable: horizontal
 *
 * Specifies the orientation of the layout. Default is true.
 */
MxCompactTreeLayout.prototype.horizontal = null

/**
 * letiable: invert
 *
 * Specifies if edge directions should be inverted. Default is false.
 */
MxCompactTreeLayout.prototype.invert = null

/**
 * letiable: resizeParent
 *
 * If the parents should be resized to match the width/height of the
 * children. Default is true.
 */
MxCompactTreeLayout.prototype.resizeParent = true

/**
 * letiable: maintainParentLocation
 *
 * Specifies if the parent location should be maintained, so that the
 * top, left corner stays the same before and after execution of
 * the layout. Default is false for backwards compatibility.
 */
MxCompactTreeLayout.prototype.maintainParentLocation = false

/**
 * letiable: groupPadding
 *
 * Padding added to resized parents. Default is 10.
 */
MxCompactTreeLayout.prototype.groupPadding = 10

/**
 * letiable: groupPaddingTop
 *
 * Top padding added to resized parents. Default is 0.
 */
MxCompactTreeLayout.prototype.groupPaddingTop = 0

/**
 * letiable: groupPaddingRight
 *
 * Right padding added to resized parents. Default is 0.
 */
MxCompactTreeLayout.prototype.groupPaddingRight = 0

/**
 * letiable: groupPaddingBottom
 *
 * Bottom padding added to resized parents. Default is 0.
 */
MxCompactTreeLayout.prototype.groupPaddingBottom = 0

/**
 * letiable: groupPaddingLeft
 *
 * Left padding added to resized parents. Default is 0.
 */
MxCompactTreeLayout.prototype.groupPaddingLeft = 0

/**
 * letiable: parentsChanged
 *
 * A set of the parents that need updating based on children
 * process as part of the layout.
 */
MxCompactTreeLayout.prototype.parentsChanged = null

/**
 * letiable: moveTree
 *
 * Specifies if the tree should be moved to the top, left corner
 * if it is inside a top-level layer. Default is false.
 */
MxCompactTreeLayout.prototype.moveTree = false

/**
 * letiable: visited
 *
 * Specifies if the tree should be moved to the top, left corner
 * if it is inside a top-level layer. Default is false.
 */
MxCompactTreeLayout.prototype.visited = null

/**
 * letiable: levelDistance
 *
 * Holds the levelDistance. Default is 10.
 */
MxCompactTreeLayout.prototype.levelDistance = 10

/**
 * letiable: nodeDistance
 *
 * Holds the nodeDistance. Default is 20.
 */
MxCompactTreeLayout.prototype.nodeDistance = 20

/**
 * letiable: resetEdges
 *
 * Specifies if all edge points of traversed edges should be removed.
 * Default is true.
 */
MxCompactTreeLayout.prototype.resetEdges = true

/**
 * letiable: prefHozEdgeSep
 *
 * The preferred horizontal distance between edges exiting a vertex.
 */
MxCompactTreeLayout.prototype.prefHozEdgeSep = 5

/**
 * letiable: prefVertEdgeOff
 *
 * The preferred vertical offset between edges exiting a vertex.
 */
MxCompactTreeLayout.prototype.prefVertEdgeOff = 4

/**
 * letiable: minEdgeJetty
 *
 * The minimum distance for an edge jetty from a vertex.
 */
MxCompactTreeLayout.prototype.minEdgeJetty = 8

/**
 * letiable: channelBuffer
 *
 * The size of the vertical buffer in the center of inter-rank channels
 * where edge control points should not be placed.
 */
MxCompactTreeLayout.prototype.channelBuffer = 4

/**
 * letiable: edgeRouting
 *
 * Whether or not to apply the internal tree edge routing.
 */
MxCompactTreeLayout.prototype.edgeRouting = true

/**
 * letiable: sortEdges
 *
 * Specifies if edges should be sorted according to the order of their
 * opposite terminal cell in the model.
 */
MxCompactTreeLayout.prototype.sortEdges = false

/**
 * letiable: alignRanks
 *
 * Whether or not the tops of cells in each rank should be aligned
 * across the rank
 */
MxCompactTreeLayout.prototype.alignRanks = false

/**
 * letiable: maxRankHeight
 *
 * An array of the maximum height of cells (relative to the layout direction)
 * per rank
 */
MxCompactTreeLayout.prototype.maxRankHeight = null

/**
 * letiable: root
 *
 * The cell to use as the root of the tree
 */
MxCompactTreeLayout.prototype.root = null

/**
 * letiable: node
 *
 * The internal node representation of the root cell. Do not set directly
 * , this value is only exposed to assist with post-processing functionality
 */
MxCompactTreeLayout.prototype.node = null

/**
 * Function: isVertexIgnored
 *
 * Returns a boolean indicating if the given <mxCell> should be ignored as a
 * vertex. This returns true if the cell has no connections.
 *
 * Parameters:
 *
 * vertex - <mxCell> whose ignored state should be returned.
 */
MxCompactTreeLayout.prototype.isVertexIgnored = function(vertex) {
  return MxGraphLayout.prototype.isVertexIgnored.apply(this, arguments) || this.graph.getConnections(vertex).length === 0
}

/**
 * Function: isHorizontal
 *
 * Returns <horizontal>.
 */
MxCompactTreeLayout.prototype.isHorizontal = function() {
  return this.horizontal
}

/**
 * Function: execute
 *
 * Implements <MxGraphLayout.execute>.
 *
 * If the parent has any connected edges, then it is used as the root of
 * the tree. Else, <mxGraph.findTreeRoots> will be used to find a suitable
 * root node within the set of children of the given parent.
 *
 * Parameters:
 *
 * parent - <mxCell> whose children should be laid out.
 * root - Optional <mxCell> that will be used as the root of the tree.
 * Overrides <root> if specified.
 */
MxCompactTreeLayout.prototype.execute = function(parent, root) {
  this.parent = parent
  let model = this.graph.getModel()

  if (root === null) {
    // Takes the parent as the root if it has outgoing edges
    if (this.graph.getEdges(parent, model.getParent(parent),
      this.invert, !this.invert, false).length > 0) {
      this.root = parent
    } else {
      // Tries to find a suitable root in the parent's
      // children
      let roots = this.graph.findTreeRoots(parent, true, this.invert)

      if (roots.length > 0) {
        for (let i = 0; i < roots.length; i++) {
          if (!this.isVertexIgnored(roots[i]) && this.graph.getEdges(roots[i], null, this.invert, !this.invert, false).length > 0) {
            this.root = roots[i]
            break
          }
        }
      }
    }
  } else {
    this.root = root
  }

  if (this.root !== null) {
    if (this.resizeParent) {
      this.parentsChanged = {}
    } else {
      this.parentsChanged = null
    }

    //  Maintaining parent location
    this.parentX = null
    this.parentY = null

    if (parent !== this.root && model.isVertex(parent) !== null && this.maintainParentLocation) {
      let geo = this.graph.getCellGeometry(parent)

      if (geo !== null) {
        this.parentX = geo.x
        this.parentY = geo.y
      }
    }

    model.beginUpdate()

    try {
      this.visited = {}
      this.node = this.dfs(this.root, parent)

      if (this.alignRanks) {
        this.maxRankHeight = []
        this.findRankHeights(this.node, 0)
        this.setCellHeights(this.node, 0)
      }

      if (this.node !== null) {
        this.layout(this.node)
        let x0 = this.graph.gridSize
        let y0 = x0

        if (!this.moveTree) {
          let g = this.getVertexBounds(this.root)

          if (g !== null) {
            x0 = g.x
            y0 = g.y
          }
        }

        let bounds = null

        if (this.isHorizontal()) {
          bounds = this.horizontalLayout(this.node, x0, y0)
        } else {
          bounds = this.verticalLayout(this.node, null, x0, y0)
        }

        if (bounds !== null) {
          let dx = 0
          let dy = 0

          if (bounds.x < 0) {
            dx = Math.abs(x0 - bounds.x)
          }

          if (bounds.y < 0) {
            dy = Math.abs(y0 - bounds.y)
          }

          if (dx !== 0 || dy !== 0) {
            this.moveNode(this.node, dx, dy)
          }

          if (this.resizeParent) {
            this.adjustParents()
          }

          if (this.edgeRouting) {
            // Iterate through all edges setting their positions
            this.localEdgeProcessing(this.node)
          }
        }

        // Maintaining parent location
        if (this.parentX !== null && this.parentY !== null) {
          let geo = this.graph.getCellGeometry(parent)

          if (geo !== null) {
            geo = geo.clone()
            geo.x = this.parentX
            geo.y = this.parentY
            model.setGeometry(parent, geo)
          }
        }
      }
    } finally {
      model.endUpdate()
    }
  }
}

/**
 * Function: moveNode
 *
 * Moves the specified node and all of its children by the given amount.
 */
MxCompactTreeLayout.prototype.moveNode = function(node, dx, dy) {
  node.x += dx
  node.y += dy
  this.apply(node)

  let child = node.child

  while (child !== null) {
    this.moveNode(child, dx, dy)
    child = child.next
  }
}

/**
 * Function: sortOutgoingEdges
 *
 * Called if <sortEdges> is true to sort the array of outgoing edges in place.
 */
MxCompactTreeLayout.prototype.sortOutgoingEdges = function(source, edges) {
  let lookup = new MxDictionary()

  edges.sort(function(e1, e2) {
    let end1 = e1.getTerminal(e1.getTerminal(false) === source)
    let p1 = lookup.get(end1)

    if (p1 === null) {
      p1 = MxCellPath.create(end1).split(MxCellPath.PATH_SEPARATOR)
      lookup.put(end1, p1)
    }

    let end2 = e2.getTerminal(e2.getTerminal(false) === source)
    let p2 = lookup.get(end2)

    if (p2 === null) {
      p2 = MxCellPath.create(end2).split(MxCellPath.PATH_SEPARATOR)
      lookup.put(end2, p2)
    }

    return MxCellPath.compare(p1, p2)
  })
}

/**
 * Function: findRankHeights
 *
 * Stores the maximum height (relative to the layout
 * direction) of cells in each rank
 */
MxCompactTreeLayout.prototype.findRankHeights = function(node, rank) {
  if (this.maxRankHeight[rank] === null || this.maxRankHeight[rank] < node.height) {
    this.maxRankHeight[rank] = node.height
  }

  let child = node.child

  while (child !== null) {
    this.findRankHeights(child, rank + 1)
    child = child.next
  }
}

/**
 * Function: setCellHeights
 *
 * Set the cells heights (relative to the layout
 * direction) when the tops of each rank are to be aligned
 */
MxCompactTreeLayout.prototype.setCellHeights = function(node, rank) {
  if (this.maxRankHeight[rank] !== null && this.maxRankHeight[rank] > node.height) {
    node.height = this.maxRankHeight[rank]
  }

  let child = node.child

  while (child !== null) {
    this.setCellHeights(child, rank + 1)
    child = child.next
  }
}

/**
 * Function: dfs
 *
 * Does a depth first search starting at the specified cell.
 * Makes sure the specified parent is never left by the
 * algorithm.
 */
MxCompactTreeLayout.prototype.dfs = function(cell, parent) {
  let id = MxCellPath.create(cell)
  let node = null

  if (cell !== null && this.visited[id] === null && !this.isVertexIgnored(cell)) {
    this.visited[id] = cell
    node = this.createNode(cell)

    let model = this.graph.getModel()
    let prev = null
    let out = this.graph.getEdges(cell, parent, this.invert, !this.invert, false, true)
    let view = this.graph.getView()

    if (this.sortEdges) {
      this.sortOutgoingEdges(cell, out)
    }

    for (let i = 0; i < out.length; i++) {
      let edge = out[i]

      if (!this.isEdgeIgnored(edge)) {
        // Resets the points on the traversed edge
        if (this.resetEdges) {
          this.setEdgePoints(edge, null)
        }

        if (this.edgeRouting) {
          this.setEdgeStyleEnabled(edge, false)
          this.setEdgePoints(edge, null)
        }

        // Checks if terminal in same swimlane
        let state = view.getState(edge)
        let target = (state !== null) ? state.getVisibleTerminal(this.invert) : view.getVisibleTerminal(edge, this.invert)
        let tmp = this.dfs(target, parent)

        if (tmp !== null && model.getGeometry(target) !== null) {
          if (prev === null) {
            node.child = tmp
          } else {
            prev.next = tmp
          }

          prev = tmp
        }
      }
    }
  }

  return node
}

/**
 * Function: layout
 *
 * Starts the actual compact tree layout algorithm
 * at the given node.
 */
MxCompactTreeLayout.prototype.layout = function(node) {
  if (node !== null) {
    let child = node.child

    while (child !== null) {
      this.layout(child)
      child = child.next
    }

    if (node.child !== null) {
      this.attachParent(node, this.join(node))
    } else {
      this.layoutLeaf(node)
    }
  }
}

/**
 * Function: horizontalLayout
 */
MxCompactTreeLayout.prototype.horizontalLayout = function(node, x0, y0, bounds) {
  node.x += x0 + node.offsetX
  node.y += y0 + node.offsetY
  bounds = this.apply(node, bounds)
  let child = node.child

  if (child !== null) {
    bounds = this.horizontalLayout(child, node.x, node.y, bounds)
    let siblingOffset = node.y + child.offsetY
    let s = child.next

    while (s !== null) {
      bounds = this.horizontalLayout(s, node.x + child.offsetX, siblingOffset, bounds)
      siblingOffset += s.offsetY
      s = s.next
    }
  }

  return bounds
}

/**
 * Function: verticalLayout
 */
MxCompactTreeLayout.prototype.verticalLayout = function(node, parent, x0, y0, bounds) {
  node.x += x0 + node.offsetY
  node.y += y0 + node.offsetX
  bounds = this.apply(node, bounds)
  let child = node.child

  if (child !== null) {
    bounds = this.verticalLayout(child, node, node.x, node.y, bounds)
    let siblingOffset = node.x + child.offsetY
    let s = child.next

    while (s !== null) {
      bounds = this.verticalLayout(s, node, siblingOffset, node.y + child.offsetX, bounds)
      siblingOffset += s.offsetY
      s = s.next
    }
  }

  return bounds
}

/**
 * Function: attachParent
 */
MxCompactTreeLayout.prototype.attachParent = function(node, height) {
  let x = this.nodeDistance + this.levelDistance
  let y2 = (height - node.width) / 2 - this.nodeDistance
  let y1 = y2 + node.width + 2 * this.nodeDistance - height

  node.child.offsetX = x + node.height
  node.child.offsetY = y1

  node.contour.upperHead = this.createLine(node.height, 0,
    this.createLine(x, y1, node.contour.upperHead))
  node.contour.lowerHead = this.createLine(node.height, 0,
    this.createLine(x, y2, node.contour.lowerHead))
}

/**
 * Function: layoutLeaf
 */
MxCompactTreeLayout.prototype.layoutLeaf = function(node) {
  let dist = 2 * this.nodeDistance

  node.contour.upperTail = this.createLine(
    node.height + dist, 0)
  node.contour.upperHead = node.contour.upperTail
  node.contour.lowerTail = this.createLine(
    0, -node.width - dist)
  node.contour.lowerHead = this.createLine(
    node.height + dist, 0, node.contour.lowerTail)
}

/**
 * Function: join
 */
MxCompactTreeLayout.prototype.join = function(node) {
  let dist = 2 * this.nodeDistance

  let child = node.child
  node.contour = child.contour
  let h = child.width + dist
  let sum = h
  child = child.next

  while (child !== null) {
    let d = this.merge(node.contour, child.contour)
    child.offsetY = d + h
    child.offsetX = 0
    h = child.width + dist
    sum += d + h
    child = child.next
  }

  return sum
}

/**
 * Function: merge
 */
MxCompactTreeLayout.prototype.merge = function(p1, p2) {
  let x = 0
  let y = 0
  let total = 0

  let upper = p1.lowerHead
  let lower = p2.upperHead

  while (lower !== null && upper !== null) {
    let d = this.offset(x, y, lower.dx, lower.dy,
      upper.dx, upper.dy)
    y += d
    total += d

    if (x + lower.dx <= upper.dx) {
      x += lower.dx
      y += lower.dy
      lower = lower.next
    } else {
      x -= upper.dx
      y -= upper.dy
      upper = upper.next
    }
  }

  if (lower !== null) {
    let b = this.bridge(p1.upperTail, 0, 0, lower, x, y)
    p1.upperTail = (b.next !== null) ? p2.upperTail : b
    p1.lowerTail = p2.lowerTail
  } else {
    let b = this.bridge(p2.lowerTail, x, y, upper, 0, 0)

    if (b.next === null) {
      p1.lowerTail = b
    }
  }

  p1.lowerHead = p2.lowerHead

  return total
}

/**
 * Function: offset
 */
MxCompactTreeLayout.prototype.offset = function(p1, p2, a1, a2, b1, b2) {
  let d = 0

  if (b1 <= p1 || p1 + a1 <= 0) {
    return 0
  }

  let t = b1 * a2 - a1 * b2

  if (t > 0) {
    if (p1 < 0) {
      let s = p1 * a2
      d = s / a1 - p2
    } else if (p1 > 0) {
      let s = p1 * b2
      d = s / b1 - p2
    } else {
      d = -p2
    }
  } else if (b1 < p1 + a1) {
    let s = (b1 - p1) * a2
    d = b2 - (p2 + s / a1)
  } else if (b1 > p1 + a1) {
    let s = (a1 + p1) * b2
    d = s / b1 - (p2 + a2)
  } else {
    d = b2 - (p2 + a2)
  }

  if (d > 0) {
    return d
  } else {
    return 0
  }
}

/**
 * Function: bridge
 */
MxCompactTreeLayout.prototype.bridge = function(line1, x1, y1, line2, x2, y2) {
  let dx = x2 + line2.dx - x1
  let dy = 0
  let s = 0

  if (line2.dx === 0) {
    dy = line2.dy
  } else {
    s = dx * line2.dy
    dy = s / line2.dx
  }

  let r = this.createLine(dx, dy, line2.next)
  line1.next = this.createLine(0, y2 + line2.dy - dy - y1, r)

  return r
}

/**
 * Function: createNode
 */
MxCompactTreeLayout.prototype.createNode = function(cell) {
  let node = {}
  node.cell = cell
  node.x = 0
  node.y = 0
  node.width = 0
  node.height = 0

  let geo = this.getVertexBounds(cell)

  if (geo !== null) {
    if (this.isHorizontal()) {
      node.width = geo.height
      node.height = geo.width
    } else {
      node.width = geo.width
      node.height = geo.height
    }
  }

  node.offsetX = 0
  node.offsetY = 0
  node.contour = {}

  return node
}

/**
 * Function: apply
 */
MxCompactTreeLayout.prototype.apply = function(node, bounds) {
  let model = this.graph.getModel()
  let cell = node.cell
  let g = model.getGeometry(cell)

  if (cell !== null && g !== null) {
    if (this.isVertexMovable(cell)) {
      g = this.setVertexLocation(cell, node.x, node.y)

      if (this.resizeParent) {
        let parent = model.getParent(cell)
        let id = MxCellPath.create(parent)

        // Implements set semantic
        if (this.parentsChanged[id] === null) {
          this.parentsChanged[id] = parent
        }
      }
    }

    if (bounds === null) {
      bounds = new MxRectangle(g.x, g.y, g.width, g.height)
    } else {
      bounds = new MxRectangle(Math.min(bounds.x, g.x),
        Math.min(bounds.y, g.y),
        Math.max(bounds.x + bounds.width, g.x + g.width),
        Math.max(bounds.y + bounds.height, g.y + g.height))
    }
  }

  return bounds
}

/**
 * Function: createLine
 */
MxCompactTreeLayout.prototype.createLine = function(dx, dy, next) {
  let line = {}
  line.dx = dx
  line.dy = dy
  line.next = next

  return line
}

/**
 * Function: adjustParents
 *
 * Adjust parent cells whose child geometries have changed. The default
 * implementation adjusts the group to just fit around the children with
 * a padding.
 */
MxCompactTreeLayout.prototype.adjustParents = function() {
  let tmp = []

  for (let id in this.parentsChanged) {
    tmp.push(this.parentsChanged[id])
  }

  this.arrangeGroups(MxUtils.sortCells(tmp, true), this.groupPadding, this.groupPaddingTop,
    this.groupPaddingRight, this.groupPaddingBottom, this.groupPaddingLeft)
}

/**
 * Function: localEdgeProcessing
 *
 * Moves the specified node and all of its children by the given amount.
 */
MxCompactTreeLayout.prototype.localEdgeProcessing = function(node) {
  this.processNodeOutgoing(node)
  let child = node.child

  while (child !== null) {
    this.localEdgeProcessing(child)
    child = child.next
  }
}

/**
 * Function: localEdgeProcessing
 *
 * Separates the x position of edges as they connect to vertices
 */
MxCompactTreeLayout.prototype.processNodeOutgoing = function(node) {
  let child = node.child
  let parentCell = node.cell

  let childCount = 0
  let sortedCells = []

  while (child !== null) {
    childCount++

    let sortingCriterion = child.x

    if (this.horizontal) {
      sortingCriterion = child.y
    }

    sortedCells.push(new WeightedCellSorter(child, sortingCriterion))
    child = child.next
  }

  sortedCells.sort(WeightedCellSorter.prototype.compare)

  let availableWidth = node.width

  let requiredWidth = (childCount + 1) * this.prefHozEdgeSep

  // Add a buffer on the edges of the vertex if the edge count allows
  if (availableWidth > requiredWidth + (2 * this.prefHozEdgeSep)) {
    availableWidth -= 2 * this.prefHozEdgeSep
  }

  let edgeSpacing = availableWidth / childCount

  let currentXOffset = edgeSpacing / 2.0

  if (availableWidth > requiredWidth + (2 * this.prefHozEdgeSep)) {
    currentXOffset += this.prefHozEdgeSep
  }

  let currentYOffset = this.minEdgeJetty - this.prefVertEdgeOff
  let maxYOffset = 0

  let parentBounds = this.getVertexBounds(parentCell)
  child = node.child

  for (let j = 0; j < sortedCells.length; j++) {
    let childCell = sortedCells[j].cell.cell
    let childBounds = this.getVertexBounds(childCell)

    let edges = this.graph.getEdgesBetween(parentCell,
      childCell, false)

    let newPoints = []
    let x = 0
    let y = 0

    for (let i = 0; i < edges.length; i++) {
      if (this.horizontal) {
        // Use opposite co-ords, calculation was done for
        //
        x = parentBounds.x + parentBounds.width
        y = parentBounds.y + currentXOffset
        newPoints.push(new MxPoint(x, y))
        x = parentBounds.x + parentBounds.width + currentYOffset
        newPoints.push(new MxPoint(x, y))
        y = childBounds.y + childBounds.height / 2.0
        newPoints.push(new MxPoint(x, y))
        this.setEdgePoints(edges[i], newPoints)
      } else {
        x = parentBounds.x + currentXOffset
        y = parentBounds.y + parentBounds.height
        newPoints.push(new MxPoint(x, y))
        y = parentBounds.y + parentBounds.height + currentYOffset
        newPoints.push(new MxPoint(x, y))
        x = childBounds.x + childBounds.width / 2.0
        newPoints.push(new MxPoint(x, y))
        this.setEdgePoints(edges[i], newPoints)
      }
    }

    if (j < childCount / 2) {
      currentYOffset += this.prefVertEdgeOff
    } else if (j > childCount / 2) {
      currentYOffset -= this.prefVertEdgeOff
    }
    // Ignore the case if equals, this means the second of 2
    // jettys with the same y (even number of edges)

    // pos[k * 2] = currentX;
    currentXOffset += edgeSpacing
    // pos[k * 2 + 1] = currentYOffset;

    maxYOffset = Math.max(maxYOffset, currentYOffset)
  }
}
