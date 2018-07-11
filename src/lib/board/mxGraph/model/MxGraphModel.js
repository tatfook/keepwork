import MxEventSource from '../util/MxEventSource'
import MxCell from './MxCell'
import MxUtils from '../util/MxUtils'
import MxPoint from '../util/MxPoint'
import MxCellPath from './MxCellPath'
import MxDictionary from '../util/MxDictionary'
import mxObjectIdentity from '../util/mxObjectIdentity'
import MxEventObject from '../util/MxEventObject'
import MxEvent from '../util/MxEvent'
import MxUndoableEdit from '../util/MxUndoableEdit'
/**
 * Copyright (c) 2006-2018, JGraph Ltd
 * Copyright (c) 2006-2018, Gaudenz Alder
 */
/**
 * Class: MxGraphModel
 *
 * Extends <MxEventSource> to implement a graph model. The graph model acts as
 * a wrapper around the cells which are in charge of storing the actual graph
 * datastructure. The model acts as a transactional wrapper with event
 * notification for all changes, whereas the cells contain the atomic
 * operations for updating the actual datastructure.
 *
 * Layers:
 *
 * The cell hierarchy in the model must have a top-level root cell which
 * contains the layers (typically one default layer), which in turn contain the
 * top-level cells of the layers. This means each cell is contained in a layer.
 * If no layers are required, then all new cells should be added to the default
 * layer.
 *
 * Layers are useful for hiding and showing groups of cells, or for placing
 * groups of cells on top of other cells in the display. To identify a layer,
 * the <isLayer> function is used. It returns true if the parent of the given
 * cell is the root of the model.
 *
 * Events:
 *
 * See events section for more details. There is a new set of events for
 * tracking transactional changes as they happen. The events are called
 * startEdit for the initial beginUpdate, executed for each executed change
 * and endEdit for the terminal endUpdate. The executed event contains a
 * property called change which represents the change after execution.
 *
 * Encoding the model:
 *
 * To encode a graph model, use the following code:
 *
 * (code)
 * let enc = new mxCodec();
 * let node = enc.encode(graph.getModel());
 * (end)
 *
 * This will create an XML node that contains all the model information.
 *
 * Encoding and decoding changes:
 *
 * For the encoding of changes, a graph model listener is required that encodes
 * each change from the given array of changes.
 *
 * (code)
 * model.addListener(MxEvent.CHANGE, function(sender, evt)
 * {
 *   let changes = evt.getProperty('edit').changes;
 *   let nodes = [];
 *   let codec = new mxCodec();
 *
 *   for (let i = 0; i < changes.length; i++)
 *   {
 *     nodes.push(codec.encode(changes[i]));
 *   }
 *   // do something with the nodes
 * });
 * (end)
 *
 * For the decoding and execution of changes, the codec needs a lookup function
 * that allows it to resolve cell IDs as follows:
 *
 * (code)
 * let codec = new mxCodec();
 * codec.lookup = function(id)
 * {
 *   return model.getCell(id);
 * }
 * (end)
 *
 * For each encoded change (represented by a node), the following code can be
 * used to carry out the decoding and create a change object.
 *
 * (code)
 * let changes = [];
 * let change = codec.decode(node);
 * change.model = model;
 * change.execute();
 * changes.push(change);
 * (end)
 *
 * The changes can then be dispatched using the model as follows.
 *
 * (code)
 * let edit = new MxUndoableEdit(model, false);
 * edit.changes = changes;
 *
 * edit.notify = function()
 * {
 *   edit.source.fireEvent(new MxEventObject(MxEvent.CHANGE, 'edit', edit, 'changes', edit.changes));
 *   edit.source.fireEvent(new MxEventObject(MxEvent.NOTIFY, 'edit', edit, 'changes', edit.changes));
 * }
 *
 * model.fireEvent(new MxEventObject(MxEvent.UNDO, 'edit', edit));
 * model.fireEvent(new MxEventObject(MxEvent.CHANGE, 'edit', edit, 'changes', changes));
 * (end)
 *
 * Event: MxEvent.CHANGE
 *
 * Fires when an undoable edit is dispatched. The <code>edit</code> property
 * contains the <MxUndoableEdit>. The <code>changes</code> property contains
 * the array of atomic changes inside the undoable edit. The changes property
 * is <strong>deprecated</strong>, please use edit.changes instead.
 *
 * Example:
 *
 * For finding newly inserted cells, the following code can be used:
 *
 * (code)
 * graph.model.addListener(MxEvent.CHANGE, function(sender, evt)
 * {
 *   let changes = evt.getProperty('edit').changes;
 *
 *   for (let i = 0; i < changes.length; i++)
 *   {
 *     let change = changes[i];
 *
 *     if (change instanceof MxChildChange &&
 *       change.change.previous === null)
 *     {
 *       graph.startEditingAtCell(change.child);
 *       break;
 *     }
 *   }
 * });
 * (end)
 *
 *
 * Event: MxEvent.NOTIFY
 *
 * Same as <MxEvent.CHANGE>, this event can be used for classes that need to
 * implement a sync mechanism between this model and, say, a remote model. In
 * such a setup, only local changes should trigger a notify event and all
 * changes should trigger a change event.
 *
 * Event: MxEvent.EXECUTE
 *
 * Fires between begin- and endUpdate and after an atomic change was executed
 * in the model. The <code>change</code> property contains the atomic change
 * that was executed.
 *
 * Event: MxEvent.EXECUTED
 *
 * Fires between START_EDIT and END_EDIT after an atomic change was executed.
 * The <code>change</code> property contains the change that was executed.
 *
 * Event: MxEvent.BEGIN_UPDATE
 *
 * Fires after the <updateLevel> was incremented in <beginUpdate>. This event
 * contains no properties.
 *
 * Event: MxEvent.START_EDIT
 *
 * Fires after the <updateLevel> was changed from 0 to 1. This event
 * contains no properties.
 *
 * Event: MxEvent.END_UPDATE
 *
 * Fires after the <updateLevel> was decreased in <endUpdate> but before any
 * notification or change dispatching. The <code>edit</code> property contains
 * the <currentEdit>.
 *
 * Event: MxEvent.END_EDIT
 *
 * Fires after the <updateLevel> was changed from 1 to 0. This event
 * contains no properties.
 *
 * Event: MxEvent.BEFORE_UNDO
 *
 * Fires before the change is dispatched after the update level has reached 0
 * in <endUpdate>. The <code>edit</code> property contains the <curreneEdit>.
 *
 * Event: MxEvent.UNDO
 *
 * Fires after the change was dispatched in <endUpdate>. The <code>edit</code>
 * property contains the <currentEdit>.
 *
 * Constructor: MxGraphModel
 *
 * Constructs a new graph model. If no root is specified then a new root
 * <MxCell> with a default layer is created.
 *
 * Parameters:
 *
 * root - <MxCell> that represents the root cell.
 */
export default class MxGraphModel {
  constructor(root) {
    this.currentEdit = this.createUndoableEdit()

    if (root !== null) {
      this.setRoot(root)
    } else {
      this.clear()
    }
  };
}

/**
 * Extends MxEventSource.
 */
MxGraphModel.prototype = new MxEventSource()
MxGraphModel.prototype.constructor = MxGraphModel

/**
 * Variable: root
 *
 * Holds the root cell, which in turn contains the cells that represent the
 * layers of the diagram as child cells. That is, the actual elements of the
 * diagram are supposed to live in the third generation of cells and below.
 */
MxGraphModel.prototype.root = null

/**
 * Variable: cells
 *
 * Maps from Ids to cells.
 */
MxGraphModel.prototype.cells = null

/**
 * Variable: maintainEdgeParent
 *
 * Specifies if edges should automatically be moved into the nearest common
 * ancestor of their terminals. Default is true.
 */
MxGraphModel.prototype.maintainEdgeParent = true

/**
 * Variable: ignoreRelativeEdgeParent
 *
 * Specifies if relative edge parents should be ignored for finding the nearest
 * common ancestors of an edge's terminals. Default is true.
 */
MxGraphModel.prototype.ignoreRelativeEdgeParent = true

/**
 * Variable: createIds
 *
 * Specifies if the model should automatically create Ids for new cells.
 * Default is true.
 */
