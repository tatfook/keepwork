import MxGraphLayout from '../MxGraphLayout'
import MxConstants from '../../util/MxConstants'
import { MxHierarchicalEdgeStyle, MxHierarchicalLayout } from './MxHierarchicalLayout'
import MxDictionary from '../../util/MxDictionary'
import MxRectangle from '../../util/MxRectangle'
import MxSwimlaneModel from './model/MxSwimlaneModel'
import MxObjectIdentity from '../../util/MxObjectIdentity'
import MxSwimlaneOrdering from './stage/MxSwimlaneOrdering'
import MxMedianHybridCrossingReduction from './stage/MxMedianHybridCrossingReduction'
import MxCoordinateAssignment from './stage/MxCoordinateAssignment'
/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxSwimlaneLayout
 *
 * A hierarchical layout algorithm.
 *
 * Constructor: MxSwimlaneLayout
 *
 * Constructs a new hierarchical layout algorithm.
 *
 * Arguments:
 *
 * graph - Reference to the enclosing <mxGraph>.
 * orientation - Optional constant that defines the orientation of this
 * layout.
 * deterministic - Optional boolean that specifies if this layout should be
 * deterministic. Default is true.
 */
export default class MxSwimlaneLayout {
  constructor(graph, orientation, deterministic) {
    MxGraphLayout.call(this, graph)
    this.orientation = (orientation !== null) ? orientation : MxConstants.DIRECTION_NORTH
    this.deterministic = (deterministic !== null) ? deterministic : true
  };
}

/**
 * Extends MxGraphLayout.
 */
MxSwimlaneLayout.prototype = new MxGraphLayout()
MxSwimlaneLayout.prototype.constructor = MxSwimlaneLayout

/**
 * Variable: roots
 *
 * Holds the array of <mxCell> that this layout contains.
 */
MxSwimlaneLayout.prototype.roots = null

/**
 * Variable: swimlanes
 *
 * Holds the array of <mxCell> of the ordered swimlanes to lay out
 */
MxSwimlaneLayout.prototype.swimlanes = null

/**
 * Variable: dummyVertices
 *
 * Holds an array of <mxCell> of dummy vertices inserted during the layout
 * to pad out empty swimlanes
 */
MxSwimlaneLayout.prototype.dummyVertices = null

/**
 * Variable: dummyVertexWidth
 *
 * The cell width of any dummy vertices inserted
 */
MxSwimlaneLayout.prototype.dummyVertexWidth = 50

/**
 * Variable: resizeParent
 *
 * Specifies if the parent should be resized after the layout so that it
 * contains all the child cells. Default is false. See also <parentBorder>.
 */
MxSwimlaneLayout.prototype.resizeParent = false

/**
 * Variable: maintainParentLocation
 *
 * Specifies if the parent location should be maintained, so that the
 * top, left corner stays the same before and after execution of
 * the layout. Default is false for backwards compatibility.
 */
MxSwimlaneLayout.prototype.maintainParentLocation = false

/**
 * Variable: moveParent
 *
 * Specifies if the parent should be moved if <resizeParent> is enabled.
 * Default is false.
 */
MxSwimlaneLayout.prototype.moveParent = false

/**
 * Variable: parentBorder
 *
 * The border to be added around the children if the parent is to be
 * resized using <resizeParent>. Default is 0.
 */
MxSwimlaneLayout.prototype.parentBorder = 30

/**
 * Variable: intraCellSpacing
 *
 * The spacing buffer added between cells on the same layer. Default is 30.
 */
MxSwimlaneLayout.prototype.intraCellSpacing = 30

/**
 * Variable: interRankCellSpacing
 *
 * The spacing buffer added between cell on adjacent layers. Default is 50.
 */
MxSwimlaneLayout.prototype.interRankCellSpacing = 100

/**
 * Variable: interHierarchySpacing
 *
 * The spacing buffer between unconnected hierarchies. Default is 60.
 */
MxSwimlaneLayout.prototype.interHierarchySpacing = 60

/**
 * Variable: parallelEdgeSpacing
 *
 * The distance between each parallel edge on each ranks for long edges
 */
