import MxDictionary from '../../../util/MxDictionary'
import MxUtils from '../../../util/MxUtils'
import MxGraphHierarchyNode from './MxGraphHierarchyNode'
import MxGraphHierarchyEdge from './MxGraphHierarchyEdge'
import MxCellPath from '../../../model/MxCellPath'
/**
 * Copyright (c) 2006-2018, JGraph Ltd
 * Copyright (c) 2006-2018, Gaudenz Alder
 */
/**
 * Class: MxSwimlaneModel
 *
 * Internal model of a hierarchical graph. This model stores nodes and edges
 * equivalent to the real graph nodes and edges, but also stores the rank of the
 * cells, the order within the ranks and the new candidate locations of cells.
 * The internal model also reverses edge direction were appropriate , ignores
 * self-loop and groups parallels together under one edge object.
 *
 * Constructor: MxSwimlaneModel
 *
 * Creates an internal ordered graph model using the vertices passed in. If
 * there are any, leftward edge need to be inverted in the internal model
 *
 * Arguments:
 *
 * graph - the facade describing the graph to be operated on
 * vertices - the vertices for this hierarchy
 * ordered - whether or not the vertices are already ordered
 * deterministic - whether or not this layout should be deterministic on each
 * tightenToSource - whether or not to tighten vertices towards the sources
 * scanRanksFromSinks - Whether rank assignment is from the sinks or sources.
 * usage
 */
export default class MxSwimlaneModel {
  constructor(layout, vertices, roots, parent, tightenToSource) {
    // let graph = layout.getGraph()
    this.tightenToSource = tightenToSource
    this.roots = roots
    this.parent = parent

    // map of cells to internal cell needed for second run through
    // to setup the sink of edges correctly
    this.vertexMapper = new MxDictionary()
    this.edgeMapper = new MxDictionary()
    this.maxRank = 0
    let internalVertices = []

    if (vertices === null) {
      vertices = this.graph.getChildVertices(parent)
    }

    this.maxRank = this.SOURCESCANSTARTRANK
    // map of cells to internal cell needed for second run through
    // to setup the sink of edges correctly. Guess size by number
    // of edges is roughly same as number of vertices.
    this.createInternalCells(layout, vertices, internalVertices)

    // Go through edges set their sink values. Also check the
    // ordering if and invert edges if necessary
    for (let i = 0; i < vertices.length; i++) {
      let edges = internalVertices[i].connectsAsSource

      for (let j = 0; j < edges.length; j++) {
        let internalEdge = edges[j]
        let realEdges = internalEdge.edges

        // Only need to process the first real edge, since
        // all the edges connect to the same other vertex
        if (realEdges !== null && realEdges.length > 0) {
          let realEdge = realEdges[0]
          let targetCell = layout.getVisibleTerminal(
            realEdge, false)
          let internalTargetCell = this.vertexMapper.get(targetCell)

          if (internalVertices[i] === internalTargetCell) {
            // If there are parallel edges going between two vertices and not all are in the same direction
            // you can have navigated across one direction when doing the cycle reversal that isn't the same
            // direction as the first real edge in the array above. When that happens the if above catches
            // that and we correct the target cell before continuing.
            // This branch only detects this single case
            targetCell = layout.getVisibleTerminal(
              realEdge, true)
            internalTargetCell = this.vertexMapper.get(targetCell)
          }

          if (internalTargetCell !== null && internalVertices[i] !== internalTargetCell) {
            internalEdge.target = internalTargetCell

            if (internalTargetCell.connectsAsTarget.length === 0) {
              internalTargetCell.connectsAsTarget = []
            }

            if (MxUtils.indexOf(internalTargetCell.connectsAsTarget, internalEdge) < 0) {
              internalTargetCell.connectsAsTarget.push(internalEdge)
            }
          }
        }
      }

      // Use the temp letiable in the internal nodes to mark this
      // internal vertex as having been visited.
      internalVertices[i].temp[0] = 1
    }
  };
}

/**
 * Variable: maxRank
 *
 * Stores the largest rank number allocated
 */