MxGraphModel.prototype.createIds = true

/**
 * Variable: prefix
 *
 * Defines the prefix of new Ids. Default is an empty string.
 */
MxGraphModel.prototype.prefix = ''

/**
 * Variable: postfix
 *
 * Defines the postfix of new Ids. Default is an empty string.
 */
MxGraphModel.prototype.postfix = ''

/**
 * Variable: nextId
 *
 * Specifies the next Id to be created. Initial value is 0.
 */
MxGraphModel.prototype.nextId = 0

/**
 * Variable: currentEdit
 *
 * Holds the changes for the current transaction. If the transaction is
 * closed then a new object is created for this letiable using
 * <createUndoableEdit>.
 */
MxGraphModel.prototype.currentEdit = null

/**
 * Variable: updateLevel
 *
 * Counter for the depth of nested transactions. Each call to <beginUpdate>
 * will increment this number and each call to <endUpdate> will decrement
 * it. When the counter reaches 0, the transaction is closed and the
 * respective events are fired. Initial value is 0.
 */
MxGraphModel.prototype.updateLevel = 0

/**
 * Variable: endingUpdate
 *
 * True if the program flow is currently inside endUpdate.
 */
MxGraphModel.prototype.endingUpdate = false

/**
 * Function: clear
 *
 * Sets a new root using <createRoot>.
 */
MxGraphModel.prototype.clear = function() {
  this.setRoot(this.createRoot())
}

/**
 * Function: isCreateIds
 *
 * Returns <createIds>.
 */
MxGraphModel.prototype.isCreateIds = function() {
  return this.createIds
}

/**
 * Function: setCreateIds
 *
 * Sets <createIds>.
 */
MxGraphModel.prototype.setCreateIds = function(value) {
  this.createIds = value
}

/**
 * Function: createRoot
 *
 * Creates a new root cell with a default layer (child 0).
 */
MxGraphModel.prototype.createRoot = function() {
  let cell = new MxCell()
  cell.insert(new MxCell())

  return cell
}

/**
 * Function: getCell
 *
 * Returns the <MxCell> for the specified Id or null if no cell can be
 * found for the given Id.
 *
 * Parameters:
 *
 * id - A string representing the Id of the cell.
 */
MxGraphModel.prototype.getCell = function(id) {
  return (this.cells !== null) ? this.cells[id] : null
}

/**
 * Function: filterCells
 *
 * Returns the cells from the given array where the given filter function
 * returns true.
 */
MxGraphModel.prototype.filterCells = function(cells, filter) {
  let result = null

  if (cells !== null) {
    result = []

    for (let i = 0; i < cells.length; i++) {
      if (filter(cells[i])) {
        result.push(cells[i])
      }
    }
  }

  return result
}

/**
 * Function: getDescendants
 *
 * Returns all descendants of the given cell and the cell itself in an array.
 *
 * Parameters:
 *
 * parent - <MxCell> whose descendants should be returned.
 */
MxGraphModel.prototype.getDescendants = function(parent) {
  return this.filterDescendants(null, parent)
}

/**
 * Function: filterDescendants
 *
 * Visits all cells recursively and applies the specified filter function
 * to each cell. If the function returns true then the cell is added
 * to the resulting array. The parent and result paramters are optional.
 * If parent is not specified then the recursion starts at <root>.
 *
 * Example:
 * The following example extracts all vertices from a given model:
 * (code)
 * let filter = function(cell)
 * { return model.isVertex(cell); }
 * let vertices = model.filterDescendants(filter);
 * (end)
 *
 * Parameters:
 *
 * filter - JavaScript function that takes an <MxCell> as an argument
 * and returns a boolean.
 * parent - Optional <MxCell> that is used as the root of the recursion.
 */
MxGraphModel.prototype.filterDescendants = function(filter, parent) {
  // Creates a new array for storing the result
  let result = []

  // Recursion starts at the root of the model
  parent = parent || this.getRoot()

  // Checks if the filter returns true for the cell
  // and adds it to the result array
  if (filter === null || filter(parent)) {
    result.push(parent)
  }

  // Visits the children of the cell
  let childCount = this.getChildCount(parent)

  for (let i = 0; i < childCount; i++) {
    let child = this.getChildAt(parent, i)
    result = result.concat(this.filterDescendants(filter, child))
  }

  return result
}

/**
 * Function: getRoot
 *
 * Returns the root of the model or the topmost parent of the given cell.
 *
 * Parameters:
 *
 * cell - Optional <MxCell> that specifies the child.
 */
MxGraphModel.prototype.getRoot = function(cell) {
  let root = cell || this.root

  if (cell !== null) {
    while (cell !== null) {
      root = cell
      cell = this.getParent(cell)
    }
  }

  return root
}

/**
 * Function: setRoot
 *
 * Sets the <root> of the model using <MxRootChange> and adds the change to
 * the current transaction. This resets all datastructures in the model and
 * is the preferred way of clearing an existing model. Returns the new
 * root.
 *
 * Example:
 *
 * (code)
 * let root = new MxCell();
 * root.insert(new MxCell());
 * model.setRoot(root);
 * (end)
 *
 * Parameters:
 *
 * root - <MxCell> that specifies the new root.
 */
MxGraphModel.prototype.setRoot = function(root) {
  this.execute(new MxRootChange(this, root))

  return root
}

/**
 * Function: rootChanged
 *
 * Inner callback to change the root of the model and update the internal
 * datastructures, such as <cells> and <nextId>. Returns the previous root.
 *
 * Parameters:
 *
 * root - <MxCell> that specifies the new root.
 */
MxGraphModel.prototype.rootChanged = function(root) {
  let oldRoot = this.root
  this.root = root

  // Resets counters and datastructures
  this.nextId = 0
  this.cells = null
  this.cellAdded(root)

  return oldRoot
}

/**
 * Function: isRoot
 *
 * Returns true if the given cell is the root of the model and a non-null
 * value.
 *
 * Parameters:
 *
 * cell - <MxCell> that represents the possible root.
 */
MxGraphModel.prototype.isRoot = function(cell) {
  return cell !== null && this.root === cell
}

/**
 * Function: isLayer
 *
 * Returns true if <isRoot> returns true for the parent of the given cell.
 *
 * Parameters:
 *
 * cell - <MxCell> that represents the possible layer.
 */
MxGraphModel.prototype.isLayer = function(cell) {
  return this.isRoot(this.getParent(cell))
}

/**
 * Function: isAncestor
 *
 * Returns true if the given parent is an ancestor of the given child. Note
 * returns true if child === parent.
 *
 * Parameters:
 *
 * parent - <MxCell> that specifies the parent.
 * child - <MxCell> that specifies the child.
 */
MxGraphModel.prototype.isAncestor = function(parent, child) {
  while (child !== null && child !== parent) {
    child = this.getParent(child)
  }

  return child === parent
}

/**
 * Function: contains
 *
 * Returns true if the model contains the given <MxCell>.
 *
 * Parameters:
 *
 * cell - <MxCell> that specifies the cell.
 */
MxGraphModel.prototype.contains = function(cell) {
  return this.isAncestor(this.root, cell)
}

/**
 * Function: getParent
 *
 * Returns the parent of the given cell.
 *
 * Parameters:
 *
 * cell - <MxCell> whose parent should be returned.
 */
MxGraphModel.prototype.getParent = function(cell) {
  return (cell !== null) ? cell.getParent() : null
}

/**
 * Function: add
 *
 * Adds the specified child to the parent at the given index using
 * <MxChildChange> and adds the change to the current transaction. If no
 * index is specified then the child is appended to the parent's array of
 * children. Returns the inserted child.
 *
 * Parameters:
 *
 * parent - <MxCell> that specifies the parent to contain the child.
 * child - <MxCell> that specifies the child to be inserted.
 * index - Optional integer that specifies the index of the child.
 */
MxGraphModel.prototype.add = function(parent, child, index) {
  if (child !== parent && parent !== null && child !== null) {
    // Appends the child if no index was specified
    if (index === null) {
      index = this.getChildCount(parent)
    }

    let parentChanged = parent !== this.getParent(child)
    this.execute(new MxChildChange(this, parent, child, index))

    // Maintains the edges parents by moving the edges
    // into the nearest common ancestor of its
    // terminals
    if (this.maintainEdgeParent && parentChanged) {
      this.updateEdgeParents(child)
    }
  }

  return child
}

