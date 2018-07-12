/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxCodec
 *
 * XML codec for JavaScript object graphs. See <mxObjectCodec> for a
 * description of the general encoding/decoding scheme. This class uses the
 * codecs registered in <MxCodecRegistry> for encoding/decoding each object.
 *
 * References:
 *
 * In order to resolve references, especially forward references, the MxCodec
 * constructor must be given the document that contains the referenced
 * elements.
 *
 * Examples:
 *
 * The following code is used to encode a graph model.
 *
 * (code)
 * let encoder = new MxCodec();
 * let result = encoder.encode(graph.getModel());
 * let xml = MxUtils.getXml(result);
 * (end)
 *
 * Example:
 *
 * Using the code below, an XML document is decoded into an existing model. The
 * document may be obtained using one of the functions in MxUtils for loading
 * an XML file, eg. <MxUtils.get>, or using <MxUtils.parseXml> for parsing an
 * XML string.
 *
 * (code)
 * let doc = MxUtils.parseXml(xmlString);
 * let codec = new MxCodec(doc);
 * codec.decode(doc.documentElement, graph.getModel());
 * (end)
 *
 * Example:
 *
 * This example demonstrates parsing a list of isolated cells into an existing
 * graph model. Note that the cells do not have a parent reference so they can
 * be added anywhere in the cell hierarchy after parsing.
 *
 * (code)
 * let xml = '<root><MxCell id="2" value="Hello," vertex="1"><mxGeometry x="20" y="20" width="80" height="30" as="geometry"/></MxCell><MxCell id="3" value="World!" vertex="1"><mxGeometry x="200" y="150" width="80" height="30" as="geometry"/></MxCell><MxCell id="4" value="" edge="1" source="2" target="3"><mxGeometry relative="1" as="geometry"/></MxCell></root>';
 * let doc = MxUtils.parseXml(xml);
 * let codec = new MxCodec(doc);
 * let elt = doc.documentElement.firstChild;
 * let cells = [];
 *
 * while (elt !== null)
 * {
 *   cells.push(codec.decode(elt));
 *   elt = elt.nextSibling;
 * }
 *
 * graph.addCells(cells);
 * (end)
 *
 * Example:
 *
 * Using the following code, the selection cells of a graph are encoded and the
 * output is displayed in a dialog box.
 *
 * (code)
 * let enc = new MxCodec();
 * let cells = graph.getSelectionCells();
 * MxUtils.alert(MxUtils.getPrettyXml(enc.encode(cells)));
 * (end)
 *
 * Newlines in the XML can be converted to <br>, in which case a '<br>' argument
 * must be passed to <MxUtils.getXml> as the second argument.
 *
 * Debugging:
 *
 * For debugging I/O you can use the following code to get the sequence of
 * encoded objects:
 *
 * (code)
 * let oldEncode = MxCodec.prototype.encode;
 * MxCodec.prototype.encode = function(obj)
 * {
 *   MxLog.show();
 *   MxLog.debug('MxCodec.encode: obj='+MxUtils.getFunctionName(obj.constructor));
 *
 *   return oldEncode.apply(this, arguments);
 * };
 * (end)
 *
 * Note that the I/O system adds object codecs for new object automatically. For
 * decoding those objects, the constructor should be written as follows:
 *
 * (code)
 * let MyObj = function(name)
 * {
 *   // ...
 * };
 * (end)
 *
 * Constructor: MxCodec
 *
 * Constructs an XML encoder/decoder for the specified
 * owner document.
 *
 * Parameters:
 *
 * document - Optional XML document that contains the data.
 * If no document is specified then a new document is created
 * using <MxUtils.createXmlDocument>.
 */
import MxUtils from '../util/MxUtils'
import MxConstants from '../util/MxConstants'
import MxCell from '../model/MxCell'
import MxCellPath from '../model/MxCellPath'
import MxCodecRegistry from './MxCodecRegistry'
import MxLog from '../util/MxLog'

export default class MxCodec {
  constructor(document) {
    this.document = document || MxUtils.createXmlDocument()
    this.objects = []
  };
}

/**
 * Variable: document
 *
 * The owner document of the codec.
 */
MxCodec.prototype.document = null

/**
 * Variable: objects
 *
 * Maps from IDs to objects.
 */
MxCodec.prototype.objects = null

/**
 * Variable: elements
 *
 * Lookup table for resolving IDs to elements.
 */
MxCodec.prototype.elements = null

/**
 * Variable: encodeDefaults
 *
 * Specifies if default values should be encoded. Default is false.
 */
MxCodec.prototype.encodeDefaults = false

/**
 * Function: putObject
 *
 * Assoiates the given object with the given ID and returns the given object.
 *
 * Parameters
 *
 * id - ID for the object to be associated with.
 * obj - Object to be associated with the ID.
 */