MxSwimlaneModel.prototype.maxRank = null

/**
 * Variable: vertexMapper
 *
 * Map from graph vertices to internal model nodes.
 */
MxSwimlaneModel.prototype.vertexMapper = null

/**
 * Variable: edgeMapper
 *
 * Map from graph edges to internal model edges
 */
MxSwimlaneModel.prototype.edgeMapper = null

/**
 * Variable: ranks
 *
 * Mapping from rank number to actual rank
 */
MxSwimlaneModel.prototype.ranks = null

/**
 * Variable: roots
 *
 * Store of roots of this hierarchy model, these are real graph cells, not
 * internal cells
 */
MxSwimlaneModel.prototype.roots = null

/**
 * Variable: parent
 *
 * The parent cell whose children are being laid out
 */
MxSwimlaneModel.prototype.parent = null

/**
 * Variable: dfsCount
 *
 * Count of the number of times the ancestor dfs has been used.
 */
MxSwimlaneModel.prototype.dfsCount = 0

/**
 * Variable: SOURCESCANSTARTRANK
 *
 * High value to start source layering scan rank value from.
 */
MxSwimlaneModel.prototype.SOURCESCANSTARTRANK = 100000000

/**
 * Variable: tightenToSource
 *
 * Whether or not to tighten the assigned ranks of vertices up towards
 * the source cells.
 */
MxSwimlaneModel.prototype.tightenToSource = false

/**
 * Variable: ranksPerGroup
 *
 * An array of the number of ranks within each swimlane
 */
MxSwimlaneModel.prototype.ranksPerGroup = null

/**
 * Function: createInternalCells
 *
 * Creates all edges in the internal model
 *
 * Parameters:
 *
 * layout - Reference to the <mxHierarchicalLayout> algorithm.
 * vertices - Array of <mxCells> that represent the vertices whom are to
 * have an internal representation created.
 * internalVertices - The array of <MxGraphHierarchyNodes> to have their
 * information filled in using the real vertices.
 */
MxSwimlaneModel.prototype.createInternalCells = function(layout, vertices, internalVertices) {
  let graph = layout.getGraph()
  let swimlanes = layout.swimlanes

  // Create internal edges
  for (let i = 0; i < vertices.length; i++) {
    internalVertices[i] = new MxGraphHierarchyNode(vertices[i])
    this.vertexMapper.put(vertices[i], internalVertices[i])
    internalVertices[i].swimlaneIndex = -1

    for (let ii = 0; ii < swimlanes.length; ii++) {
      if (graph.model.getParent(vertices[i]) === swimlanes[ii]) {
        internalVertices[i].swimlaneIndex = ii
        break
      }
    }

    // If the layout is deterministic, order the cells
    // List outgoingCells = graph.getNeighbours(vertices[i], deterministic);
    let conns = layout.getEdges(vertices[i])
    internalVertices[i].connectsAsSource = []

    // Create internal edges, but don't do any rank assignment yet
    // First use the information from the greedy cycle remover to
    // invert the leftward edges internally
    for (let j = 0; j < conns.length; j++) {
      let cell = layout.getVisibleTerminal(conns[j], false)

      // Looking for outgoing edges only
      if (cell !== vertices[i] && layout.graph.model.isVertex(cell) && !layout.isVertexIgnored(cell)) {
        // We process all edge between this source and its targets
        // If there are edges going both ways, we need to collect
        // them all into one internal edges to avoid looping problems
        // later. We assume this direction (source -> target) is the
        // natural direction if at least half the edges are going in
        // that direction.

        // The check below for edges[0] being in the vertex mapper is
        // in case we've processed this the other way around
        // (target -> source) and the number of edges in each direction
        // are the same. All the graph edges will have been assigned to
        // an internal edge going the other way, so we don't want to
        // process them again
        let undirectedEdges = layout.getEdgesBetween(vertices[i],
          cell, false)
        let directedEdges = layout.getEdgesBetween(vertices[i],
          cell, true)

        if (undirectedEdges !== null && undirectedEdges.length > 0 && this.edgeMapper.get(undirectedEdges[0]) === null && directedEdges.length * 2 >= undirectedEdges.length) {
          let internalEdge = new MxGraphHierarchyEdge(undirectedEdges)

          for (let k = 0; k < undirectedEdges.length; k++) {
            let edge = undirectedEdges[k]
            this.edgeMapper.put(edge, internalEdge)

            // Resets all point on the edge and disables the edge style
            // without deleting it from the cell style
            graph.resetEdge(edge)

            if (layout.disableEdgeStyle) {
              layout.setEdgeStyleEnabled(edge, false)
              layout.setOrthogonalEdge(edge, true)
            }
          }

          internalEdge.source = internalVertices[i]

          if (MxUtils.indexOf(internalVertices[i].connectsAsSource, internalEdge) < 0) {
            internalVertices[i].connectsAsSource.push(internalEdge)
          }
        }
      }
    }

    // Ensure temp letiable is cleared from any previous use
    internalVertices[i].temp[0] = 0
  }
}