/**
 * Function: cellAdded
 *
 * Inner callback to update <cells> when a cell has been added. This
 * implementation resolves collisions by creating new Ids. To change the
 * ID of a cell after it was inserted into the model, use the following
 * code:
 *
 * (code
 * delete model.cells[cell.getId()];
 * cell.setId(newId);
 * model.cells[cell.getId()] = cell;
 * (end)
 *
 * If the change of the ID should be part of the command history, then the
 * cell should be removed from the model and a clone with the new ID should
 * be reinserted into the model instead.
 *
 * Parameters:
 *
 * cell - <MxCell> that specifies the cell that has been added.
 */
MxGraphModel.prototype.cellAdded = function(cell) {
  if (cell !== null) {
    // Creates an Id for the cell if not Id exists
    if (cell.getId() === null && this.createIds) {
      cell.setId(this.createId(cell))
    }

    if (cell.getId() !== null) {
      let collision = this.getCell(cell.getId())

      if (collision !== cell) {
        // Creates new Id for the cell
        // as long as there is a collision
        while (collision !== null) {
          cell.setId(this.createId(cell))
          collision = this.getCell(cell.getId())
        }

        // Lazily creates the cells dictionary
        if (this.cells === null) {
          this.cells = {}
        }

        this.cells[cell.getId()] = cell
      }
    }

    // Makes sure IDs of deleted cells are not reused
    if (MxUtils.isNumeric(cell.getId())) {
      this.nextId = Math.max(this.nextId, cell.getId())
    }

    // Recursively processes child cells
    let childCount = this.getChildCount(cell)

    for (let i = 0; i < childCount; i++) {
      this.cellAdded(this.getChildAt(cell, i))
    }
  }
}

/**
 * Function: createId
 *
 * Hook method to create an Id for the specified cell. This implementation
 * concatenates <prefix>, id and <postfix> to create the Id and increments
 * <nextId>. The cell is ignored by this implementation, but can be used in
 * overridden methods to prefix the Ids with eg. the cell type.
 *
 * Parameters:
 *
 * cell - <MxCell> to create the Id for.
 */
MxGraphModel.prototype.createId = function(cell) {
  let id = this.nextId
  this.nextId++

  return this.prefix + id + this.postfix
}

/**
 * Function: updateEdgeParents
 *
 * Updates the parent for all edges that are connected to cell or one of
 * its descendants using <updateEdgeParent>.
 */
MxGraphModel.prototype.updateEdgeParents = function(cell, root) {
  // Gets the topmost node of the hierarchy
  root = root || this.getRoot(cell)

  // Updates edges on children first
  let childCount = this.getChildCount(cell)

  for (let i = 0; i < childCount; i++) {
    let child = this.getChildAt(cell, i)
    this.updateEdgeParents(child, root)
  }

  // Updates the parents of all connected edges
  let edgeCount = this.getEdgeCount(cell)
  let edges = []

  for (let i = 0; i < edgeCount; i++) {
    edges.push(this.getEdgeAt(cell, i))
  }

  for (let i = 0; i < edges.length; i++) {
    let edge = edges[i]

    // Updates edge parent if edge and child have
    // a common root node (does not need to be the
    // model root node)
    if (this.isAncestor(root, edge)) {
      this.updateEdgeParent(edge, root)
    }
  }
}

/**
 * Function: updateEdgeParent
 *
 * Inner callback to update the parent of the specified <MxCell> to the
 * nearest-common-ancestor of its two terminals.
 *
 * Parameters:
 *
 * edge - <MxCell> that specifies the edge.
 * root - <MxCell> that represents the current root of the model.
 */
MxGraphModel.prototype.updateEdgeParent = function(edge, root) {
  let source = this.getTerminal(edge, true)
  let target = this.getTerminal(edge, false)
  let cell = null

  // Uses the first non-relative descendants of the source terminal
  while (source !== null && !this.isEdge(source) && source.geometry !== null && source.geometry.relative) {
    source = this.getParent(source)
  }

  // Uses the first non-relative descendants of the target terminal
  while (target !== null && this.ignoreRelativeEdgeParent && !this.isEdge(target) && target.geometry !== null && target.geometry.relative) {
    target = this.getParent(target)
  }

  if (this.isAncestor(root, source) && this.isAncestor(root, target)) {
    if (source === target) {
      cell = this.getParent(source)
    } else {
      cell = this.getNearestCommonAncestor(source, target)
    }

    if (cell !== null && (this.getParent(cell) !== this.root || this.isAncestor(cell, edge)) && this.getParent(edge) !== cell) {
      let geo = this.getGeometry(edge)

      if (geo !== null) {
        let origin1 = this.getOrigin(this.getParent(edge))
        let origin2 = this.getOrigin(cell)

        let dx = origin2.x - origin1.x
        let dy = origin2.y - origin1.y

        geo = geo.clone()
        geo.translate(-dx, -dy)
        this.setGeometry(edge, geo)
      }

      this.add(cell, edge, this.getChildCount(cell))
    }
  }
}

/**
 * Function: getOrigin
 *
 * Returns the absolute, accumulated origin for the children inside the
 * given parent as an <MxPoint>.
 */
MxGraphModel.prototype.getOrigin = function(cell) {
  let result = null

  if (cell !== null) {
    result = this.getOrigin(this.getParent(cell))

    if (!this.isEdge(cell)) {
      let geo = this.getGeometry(cell)

      if (geo !== null) {
        result.x += geo.x
        result.y += geo.y
      }
    }
  } else {
    result = new MxPoint()
  }

  return result
}

/**
 * Function: getNearestCommonAncestor
 *
 * Returns the nearest common ancestor for the specified cells.
 *
 * Parameters:
 *
 * cell1 - <MxCell> that specifies the first cell in the tree.
 * cell2 - <MxCell> that specifies the second cell in the tree.
 */
MxGraphModel.prototype.getNearestCommonAncestor = function(cell1, cell2) {
  if (cell1 !== null && cell2 !== null) {
    // Creates the cell path for the second cell
    let path = MxCellPath.create(cell2)

    if (path !== null && path.length > 0) {
      // Bubbles through the ancestors of the first
      // cell to find the nearest common ancestor.
      let cell = cell1
      let current = MxCellPath.create(cell)

      // Inverts arguments
      if (path.length < current.length) {
        cell = cell2
        let tmp = current
        current = path
        path = tmp
      }

      while (cell !== null) {
        let parent = this.getParent(cell)

        // Checks if the cell path is equal to the beginning of the given cell path
        if (path.indexOf(current + MxCellPath.PATH_SEPARATOR) === 0 && parent !== null) {
          return cell
        }

        current = MxCellPath.getParentPath(current)
        cell = parent
      }
    }
  }

  return null
}

/**
 * Function: remove
 *
 * Removes the specified cell from the model using <MxChildChange> and adds
 * the change to the current transaction. This operation will remove the
 * cell and all of its children from the model. Returns the removed cell.
 *
 * Parameters:
 *
 * cell - <MxCell> that should be removed.
 */
MxGraphModel.prototype.remove = function(cell) {
  if (cell === this.root) {
    this.setRoot(null)
  } else if (this.getParent(cell) !== null) {
    this.execute(new MxChildChange(this, null, cell))
  }

  return cell
}

/**
 * Function: cellRemoved
 *
 * Inner callback to update <cells> when a cell has been removed.
 *
 * Parameters:
 *
 * cell - <MxCell> that specifies the cell that has been removed.
 */
MxGraphModel.prototype.cellRemoved = function(cell) {
  if (cell !== null && this.cells !== null) {
    // Recursively processes child cells
    let childCount = this.getChildCount(cell)

    for (let i = childCount - 1; i >= 0; i--) {
      this.cellRemoved(this.getChildAt(cell, i))
    }

    // Removes the dictionary entry for the cell
    if (this.cells !== null && cell.getId() !== null) {
      delete this.cells[cell.getId()]
    }
  }
}

