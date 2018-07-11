import MxUtils from '../util/MxUtils'
import MxConstants from '../util/MxConstants'
/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxCell
 *
 * Cells are the elements of the graph model. They represent the state
 * of the groups, vertices and edges in a graph.
 *
 * Custom attributes:
 *
 * For custom attributes we recommend using an XML node as the value of a cell.
 * The following code can be used to create a cell with an XML node as the
 * value:
 *
 * (code)
 * let doc = MxUtils.createXmlDocument();
 * let node = doc.createElement('MyNode')
 * node.setAttribute('label', 'MyLabel');
 * node.setAttribute('attribute1', 'value1');
 * graph.insertVertex(graph.getDefaultParent(), null, node, 40, 40, 80, 30);
 * (end)
 *
 * For the label to work, <mxGraph.convertValueToString> and
 * <mxGraph.cellLabelChanged> should be overridden as follows:
 *
 * (code)
 * graph.convertValueToString = function(cell)
 * {
 *   if (MxUtils.isNode(cell.value))
 *   {
 *     return cell.getAttribute('label', '')
 *   }
 * };
 *
 * let cellLabelChanged = graph.cellLabelChanged;
 * graph.cellLabelChanged = function(cell, newValue, autoSize)
 * {
 *   if (MxUtils.isNode(cell.value))
 *   {
 *     // Clones the value for correct undo/redo
 *     let elt = cell.value.cloneNode(true);
 *     elt.setAttribute('label', newValue);
 *     newValue = elt;
 *   }
 *
 *   cellLabelChanged.apply(this, arguments);
 * };
 * (end)
 *
 * Callback: onInit
 *
 * Called from within the constructor.
 *
 * Constructor: MxCell
 *
 * Constructs a new cell to be used in a graph model.
 * This method invokes <onInit> upon completion.
 *
 * Parameters:
 *
 * value - Optional object that represents the cell value.
 * geometry - Optional <mxGeometry> that specifies the geometry.
 * style - Optional formatted string that defines the style.
 */
export default class MxCell {
  constructor(value, geometry, style) {
    this.value = value
    this.setGeometry(geometry)
    this.setStyle(style)

    if (this.onInit !== null) {
      this.onInit()
    }
  };
}

/**
 * letiable: id
 *
 * Holds the Id. Default is null.
 */
MxCell.prototype.id = null

/**
 * letiable: value
 *
 * Holds the user object. Default is null.
 */
MxCell.prototype.value = null

/**
 * letiable: geometry
 *
 * Holds the <mxGeometry>. Default is null.
 */
MxCell.prototype.geometry = null

/**
 * letiable: style
 *
 * Holds the style as a string of the form [(stylename|key=value);]. Default is
 * null.
 */
MxCell.prototype.style = null

/**
 * letiable: vertex
 *
 * Specifies whether the cell is a vertex. Default is false.
 */
MxCell.prototype.vertex = false

/**
 * letiable: edge
 *
 * Specifies whether the cell is an edge. Default is false.
 */
MxCell.prototype.edge = false

/**
 * letiable: connectable
 *
 * Specifies whether the cell is connectable. Default is true.
 */
MxCell.prototype.connectable = true

/**
 * letiable: visible
 *
 * Specifies whether the cell is visible. Default is true.
 */
MxCell.prototype.visible = true

/**
 * letiable: collapsed
 *
 * Specifies whether the cell is collapsed. Default is false.
 */
MxCell.prototype.collapsed = false

/**
 * letiable: parent
 *
 * Reference to the parent cell.
 */
MxCell.prototype.parent = null

/**
 * letiable: source
 *
 * Reference to the source terminal.
 */
MxCell.prototype.source = null

/**
 * letiable: target
 *
 * Reference to the target terminal.
 */
MxCell.prototype.target = null

/**
 * letiable: children
 *
 * Holds the child cells.
 */
MxCell.prototype.children = null

/**
 * letiable: edges
 *
 * Holds the edges.
 */
MxCell.prototype.edges = null

/**
 * letiable: mxTransient
 *
 * List of members that should not be cloned inside <clone>. This field is
 * passed to <MxUtils.clone> and is not made persistent in <MxCellCodec>.
 * This is not a convention for all classes, it is only used in this class
 * to mark transient fields since transient modifiers are not supported by
 * the language.
 */