/**
 * Function: initialRank
 *
 * Basic determination of minimum layer ranking by working from from sources
 * or sinks and working through each node in the relevant edge direction.
 * Starting at the sinks is basically a longest path layering algorithm.
*/
MxSwimlaneModel.prototype.initialRank = function() {
  this.ranksPerGroup = []

  let startNodes = []
  let seen = {}

  if (this.roots !== null) {
    for (let i = 0; i < this.roots.length; i++) {
      let internalNode = this.vertexMapper.get(this.roots[i])
      this.maxChainDfs(null, internalNode, null, seen, 0)

      if (internalNode !== null) {
        startNodes.push(internalNode)
      }
    }
  }

  // Calculate the lower and upper rank bounds of each swimlane
  let lowerRank = []
  let upperRank = []

  for (let i = this.ranksPerGroup.length - 1; i >= 0; i--) {
    if (i === this.ranksPerGroup.length - 1) {
      lowerRank[i] = 0
    } else {
      lowerRank[i] = upperRank[i + 1] + 1
    }

    upperRank[i] = lowerRank[i] + this.ranksPerGroup[i]
  }

  this.maxRank = upperRank[0]

  let internalNodes = this.vertexMapper.getValues()

  for (let i = 0; i < internalNodes.length; i++) {
    // Mark the node as not having had a layer assigned
    internalNodes[i].temp[0] = -1
  }

  // let startNodesCopy = startNodes.slice()

  while (startNodes.length > 0) {
    let internalNode = startNodes[0]
    let layerDeterminingEdges
    let edgesToBeMarked

    layerDeterminingEdges = internalNode.connectsAsTarget
    edgesToBeMarked = internalNode.connectsAsSource

    // flag to keep track of whether or not all layer determining
    // edges have been scanned
    let allEdgesScanned = true

    // Work out the layer of this node from the layer determining
    // edges. The minimum layer number of any node connected by one of
    // the layer determining edges letiable
    let minimumLayer = upperRank[0]

    for (let i = 0; i < layerDeterminingEdges.length; i++) {
      let internalEdge = layerDeterminingEdges[i]

      if (internalEdge.temp[0] === 5270620) {
        // This edge has been scanned, get the layer of the
        // node on the other end
        let otherNode = internalEdge.source
        minimumLayer = Math.min(minimumLayer, otherNode.temp[0] - 1)
      } else {
        allEdgesScanned = false

        break
      }
    }

    // If all edge have been scanned, assign the layer, mark all
    // edges in the other direction and remove from the nodes list
    if (allEdgesScanned) {
      if (minimumLayer > upperRank[internalNode.swimlaneIndex]) {
        minimumLayer = upperRank[internalNode.swimlaneIndex]
      }

      internalNode.temp[0] = minimumLayer

      if (edgesToBeMarked !== null) {
        for (let i = 0; i < edgesToBeMarked.length; i++) {
          let internalEdge = edgesToBeMarked[i]

          // Assign unique stamp ( y/m/d/h )
          internalEdge.temp[0] = 5270620

          // Add node on other end of edge to LinkedList of
          // nodes to be analysed
          let otherNode = internalEdge.target

          // Only add node if it hasn't been assigned a layer
          if (otherNode.temp[0] === -1) {
            startNodes.push(otherNode)

            // Mark this other node as neither being
            // unassigned nor assigned so it isn't
            // added to this list again, but it's
            // layer isn't used in any calculation.
            otherNode.temp[0] = -2
          }
        }
      }

      startNodes.shift()
    } else {
      // Not all the edges have been scanned, get to the back of
      // the class and put the dunces cap on
      let removedCell = startNodes.shift()
      startNodes.push(internalNode)

      if (removedCell === internalNode && startNodes.length === 1) {
        // This is an error condition, we can't get out of
        // this loop. It could happen for more than one node
        // but that's a lot harder to detect. Log the error
        // TODO make log comment
        break
      }
    }
  }

  // Normalize the ranks down from their large starting value to place
  // at least 1 sink on layer 0
  // for (let key in this.vertexMapper)
  // {
  // let internalNode = this.vertexMapper[key];
  // // Mark the node as not having had a layer assigned
  // internalNode.temp[0] -= this.maxRank;
  // }

  // Tighten the rank 0 nodes as far as possible
  // for ( let i = 0; i < startNodesCopy.length; i++)
  // {
  // let internalNode = startNodesCopy[i];
  // let currentMaxLayer = 0;
  // let layerDeterminingEdges = internalNode.connectsAsSource;
  //
  // for ( let j = 0; j < layerDeterminingEdges.length; j++)
  // {
  // let internalEdge = layerDeterminingEdges[j];
  // let otherNode = internalEdge.target;
  // internalNode.temp[0] = Math.max(currentMaxLayer,
  // otherNode.temp[0] + 1);
  // currentMaxLayer = internalNode.temp[0];
  // }
  // }
}