/**
 * Function: parentForCellChanged
 *
 * Inner callback to update the parent of a cell using <MxCell.insert>
 * on the parent and return the previous parent.
 *
 * Parameters:
 *
 * cell - <MxCell> to update the parent for.
 * parent - <MxCell> that specifies the new parent of the cell.
 * index - Optional integer that defines the index of the child
 * in the parent's child array.
 */
MxGraphModel.prototype.parentForCellChanged = function(cell, parent, index) {
  let previous = this.getParent(cell)

  if (parent !== null) {
    if (parent !== previous || previous.getIndex(cell) !== index) {
      parent.insert(cell, index)
    }
  } else if (previous !== null) {
    let oldIndex = previous.getIndex(cell)
    previous.remove(oldIndex)
  }

  // Checks if the previous parent was already in the
  // model and avoids calling cellAdded if it was.
  if (!this.contains(previous) && parent !== null) {
    this.cellAdded(cell)
  } else if (parent === null) {
    this.cellRemoved(cell)
  }

  return previous
}

/**
 * Function: getChildCount
 *
 * Returns the number of children in the given cell.
 *
 * Parameters:
 *
 * cell - <MxCell> whose number of children should be returned.
 */
MxGraphModel.prototype.getChildCount = function(cell) {
  return (cell !== null) ? cell.getChildCount() : 0
}

/**
 * Function: getChildAt
 *
 * Returns the child of the given <MxCell> at the given index.
 *
 * Parameters:
 *
 * cell - <MxCell> that represents the parent.
 * index - Integer that specifies the index of the child to be returned.
 */
MxGraphModel.prototype.getChildAt = function(cell, index) {
  return (cell !== null) ? cell.getChildAt(index) : null
}

/**
 * Function: getChildren
 *
 * Returns all children of the given <MxCell> as an array of <MxCells>. The
 * return value should be only be read.
 *
 * Parameters:
 *
 * cell - <MxCell> the represents the parent.
 */
MxGraphModel.prototype.getChildren = function(cell) {
  return (cell !== null) ? cell.children : null
}

/**
 * Function: getChildVertices
 *
 * Returns the child vertices of the given parent.
 *
 * Parameters:
 *
 * cell - <MxCell> whose child vertices should be returned.
 */
MxGraphModel.prototype.getChildVertices = function(parent) {
  return this.getChildCells(parent, true, false)
}

/**
 * Function: getChildEdges
 *
 * Returns the child edges of the given parent.
 *
 * Parameters:
 *
 * cell - <MxCell> whose child edges should be returned.
 */
MxGraphModel.prototype.getChildEdges = function(parent) {
  return this.getChildCells(parent, false, true)
}

/**
 * Function: getChildCells
 *
 * Returns the children of the given cell that are vertices and/or edges
 * depending on the arguments.
 *
 * Parameters:
 *
 * cell - <MxCell> the represents the parent.
 * vertices - Boolean indicating if child vertices should be returned.
 * Default is false.
 * edges - Boolean indicating if child edges should be returned.
 * Default is false.
 */
MxGraphModel.prototype.getChildCells = function(parent, vertices, edges) {
  vertices = (vertices !== null) ? vertices : false
  edges = (edges !== null) ? edges : false

  let childCount = this.getChildCount(parent)
  let result = []

  for (let i = 0; i < childCount; i++) {
    let child = this.getChildAt(parent, i)

    if ((!edges && !vertices) || (edges && this.isEdge(child)) || (vertices && this.isVertex(child))) {
      result.push(child)
    }
  }

  return result
}

/**
 * Function: getTerminal
 *
 * Returns the source or target <MxCell> of the given edge depending on the
 * value of the boolean parameter.
 *
 * Parameters:
 *
 * edge - <MxCell> that specifies the edge.
 * isSource - Boolean indicating which end of the edge should be returned.
 */
MxGraphModel.prototype.getTerminal = function(edge, isSource) {
  return (edge !== null) ? edge.getTerminal(isSource) : null
}

/**
 * Function: setTerminal
 *
 * Sets the source or target terminal of the given <MxCell> using
 * <MxTerminalChange> and adds the change to the current transaction.
 * This implementation updates the parent of the edge using <updateEdgeParent>
 * if required.
 *
 * Parameters:
 *
 * edge - <MxCell> that specifies the edge.
 * terminal - <MxCell> that specifies the new terminal.
 * isSource - Boolean indicating if the terminal is the new source or
 * target terminal of the edge.
 */
MxGraphModel.prototype.setTerminal = function(edge, terminal, isSource) {
  let terminalChanged = terminal !== this.getTerminal(edge, isSource)
  this.execute(new MxTerminalChange(this, edge, terminal, isSource))

  if (this.maintainEdgeParent && terminalChanged) {
    this.updateEdgeParent(edge, this.getRoot())
  }

  return terminal
}

/**
 * Function: setTerminals
 *
 * Sets the source and target <MxCell> of the given <MxCell> in a single
 * transaction using <setTerminal> for each end of the edge.
 *
 * Parameters:
 *
 * edge - <MxCell> that specifies the edge.
 * source - <MxCell> that specifies the new source terminal.
 * target - <MxCell> that specifies the new target terminal.
 */
MxGraphModel.prototype.setTerminals = function(edge, source, target) {
  this.beginUpdate()
  try {
    this.setTerminal(edge, source, true)
    this.setTerminal(edge, target, false)
  } finally {
    this.endUpdate()
  }
}

/**
 * Function: terminalForCellChanged
 *
 * Inner helper function to update the terminal of the edge using
 * <MxCell.insertEdge> and return the previous terminal.
 *
 * Parameters:
 *
 * edge - <MxCell> that specifies the edge to be updated.
 * terminal - <MxCell> that specifies the new terminal.
 * isSource - Boolean indicating if the terminal is the new source or
 * target terminal of the edge.
 */
MxGraphModel.prototype.terminalForCellChanged = function(edge, terminal, isSource) {
  let previous = this.getTerminal(edge, isSource)

  if (terminal !== null) {
    terminal.insertEdge(edge, isSource)
  } else if (previous !== null) {
    previous.removeEdge(edge, isSource)
  }

  return previous
}

/**
 * Function: getEdgeCount
 *
 * Returns the number of distinct edges connected to the given cell.
 *
 * Parameters:
 *
 * cell - <MxCell> that represents the vertex.
 */
MxGraphModel.prototype.getEdgeCount = function(cell) {
  return (cell !== null) ? cell.getEdgeCount() : 0
}

/**
 * Function: getEdgeAt
 *
 * Returns the edge of cell at the given index.
 *
 * Parameters:
 *
 * cell - <MxCell> that specifies the vertex.
 * index - Integer that specifies the index of the edge
 * to return.
 */
MxGraphModel.prototype.getEdgeAt = function(cell, index) {
  return (cell !== null) ? cell.getEdgeAt(index) : null
}

/**
 * Function: getDirectedEdgeCount
 *
 * Returns the number of incoming or outgoing edges, ignoring the given
 * edge.
 *
 * Parameters:
 *
 * cell - <MxCell> whose edge count should be returned.
 * outgoing - Boolean that specifies if the number of outgoing or
 * incoming edges should be returned.
 * ignoredEdge - <MxCell> that represents an edge to be ignored.
 */
MxGraphModel.prototype.getDirectedEdgeCount = function(cell, outgoing, ignoredEdge) {
  let count = 0
  let edgeCount = this.getEdgeCount(cell)

  for (let i = 0; i < edgeCount; i++) {
    let edge = this.getEdgeAt(cell, i)

    if (edge !== ignoredEdge && this.getTerminal(edge, outgoing) === cell) {
      count++
    }
  }

  return count
}

/**
 * Function: getConnections
 *
 * Returns all edges of the given cell without loops.
 *
 * Parameters:
 *
 * cell - <MxCell> whose edges should be returned.
 *
 */
MxGraphModel.prototype.getConnections = function(cell) {
  return this.getEdges(cell, true, true, false)
}

/**
 * Function: getIncomingEdges
 *
 * Returns the incoming edges of the given cell without loops.
 *
 * Parameters:
 *
 * cell - <MxCell> whose incoming edges should be returned.
 *
 */