MxCell.prototype.mxTransient = ['id', 'value', 'parent', 'source',
  'target', 'children', 'edges']

/**
 * Function: getId
 *
 * Returns the Id of the cell as a string.
 */
MxCell.prototype.getId = function() {
  return this.id
}

/**
 * Function: setId
 *
 * Sets the Id of the cell to the given string.
 */
MxCell.prototype.setId = function(id) {
  this.id = id
}

/**
 * Function: getValue
 *
 * Returns the user object of the cell. The user
 * object is stored in <value>.
 */
MxCell.prototype.getValue = function() {
  return this.value
}

/**
 * Function: setValue
 *
 * Sets the user object of the cell. The user object
 * is stored in <value>.
 */
MxCell.prototype.setValue = function(value) {
  this.value = value
}

/**
 * Function: valueChanged
 *
 * Changes the user object after an in-place edit
 * and returns the previous value. This implementation
 * replaces the user object with the given value and
 * returns the old user object.
 */
MxCell.prototype.valueChanged = function(newValue) {
  let previous = this.getValue()
  this.setValue(newValue)

  return previous
}

/**
 * Function: getGeometry
 *
 * Returns the <mxGeometry> that describes the <geometry>.
 */
MxCell.prototype.getGeometry = function() {
  return this.geometry
}

/**
 * Function: setGeometry
 *
 * Sets the <mxGeometry> to be used as the <geometry>.
 */
MxCell.prototype.setGeometry = function(geometry) {
  this.geometry = geometry
}

/**
 * Function: getStyle
 *
 * Returns a string that describes the <style>.
 */
MxCell.prototype.getStyle = function() {
  return this.style
}

/**
 * Function: setStyle
 *
 * Sets the string to be used as the <style>.
 */
MxCell.prototype.setStyle = function(style) {
  this.style = style
}

/**
 * Function: isVertex
 *
 * Returns true if the cell is a vertex.
 */
MxCell.prototype.isVertex = function() {
  return this.vertex !== 0
}

/**
 * Function: setVertex
 *
 * Specifies if the cell is a vertex. This should only be assigned at
 * construction of the cell and not be changed during its lifecycle.
 *
 * Parameters:
 *
 * vertex - Boolean that specifies if the cell is a vertex.
 */
MxCell.prototype.setVertex = function(vertex) {
  this.vertex = vertex
}

/**
 * Function: isEdge
 *
 * Returns true if the cell is an edge.
 */
MxCell.prototype.isEdge = function() {
  return this.edge !== 0
}

/**
 * Function: setEdge
 *
 * Specifies if the cell is an edge. This should only be assigned at
 * construction of the cell and not be changed during its lifecycle.
 *
 * Parameters:
 *
 * edge - Boolean that specifies if the cell is an edge.
 */
MxCell.prototype.setEdge = function(edge) {
  this.edge = edge
}

/**
 * Function: isConnectable
 *
 * Returns true if the cell is connectable.
 */
MxCell.prototype.isConnectable = function() {
  return this.connectable !== 0
}

/**
 * Function: setConnectable
 *
 * Sets the connectable state.
 *
 * Parameters:
 *
 * connectable - Boolean that specifies the new connectable state.
 */
MxCell.prototype.setConnectable = function(connectable) {
  this.connectable = connectable
}

/**
 * Function: isVisible
 *
 * Returns true if the cell is visibile.
 */
MxCell.prototype.isVisible = function() {
  return this.visible !== 0
}

/**
 * Function: setVisible
 *
 * Specifies if the cell is visible.
 *
 * Parameters:
 *
 * visible - Boolean that specifies the new visible state.
 */
MxCell.prototype.setVisible = function(visible) {
  this.visible = visible
}

/**
 * Function: isCollapsed
 *
 * Returns true if the cell is collapsed.
 */
MxCell.prototype.isCollapsed = function() {
  return this.collapsed !== 0
}

/**
 * Function: setCollapsed
 *
 * Sets the collapsed state.
 *
 * Parameters:
 *
 * collapsed - Boolean that specifies the new collapsed state.
 */
MxCell.prototype.setCollapsed = function(collapsed) {
  this.collapsed = collapsed
}

