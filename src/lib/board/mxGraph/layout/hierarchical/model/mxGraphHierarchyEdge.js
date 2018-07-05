import MxGraphAbstractHierarchyCell from './MxGraphAbstractHierarchyCell'
import mxObjectIdentity from '../../../util/mxObjectIdentity'

/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxGraphHierarchyEdge
 *
 * An abstraction of a hierarchical edge for the hierarchy layout
 *
 * Constructor: MxGraphHierarchyEdge
 *
 * Constructs a hierarchy edge
 *
 * Arguments:
 *
 * edges - a list of real graph edges this abstraction represents
 */
export default class MxGraphHierarchyEdge {
  constructor(edges) {
    MxGraphAbstractHierarchyCell.apply(this, arguments)
    this.edges = edges
    this.ids = []

    for (var i = 0; i < edges.length; i++) {
      this.ids.push(mxObjectIdentity.get(edges[i]))
    }
  };
}

/**
 * Extends MxGraphAbstractHierarchyCell.
 */
MxGraphHierarchyEdge.prototype = new MxGraphAbstractHierarchyCell()
MxGraphHierarchyEdge.prototype.constructor = MxGraphHierarchyEdge

/**
 * Variable: edges
 *
 * The graph edge(s) this object represents. Parallel edges are all grouped
 * together within one hierarchy edge.
 */
MxGraphHierarchyEdge.prototype.edges = null

/**
 * Variable: ids
 *
 * The object identities of the wrapped cells
 */
MxGraphHierarchyEdge.prototype.ids = null

/**
 * Variable: source
 *
 * The node this edge is sourced at
 */
MxGraphHierarchyEdge.prototype.source = null

/**
 * Variable: target
 *
 * The node this edge targets
 */
MxGraphHierarchyEdge.prototype.target = null

/**
 * Variable: isReversed
 *
 * Whether or not the direction of this edge has been reversed
 * internally to create a DAG for the hierarchical layout
 */
MxGraphHierarchyEdge.prototype.isReversed = false

/**
 * Function: invert
 *
 * Inverts the direction of this internal edge(s)
 */
MxGraphHierarchyEdge.prototype.invert = function(layer) {
  var temp = this.source
  this.source = this.target
  this.target = temp
  this.isReversed = !this.isReversed
}

/**
 * Function: getNextLayerConnectedCells
 *
 * Returns the cells this cell connects to on the next layer up
 */
MxGraphHierarchyEdge.prototype.getNextLayerConnectedCells = function(layer) {
  if (this.nextLayerConnectedCells === null) {
    this.nextLayerConnectedCells = []

    for (var i = 0; i < this.temp.length; i++) {
      this.nextLayerConnectedCells[i] = []

      if (i === this.temp.length - 1) {
        this.nextLayerConnectedCells[i].push(this.source)
      } else {
        this.nextLayerConnectedCells[i].push(this)
      }
    }
  }

  return this.nextLayerConnectedCells[layer - this.minRank - 1]
}

/**
 * Function: getPreviousLayerConnectedCells
 *
 * Returns the cells this cell connects to on the next layer down
 */
MxGraphHierarchyEdge.prototype.getPreviousLayerConnectedCells = function(layer) {
  if (this.previousLayerConnectedCells === null) {
    this.previousLayerConnectedCells = []

    for (var i = 0; i < this.temp.length; i++) {
      this.previousLayerConnectedCells[i] = []

      if (i === 0) {
        this.previousLayerConnectedCells[i].push(this.target)
      } else {
        this.previousLayerConnectedCells[i].push(this)
      }
    }
  }

  return this.previousLayerConnectedCells[layer - this.minRank - 1]
}

/**
 * Function: isEdge
 *
 * Returns true.
 */
MxGraphHierarchyEdge.prototype.isEdge = function() {
  return true
}

/**
 * Function: getGeneralPurposeVariable
 *
 * Gets the value of temp for the specified layer
 */
MxGraphHierarchyEdge.prototype.getGeneralPurposeVariable = function(layer) {
  return this.temp[layer - this.minRank - 1]
}

/**
 * Function: setGeneralPurposeVariable
 *
 * Set the value of temp for the specified layer
 */
MxGraphHierarchyEdge.prototype.setGeneralPurposeVariable = function(layer, value) {
  this.temp[layer - this.minRank - 1] = value
}

/**
 * Function: getCoreCell
 *
 * Gets the first core edge associated with this wrapper
 */
MxGraphHierarchyEdge.prototype.getCoreCell = function() {
  if (this.edges != null && this.edges.length > 0) {
    return this.edges[0]
  }

  return null
}
