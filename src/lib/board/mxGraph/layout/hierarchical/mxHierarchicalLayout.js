import MxGraphLayout from '../MxGraphLayout'
import MxConstants from '../../util/MxConstants'
import MxDictionary from '../../util/MxDictionary'
import MxGraphHierarchyModel from './model/MxGraphHierarchyModel'
import MxObjectIdentity from '../../util/MxObjectIdentity'
import MxMedianHybridCrossingReduction from './stage/MxMedianHybridCrossingReduction'
import MxMinimumCycleRemover from './stage/MxMinimumCycleRemover'
import MxCoordinateAssignment from './stage/MxCoordinateAssignment'
/**
 * Copyright (c) 2006-2018, JGraph Ltd
 * Copyright (c) 2006-2018, Gaudenz Alder
 */
/**
 * Class: MxHierarchicalLayout
 *
 * A hierarchical layout algorithm.
 *
 * Constructor: MxHierarchicalLayout
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
export default class MxHierarchicalLayout {
  constructor(graph, orientation, deterministic) {
    MxGraphLayout.call(this, graph)
    this.orientation = (orientation !== null) ? orientation : MxConstants.DIRECTION_NORTH
    this.deterministic = (deterministic !== null) ? deterministic : true
  };
}

export let MxHierarchicalEdgeStyle =
{
  ORTHOGONAL: 1,
  POLYLINE: 2,
  STRAIGHT: 3,
  CURVE: 4
}
/**
 * Extends MxGraphLayout.
 */
MxHierarchicalLayout.prototype = new MxGraphLayout()
MxHierarchicalLayout.prototype.constructor = MxHierarchicalLayout

/**
 * Variable: roots
 *
 * Holds the array of <mxCell> that this layout contains.
 */
MxHierarchicalLayout.prototype.roots = null

/**
 * Variable: resizeParent
 *
 * Specifies if the parent should be resized after the layout so that it
 * contains all the child cells. Default is false. See also <parentBorder>.
 */
MxHierarchicalLayout.prototype.resizeParent = false

/**
 * Variable: maintainParentLocation
 *
 * Specifies if the parent location should be maintained, so that the
 * top, left corner stays the same before and after execution of
 * the layout. Default is false for backwards compatibility.
 */
MxHierarchicalLayout.prototype.maintainParentLocation = false

/**
 * Variable: moveParent
 *
 * Specifies if the parent should be moved if <resizeParent> is enabled.
 * Default is false.
 */
MxHierarchicalLayout.prototype.moveParent = false

/**
 * Variable: parentBorder
 *
 * The border to be added around the children if the parent is to be
 * resized using <resizeParent>. Default is 0.
 */
MxHierarchicalLayout.prototype.parentBorder = 0

/**
 * Variable: intraCellSpacing
 *
 * The spacing buffer added between cells on the same layer. Default is 30.
 */
MxHierarchicalLayout.prototype.intraCellSpacing = 30

/**
 * Variable: interRankCellSpacing
 *
 * The spacing buffer added between cell on adjacent layers. Default is 50.
 */
MxHierarchicalLayout.prototype.interRankCellSpacing = 100

/**
 * Variable: interHierarchySpacing
 *
 * The spacing buffer between unconnected hierarchies. Default is 60.
 */
MxHierarchicalLayout.prototype.interHierarchySpacing = 60

/**
 * Variable: parallelEdgeSpacing
 *
 * The distance between each parallel edge on each ranks for long edges
 */
MxHierarchicalLayout.prototype.parallelEdgeSpacing = 10

/**
 * Variable: orientation
 *
 * The position of the root node(s) relative to the laid out graph in.
 * Default is <MxConstants.DIRECTION_NORTH>.
 */
MxHierarchicalLayout.prototype.orientation = MxConstants.DIRECTION_NORTH

/**
 * Variable: fineTuning
 *
 * Whether or not to perform local optimisations and iterate multiple times
 * through the algorithm. Default is true.
 */
MxHierarchicalLayout.prototype.fineTuning = true

/**
 *
 * Variable: tightenToSource
 *
 * Whether or not to tighten the assigned ranks of vertices up towards
 * the source cells.
 */