/**
 * Function: maxChainDfs
 *
 * Performs a depth first search on the internal hierarchy model. This dfs
 * extends the default version by keeping track of chains within groups.
 * Any cycles should be removed prior to running, but previously seen cells
 * are ignored.
 *
 * Parameters:
 *
 * parent - the parent internal node of the current internal node
 * root - the current internal node
 * connectingEdge - the internal edge connecting the internal node and the parent
 * internal node, if any
 * seen - a set of all nodes seen by this dfs
 * chainCount - the number of edges in the chain of vertices going through
 * the current swimlane
 */
MxSwimlaneModel.prototype.maxChainDfs = function(parent, root, connectingEdge, seen, chainCount) {
  if (root !== null) {
    let rootId = MxCellPath.create(root.cell)

    if (seen[rootId] === null) {
      seen[rootId] = root
      let slIndex = root.swimlaneIndex

      if (this.ranksPerGroup[slIndex] === null || this.ranksPerGroup[slIndex] < chainCount) {
        this.ranksPerGroup[slIndex] = chainCount
      }

      // Copy the connects as source list so that visitors
      // can change the original for edge direction inversions
      let outgoingEdges = root.connectsAsSource.slice()

      for (let i = 0; i < outgoingEdges.length; i++) {
        let internalEdge = outgoingEdges[i]
        let targetNode = internalEdge.target

        // Only navigate in source->target direction within the same
        // swimlane, or from a lower index swimlane to a higher one
        if (root.swimlaneIndex < targetNode.swimlaneIndex) {
          this.maxChainDfs(root, targetNode, internalEdge, MxUtils.clone(seen, null, true), 0)
        } else if (root.swimlaneIndex === targetNode.swimlaneIndex) {
          this.maxChainDfs(root, targetNode, internalEdge, MxUtils.clone(seen, null, true), chainCount + 1)
        }
      }
    }
  }
}

/**
 * Function: fixRanks
 *
 * Fixes the layer assignments to the values stored in the nodes. Also needs
 * to create dummy nodes for edges that cross layers.
 */
