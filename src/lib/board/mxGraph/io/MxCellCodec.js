import MxCodecRegistry from './MxCodecRegistry'
import MxObjectCodec from './MxObjectCodec'
import MxCell from '../model/MxCell'
import mxConstants from '../util/mxConstants'
import MxUtils from '../util/MxUtils'
/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
MxCodecRegistry.register(function() {
  /**
 * Class: MxCellCodec
 *
 * Codec for <MxCell>s. This class is created and registered
 * dynamically at load time and used implicitely via <mxCodec>
 * and the <MxCodecRegistry>.
 *
 * Transient Fields:
 *
 * - children
 * - edges
 * - overlays
 * - mxTransient
 *
 * Reference Fields:
 *
 * - parent
 * - source
 * - target
 *
 * Transient fields can be added using the following code:
 *
 * MxCodecRegistry.getCodec(MxCell).exclude.push('name_of_field');
 *
 * To subclass <MxCell>, replace the template and add an alias as
 * follows.
 *
 * (code)
 * function CustomCell(value, geometry, style)
 * {
 *   MxCell.apply(this, arguments);
 * }
 *
 * MxUtils.extend(CustomCell, MxCell);
 *
 * MxCodecRegistry.getCodec(MxCell).template = new CustomCell();
 * MxCodecRegistry.addAlias('CustomCell', 'MxCell');
 * (end)
 */
  let codec = new MxObjectCodec(new MxCell(),
    ['children', 'edges', 'overlays', 'mxTransient'],
    ['parent', 'source', 'target'])

  /**
 * Function: isCellCodec
 *
 * Returns true since this is a cell codec.
 */
  codec.isCellCodec = function() {
    return true
  }

  /**
 * Overidden to disable conversion of value to number.
 */
  codec.isNumericAttribute = function(dec, attr, obj) {
    return attr.nodeName !== 'value' && MxObjectCodec.prototype.isNumericAttribute.apply(this, arguments)
  }

  /**
 * Function: isExcluded
 *
 * Excludes user objects that are XML nodes.
 */
  codec.isExcluded = function(obj, attr, value, isWrite) {
    return MxObjectCodec.prototype.isExcluded.apply(this, arguments) || (isWrite && attr === 'value' && value.nodeType === mxConstants.NODETYPE_ELEMENT)
  }

  /**
 * Function: afterEncode
 *
 * Encodes an <MxCell> and wraps the XML up inside the
 * XML of the user object (inversion).
 */
  codec.afterEncode = function(enc, obj, node) {
    if (obj.value !== null && obj.value.nodeType === mxConstants.NODETYPE_ELEMENT) {
      // Wraps the graphical annotation up in the user object (inversion)
      // by putting the result of the default encoding into a clone of the
      // user object (node type 1) and returning this cloned user object.
      let tmp = node
      node = MxUtils.importNode(enc.document, obj.value, true)
      node.appendChild(tmp)

      // Moves the id attribute to the outermost XML node, namely the
      // node which denotes the object boundaries in the file.
      let id = tmp.getAttribute('id')
      node.setAttribute('id', id)
      tmp.removeAttribute('id')
    }

    return node
  }

  /**
 * Function: beforeDecode
 *
 * Decodes an <MxCell> and uses the enclosing XML node as
 * the user object for the cell (inversion).
 */
  codec.beforeDecode = function(dec, node, obj) {
    let inner = node.cloneNode(true)
    let classname = this.getName()

    if (node.nodeName !== classname) {
      // Passes the inner graphical annotation node to the
      // object codec for further processing of the cell.
      let tmp = node.getElementsByTagName(classname)[0]

      if (tmp !== null && tmp.parentNode === node) {
        MxUtils.removeWhitespace(tmp, true)
        MxUtils.removeWhitespace(tmp, false)
        tmp.parentNode.removeChild(tmp)
        inner = tmp
      } else {
        inner = null
      }

      // Creates the user object out of the XML node
      obj.value = node.cloneNode(true)
      let id = obj.value.getAttribute('id')

      if (id !== null) {
        obj.setId(id)
        obj.value.removeAttribute('id')
      }
    } else {
      // Uses ID from XML file as ID for cell in model
      obj.setId(node.getAttribute('id'))
    }

    // Preprocesses and removes all Id-references in order to use the
    // correct encoder (this) for the known references to cells (all).
    if (inner !== null) {
      for (let i = 0; i < this.idrefs.length; i++) {
        let attr = this.idrefs[i]
        let ref = inner.getAttribute(attr)

        if (ref !== null) {
          inner.removeAttribute(attr)
          let object = dec.objects[ref] || dec.lookup(ref)

          if (object === null) {
            // Needs to decode forward reference
            let element = dec.getElementById(ref)

            if (element !== null) {
              let decoder = MxCodecRegistry.codecs[element.nodeName] || this
              object = decoder.decode(dec, element)
            }
          }

          obj[attr] = object
        }
      }
    }

    return inner
  }

  // Returns the codec into the registry
  return codec
}())