MxGraphModel.prototype.getIncomingEdges = function(cell) {
  return this.getEdges(cell, true, false, false)
}

/**
 * Function: getOutgoingEdges
 *
 * Returns the outgoing edges of the given cell without loops.
 *
 * Parameters:
 *
 * cell - <MxCell> whose outgoing edges should be returned.
 *
 */
MxGraphModel.prototype.getOutgoingEdges = function(cell) {
  return this.getEdges(cell, false, true, false)
}

/**
 * Function: getEdges
 *
 * Returns all distinct edges connected to this cell as a new array of
 * <MxCells>. If at least one of incoming or outgoing is true, then loops
 * are ignored, otherwise if both are false, then all edges connected to
 * the given cell are returned including loops.
 *
 * Parameters:
 *
 * cell - <MxCell> that specifies the cell.
 * incoming - Optional boolean that specifies if incoming edges should be
 * returned. Default is true.
 * outgoing - Optional boolean that specifies if outgoing edges should be
 * returned. Default is true.
 * includeLoops - Optional boolean that specifies if loops should be returned.
 * Default is true.
 */
MxGraphModel.prototype.getEdges = function(cell, incoming, outgoing, includeLoops) {
  incoming = (incoming !== null) ? incoming : true
  outgoing = (outgoing !== null) ? outgoing : true
  includeLoops = (includeLoops !== null) ? includeLoops : true

  let edgeCount = this.getEdgeCount(cell)
  let result = []

  for (let i = 0; i < edgeCount; i++) {
    let edge = this.getEdgeAt(cell, i)
    let source = this.getTerminal(edge, true)
    let target = this.getTerminal(edge, false)

    if ((includeLoops && source === target) || ((source !== target) && ((incoming && target === cell) || (outgoing && source === cell)))) {
      result.push(edge)
    }
  }

  return result
}

/**
 * Function: getEdgesBetween
 *
 * Returns all edges between the given source and target pair. If directed
 * is true, then only edges from the source to the target are returned,
 * otherwise, all edges between the two cells are returned.
 *
 * Parameters:
 *
 * source - <MxCell> that defines the source terminal of the edge to be
 * returned.
 * target - <MxCell> that defines the target terminal of the edge to be
 * returned.
 * directed - Optional boolean that specifies if the direction of the
 * edge should be taken into account. Default is false.
 */
MxGraphModel.prototype.getEdgesBetween = function(source, target, directed) {
  directed = (directed !== null) ? directed : false

  let tmp1 = this.getEdgeCount(source)
  let tmp2 = this.getEdgeCount(target)

  // Assumes the source has less connected edges
  let terminal = source
  let edgeCount = tmp1

  // Uses the smaller array of connected edges
  // for searching the edge
  if (tmp2 < tmp1) {
    edgeCount = tmp2
    terminal = target
  }

  let result = []

  // Checks if the edge is connected to the correct
  // cell and returns the first match
  for (let i = 0; i < edgeCount; i++) {
    let edge = this.getEdgeAt(terminal, i)
    let src = this.getTerminal(edge, true)
    let trg = this.getTerminal(edge, false)
    let directedMatch = (src === source) && (trg === target)
    let oppositeMatch = (trg === source) && (src === target)

    if (directedMatch || (!directed && oppositeMatch)) {
      result.push(edge)
    }
  }

  return result
}

/**
 * Function: getOpposites
 *
 * Returns all opposite vertices wrt terminal for the given edges, only
 * returning sources and/or targets as specified. The result is returned
 * as an array of <MxCells>.
 *
 * Parameters:
 *
 * edges - Array of <MxCells> that contain the edges to be examined.
 * terminal - <MxCell> that specifies the known end of the edges.
 * sources - Boolean that specifies if source terminals should be contained
 * in the result. Default is true.
 * targets - Boolean that specifies if target terminals should be contained
 * in the result. Default is true.
 */
MxGraphModel.prototype.getOpposites = function(edges, terminal, sources, targets) {
  sources = (sources !== null) ? sources : true
  targets = (targets !== null) ? targets : true

  let terminals = []

  if (edges !== null) {
    for (let i = 0; i < edges.length; i++) {
      let source = this.getTerminal(edges[i], true)
      let target = this.getTerminal(edges[i], false)

      // Checks if the terminal is the source of
      // the edge and if the target should be
      // stored in the result
      if (source === terminal && target !== null && target !== terminal && targets) {
        terminals.push(target)
      } else if (target === terminal && source !== null && source !== terminal && sources) {
        // Checks if the terminal is the taget of
        // the edge and if the source should be
        // stored in the result
        terminals.push(source)
      }
    }
  }

  return terminals
}

/**
 * Function: getTopmostCells
 *
 * Returns the topmost cells of the hierarchy in an array that contains no
 * descendants for each <MxCell> that it contains. Duplicates should be
 * removed in the cells array to improve performance.
 *
 * Parameters:
 *
 * cells - Array of <MxCells> whose topmost ancestors should be returned.
 */
MxGraphModel.prototype.getTopmostCells = function(cells) {
  let dict = new MxDictionary()
  let tmp = []

  for (let i = 0; i < cells.length; i++) {
    dict.put(cells[i], true)
  }

  for (let i = 0; i < cells.length; i++) {
    let cell = cells[i]
    let topmost = true
    let parent = this.getParent(cell)

    while (parent !== null) {
      if (dict.get(parent)) {
        topmost = false
        break
      }

      parent = this.getParent(parent)
    }

    if (topmost) {
      tmp.push(cell)
    }
  }

  return tmp
}

/**
 * Function: isVertex
 *
 * Returns true if the given cell is a vertex.
 *
 * Parameters:
 *
 * cell - <MxCell> that represents the possible vertex.
 */
MxGraphModel.prototype.isVertex = function(cell) {
  return (cell !== null) ? cell.isVertex() : false
}

/**
 * Function: isEdge
 *
 * Returns true if the given cell is an edge.
 *
 * Parameters:
 *
 * cell - <MxCell> that represents the possible edge.
 */
MxGraphModel.prototype.isEdge = function(cell) {
  return (cell !== null) ? cell.isEdge() : false
}

/**
 * Function: isConnectable
 *
 * Returns true if the given <MxCell> is connectable. If <edgesConnectable>
 * is false, then this function returns false for all edges else it returns
 * the return value of <MxCell.isConnectable>.
 *
 * Parameters:
 *
 * cell - <MxCell> whose connectable state should be returned.
 */
MxGraphModel.prototype.isConnectable = function(cell) {
  return (cell !== null) ? cell.isConnectable() : false
}

/**
 * Function: getValue
 *
 * Returns the user object of the given <MxCell> using <MxCell.getValue>.
 *
 * Parameters:
 *
 * cell - <MxCell> whose user object should be returned.
 */
MxGraphModel.prototype.getValue = function(cell) {
  return (cell !== null) ? cell.getValue() : null
}

/**
 * Function: setValue
 *
 * Sets the user object of then given <MxCell> using <MxValueChange>
 * and adds the change to the current transaction.
 *
 * Parameters:
 *
 * cell - <MxCell> whose user object should be changed.
 * value - Object that defines the new user object.
 */
MxGraphModel.prototype.setValue = function(cell, value) {
  this.execute(new MxValueChange(this, cell, value))

  return value
}

/**
 * Function: valueForCellChanged
 *
 * Inner callback to update the user object of the given <MxCell>
 * using <MxCell.valueChanged> and return the previous value,
 * that is, the return value of <MxCell.valueChanged>.
 *
 * To change a specific attribute in an XML node, the following code can be
 * used.
 *
 * (code)
 * graph.getModel().valueForCellChanged = function(cell, value)
 * {
 *   let previous = cell.value.getAttribute('label');
 *   cell.value.setAttribute('label', value);
 *
 *   return previous;
 * };
 * (end)
 */
MxGraphModel.prototype.valueForCellChanged = function(cell, value) {
  return cell.valueChanged(value)
}

/**
 * Function: getGeometry
 *
 * Returns the <mxGeometry> of the given <MxCell>.
 *
 * Parameters:
 *
 * cell - <MxCell> whose geometry should be returned.
 */
MxGraphModel.prototype.getGeometry = function(cell) {
  return (cell !== null) ? cell.getGeometry() : null
}