MxSwimlaneModel.prototype.fixRanks = function() {
  let rankList = []
  this.ranks = []

  for (let i = 0; i < this.maxRank + 1; i++) {
    rankList[i] = []
    this.ranks[i] = rankList[i]
  }

  // Perform a DFS to obtain an initial ordering for each rank.
  // Without doing this you would end up having to process
  // crossings for a standard tree.
  let rootsArray = null

  if (this.roots !== null) {
    let oldRootsArray = this.roots
    rootsArray = []

    for (let i = 0; i < oldRootsArray.length; i++) {
      let cell = oldRootsArray[i]
      let internalNode = this.vertexMapper.get(cell)
      rootsArray[i] = internalNode
    }
  }

  this.visit(function(parent, node, edge, layer, seen) {
    if (seen === 0 && node.maxRank < 0 && node.minRank < 0) {
      rankList[node.temp[0]].push(node)
      node.maxRank = node.temp[0]
      node.minRank = node.temp[0]

      // Set temp[0] to the nodes position in the rank
      node.temp[0] = rankList[node.maxRank].length - 1
    }

    if (parent !== null && edge !== null) {
      let parentToCellRankDifference = parent.maxRank - node.maxRank

      if (parentToCellRankDifference > 1) {
        // There are ranks in between the parent and current cell
        edge.maxRank = parent.maxRank
        edge.minRank = node.maxRank
        edge.temp = []
        edge.x = []
        edge.y = []

        for (let i = edge.minRank + 1; i < edge.maxRank; i++) {
          // The connecting edge must be added to the
          // appropriate ranks
          rankList[i].push(edge)
          edge.setGeneralPurposeVariable(i, rankList[i]
            .length - 1)
        }
      }
    }
  }, rootsArray, false, null)
}

/**
 * Function: visit
 *
 * A depth first search through the internal heirarchy model.
 *
 * Parameters:
 *
 * visitor - The visitor function pattern to be called for each node.
 * trackAncestors - Whether or not the search is to keep track all nodes
 * directly above this one in the search path.
 */
MxSwimlaneModel.prototype.visit = function(visitor, dfsRoots, trackAncestors, seenNodes) {
  // Run dfs through on all roots
  if (dfsRoots !== null) {
    for (let i = 0; i < dfsRoots.length; i++) {
      let internalNode = dfsRoots[i]

      if (internalNode !== null) {
        if (seenNodes === null) {
          seenNodes = {}
        }

        if (trackAncestors) {
          // Set up hash code for root
          internalNode.hashCode = []
          internalNode.hashCode[0] = this.dfsCount
          internalNode.hashCode[1] = i
          this.extendedDfs(null, internalNode, null, visitor, seenNodes,
            internalNode.hashCode, i, 0)
        } else {
          this.dfs(null, internalNode, null, visitor, seenNodes, 0)
        }
      }
    }

    this.dfsCount++
  }
}

/**
 * Function: dfs
 *
 * Performs a depth first search on the internal hierarchy model
 *
 * Parameters:
 *
 * parent - the parent internal node of the current internal node
 * root - the current internal node
 * connectingEdge - the internal edge connecting the internal node and the parent
 * internal node, if any
 * visitor - the visitor pattern to be called for each node
 * seen - a set of all nodes seen by this dfs a set of all of the
 * ancestor node of the current node
 * layer - the layer on the dfs tree ( not the same as the model ranks )
 */
MxSwimlaneModel.prototype.dfs = function(parent, root, connectingEdge, visitor, seen, layer) {
  if (root !== null) {
    let rootId = root.id

    if (seen[rootId] === null) {
      seen[rootId] = root
      visitor(parent, root, connectingEdge, layer, 0)

      // Copy the connects as source list so that visitors
      // can change the original for edge direction inversions
      let outgoingEdges = root.connectsAsSource.slice()

      for (let i = 0; i < outgoingEdges.length; i++) {
        let internalEdge = outgoingEdges[i]
        let targetNode = internalEdge.target

        // Root check is O(|roots|)
        this.dfs(root, targetNode, internalEdge, visitor, seen,
          layer + 1)
      }
    } else {
      // Use the int field to indicate this node has been seen
      visitor(parent, root, connectingEdge, layer, 1)
    }
  }
}