MxHierarchicalLayout.prototype.tightenToSource = true

/**
 * Variable: disableEdgeStyle
 *
 * Specifies if the STYLE_NOEDGESTYLE flag should be set on edges that are
 * modified by the result. Default is true.
 */
MxHierarchicalLayout.prototype.disableEdgeStyle = true

/**
 * Variable: traverseAncestors
 *
 * Whether or not to drill into child cells and layout in reverse
 * group order. This also cause the layout to navigate edges whose
 * terminal vertices have different parents but are in the same
 * ancestry chain
 */
MxHierarchicalLayout.prototype.traverseAncestors = true

/**
 * Variable: model
 *
 * The internal <MxGraphHierarchyModel> formed of the layout.
 */
MxHierarchicalLayout.prototype.model = null

/**
 * Variable: edgesSet
 *
 * A cache of edges whose source terminal is the key
 */
MxHierarchicalLayout.prototype.edgesCache = null

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
 * Returns the internal <MxGraphHierarchyModel> for this layout algorithm.
 */
MxHierarchicalLayout.prototype.getModel = function() {
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
 * roots - Optional starting roots of the layout.
 */
MxHierarchicalLayout.prototype.execute = function(parent, roots) {
  this.parent = parent
  let model = this.graph.model
  this.edgesCache = new MxDictionary()
  this.edgeSourceTermCache = new MxDictionary()
  this.edgesTargetTermCache = new MxDictionary()

  if (roots !== null && !(roots instanceof Array)) {
    roots = [roots]
  }

  // If the roots are set and the parent is set, only
  // use the roots that are some dependent of the that
  // parent.
  // If just the root are set, use them as-is
  // If just the parent is set use it's immediate
  // children as the initial set

  if (roots === null && parent === null) {
    // TODO indicate the problem
    return
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

  if (roots !== null) {
    let rootsCopy = []

    for (let i = 0; i < roots.length; i++) {
      let ancestor = parent !== null ? model.isAncestor(parent, roots[i]) : true

      if (ancestor && model.isVertex(roots[i])) {
        rootsCopy.push(roots[i])
      }
    }

    this.roots = rootsCopy
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
  } finally {
    model.endUpdate()
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
MxHierarchicalLayout.prototype.findRoots = function(parent, vertices) {
  let roots = []

  if (parent !== null && vertices !== null) {
    let model = this.graph.model
    let best = null
    let maxDiff = -100000

    for (let i in vertices) {
      let cell = vertices[i]

      if (model.isVertex(cell) && this.graph.isCellVisible(cell)) {
        let conns = this.getEdges(cell)
        let fanOut = 0
        let fanIn = 0

        for (let k = 0; k < conns.length; k++) {
          let src = this.getVisibleTerminal(conns[k], true)

          if (src === cell) {
            fanOut++
          } else {
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
MxHierarchicalLayout.prototype.getEdges = function(cell) {
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

    if ((source === target) || ((source !== target) && ((target === cell && (this.parent === null || this.isAncestor(this.parent, source, this.traverseAncestors))) || (source === cell && (this.parent === null || this.isAncestor(this.parent, target, this.traverseAncestors)))))) {
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
MxHierarchicalLayout.prototype.getVisibleTerminal = function(edge, source) {
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
MxHierarchicalLayout.prototype.run = function(parent) {
  // Separate out unconnected hierarchies
  let hierarchyVertices = []
  let allVertexSet = []

  if (this.roots === null && parent !== null) {
    let filledVertexSet = Object()
    this.filterDescendants(parent, filledVertexSet)

    this.roots = []
    let filledVertexSetEmpty = true

    // Poor man's isSetEmpty
    for (let key in filledVertexSet) {
      if (filledVertexSet[key] !== null) {
        filledVertexSetEmpty = false
        break
      }
    }

    while (!filledVertexSetEmpty) {
      let candidateRoots = this.findRoots(parent, filledVertexSet)

      // If the candidate root is an unconnected group cell, remove it from
      // the layout. We may need a custom set that holds such groups and forces
      // them to be processed for resizing and/or moving.

      for (let i = 0; i < candidateRoots.length; i++) {
        let vertexSet = Object()
        hierarchyVertices.push(vertexSet)

        this.traverse(candidateRoots[i], true, null, allVertexSet, vertexSet,
          hierarchyVertices, filledVertexSet)
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

  // Iterate through the result removing parents who have children in this layout

  // Perform a layout for each seperate hierarchy
  // Track initial coordinate x-positioning
  let initialX = 0

  for (let i = 0; i < hierarchyVertices.length; i++) {
    let vertexSet = hierarchyVertices[i]
    let tmp = []

    for (let key in vertexSet) {
      tmp.push(vertexSet[key])
    }

    this.model = new MxGraphHierarchyModel(this, tmp, this.roots,
      parent, this.tightenToSource)

    this.cycleStage(parent)
    this.layeringStage()

    this.crossingStage(parent)
    initialX = this.placementStage(initialX, parent)
  }
}

/**
 * Function: filterDescendants
 *
 * Creates an array of descendant cells
 */
MxHierarchicalLayout.prototype.filterDescendants = function(cell, result) {
  let model = this.graph.model

  if (model.isVertex(cell) && cell !== this.parent && this.graph.isCellVisible(cell)) {
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
MxHierarchicalLayout.prototype.isPort = function(cell) {
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
MxHierarchicalLayout.prototype.getEdgesBetween = function(source, target, directed) {
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
 */
MxHierarchicalLayout.prototype.traverse = function(vertex, directed, edge, allVertices, currentComp,
  hierarchyVertices, filledVertexSet) {
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
      let edgeIsSource = []

      for (let i = 0; i < edges.length; i++) {
        edgeIsSource[i] = (this.getVisibleTerminal(edges[i], true) === vertex)
      }

      for (let i = 0; i < edges.length; i++) {
        if (!directed || edgeIsSource[i]) {
          let next = this.getVisibleTerminal(edges[i], !edgeIsSource[i])

          // Check whether there are more edges incoming from the target vertex than outgoing
          // The hierarchical model treats bi-directional parallel edges as being sourced
          // from the more "sourced" terminal. If the directions are equal in number, the direction
          // is that of the natural direction from the roots of the layout.
          // The checks below are slightly more verbose than need be for performance reasons
          let netCount = 1

          for (let j = 0; j < edges.length; j++) {
            if (j === i) {
              continue
            } else {
              let isSource2 = edgeIsSource[j]
              let otherTerm = this.getVisibleTerminal(edges[j], !isSource2)

              if (otherTerm === next) {
                if (isSource2) {
                  netCount++
                } else {
                  netCount--
                }
              }
            }
          }

          if (netCount >= 0) {
            currentComp = this.traverse(next, directed, edges[i], allVertices,
              currentComp, hierarchyVertices,
              filledVertexSet)
          }
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
 * Executes the cycle stage using MxMinimumCycleRemover.
 */
MxHierarchicalLayout.prototype.cycleStage = function(parent) {
  let cycleStage = new MxMinimumCycleRemover(this)
  cycleStage.execute(parent)
}

/**
 * Function: layeringStage
 *
 * Implements first stage of a Sugiyama layout.
 */
MxHierarchicalLayout.prototype.layeringStage = function() {
  this.model.initialRank()
  this.model.fixRanks()
}

/**
 * Function: crossingStage
 *
 * Executes the crossing stage using MxMedianHybridCrossingReduction.
 */
MxHierarchicalLayout.prototype.crossingStage = function(parent) {
  let crossingStage = new MxMedianHybridCrossingReduction(this)
  crossingStage.execute(parent)
}

/**
 * Function: placementStage
 *
 * Executes the placement stage using MxCoordinateAssignment.
 */
MxHierarchicalLayout.prototype.placementStage = function(initialX, parent) {
  let placementStage = new MxCoordinateAssignment(this, this.intraCellSpacing,
    this.interRankCellSpacing, this.orientation, initialX,
    this.parallelEdgeSpacing)
  placementStage.fineTuning = this.fineTuning
  placementStage.execute(parent)

  return placementStage.limitX + this.interHierarchySpacing
}