MxSwimlaneLayout.prototype.parallelEdgeSpacing = 10

/**
 * Variable: orientation
 *
 * The position of the root node(s) relative to the laid out graph in.
 * Default is <MxConstants.DIRECTION_NORTH>.
 */
MxSwimlaneLayout.prototype.orientation = MxConstants.DIRECTION_NORTH

/**
 * Variable: fineTuning
 *
 * Whether or not to perform local optimisations and iterate multiple times
 * through the algorithm. Default is true.
 */
MxSwimlaneLayout.prototype.fineTuning = true

/**
 *
 * Variable: tightenToSource
 *
 * Whether or not to tighten the assigned ranks of vertices up towards
 * the source cells.
 */
MxSwimlaneLayout.prototype.tightenToSource = true

/**
 * Variable: disableEdgeStyle
 *
 * Specifies if the STYLE_NOEDGESTYLE flag should be set on edges that are
 * modified by the result. Default is true.
 */
MxSwimlaneLayout.prototype.disableEdgeStyle = true

/**
 * Variable: traverseAncestors
 *
 * Whether or not to drill into child cells and layout in reverse
 * group order. This also cause the layout to navigate edges whose
 * terminal vertices  * have different parents but are in the same
 * ancestry chain
 */
MxSwimlaneLayout.prototype.traverseAncestors = true

/**
 * Variable: model
 *
 * The internal <MxSwimlaneModel> formed of the layout.
 */
MxSwimlaneLayout.prototype.model = null

/**
 * Variable: edgesSet
 *
 * A cache of edges whose source terminal is the key
 */
MxSwimlaneLayout.prototype.edgesCache = null

/**
 * Variable: edgesSet
 *
 * A cache of edges whose source terminal is the key
 */
MxHierarchicalLayout.prototype.edgeSourceTermCache = null

/**
 * Variable: edgesSet
 *
 * A cache of edges whose source terminal is the key
 */
MxHierarchicalLayout.prototype.edgesTargetTermCache = null

/**
 * Variable: edgeStyle
 *
 * The style to apply between cell layers to edge segments
 */
MxHierarchicalLayout.prototype.edgeStyle = MxHierarchicalEdgeStyle.POLYLINE

/**
 * Function: getModel
 *
 * Returns the internal <MxSwimlaneModel> for this layout algorithm.
 */
MxSwimlaneLayout.prototype.getModel = function() {
  return this.model
}

/**
 * Function: execute
 *
 * Executes the layout for the children of the specified parent.
 *
 * Parameters:
 *
 * parent - Parent <mxCell> that contains the children to be laid out.
 * swimlanes - Ordered array of swimlanes to be laid out
 */
