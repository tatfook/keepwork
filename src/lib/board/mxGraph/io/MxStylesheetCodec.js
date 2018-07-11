/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxStylesheetCodec
 *
 * Codec for <MxStylesheet>s. This class is created and registered
 * dynamically at load time and used implicitely via <mxCodec>
 * and the <MxCodecRegistry>.
 */
import MxCodecRegistry from './MxCodecRegistry'
import MxObjectCodec from './MxObjectCodec'
import MxStylesheet from '../view/MxStylesheet'
import MxStyleRegistry from '../view/MxStyleRegistry'
import MxLog from '../util/MxLog'
import MxConstants from '../util/MxConstants'
import MxUtils from '../util/MxUtils'

export let MxStylesheetCodec = MxCodecRegistry.register(function() {
  let codec = new MxObjectCodec(new MxStylesheet())

  /**
 * Function: encode
 *
 * Encodes a stylesheet. See <decode> for a description of the
 * format.
 */
  codec.encode = function(enc, obj) {
    let node = enc.document.createElement(this.getName())

    for (let i in obj.styles) {
      let style = obj.styles[i]
      let styleNode = enc.document.createElement('add')

      if (i !== null) {
        styleNode.setAttribute('as', i)

        for (let j in style) {
          let value = this.getStringValue(j, style[j])

          if (value !== null) {
            let entry = enc.document.createElement('add')
            entry.setAttribute('value', value)
            entry.setAttribute('as', j)
            styleNode.appendChild(entry)
          }
        }

        if (styleNode.childNodes.length > 0) {
          node.appendChild(styleNode)
        }
      }
    }

    return node
  }

  /**
 * Function: getStringValue
 *
 * Returns the string for encoding the given value.
 */
  codec.getStringValue = function(key, value) {
    let type = typeof (value)
    let style
    let j
    if (type === 'function') {
      value = MxStyleRegistry.getName(style[j])
    } else if (type === 'object') {
      value = null
    }

    return value
  }

  /**
 * Function: decode
 *
 * Reads a sequence of the following child nodes
 * and attributes:
 *
 * Child Nodes:
 *
 * add - Adds a new style.
 *
 * Attributes:
 *
 * as - Name of the style.
 * extend - Name of the style to inherit from.
 *
 * Each node contains another sequence of add and remove nodes with the following
 * attributes:
 *
 * as - Name of the style (see <MxConstants>).
 * value - Value for the style.
 *
 * Instead of the value-attribute, one can put Javascript expressions into
 * the node as follows if <MxStylesheetCodec.allowEval> is true:
 * <add as="perimeter">mxPerimeter.RectanglePerimeter</add>
 *
 * A remove node will remove the entry with the name given in the as-attribute
 * from the style.
 *
 * Example:
 *
 * (code)
 * <MxStylesheet as="stylesheet">
 *   <add as="text">
 *     <add as="fontSize" value="12"/>
 *   </add>
 *   <add as="defaultVertex" extend="text">
 *     <add as="shape" value="rectangle"/>
 *   </add>
 * </MxStylesheet>
 * (end)
 */
  codec.decode = function(dec, node, into) {
    let obj = into || new this.template.constructor()
    let id = node.getAttribute('id')

    if (id !== null) {
      dec.objects[id] = obj
    }

    node = node.firstChild

    while (node !== null) {
      if (!this.processInclude(dec, node, obj) && node.nodeName === 'add') {
        let as = node.getAttribute('as')

        if (as !== null) {
          let extend = node.getAttribute('extend')
          let style = (extend !== null) ? MxUtils.clone(obj.styles[extend]) : null

          if (style === null) {
            if (extend !== null) {
              MxLog.warn('MxStylesheetCodec.decode: stylesheet ' + extend + ' not found to extend')
            }

            style = {}
          }

          let entry = node.firstChild

          while (entry !== null) {
            if (entry.nodeType === MxConstants.NODETYPE_ELEMENT) {
              let key = entry.getAttribute('as')

              if (entry.nodeName === 'add') {
                let text = MxUtils.getTextContent(entry)
                let value = null

                if (text !== null && text.length > 0 && MxStylesheetCodec.allowEval) {
                  value = MxUtils.eval(text)
                } else {
                  value = entry.getAttribute('value')

                  if (MxUtils.isNumeric(value)) {
                    value = parseFloat(value)
                  }
                }

                if (value !== null) {
                  style[key] = value
                }
              } else if (entry.nodeName === 'remove') {
                delete style[key]
              }
            }

            entry = entry.nextSibling
          }

          obj.putCellStyle(as, style)
        }
      }

      node = node.nextSibling
    }

    return obj
  }

  // Returns the codec into the registry
  return codec
}())

/**
 * Variable: allowEval
 *
 * Static global switch that specifies if the use of eval is allowed for
 * evaluating text content. Default is true. Set this to false if stylesheets
 * may contain user input.
 */
MxStylesheetCodec.allowEval = true