/**
 * Function: getParent
 *
 * Returns the cell's parent.
 */
MxCell.prototype.getParent = function() {
  return this.parent
}

/**
 * Function: setParent
 *
 * Sets the parent cell.
 *
 * Parameters:
 *
 * parent - <MxCell> that represents the new parent.
 */
MxCell.prototype.setParent = function(parent) {
  this.parent = parent
}

/**
 * Function: getTerminal
 *
 * Returns the source or target terminal.
 *
 * Parameters:
 *
 * source - Boolean that specifies if the source terminal should be
 * returned.
 */
MxCell.prototype.getTerminal = function(source) {
  return (source) ? this.source : this.target
}

/**
 * Function: setTerminal
 *
 * Sets the source or target terminal and returns the new terminal.
 *
 * Parameters:
 *
 * terminal - <MxCell> that represents the new source or target terminal.
 * isSource - Boolean that specifies if the source or target terminal
 * should be set.
 */
MxCell.prototype.setTerminal = function(terminal, isSource) {
  if (isSource) {
    this.source = terminal
  } else {
    this.target = terminal
  }

  return terminal
}

/**
 * Function: getChildCount
 *
 * Returns the number of child cells.
 */
MxCell.prototype.getChildCount = function() {
  return (this.children === null) ? 0 : this.children.length
}

/**
 * Function: getIndex
 *
 * Returns the index of the specified child in the child array.
 *
 * Parameters:
 *
 * child - Child whose index should be returned.
 */
MxCell.prototype.getIndex = function(child) {
  return MxUtils.indexOf(this.children, child)
}

/**
 * Function: getChildAt
 *
 * Returns the child at the specified index.
 *
 * Parameters:
 *
 * index - Integer that specifies the child to be returned.
 */
MxCell.prototype.getChildAt = function(index) {
  return (this.children === null) ? null : this.children[index]
}

/**
 * Function: insert
 *
 * Inserts the specified child into the child array at the specified index
 * and updates the parent reference of the child. If not childIndex is
 * specified then the child is appended to the child array. Returns the
 * inserted child.
 *
 * Parameters:
 *
 * child - <MxCell> to be inserted or appended to the child array.
 * index - Optional integer that specifies the index at which the child
 * should be inserted into the child array.
 */
MxCell.prototype.insert = function(child, index) {
  if (child !== null) {
    if (index === null) {
      index = this.getChildCount()

      if (child.getParent() === this) {
        index--
      }
    }

    child.removeFromParent()
    child.setParent(this)

    if (this.children === null) {
      this.children = []
      this.children.push(child)
    } else {
      this.children.splice(index, 0, child)
    }
  }

  return child
}

/**
 * Function: remove
 *
 * Removes the child at the specified index from the child array and
 * returns the child that was removed. Will remove the parent reference of
 * the child.
 *
 * Parameters:
 *
 * index - Integer that specifies the index of the child to be
 * removed.
 */
MxCell.prototype.remove = function(index) {
  let child = null

  if (this.children !== null && index >= 0) {
    child = this.getChildAt(index)

    if (child !== null) {
      this.children.splice(index, 1)
      child.setParent(null)
    }
  }

  return child
}

/**
 * Function: removeFromParent
 *
 * Removes the cell from its parent.
 */
MxCell.prototype.removeFromParent = function() {
  if (this.parent !== null) {
    let index = this.parent.getIndex(this)
    this.parent.remove(index)
  }
}

/**
 * Function: getEdgeCount
 *
 * Returns the number of edges in the edge array.
 */
MxCell.prototype.getEdgeCount = function() {
  return (this.edges === null) ? 0 : this.edges.length
}

/**
 * Function: getEdgeIndex
 *
 * Returns the index of the specified edge in <edges>.
 *
 * Parameters:
 *
 * edge - <MxCell> whose index in <edges> should be returned.
 */
MxCell.prototype.getEdgeIndex = function(edge) {
  return MxUtils.indexOf(this.edges, edge)
}

/**
 * Function: getEdgeAt
 *
 * Returns the edge at the specified index in <edges>.
 *
 * Parameters:
 *
 * index - Integer that specifies the index of the edge to be returned.
 */
MxCell.prototype.getEdgeAt = function(index) {
  return (this.edges === null) ? null : this.edges[index]
}

