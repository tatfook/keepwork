/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
import MxCodecRegistry from './MxCodecRegistry'
import MxObjectCodec from './MxObjectCodec'
import MxRootChange from './MxRootChange'
import MxConstants from '../util/MxConstants'

MxCodecRegistry.register(function() {
  /**
 * Class: MxRootChangeCodec
 *
 * Codec for <MxRootChange>s. This class is created and registered
 * dynamically at load time and used implicitely via <mxCodec> and
 * the <MxCodecRegistry>.
 *
 * Transient Fields:
 *
 * - model
 * - previous
 * - root
 */
  let codec = new MxObjectCodec(new MxRootChange(),
    ['model', 'previous', 'root'])

  /**
 * Function: onEncode
 *
 * Encodes the child recursively.
 */
  codec.afterEncode = function(enc, obj, node) {
    enc.encodeCell(obj.root, node)

    return node
  }

  /**
 * Function: beforeDecode
 *
 * Decodes the optional children as cells
 * using the respective decoder.
 */
  codec.beforeDecode = function(dec, node, obj) {
    if (node.firstChild !== null && node.firstChild.nodeType === MxConstants.NODETYPE_ELEMENT) {
      // Makes sure the original node isn't modified
      node = node.cloneNode(true)

      let tmp = node.firstChild
      obj.root = dec.decodeCell(tmp, false)

      let tmp2 = tmp.nextSibling
      tmp.parentNode.removeChild(tmp)
      tmp = tmp2

      while (tmp !== null) {
        tmp2 = tmp.nextSibling
        dec.decodeCell(tmp)
        tmp.parentNode.removeChild(tmp)
        tmp = tmp2
      }
    }

    return node
  }

  /**
 * Function: afterDecode
 *
 * Restores the state by assigning the previous value.
 */
  codec.afterDecode = function(dec, node, obj) {
    obj.previous = obj.root

    return obj
  }

  // Returns the codec into the registry
  return codec
}())
