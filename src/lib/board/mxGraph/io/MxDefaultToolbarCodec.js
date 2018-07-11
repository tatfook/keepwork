/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxDefaultToolbarCodec
 *
 * Custom codec for configuring <MxDefaultToolbar>s. This class is created
 * and registered dynamically at load time and used implicitely via
 * <mxCodec> and the <MxCodecRegistry>. This codec only reads configuration
 * data for existing toolbars handlers, it does not encode or create toolbars.
 */
import MxCodecRegistry from './MxCodecRegistry'
import MxObjectCodec from './MxObjectCodec'
import MxDefaultToolbar from '../editor/MxDefaultToolbar'
import MxConstants from '../util/MxConstants'
import MxResources from '../util/MxResources'
import MxUtils from '../util/MxUtils'
import MxLog from '../util/MxLog'
import MxEvent from '../util/MxEvent'

export let MxDefaultToolbarCodec = MxCodecRegistry.register(function() {
  let codec = new MxObjectCodec(new MxDefaultToolbar())

  /**
 * Function: encode
 *
 * Returns null.
 */
  codec.encode = function(enc, obj) {
    return null
  }

  /**
 * Function: decode
 *
 * Reads a sequence of the following child nodes
 * and attributes:
 *
 * Child Nodes:
 *
 * add - Adds a new item to the toolbar. See below for attributes.
 * separator - Adds a vertical separator. No attributes.
 * hr - Adds a horizontal separator. No attributes.
 * br - Adds a linefeed. No attributes.
 *
 * Attributes:
 *
 * as - Resource key for the label.
 * action - Name of the action to execute in enclosing editor.
 * mode - Modename (see below).
 * template - Template name for cell insertion.
 * style - Optional style to override the template style.
 * icon - Icon (relative/absolute URL).
 * pressedIcon - Optional icon for pressed state (relative/absolute URL).
 * id - Optional ID to be used for the created DOM element.
 * toggle - Optional 0 or 1 to disable toggling of the element. Default is
 * 1 (true).
 *
 * The action, mode and template attributes are mutually exclusive. The
 * style can only be used with the template attribute. The add node may
 * contain another sequence of add nodes with as and action attributes
 * to create a combo box in the toolbar. If the icon is specified then
 * a list of the child node is expected to have its template attribute
 * set and the action is ignored instead.
 *
 * Nodes with a specified template may define a function to be used for
 * inserting the cloned template into the graph. Here is an example of such
 * a node:
 *
 * (code)
 * <add as="Swimlane" template="swimlane" icon="images/swimlane.gif"><![CDATA[
 *   function (editor, cell, evt, targetCell)
 *   {
 *     let pt = MxUtils.convertPoint(
 *       editor.graph.container, MxEvent.getClientX(evt),
 *         MxEvent.getClientY(evt));
 *     return editor.addVertex(targetCell, cell, pt.x, pt.y);
 *   }
 * ]]></add>
 * (end)
 *
 * In the above function, editor is the enclosing <mxEditor> instance, cell
 * is the clone of the template, evt is the mouse event that represents the
 * drop and targetCell is the cell under the mousepointer where the drop
 * occurred. The targetCell is retrieved using <mxGraph.getCellAt>.
 *
 * Futhermore, nodes with the mode attribute may define a function to
 * be executed upon selection of the respective toolbar icon. In the
 * example below, the default edge style is set when this specific
 * connect-mode is activated:
 *
 * (code)
 * <add as="connect" mode="connect"><![CDATA[
 *   function (editor)
 *   {
 *     if (editor.defaultEdge !== null)
 *     {
 *       editor.defaultEdge.style = 'straightEdge';
 *     }
 *   }
 * ]]></add>
 * (end)
 *
 * Both functions require <MxDefaultToolbarCodec.allowEval> to be set to true.
 *
 * Modes:
 *
 * select - Left mouse button used for rubberband- & cell-selection.
 * connect - Allows connecting vertices by inserting new edges.
 * pan - Disables selection and switches to panning on the left button.
 *
 * Example:
 *
 * To add items to the toolbar:
 *
 * (code)
 * <MxDefaultToolbar as="toolbar">
 *   <add as="save" action="save" icon="images/save.gif"/>
 *   <br/><hr/>
 *   <add as="select" mode="select" icon="images/select.gif"/>
 *   <add as="connect" mode="connect" icon="images/connect.gif"/>
 * </MxDefaultToolbar>
 * (end)
 */
  codec.decode = function(dec, node, into) {
    if (into !== null) {
      let editor = into.editor
      node = node.firstChild

      while (node !== null) {
        if (node.nodeType === MxConstants.NODETYPE_ELEMENT) {
          if (!this.processInclude(dec, node, into)) {
            if (node.nodeName === 'separator') {
              into.addSeparator()
            } else if (node.nodeName === 'br') {
              into.toolbar.addBreak()
            } else if (node.nodeName === 'hr') {
              into.toolbar.addLine()
            } else if (node.nodeName === 'add') {
              let as = node.getAttribute('as')
              as = MxResources.get(as) || as
              let icon = node.getAttribute('icon')
              let pressedIcon = node.getAttribute('pressedIcon')
              let action = node.getAttribute('action')
              let mode = node.getAttribute('mode')
              let template = node.getAttribute('template')
              let toggle = node.getAttribute('toggle') !== '0'
              let text = MxUtils.getTextContent(node)
              let elt = null

              if (action !== null) {
                elt = into.addItem(as, icon, action, pressedIcon)
              } else if (mode !== null) {
                let funct = (MxDefaultToolbarCodec.allowEval) ? MxUtils.eval(text) : null
                elt = into.addMode(as, icon, mode, pressedIcon, funct)
              } else if (template !== null || (text !== null && text.length > 0)) {
                let cell = editor.templates[template]
                let style = node.getAttribute('style')

                if (cell !== null && style !== null) {
                  cell = editor.graph.cloneCells([cell])[0]
                  cell.setStyle(style)
                }

                let insertFunction = null

                if (text !== null && text.length > 0 && MxDefaultToolbarCodec.allowEval) {
                  insertFunction = MxUtils.eval(text)
                }

                elt = into.addPrototype(as, icon, cell, pressedIcon, insertFunction, toggle)
              } else {
                let children = MxUtils.getChildNodes(node)

                if (children.length > 0) {
                  if (icon === null) {
                    let combo = into.addActionCombo(as)

                    for (let i = 0; i < children.length; i++) {
                      let child = children[i]

                      if (child.nodeName === 'separator') {
                        into.addOption(combo, '---')
                      } else if (child.nodeName === 'add') {
                        let lab = child.getAttribute('as')
                        let act = child.getAttribute('action')
                        into.addActionOption(combo, lab, act)
                      }
                    }
                  } else {
                    let select = null
                    let create = function() {
                      let template = editor.templates[select.value]

                      if (template !== null) {
                        let clone = template.clone()
                        let style = select.options[select.selectedIndex].cellStyle

                        if (style !== null) {
                          clone.setStyle(style)
                        }

                        return clone
                      } else {
                        MxLog.warn('Template ' + template + ' not found')
                      }

                      return null
                    }

                    let img = into.addPrototype(as, icon, create, null, null, toggle)
                    select = into.addCombo()

                    // Selects the toolbar icon if a selection change
                    // is made in the corresponding combobox.
                    MxEvent.addListener(select, 'change', function() {
                      into.toolbar.selectMode(img, function(evt) {
                        let pt = MxUtils.convertPoint(editor.graph.container,
                          MxEvent.getClientX(evt), MxEvent.getClientY(evt))

                        return editor.addVertex(null, funct(), pt.x, pt.y)
                      })

                      into.toolbar.noReset = false
                    })

                    // Adds the entries to the combobox
                    for (let i = 0; i < children.length; i++) {
                      let child = children[i]

                      if (child.nodeName === 'separator') {
                        into.addOption(select, '---')
                      } else if (child.nodeName === 'add') {
                        let lab = child.getAttribute('as')
                        let tmp = child.getAttribute('template')
                        let option = into.addOption(select, lab, tmp || template)
                        option.cellStyle = child.getAttribute('style')
                      }
                    }
                  }
                }
              }

              // Assigns an ID to the created element to access it later.
              if (elt !== null) {
                let id = node.getAttribute('id')

                if (id !== null && id.length > 0) {
                  elt.setAttribute('id', id)
                }
              }
            }
          }
        }

        node = node.nextSibling
      }
    }

    return into
  }

  // Returns the codec into the registry
  return codec
}())

/**
 * Variable: allowEval
 *
 * Static global switch that specifies if the use of eval is allowed for
 * evaluating text content. Default is true. Set this to false if stylesheets
 * may contain user input
 */
MxDefaultToolbarCodec.allowEval = true