/**
 * Function: setGeometry
 *
 * Sets the <mxGeometry> of the given <MxCell>. The actual update
 * of the cell is carried out in <geometryForCellChanged>. The
 * <MxGeometryChange> action is used to encapsulate the change.
 *
 * Parameters:
 *
 * cell - <MxCell> whose geometry should be changed.
 * geometry - <mxGeometry> that defines the new geometry.
 */
MxGraphModel.prototype.setGeometry = function(cell, geometry) {
  if (geometry !== this.getGeometry(cell)) {
    this.execute(new MxGeometryChange(this, cell, geometry))
  }

  return geometry
}

/**
 * Function: geometryForCellChanged
 *
 * Inner callback to update the <mxGeometry> of the given <MxCell> using
 * <MxCell.setGeometry> and return the previous <mxGeometry>.
 */
MxGraphModel.prototype.geometryForCellChanged = function(cell, geometry) {
  let previous = this.getGeometry(cell)
  cell.setGeometry(geometry)

  return previous
}

/**
 * Function: getStyle
 *
 * Returns the style of the given <MxCell>.
 *
 * Parameters:
 *
 * cell - <MxCell> whose style should be returned.
 */
MxGraphModel.prototype.getStyle = function(cell) {
  return (cell !== null) ? cell.getStyle() : null
}

/**
 * Function: setStyle
 *
 * Sets the style of the given <MxCell> using <MxStyleChange> and
 * adds the change to the current transaction.
 *
 * Parameters:
 *
 * cell - <MxCell> whose style should be changed.
 * style - String of the form [stylename;|key=value;] to specify
 * the new cell style.
 */
MxGraphModel.prototype.setStyle = function(cell, style) {
  if (style !== this.getStyle(cell)) {
    this.execute(new MxStyleChange(this, cell, style))
  }

  return style
}

/**
 * Function: styleForCellChanged
 *
 * Inner callback to update the style of the given <MxCell>
 * using <MxCell.setStyle> and return the previous style.
 *
 * Parameters:
 *
 * cell - <MxCell> that specifies the cell to be updated.
 * style - String of the form [stylename;|key=value;] to specify
 * the new cell style.
 */
MxGraphModel.prototype.styleForCellChanged = function(cell, style) {
  let previous = this.getStyle(cell)
  cell.setStyle(style)

  return previous
}

/**
 * Function: isCollapsed
 *
 * Returns true if the given <MxCell> is collapsed.
 *
 * Parameters:
 *
 * cell - <MxCell> whose collapsed state should be returned.
 */
MxGraphModel.prototype.isCollapsed = function(cell) {
  return (cell !== null) ? cell.isCollapsed() : false
}

/**
 * Function: setCollapsed
 *
 * Sets the collapsed state of the given <MxCell> using <MxCollapseChange>
 * and adds the change to the current transaction.
 *
 * Parameters:
 *
 * cell - <MxCell> whose collapsed state should be changed.
 * collapsed - Boolean that specifies the new collpased state.
 */
MxGraphModel.prototype.setCollapsed = function(cell, collapsed) {
  if (collapsed !== this.isCollapsed(cell)) {
    this.execute(new MxCollapseChange(this, cell, collapsed))
  }

  return collapsed
}

/**
 * Function: collapsedStateForCellChanged
 *
 * Inner callback to update the collapsed state of the
 * given <MxCell> using <MxCell.setCollapsed> and return
 * the previous collapsed state.
 *
 * Parameters:
 *
 * cell - <MxCell> that specifies the cell to be updated.
 * collapsed - Boolean that specifies the new collpased state.
 */
MxGraphModel.prototype.collapsedStateForCellChanged = function(cell, collapsed) {
  let previous = this.isCollapsed(cell)
  cell.setCollapsed(collapsed)

  return previous
}

/**
 * Function: isVisible
 *
 * Returns true if the given <MxCell> is visible.
 *
 * Parameters:
 *
 * cell - <MxCell> whose visible state should be returned.
 */
MxGraphModel.prototype.isVisible = function(cell) {
  return (cell !== null) ? cell.isVisible() : false
}

/**
 * Function: setVisible
 *
 * Sets the visible state of the given <MxCell> using <MxVisibleChange> and
 * adds the change to the current transaction.
 *
 * Parameters:
 *
 * cell - <MxCell> whose visible state should be changed.
 * visible - Boolean that specifies the new visible state.
 */
MxGraphModel.prototype.setVisible = function(cell, visible) {
  if (visible !== this.isVisible(cell)) {
    this.execute(new MxVisibleChange(this, cell, visible))
  }

  return visible
}

/**
 * Function: visibleStateForCellChanged
 *
 * Inner callback to update the visible state of the
 * given <MxCell> using <MxCell.setCollapsed> and return
 * the previous visible state.
 *
 * Parameters:
 *
 * cell - <MxCell> that specifies the cell to be updated.
 * visible - Boolean that specifies the new visible state.
 */
MxGraphModel.prototype.visibleStateForCellChanged = function(cell, visible) {
  let previous = this.isVisible(cell)
  cell.setVisible(visible)

  return previous
}

/**
 * Function: execute
 *
 * Executes the given edit and fires events if required. The edit object
 * requires an execute function which is invoked. The edit is added to the
 * <currentEdit> between <beginUpdate> and <endUpdate> calls, so that
 * events will be fired if this execute is an individual transaction, that
 * is, if no previous <beginUpdate> calls have been made without calling
 * <endUpdate>. This implementation fires an <execute> event before
 * executing the given change.
 *
 * Parameters:
 *
 * change - Object that described the change.
 */
MxGraphModel.prototype.execute = function(change) {
  change.execute()
  this.beginUpdate()
  this.currentEdit.add(change)
  this.fireEvent(new MxEventObject(MxEvent.EXECUTE, 'change', change))
  // New global executed event
  this.fireEvent(new MxEventObject(MxEvent.EXECUTED, 'change', change))
  this.endUpdate()
}

/**
 * Function: beginUpdate
 *
 * Increments the <updateLevel> by one. The event notification
 * is queued until <updateLevel> reaches 0 by use of
 * <endUpdate>.
 *
 * All changes on <MxGraphModel> are transactional,
 * that is, they are executed in a single undoable change
 * on the model (without transaction isolation).
 * Therefore, if you want to combine any
 * number of changes into a single undoable change,
 * you should group any two or more API calls that
 * modify the graph model between <beginUpdate>
 * and <endUpdate> calls as shown here:
 *
 * (code)
 * let model = graph.getModel();
 * let parent = graph.getDefaultParent();
 * let index = model.getChildCount(parent);
 * model.beginUpdate();
 * try
 * {
 *   model.add(parent, v1, index);
 *   model.add(parent, v2, index+1);
 * }
 * finally
 * {
 *   model.endUpdate();
 * }
 * (end)
 *
 * Of course there is a shortcut for appending a
 * sequence of cells into the default parent:
 *
 * (code)
 * graph.addCells([v1, v2]).
 * (end)
 */
MxGraphModel.prototype.beginUpdate = function() {
  this.updateLevel++
  this.fireEvent(new MxEventObject(MxEvent.BEGIN_UPDATE))

  if (this.updateLevel === 1) {
    this.fireEvent(new MxEventObject(MxEvent.START_EDIT))
  }
}

/**
 * Function: endUpdate
 *
 * Decrements the <updateLevel> by one and fires an <undo>
 * event if the <updateLevel> reaches 0. This function
 * indirectly fires a <change> event by invoking the notify
 * function on the <currentEdit> und then creates a new
 * <currentEdit> using <createUndoableEdit>.
 *
 * The <undo> event is fired only once per edit, whereas
 * the <change> event is fired whenever the notify
 * function is invoked, that is, on undo and redo of
 * the edit.
 */