MxCodec.prototype.putObject = function(id, obj) {
  this.objects[id] = obj

  return obj
}

/**
 * Function: getObject
 *
 * Returns the decoded object for the element with the specified ID in
 * <document>. If the object is not known then <lookup> is used to find an
 * object. If no object is found, then the element with the respective ID
 * from the document is parsed using <decode>.
 */
MxCodec.prototype.getObject = function(id) {
  let obj = null

  if (id !== null) {
    obj = this.objects[id]

    if (obj === null) {
      obj = this.lookup(id)

      if (obj === null) {
        let node = this.getElementById(id)

        if (node !== null) {
          obj = this.decode(node)
        }
      }
    }
  }

  return obj
}

/**
 * Function: lookup
 *
 * Hook for subclassers to implement a custom lookup mechanism for cell IDs.
 * This implementation always returns null.
 *
 * Example:
 *
 * (code)
 * let codec = new MxCodec();
 * codec.lookup = function(id)
 * {
 *   return model.getCell(id);
 * };
 * (end)
 *
 * Parameters:
 *
 * id - ID of the object to be returned.
 */
MxCodec.prototype.lookup = function(id) {
  return null
}

/**
 * Function: getElementById
 *
 * Returns the element with the given ID from <document>.
 *
 * Parameters:
 *
 * id - String that contains the ID.
 */
MxCodec.prototype.getElementById = function(id) {
  if (this.elements === null) {
    // Throws custom error for cases where a reference should be resolved
    // in an empty document. This happens if an XML node is decoded without
    // passing the owner document to the codec constructor.
    if (this.document.documentElement === null) {
      throw new Error('MxCodec constructor needs document parameter')
    }

    this.elements = {}
    this.addElement(this.document.documentElement)
  }

  return this.elements[id]
}

/**
 * Function: addElement
 *
 * Adds the given element to <elements> if it has an ID.
 */
MxCodec.prototype.addElement = function(node) {
  if (node.nodeType === MxConstants.NODETYPE_ELEMENT) {
    let id = node.getAttribute('id')

    if (id !== null && this.elements[id] === null) {
      this.elements[id] = node
    }
  }

  node = node.firstChild

  while (node !== null) {
    this.addElement(node)
    node = node.nextSibling
  }
}

/**
 * Function: getId
 *
 * Returns the ID of the specified object. This implementation
 * calls <reference> first and if that returns null handles
 * the object as an <MxCell> by returning their IDs using
 * <MxCell.getId>. If no ID exists for the given cell, then
 * an on-the-fly ID is generated using <MxCellPath.create>.
 *
 * Parameters:
 *
 * obj - Object to return the ID for.
 */
MxCodec.prototype.getId = function(obj) {
  let id = null

  if (obj !== null) {
    id = this.reference(obj)

    if (id === null && obj instanceof MxCell) {
      id = obj.getId()

      if (id === null) {
        // Uses an on-the-fly Id
        id = MxCellPath.create(obj)

        if (id.length === 0) {
          id = 'root'
        }
      }
    }
  }

  return id
}

/**
 * Function: reference
 *
 * Hook for subclassers to implement a custom method
 * for retrieving IDs from objects. This implementation
 * always returns null.
 *
 * Example:
 *
 * (code)
 * let codec = new MxCodec();
 * codec.reference = function(obj)
 * {
 *   return obj.getCustomId();
 * };
 * (end)
 *
 * Parameters:
 *
 * obj - Object whose ID should be returned.
 */
MxCodec.prototype.reference = function(obj) {
  return null
}

/**
 * Function: encode
 *
 * Encodes the specified object and returns the resulting
 * XML node.
 *
 * Parameters:
 *
 * obj - Object to be encoded.
 */
MxCodec.prototype.encode = function(obj) {
  let node = null

  if (obj !== null && obj.constructor !== null) {
    let enc = MxCodecRegistry.getCodec(obj.constructor)

    if (enc !== null) {
      node = enc.encode(this, obj)
    } else {
      if (MxUtils.isNode(obj)) {
        node = MxUtils.importNode(this.document, obj, true)
      } else {
        MxLog.warn('MxCodec.encode: No codec for ' + MxUtils.getFunctionName(obj.constructor))
      }
    }
  }

  return node
}

/**
 * Function: decode
 *
 * Decodes the given XML node. The optional "into"
 * argument specifies an existing object to be
 * used. If no object is given, then a new instance
 * is created using the constructor from the codec.
 *
 * The function returns the passed in object or
 * the new instance if no object was given.
 *
 * Parameters:
 *
 * node - XML node to be decoded.
 * into - Optional object to be decodec into.
 */
