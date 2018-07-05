import MxHierarchicalLayoutStage from './MxHierarchicalLayoutStage'
import MxUtils from '../../../util/MxUtils'
/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxMinimumCycleRemover
 *
 * An implementation of the first stage of the Sugiyama layout. Straightforward
 * longest path calculation of layer assignment
 *
 * Constructor: MxMinimumCycleRemover
 *
 * Creates a cycle remover for the given internal model.
 */
export default class MxMinimumCycleRemover {
  constructor(layout) {
    this.layout = layout
  };
}

/**
 * Extends MxHierarchicalLayoutStage.
 */
MxMinimumCycleRemover.prototype = new MxHierarchicalLayoutStage()
MxMinimumCycleRemover.prototype.constructor = MxMinimumCycleRemover

/**
 * Variable: layout
 *
 * Reference to the enclosing <mxHierarchicalLayout>.
 */
MxMinimumCycleRemover.prototype.layout = null

/**
 * Function: execute
 *
 * Takes the graph detail and configuration information within the facade
 * and creates the resulting laid out graph within that facade for further
 * use.
 */
MxMinimumCycleRemover.prototype.execute = function(parent) {
  let model = this.layout.getModel()
  let seenNodes = {}
  let unseenNodesArray = model.vertexMapper.getValues()
  let unseenNodes = {}

  for (let i = 0; i < unseenNodesArray.length; i++) {
    unseenNodes[unseenNodesArray[i].id] = unseenNodesArray[i]
  }

  // Perform a dfs through the internal model. If a cycle is found,
  // reverse it.
  let rootsArray = null

  if (model.roots !== null) {
    let modelRoots = model.roots
    rootsArray = []

    for (let i = 0; i < modelRoots.length; i++) {
      rootsArray[i] = model.vertexMapper.get(modelRoots[i])
    }
  }

  model.visit(function(parent, node, connectingEdge, layer, seen) {
    // Check if the cell is in it's own ancestor list, if so
    // invert the connecting edge and reverse the target/source
    // relationship to that edge in the parent and the cell
    if (node.isAncestor(parent)) {
      connectingEdge.invert()
      MxUtils.remove(connectingEdge, parent.connectsAsSource)
      parent.connectsAsTarget.push(connectingEdge)
      MxUtils.remove(connectingEdge, node.connectsAsTarget)
      node.connectsAsSource.push(connectingEdge)
    }

    seenNodes[node.id] = node
    delete unseenNodes[node.id]
  }, rootsArray, true, null)

  // If there are any nodes that should be nodes that the dfs can miss
  // these need to be processed with the dfs and the roots assigned
  // correctly to form a correct internal model
  let seenNodesCopy = MxUtils.clone(seenNodes, null, true)

  // Pick a random cell and dfs from it
  model.visit(function(parent, node, connectingEdge, layer, seen) {
    // Check if the cell is in it's own ancestor list, if so
    // invert the connecting edge and reverse the target/source
    // relationship to that edge in the parent and the cell
    if (node.isAncestor(parent)) {
      connectingEdge.invert()
      MxUtils.remove(connectingEdge, parent.connectsAsSource)
      node.connectsAsSource.push(connectingEdge)
      parent.connectsAsTarget.push(connectingEdge)
      MxUtils.remove(connectingEdge, node.connectsAsTarget)
    }

    seenNodes[node.id] = node
    delete unseenNodes[node.id]
  }, unseenNodes, true, seenNodesCopy)
}
