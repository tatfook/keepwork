/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new graph editor
 */
import MxEventSource from '@/util/MxEventSource.js'
import MxClient from '@/lib/board/mxGraph/MxClient.js'
import Editor from '@/lib/board/drawio/js/Editor.js'
import MxPopupMenu from '@/lib/board/mxGraph/util/MxPopupMenu.js'
import MxConnectionHandler from '@/lib/board/mxGraph/handler/MxConnectionHandler.js'
import MxEvent from '@/lib/board/mxGraph/util/MxEvent.js'
import Actions from './Actions.js'
import MxUtils from '@/lib/board/mxGraph/util/MxUtils.js'
import MxResources from '@/lib/board/mxGraph/util/MxResources.js'
import MxConstants from '@/lib/board/mxGraph/util/MxConstants.js'
import MxKeyHandler from '@/lib/board/mxGraph/handler/MxKeyHandler.js'
import MxEventObject from '@/lib/board/mxGraph/util/MxEventObject.js'
import Menus from './Menus.js'
import MxClipboard from '@/lib/board/mxGraph/util/MxClipboard.js'
import MxPoint from '@/lib/board/mxGraph/util/MxPoint.js'
import MxRectangle from '@/lib/board/mxGraph/util/MxRectangle.js'
import { HoverIcons, Graph } from './Graph.js'
import MxObjectCodec from '@/lib/board/mxGraph/io/MxObjectCodec.js'
import MxCodecRegistry from '@/lib/board/mxGraph/io/MxCodecRegistry.js'
import Toolbar from './Toolbar.js'
import Sidebar from './Sidebar.js'
import Format from './Format.js'
import Dialog from '@/lib/board/Dialog.js'
import MxXmlRequest from '@/lib/board/mxGraph/util/MxXmlRequest.js'
import MxMorphing from '@/lib/board/mxGraph/util/MxMorphing.js'
import MxImage from '@/lib/board/mxGraph/util/MxImage.js'
import MxOutline from '@/lib/board/mxGraph/view/MxOutline.js'
import MxStackLayout from '@/lib/board/mxGraph/layout/MxStackLayout.js'
import { ColorDialog, OpenDialog, FilenameDialog, LinkDialog } from './Dialogs'
import { OpenFile } from './Editor'