MxCodec.prototype.decode = function(node, into) {
  let obj = null

  if (node !== null && node.nodeType === MxConstants.NODETYPE_ELEMENT) {
    let ctor = null

    try {
      ctor = window[node.nodeName]
    } catch (err) {
      // ignore
    }

    let dec = MxCodecRegistry.getCodec(ctor)

    if (dec !== null) {
      obj = dec.decode(this, node, into)
    } else {
      obj = node.cloneNode(true)
      obj.removeAttribute('as')
    }
  }

  return obj
}

/**
 * Function: encodeCell
 *
 * Encoding of cell hierarchies is built-into the core, but
 * is a higher-level function that needs to be explicitely
 * used by the respective object encoders (eg. <mxModelCodec>,
 * <mxChildChangeCodec> and <mxRootChangeCodec>). This
 * implementation writes the given cell and its children as a
 * (flat) sequence into the given node. The children are not
 * encoded if the optional includeChildren is false. The
 * function is in charge of adding the result into the
 * given node and has no return value.
 *
 * Parameters:
 *
 * cell - <MxCell> to be encoded.
 * node - Parent XML node to add the encoded cell into.
 * includeChildren - Optional boolean indicating if the
 * function should include all descendents. Default is true.
 */
MxCodec.prototype.encodeCell = function(cell, node, includeChildren) {
  node.appendChild(this.encode(cell))

  if (includeChildren === null || includeChildren) {
    let childCount = cell.getChildCount()

    for (let i = 0; i < childCount; i++) {
      this.encodeCell(cell.getChildAt(i), node)
    }
  }
}

/**
 * Function: isCellCodec
 *
 * Returns true if the given codec is a cell codec. This uses
 * <MxCellCodec.isCellCodec> to check if the codec is of the
 * given type.
 */
MxCodec.prototype.isCellCodec = function(codec) {
  if (codec !== null && typeof (codec.isCellCodec) === 'function') {
    return codec.isCellCodec()
  }

  return false
}

/**
 * Function: decodeCell
 *
 * Decodes cells that have been encoded using inversion, ie.
 * where the user object is the enclosing node in the XML,
 * and restores the group and graph structure in the cells.
 * Returns a new <MxCell> instance that represents the
 * given node.
 *
 * Parameters:
 *
 * node - XML node that contains the cell data.
 * restoreStructures - Optional boolean indicating whether
 * the graph structure should be restored by calling insert
 * and insertEdge on the parent and terminals, respectively.
 * Default is true.
 */
MxCodec.prototype.decodeCell = function(node, restoreStructures) {
  restoreStructures = (restoreStructures !== null) ? restoreStructures : true
  let cell = null

  if (node !== null && node.nodeType === MxConstants.NODETYPE_ELEMENT) {
    // Tries to find a codec for the given node name. If that does
    // not return a codec then the node is the user object (an XML node
    // that contains the MxCell, aka inversion).
    let decoder = MxCodecRegistry.getCodec(node.nodeName)

    // Tries to find the codec for the cell inside the user object.
    // This assumes all node names inside the user object are either
    // not registered or they correspond to a class for cells.
    if (!this.isCellCodec(decoder)) {
      let child = node.firstChild

      while (child !== null && !this.isCellCodec(decoder)) {
        decoder = MxCodecRegistry.getCodec(child.nodeName)
        child = child.nextSibling
      }
    }

    if (!this.isCellCodec(decoder)) {
      decoder = MxCodecRegistry.getCodec(MxCell)
    }

    cell = decoder.decode(this, node)

    if (restoreStructures) {
      this.insertIntoGraph(cell)
    }
  }

  return cell
}

/**
 * Function: insertIntoGraph
 *
 * Inserts the given cell into its parent and terminal cells.
 */
MxCodec.prototype.insertIntoGraph = function(cell) {
  let parent = cell.parent
  let source = cell.getTerminal(true)
  let target = cell.getTerminal(false)

  // Fixes possible inconsistencies during insert into graph
  cell.setTerminal(null, false)
  cell.setTerminal(null, true)
  cell.parent = null

  if (parent !== null) {
    parent.insert(cell)
  }

  if (source !== null) {
    source.insertEdge(cell, true)
  }

  if (target !== null) {
    target.insertEdge(cell, false)
  }
}

/**
 * Function: setAttribute
 *
 * Sets the attribute on the specified node to value. This is a
 * helper method that makes sure the attribute and value arguments
 * are not null.
 *
 * Parameters:
 *
 * node - XML node to set the attribute for.
 * attributes - Attributename to be set.
 * value - New value of the attribute.
 */
MxCodec.prototype.setAttribute = function(node, attribute, value) {
  if (attribute !== null && value !== null) {
    node.setAttribute(attribute, value)
  }
}