/**
 * Function: insertEdge
 *
 * Inserts the specified edge into the edge array and returns the edge.
 * Will update the respective terminal reference of the edge.
 *
 * Parameters:
 *
 * edge - <MxCell> to be inserted into the edge array.
 * isOutgoing - Boolean that specifies if the edge is outgoing.
 */
MxCell.prototype.insertEdge = function(edge, isOutgoing) {
  if (edge !== null) {
    edge.removeFromTerminal(isOutgoing)
    edge.setTerminal(this, isOutgoing)

    if (this.edges === null || edge.getTerminal(!isOutgoing) !== this || MxUtils.indexOf(this.edges, edge) < 0) {
      if (this.edges === null) {
        this.edges = []
      }

      this.edges.push(edge)
    }
  }

  return edge
}

/**
 * Function: removeEdge
 *
 * Removes the specified edge from the edge array and returns the edge.
 * Will remove the respective terminal reference from the edge.
 *
 * Parameters:
 *
 * edge - <MxCell> to be removed from the edge array.
 * isOutgoing - Boolean that specifies if the edge is outgoing.
 */
MxCell.prototype.removeEdge = function(edge, isOutgoing) {
  if (edge !== null) {
    if (edge.getTerminal(!isOutgoing) !== this && this.edges !== null) {
      let index = this.getEdgeIndex(edge)

      if (index >= 0) {
        this.edges.splice(index, 1)
      }
    }

    edge.setTerminal(null, isOutgoing)
  }

  return edge
}

/**
 * Function: removeFromTerminal
 *
 * Removes the edge from its source or target terminal.
 *
 * Parameters:
 *
 * isSource - Boolean that specifies if the edge should be removed from its
 * source or target terminal.
 */
MxCell.prototype.removeFromTerminal = function(isSource) {
  let terminal = this.getTerminal(isSource)

  if (terminal !== null) {
    terminal.removeEdge(this, isSource)
  }
}

/**
 * Function: hasAttribute
 *
 * Returns true if the user object is an XML node that contains the given
 * attribute.
 *
 * Parameters:
 *
 * name - Name of the attribute.
 */
MxCell.prototype.hasAttribute = function(name) {
  let userObject = this.getValue()

  return (userObject !== null && userObject.nodeType === MxConstants.NODETYPE_ELEMENT && userObject.hasAttribute)
    ? userObject.hasAttribute(name) : userObject.getAttribute(name) !== null
}

/**
 * Function: getAttribute
 *
 * Returns the specified attribute from the user object if it is an XML
 * node.
 *
 * Parameters:
 *
 * name - Name of the attribute whose value should be returned.
 * defaultValue - Optional default value to use if the attribute has no
 * value.
 */
MxCell.prototype.getAttribute = function(name, defaultValue) {
  let userObject = this.getValue()

  let val = (userObject !== null && userObject.nodeType === MxConstants.NODETYPE_ELEMENT)
    ? userObject.getAttribute(name) : null

  return val || defaultValue
}

/**
 * Function: setAttribute
 *
 * Sets the specified attribute on the user object if it is an XML node.
 *
 * Parameters:
 *
 * name - Name of the attribute whose value should be set.
 * value - New value of the attribute.
 */
MxCell.prototype.setAttribute = function(name, value) {
  let userObject = this.getValue()

  if (userObject !== null && userObject.nodeType === MxConstants.NODETYPE_ELEMENT) {
    userObject.setAttribute(name, value)
  }
}

/**
 * Function: clone
 *
 * Returns a clone of the cell. Uses <cloneValue> to clone
 * the user object. All fields in <mxTransient> are ignored
 * during the cloning.
 */
MxCell.prototype.clone = function() {
  let clone = MxUtils.clone(this, this.mxTransient)
  clone.setValue(this.cloneValue())

  return clone
}

/**
 * Function: cloneValue
 *
 * Returns a clone of the cell's user object.
 */
MxCell.prototype.cloneValue = function() {
  let value = this.getValue()

  if (value !== null) {
    if (typeof (value.clone) === 'function') {
      value = value.clone()
    } else if (!isNaN(value.nodeType)) {
      value = value.cloneNode(true)
    }
  }

  return value
}