export default class EditorUi {
  constructor(editor, container, lightbox) {
    MxEventSource.call(this)

    this.destroyFunctions = []
    this.editor = editor || new Editor()
    this.container = container || document.body

    let graph = this.editor.graph
    graph.lightbox = lightbox

    // Pre-fetches submenu image or replaces with embedded image if supported
    if (MxClient.IS_SVG) {
      MxPopupMenu.prototype.submenuImage = 'data:image/gif;base64,R0lGODlhCQAJAIAAAP///zMzMyH5BAEAAAAALAAAAAAJAAkAAAIPhI8WebHsHopSOVgb26AAADs='
    } else {
      new Image().src = MxPopupMenu.prototype.submenuImage
    }

    // Pre-fetches connect image
    if (!MxClient.IS_SVG && MxConnectionHandler.prototype.connectImage !== null) {
      new Image().src = MxConnectionHandler.prototype.connectImage.src
    }

    // Disables graph and forced panning in chromeless mode
    if (this.editor.chromeless && !this.editor.editable) {
      this.footerHeight = 0
      graph.isEnabled = () => {
        return false
      }
      graph.panningHandler.isForcePanningEvent = (me) => {
        return !MxEvent.isPopupTrigger(me.getEvent())
      }
    }

    // Creates the user interface
    this.actions = new Actions(this)
    this.menus = this.createMenus()
    this.createDivs()
    this.createUi()
    this.refresh()

    // Disables HTML and text selection
    let textEditing = MxUtils.bind(this, (evt) => {
      if (evt === null) {
        evt = window.event
      }

      return this.isSelectionAllowed(evt) || graph.isEditing()
    })

    // Disables text selection while not editing and no dialog visible
    if (this.container === document.body) {
      this.menubarContainer.onselectstart = textEditing
      this.menubarContainer.onmousedown = textEditing
      this.toolbarContainer.onselectstart = textEditing
      this.toolbarContainer.onmousedown = textEditing
      this.diagramContainer.onselectstart = textEditing
      this.diagramContainer.onmousedown = textEditing
      this.sidebarContainer.onselectstart = textEditing
      this.sidebarContainer.onmousedown = textEditing
      this.formatContainer.onselectstart = textEditing
      this.formatContainer.onmousedown = textEditing
      this.footerContainer.onselectstart = textEditing
      this.footerContainer.onmousedown = textEditing

      if (this.tabContainer !== null) {
        // Mouse down is needed for drag and drop
        this.tabContainer.onselectstart = textEditing
      }
    }

    // And uses built-in context menu while editing
    if (!this.editor.chromeless || this.editor.editable) {
      // Allows context menu for links in hints
      let linkHandler = (evt) => {
        let source = MxEvent.getSource(evt)

        if (source.nodeName === 'A') {
          while (source !== null) {
            if (source.className === 'geHint') {
              return true
            }

            source = source.parentNode
          }
        }

        return textEditing(evt)
      }

      if (MxClient.IS_IE && (typeof document.documentMode === 'undefined' || document.documentMode < 9)) {
        MxEvent.addListener(this.diagramContainer, 'contextmenu', linkHandler)
      } else {
        // Allows browser context menu outside of diagram and sidebar
        this.diagramContainer.oncontextmenu = linkHandler
      }
    } else {
      graph.panningHandler.usePopupTrigger = false
    }

    // Contains the main graph instance inside the given panel
    graph.init(this.diagramContainer)

    // Improves line wrapping for in-place editor
    if (MxClient.IS_SVG && graph.view.getDrawPane() !== null) {
      let root = graph.view.getDrawPane().ownerSVGElement

      if (root !== null) {
        root.style.position = 'absolute'
      }
    }

    // Creates hover icons
    this.hoverIcons = this.createHoverIcons()

    // Adds tooltip when mouse is over scrollbars to show space-drag panning option
    MxEvent.addListener(
      this.diagramContainer,
      'mousemove',
      MxUtils.bind(this, (evt) => {
        let off = MxUtils.getOffset(this.diagramContainer)

        if (MxEvent.getClientX(evt) - off.x - this.diagramContainer.clientWidth > 0 || MxEvent.getClientY(evt) - off.y - this.diagramContainer.clientHeight > 0) {
          this.diagramContainer.setAttribute('title', MxResources.get('panTooltip'))
        } else {
          this.diagramContainer.removeAttribute('title')
        }
      })
    )

    // Escape key hides dialogs, adds space+drag panning
    let spaceKeyPressed = false

    // Overrides hovericons to disable while space key is pressed
    let hoverIconsIsResetEvent = this.hoverIcons.isResetEvent

    this.hoverIcons.isResetEvent = (evt, allowShift) => {
      return spaceKeyPressed || hoverIconsIsResetEvent.apply(this, arguments)
    }

    this.keydownHandler = MxUtils.bind(this, (evt) => {
      if (evt.which === 32 /* Space */) {
        spaceKeyPressed = true
        this.hoverIcons.reset()
        graph.container.style.cursor = 'move'

        // Disables scroll after space keystroke with scrollbars
        if (!graph.isEditing() && MxEvent.getSource(evt) === graph.container) {
          MxEvent.consume(evt)
        }
      } else if (!MxEvent.isConsumed(evt) && evt.keyCode === 27 /* Escape */) {
        this.hideDialog()
      }
    })

    MxEvent.addListener(document, 'keydown', this.keydownHandler)

    this.keyupHandler = MxUtils.bind(this, (evt) => {
      graph.container.style.cursor = ''
      spaceKeyPressed = false
    })

    MxEvent.addListener(document, 'keyup', this.keyupHandler)

    // Forces panning for middle and right mouse buttons
    let panningHandlerIsForcePanningEvent = graph.panningHandler.isForcePanningEvent
    graph.panningHandler.isForcePanningEvent = (me) => {
      // Ctrl+left button is reported as right button in FF on Mac
      return (
        panningHandlerIsForcePanningEvent.apply(this, arguments) ||
        spaceKeyPressed ||
        (MxEvent.isMouseEvent(me.getEvent()) &&
          (this.usePopupTrigger || !MxEvent.isPopupTrigger(me.getEvent())) &&
          ((!MxEvent.isControlDown(me.getEvent()) &&
            MxEvent.isRightMouseButton(me.getEvent())) ||
            MxEvent.isMiddleMouseButton(me.getEvent())))
      )
    }

    // Ctrl/Cmd+Enter applies editing value except in Safari where Ctrl+Enter creates
    // a new line (while Enter creates a new paragraph and Shift+Enter stops)
    let cellEditorIsStopEditingEvent = graph.cellEditor.isStopEditingEvent
    graph.cellEditor.isStopEditingEvent = (evt) => {
      return (
        cellEditorIsStopEditingEvent.apply(this, arguments) ||
        (evt.keyCode === 13 &&
          ((!MxClient.IS_SF && MxEvent.isControlDown(evt)) ||
            (MxClient.IS_MAC && MxEvent.isMetaDown(evt)) ||
            (MxClient.IS_SF && MxEvent.isShiftDown(evt))))
      )
    }

    // Switches toolbar for text editing
    let textMode = false
    let fontMenu = null
    let sizeMenu = null
    let nodes = null

    let updateToolbar = MxUtils.bind(this, () => {
      if (this.toolbar !== null && textMode !== graph.cellEditor.isContentEditing()) {
        let node = this.toolbar.container.firstChild
        let newNodes = []

        while (node !== null) {
          let tmp = node.nextSibling

          if (MxUtils.indexOf(this.toolbar.staticElements, node) < 0) {
            node.parentNode.removeChild(node)
            newNodes.push(node)
          }

          node = tmp
        }

        // Saves references to special items
        let tmp1 = this.toolbar.fontMenu
        let tmp2 = this.toolbar.sizeMenu

        if (nodes === null) {
          this.toolbar.createTextToolbar()
        } else {
          for (let i = 0; i < nodes.length; i++) {
            this.toolbar.container.appendChild(nodes[i])
          }

          // Restores references to special items
          this.toolbar.fontMenu = fontMenu
          this.toolbar.sizeMenu = sizeMenu
        }

        textMode = graph.cellEditor.isContentEditing()
        fontMenu = tmp1
        sizeMenu = tmp2
        nodes = newNodes
      }
    })

    let ui = this

    // Overrides cell editor to update toolbar
    let cellEditorStartEditing = graph.cellEditor.startEditing
    graph.cellEditor.startEditing = () => {
      cellEditorStartEditing.apply(this, arguments)
      updateToolbar()

      if (graph.cellEditor.isContentEditing()) {
        let updating = false

        let updateCssHandler = () => {
          if (!updating) {
            updating = true

            window.setTimeout(() => {
              let selectedElement = graph.getSelectedElement()
              let node = selectedElement

              while (node !== null && node.nodeType !== MxConstants.NODETYPE_ELEMENT) {
                node = node.parentNode
              }

              if (node !== null) {
                let css = MxUtils.getCurrentStyle(node)

                if (css !== null && ui.toolbar !== null) {
                  // Strips leading and trailing quotes
                  let ff = css.fontFamily

                  if (ff.charAt(0) === "'") {
                    ff = ff.substring(1)
                  }

                  if (ff.charAt(ff.length - 1) === "'") {
                    ff = ff.substring(0, ff.length - 1)
                  }

                  ui.toolbar.setFontName(ff)
                  ui.toolbar.setFontSize(parseInt(css.fontSize))
                }
              }

              updating = false
            }, 0)
          }
        }

        MxEvent.addListener(
          graph.cellEditor.textarea,
          'input',
          updateCssHandler
        )
        MxEvent.addListener(
          graph.cellEditor.textarea,
          'touchend',
          updateCssHandler
        )
        MxEvent.addListener(
          graph.cellEditor.textarea,
          'mouseup',
          updateCssHandler
        )
        MxEvent.addListener(
          graph.cellEditor.textarea,
          'keyup',
          updateCssHandler
        )
        updateCssHandler()
      }
    }

    let cellEditorStopEditing = graph.cellEditor.stopEditing
    graph.cellEditor.stopEditing = (cell, trigger) => {
      cellEditorStopEditing.apply(this, arguments)
      updateToolbar()
    }

    // Enables scrollbars and sets cursor style for the container
    graph.container.setAttribute('tabindex', '0')
    graph.container.style.cursor = 'default'

    // Workaround for page scroll if embedded via iframe
    if (window.self === window.top && graph.container.parentNode !== null) {
      try {
        graph.container.focus()
      } catch (e) {
        // ignores error in old versions of IE
      }
    }

    // Keeps graph container focused on mouse down
    let graphFireMouseEvent = graph.fireMouseEvent
    graph.fireMouseEvent = function(evtName, me, sender) {
      if (evtName === MxEvent.MOUSE_DOWN) {
        this.container.focus()
      }

      graphFireMouseEvent.apply(this, arguments)
    }

    // Configures automatic expand on mouseover
    graph.popupMenuHandler.autoExpand = true

    // Installs context menu
    if (this.menus !== null) {
      graph.popupMenuHandler.factoryMethod = MxUtils.bind(this, (menu, cell, evt) => {
        this.menus.createPopupMenu(menu, cell, evt)
      })
    }

    // Hides context menu
    MxEvent.addGestureListeners(
      document,
      MxUtils.bind(this, (evt) => {
        graph.popupMenuHandler.hideMenu()
      })
    )

    // Create handler for key events
    this.keyHandler = this.createKeyHandler(editor)

    // Getter for key handler
    this.getKeyHandler = () => {
      return window.keyHandler
    }

    // Stores the current style and assigns it to new cells
    let styles = [
      'rounded',
      'shadow',
      'glass',
      'dashed',
      'dashPattern',
      'comic',
      'labelBackgroundColor'
    ]
    let connectStyles = [
      'shape',
      'edgeStyle',
      'curved',
      'rounded',
      'elbow',
      'comic',
      'jumpStyle',
      'jumpSize'
    ]

    // Note: Everything that is not in styles is ignored (styles is augmented below)
    this.setDefaultStyle = (cell) => {
      let state = graph.view.getState(cell)

      if (state !== null) {
        // Ignores default styles
        let clone = cell.clone()
        clone.style = ''
        let defaultStyle = graph.getCellStyle(clone)
        let values = []
        let keys = []

        for (let key in state.style) {
          if (defaultStyle[key] !== state.style[key]) {
            values.push(state.style[key])
            keys.push(key)
          }
        }

        // Handles special case for value "none"
        let cellStyle = graph.getModel().getStyle(state.cell)
        let tokens = cellStyle !== null ? cellStyle.split(';') : []

        for (let i = 0; i < tokens.length; i++) {
          let tmp = tokens[i]
          let pos = tmp.indexOf('=')

          if (pos >= 0) {
            let key = tmp.substring(0, pos)
            let value = tmp.substring(pos + 1)

            if (defaultStyle[key] !== null && value === 'none') {
              values.push(value)
              keys.push(key)
            }
          }
        }

        // Resets current style
        if (graph.getModel().isEdge(state.cell)) {
          graph.currentEdgeStyle = {}
        } else {
          graph.currentVertexStyle = {}
        }

        this.fireEvent(new MxEventObject('styleChanged', 'keys', keys, 'values', values, 'cells', [state.cell]))
      }
    }

    this.clearDefaultStyle = () => {
      graph.currentEdgeStyle = MxUtils.clone(graph.defaultEdgeStyle)
      graph.currentVertexStyle = MxUtils.clone(graph.defaultVertexStyle)

      // Updates UI
      this.fireEvent(new MxEventObject('styleChanged', 'keys', [], 'values', [], 'cells', []))
    }

    // Keys that should be ignored if the cell has a value (known: new default for all cells is html=1 so
    // for the html key this effecticely only works for edges inserted via the connection handler)
    let valueStyles = ['fontFamily', 'fontSize', 'fontColor']

    // Keys that always update the current edge style regardless of selection
    let alwaysEdgeStyles = [
      'edgeStyle',
      'startArrow',
      'startFill',
      'startSize',
      'endArrow',
      'endFill',
      'endSize',
      'jettySize',
      'orthogonalLoop'
    ]

    // Keys that are ignored together (if one appears all are ignored)
    let keyGroups = [
      [
        'startArrow',
        'startFill',
        'startSize',
        'endArrow',
        'endFill',
        'endSize',
        'jettySize',
        'orthogonalLoop'
      ],
      ['strokeColor', 'strokeWidth'],
      ['fillColor', 'gradientColor'],
      valueStyles,
      ['align'],
      ['html']
    ]

    // Adds all keys used above to the styles array
    for (let i = 0; i < keyGroups.length; i++) {
      for (let j = 0; j < keyGroups[i].length; j++) {
        styles.push(keyGroups[i][j])
      }
    }

    for (let i = 0; i < connectStyles.length; i++) {
      if (MxUtils.indexOf(styles, connectStyles[i]) < 0) {
        styles.push(connectStyles[i])
      }
    }

    // Implements a global current style for edges and vertices that is applied to new cells
    let insertHandler = (cells, asText) => {
      let model = graph.getModel()

      model.beginUpdate()
      try {
        // Applies only basic text styles
        if (asText) {
          let cell
          let edge = model.isEdge(cell)
          let current = edge ? graph.currentEdgeStyle : graph.currentVertexStyle
          let textStyles = ['fontSize', 'fontFamily', 'fontColor']

          for (let j = 0; j < textStyles.length; j++) {
            let value = current[textStyles[j]]

            if (value !== null) {
              graph.setCellStyles(textStyles[j], value, cells)
            }
          }
        } else {
          for (let i = 0; i < cells.length; i++) {
            let cell = cells[i]

            // Removes styles defined in the cell style from the styles to be applied
            let cellStyle = model.getStyle(cell)
            let tokens = cellStyle !== null ? cellStyle.split(';') : []
            let appliedStyles = styles.slice()

            for (let j = 0; j < tokens.length; j++) {
              let tmp = tokens[j]
              let pos = tmp.indexOf('=')

              if (pos >= 0) {
                let key = tmp.substring(0, pos)
                let index = MxUtils.indexOf(appliedStyles, key)

                if (index >= 0) {
                  appliedStyles.splice(index, 1)
                }

                // Handles special cases where one defined style ignores other styles
                for (let k = 0; k < keyGroups.length; k++) {
                  let group = keyGroups[k]

                  if (MxUtils.indexOf(group, key) >= 0) {
                    for (let l = 0; l < group.length; l++) {
                      let index2 = MxUtils.indexOf(appliedStyles, group[l])

                      if (index2 >= 0) {
                        appliedStyles.splice(index2, 1)
                      }
                    }
                  }
                }
              }
            }

            // Applies the current style to the cell
            let edge = model.isEdge(cell)
            let current = edge ? graph.currentEdgeStyle : graph.currentVertexStyle
            let newStyle = model.getStyle(cell)

            for (let j = 0; j < appliedStyles.length; j++) {
              let key = appliedStyles[j]
              let styleValue = current[key]

              if (styleValue !== null && (key !== 'shape' || edge)) {
                // Special case: Connect styles are not applied here but in the connection handler
                if (!edge || MxUtils.indexOf(connectStyles, key) < 0) {
                  newStyle = MxUtils.setStyle(newStyle, key, styleValue)
                }
              }
            }

            model.setStyle(cell, newStyle)
          }
        }
      } finally {
        model.endUpdate()
      }
    }

    graph.addListener('cellsInserted', (sender, evt) => {
      insertHandler(evt.getProperty('cells'))
    })

    graph.addListener('textInserted', (sender, evt) => {
      insertHandler(evt.getProperty('cells'), true)
    })

    graph.connectionHandler.addListener(MxEvent.CONNECT, (sender, evt) => {
      let cells = [evt.getProperty('cell')]

      if (evt.getProperty('terminalInserted')) {
        cells.push(evt.getProperty('terminal'))
      }

      insertHandler(cells)
    })

    this.addListener(
      'styleChanged',
      MxUtils.bind(this, (sender, evt) => {
        // Checks if edges and/or vertices were modified
        let cells = evt.getProperty('cells')
        let vertex = false
        let edge = false

        if (cells.length > 0) {
          for (let i = 0; i < cells.length; i++) {
            vertex = graph.getModel().isVertex(cells[i]) || vertex
            edge = graph.getModel().isEdge(cells[i]) || edge

            if (edge && vertex) {
              break
            }
          }
        } else {
          vertex = true
          edge = true
        }

        let keys = evt.getProperty('keys')
        let values = evt.getProperty('values')

        for (let i = 0; i < keys.length; i++) {
          let common = MxUtils.indexOf(valueStyles, keys[i]) >= 0

          // Ignores transparent stroke colors
          if (
            keys[i] !== 'strokeColor' ||
            (values[i] !== null && values[i] !== 'none')
          ) {
            // Special case: Edge style and shape
            if (MxUtils.indexOf(connectStyles, keys[i]) >= 0) {
              if (edge || MxUtils.indexOf(alwaysEdgeStyles, keys[i]) >= 0) {
                if (values[i] === null) {
                  delete graph.currentEdgeStyle[keys[i]]
                } else {
                  graph.currentEdgeStyle[keys[i]] = values[i]
                }
              } else if (vertex && MxUtils.indexOf(styles, keys[i]) >= 0) {
                // Uses style for vertex if defined in styles
                if (values[i] == null) {
                  delete graph.currentVertexStyle[keys[i]]
                } else {
                  graph.currentVertexStyle[keys[i]] = values[i]
                }
              }
            } else if (MxUtils.indexOf(styles, keys[i]) >= 0) {
              if (vertex || common) {
                if (values[i] == null) {
                  delete graph.currentVertexStyle[keys[i]]
                } else {
                  graph.currentVertexStyle[keys[i]] = values[i]
                }
              }

              if (edge || common || MxUtils.indexOf(alwaysEdgeStyles, keys[i]) >= 0
              ) {
                if (values[i] == null) {
                  delete graph.currentEdgeStyle[keys[i]]
                } else {
                  graph.currentEdgeStyle[keys[i]] = values[i]
                }
              }
            }
          }
        }

        if (this.toolbar !== null) {
          this.toolbar.setFontName(
            graph.currentVertexStyle['fontFamily'] || Menus.prototype.defaultFont)
          this.toolbar.setFontSize(
            graph.currentVertexStyle['fontSize'] || Menus.prototype.defaultFontSize
          )

          if (this.toolbar.edgeStyleMenu !== null) {
            // Updates toolbar icon for edge style
            let edgeStyleDiv = this.toolbar.edgeStyleMenu.getElementsByTagName('div')[0]

            if (graph.currentEdgeStyle['edgeStyle'] === 'orthogonalEdgeStyle' && graph.currentEdgeStyle['curved'] === '1') {
              edgeStyleDiv.className = 'geSprite geSprite-curved'
            } else if (graph.currentEdgeStyle['edgeStyle'] === 'straight' || graph.currentEdgeStyle['edgeStyle'] === 'none' || graph.currentEdgeStyle['edgeStyle'] === null) {
              edgeStyleDiv.className = 'geSprite geSprite-straight'
            } else if (graph.currentEdgeStyle['edgeStyle'] === 'entityRelationEdgeStyle') {
              edgeStyleDiv.className = 'geSprite geSprite-entity'
            } else if (graph.currentEdgeStyle['edgeStyle'] === 'elbowEdgeStyle') {
              edgeStyleDiv.className = 'geSprite geSprite-' + (graph.currentEdgeStyle['elbow'] === 'vertical' ? 'verticalelbow' : 'horizontalelbow')
            } else if (graph.currentEdgeStyle['edgeStyle'] === 'isometricEdgeStyle') {
              edgeStyleDiv.className = 'geSprite geSprite-' + (graph.currentEdgeStyle['elbow'] === 'vertical' ? 'verticalisometric' : 'horizontalisometric')
            } else {
              edgeStyleDiv.className = 'geSprite geSprite-orthogonal'
            }
          }

          if (this.toolbar.edgeShapeMenu !== null) {
            // Updates icon for edge shape
            let edgeShapeDiv = this.toolbar.edgeShapeMenu.getElementsByTagName('div')[0]

            if (graph.currentEdgeStyle['shape'] === 'link') {
              edgeShapeDiv.className = 'geSprite geSprite-linkedge'
            } else if (graph.currentEdgeStyle['shape'] === 'flexArrow') {
              edgeShapeDiv.className = 'geSprite geSprite-arrow'
            } else if (graph.currentEdgeStyle['shape'] === 'arrow') {
              edgeShapeDiv.className = 'geSprite geSprite-simplearrow'
            } else {
              edgeShapeDiv.className = 'geSprite geSprite-connection'
            }
          }

          // Updates icon for optinal line start shape
          if (this.toolbar.lineStartMenu !== null) {
            let lineStartDiv = this.toolbar.lineStartMenu.getElementsByTagName('div')[0]

            lineStartDiv.className = this.getCssClassForMarker(
              'start',
              graph.currentEdgeStyle['shape'],
              graph.currentEdgeStyle[MxConstants.STYLE_STARTARROW],
              MxUtils.getValue(graph.currentEdgeStyle, 'startFill', '1')
            )
          }

          // Updates icon for optinal line end shape
          if (this.toolbar.lineEndMenu !== null) {
            let lineEndDiv = this.toolbar.lineEndMenu.getElementsByTagName('div')[0]

            lineEndDiv.className = this.getCssClassForMarker(
              'end',
              graph.currentEdgeStyle['shape'],
              graph.currentEdgeStyle[MxConstants.STYLE_ENDARROW],
              MxUtils.getValue(graph.currentEdgeStyle, 'endFill', '1')
            )
          }
        }
      })
    )

    // Update font size and font family labels
    if (this.toolbar !== null) {
      let update = MxUtils.bind(this, () => {
        let ff = graph.currentVertexStyle['fontFamily'] || 'Helvetica'
        let fs = String(graph.currentVertexStyle['fontSize'] || '12')
        let state = graph.getView().getState(graph.getSelectionCell())

        if (state !== null) {
          ff = state.style[MxConstants.STYLE_FONTFAMILY] || ff
          fs = state.style[MxConstants.STYLE_FONTSIZE] || fs

          if (ff.length > 10) {
            ff = ff.substring(0, 8) + '...'
          }
        }

        this.toolbar.setFontName(ff)
        this.toolbar.setFontSize(fs)
      })

      graph.getSelectionModel().addListener(MxEvent.CHANGE, update)
      graph.getModel().addListener(MxEvent.CHANGE, update)
    }

    // Makes sure the current layer is visible when cells are added
    graph.addListener(MxEvent.CELLS_ADDED, (sender, evt) => {
      let cells = evt.getProperty('cells')
      let parent = evt.getProperty('parent')

      if (
        graph.getModel().isLayer(parent) &&
        !graph.isCellVisible(parent) &&
        cells !== null &&
        cells.length > 0
      ) {
        graph.getModel().setVisible(parent, true)
      }
    })

    // Global handler to hide the current menu
    this.gestureHandler = MxUtils.bind(this, function(evt) {
      if (this.currentMenu !== null && MxEvent.getSource(evt) !== this.currentMenu.div) {
        this.hideCurrentMenu()
      }
    })

    MxEvent.addGestureListeners(document, this.gestureHandler)

    // Updates the editor UI after the window has been resized or the orientation changes
    // Timeout is workaround for old IE versions which have a delay for DOM client sizes.
    // Should not use delay > 0 to avoid handle multiple repaints during window resize
    this.resizeHandler = MxUtils.bind(this, () => {
      window.setTimeout(
        MxUtils.bind(this, () => {
          this.refresh()
        }),
        0
      )
    })

    MxEvent.addListener(window, 'resize', this.resizeHandler)

    this.orientationChangeHandler = MxUtils.bind(this, () => {
      this.refresh()
    })

    MxEvent.addListener(window, 'orientationchange', this.orientationChangeHandler)

    // Workaround for bug on iOS see
    // http://stackoverflow.com/questions/19012135/ios-7-ipad-safari-landscape-innerheight-outerheight-layout-issue
    if (MxClient.IS_IOS && !window.navigator.standalone) {
      this.scrollHandler = MxUtils.bind(this, function() {
        window.scrollTo(0, 0)
      })

      MxEvent.addListener(window, 'scroll', this.scrollHandler)
    }

    /**
     * Sets the initial scrollbar locations after a file was loaded.
     */
    this.editor.addListener(
      'resetGraphView',
      MxUtils.bind(this, function() {
        this.resetScrollbars()
      })
    )

    /**
     * Repaints the grid.
     */
    this.addListener(
      'gridEnabledChanged',
      MxUtils.bind(this, function() {
        graph.view.validateBackground()
      })
    )

    this.addListener(
      'backgroundColorChanged',
      MxUtils.bind(this, function() {
        graph.view.validateBackground()
      })
    )

    /**
     * Repaints the grid.
     */
    graph.addListener(
      'gridSizeChanged',
      MxUtils.bind(this, function() {
        if (graph.isGridEnabled()) {
          graph.view.validateBackground()
        }
      })
    )

    // Resets UI, updates action and menu states
    this.editor.resetGraph()
    this.init()
    this.open()
  }
}

// Extends MxEventSource
MxUtils.extend(EditorUi, MxEventSource)

/**
 * Global config that specifies if the compact UI elements should be used.
 */
EditorUi.compactUi = true

/**
 * Specifies the size of the split bar.
 */
EditorUi.prototype.splitSize = MxClient.IS_TOUCH || MxClient.IS_POINTER ? 12 : 8

/**
 * Specifies the height of the menubar. Default is 34.
 */
EditorUi.prototype.menubarHeight = 30

/**
 * Specifies the width of the format panel should be enabled. Default is true.
 */
EditorUi.prototype.formatEnabled = true

/**
 * Specifies the width of the format panel. Default is 240.
 */
EditorUi.prototype.formatWidth = 240

/**
 * Specifies the height of the toolbar. Default is 36.
 */
EditorUi.prototype.toolbarHeight = 34

/**
 * Specifies the height of the footer. Default is 28.
 */
EditorUi.prototype.footerHeight = 28

/**
 * Specifies the height of the optional sidebarFooterContainer. Default is 34.
 */
EditorUi.prototype.sidebarFooterHeight = 34

/**
 * Specifies the link for the edit button in chromeless mode.
 */
EditorUi.prototype.editButtonLink = null