MxGraphModel.prototype.endUpdate = function() {
  this.updateLevel--

  if (this.updateLevel === 0) {
    this.fireEvent(new MxEventObject(MxEvent.END_EDIT))
  }

  if (!this.endingUpdate) {
    this.endingUpdate = this.updateLevel === 0
    this.fireEvent(new MxEventObject(MxEvent.END_UPDATE, 'edit', this.currentEdit))

    try {
      if (this.endingUpdate && !this.currentEdit.isEmpty()) {
        this.fireEvent(new MxEventObject(MxEvent.BEFORE_UNDO, 'edit', this.currentEdit))
        let tmp = this.currentEdit
        this.currentEdit = this.createUndoableEdit()
        tmp.notify()
        this.fireEvent(new MxEventObject(MxEvent.UNDO, 'edit', tmp))
      }
    } finally {
      this.endingUpdate = false
    }
  }
}

/**
 * Function: createUndoableEdit
 *
 * Creates a new <MxUndoableEdit> that implements the
 * notify function to fire a <change> and <notify> event
 * through the <MxUndoableEdit>'s source.
 *
 * Parameters:
 *
 * significant - Optional boolean that specifies if the edit to be created is
 * significant. Default is true.
 */
MxGraphModel.prototype.createUndoableEdit = function(significant) {
  let edit = new MxUndoableEdit(this, (significant !== null) ? significant : true)

  edit.notify = function() {
    // LATER: Remove changes property (deprecated)
    edit.source.fireEvent(new MxEventObject(MxEvent.CHANGE,
      'edit', edit, 'changes', edit.changes))
    edit.source.fireEvent(new MxEventObject(MxEvent.NOTIFY,
      'edit', edit, 'changes', edit.changes))
  }

  return edit
}

/**
 * Function: mergeChildren
 *
 * Merges the children of the given cell into the given target cell inside
 * this model. All cells are cloned unless there is a corresponding cell in
 * the model with the same id, in which case the source cell is ignored and
 * all edges are connected to the corresponding cell in this model. Edges
 * are considered to have no identity and are always cloned unless the
 * cloneAllEdges flag is set to false, in which case edges with the same
 * id in the target model are reconnected to reflect the terminals of the
 * source edges.
 */
MxGraphModel.prototype.mergeChildren = function(from, to, cloneAllEdges) {
  cloneAllEdges = (cloneAllEdges !== null) ? cloneAllEdges : true

  this.beginUpdate()
  try {
    let mapping = {}
    this.mergeChildrenImpl(from, to, cloneAllEdges, mapping)

    // Post-processes all edges in the mapping and
    // reconnects the terminals to the corresponding
    // cells in the target model
    for (let key in mapping) {
      let cell = mapping[key]
      let terminal = this.getTerminal(cell, true)

      if (terminal !== null) {
        terminal = mapping[MxCellPath.create(terminal)]
        this.setTerminal(cell, terminal, true)
      }

      terminal = this.getTerminal(cell, false)

      if (terminal !== null) {
        terminal = mapping[MxCellPath.create(terminal)]
        this.setTerminal(cell, terminal, false)
      }
    }
  } finally {
    this.endUpdate()
  }
}

/**
 * Function: mergeChildren
 *
 * Clones the children of the source cell into the given target cell in
 * this model and adds an entry to the mapping that maps from the source
 * cell to the target cell with the same id or the clone of the source cell
 * that was inserted into this model.
 */
MxGraphModel.prototype.mergeChildrenImpl = function(from, to, cloneAllEdges, mapping) {
  this.beginUpdate()
  try {
    let childCount = from.getChildCount()

    for (let i = 0; i < childCount; i++) {
      let cell = from.getChildAt(i)

      if (typeof (cell.getId) === 'function') {
        let id = cell.getId()
        let target = (id !== null && (!this.isEdge(cell) || !cloneAllEdges))
          ? this.getCell(id) : null

        // Clones and adds the child if no cell exists for the id
        if (target === null) {
          let clone = cell.clone()
          clone.setId(id)

          // Sets the terminals from the original cell to the clone
          // because the lookup uses strings not cells in JS
          clone.setTerminal(cell.getTerminal(true), true)
          clone.setTerminal(cell.getTerminal(false), false)

          // Do *NOT* use model.add as this will move the edge away
          // from the parent in updateEdgeParent if maintainEdgeParent
          // is enabled in the target model
          target = to.insert(clone)
          this.cellAdded(target)
        }

        // Stores the mapping for later reconnecting edges
        mapping[MxCellPath.create(cell)] = target

        // Recurses
        this.mergeChildrenImpl(cell, target, cloneAllEdges, mapping)
      }
    }
  } finally {
    this.endUpdate()
  }
}

/**
 * Function: getParents
 *
 * Returns an array that represents the set (no duplicates) of all parents
 * for the given array of cells.
 *
 * Parameters:
 *
 * cells - Array of cells whose parents should be returned.
 */
MxGraphModel.prototype.getParents = function(cells) {
  let parents = []

  if (cells !== null) {
    let dict = new MxDictionary()

    for (let i = 0; i < cells.length; i++) {
      let parent = this.getParent(cells[i])

      if (parent !== null && !dict.get(parent)) {
        dict.put(parent, true)
        parents.push(parent)
      }
    }
  }

  return parents
}

//
// Cell Cloning
//

/**
 * Function: cloneCell
 *
 * Returns a deep clone of the given <MxCell> (including
 * the children) which is created using <cloneCells>.
 *
 * Parameters:
 *
 * cell - <MxCell> to be cloned.
 */
MxGraphModel.prototype.cloneCell = function(cell) {
  if (cell !== null) {
    return this.cloneCells([cell], true)[0]
  }

  return null
}

/**
 * Function: cloneCells
 *
 * Returns an array of clones for the given array of <MxCells>.
 * Depending on the value of includeChildren, a deep clone is created for
 * each cell. Connections are restored based if the corresponding
 * cell is contained in the passed in array.
 *
 * Parameters:
 *
 * cells - Array of <MxCell> to be cloned.
 * includeChildren - Boolean indicating if the cells should be cloned
 * with all descendants.
 * mapping - Optional mapping for existing clones.
 */
MxGraphModel.prototype.cloneCells = function(cells, includeChildren, mapping) {
  mapping = (mapping !== null) ? mapping : {}
  let clones = []

  for (let i = 0; i < cells.length; i++) {
    if (cells[i] !== null) {
      clones.push(this.cloneCellImpl(cells[i], mapping, includeChildren))
    } else {
      clones.push(null)
    }
  }

  for (let i = 0; i < clones.length; i++) {
    if (clones[i] !== null) {
      this.restoreClone(clones[i], cells[i], mapping)
    }
  }

  return clones
}

/**
 * Function: cloneCellImpl
 *
 * Inner helper method for cloning cells recursively.
 */
MxGraphModel.prototype.cloneCellImpl = function(cell, mapping, includeChildren) {
  let clone = this.cellCloned(cell)

  // Stores the clone in the lookup table
  mapping[mxObjectIdentity.get(cell)] = clone

  if (includeChildren) {
    let childCount = this.getChildCount(cell)

    for (let i = 0; i < childCount; i++) {
      let cloneChild = this.cloneCellImpl(
        this.getChildAt(cell, i), mapping, true)
      clone.insert(cloneChild)
    }
  }

  return clone
}

/**
 * Function: cellCloned
 *
 * Hook for cloning the cell. This returns cell.clone() or
 * any possible exceptions.
 */
MxGraphModel.prototype.cellCloned = function(cell) {
  return cell.clone()
}

/**
 * Function: restoreClone
 *
 * Inner helper method for restoring the connections in
 * a network of cloned cells.
 */
MxGraphModel.prototype.restoreClone = function(clone, cell, mapping) {
  let source = this.getTerminal(cell, true)

  if (source !== null) {
    let tmp = mapping[mxObjectIdentity.get(source)]

    if (tmp !== null) {
      tmp.insertEdge(clone, true)
    }
  }

  let target = this.getTerminal(cell, false)

  if (target !== null) {
    let tmp = mapping[mxObjectIdentity.get(target)]

    if (tmp !== null) {
      tmp.insertEdge(clone, false)
    }
  }

  let childCount = this.getChildCount(clone)

  for (let i = 0; i < childCount; i++) {
    this.restoreClone(this.getChildAt(clone, i),
      this.getChildAt(cell, i), mapping)
  }
}

//
// Atomic changes
//

/**
 * Class: MxRootChange
 *
 * Action to change the root in a model.
 *
 * Constructor: MxRootChange
 *
 * Constructs a change of the root in the
 * specified model.
 */