MxSwimlaneLayout.prototype.execute = function(parent, swimlanes) {
  this.parent = parent
  let model = this.graph.model
  this.edgesCache = new MxDictionary()
  this.edgeSourceTermCache = new MxDictionary()
  this.edgesTargetTermCache = new MxDictionary()

  // If the roots are set and the parent is set, only
  // use the roots that are some dependent of the that
  // parent.
  // If just the root are set, use them as-is
  // If just the parent is set use it's immediate
  // children as the initial set

  if (swimlanes === null || swimlanes.length < 1) {
    // TODO indicate the problem
    return
  }

  if (parent === null) {
    parent = model.getParent(swimlanes[0])
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

  this.swimlanes = swimlanes
  this.dummyVertices = []
  // Check the swimlanes all have vertices
  // in them
  for (let i = 0; i < swimlanes.length; i++) {
    let children = this.graph.getChildCells(swimlanes[i])

    if (children === null || children.length === 0) {
      let vertex = this.graph.insertVertex(swimlanes[i], null, null, 0, 0, this.dummyVertexWidth, 0)
      this.dummyVertices.push(vertex)
    }
  }

  model.beginUpdate()
  try {
    this.run(parent)

    if (this.resizeParent && !this.graph.isCellCollapsed(parent)) {
      this.graph.updateGroupBounds([parent], this.parentBorder, this.moveParent)
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

    this.graph.removeCells(this.dummyVertices)
  } finally {
    model.endUpdate()
  }
}

/**
 * Function: updateGroupBounds
 *
 * Updates the bounds of the given array of groups so that it includes
 * all child vertices.
 *
 */
MxSwimlaneLayout.prototype.updateGroupBounds = function() {
  // Get all vertices and edge in the layout
  let cells = []
  let model = this.model

  for (let key in model.edgeMapper) {
    let edge = model.edgeMapper[key]

    for (let i = 0; i < edge.edges.length; i++) {
      cells.push(edge.edges[i])
    }
  }

  let layoutBounds = this.graph.getBoundingBoxFromGeometry(cells, true)
  let childBounds = []

  for (let i = 0; i < this.swimlanes.length; i++) {
    let lane = this.swimlanes[i]
    let geo = this.graph.getCellGeometry(lane)

    if (geo !== null) {
      let children = this.graph.getChildCells(lane)

      let size = (this.graph.isSwimlane(lane))
        ? this.graph.getStartSize(lane) : new MxRectangle()

      let bounds = this.graph.getBoundingBoxFromGeometry(children)
      childBounds[i] = bounds
      let childrenY = bounds.y + geo.y - size.height - this.parentBorder
      let maxChildrenY = bounds.y + geo.y + bounds.height

      if (layoutBounds === null) {
        layoutBounds = new MxRectangle(0, childrenY, 0, maxChildrenY - childrenY)
      } else {
        layoutBounds.y = Math.min(layoutBounds.y, childrenY)
        let maxY = Math.max(layoutBounds.y + layoutBounds.height, maxChildrenY)
        layoutBounds.height = maxY - layoutBounds.y
      }
    }
  }

  for (let i = 0; i < this.swimlanes.length; i++) {
    let lane = this.swimlanes[i]
    let geo = this.graph.getCellGeometry(lane)

    if (geo !== null) {
      let children = this.graph.getChildCells(lane)

      let size = (this.graph.isSwimlane(lane))
        ? this.graph.getStartSize(lane) : new MxRectangle()

      let newGeo = geo.clone()

      let leftGroupBorder = (i === 0) ? this.parentBorder : this.interRankCellSpacing / 2
      newGeo.x += childBounds[i].x - size.width - leftGroupBorder
      newGeo.y = newGeo.y + layoutBounds.y - geo.y - this.parentBorder

      newGeo.width = childBounds[i].width + size.width + this.interRankCellSpacing / 2 + leftGroupBorder
      newGeo.height = layoutBounds.height + size.height + 2 * this.parentBorder

      this.graph.model.setGeometry(lane, newGeo)
      this.graph.moveCells(children, -childBounds[i].x + size.width + leftGroupBorder,
        geo.y - layoutBounds.y + this.parentBorder)
    }
  }
}

/**
 * Function: findRoots
 *
 * Returns all visible children in the given parent which do not have
 * incoming edges. If the result is empty then the children with the
 * maximum difference between incoming and outgoing edges are returned.
 * This takes into account edges that are being promoted to the given
 * root due to invisible children or collapsed cells.
 *
 * Parameters:
 *
 * parent - <mxCell> whose children should be checked.
 * vertices - array of vertices to limit search to
 */
MxSwimlaneLayout.prototype.findRoots = function(parent, vertices) {
  let roots = []

  if (parent !== null && vertices !== null) {
    let model = this.graph.model
    let best = null
    let maxDiff = -100000

    for (let i in vertices) {
      let cell = vertices[i]

      if (cell !== null && model.isVertex(cell) && this.graph.isCellVisible(cell) && model.isAncestor(parent, cell)) {
        let conns = this.getEdges(cell)
        let fanOut = 0
        let fanIn = 0

        for (let k = 0; k < conns.length; k++) {
          let src = this.getVisibleTerminal(conns[k], true)

          if (src === cell) {
            // Only count connection within this swimlane
            let other = this.getVisibleTerminal(conns[k], false)

            if (model.isAncestor(parent, other)) {
              fanOut++
            }
          } else if (model.isAncestor(parent, src)) {
            fanIn++
          }
        }

        if (fanIn === 0 && fanOut > 0) {
          roots.push(cell)
        }

        let diff = fanOut - fanIn

        if (diff > maxDiff) {
          maxDiff = diff
          best = cell
        }
      }
    }

    if (roots.length === 0 && best !== null) {
      roots.push(best)
    }
  }

  return roots
}

/**
 * Function: getEdges
 *
 * Returns the connected edges for the given cell.
 *
 * Parameters:
 *
 * cell - <mxCell> whose edges should be returned.
 */
MxSwimlaneLayout.prototype.getEdges = function(cell) {
  let cachedEdges = this.edgesCache.get(cell)

  if (cachedEdges !== null) {
    return cachedEdges
  }

  let model = this.graph.model
  let edges = []
  let isCollapsed = this.graph.isCellCollapsed(cell)
  let childCount = model.getChildCount(cell)

  for (let i = 0; i < childCount; i++) {
    let child = model.getChildAt(cell, i)

    if (this.isPort(child)) {
      edges = edges.concat(model.getEdges(child, true, true))
    } else if (isCollapsed || !this.graph.isCellVisible(child)) {
      edges = edges.concat(model.getEdges(child, true, true))
    }
  }

  edges = edges.concat(model.getEdges(cell, true, true))
  let result = []

  for (let i = 0; i < edges.length; i++) {
    let source = this.getVisibleTerminal(edges[i], true)
    let target = this.getVisibleTerminal(edges[i], false)

    if ((source === target) || ((source !== target) && ((target === cell && (this.parent === null || this.graph.isValidAncestor(source, this.parent, this.traverseAncestors))) || (source === cell && (this.parent === null || this.graph.isValidAncestor(target, this.parent, this.traverseAncestors)))))) {
      result.push(edges[i])
    }
  }

  this.edgesCache.put(cell, result)

  return result
}

/**
 * Function: getVisibleTerminal
 *
 * Helper function to return visible terminal for edge allowing for ports
 *
 * Parameters:
 *
 * edge - <mxCell> whose edges should be returned.
 * source - Boolean that specifies whether the source or target terminal is to be returned
 */
MxSwimlaneLayout.prototype.getVisibleTerminal = function(edge, source) {
  let terminalCache = this.edgesTargetTermCache

  if (source) {
    terminalCache = this.edgeSourceTermCache
  }

  let term = terminalCache.get(edge)

  if (term !== null) {
    return term
  }

  let state = this.graph.view.getState(edge)

  let terminal = (state !== null) ? state.getVisibleTerminal(source) : this.graph.view.getVisibleTerminal(edge, source)

  if (terminal === null) {
    terminal = (state !== null) ? state.getVisibleTerminal(source) : this.graph.view.getVisibleTerminal(edge, source)
  }

  if (terminal !== null) {
    if (this.isPort(terminal)) {
      terminal = this.graph.model.getParent(terminal)
    }

    terminalCache.put(edge, terminal)
  }

  return terminal
}

/**
 * Function: run
 *
 * The API method used to exercise the layout upon the graph description
 * and produce a separate description of the vertex position and edge
 * routing changes made. It runs each stage of the layout that has been
 * created.
 */
MxSwimlaneLayout.prototype.run = function(parent) {
  // Separate out unconnected hierarchies
  let hierarchyVertices = []
  let allVertexSet = []

  if (this.swimlanes !== null && this.swimlanes.length > 0 && parent !== null) {
    let filledVertexSet = Object()

    for (let i = 0; i < this.swimlanes.length; i++) {
      this.filterDescendants(this.swimlanes[i], filledVertexSet)
    }

    this.roots = []
    let filledVertexSetEmpty = true

    // Poor man's isSetEmpty
    for (let key in filledVertexSet) {
      if (filledVertexSet[key] !== null) {
        filledVertexSetEmpty = false
        break
      }
    }

    // Only test for candidates in each swimlane in order
    let laneCounter = 0

    while (!filledVertexSetEmpty && laneCounter < this.swimlanes.length) {
      let candidateRoots = this.findRoots(this.swimlanes[laneCounter], filledVertexSet)

      if (candidateRoots.length === 0) {
        laneCounter++
        continue
      }

      // If the candidate root is an unconnected group cell, remove it from
      // the layout. We may need a custom set that holds such groups and forces
      // them to be processed for resizing and/or moving.
      for (let i = 0; i < candidateRoots.length; i++) {
        let vertexSet = Object()
        hierarchyVertices.push(vertexSet)

        this.traverse(candidateRoots[i], true, null, allVertexSet, vertexSet,
          hierarchyVertices, filledVertexSet, laneCounter)
      }

      for (let i = 0; i < candidateRoots.length; i++) {
        this.roots.push(candidateRoots[i])
      }

      filledVertexSetEmpty = true

      // Poor man's isSetEmpty
      for (let key in filledVertexSet) {
        if (filledVertexSet[key] !== null) {
          filledVertexSetEmpty = false
          break
        }
      }
    }
  } else {
    // Find vertex set as directed traversal from roots

    for (let i = 0; i < this.roots.length; i++) {
      let vertexSet = Object()
      hierarchyVertices.push(vertexSet)

      this.traverse(this.roots[i], true, null, allVertexSet, vertexSet,
        hierarchyVertices, null)
    }
  }

  let tmp = []

  for (let key in allVertexSet) {
    tmp.push(allVertexSet[key])
  }

  this.model = new MxSwimlaneModel(this, tmp, this.roots,
    parent, this.tightenToSource)

  this.cycleStage(parent)
  this.layeringStage()

  this.crossingStage(parent)
  // initialX = this.placementStage(0, parent)
}

/**
 * Function: filterDescendants
 *
 * Creates an array of descendant cells
 */
MxSwimlaneLayout.prototype.filterDescendants = function(cell, result) {
  let model = this.graph.model

  if (model.isVertex(cell) && cell !== this.parent && model.getParent(cell) !== this.parent && this.graph.isCellVisible(cell)) {
    result[MxObjectIdentity.get(cell)] = cell
  }

  if ((this.traverseAncestors || cell) === (this.parent && this.graph.isCellVisible(cell))) {
    let childCount = model.getChildCount(cell)

    for (let i = 0; i < childCount; i++) {
      let child = model.getChildAt(cell, i)

      // Ignore ports in the layout vertex list, they are dealt with
      // in the traversal mechanisms
      if (!this.isPort(child)) {
        this.filterDescendants(child, result)
      }
    }
  }
}

/**
 * Function: isPort
 *
 * Returns true if the given cell is a "port", that is, when connecting to
 * it, its parent is the connecting vertex in terms of graph traversal
 *
 * Parameters:
 *
 * cell - <mxCell> that represents the port.
 */
MxSwimlaneLayout.prototype.isPort = function(cell) {
  if (cell.geometry.relative) {
    return true
  }

  return false
}

/**
 * Function: getEdgesBetween
 *
 * Returns the edges between the given source and target. This takes into
 * account collapsed and invisible cells and ports.
 *
 * Parameters:
 *
 * source -
 * target -
 * directed -
 */
MxSwimlaneLayout.prototype.getEdgesBetween = function(source, target, directed) {
  directed = (directed !== null) ? directed : false
  let edges = this.getEdges(source)
  let result = []

  // Checks if the edge is connected to the correct
  // cell and returns the first match
  for (let i = 0; i < edges.length; i++) {
    let src = this.getVisibleTerminal(edges[i], true)
    let trg = this.getVisibleTerminal(edges[i], false)

    if ((src === source && trg === target) || (!directed && src === target && trg === source)) {
      result.push(edges[i])
    }
  }

  return result
}

/**
 * Traverses the (directed) graph invoking the given function for each
 * visited vertex and edge. The function is invoked with the current vertex
 * and the incoming edge as a parameter. This implementation makes sure
 * each vertex is only visited once. The function may return false if the
 * traversal should stop at the given vertex.
 *
 * Parameters:
 *
 * vertex - <mxCell> that represents the vertex where the traversal starts.
 * directed - boolean indicating if edges should only be traversed
 * from source to target. Default is true.
 * edge - Optional <mxCell> that represents the incoming edge. This is
 * null for the first step of the traversal.
 * allVertices - Array of cell paths for the visited cells.
 * swimlaneIndex - the laid out order index of the swimlane vertex is contained in
 */
MxSwimlaneLayout.prototype.traverse = function(vertex, directed, edge, allVertices, currentComp,
  hierarchyVertices, filledVertexSet, swimlaneIndex) {
  if (vertex !== null && allVertices !== null) {
    // Has this vertex been seen before in any traversal
    // And if the filled vertex set is populated, only
    // process vertices in that it contains
    let vertexID = MxObjectIdentity.get(vertex)

    if ((allVertices[vertexID] === null) && (filledVertexSet === null ? true : filledVertexSet[vertexID] !== null)) {
      if (currentComp[vertexID] === null) {
        currentComp[vertexID] = vertex
      }
      if (allVertices[vertexID] === null) {
        allVertices[vertexID] = vertex
      }

      if (filledVertexSet !== null) {
        delete filledVertexSet[vertexID]
      }

      let edges = this.getEdges(vertex)
      let model = this.graph.model

      for (let i = 0; i < edges.length; i++) {
        let otherVertex = this.getVisibleTerminal(edges[i], true)
        let isSource = otherVertex === vertex

        if (isSource) {
          otherVertex = this.getVisibleTerminal(edges[i], false)
        }

        let otherIndex = 0
        // Get the swimlane index of the other terminal
        for (otherIndex = 0; otherIndex < this.swimlanes.length; otherIndex++) {
          if (model.isAncestor(this.swimlanes[otherIndex], otherVertex)) {
            break
          }
        }

        if (otherIndex >= this.swimlanes.length) {
          continue
        }

        // Traverse if the other vertex is within the same swimlane as
        // as the current vertex, or if the swimlane index of the other
        // vertex is greater than that of this vertex
        if ((otherIndex > swimlaneIndex) || ((!directed || isSource) && otherIndex === swimlaneIndex)) {
          currentComp = this.traverse(otherVertex, directed, edges[i], allVertices,
            currentComp, hierarchyVertices,
            filledVertexSet, otherIndex)
        }
      }
    } else {
      if (currentComp[vertexID] === null) {
        // We've seen this vertex before, but not in the current component
        // This component and the one it's in need to be merged
        for (let i = 0; i < hierarchyVertices.length; i++) {
          let comp = hierarchyVertices[i]

          if (comp[vertexID] !== null) {
            for (let key in comp) {
              currentComp[key] = comp[key]
            }

            // Remove the current component from the hierarchy set
            hierarchyVertices.splice(i, 1)
            return currentComp
          }
        }
      }
    }
  }

  return currentComp
}

/**
 * Function: cycleStage
 *
 * Executes the cycle stage using mxMinimumCycleRemover.
 */
MxSwimlaneLayout.prototype.cycleStage = function(parent) {
  let cycleStage = new MxSwimlaneOrdering(this)
  cycleStage.execute(parent)
}

/**
 * Function: layeringStage
 *
 * Implements first stage of a Sugiyama layout.
 */
MxSwimlaneLayout.prototype.layeringStage = function() {
  this.model.initialRank()
  this.model.fixRanks()
}

/**
 * Function: crossingStage
 *
 * Executes the crossing stage using MxMedianHybridCrossingReduction.
 */
MxSwimlaneLayout.prototype.crossingStage = function(parent) {
  let crossingStage = new MxMedianHybridCrossingReduction(this)
  crossingStage.execute(parent)
}

/**
 * Function: placementStage
 *
 * Executes the placement stage using MxCoordinateAssignment.
 */
MxSwimlaneLayout.prototype.placementStage = function(initialX, parent) {
  let placementStage = new MxCoordinateAssignment(this, this.intraCellSpacing,
    this.interRankCellSpacing, this.orientation, initialX,
    this.parallelEdgeSpacing)
  placementStage.fineTuning = this.fineTuning
  placementStage.execute(parent)

  return placementStage.limitX + this.interHierarchySpacing
}