/**
 * Specifies the position of the horizontal split bar. Default is 208 or 118 for
 * screen widths <= 640px.
 */
EditorUi.prototype.hsplitPosition = screen.width <= 640 ? 118 : 208

/**
 * Specifies if animations are allowed in <executeLayout>. Default is true.
 */
EditorUi.prototype.allowAnimation = true

/**
 * Specifies if animations are allowed in <executeLayout>. Default is true.
 */
EditorUi.prototype.lightboxMaxFitScale = 2

/**
 * Specifies if animations are allowed in <executeLayout>. Default is true.
 */
EditorUi.prototype.lightboxVerticalDivider = 4

/**
 * Installs the listeners to update the action states.
 */
EditorUi.prototype.init = () => {
  /**
   * Keypress starts immediate editing on selection cell
   */
  let graph = this.editor.graph

  MxEvent.addListener(
    graph.container,
    'keydown',
    MxUtils.bind(this, (evt) => {
      this.onKeyDown(evt)
    })
  )

  MxEvent.addListener(
    graph.container,
    'keypress',
    MxUtils.bind(this, (evt) => {
      this.onKeyPress(evt)
    })
  )

  // Updates action states
  this.addUndoListener()
  this.addBeforeUnloadListener()

  graph.getSelectionModel().addListener(
    MxEvent.CHANGE,
    MxUtils.bind(this, () => {
      this.updateActionStates()
    })
  )

  graph.getModel().addListener(
    MxEvent.CHANGE,
    MxUtils.bind(this, function() {
      this.updateActionStates()
    })
  )

  // Changes action states after change of default parent
  let graphSetDefaultParent = graph.setDefaultParent
  let ui = this

  this.editor.graph.setDefaultParent = function() {
    graphSetDefaultParent.apply(this, arguments)
    ui.updateActionStates()
  }

  // Hack to make editLink available in vertex handler
  graph.editLink = ui.actions.get('editLink').funct

  this.updateActionStates()
  this.initClipboard()
  this.initCanvas()

  if (this.format !== null) {
    this.format.init()
  }
}

/**
 * Returns true if the given event should start editing. This implementation returns true.
 */
EditorUi.prototype.onKeyDown = (evt) => {
  let graph = this.editor.graph

  // Tab selects next cell
  if (evt.which === 9 && graph.isEnabled() && !MxEvent.isAltDown(evt)) {
    if (graph.isEditing()) {
      graph.stopEditing(false)
    } else {
      graph.selectCell(!MxEvent.isShiftDown(evt))
    }

    MxEvent.consume(evt)
  }
}

/**
 * Returns true if the given event should start editing. This implementation returns true.
 */