export class MxRootChange {
  constructor(model, root) {
    this.model = model
    this.root = root
    this.previous = root
  };
}

/**
 * Function: execute
 *
 * Carries out a change of the root using
 * <MxGraphModel.rootChanged>.
 */
MxRootChange.prototype.execute = function() {
  this.root = this.previous
  this.previous = this.model.rootChanged(this.previous)
}

/**
 * Class: MxChildChange
 *
 * Action to add or remove a child in a model.
 *
 * Constructor: MxChildChange
 *
 * Constructs a change of a child in the
 * specified model.
 */
function MxChildChange(model, parent, child, index) {
  this.model = model
  this.parent = parent
  this.previous = parent
  this.child = child
  this.index = index
  this.previousIndex = index
};

/**
 * Function: execute
 *
 * Changes the parent of <child> using
 * <MxGraphModel.parentForCellChanged> and
 * removes or restores the cell's
 * connections.
 */
MxChildChange.prototype.execute = function() {
  if (this.child !== null) {
    let tmp = this.model.getParent(this.child)
    let tmp2 = (tmp !== null) ? tmp.getIndex(this.child) : 0

    if (this.previous === null) {
      this.connect(this.child, false)
    }

    tmp = this.model.parentForCellChanged(
      this.child, this.previous, this.previousIndex)

    if (this.previous !== null) {
      this.connect(this.child, true)
    }

    this.parent = this.previous
    this.previous = tmp
    this.index = this.previousIndex
    this.previousIndex = tmp2
  }
}

/**
 * Function: disconnect
 *
 * Disconnects the given cell recursively from its
 * terminals and stores the previous terminal in the
 * cell's terminals.
 */
MxChildChange.prototype.connect = function(cell, isConnect) {
  isConnect = (isConnect !== null) ? isConnect : true

  let source = cell.getTerminal(true)
  let target = cell.getTerminal(false)

  if (source !== null) {
    if (isConnect) {
      this.model.terminalForCellChanged(cell, source, true)
    } else {
      this.model.terminalForCellChanged(cell, null, true)
    }
  }

  if (target !== null) {
    if (isConnect) {
      this.model.terminalForCellChanged(cell, target, false)
    } else {
      this.model.terminalForCellChanged(cell, null, false)
    }
  }

  cell.setTerminal(source, true)
  cell.setTerminal(target, false)

  let childCount = this.model.getChildCount(cell)

  for (let i = 0; i < childCount; i++) {
    this.connect(this.model.getChildAt(cell, i), isConnect)
  }
}

/**
 * Class: MxTerminalChange
 *
 * Action to change a terminal in a model.
 *
 * Constructor: MxTerminalChange
 *
 * Constructs a change of a terminal in the
 * specified model.
 */
export class MxTerminalChange {
  constructor(model, cell, terminal, source) {
    this.model = model
    this.cell = cell
    this.terminal = terminal
    this.previous = terminal
    this.source = source
  };
}

/**
 * Function: execute
 *
 * Changes the terminal of <cell> to <previous> using
 * <MxGraphModel.terminalForCellChanged>.
 */
MxTerminalChange.prototype.execute = function() {
  if (this.cell !== null) {
    this.terminal = this.previous
    this.previous = this.model.terminalForCellChanged(
      this.cell, this.previous, this.source)
  }
}

/**
 * Class: MxValueChange
 *
 * Action to change a user object in a model.
 *
 * Constructor: MxValueChange
 *
 * Constructs a change of a user object in the
 * specified model.
 */
function MxValueChange(model, cell, value) {
  this.model = model
  this.cell = cell
  this.value = value
  this.previous = value
};

/**
 * Function: execute
 *
 * Changes the value of <cell> to <previous> using
 * <MxGraphModel.valueForCellChanged>.
 */
MxValueChange.prototype.execute = function() {
  if (this.cell !== null) {
    this.value = this.previous
    this.previous = this.model.valueForCellChanged(
      this.cell, this.previous)
  }
}

/**
 * Class: MxStyleChange
 *
 * Action to change a cell's style in a model.
 *
 * Constructor: MxStyleChange
 *
 * Constructs a change of a style in the
 * specified model.
 */
function MxStyleChange(model, cell, style) {
  this.model = model
  this.cell = cell
  this.style = style
  this.previous = style
};

/**
 * Function: execute
 *
 * Changes the style of <cell> to <previous> using
 * <MxGraphModel.styleForCellChanged>.
 */
MxStyleChange.prototype.execute = function() {
  if (this.cell !== null) {
    this.style = this.previous
    this.previous = this.model.styleForCellChanged(
      this.cell, this.previous)
  }
}

/**
 * Class: MxGeometryChange
 *
 * Action to change a cell's geometry in a model.
 *
 * Constructor: MxGeometryChange
 *
 * Constructs a change of a geometry in the
 * specified model.
 */
function MxGeometryChange(model, cell, geometry) {
  this.model = model
  this.cell = cell
  this.geometry = geometry
  this.previous = geometry
};

/**
 * Function: execute
 *
 * Changes the geometry of <cell> ro <previous> using
 * <MxGraphModel.geometryForCellChanged>.
 */
MxGeometryChange.prototype.execute = function() {
  if (this.cell !== null) {
    this.geometry = this.previous
    this.previous = this.model.geometryForCellChanged(
      this.cell, this.previous)
  }
}

/**
 * Class: MxCollapseChange
 *
 * Action to change a cell's collapsed state in a model.
 *
 * Constructor: MxCollapseChange
 *
 * Constructs a change of a collapsed state in the
 * specified model.
 */
function MxCollapseChange(model, cell, collapsed) {
  this.model = model
  this.cell = cell
  this.collapsed = collapsed
  this.previous = collapsed
};

/**
 * Function: execute
 *
 * Changes the collapsed state of <cell> to <previous> using
 * <MxGraphModel.collapsedStateForCellChanged>.
 */
MxCollapseChange.prototype.execute = function() {
  if (this.cell !== null) {
    this.collapsed = this.previous
    this.previous = this.model.collapsedStateForCellChanged(
      this.cell, this.previous)
  }
}

/**
 * Class: MxVisibleChange
 *
 * Action to change a cell's visible state in a model.
 *
 * Constructor: MxVisibleChange
 *
 * Constructs a change of a visible state in the
 * specified model.
 */
function MxVisibleChange(model, cell, visible) {
  this.model = model
  this.cell = cell
  this.visible = visible
  this.previous = visible
};

/**
 * Function: execute
 *
 * Changes the visible state of <cell> to <previous> using
 * <MxGraphModel.visibleStateForCellChanged>.
 */
MxVisibleChange.prototype.execute = function() {
  if (this.cell !== null) {
    this.visible = this.previous
    this.previous = this.model.visibleStateForCellChanged(
      this.cell, this.previous)
  }
}

/**
 * Class: MxCellAttributeChange
 *
 * Action to change the attribute of a cell's user object.
 * There is no method on the graph model that uses this
 * action. To use the action, you can use the code shown
 * in the example below.
 *
 * Example:
 *
 * To change the attributeName in the cell's user object
 * to attributeValue, use the following code:
 *
 * (code)
 * model.beginUpdate();
 * try
 * {
 *   let edit = new MxCellAttributeChange(
 *     cell, attributeName, attributeValue);
 *   model.execute(edit);
 * }
 * finally
 * {
 *   model.endUpdate();
 * }
 * (end)
 *
 * Constructor: MxCellAttributeChange
 *
 * Constructs a change of a attribute of the DOM node
 * stored as the value of the given <MxCell>.
 */
function MxCellAttributeChange(cell, attribute, value) {
  this.cell = cell
  this.attribute = attribute
  this.value = value
  this.previous = value
};

/**
 * Function: execute
 *
 * Changes the attribute of the cell's user object by
 * using <MxCell.setAttribute>.
 */
MxCellAttributeChange.prototype.execute = function() {
  if (this.cell !== null) {
    let tmp = this.cell.getAttribute(this.attribute)

    if (this.previous === null) {
      this.cell.value.removeAttribute(this.attribute)
    } else {
      this.cell.setAttribute(this.attribute, this.previous)
    }

    this.previous = tmp
  }
}