/**
 * Function: extendedDfs
 *
 * Performs a depth first search on the internal hierarchy model. This dfs
 * extends the default version by keeping track of cells ancestors, but it
 * should be only used when necessary because of it can be computationally
 * intensive for deep searches.
 *
 * Parameters:
 *
 * parent - the parent internal node of the current internal node
 * root - the current internal node
 * connectingEdge - the internal edge connecting the internal node and the parent
 * internal node, if any
 * visitor - the visitor pattern to be called for each node
 * seen - a set of all nodes seen by this dfs
 * ancestors - the parent hash code
 * childHash - the new hash code for this node
 * layer - the layer on the dfs tree ( not the same as the model ranks )
 */
MxSwimlaneModel.prototype.extendedDfs = function(parent, root, connectingEdge, visitor, seen, ancestors, childHash, layer) {
  // Explanation of custom hash set. Previously, the ancestors letiable
  // was passed through the dfs as a HashSet. The ancestors were copied
  // into a new HashSet and when the new child was processed it was also
  // added to the set. If the current node was in its ancestor list it
  // meant there is a cycle in the graph and this information is passed
  // to the visitor.visit() in the seen parameter. The HashSet clone was
  // very expensive on CPU so a custom hash was developed using primitive
  // types. temp[] couldn't be used so hashCode[] was added to each node.
  // Each new child adds another int to the array, copying the prefix
  // from its parent. Child of the same parent add different ints (the
  // limit is therefore 2^32 children per parent...). If a node has a
  // child with the hashCode already set then the child code is compared
  // to the same portion of the current nodes array. If they match there
  // is a loop.
  // Note that the basic mechanism would only allow for 1 use of this
  // functionality, so the root nodes have two ints. The second int is
  // incremented through each node root and the first is incremented
  // through each run of the dfs algorithm (therefore the dfs is not
  // thread safe). The hash code of each node is set if not already set,
  // or if the first int does not match that of the current run.
  if (root !== null) {
    if (parent !== null) {
      // Form this nodes hash code if necessary, that is, if the
      // hashCode letiable has not been initialized or if the
      // start of the parent hash code does not equal the start of
      // this nodes hash code, indicating the code was set on a
      // previous run of this dfs.
      if (root.hashCode === null || root.hashCode[0] !== parent.hashCode[0]) {
        let hashCodeLength = parent.hashCode.length + 1
        root.hashCode = parent.hashCode.slice()
        root.hashCode[hashCodeLength - 1] = childHash
      }
    }

    let rootId = root.id

    if (seen[rootId] === null) {
      seen[rootId] = root
      visitor(parent, root, connectingEdge, layer, 0)

      // Copy the connects as source list so that visitors
      // can change the original for edge direction inversions
      let outgoingEdges = root.connectsAsSource.slice()
      let incomingEdges = root.connectsAsTarget.slice()

      for (let i = 0; i < outgoingEdges.length; i++) {
        let internalEdge = outgoingEdges[i]
        let targetNode = internalEdge.target

        // Only navigate in source->target direction within the same
        // swimlane, or from a lower index swimlane to a higher one
        if (root.swimlaneIndex <= targetNode.swimlaneIndex) {
          this.extendedDfs(root, targetNode, internalEdge, visitor, seen,
            root.hashCode, i, layer + 1)
        }
      }

      for (let i = 0; i < incomingEdges.length; i++) {
        let internalEdge = incomingEdges[i]
        let targetNode = internalEdge.source

        // Only navigate in target->source direction from a lower index
        // swimlane to a higher one
        if (root.swimlaneIndex < targetNode.swimlaneIndex) {
          this.extendedDfs(root, targetNode, internalEdge, visitor, seen,
            root.hashCode, i, layer + 1)
        }
      }
    } else {
      // Use the int field to indicate this node has been seen
      visitor(parent, root, connectingEdge, layer, 1)
    }
  }
}
