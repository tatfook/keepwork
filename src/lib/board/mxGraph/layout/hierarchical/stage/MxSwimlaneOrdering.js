import MxHierarchicalLayoutStage from './mxMedianHybridCrossingReduction'
import MxCellPath from '../../../model/MxCellPath'
import MxUtils from '../../../util/MxUtils'
/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxSwimlaneOrdering
 *
 * An implementation of the first stage of the Sugiyama layout. Straightforward
 * longest path calculation of layer assignment
 *
 * Constructor: MxSwimlaneOrdering
 *
 * Creates a cycle remover for the given internal model.
 */
export default class MxSwimlaneOrdering {
  constructor(layout) {
    this.layout = layout
  };
}

/**
 * Extends MxHierarchicalLayoutStage.
 */
MxSwimlaneOrdering.prototype = new MxHierarchicalLayoutStage()
MxSwimlaneOrdering.prototype.constructor = MxSwimlaneOrdering

/**
 * Variable: layout
 *
 * Reference to the enclosing <mxHierarchicalLayout>.
 */
MxSwimlaneOrdering.prototype.layout = null

/**
 * Function: execute
 *
 * Takes the graph detail and configuration information within the facade
 * and creates the resulting laid out graph within that facade for further
 * use.
 */
MxSwimlaneOrdering.prototype.execute = function(parent) {
  let model = this.layout.getModel()
  let seenNodes = {}
  let unseenNodes = MxUtils.clone(model.vertexMapper, null, true)

  // Perform a dfs through the internal model. If a cycle is found,
  // reverse it.
  let rootsArray = null

  if (model.roots !== null) {
    let modelRoots = model.roots
    rootsArray = []

    for (let i = 0; i < modelRoots.length; i++) {
      // let nodeId = MxCellPath.create(modelRoots[i])
      rootsArray[i] = model.vertexMapper.get(modelRoots[i])
    }
  }

  model.visit(function(parent, node, connectingEdge, layer, seen) {
    // Check if the cell is in it's own ancestor list, if so
    // invert the connecting edge and reverse the target/source
    // relationship to that edge in the parent and the cell
    // Ancestor hashes only line up within a swimlane
    let isAncestor = parent !== null && parent.swimlaneIndex === node.swimlaneIndex && node.isAncestor(parent)

    // If the source->target swimlane indices go from higher to
    // lower, the edge is reverse
    let reversedOverSwimlane = parent !== null && connectingEdge !== null && parent.swimlaneIndex < node.swimlaneIndex && connectingEdge.source === node

    if (isAncestor) {
      connectingEdge.invert()
      MxUtils.remove(connectingEdge, parent.connectsAsSource)
      node.connectsAsSource.push(connectingEdge)
      parent.connectsAsTarget.push(connectingEdge)
      MxUtils.remove(connectingEdge, node.connectsAsTarget)
    } else if (reversedOverSwimlane) {
      connectingEdge.invert()
      MxUtils.remove(connectingEdge, parent.connectsAsTarget)
      node.connectsAsTarget.push(connectingEdge)
      parent.connectsAsSource.push(connectingEdge)
      MxUtils.remove(connectingEdge, node.connectsAsSource)
    }

    let cellId = MxCellPath.create(node.cell)
    seenNodes[cellId] = node
    delete unseenNodes[cellId]
  }, rootsArray, true, null)
}