EditorUi.prototype.onKeyPress = (evt) => {
  let graph = this.editor.graph

  // KNOWN: Focus does not work if label is empty in quirks mode
  if (
    this.isImmediateEditingEvent(evt) &&
    !graph.isEditing() &&
    !graph.isSelectionEmpty() &&
    evt.which !== 0 &&
    !MxEvent.isAltDown(evt) &&
    !MxEvent.isControlDown(evt) &&
    !MxEvent.isMetaDown(evt)
  ) {
    graph.escape()
    graph.startEditing()

    // Workaround for FF where char is lost if cursor is placed before char
    if (MxClient.IS_FF) {
      let ce = graph.cellEditor
      ce.textarea.innerHTML = String.fromCharCode(evt.which)

      // Moves cursor to end of textarea
      let range = document.createRange()
      range.selectNodeContents(ce.textarea)
      range.collapse(false)
      let sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }
}

/**
 * Returns true if the given event should start editing. This implementation returns true.
 */
EditorUi.prototype.isImmediateEditingEvent = (evt) => {
  return true
}

/**
 * Private helper method.
 */
EditorUi.prototype.getCssClassForMarker = (prefix, shape, marker, fill) => {
  let result = ''

  if (shape === 'flexArrow') {
    result =
      marker !== null && marker !== MxConstants.NONE
        ? 'geSprite geSprite-' + prefix + 'blocktrans'
        : 'geSprite geSprite-noarrow'
  } else {
    if (marker === MxConstants.ARROW_CLASSIC) {
      result =
        fill === '1'
          ? 'geSprite geSprite-' + prefix + 'classic'
          : 'geSprite geSprite-' + prefix + 'classictrans'
    } else if (marker === MxConstants.ARROW_CLASSIC_THIN) {
      result =
        fill === '1'
          ? 'geSprite geSprite-' + prefix + 'classicthin'
          : 'geSprite geSprite-' + prefix + 'classicthintrans'
    } else if (marker === MxConstants.ARROW_OPEN) {
      result = 'geSprite geSprite-' + prefix + 'open'
    } else if (marker === MxConstants.ARROW_OPEN_THIN) {
      result = 'geSprite geSprite-' + prefix + 'openthin'
    } else if (marker === MxConstants.ARROW_BLOCK) {
      result =
        fill === '1'
          ? 'geSprite geSprite-' + prefix + 'block'
          : 'geSprite geSprite-' + prefix + 'blocktrans'
    } else if (marker === MxConstants.ARROW_BLOCK_THIN) {
      result =
        fill === '1'
          ? 'geSprite geSprite-' + prefix + 'blockthin'
          : 'geSprite geSprite-' + prefix + 'blockthintrans'
    } else if (marker === MxConstants.ARROW_OVAL) {
      result =
        fill === '1'
          ? 'geSprite geSprite-' + prefix + 'oval'
          : 'geSprite geSprite-' + prefix + 'ovaltrans'
    } else if (marker === MxConstants.ARROW_DIAMOND) {
      result =
        fill === '1'
          ? 'geSprite geSprite-' + prefix + 'diamond'
          : 'geSprite geSprite-' + prefix + 'diamondtrans'
    } else if (marker === MxConstants.ARROW_DIAMOND_THIN) {
      result =
        fill === '1'
          ? 'geSprite geSprite-' + prefix + 'thindiamond'
          : 'geSprite geSprite-' + prefix + 'thindiamondtrans'
    } else if (marker === 'openAsync') {
      result = 'geSprite geSprite-' + prefix + 'openasync'
    } else if (marker === 'dash') {
      result = 'geSprite geSprite-' + prefix + 'dash'
    } else if (marker === 'cross') {
      result = 'geSprite geSprite-' + prefix + 'cross'
    } else if (marker === 'async') {
      result =
        fill === '1'
          ? 'geSprite geSprite-' + prefix + 'async'
          : 'geSprite geSprite-' + prefix + 'asynctrans'
    } else if (marker === 'circle' || marker === 'circlePlus') {
      result =
        fill === '1' || marker === 'circle'
          ? 'geSprite geSprite-' + prefix + 'circle'
          : 'geSprite geSprite-' + prefix + 'circleplus'
    } else if (marker === 'ERone') {
      result = 'geSprite geSprite-' + prefix + 'erone'
    } else if (marker === 'ERmandOne') {
      result = 'geSprite geSprite-' + prefix + 'eronetoone'
    } else if (marker === 'ERmany') {
      result = 'geSprite geSprite-' + prefix + 'ermany'
    } else if (marker === 'ERoneToMany') {
      result = 'geSprite geSprite-' + prefix + 'eronetomany'
    } else if (marker === 'ERzeroToOne') {
      result = 'geSprite geSprite-' + prefix + 'eroneopt'
    } else if (marker === 'ERzeroToMany') {
      result = 'geSprite geSprite-' + prefix + 'ermanyopt'
    } else {
      result = 'geSprite geSprite-noarrow'
    }
  }

  return result
}

/**
 * Overridden in Menus.js
 */
EditorUi.prototype.createMenus = () => {
  return null
}

/**
 * Hook for allowing selection and context menu for certain events.
 */
EditorUi.prototype.updatePasteActionStates = function() {
  let graph = this.editor.graph
  let paste = this.actions.get('paste')
  let pasteHere = this.actions.get('pasteHere')

  paste.setEnabled(
    this.editor.graph.cellEditor.isContentEditing() ||
      (!MxClipboard.isEmpty() &&
        graph.isEnabled() &&
        !graph.isCellLocked(graph.getDefaultParent()))
  )
  pasteHere.setEnabled(paste.isEnabled())
}

/**
 * Hook for allowing selection and context menu for certain events.
 */
EditorUi.prototype.initClipboard = () => {
  let ui = this

  let mxClipboardCut = MxClipboard.cut
  MxClipboard.cut = (graph) => {
    if (graph.cellEditor.isContentEditing()) {
      document.execCommand('cut', false, null)
    } else {
      mxClipboardCut.apply(this, arguments)
    }

    ui.updatePasteActionStates()
  }

  let mxClipboardCopy = MxClipboard.copy
  MxClipboard.copy = (graph) => {
    if (graph.cellEditor.isContentEditing()) {
      document.execCommand('copy', false, null)
    } else {
      mxClipboardCopy.apply(this, arguments)
    }

    ui.updatePasteActionStates()
  }

  let mxClipboardPaste = MxClipboard.paste
  MxClipboard.paste = (graph) => {
    let result = null

    if (graph.cellEditor.isContentEditing()) {
      document.execCommand('paste', false, null)
    } else {
      result = mxClipboardPaste.apply(this, arguments)
    }

    ui.updatePasteActionStates()

    return result
  }

  // Overrides cell editor to update paste action state
  let cellEditorStartEditing = this.editor.graph.cellEditor.startEditing

  this.editor.graph.cellEditor.startEditing = function() {
    cellEditorStartEditing.apply(this, arguments)
    ui.updatePasteActionStates()
  }

  let cellEditorStopEditing = this.editor.graph.cellEditor.stopEditing

  this.editor.graph.cellEditor.stopEditing = (cell, trigger) => {
    cellEditorStopEditing.apply(this, arguments)
    ui.updatePasteActionStates()
  }

  this.updatePasteActionStates()
}

/**
 * Initializes the infinite canvas.
 */
EditorUi.prototype.initCanvas = () => {
  // Initial page layout view, scrollBuffer and timer-based scrolling
  let graph = this.editor.graph
  graph.timerAutoScroll = true

  /**
   * Returns the padding for pages in page view with scrollbars.
   */
  graph.getPagePadding = () => {
    return new MxPoint(
      Math.max(0, Math.round((graph.container.offsetWidth - 34) / graph.view.scale)),
      Math.max(0, Math.round((graph.container.offsetHeight - 34) / graph.view.scale))
    )
  }

  // Fits the number of background pages to the graph
  graph.view.getBackgroundPageBounds = function() {
    let layout = this.graph.getPageLayout()
    let page = this.graph.getPageSize()

    return new MxRectangle(
      this.scale * (this.translate.x + layout.x * page.width),
      this.scale * (this.translate.y + layout.y * page.height),
      this.scale * layout.width * page.width,
      this.scale * layout.height * page.height
    )
  }

  graph.getPreferredPageSize = function(bounds, width, height) {
    let pages = this.getPageLayout()
    let size = this.getPageSize()

    return new MxRectangle(
      0,
      0,
      pages.width * size.width,
      pages.height * size.height
    )
  }

  // Scales pages/graph to fit available size
  let resize = null
  let ui = this

  if (this.editor.chromeless) {
    resize = MxUtils.bind(this, (autoscale, maxScale, cx, cy) => {
      if (graph.container !== null) {
        cx = cx !== null ? cx : 0
        cy = cy !== null ? cy : 0

        let bds = graph.pageVisible
          ? graph.view.getBackgroundPageBounds()
          : graph.getGraphBounds()
        let scroll = MxUtils.hasScrollbars(graph.container)
        let tr = graph.view.translate
        let s = graph.view.scale

        // Normalizes the bounds
        let b = MxRectangle.fromRectangle(bds)
        b.x = b.x / s - tr.x
        b.y = b.y / s - tr.y
        b.width /= s
        b.height /= s

        let st = graph.container.scrollTop
        let sl = graph.container.scrollLeft
        let sb = MxClient.IS_QUIRKS || document.documentMode >= 8 ? 20 : 14

        if (document.documentMode === 8 || document.documentMode === 9) {
          sb += 3
        }

        let cw = graph.container.offsetWidth - sb
        let ch = graph.container.offsetHeight - sb

        let ns = autoscale
          ? Math.max(0.3, Math.min(maxScale || 1, cw / b.width))
          : s
        let dx = (cw - ns * b.width) / 2 / ns
        let dy =
          this.lightboxVerticalDivider === 0
            ? 0
            : (ch - ns * b.height) / this.lightboxVerticalDivider / ns

        if (scroll) {
          dx = Math.max(dx, 0)
          dy = Math.max(dy, 0)
        }

        if (scroll || bds.width < cw || bds.height < ch) {
          graph.view.scaleAndTranslate(
            ns,
            Math.floor(dx - b.x),
            Math.floor(dy - b.y)
          )
          graph.container.scrollTop = (st * ns) / s
          graph.container.scrollLeft = (sl * ns) / s
        } else if (cx !== 0 || cy !== 0) {
          let t = graph.view.translate
          graph.view.setTranslate(
            Math.floor(t.x + cx / s),
            Math.floor(t.y + cy / s)
          )
        }
      }
    })

    // Hack to make function available to subclassers
    this.chromelessResize = resize

    // Hook for subclassers for override
    this.chromelessWindowResize = MxUtils.bind(this, () => {
      this.chromelessResize(false)
    })

    // Removable resize listener
    let autoscaleResize = MxUtils.bind(this, () => {
      this.chromelessWindowResize(false)
    })

    MxEvent.addListener(window, 'resize', autoscaleResize)

    this.destroyFunctions.push(() => {
      MxEvent.removeListener(window, 'resize', autoscaleResize)
    })

    this.editor.addListener(
      'resetGraphView',
      MxUtils.bind(this, () => {
        this.chromelessResize(true)
      })
    )

    this.actions.get('zoomIn').funct = MxUtils.bind(this, (evt) => {
      graph.zoomIn()
      this.chromelessResize(false)
    })
    this.actions.get('zoomOut').funct = MxUtils.bind(this, (evt) => {
      graph.zoomOut()
      this.chromelessResize(false)
    })

    // Creates toolbar for viewer - do not use CSS here
    // as this may be used in a viewer that has no CSS
    if (window.urlParams['toolbar'] !== '0') {
      this.chromelessToolbar = document.createElement('div')
      this.chromelessToolbar.style.position = 'fixed'
      this.chromelessToolbar.style.overflow = 'hidden'
      this.chromelessToolbar.style.boxSizing = 'border-box'
      this.chromelessToolbar.style.whiteSpace = 'nowrap'
      this.chromelessToolbar.style.backgroundColor = '#000000'
      this.chromelessToolbar.style.padding = '10px 10px 8px 10px'
      this.chromelessToolbar.style.left = '50%'

      if (!MxClient.IS_VML) {
        MxUtils.setPrefixedStyle(
          this.chromelessToolbar.style,
          'borderRadius',
          '20px'
        )
        MxUtils.setPrefixedStyle(
          this.chromelessToolbar.style,
          'transition',
          'opacity 600ms ease-in-out'
        )
      }

      let updateChromelessToolbarPosition = MxUtils.bind(this, () => {
        let css = MxUtils.getCurrentStyle(graph.container)
        this.chromelessToolbar.style.bottom =
          (css !== null ? parseInt(css['margin-bottom'] || 0) : 0) +
          (this.tabContainer !== null
            ? 20 + parseInt(this.tabContainer.style.height)
            : 20) +
          'px'
      })

      this.editor.addListener('resetGraphView', updateChromelessToolbarPosition)
      updateChromelessToolbarPosition()

      let btnCount = 0 // eslint-disable-line no-unused-vars

      let addButton = MxUtils.bind(this, (fn, imgSrc, tip) => {
        btnCount++

        let a = document.createElement('span')
        a.style.paddingLeft = '8px'
        a.style.paddingRight = '8px'
        a.style.cursor = 'pointer'
        MxEvent.addListener(a, 'click', fn)

        if (tip !== null) {
          a.setAttribute('title', tip)
        }

        let img = document.createElement('img')
        img.setAttribute('border', '0')
        img.setAttribute('src', imgSrc)

        a.appendChild(img)
        this.chromelessToolbar.appendChild(a)

        return a
      })

      let prevButton = addButton(
        MxUtils.bind(this, (evt) => {
          this.actions.get('previousPage').funct()
          MxEvent.consume(evt)
        }),
        Editor.previousLargeImage,
        MxResources.get('previousPage')
      )

      let pageInfo = document.createElement('div')
      pageInfo.style.display = 'inline-block'
      pageInfo.style.verticalAlign = 'top'
      pageInfo.style.fontFamily = 'Helvetica,Arial'
      pageInfo.style.marginTop = '8px'
      pageInfo.style.color = '#ffffff'
      this.chromelessToolbar.appendChild(pageInfo)

      let nextButton = addButton(
        MxUtils.bind(this, (evt) => {
          this.actions.get('nextPage').funct()
          MxEvent.consume(evt)
        }),
        Editor.nextLargeImage,
        MxResources.get('nextPage')
      )

      let updatePageInfo = MxUtils.bind(this, () => {
        if (
          this.pages !== null &&
          this.pages.length > 1 &&
          this.currentPage !== null
        ) {
          pageInfo.innerHTML = ''
          MxUtils.write(pageInfo, MxUtils.indexOf(this.pages, this.currentPage) + 1 + ' / ' + this.pages.length)
        }
      })

      prevButton.style.paddingLeft = '0px'
      prevButton.style.paddingRight = '4px'
      nextButton.style.paddingLeft = '4px'
      nextButton.style.paddingRight = '0px'

      let updatePageButtons = MxUtils.bind(this, () => {
        if (
          this.pages !== null &&
          this.pages.length > 1 &&
          this.currentPage !== null
        ) {
          nextButton.style.display = ''
          prevButton.style.display = ''
          pageInfo.style.display = 'inline-block'
        } else {
          nextButton.style.display = 'none'
          prevButton.style.display = 'none'
          pageInfo.style.display = 'none'
        }

        updatePageInfo()
      })

      this.editor.addListener('resetGraphView', updatePageButtons)
      this.editor.addListener('pageSelected', updatePageInfo)

      addButton(
        MxUtils.bind(this, (evt) => {
          this.actions.get('zoomOut').funct()
          MxEvent.consume(evt)
        }),
        Editor.zoomOutLargeImage,
        MxResources.get('zoomOut') + ' (Alt+Mousewheel)'
      )

      addButton(
        MxUtils.bind(this, (evt) => {
          this.actions.get('zoomIn').funct()
          MxEvent.consume(evt)
        }),
        Editor.zoomInLargeImage,
        MxResources.get('zoomIn') + ' (Alt+Mousewheel)'
      )

      addButton(
        MxUtils.bind(this, (evt) => {
          if (graph.lightbox) {
            if (graph.view.scale === 1) {
              this.lightboxFit()
            } else {
              graph.zoomTo(1)
            }

            this.chromelessResize(false)
          } else {
            this.chromelessResize(true)
          }

          MxEvent.consume(evt)
        }),
        Editor.actualSizeLargeImage,
        MxResources.get('fit')
      )

      // Changes toolbar opacity on hover
      let fadeThread = null
      let fadeThread2 = null
      let fadeThead // eslint-disable-line no-unused-vars
      let fadeThead2 // eslint-disable-line no-unused-vars

      let fadeOut = MxUtils.bind(this, (delay) => {
        if (fadeThread !== null) {
          window.clearTimeout(fadeThread)
          fadeThead = null
        }

        if (fadeThread2 !== null) {
          window.clearTimeout(fadeThread2)
          fadeThead2 = null
        }

        fadeThread = window.setTimeout(
          MxUtils.bind(this, () => {
            MxUtils.setOpacity(this.chromelessToolbar, 0)
            fadeThread = null

            fadeThread2 = window.setTimeout(
              MxUtils.bind(this, () => {
                this.chromelessToolbar.style.display = 'none'
                fadeThread2 = null
              }),
              600
            )
          }),
          delay || 200
        )
      })

      let fadeIn = MxUtils.bind(this, (opacity) => {
        if (fadeThread !== null) {
          window.clearTimeout(fadeThread)
          fadeThead = null
        }

        if (fadeThread2 !== null) {
          window.clearTimeout(fadeThread2)
          fadeThead2 = null
        }

        this.chromelessToolbar.style.display = ''
        MxUtils.setOpacity(this.chromelessToolbar, opacity || 30)
      })

      if (window.urlParams['layers'] === '1') {
        this.layersDialog = null

        let layersButton = addButton(
          MxUtils.bind(this, (evt) => {
            if (this.layersDialog !== null) {
              this.layersDialog.parentNode.removeChild(this.layersDialog)
              this.layersDialog = null
            } else {
              this.layersDialog = graph.createLayersDialog()

              MxEvent.addListener(
                this.layersDialog,
                'mouseleave',
                MxUtils.bind(this, () => {
                  this.layersDialog.parentNode.removeChild(this.layersDialog)
                  this.layersDialog = null
                })
              )

              let r = layersButton.getBoundingClientRect()

              MxUtils.setPrefixedStyle(
                this.layersDialog.style,
                'borderRadius',
                '5px'
              )
              this.layersDialog.style.position = 'fixed'
              this.layersDialog.style.fontFamily = 'Helvetica,Arial'
              this.layersDialog.style.backgroundColor = '#000000'
              this.layersDialog.style.width = '160px'
              this.layersDialog.style.padding = '4px 2px 4px 2px'
              this.layersDialog.style.color = '#ffffff'
              MxUtils.setOpacity(this.layersDialog, 70)
              this.layersDialog.style.left = r.left + 'px'
              this.layersDialog.style.bottom = parseInt(this.chromelessToolbar.style.bottom) + this.chromelessToolbar.offsetHeight + 4 + 'px'

              // Puts the dialog on top of the container z-index
              let style = MxUtils.getCurrentStyle(this.editor.graph.container)
              this.layersDialog.style.zIndex = style.zIndex

              document.body.appendChild(this.layersDialog)
            }

            MxEvent.consume(evt)
          }),
          Editor.layersLargeImage,
          MxResources.get('layers')
        )

        // Shows/hides layers button depending on content
        let model = graph.getModel()

        model.addListener(MxEvent.CHANGE, () => {
          layersButton.style.display =
            model.getChildCount(model.root) > 1 ? '' : 'none'
        })
      }

      this.addChromelessToolbarItems(addButton)

      if (this.editor.editButtonLink !== null) {
        addButton(
          MxUtils.bind(this, (evt) => {
            if (this.editor.editButtonLink === '_blank') {
              this.editor.editAsNew(this.getEditBlankXml())
            } else {
              window.open(this.editor.editButtonLink, 'editWindow')
            }

            MxEvent.consume(evt)
          }),
          Editor.editLargeImage,
          MxResources.get('edit')
        )
      }

      if (graph.lightbox && (window.urlParams['close'] === '1' || this.container !== document.body)) {
        addButton(
          MxUtils.bind(this, function(evt) {
            if (window.urlParams['close'] === '1') {
              window.close()
            } else {
              this.destroy()
              MxEvent.consume(evt)
            }
          }),
          Editor.closeLargeImage,
          MxResources.get('close') + ' (Escape)'
        )
      }

      // Initial state invisible
      this.chromelessToolbar.style.display = 'none'
      MxUtils.setPrefixedStyle(
        this.chromelessToolbar.style,
        'transform',
        'translate(-50%,0)'
      )
      graph.container.appendChild(this.chromelessToolbar)

      MxEvent.addListener(
        graph.container,
        MxClient.IS_POINTER ? 'pointermove' : 'mousemove',
        MxUtils.bind(this, function(evt) {
          if (!MxEvent.isTouchEvent(evt)) {
            if (!MxEvent.isShiftDown(evt)) {
              fadeIn(30)
            }

            fadeOut()
          }
        })
      )

      MxEvent.addListener(
        this.chromelessToolbar,
        MxClient.IS_POINTER ? 'pointermove' : 'mousemove',
        (evt) => {
          MxEvent.consume(evt)
        }
      )

      MxEvent.addListener(
        this.chromelessToolbar,
        'mouseenter',
        MxUtils.bind(this, (evt) => {
          if (!MxEvent.isShiftDown(evt)) {
            fadeIn(100)
          } else {
            fadeOut()
          }
        })
      )

      MxEvent.addListener(
        this.chromelessToolbar,
        'mousemove',
        MxUtils.bind(this, (evt) => {
          if (!MxEvent.isShiftDown(evt)) {
            fadeIn(100)
          } else {
            fadeOut()
          }

          MxEvent.consume(evt)
        })
      )

      MxEvent.addListener(
        this.chromelessToolbar,
        'mouseleave',
        MxUtils.bind(this, (evt) => {
          if (!MxEvent.isTouchEvent(evt)) {
            fadeIn(30)
          }
        })
      )

      // Shows/hides toolbar for touch devices
      let tol = graph.getTolerance()

      graph.addMouseListener({
        startX: 0,
        startY: 0,
        scrollLeft: 0,
        scrollTop: 0,
        mouseDown: (sender, me) => {
          this.startX = me.getGraphX()
          this.startY = me.getGraphY()
          this.scrollLeft = graph.container.scrollLeft
          this.scrollTop = graph.container.scrollTop
        },
        mouseMove: (sender, me) => {},
        mouseUp: (sender, me) => {
          if (MxEvent.isTouchEvent(me.getEvent())) {
            if (
              Math.abs(this.scrollLeft - graph.container.scrollLeft) < tol &&
              Math.abs(this.scrollTop - graph.container.scrollTop) < tol &&
              (Math.abs(this.startX - me.getGraphX()) < tol &&
                Math.abs(this.startY - me.getGraphY()) < tol)
            ) {
              if (parseFloat(ui.chromelessToolbar.style.opacity || 0) > 0) {
                fadeOut()
              } else {
                fadeIn(30)
              }
            }
          }
        }
      })
    } // end if toolbar

    // Installs handling of highlight and handling links to relative links and anchors
    if (!this.editor.editable) {
      this.addChromelessClickHandler()
    }
  } else if (this.editor.extendCanvas) {
    /**
     * Guesses autoTranslate to avoid another repaint (see below).
     * Works if only the scale of the graph changes or if pages
     * are visible and the visible pages do not change.
     */
    let graphViewValidate = graph.view.validate
    graph.view.validate = () => {
      if (
        this.graph.container !== null &&
        MxUtils.hasScrollbars(this.graph.container)
      ) {
        let pad = this.graph.getPagePadding()
        let size = this.graph.getPageSize()

        // Updating scrollbars here causes flickering in quirks and is not needed
        // if zoom method is always used to set the current scale on the graph.
        let tx = this.translate.x // eslint-disable-line no-unused-vars
        let ty = this.translate.y // eslint-disable-line no-unused-vars
        this.translate.x = pad.x - (this.x0 || 0) * size.width
        this.translate.y = pad.y - (this.y0 || 0) * size.height
      }

      graphViewValidate.apply(this, arguments)
    }

    let graphSizeDidChange = graph.sizeDidChange
    graph.sizeDidChange = () => {
      if (this.container !== null && MxUtils.hasScrollbars(this.container)) {
        let pages = this.getPageLayout()
        let pad = this.getPagePadding()
        let size = this.getPageSize()

        // Updates the minimum graph size
        let minw = Math.ceil(2 * pad.x + pages.width * size.width)
        let minh = Math.ceil(2 * pad.y + pages.height * size.height)

        let min = graph.minimumGraphSize

        // LATER: Fix flicker of scrollbar size in IE quirks mode
        // after delayed call in window.resize event handler
        if (min == null || min.width !== minw || min.height !== minh) {
          graph.minimumGraphSize = new MxRectangle(0, 0, minw, minh)
        }

        // Updates auto-translate to include padding and graph size
        let dx = pad.x - pages.x * size.width
        let dy = pad.y - pages.y * size.height

        if (
          !this.autoTranslate &&
          (this.view.translate.x !== dx || this.view.translate.y !== dy)
        ) {
          this.autoTranslate = true
          this.view.x0 = pages.x
          this.view.y0 = pages.y

          // NOTE: THIS INVOKES THIS METHOD AGAIN. UNFORTUNATELY THERE IS NO WAY AROUND THIS SINCE THE
          // BOUNDS ARE KNOWN AFTER THE VALIDATION AND SETTING THE TRANSLATE TRIGGERS A REVALIDATION.
          // SHOULD MOVE TRANSLATE/SCALE TO VIEW.
          let tx = graph.view.translate.x
          let ty = graph.view.translate.y
          graph.view.setTranslate(dx, dy)

          // LATER: Fix rounding errors for small zoom
          graph.container.scrollLeft += Math.round((dx - tx) * graph.view.scale)
          graph.container.scrollTop += Math.round((dy - ty) * graph.view.scale)

          this.autoTranslate = false

          return
        }

        graphSizeDidChange.apply(this, arguments)
      }
    }
  }

  // Accumulates the zoom factor while the rendering is taking place
  // so that not the complete sequence of zoom steps must be painted
  graph.updateZoomTimeout = null
  graph.cumulativeZoomFactor = 1

  let cursorPosition = null

  graph.lazyZoom = function(zoomIn) {
    if (this.updateZoomTimeout !== null) {
      window.clearTimeout(this.updateZoomTimeout)
    }

    // Switches to 1% zoom steps below 15%
    // Lower bound depdends on rounding below
    if (zoomIn) {
      if (this.view.scale * this.cumulativeZoomFactor < 0.15) {
        this.cumulativeZoomFactor = (this.view.scale + 0.01) / this.view.scale
      } else {
        // Uses to 5% zoom steps for better grid rendering in webkit
        // and to avoid rounding errors for zoom steps
        this.cumulativeZoomFactor *= this.zoomFactor
        this.cumulativeZoomFactor = Math.round(this.view.scale * this.cumulativeZoomFactor * 20) / 20 / this.view.scale
      }
    } else {
      if (this.view.scale * this.cumulativeZoomFactor <= 0.15) {
        this.cumulativeZoomFactor = (this.view.scale - 0.01) / this.view.scale
      } else {
        // Uses to 5% zoom steps for better grid rendering in webkit
        // and to avoid rounding errors for zoom steps
        this.cumulativeZoomFactor /= this.zoomFactor
        this.cumulativeZoomFactor = Math.round(this.view.scale * this.cumulativeZoomFactor * 20) / 20 / this.view.scale
      }
    }

    this.cumulativeZoomFactor = Math.max(0.01, Math.min(this.view.scale * this.cumulativeZoomFactor, 160) / this.view.scale
    )

    this.updateZoomTimeout = window.setTimeout(
      MxUtils.bind(this, () => {
        let offset = MxUtils.getOffset(graph.container)
        let dx = 0
        let dy = 0

        if (cursorPosition !== null) {
          dx = graph.container.offsetWidth / 2 - cursorPosition.x + offset.x
          dy = graph.container.offsetHeight / 2 - cursorPosition.y + offset.y
        }

        let prev = this.view.scale
        this.zoom(this.cumulativeZoomFactor)
        let s = this.view.scale

        if (s !== prev) {
          if (resize !== null) {
            ui.chromelessResize(
              false,
              null,
              dx * (this.cumulativeZoomFactor - 1),
              dy * (this.cumulativeZoomFactor - 1)
            )
          }

          if (MxUtils.hasScrollbars(graph.container) && (dx !== 0 || dy !== 0)) {
            graph.container.scrollLeft -= dx * (this.cumulativeZoomFactor - 1)
            graph.container.scrollTop -= dy * (this.cumulativeZoomFactor - 1)
          }
        }

        this.cumulativeZoomFactor = 1
        this.updateZoomTimeout = null
      }),
      20
    )
  }

  MxEvent.addMouseWheelListener(
    MxUtils.bind(this, (evt, up) => {
      // Ctrl+wheel (or pinch on touchpad) is a native browser zoom event is OS X
      // LATER: Add support for zoom via pinch on trackpad for Chrome in OS X
      if (
        (MxEvent.isAltDown(evt) ||
          (MxEvent.isControlDown(evt) && !MxClient.IS_MAC) ||
          graph.panningHandler.isActive()) &&
        (this.dialogs == null || this.dialogs.length === 0)
      ) {
        let source = MxEvent.getSource(evt)

        while (source !== null) {
          if (source === graph.container) {
            cursorPosition = new MxPoint(
              MxEvent.getClientX(evt),
              MxEvent.getClientY(evt)
            )
            graph.lazyZoom(up)
            MxEvent.consume(evt)

            return
          }

          source = source.parentNode
        }
      }
    })
  )
}

/**
 * Creates a temporary graph instance for rendering off-screen content.
 */
EditorUi.prototype.addChromelessToolbarItems = (addButton) => {
  addButton(
    MxUtils.bind(this, (evt) => {
      this.actions.get('print').funct()
      MxEvent.consume(evt)
    }),
    Editor.printLargeImage,
    MxResources.get('print')
  )
}

/**
 * Creates a temporary graph instance for rendering off-screen content.
 */
EditorUi.prototype.createTemporaryGraph = (stylesheet) => {
  let graph = new Graph(document.createElement('div'), null, null, stylesheet)
  graph.resetViewOnRootChange = false
  graph.setConnectable(false)
  graph.gridEnabled = false
  graph.autoScroll = false
  graph.setTooltips(false)
  graph.setEnabled(false)

  // Container must be in the DOM for correct HTML rendering
  graph.container.style.visibility = 'hidden'
  graph.container.style.position = 'absolute'
  graph.container.style.overflow = 'hidden'
  graph.container.style.height = '1px'
  graph.container.style.width = '1px'

  return graph
}

/**
 *
 */
EditorUi.prototype.addChromelessClickHandler = () => {
  let hl = window.urlParams['highlight']

  // Adds leading # for highlight color code
  if (hl !== null && hl.length > 0) {
    hl = '#' + hl
  }

  this.editor.graph.addClickHandler(hl)
}

/**
 *
 */
EditorUi.prototype.toggleFormatPanel = (forceHide) => {
  this.formatWidth = forceHide || this.formatWidth > 0 ? 0 : 240
  this.formatContainer.style.display = forceHide || this.formatWidth > 0 ? '' : 'none'
  this.refresh()
  this.format.refresh()
  this.fireEvent(new MxEventObject('formatWidthChanged'))
}

/**
 * Adds support for placeholders in labels.
 */
EditorUi.prototype.lightboxFit = (maxHeight) => {
  if (this.isDiagramEmpty()) {
    this.editor.graph.view.setScale(1)
  } else {
    let p = window.urlParams['border']
    let border = 60

    if (p !== null) {
      border = parseInt(p)
    }

    // LATER: Use initial graph bounds to avoid rounding errors
    this.editor.graph.maxFitScale = this.lightboxMaxFitScale
    this.editor.graph.fit(border, null, null, null, null, null, maxHeight)
    this.editor.graph.maxFitScale = null
  }
}

/**
 * Translates this point by the given vector.
 *
 * @param {number} dx X-coordinate of the translation.
 * @param {number} dy Y-coordinate of the translation.
 */
EditorUi.prototype.isDiagramEmpty = () => {
  let model = this.editor.graph.getModel()

  return (
    model.getChildCount(model.root) === 1 &&
    model.getChildCount(model.getChildAt(model.root, 0)) === 0
  )
}

/**
 * Hook for allowing selection and context menu for certain events.
 */
EditorUi.prototype.isSelectionAllowed = (evt) => {
  return (
    MxEvent.getSource(evt).nodeName === 'SELECT' ||
    (MxEvent.getSource(evt).nodeName === 'INPUT' &&
      MxUtils.isAncestorNode(this.formatContainer, MxEvent.getSource(evt)))
  )
}

/**
 * Installs dialog if browser window is closed without saving
 * This must be disabled during save and image export.
 */
EditorUi.prototype.addBeforeUnloadListener = () => {
  // Installs dialog if browser window is closed without saving
  // This must be disabled during save and image export
  window.onbeforeunload = MxUtils.bind(this, () => {
    if (!this.editor.chromeless) {
      return this.onBeforeUnload()
    }
  })
}

/**
 * Sets the onbeforeunload for the application
 */
EditorUi.prototype.onBeforeUnload = () => {
  if (this.editor.modified) {
    return MxResources.get('allChangesLost')
  }
}

/**
 * Opens the current diagram via the window.opener if one exists.
 */
EditorUi.prototype.open = () => {
  // Cross-domain window access is not allowed in FF, so if we
  // were opened from another domain then this will fail.
  try {
    if (window.opener !== null && window.opener.openFile !== null) {
      window.opener.openFile.setConsumer(
        MxUtils.bind(this, (xml, filename) => {
          try {
            let doc = MxUtils.parseXml(xml)
            this.editor.setGraphXml(doc.documentElement)
            this.editor.setModified(false)
            this.editor.undoManager.clear()

            if (filename !== null) {
              this.editor.setFilename(filename)
              this.updateDocumentTitle()
            }

            return
          } catch (e) {
            MxUtils.alert(
              MxResources.get('invalidOrMissingFile') + ': ' + e.message
            )
          }
        })
      )
    }
  } catch (e) {
    // ignore
  }

  // Fires as the last step if no file was loaded
  this.editor.graph.view.validate()

  // Required only in special cases where an initial file is opened
  // and the minimumGraphSize changes and CSS must be updated.
  this.editor.graph.sizeDidChange()
  this.editor.fireEvent(new MxEventObject('resetGraphView'))
}

/**
 * Sets the current menu and element.
 */
EditorUi.prototype.setCurrentMenu = (menu, elt) => {
  this.currentMenuElt = elt
  this.currentMenu = menu
}

/**
 * Resets the current menu and element.
 */
EditorUi.prototype.resetCurrentMenu = () => {
  this.currentMenuElt = null
  this.currentMenu = null
}

/**
 * Hides and destroys the current menu.
 */
EditorUi.prototype.hideCurrentMenu = () => {
  if (this.currentMenu !== null) {
    this.currentMenu.hideMenu()
    this.resetCurrentMenu()
  }
}

/**
 * Updates the document title.
 */
EditorUi.prototype.updateDocumentTitle = () => {
  let title = this.editor.getOrCreateFilename()

  if (this.editor.appName !== null) {
    title += ' - ' + this.editor.appName
  }

  document.title = title
}

/**
 * Updates the document title.
 */
EditorUi.prototype.createHoverIcons = () => {
  return new HoverIcons(this.editor.graph)
}

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.redo = () => {
  try {
    let graph = this.editor.graph

    if (graph.isEditing()) {
      document.execCommand('redo', false, null)
    } else {
      this.editor.undoManager.redo()
    }
  } catch (e) {
    // ignore all errors
  }
}

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.undo = () => {
  try {
    let graph = this.editor.graph

    if (graph.isEditing()) {
      // Stops editing and executes undo on graph if native undo
      // does not affect current editing value
      let value = graph.cellEditor.textarea.innerHTML
      document.execCommand('undo', false, null)

      if (value === graph.cellEditor.textarea.innerHTML) {
        graph.stopEditing(true)
        this.editor.undoManager.undo()
      }
    } else {
      this.editor.undoManager.undo()
    }
  } catch (e) {
    // ignore all errors
  }
}

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.canRedo = () => {
  return this.editor.graph.isEditing() || this.editor.undoManager.canRedo()
}

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.canUndo = () => {
  return this.editor.graph.isEditing() || this.editor.undoManager.canUndo()
}

/**
 *
 */
EditorUi.prototype.getEditBlankXml = () => {
  return MxUtils.getXml(this.editor.getGraphXml())
}

/**
 * Returns the URL for a copy of this editor with no state.
 */
EditorUi.prototype.getUrl = (pathname) => {
  let href = pathname !== null ? pathname : window.location.pathname
  let parms = href.indexOf('?') > 0 ? 1 : 0

  // Removes template URL parameter for new blank diagram
  for (let key in window.urlParams) {
    if (parms === 0) {
      href += '?'
    } else {
      href += '&'
    }

    href += key + '=' + window.urlParams[key]
    parms++
  }

  return href
}

/**
 * Specifies if the graph has scrollbars.
 */
EditorUi.prototype.setScrollbars = (value) => {
  let graph = this.editor.graph
  let prev = graph.container.style.overflow
  graph.scrollbars = value
  this.editor.updateGraphComponents()

  if (prev !== graph.container.style.overflow) {
    if (graph.container.style.overflow === 'hidden') {
      let t = graph.view.translate
      graph.view.setTranslate(
        t.x - graph.container.scrollLeft / graph.view.scale,
        t.y - graph.container.scrollTop / graph.view.scale
      )
      graph.container.scrollLeft = 0
      graph.container.scrollTop = 0
      graph.minimumGraphSize = null
      graph.sizeDidChange()
    } else {
      let dx = graph.view.translate.x
      let dy = graph.view.translate.y

      graph.view.translate.x = 0
      graph.view.translate.y = 0
      graph.sizeDidChange()
      graph.container.scrollLeft -= Math.round(dx * graph.view.scale)
      graph.container.scrollTop -= Math.round(dy * graph.view.scale)
    }
  }

  this.fireEvent(new MxEventObject('scrollbarsChanged'))
}

/**
 * Returns true if the graph has scrollbars.
 */
EditorUi.prototype.hasScrollbars = () => {
  return this.editor.graph.scrollbars
}

/**
 * Resets the state of the scrollbars.
 */
EditorUi.prototype.resetScrollbars = () => {
  let graph = this.editor.graph

  if (!this.editor.extendCanvas) {
    graph.container.scrollTop = 0
    graph.container.scrollLeft = 0

    if (!MxUtils.hasScrollbars(graph.container)) {
      graph.view.setTranslate(0, 0)
    }
  } else if (!this.editor.chromeless) {
    if (MxUtils.hasScrollbars(graph.container)) {
      if (graph.pageVisible) {
        let pad = graph.getPagePadding()
        graph.container.scrollTop = Math.floor(pad.y - this.editor.initialTopSpacing)
        graph.container.scrollLeft = Math.floor(Math.min(pad.x, (graph.container.scrollWidth - graph.container.clientWidth) / 2))

        // Scrolls graph to visible area
        let bounds = graph.getGraphBounds()

        if (bounds.width > 0 && bounds.height > 0) {
          if (bounds.x > graph.container.scrollLeft + graph.container.clientWidth * 0.9) {
            graph.container.scrollLeft = Math.min(bounds.x + bounds.width - graph.container.clientWidth, bounds.x - 10)
          }

          if (bounds.y > graph.container.scrollTop + graph.container.clientHeight * 0.9) {
            graph.container.scrollTop = Math.min(bounds.y + bounds.height - graph.container.clientHeight, bounds.y - 10)
          }
        }
      } else {
        let bounds = graph.getGraphBounds()
        let width = Math.max(bounds.width, graph.scrollTileSize.width * graph.view.scale)
        let height = Math.max(bounds.height, graph.scrollTileSize.height * graph.view.scale)
        graph.container.scrollTop = Math.floor(
          Math.max(0, bounds.y - Math.max(20, (graph.container.clientHeight - height) / 4))
        )
        graph.container.scrollLeft = Math.floor(
          Math.max(0, bounds.x - Math.max(0, (graph.container.clientWidth - width) / 2))
        )
      }
    } else {
      // This code is not actively used since the default for scrollbars is always true
      if (graph.pageVisible) {
        let b = graph.view.getBackgroundPageBounds()
        graph.view.setTranslate(
          Math.floor(Math.max(0, (graph.container.clientWidth - b.width) / 2) - b.x),
          Math.floor(Math.max(0, (graph.container.clientHeight - b.height) / 2) - b.y)
        )
      } else {
        let bounds = graph.getGraphBounds()
        graph.view.setTranslate(
          Math.floor(Math.max(0, Math.max(0, (graph.container.clientWidth - bounds.width) / 2) - bounds.x)),
          Math.floor(Math.max(0, Math.max(20, (graph.container.clientHeight - bounds.height) / 4)) - bounds.y)
        )
      }
    }
  }
}

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setPageVisible = (value) => {
  let graph = this.editor.graph
  let hasScrollbars = MxUtils.hasScrollbars(graph.container)
  let tx = 0
  let ty = 0

  if (hasScrollbars) {
    tx = graph.view.translate.x * graph.view.scale - graph.container.scrollLeft
    ty = graph.view.translate.y * graph.view.scale - graph.container.scrollTop
  }

  graph.pageVisible = value
  graph.pageBreaksVisible = value
  graph.preferPageSize = value
  graph.view.validateBackground()

  // Workaround for possible handle offset
  if (hasScrollbars) {
    let cells = graph.getSelectionCells()
    graph.clearSelection()
    graph.setSelectionCells(cells)
  }

  // Calls updatePageBreaks
  graph.sizeDidChange()

  if (hasScrollbars) {
    graph.container.scrollLeft = graph.view.translate.x * graph.view.scale - tx
    graph.container.scrollTop = graph.view.translate.y * graph.view.scale - ty
  }

  this.fireEvent(new MxEventObject('pageViewChanged'))
}

/**
 * Change types
 */
function ChangePageSetup(ui, color, image, format) {
  this.ui = ui
  this.color = color
  this.previousColor = color
  this.image = image
  this.previousImage = image
  this.format = format
  this.previousFormat = format

  // Needed since null are valid values for color and image
  this.ignoreColor = false
  this.ignoreImage = false
}

/**
 * Implementation of the undoable page rename.
 */
ChangePageSetup.prototype.execute = () => {
  let graph = this.ui.editor.graph

  if (!this.ignoreColor) {
    this.color = this.previousColor
    let tmp = graph.background
    this.ui.setBackgroundColor(this.previousColor)
    this.previousColor = tmp
  }

  if (!this.ignoreImage) {
    this.image = this.previousImage
    let tmp = graph.backgroundImage
    this.ui.setBackgroundImage(this.previousImage)
    this.previousImage = tmp
  }

  if (this.previousFormat !== null) {
    this.format = this.previousFormat
    let tmp = graph.pageFormat

    if (this.previousFormat.width !== tmp.width || this.previousFormat.height !== tmp.height) {
      this.ui.setPageFormat(this.previousFormat)
      this.previousFormat = tmp
    }
  }

  if (this.foldingEnabled !== null && this.foldingEnabled !== this.ui.editor.graph.foldingEnabled) {
    this.ui.setFoldingEnabled(this.foldingEnabled)
    this.foldingEnabled = !this.foldingEnabled
  }
}

// Registers codec for ChangePageSetup
(() => {
  let codec = new MxObjectCodec(new ChangePageSetup(), [
    'ui',
    'previousColor',
    'previousImage',
    'previousFormat'
  ])

  codec.afterDecode = function(dec, node, obj) {
    obj.previousColor = obj.color
    obj.previousImage = obj.image
    obj.previousFormat = obj.format

    if (obj.foldingEnabled !== null) {
      obj.foldingEnabled = !obj.foldingEnabled
    }

    return obj
  }

  MxCodecRegistry.register(codec)
})()

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setBackgroundColor = (value) => {
  this.editor.graph.background = value
  this.editor.graph.view.validateBackground()

  this.fireEvent(new MxEventObject('backgroundColorChanged'))
}

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setFoldingEnabled = (value) => {
  this.editor.graph.foldingEnabled = value
  this.editor.graph.view.revalidate()

  this.fireEvent(new MxEventObject('foldingEnabledChanged'))
}

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setPageFormat = (value) => {
  this.editor.graph.pageFormat = value

  if (!this.editor.graph.pageVisible) {
    this.actions.get('pageView').funct()
  } else {
    this.editor.graph.view.validateBackground()
    this.editor.graph.sizeDidChange()
  }

  this.fireEvent(new MxEventObject('pageFormatChanged'))
}

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setPageScale = (value) => {
  this.editor.graph.pageScale = value

  if (!this.editor.graph.pageVisible) {
    this.actions.get('pageView').funct()
  } else {
    this.editor.graph.view.validateBackground()
    this.editor.graph.sizeDidChange()
  }

  this.fireEvent(new MxEventObject('pageScaleChanged'))
}

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setGridColor = (value) => {
  this.editor.graph.view.gridColor = value
  this.editor.graph.view.validateBackground()
  this.fireEvent(new MxEventObject('gridColorChanged'))
}

/**
 * Updates the states of the given undo/redo items.
 */
EditorUi.prototype.addUndoListener = () => {
  let undo = this.actions.get('undo')
  let redo = this.actions.get('redo')

  let undoMgr = this.editor.undoManager

  let undoListener = MxUtils.bind(this, () => {
    undo.setEnabled(this.canUndo())
    redo.setEnabled(this.canRedo())
  })

  undoMgr.addListener(MxEvent.ADD, undoListener)
  undoMgr.addListener(MxEvent.UNDO, undoListener)
  undoMgr.addListener(MxEvent.REDO, undoListener)
  undoMgr.addListener(MxEvent.CLEAR, undoListener)

  // Overrides cell editor to update action states
  let cellEditorStartEditing = this.editor.graph.cellEditor.startEditing

  this.editor.graph.cellEditor.startEditing = function() {
    cellEditorStartEditing.apply(this, arguments)
    undoListener()
  }

  let cellEditorStopEditing = this.editor.graph.cellEditor.stopEditing

  this.editor.graph.cellEditor.stopEditing = function(cell, trigger) {
    cellEditorStopEditing.apply(this, arguments)
    undoListener()
  }

  // Updates the button states once
  undoListener()
}

/**
 * Updates the states of the given toolbar items based on the selection.
 */
EditorUi.prototype.updateActionStates = () => {
  let graph = this.editor.graph
  let selected = !graph.isSelectionEmpty()
  let vertexSelected = false
  let edgeSelected = false

  let cells = graph.getSelectionCells()

  if (cells !== null) {
    for (let i = 0; i < cells.length; i++) {
      let cell = cells[i]

      if (graph.getModel().isEdge(cell)) {
        edgeSelected = true
      }

      if (graph.getModel().isVertex(cell)) {
        vertexSelected = true
      }

      if (edgeSelected && vertexSelected) {
        break
      }
    }
  }

  // Updates action states
  let actions = [
    'cut',
    'copy',
    'bold',
    'italic',
    'underline',
    'delete',
    'duplicate',
    'editStyle',
    'editTooltip',
    'editLink',
    'backgroundColor',
    'borderColor',
    'edit',
    'toFront',
    'toBack',
    'lockUnlock',
    'solid',
    'dashed',
    'dotted',
    'fillColor',
    'gradientColor',
    'shadow',
    'fontColor',
    'formattedText',
    'rounded',
    'toggleRounded',
    'sharp',
    'strokeColor'
  ]

  for (let i = 0; i < actions.length; i++) {
    this.actions.get(actions[i]).setEnabled(selected)
  }

  this.actions
    .get('setAsDefaultStyle')
    .setEnabled(graph.getSelectionCount() === 1)
  this.actions.get('clearWaypoints').setEnabled(!graph.isSelectionEmpty())
  this.actions.get('turn').setEnabled(!graph.isSelectionEmpty())
  this.actions.get('curved').setEnabled(edgeSelected)
  this.actions.get('rotation').setEnabled(vertexSelected)
  this.actions.get('wordWrap').setEnabled(vertexSelected)
  this.actions.get('autosize').setEnabled(vertexSelected)
  let oneVertexSelected = vertexSelected && graph.getSelectionCount() === 1
  this.actions
    .get('group')
    .setEnabled(
      graph.getSelectionCount() > 1 ||
        (oneVertexSelected && !graph.isContainer(graph.getSelectionCell()))
    )
  this.actions
    .get('ungroup')
    .setEnabled(
      graph.getSelectionCount() === 1 &&
        (graph.getModel().getChildCount(graph.getSelectionCell()) > 0 ||
          (oneVertexSelected && graph.isContainer(graph.getSelectionCell())))
    )
  this.actions
    .get('removeFromGroup')
    .setEnabled(
      oneVertexSelected &&
        graph
          .getModel()
          .isVertex(graph.getModel().getParent(graph.getSelectionCell()))
    )

  // Updates menu states
  let state = graph.view.getState(graph.getSelectionCell()) // eslint-disable-line no-unused-vars
  this.menus
    .get('navigation')
    .setEnabled(selected || graph.view.currentRoot !== null)
  this.actions
    .get('collapsible')
    .setEnabled(
      vertexSelected &&
        (graph.isContainer(graph.getSelectionCell()) ||
          graph.model.getChildCount(graph.getSelectionCell()) > 0)
    )
  this.actions.get('home').setEnabled(graph.view.currentRoot !== null)
  this.actions.get('exitGroup').setEnabled(graph.view.currentRoot !== null)
  this.actions
    .get('enterGroup')
    .setEnabled(
      graph.getSelectionCount() === 1 &&
        graph.isValidRoot(graph.getSelectionCell())
    )
  let foldable =
    graph.getSelectionCount() === 1 &&
    graph.isCellFoldable(graph.getSelectionCell())
  this.actions.get('expand').setEnabled(foldable)
  this.actions.get('collapse').setEnabled(foldable)
  this.actions.get('editLink').setEnabled(graph.getSelectionCount() === 1)
  this.actions
    .get('openLink')
    .setEnabled(
      graph.getSelectionCount() === 1 &&
        graph.getLinkForCell(graph.getSelectionCell()) !== null
    )
  this.actions.get('guides').setEnabled(graph.isEnabled())
  this.actions
    .get('grid')
    .setEnabled(!this.editor.chromeless || this.editor.editable)

  let unlocked =
    graph.isEnabled() && !graph.isCellLocked(graph.getDefaultParent())
  this.menus.get('layout').setEnabled(unlocked)
  this.menus.get('insert').setEnabled(unlocked)
  this.menus.get('direction').setEnabled(unlocked && vertexSelected)
  this.menus
    .get('align')
    .setEnabled(unlocked && vertexSelected && graph.getSelectionCount() > 1)
  this.menus
    .get('distribute')
    .setEnabled(unlocked && vertexSelected && graph.getSelectionCount() > 1)
  this.actions.get('selectVertices').setEnabled(unlocked)
  this.actions.get('selectEdges').setEnabled(unlocked)
  this.actions.get('selectAll').setEnabled(unlocked)
  this.actions.get('selectNone').setEnabled(unlocked)

  this.updatePasteActionStates()
}

/**
 * Refreshes the viewport.
 */
EditorUi.prototype.refresh = (sizeDidChange) => {
  sizeDidChange = sizeDidChange !== null ? sizeDidChange : true

  let quirks = MxClient.IS_IE && (document.documentMode == null || document.documentMode === 5)
  let w = this.container.clientWidth
  let h = this.container.clientHeight

  if (this.container === document.body) {
    w = document.body.clientWidth || document.documentElement.clientWidth
    h = quirks
      ? document.body.clientHeight || document.documentElement.clientHeight
      : document.documentElement.clientHeight
  }

  // Workaround for bug on iOS see
  // http://stackoverflow.com/questions/19012135/ios-7-ipad-safari-landscape-innerheight-outerheight-layout-issue
  // FIXME: Fix if footer visible
  let off = 0

  if (MxClient.IS_IOS && !window.navigator.standalone) {
    if (window.innerHeight !== document.documentElement.clientHeight) {
      off = document.documentElement.clientHeight - window.innerHeight
      window.scrollTo(0, 0)
    }
  }

  let effHsplitPosition = Math.max(0, Math.min(this.hsplitPosition, w - this.splitSize - 20))

  let tmp = 0

  if (this.menubar !== null) {
    this.menubarContainer.style.height = this.menubarHeight + 'px'
    tmp += this.menubarHeight
  }

  if (this.toolbar !== null) {
    this.toolbarContainer.style.top = this.menubarHeight + 'px'
    this.toolbarContainer.style.height = this.toolbarHeight + 'px'
    tmp += this.toolbarHeight
  }

  if (tmp > 0 && !MxClient.IS_QUIRKS) {
    tmp += 1
  }

  let sidebarFooterHeight = 0

  if (this.sidebarFooterContainer !== null) {
    let bottom = this.footerHeight + off
    sidebarFooterHeight = Math.max(0, Math.min(h - tmp - bottom, this.sidebarFooterHeight))
    this.sidebarFooterContainer.style.width = effHsplitPosition + 'px'
    this.sidebarFooterContainer.style.height = sidebarFooterHeight + 'px'
    this.sidebarFooterContainer.style.bottom = bottom + 'px'
  }

  let fw = this.format !== null ? this.formatWidth : 0
  this.sidebarContainer.style.top = tmp + 'px'
  this.sidebarContainer.style.width = effHsplitPosition + 'px'
  this.formatContainer.style.top = tmp + 'px'
  this.formatContainer.style.width = fw + 'px'
  this.formatContainer.style.display = this.format !== null ? '' : 'none'

  this.diagramContainer.style.left =
    this.hsplit.parentNode !== null
      ? effHsplitPosition + this.splitSize + 'px'
      : '0px'
  this.diagramContainer.style.top = this.sidebarContainer.style.top
  this.footerContainer.style.height = this.footerHeight + 'px'
  this.hsplit.style.top = this.sidebarContainer.style.top
  this.hsplit.style.bottom = this.footerHeight + off + 'px'
  this.hsplit.style.left = effHsplitPosition + 'px'

  if (this.tabContainer !== null) {
    this.tabContainer.style.left = this.diagramContainer.style.left
  }

  if (quirks) {
    this.menubarContainer.style.width = w + 'px'
    this.toolbarContainer.style.width = this.menubarContainer.style.width
    let sidebarHeight = Math.max(0, h - this.footerHeight - this.menubarHeight - this.toolbarHeight)
    this.sidebarContainer.style.height = sidebarHeight - sidebarFooterHeight + 'px'
    this.formatContainer.style.height = sidebarHeight + 'px'
    this.diagramContainer.style.width =
      this.hsplit.parentNode !== null
        ? Math.max(0, w - effHsplitPosition - this.splitSize - fw) + 'px'
        : w + 'px'
    this.footerContainer.style.width = this.menubarContainer.style.width
    let diagramHeight = Math.max(0, h - this.footerHeight - this.menubarHeight - this.toolbarHeight)

    if (this.tabContainer !== null) {
      this.tabContainer.style.width = this.diagramContainer.style.width
      this.tabContainer.style.bottom = this.footerHeight + off + 'px'
      diagramHeight -= this.tabContainer.clientHeight
    }

    this.diagramContainer.style.height = diagramHeight + 'px'
    this.hsplit.style.height = diagramHeight + 'px'
  } else {
    if (this.footerHeight > 0) {
      this.footerContainer.style.bottom = off + 'px'
    }

    this.diagramContainer.style.right = fw + 'px'
    let th = 0

    if (this.tabContainer !== null) {
      this.tabContainer.style.bottom = this.footerHeight + off + 'px'
      this.tabContainer.style.right = this.diagramContainer.style.right
      th = this.tabContainer.clientHeight
    }

    this.sidebarContainer.style.bottom = this.footerHeight + sidebarFooterHeight + off + 'px'
    this.formatContainer.style.bottom = this.footerHeight + off + 'px'
    this.diagramContainer.style.bottom = this.footerHeight + off + th + 'px'
  }

  if (sizeDidChange) {
    this.editor.graph.sizeDidChange()
  }
}

/**
 * Creates the required containers.
 */
EditorUi.prototype.createTabContainer = () => {
  return null
}

/**
 * Creates the required containers.
 */
EditorUi.prototype.createDivs = () => {
  this.menubarContainer = this.createDiv('geMenubarContainer')
  this.toolbarContainer = this.createDiv('geToolbarContainer')
  this.sidebarContainer = this.createDiv('geSidebarContainer')
  this.formatContainer = this.createDiv('geSidebarContainer geFormatContainer')
  this.diagramContainer = this.createDiv('geDiagramContainer')
  this.footerContainer = this.createDiv('geFooterContainer')
  this.hsplit = this.createDiv('geHsplit')
  this.hsplit.setAttribute('title', MxResources.get('collapseExpand'))

  // Sets static style for containers
  this.menubarContainer.style.top = '0px'
  this.menubarContainer.style.left = '0px'
  this.menubarContainer.style.right = '0px'
  this.toolbarContainer.style.left = '0px'
  this.toolbarContainer.style.right = '0px'
  this.sidebarContainer.style.left = '0px'
  this.formatContainer.style.right = '0px'
  this.formatContainer.style.zIndex = '1'
  this.diagramContainer.style.right = (this.format !== null ? this.formatWidth : 0) + 'px'
  this.footerContainer.style.left = '0px'
  this.footerContainer.style.right = '0px'
  this.footerContainer.style.bottom = '0px'
  this.footerContainer.style.zIndex = MxPopupMenu.prototype.zIndex - 2
  this.hsplit.style.width = this.splitSize + 'px'
  this.sidebarFooterContainer = this.createSidebarFooterContainer()

  if (this.sidebarFooterContainer) {
    this.sidebarFooterContainer.style.left = '0px'
  }

  if (!this.editor.chromeless) {
    this.tabContainer = this.createTabContainer()
  }
}

/**
 * Hook for sidebar footer container. This implementation returns null.
 */
EditorUi.prototype.createSidebarFooterContainer = () => {
  return null
}

/**
 * Creates the required containers.
 */
EditorUi.prototype.createUi = () => {
  // Creates menubar
  this.menubar = this.editor.chromeless
    ? null
    : this.menus.createMenubar(this.createDiv('geMenubar'))

  if (this.menubar !== null) {
    this.menubarContainer.appendChild(this.menubar.container)
  }

  // Adds status bar in menubar
  if (this.menubar !== null) {
    this.statusContainer = this.createStatusContainer()

    // Connects the status bar to the editor status
    this.editor.addListener(
      'statusChanged',
      MxUtils.bind(this, () => {
        this.setStatusText(this.editor.getStatus())
      })
    )

    this.setStatusText(this.editor.getStatus())
    this.menubar.container.appendChild(this.statusContainer)

    // Inserts into DOM
    this.container.appendChild(this.menubarContainer)
  }

  // Creates the sidebar
  this.sidebar = this.editor.chromeless
    ? null
    : this.createSidebar(this.sidebarContainer)

  if (this.sidebar !== null) {
    this.container.appendChild(this.sidebarContainer)
  }

  // Creates the format sidebar
  this.format =
    this.editor.chromeless || !this.formatEnabled
      ? null
      : this.createFormat(this.formatContainer)

  if (this.format !== null) {
    this.container.appendChild(this.formatContainer)
  }

  // Creates the footer
  let footer = this.editor.chromeless ? null : this.createFooter()

  if (footer !== null) {
    this.footerContainer.appendChild(footer)
    this.container.appendChild(this.footerContainer)
  }

  if (this.sidebar !== null && this.sidebarFooterContainer) {
    this.container.appendChild(this.sidebarFooterContainer)
  }

  this.container.appendChild(this.diagramContainer)

  if (this.container !== null && this.tabContainer !== null) {
    this.container.appendChild(this.tabContainer)
  }

  // Creates toolbar
  this.toolbar = this.editor.chromeless
    ? null
    : this.createToolbar(this.createDiv('geToolbar'))

  if (this.toolbar !== null) {
    this.toolbarContainer.appendChild(this.toolbar.container)
    this.container.appendChild(this.toolbarContainer)
  }

  // HSplit
  if (this.sidebar !== null) {
    this.container.appendChild(this.hsplit)

    this.addSplitHandler(
      this.hsplit,
      true,
      0,
      MxUtils.bind(this, function(value) {
        this.hsplitPosition = value
        this.refresh()
      })
    )
  }
}

/**
 * Creates a new toolbar for the given container.
 */
EditorUi.prototype.createStatusContainer = () => {
  let container = document.createElement('a')
  container.className = 'geItem geStatus'

  if (screen.width < 420) {
    container.style.maxWidth = Math.max(20, screen.width - 320) + 'px'
    container.style.overflow = 'hidden'
  }

  return container
}

/**
 * Creates a new toolbar for the given container.
 */
EditorUi.prototype.setStatusText = (value) => {
  this.statusContainer.innerHTML = value
}

/**
 * Creates a new toolbar for the given container.
 */
EditorUi.prototype.createToolbar = (container) => {
  return new Toolbar(this, container)
}

/**
 * Creates a new sidebar for the given container.
 */
EditorUi.prototype.createSidebar = (container) => {
  return new Sidebar(this, container)
}

/**
 * Creates a new sidebar for the given container.
 */
EditorUi.prototype.createFormat = (container) => {
  return new Format(this, container)
}

/**
 * Creates and returns a new footer.
 */
EditorUi.prototype.createFooter = () => {
  return this.createDiv('geFooter')
}

/**
 * Creates the actual toolbar for the toolbar container.
 */
EditorUi.prototype.createDiv = (classname) => {
  let elt = document.createElement('div')
  elt.className = classname

  return elt
}

/**
 * Updates the states of the given undo/redo items.
 */
EditorUi.prototype.addSplitHandler = (elt, horizontal, dx, onChange) => {
  let start = null
  let initial = null
  let ignoreClick = true
  let last = null

  // Disables built-in pan and zoom in IE10 and later
  if (MxClient.IS_POINTER) {
    elt.style.touchAction = 'none'
  }

  let getValue = MxUtils.bind(this, () => {
    let result = parseInt(horizontal ? elt.style.left : elt.style.bottom)

    // Takes into account hidden footer
    if (!horizontal) {
      result = result + dx - this.footerHeight
    }

    return result
  })

  function moveHandler(evt) {
    if (start !== null) {
      let pt = new MxPoint(MxEvent.getClientX(evt), MxEvent.getClientY(evt))
      onChange(Math.max(0, initial + (horizontal ? pt.x - start.x : start.y - pt.y) - dx)
      )
      MxEvent.consume(evt)

      if (initial !== getValue()) {
        ignoreClick = true
        last = null
      }
    }
  }

  function dropHandler(evt) {
    moveHandler(evt)
    initial = null
    start = null
  }

  MxEvent.addGestureListeners(elt, (evt) => {
    start = new MxPoint(MxEvent.getClientX(evt), MxEvent.getClientY(evt))
    initial = getValue()
    ignoreClick = false
    MxEvent.consume(evt)
  })

  MxEvent.addListener(elt, 'click', (evt) => {
    if (!ignoreClick) {
      let next = last !== null ? last - dx : 0
      last = getValue()
      onChange(next)
      MxEvent.consume(evt)
    }
  })

  MxEvent.addGestureListeners(document, null, moveHandler, dropHandler)

  this.destroyFunctions.push(() => {
    MxEvent.removeGestureListeners(document, null, moveHandler, dropHandler)
  })
}

/**
 * Displays a print dialog.
 */
EditorUi.prototype.showDialog = function(
  elt,
  w,
  h,
  modal,
  closable,
  onClose,
  noScroll
) {
  this.editor.graph.tooltipHandler.hideTooltip()

  if (this.dialogs == null) {
    this.dialogs = []
  }

  this.dialog = new Dialog(this, elt, w, h, modal, closable, onClose, noScroll)
  this.dialogs.push(this.dialog)
}

/**
 * Displays a print dialog.
 */
EditorUi.prototype.hideDialog = (cancel) => {
  if (this.dialogs !== null && this.dialogs.length > 0) {
    let dlg = this.dialogs.pop()
    dlg.close(cancel)

    this.dialog =
      this.dialogs.length > 0 ? this.dialogs[this.dialogs.length - 1] : null

    if (
      this.dialog == null &&
      this.editor.graph.container.style.visibility !== 'hidden'
    ) {
      this.editor.graph.container.focus()
    }

    this.editor.fireEvent(new MxEventObject('hideDialog'))
  }
}

/**
 * Display a color dialog.
 */
EditorUi.prototype.pickColor = (color, apply) => {
  let graph = this.editor.graph
  let selState = graph.cellEditor.saveSelection()

  let dlg = new ColorDialog(
    this,
    color || 'none',
    function(color) {
      graph.cellEditor.restoreSelection(selState)
      apply(color)
    },
    function() {
      graph.cellEditor.restoreSelection(selState)
    }
  )
  this.showDialog(dlg.container, 230, 430, true, false)
  dlg.init()
}

/**
 * Adds the label menu items to the given menu and parent.
 */
EditorUi.prototype.openFile = () => {
  // Closes dialog after open
  window.openFile = new OpenFile(
    MxUtils.bind(this, (cancel) => {
      this.hideDialog(cancel)
    })
  )

  // Removes openFile if dialog is closed
  this.showDialog(
    new OpenDialog(this).container,
    Editor.useLocalStorage ? 640 : 320,
    Editor.useLocalStorage ? 480 : 220,
    true,
    true,
    function() {
      window.openFile = null
    }
  )
}

/**
 * Extracs the graph model from the given HTML data from a data transfer event.
 */
EditorUi.prototype.extractGraphModelFromHtml = (data) => {
  let result = null

  try {
    let idx = data.indexOf('&lt;mxGraphModel ')

    if (idx >= 0) {
      let idx2 = data.lastIndexOf('&lt;/mxGraphModel&gt;')

      if (idx2 > idx) {
        result = data
          .substring(idx, idx2 + 21)
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<')
          .replace(/\\&quot;/g, '"')
          .replace(/\n/g, '')
      }
    }
  } catch (e) {
    // ignore
  }

  return result
}

/**
 * Opens the given files in the editor.
 */
EditorUi.prototype.extractGraphModelFromEvent = (evt) => {
  let result = null
  let data = null

  if (evt !== null) {
    let provider = evt.dataTransfer !== null ? evt.dataTransfer : evt.clipboardData

    if (provider !== null) {
      if (document.documentMode === 10 || document.documentMode === 11) {
        data = provider.getData('Text')
      } else {
        data =
          MxUtils.indexOf(provider.types, 'text/html') >= 0
            ? provider.getData('text/html')
            : null

        if (MxUtils.indexOf(provider.types, 'text/plain' && (data == null || data.length === 0))) {
          data = provider.getData('text/plain')
        }
      }

      if (data !== null) {
        data = this.editor.graph.zapGremlins(MxUtils.trim(data))

        // Tries parsing as HTML document with embedded XML
        let xml = this.extractGraphModelFromHtml(data)

        if (xml !== null) {
          data = xml
        }
      }
    }
  }

  if (data !== null && this.isCompatibleString(data)) {
    result = data
  }

  return result
}

/**
 * Hook for subclassers to return true if event data is a supported format.
 * This implementation always returns false.
 */
EditorUi.prototype.isCompatibleString = (data) => {
  return false
}

/**
 * Adds the label menu items to the given menu and parent.
 */
EditorUi.prototype.saveFile = (forceDialog) => {
  if (!forceDialog && this.editor.filename !== null) {
    this.save(this.editor.getOrCreateFilename())
  } else {
    let dlg = new FilenameDialog(
      this,
      this.editor.getOrCreateFilename(),
      MxResources.get('save'),
      MxUtils.bind(this, (name) => {
        this.save(name)
      }),
      null,
      MxUtils.bind(this, (name) => {
        if (name !== null && name.length > 0) {
          return true
        }

        MxUtils.confirm(MxResources.get('invalidName'))

        return false
      })
    )
    this.showDialog(dlg.container, 300, 100, true, true)
    dlg.init()
  }
}

/**
 * Saves the current graph under the given filename.
 */
EditorUi.prototype.save = (name) => {
  if (name !== null) {
    if (this.editor.graph.isEditing()) {
      this.editor.graph.stopEditing()
    }

    let xml = MxUtils.getXml(this.editor.getGraphXml())

    try {
      if (Editor.useLocalStorage) {
        if (
          localStorage.getItem(name) !== null &&
          !MxUtils.confirm(MxResources.get('replaceIt', [name]))
        ) {
          return
        }

        localStorage.setItem(name, xml)
        this.editor.setStatus(
          MxUtils.htmlEntities(MxResources.get('saved')) + ' ' + new Date()
        )
      } else {
        if (xml.length < window.MAX_REQUEST_SIZE) {
          new MxXmlRequest(
            window.SAVE_URL,
            'filename=' +
              encodeURIComponent(name) +
              '&xml=' +
              encodeURIComponent(xml)
          ).simulate(document, '_blank')
        } else {
          MxUtils.alert(MxResources.get('drawingTooLarge'))
          MxUtils.popup(xml)

          return
        }
      }

      this.editor.setModified(false)
      this.editor.setFilename(name)
      this.updateDocumentTitle()
    } catch (e) {
      this.editor.setStatus(
        MxUtils.htmlEntities(MxResources.get('errorSavingFile'))
      )
    }
  }
}

/**
 * Executes the given layout.
 */
EditorUi.prototype.executeLayout = (exec, animate, post) => {
  let graph = this.editor.graph

  if (graph.isEnabled()) {
    graph.getModel().beginUpdate()
    try {
      exec()
    } catch (e) {
      throw e
    } finally {
      // Animates the changes in the graph model except
      // for Camino, where animation is too slow
      if (
        this.allowAnimation &&
        animate &&
        navigator.userAgent.indexOf('Camino') < 0
      ) {
        // New API for animating graph layout results asynchronously
        let morph = new MxMorphing(graph)
        morph.addListener(
          MxEvent.DONE,
          MxUtils.bind(this, function() {
            graph.getModel().endUpdate()

            if (post !== null) {
              post()
            }
          })
        )

        morph.startAnimation()
      } else {
        graph.getModel().endUpdate()

        if (post !== null) {
          post()
        }
      }
    }
  }
}

/**
 * Hides the current menu.
 */
EditorUi.prototype.showImageDialog = (title, value, fn, ignoreExisting) => {
  let cellEditor = this.editor.graph.cellEditor
  let selState = cellEditor.saveSelection()
  let newValue = MxUtils.prompt(title, value)
  cellEditor.restoreSelection(selState)

  if (newValue !== null && newValue.length > 0) {
    let img = new Image()

    img.onload = () => {
      fn(newValue, img.width, img.height)
    }
    img.onerror = () => {
      fn(null)
      MxUtils.alert(MxResources.get('fileNotFound'))
    }

    img.src = newValue
  } else {
    fn(null)
  }
}

/**
 * Hides the current menu.
 */
EditorUi.prototype.showLinkDialog = (value, btnLabel, fn) => {
  let dlg = new LinkDialog(this, value, btnLabel, fn)
  this.showDialog(dlg.container, 420, 90, true, true)
  dlg.init()
}

/**
 * Hides the current menu.
 */
EditorUi.prototype.showBackgroundImageDialog = (apply) => {
  apply =
    apply !== null
      ? apply
      : MxUtils.bind(this, (image) => {
        let change = new ChangePageSetup(this, null, image)
        change.ignoreColor = true

        this.editor.graph.model.execute(change)
      })

  let newValue = MxUtils.prompt(MxResources.get('backgroundImage'), '')

  if (newValue !== null && newValue.length > 0) {
    let img = new Image()

    img.onload = () => {
      apply(new MxImage(newValue, img.width, img.height))
    }
    img.onerror = () => {
      apply(null)
      MxUtils.alert(MxResources.get('fileNotFound'))
    }

    img.src = newValue
  } else {
    apply(null)
  }
}

/**
 * Loads the stylesheet for this graph.
 */
EditorUi.prototype.setBackgroundImage = (image) => {
  this.editor.graph.setBackgroundImage(image)
  this.editor.graph.view.validateBackgroundImage()

  this.fireEvent(new MxEventObject('backgroundImageChanged'))
}

/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.confirm = (msg, okFn, cancelFn) => {
  if (MxUtils.confirm(msg)) {
    if (okFn !== null) {
      okFn()
    }
  } else if (cancelFn !== null) {
    cancelFn()
  }
}

/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.createOutline = (wnd) => {
  let outline = new MxOutline(this.editor.graph)
  outline.border = 20

  MxEvent.addListener(window, 'resize', () => {
    outline.update()
  })

  this.addListener('pageFormatChanged', () => {
    outline.update()
  })

  return outline
}

/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.createKeyHandler = (editor) => {
  let editorUi = this
  let graph = this.editor.graph
  let keyHandler = new MxKeyHandler(graph)

  let isEventIgnored = keyHandler.isEventIgnored
  keyHandler.isEventIgnored = (evt) => {
    // Handles undo/redo/ctrl+./,/u via action and allows ctrl+b/i only if editing value is HTML (except for FF and Safari)
    return (
      (!this.isControlDown(evt) ||
        MxEvent.isShiftDown(evt) ||
        (evt.keyCode !== 90 &&
          evt.keyCode !== 89 &&
          evt.keyCode !== 188 &&
          evt.keyCode !== 190 &&
          evt.keyCode !== 85)) &&
      ((evt.keyCode !== 66 && evt.keyCode !== 73) ||
        !this.isControlDown(evt) ||
        (this.graph.cellEditor.isContentEditing() &&
          !MxClient.IS_FF &&
          !MxClient.IS_SF)) &&
      isEventIgnored.apply(this, arguments)
    )
  }

  // Ignores graph enabled state but not chromeless state
  keyHandler.isEnabledForEvent = (evt) => {
    return (
      !MxEvent.isConsumed(evt) && this.isGraphEvent(evt) && this.isEnabled()
    )
  }

  // Routes command-key to control-key on Mac
  keyHandler.isControlDown = (evt) => {
    return MxEvent.isControlDown(evt) || (MxClient.IS_MAC && evt.metaKey)
  }

  let queue = []
  let thread = null

  // Helper function to move cells with the cursor keys
  function nudge(keyCode, stepSize, resize) {
    queue.push(() => {
      if (!graph.isSelectionEmpty() && graph.isEnabled()) {
        stepSize = stepSize !== null ? stepSize : 1

        if (resize) {
          // Resizes all selected vertices
          graph.getModel().beginUpdate()
          try {
            let cells = graph.getSelectionCells()

            for (let i = 0; i < cells.length; i++) {
              if (graph.getModel().isVertex(cells[i]) && graph.isCellResizable(cells[i])) {
                let geo = graph.getCellGeometry(cells[i])

                if (geo !== null) {
                  geo = geo.clone()

                  if (keyCode === 37) {
                    geo.width = Math.max(0, geo.width - stepSize)
                  } else if (keyCode === 38) {
                    geo.height = Math.max(0, geo.height - stepSize)
                  } else if (keyCode === 39) {
                    geo.width += stepSize
                  } else if (keyCode === 40) {
                    geo.height += stepSize
                  }

                  graph.getModel().setGeometry(cells[i], geo)
                }
              }
            }
          } finally {
            graph.getModel().endUpdate()
          }
        } else {
          // Moves vertices up/down in a stack layout
          let cell = graph.getSelectionCell()
          let parent = graph.model.getParent(cell)
          let layout = null

          if (
            graph.getSelectionCount() === 1 &&
            graph.model.isVertex(cell) &&
            graph.layoutManager !== null &&
            !graph.isCellLocked(cell)
          ) {
            layout = graph.layoutManager.getLayout(parent)
          }

          if (layout !== null && layout.constructor === MxStackLayout) {
            let index = parent.getIndex(cell)

            if (keyCode === 37 || keyCode === 38) {
              graph.model.add(parent, cell, Math.max(0, index - 1))
            } else if (keyCode === 39 || keyCode === 40) {
              graph.model.add(
                parent,
                cell,
                Math.min(graph.model.getChildCount(parent), index + 1)
              )
            }
          } else {
            let dx = 0
            let dy = 0

            if (keyCode === 37) {
              dx = -stepSize
            } else if (keyCode === 38) {
              dy = -stepSize
            } else if (keyCode === 39) {
              dx = stepSize
            } else if (keyCode === 40) {
              dy = stepSize
            }

            graph.moveCells(graph.getMovableCells(graph.getSelectionCells()), dx,
              dy
            )
          }
        }
      }
    })

    if (thread !== null) {
      window.clearTimeout(thread)
    }

    thread = window.setTimeout(() => {
      if (queue.length > 0) {
        graph.getModel().beginUpdate()
        try {
          for (let i = 0; i < queue.length; i++) {
            queue[i]()
          }

          queue = []
        } finally {
          graph.getModel().endUpdate()
        }
        graph.scrollCellToVisible(graph.getSelectionCell())
      }
    }, 200)
  }

  // Overridden to handle special alt+shift+cursor keyboard shortcuts
  let directions = {
    37: MxConstants.DIRECTION_WEST,
    38: MxConstants.DIRECTION_NORTH,
    39: MxConstants.DIRECTION_EAST,
    40: MxConstants.DIRECTION_SOUTH
  }

  let keyHandlerGetFunction = keyHandler.getFunction

  // Alt+Shift+Keycode mapping to action
  let altShiftActions = {
    67: this.actions.get('clearWaypoints'), // Alt+Shift+C
    65: this.actions.get('connectionArrows'), // Alt+Shift+A
    80: this.actions.get('connectionPoints') // Alt+Shift+P
  }

  MxKeyHandler.prototype.getFunction = (evt) => {
    if (graph.isEnabled()) {
      // TODO: Add alt modified state in core API, here are some specific cases
      if (MxEvent.isShiftDown(evt) && MxEvent.isAltDown(evt)) {
        let action = altShiftActions[evt.keyCode]

        if (action !== null) {
          return action.funct
        }
      }

      if (evt.keyCode === 9 && MxEvent.isAltDown(evt)) {
        if (MxEvent.isShiftDown(evt)) {
          // Alt+Shift+Tab
          return function() {
            graph.selectParentCell()
          }
        } else {
          // Alt+Tab
          return () => {
            graph.selectChildCell()
          }
        }
      } else if (directions[evt.keyCode] !== null && !graph.isSelectionEmpty()) {
        if (MxEvent.isShiftDown(evt) && MxEvent.isAltDown(evt)) {
          if (graph.model.isVertex(graph.getSelectionCell())) {
            return () => {
              let cells = graph.connectVertex(
                graph.getSelectionCell(),
                directions[evt.keyCode],
                graph.defaultEdgeLength,
                evt,
                true
              )

              if (cells !== null && cells.length > 0) {
                if (cells.length === 1 && graph.model.isEdge(cells[0])) {
                  graph.setSelectionCell(
                    graph.model.getTerminal(cells[0], false)
                  )
                } else {
                  graph.setSelectionCell(cells[cells.length - 1])
                }

                graph.scrollCellToVisible(graph.getSelectionCell())

                if (editorUi.hoverIcons !== null) {
                  editorUi.hoverIcons.update(
                    graph.view.getState(graph.getSelectionCell())
                  )
                }
              }
            }
          }
        } else {
          // Avoids consuming event if no vertex is selected by returning null below
          // Cursor keys move and resize (ctrl) cells
          if (this.isControlDown(evt)) {
            return function() {
              nudge(
                evt.keyCode,
                MxEvent.isShiftDown(evt) ? graph.gridSize : null,
                true
              )
            }
          } else {
            return function() {
              nudge(
                evt.keyCode,
                MxEvent.isShiftDown(evt) ? graph.gridSize : null
              )
            }
          }
        }
      }
    }

    return keyHandlerGetFunction.apply(this, arguments)
  }

  // Binds keystrokes to actions
  keyHandler.bindAction = MxUtils.bind(this, (code, control, key, shift) => {
    let action = this.actions.get(key)

    if (action !== null) {
      let f = () => {
        if (action.isEnabled()) {
          action.funct()
        }
      }

      if (control) {
        if (shift) {
          keyHandler.bindControlShiftKey(code, f)
        } else {
          keyHandler.bindControlKey(code, f)
        }
      } else {
        if (shift) {
          keyHandler.bindShiftKey(code, f)
        } else {
          keyHandler.bindKey(code, f)
        }
      }
    }
  })

  let ui = this // eslint-disable-line no-unused-vars
  let keyHandlerEscape = keyHandler.escape
  keyHandler.escape = (evt) => {
    keyHandlerEscape.apply(this, arguments)
  }

  // Ignores enter keystroke. Remove this line if you want the
  // enter keystroke to stop editing. N, W, T are reserved.
  keyHandler.enter = () => {}

  keyHandler.bindControlShiftKey(36, () => {
    graph.exitGroup()
  }) // Ctrl+Shift+Home
  keyHandler.bindControlShiftKey(35, () => {
    graph.enterGroup()
  }) // Ctrl+Shift+End
  keyHandler.bindKey(36, () => {
    graph.home()
  }) // Home
  keyHandler.bindKey(35, () => {
    graph.refresh()
  }) // End
  keyHandler.bindAction(107, true, 'zoomIn') // Ctrl+Plus
  keyHandler.bindAction(109, true, 'zoomOut') // Ctrl+Minus
  keyHandler.bindAction(80, true, 'print') // Ctrl+P
  keyHandler.bindAction(79, true, 'outline', true) // Ctrl+Shift+O
  keyHandler.bindAction(112, false, 'about') // F1

  if (!this.editor.chromeless || this.editor.editable) {
    keyHandler.bindControlKey(36, () => {
      if (graph.isEnabled()) {
        graph.foldCells(true)
      }
    }) // Ctrl+Home
    keyHandler.bindControlKey(35, () => {
      if (graph.isEnabled()) {
        graph.foldCells(false)
      }
    }) // Ctrl+End
    keyHandler.bindControlKey(13, () => {
      if (graph.isEnabled()) {
        graph.setSelectionCells(
          graph.duplicateCells(graph.getSelectionCells(), false)
        )
      }
    }) // Ctrl+Enter
    keyHandler.bindAction(8, false, 'delete') // Backspace
    keyHandler.bindAction(8, true, 'deleteAll') // Backspace
    keyHandler.bindAction(46, false, 'delete') // Delete
    keyHandler.bindAction(46, true, 'deleteAll') // Ctrl+Delete
    keyHandler.bindAction(72, true, 'resetView') // Ctrl+H
    keyHandler.bindAction(72, true, 'fitWindow', true) // Ctrl+Shift+H
    keyHandler.bindAction(74, true, 'fitPage') // Ctrl+J
    keyHandler.bindAction(74, true, 'fitTwoPages', true) // Ctrl+Shift+J
    keyHandler.bindAction(48, true, 'customZoom') // Ctrl+0
    keyHandler.bindAction(82, true, 'turn') // Ctrl+R
    keyHandler.bindAction(82, true, 'clearDefaultStyle', true) // Ctrl+Shift+R
    keyHandler.bindAction(83, true, 'save') // Ctrl+S
    keyHandler.bindAction(83, true, 'saveAs', true) // Ctrl+Shift+S
    keyHandler.bindAction(65, true, 'selectAll') // Ctrl+A
    keyHandler.bindAction(65, true, 'selectNone', true) // Ctrl+A
    keyHandler.bindAction(73, true, 'selectVertices', true) // Ctrl+Shift+I
    keyHandler.bindAction(69, true, 'selectEdges', true) // Ctrl+Shift+E
    keyHandler.bindAction(69, true, 'editStyle') // Ctrl+E
    keyHandler.bindAction(66, true, 'bold') // Ctrl+B
    keyHandler.bindAction(66, true, 'toBack', true) // Ctrl+Shift+B
    keyHandler.bindAction(70, true, 'toFront', true) // Ctrl+Shift+F
    keyHandler.bindAction(68, true, 'duplicate') // Ctrl+D
    keyHandler.bindAction(68, true, 'setAsDefaultStyle', true) // Ctrl+Shift+D
    keyHandler.bindAction(90, true, 'undo') // Ctrl+Z
    keyHandler.bindAction(89, true, 'autosize', true) // Ctrl+Shift+Y
    keyHandler.bindAction(88, true, 'cut') // Ctrl+X
    keyHandler.bindAction(67, true, 'copy') // Ctrl+C
    keyHandler.bindAction(86, true, 'paste') // Ctrl+V
    keyHandler.bindAction(71, true, 'group') // Ctrl+G
    keyHandler.bindAction(77, true, 'editData') // Ctrl+M
    keyHandler.bindAction(71, true, 'grid', true) // Ctrl+Shift+G
    keyHandler.bindAction(73, true, 'italic') // Ctrl+I
    keyHandler.bindAction(76, true, 'lockUnlock') // Ctrl+L
    keyHandler.bindAction(76, true, 'layers', true) // Ctrl+Shift+L
    keyHandler.bindAction(80, true, 'formatPanel', true) // Ctrl+Shift+P
    keyHandler.bindAction(85, true, 'underline') // Ctrl+U
    keyHandler.bindAction(85, true, 'ungroup', true) // Ctrl+Shift+U
    keyHandler.bindAction(190, true, 'superscript') // Ctrl+.
    keyHandler.bindAction(188, true, 'subscript') // Ctrl+,
    keyHandler.bindKey(13, () => {
      if (graph.isEnabled()) {
        graph.startEditingAtCell()
      }
    }) // Enter
    keyHandler.bindKey(113, () => {
      if (graph.isEnabled()) {
        graph.startEditingAtCell()
      }
    }) // F2
  }

  if (!MxClient.IS_WIN) {
    keyHandler.bindAction(90, true, 'redo', true) // Ctrl+Shift+Z
  } else {
    keyHandler.bindAction(89, true, 'redo') // Ctrl+Y
  }

  return keyHandler
}

/**
 * Creates the keyboard event handler for the current graph and history.
 */
EditorUi.prototype.destroy = () => {
  if (this.editor !== null) {
    this.editor.destroy()
    this.editor = null
  }

  if (this.menubar !== null) {
    this.menubar.destroy()
    this.menubar = null
  }

  if (this.toolbar !== null) {
    this.toolbar.destroy()
    this.toolbar = null
  }

  if (this.sidebar !== null) {
    this.sidebar.destroy()
    this.sidebar = null
  }

  if (this.keyHandler !== null) {
    this.keyHandler.destroy()
    this.keyHandler = null
  }

  if (this.keydownHandler !== null) {
    MxEvent.removeListener(document, 'keydown', this.keydownHandler)
    this.keydownHandler = null
  }

  if (this.keyupHandler !== null) {
    MxEvent.removeListener(document, 'keyup', this.keyupHandler)
    this.keyupHandler = null
  }

  if (this.resizeHandler !== null) {
    MxEvent.removeListener(window, 'resize', this.resizeHandler)
    this.resizeHandler = null
  }

  if (this.gestureHandler !== null) {
    MxEvent.removeGestureListeners(document, this.gestureHandler)
    this.gestureHandler = null
  }

  if (this.orientationChangeHandler !== null) {
    MxEvent.removeListener(
      window,
      'orientationchange',
      this.orientationChangeHandler
    )
    this.orientationChangeHandler = null
  }

  if (this.scrollHandler !== null) {
    MxEvent.removeListener(window, 'scroll', this.scrollHandler)
    this.scrollHandler = null
  }

  if (this.destroyFunctions !== null) {
    for (let i = 0; i < this.destroyFunctions.length; i++) {
      this.destroyFunctions[i]()
    }

    this.destroyFunctions = null
  }

  let c = [
    this.menubarContainer,
    this.toolbarContainer,
    this.sidebarContainer,
    this.formatContainer,
    this.diagramContainer,
    this.footerContainer,
    this.chromelessToolbar,
    this.hsplit,
    this.sidebarFooterContainer,
    this.layersDialog
  ]

  for (let i = 0; i < c.length; i++) {
    if (c[i] !== null && c[i].parentNode !== null) {
      c[i].parentNode.removeChild(c[i])
    }
  }
}
