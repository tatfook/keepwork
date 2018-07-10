/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
import MxUtils from '../../mxGraph/util/MxUtils'
import MxEvent from '../../mxGraph/util/MxEvent'
import MxConstants from '../../mxGraph/util/MxConstants'
import MxClient from '../../mxGraph/MxClient'
import MxResources from '../../mxGraph/util/mxRectangle'
import Dialog from '../../Dialog'
import { DiagramFormatPanel } from '../../Format'
import MxEventObject from '../../mxGraph/util/MxEventObject'
import Menus from '../../Menus'
import { mxCellRenderer } from '../../mxGraph/view/mxCellRenderer'
import { FilenameDialog } from './Dialogs'
import { ChangePageSetup } from './EditorUi'
import { PageSetupDialog, Editor } from './Editor'

export default class Format {
  constructor(editorUi, container) {
    this.editorUi = editorUi
    this.container = container
  }
}

/**
 * Returns information about the current selection.
 */
Format.prototype.labelIndex = 0

/**
 * Returns information about the current selection.
 */
Format.prototype.currentIndex = 0

/**
 * Returns information about the current selection.
 */
Format.prototype.showCloseButton = true

/**
 * Background color for inactive tabs.
 */
Format.prototype.inactiveTabBackgroundColor = '#d7d7d7'

/**
 * Adds the label menu items to the given menu and parent.
 */
Format.prototype.init = function() {
  let ui = this.editorUi
  let editor = ui.editor
  let graph = editor.graph

  this.update = MxUtils.bind(this, function(sender, evt) {
    this.clearSelectionState()
    this.refresh()
  })

  graph.getSelectionModel().addListener(MxEvent.CHANGE, this.update)
  graph.addListener(MxEvent.EDITING_STARTED, this.update)
  graph.addListener(MxEvent.EDITING_STOPPED, this.update)
  graph.getModel().addListener(MxEvent.CHANGE, this.update)
  graph.addListener(
    MxEvent.ROOT,
    MxUtils.bind(this, function() {
      this.refresh()
    })
  )

  this.refresh()
}

/**
 * Returns information about the current selection.
 */
Format.prototype.clearSelectionState = function() {
  this.selectionState = null
}

/**
 * Returns information about the current selection.
 */
Format.prototype.getSelectionState = function() {
  if (this.selectionState === null) {
    this.selectionState = this.createSelectionState()
  }

  return this.selectionState
}

/**
 * Returns information about the current selection.
 */
Format.prototype.createSelectionState = function() {
  let cells = this.editorUi.editor.graph.getSelectionCells()
  let result = this.initSelectionState()

  for (let i = 0; i < cells.length; i++) {
    this.updateSelectionStateForCell(result, cells[i], cells)
  }

  return result
}

/**
 * Returns information about the current selection.
 */
Format.prototype.initSelectionState = function() {
  return {
    vertices: [],
    edges: [],
    x: null,
    y: null,
    width: null,
    height: null,
    style: {},
    containsImage: false,
    containsLabel: false,
    fill: true,
    glass: true,
    rounded: true,
    comic: true,
    autoSize: false,
    image: true,
    shadow: true,
    lineJumps: true
  }
}

/**
 * Returns information about the current selection.
 */
Format.prototype.updateSelectionStateForCell = function(result, cell, cells) {
  let graph = this.editorUi.editor.graph

  if (graph.getModel().isVertex(cell)) {
    result.vertices.push(cell)
    let geo = graph.getCellGeometry(cell)

    if (geo !== null) {
      if (geo.width > 0) {
        if (result.width === null) {
          result.width = geo.width
        } else if (result.width !== geo.width) {
          result.width = ''
        }
      } else {
        result.containsLabel = true
      }

      if (geo.height > 0) {
        if (result.height === null) {
          result.height = geo.height
        } else if (result.height !== geo.height) {
          result.height = ''
        }
      } else {
        result.containsLabel = true
      }

      if (!geo.relative || geo.offset !== null) {
        let x = geo.relative ? geo.offset.x : geo.x
        let y = geo.relative ? geo.offset.y : geo.y

        if (result.x === null) {
          result.x = x
        } else if (result.x !== x) {
          result.x = ''
        }

        if (result.y === null) {
          result.y = y
        } else if (result.y !== y) {
          result.y = ''
        }
      }
    }
  } else if (graph.getModel().isEdge(cell)) {
    result.edges.push(cell)
  }

  let state = graph.view.getState(cell)

  if (state !== null) {
    result.autoSize = result.autoSize || this.isAutoSizeState(state)
    result.glass = result.glass && this.isGlassState(state)
    result.rounded = result.rounded && this.isRoundedState(state)
    result.lineJumps = result.lineJumps && this.isLineJumpState(state)
    result.comic = result.comic && this.isComicState(state)
    result.image = result.image && this.isImageState(state)
    result.shadow = result.shadow && this.isShadowState(state)
    result.fill = result.fill && this.isFillState(state)

    let shape = MxUtils.getValue(state.style, MxConstants.STYLE_SHAPE, null)
    result.containsImage = result.containsImage || shape === 'image'

    for (let key in state.style) {
      let value = state.style[key]

      if (value !== null) {
        if (result.style[key] === null) {
          result.style[key] = value
        } else if (result.style[key] !== value) {
          result.style[key] = ''
        }
      }
    }
  }
}

/**
 * Returns information about the current selection.
 */
Format.prototype.isFillState = function(state) {
  return (
    state.view.graph.model.isVertex(state.cell) ||
    MxUtils.getValue(state.style, MxConstants.STYLE_SHAPE, null) === 'arrow' ||
    MxUtils.getValue(state.style, MxConstants.STYLE_SHAPE, null) ===
      'filledEdge' ||
    MxUtils.getValue(state.style, MxConstants.STYLE_SHAPE, null) === 'flexArrow'
  )
}

/**
 * Returns information about the current selection.
 */
Format.prototype.isGlassState = function(state) {
  let shape = MxUtils.getValue(state.style, MxConstants.STYLE_SHAPE, null)

  return (
    shape === 'label' ||
    shape === 'rectangle' ||
    shape === 'internalStorage' ||
    shape === 'ext' ||
    shape === 'umlLifeline' ||
    shape === 'swimlane' ||
    shape === 'process'
  )
}

/**
 * Returns information about the current selection.
 */
Format.prototype.isRoundedState = function(state) {
  let shape = MxUtils.getValue(state.style, MxConstants.STYLE_SHAPE, null)

  return (
    shape === 'label' ||
    shape === 'rectangle' ||
    shape === 'internalStorage' ||
    shape === 'corner' ||
    shape === 'parallelogram' ||
    shape === 'swimlane' ||
    shape === 'triangle' ||
    shape === 'trapezoid' ||
    shape === 'ext' ||
    shape === 'step' ||
    shape === 'tee' ||
    shape === 'process' ||
    shape === 'link' ||
    shape === 'rhombus' ||
    shape === 'offPageConnector' ||
    shape === 'loopLimit' ||
    shape === 'hexagon' ||
    shape === 'manualInput' ||
    shape === 'curlyBracket' ||
    shape === 'singleArrow' ||
    shape === 'callout' ||
    shape === 'doubleArrow' ||
    shape === 'flexArrow' ||
    shape === 'card' ||
    shape === 'umlLifeline'
  )
}

/**
 * Returns information about the current selection.
 */
Format.prototype.isLineJumpState = function(state) {
  let shape = MxUtils.getValue(state.style, MxConstants.STYLE_SHAPE, null)

  return shape === 'connector' || shape === 'filledEdge'
}

/**
 * Returns information about the current selection.
 */
Format.prototype.isComicState = function(state) {
  let shape = MxUtils.getValue(state.style, MxConstants.STYLE_SHAPE, null)

  return (
    MxUtils.indexOf(
      [
        'label',
        'rectangle',
        'internalStorage',
        'corner',
        'parallelogram',
        'note',
        'collate',
        'swimlane',
        'triangle',
        'trapezoid',
        'ext',
        'step',
        'tee',
        'process',
        'link',
        'rhombus',
        'offPageConnector',
        'loopLimit',
        'hexagon',
        'manualInput',
        'singleArrow',
        'doubleArrow',
        'flexArrow',
        'filledEdge',
        'card',
        'umlLifeline',
        'connector',
        'folder',
        'component',
        'sortShape',
        'cross',
        'umlFrame',
        'cube',
        'isoCube',
        'isoRectangle',
        'partialRectangle'
      ],
      shape
    ) >= 0
  )
}

/**
 * Returns information about the current selection.
 */
Format.prototype.isAutoSizeState = function(state) {
  return MxUtils.getValue(state.style, MxConstants.STYLE_AUTOSIZE, null) === '1'
}

/**
 * Returns information about the current selection.
 */
Format.prototype.isImageState = function(state) {
  let shape = MxUtils.getValue(state.style, MxConstants.STYLE_SHAPE, null)

  return shape === 'label' || shape === 'image'
}

/**
 * Returns information about the current selection.
 */
Format.prototype.isShadowState = function(state) {
  let shape = MxUtils.getValue(state.style, MxConstants.STYLE_SHAPE, null)

  return shape !== 'image'
}

/**
 * Adds the label menu items to the given menu and parent.
 */
Format.prototype.clear = function() {
  this.container.innerHTML = ''

  // Destroy existing panels
  if (this.panels !== null) {
    for (let i = 0; i < this.panels.length; i++) {
      this.panels[i].destroy()
    }
  }

  this.panels = []
}

/**
 * Adds the label menu items to the given menu and parent.
 */
Format.prototype.refresh = function() {
  // Performance tweak: No refresh needed if not visible
  if (this.container.style.width === '0px') {
    return
  }

  this.clear()
  let ui = this.editorUi
  let graph = ui.editor.graph

  let div = document.createElement('div')
  div.style.whiteSpace = 'nowrap'
  div.style.color = 'rgb(112, 112, 112)'
  div.style.textAlign = 'left'
  div.style.cursor = 'default'

  let label = document.createElement('div')
  label.style.border = '1px solid #c0c0c0'
  label.style.borderWidth = '0px 0px 1px 0px'
  label.style.textAlign = 'center'
  label.style.fontWeight = 'bold'
  label.style.overflow = 'hidden'
  label.style.display = MxClient.IS_QUIRKS ? 'inline' : 'inline-block'
  label.style.paddingTop = '8px'
  label.style.height = MxClient.IS_QUIRKS ? '34px' : '25px'
  label.style.width = '100%'
  this.container.appendChild(div)

  if (graph.isSelectionEmpty()) {
    MxUtils.write(label, MxResources.get('diagram'))

    // Adds button to hide the format panel since
    // people don't seem to find the toolbar button
    // and the menu item in the format menu
    if (this.showCloseButton) {
      let img = document.createElement('img')
      img.setAttribute('border', '0')
      img.setAttribute('src', Dialog.prototype.closeImage)
      img.setAttribute('title', MxResources.get('hide'))
      img.style.position = 'absolute'
      img.style.display = 'block'
      img.style.right = '0px'
      img.style.top = '8px'
      img.style.cursor = 'pointer'
      img.style.marginTop = '1px'
      img.style.marginRight = '17px'
      img.style.border = '1px solid transparent'
      img.style.padding = '1px'
      img.style.opacity = 0.5
      label.appendChild(img)

      MxEvent.addListener(img, 'click', function() {
        ui.actions.get('formatPanel').funct()
      })
    }

    div.appendChild(label)
    this.panels.push(new DiagramFormatPanel(this, ui, div))
  } else if (graph.isEditing()) {
    MxUtils.write(label, MxResources.get('text'))
    div.appendChild(label)
    this.panels.push(new TextFormatPanel(this, ui, div))
  } else {
    let containsLabel = this.getSelectionState().containsLabel
    let currentLabel = null
    let currentPanel = null

    let addClickHandler = MxUtils.bind(this, function(elt, panel, index) {
      let clickHandler = MxUtils.bind(this, function(evt) {
        if (currentLabel !== elt) {
          if (containsLabel) {
            this.labelIndex = index
          } else {
            this.currentIndex = index
          }

          if (currentLabel !== null) {
            currentLabel.style.backgroundColor = this.inactiveTabBackgroundColor
            currentLabel.style.borderBottomWidth = '1px'
          }

          currentLabel = elt
          currentLabel.style.backgroundColor = ''
          currentLabel.style.borderBottomWidth = '0px'

          if (currentPanel !== panel) {
            if (currentPanel !== null) {
              currentPanel.style.display = 'none'
            }

            currentPanel = panel
            currentPanel.style.display = ''
          }
        }
      })

      MxEvent.addListener(elt, 'click', clickHandler)

      if (index === (containsLabel ? this.labelIndex : this.currentIndex)) {
        // Invokes handler directly as a workaround for no click on DIV in KHTML.
        clickHandler()
      }
    })

    let idx = 0

    label.style.backgroundColor = this.inactiveTabBackgroundColor
    label.style.borderLeftWidth = '1px'
    label.style.width = containsLabel ? '50%' : '33.3%'
    label.style.width = containsLabel ? '50%' : '33.3%'
    let label2 = label.cloneNode(false)
    let label3 = label2.cloneNode(false)

    // Workaround for ignored background in IE
    label2.style.backgroundColor = this.inactiveTabBackgroundColor
    label3.style.backgroundColor = this.inactiveTabBackgroundColor

    // Style
    if (containsLabel) {
      label2.style.borderLeftWidth = '0px'
    } else {
      label.style.borderLeftWidth = '0px'
      MxUtils.write(label, MxResources.get('style'))
      div.appendChild(label)

      let stylePanel = div.cloneNode(false)
      stylePanel.style.display = 'none'
      this.panels.push(new StyleFormatPanel(this, ui, stylePanel))
      this.container.appendChild(stylePanel)

      addClickHandler(label, stylePanel, idx++)
    }

    // Text
    MxUtils.write(label2, MxResources.get('text'))
    div.appendChild(label2)

    let textPanel = div.cloneNode(false)
    textPanel.style.display = 'none'
    this.panels.push(new TextFormatPanel(this, ui, textPanel))
    this.container.appendChild(textPanel)

    // Arrange
    MxUtils.write(label3, MxResources.get('arrange'))
    div.appendChild(label3)

    let arrangePanel = div.cloneNode(false)
    arrangePanel.style.display = 'none'
    this.panels.push(new ArrangePanel(this, ui, arrangePanel))
    this.container.appendChild(arrangePanel)

    addClickHandler(label2, textPanel, idx++)
    addClickHandler(label3, arrangePanel, idx++)
  }
}

/**
 * Base class for format panels.
 */
export class BaseFormatPanel {
  constructor(format, editorUi, container) {
    this.format = format
    this.editorUi = editorUi
    this.container = container
    this.listeners = []
  }
}

/**
 *
 */
BaseFormatPanel.prototype.buttonBackgroundColor = 'white'

/**
 * Adds the given color option.
 */
BaseFormatPanel.prototype.getSelectionState = function() {
  let graph = this.editorUi.editor.graph
  let cells = graph.getSelectionCells()
  let shape = null

  for (let i = 0; i < cells.length; i++) {
    let state = graph.view.getState(cells[i])

    if (state !== null) {
      let tmp = MxUtils.getValue(state.style, MxConstants.STYLE_SHAPE, null)

      if (tmp !== null) {
        if (shape === null) {
          shape = tmp
        } else if (shape !== tmp) {
          return null
        }
      }
    }
  }

  return shape
}

/**
 * Install input handler.
 */
BaseFormatPanel.prototype.installInputHandler = function(
  input,
  key,
  defaultValue,
  min,
  max,
  unit,
  textEditFallback,
  isFloat
) {
  unit = unit !== null ? unit : ''
  isFloat = isFloat !== null ? isFloat : false

  let ui = this.editorUi
  let graph = ui.editor.graph

  min = min !== null ? min : 1
  max = max !== null ? max : 999

  let selState = null
  let updating = false

  let update = MxUtils.bind(this, function(evt) {
    let value = isFloat ? parseFloat(input.value) : parseInt(input.value)

    // Special case: angle mod 360
    if (!isNaN(value) && key === MxConstants.STYLE_ROTATION) {
      // Workaround for decimal rounding errors in floats is to
      // use integer and round all numbers to two decimal point
      value = MxUtils.mod(Math.round(value * 100), 36000) / 100
    }

    value = Math.min(max, Math.max(min, isNaN(value) ? defaultValue : value))

    if (graph.cellEditor.isContentEditing() && textEditFallback) {
      if (!updating) {
        updating = true

        if (selState !== null) {
          graph.cellEditor.restoreSelection(selState)
          selState = null
        }

        textEditFallback(value)
        input.value = value + unit

        // Restore focus and selection in input
        updating = false
      }
    } else if (
      value !==
      MxUtils.getValue(this.format.getSelectionState().style, key, defaultValue)
    ) {
      if (graph.isEditing()) {
        graph.stopEditing(true)
      }

      graph.getModel().beginUpdate()
      try {
        graph.setCellStyles(key, value, graph.getSelectionCells())

        // Handles special case for fontSize where HTML labels are parsed and updated
        if (key === MxConstants.STYLE_FONTSIZE) {
          graph.updateLabelElements(graph.getSelectionCells(), function(elt) {
            elt.style.fontSize = value + 'px'
            elt.removeAttribute('size')
          })
        }

        ui.fireEvent(
          new MxEventObject(
            'styleChanged',
            'keys',
            [key],
            'values',
            [value],
            'cells',
            graph.getSelectionCells()
          )
        )
      } finally {
        graph.getModel().endUpdate()
      }
    }

    input.value = value + unit
    MxEvent.consume(evt)
  })

  if (textEditFallback && graph.cellEditor.isContentEditing()) {
    // KNOWN: Arrow up/down clear selection text in quirks/IE 8
    // Text size via arrow button limits to 16 in IE11. Why?
    MxEvent.addListener(input, 'mousedown', function() {
      if (document.activeElement === graph.cellEditor.textarea) {
        selState = graph.cellEditor.saveSelection()
      }
    })

    MxEvent.addListener(input, 'touchstart', function() {
      if (document.activeElement === graph.cellEditor.textarea) {
        selState = graph.cellEditor.saveSelection()
      }
    })
  }

  MxEvent.addListener(input, 'change', update)
  MxEvent.addListener(input, 'blur', update)

  return update
}

/**
 * Adds the given option.
 */
BaseFormatPanel.prototype.createPanel = function() {
  let div = document.createElement('div')
  div.style.padding = '12px 0px 12px 18px'
  div.style.borderBottom = '1px solid #c0c0c0'

  return div
}

/**
 * Adds the given option.
 */
BaseFormatPanel.prototype.createTitle = function(title) {
  let div = document.createElement('div')
  div.style.padding = '0px 0px 6px 0px'
  div.style.whiteSpace = 'nowrap'
  div.style.overflow = 'hidden'
  div.style.width = '200px'
  div.style.fontWeight = 'bold'
  MxUtils.write(div, title)

  return div
}

/**
 *
 */
BaseFormatPanel.prototype.createStepper = function(
  input,
  update,
  step,
  height,
  disableFocus,
  defaultValue
) {
  step = step !== null ? step : 1
  height = height !== null ? height : 8

  if (MxClient.IS_QUIRKS) {
    height = height - 2
  } else if (MxClient.IS_MT || document.documentMode >= 8) {
    height = height + 1
  }

  let stepper = document.createElement('div')
  MxUtils.setPrefixedStyle(stepper.style, 'borderRadius', '3px')
  stepper.style.border = '1px solid rgb(192, 192, 192)'
  stepper.style.position = 'absolute'

  let up = document.createElement('div')
  up.style.borderBottom = '1px solid rgb(192, 192, 192)'
  up.style.position = 'relative'
  up.style.height = height + 'px'
  up.style.width = '10px'
  up.className = 'geBtnUp'
  stepper.appendChild(up)

  let down = up.cloneNode(false)
  down.style.border = 'none'
  down.style.height = height + 'px'
  down.className = 'geBtnDown'
  stepper.appendChild(down)

  MxEvent.addListener(down, 'click', function(evt) {
    if (input.value === '') {
      input.value = defaultValue || '2'
    }

    let val = parseInt(input.value)

    if (!isNaN(val)) {
      input.value = val - step

      if (update !== null) {
        update(evt)
      }
    }

    MxEvent.consume(evt)
  })

  MxEvent.addListener(up, 'click', function(evt) {
    if (input.value === '') {
      input.value = defaultValue || '0'
    }

    let val = parseInt(input.value)

    if (!isNaN(val)) {
      input.value = val + step

      if (update !== null) {
        update(evt)
      }
    }

    MxEvent.consume(evt)
  })

  // Disables transfer of focus to DIV but also :active CSS
  // so it's only used for fontSize where the focus should
  // stay on the selected text, but not for any other input.
  if (disableFocus) {
    let currentSelection = null

    MxEvent.addGestureListeners(
      stepper,
      function(evt) {
        // Workaround for lost current selection in page because of focus in IE
        if (MxClient.IS_QUIRKS || document.documentMode === 8) {
          currentSelection = document.selection.createRange()
        }

        MxEvent.consume(evt)
      },
      null,
      function(evt) {
        // Workaround for lost current selection in page because of focus in IE
        if (currentSelection !== null) {
          try {
            currentSelection.select()
          } catch (e) {
            // ignore
          }

          currentSelection = null
          MxEvent.consume(evt)
        }
      }
    )
  }

  return stepper
}

/**
 * Adds the given option.
 */
BaseFormatPanel.prototype.createOption = function(
  label,
  isCheckedFn,
  setCheckedFn,
  listener
) {
  let div = document.createElement('div')
  div.style.padding = '6px 0px 1px 0px'
  div.style.whiteSpace = 'nowrap'
  div.style.overflow = 'hidden'
  div.style.width = '200px'
  div.style.height = MxClient.IS_QUIRKS ? '27px' : '18px'

  let cb = document.createElement('input')
  cb.setAttribute('type', 'checkbox')
  cb.style.margin = '0px 6px 0px 0px'
  div.appendChild(cb)

  let span = document.createElement('span')
  MxUtils.write(span, label)
  div.appendChild(span)

  let applying = false
  let value = isCheckedFn()

  let apply = function(newValue) {
    if (!applying) {
      applying = true

      if (newValue) {
        cb.setAttribute('checked', 'checked')
        cb.defaultChecked = true
        cb.checked = true
      } else {
        cb.removeAttribute('checked')
        cb.defaultChecked = false
        cb.checked = false
      }

      if (value !== newValue) {
        value = newValue

        // Checks if the color value needs to be updated in the model
        if (isCheckedFn() !== value) {
          setCheckedFn(value)
        }
      }

      applying = false
    }
  }

  MxEvent.addListener(div, 'click', function(evt) {
    if (cb.getAttribute('disabled') !== 'disabled') {
      // Toggles checkbox state for click on label
      let source = MxEvent.getSource(evt)

      if (source === div || source === span) {
        cb.checked = !cb.checked
      }

      apply(cb.checked)
    }

    MxEvent.consume(evt)
  })

  apply(value)

  if (listener !== null) {
    listener.install(apply)
    this.listeners.push(listener)
  }

  return div
}

/**
 * The string 'null' means use null in values.
 */
BaseFormatPanel.prototype.createCellOption = function(
  label,
  key,
  defaultValue,
  enabledValue,
  disabledValue,
  fn,
  action,
  stopEditing
) {
  enabledValue =
    enabledValue !== null
      ? enabledValue === 'null'
        ? null
        : enabledValue
      : '1'
  disabledValue =
    disabledValue !== null
      ? disabledValue === 'null'
        ? null
        : disabledValue
      : '0'

  let ui = this.editorUi
  let editor = ui.editor
  let graph = editor.graph

  return this.createOption(
    label,
    function() {
      // Seems to be null sometimes, not sure why...
      let state = graph.view.getState(graph.getSelectionCell())

      if (state !== null) {
        return (
          MxUtils.getValue(state.style, key, defaultValue) !== disabledValue
        )
      }

      return null
    },
    function(checked) {
      if (stopEditing) {
        graph.stopEditing()
      }

      if (action !== null) {
        action.funct()
      } else {
        graph.getModel().beginUpdate()
        try {
          let value = checked ? enabledValue : disabledValue
          graph.setCellStyles(key, value, graph.getSelectionCells())

          if (fn !== null) {
            fn(graph.getSelectionCells(), value)
          }

          ui.fireEvent(
            new MxEventObject(
              'styleChanged',
              'keys',
              [key],
              'values',
              [value],
              'cells',
              graph.getSelectionCells()
            )
          )
        } finally {
          graph.getModel().endUpdate()
        }
      }
    },
    {
      install: function(apply) {
        this.listener = function() {
          // Seems to be null sometimes, not sure why...
          let state = graph.view.getState(graph.getSelectionCell())

          if (state !== null) {
            apply(
              MxUtils.getValue(state.style, key, defaultValue) !== disabledValue
            )
          }
        }

        graph.getModel().addListener(MxEvent.CHANGE, this.listener)
      },
      destroy: function() {
        graph.getModel().removeListener(this.listener)
      }
    }
  )
}

/**
 * Adds the given color option.
 */
BaseFormatPanel.prototype.createColorOption = function(
  label,
  getColorFn,
  setColorFn,
  defaultColor,
  listener,
  callbackFn,
  hideCheckbox
) {
  let div = document.createElement('div')
  div.style.padding = '6px 0px 1px 0px'
  div.style.whiteSpace = 'nowrap'
  div.style.overflow = 'hidden'
  div.style.width = '200px'
  div.style.height = MxClient.IS_QUIRKS ? '27px' : '18px'

  let cb = document.createElement('input')
  cb.setAttribute('type', 'checkbox')
  cb.style.margin = '0px 6px 0px 0px'

  if (!hideCheckbox) {
    div.appendChild(cb)
  }

  let span = document.createElement('span')
  MxUtils.write(span, label)
  div.appendChild(span)

  let applying = false
  let value = getColorFn()

  let btn = null

  let apply = function(color, disableUpdate, forceUpdate) {
    if (!applying) {
      applying = true
      btn.innerHTML =
        '<div style="width:' +
        (MxClient.IS_QUIRKS ? '30' : '36') +
        'px;height:12px;margin:3px;border:1px solid black;background-color:' +
        (color !== null && color !== MxConstants.NONE ? color : defaultColor) +
        ';"></div>'

      // Fine-tuning in Firefox, quirks mode and IE8 standards
      if (MxClient.IS_QUIRKS || document.documentMode === 8) {
        btn.firstChild.style.margin = '0px'
      }

      if (color !== null && color !== MxConstants.NONE) {
        cb.setAttribute('checked', 'checked')
        cb.defaultChecked = true
        cb.checked = true
      } else {
        cb.removeAttribute('checked')
        cb.defaultChecked = false
        cb.checked = false
      }

      btn.style.display = cb.checked || hideCheckbox ? '' : 'none'

      if (callbackFn !== null) {
        callbackFn(color)
      }

      if (!disableUpdate) {
        value = color

        // Checks if the color value needs to be updated in the model
        if (forceUpdate || hideCheckbox || getColorFn() !== value) {
          setColorFn(value)
        }
      }

      applying = false
    }
  }

  btn = MxUtils.button(
    '',
    MxUtils.bind(this, function(evt) {
      this.editorUi.pickColor(value, function(color) {
        apply(color, null, true)
      })
      MxEvent.consume(evt)
    })
  )

  btn.style.position = 'absolute'
  btn.style.marginTop = '-4px'
  btn.style.right = MxClient.IS_QUIRKS ? '0px' : '20px'
  btn.style.height = '22px'
  btn.className = 'geColorBtn'
  btn.style.display = cb.checked || hideCheckbox ? '' : 'none'
  div.appendChild(btn)

  MxEvent.addListener(div, 'click', function(evt) {
    let source = MxEvent.getSource(evt)

    if (source === cb || source.nodeName !== 'INPUT') {
      // Toggles checkbox state for click on label
      if (source !== cb) {
        cb.checked = !cb.checked
      }

      // Overrides default value with current value to make it easier
      // to restore previous value if the checkbox is clicked twice
      if (
        !cb.checked &&
        value !== null &&
        value !== MxConstants.NONE &&
        defaultColor !== MxConstants.NONE
      ) {
        defaultColor = value
      }

      apply(cb.checked ? defaultColor : MxConstants.NONE)
    }
  })

  apply(value, true)

  if (listener !== null) {
    listener.install(apply)
    this.listeners.push(listener)
  }

  return div
}

/**
 *
 */
BaseFormatPanel.prototype.createCellColorOption = function(
  label,
  colorKey,
  defaultColor,
  callbackFn,
  setStyleFn
) {
  let ui = this.editorUi
  let editor = ui.editor
  let graph = editor.graph

  return this.createColorOption(
    label,
    function() {
      // Seems to be null sometimes, not sure why...
      let state = graph.view.getState(graph.getSelectionCell())

      if (state !== null) {
        return MxUtils.getValue(state.style, colorKey, null)
      }

      return null
    },
    function(color) {
      graph.getModel().beginUpdate()
      try {
        if (setStyleFn !== null) {
          setStyleFn(color)
        }

        graph.setCellStyles(colorKey, color, graph.getSelectionCells())
        ui.fireEvent(
          new MxEventObject(
            'styleChanged',
            'keys',
            [colorKey],
            'values',
            [color],
            'cells',
            graph.getSelectionCells()
          )
        )
      } finally {
        graph.getModel().endUpdate()
      }
    },
    defaultColor || MxConstants.NONE,
    {
      install: function(apply) {
        this.listener = function() {
          // Seems to be null sometimes, not sure why...
          let state = graph.view.getState(graph.getSelectionCell())

          if (state !== null) {
            apply(MxUtils.getValue(state.style, colorKey, null))
          }
        }

        graph.getModel().addListener(MxEvent.CHANGE, this.listener)
      },
      destroy: function() {
        graph.getModel().removeListener(this.listener)
      }
    },
    callbackFn
  )
}

/**
 *
 */
BaseFormatPanel.prototype.addArrow = function(elt, height) {
  height = height !== null ? height : 10

  let arrow = document.createElement('div')
  arrow.style.display = MxClient.IS_QUIRKS ? 'inline' : 'inline-block'
  arrow.style.padding = '6px'
  arrow.style.paddingRight = '4px'

  let m = 10 - height

  if (m === 2) {
    arrow.style.paddingTop = 6 + 'px'
  } else if (m > 0) {
    arrow.style.paddingTop = 6 - m + 'px'
  } else {
    arrow.style.marginTop = '-2px'
  }

  arrow.style.height = height + 'px'
  arrow.style.borderLeft = '1px solid #a0a0a0'
  arrow.innerHTML =
    '<img border="0" src="' +
    (MxClient.IS_SVG
      ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHBJREFUeNpidHB2ZyAGsACxDRBPIKCuA6TwCBB/h2rABu4A8SYmKCcXiP/iUFgAxL9gCi8A8SwsirZCMQMTkmANEH9E4v+CmsaArvAdyNFI/FlQ92EoBIE+qCRIUz168DBgsU4OqhinQpgHMABAgAEALY4XLIsJ20oAAAAASUVORK5CYII='
      : IMAGE_PATH + '/dropdown.png') +
    '" style="margin-bottom:4px;">'
  MxUtils.setOpacity(arrow, 70)

  let symbol = elt.getElementsByTagName('div')[0]

  if (symbol !== null) {
    symbol.style.paddingRight = '6px'
    symbol.style.marginLeft = '4px'
    symbol.style.marginTop = '-1px'
    symbol.style.display = MxClient.IS_QUIRKS ? 'inline' : 'inline-block'
    MxUtils.setOpacity(symbol, 60)
  }

  MxUtils.setOpacity(elt, 100)
  elt.style.border = '1px solid #a0a0a0'
  elt.style.backgroundColor = this.buttonBackgroundColor
  elt.style.backgroundImage = 'none'
  elt.style.width = 'auto'
  elt.className += ' geColorBtn'
  MxUtils.setPrefixedStyle(elt.style, 'borderRadius', '3px')

  elt.appendChild(arrow)

  return symbol
}

/**
 *
 */
BaseFormatPanel.prototype.addUnitInput = function(
  container,
  unit,
  right,
  width,
  update,
  step,
  marginTop,
  disableFocus
) {
  marginTop = marginTop !== null ? marginTop : 0

  let input = document.createElement('input')
  input.style.position = 'absolute'
  input.style.textAlign = 'right'
  input.style.marginTop = '-2px'
  input.style.right = right + 12 + 'px'
  input.style.width = width + 'px'
  container.appendChild(input)

  let stepper = this.createStepper(input, update, step, null, disableFocus)
  stepper.style.marginTop = marginTop - 2 + 'px'
  stepper.style.right = right + 'px'
  container.appendChild(stepper)

  return input
}

/**
 *
 */
BaseFormatPanel.prototype.createRelativeOption = function(
  label,
  key,
  width,
  handler,
  init
) {
  width = width !== null ? width : 44

  let graph = this.editorUi.editor.graph
  let div = this.createPanel()
  div.style.paddingTop = '10px'
  div.style.paddingBottom = '10px'
  MxUtils.write(div, label)
  div.style.fontWeight = 'bold'

  function update(evt) {
    if (handler !== null) {
      handler(input)
    } else {
      let value = parseInt(input.value)
      value = Math.min(100, Math.max(0, isNaN(value) ? 100 : value))
      let state = graph.view.getState(graph.getSelectionCell())

      if (state !== null && value !== MxUtils.getValue(state.style, key, 100)) {
        // Removes entry in style (assumes 100 is default for relative values)
        if (value === 100) {
          value = null
        }

        graph.setCellStyles(key, value, graph.getSelectionCells())
      }

      input.value = (value !== null ? value : '100') + ' %'
    }

    MxEvent.consume(evt)
  }

  let input = this.addUnitInput(
    div,
    '%',
    20,
    width,
    update,
    10,
    -15,
    handler !== null
  )

  if (key !== null) {
    let listener = MxUtils.bind(this, function(sender, evt, force) {
      if (force || input !== document.activeElement) {
        let ss = this.format.getSelectionState()
        let tmp = parseInt(MxUtils.getValue(ss.style, key, 100))
        input.value = isNaN(tmp) ? '' : tmp + ' %'
      }
    })

    MxEvent.addListener(input, 'keydown', function(e) {
      if (e.keyCode === 13) {
        graph.container.focus()
        MxEvent.consume(e)
      } else if (e.keyCode === 27) {
        listener(null, null, true)
        graph.container.focus()
        MxEvent.consume(e)
      }
    })

    graph.getModel().addListener(MxEvent.CHANGE, listener)
    this.listeners.push({
      destroy: function() {
        graph.getModel().removeListener(listener)
      }
    })
    listener()
  }

  MxEvent.addListener(input, 'blur', update)
  MxEvent.addListener(input, 'change', update)

  if (init !== null) {
    init(input)
  }

  return div
}

/**
 *
 */
BaseFormatPanel.prototype.addLabel = function(div, title, right, width) {
  width = width !== null ? width : 61

  let label = document.createElement('div')
  MxUtils.write(label, title)
  label.style.position = 'absolute'
  label.style.right = right + 'px'
  label.style.width = width + 'px'
  label.style.marginTop = '6px'
  label.style.textAlign = 'center'
  div.appendChild(label)
}

/**
 *
 */
BaseFormatPanel.prototype.addKeyHandler = function(input, listener) {
  MxEvent.addListener(
    input,
    'keydown',
    MxUtils.bind(this, function(e) {
      if (e.keyCode === 13) {
        this.editorUi.editor.graph.container.focus()
        MxEvent.consume(e)
      } else if (e.keyCode === 27) {
        if (listener !== null) {
          listener(null, null, true)
        }

        this.editorUi.editor.graph.container.focus()
        MxEvent.consume(e)
      }
    })
  )
}

/**
 *
 */
BaseFormatPanel.prototype.styleButtons = function(elts) {
  for (let i = 0; i < elts.length; i++) {
    MxUtils.setPrefixedStyle(elts[i].style, 'borderRadius', '3px')
    MxUtils.setOpacity(elts[i], 100)
    elts[i].style.border = '1px solid #a0a0a0'
    elts[i].style.padding = '4px'
    elts[i].style.paddingTop = '3px'
    elts[i].style.paddingRight = '1px'
    elts[i].style.margin = '1px'
    elts[i].style.width = '24px'
    elts[i].style.height = '20px'
    elts[i].className += ' geColorBtn'
  }
}

/**
 * Adds the label menu items to the given menu and parent.
 */
BaseFormatPanel.prototype.destroy = function() {
  if (this.listeners !== null) {
    for (let i = 0; i < this.listeners.length; i++) {
      this.listeners[i].destroy()
    }

    this.listeners = null
  }
}

/**
 * Adds the label menu items to the given menu and parent.
 */
export class ArrangePanel {
  constructor(format, editorUi, container) {
    BaseFormatPanel.call(this, format, editorUi, container)
    this.init()
  }
}

MxUtils.extend(ArrangePanel, BaseFormatPanel)

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel.prototype.init = function() {
  let graph = this.editorUi.editor.graph // eslint-disable-line no-unused-vars
  let ss = this.format.getSelectionState()

  this.container.appendChild(this.addLayerOps(this.createPanel()))
  // Special case that adds two panels
  this.addGeometry(this.container)
  this.addEdgeGeometry(this.container)

  if (!ss.containsLabel || ss.edges.length === 0) {
    this.container.appendChild(this.addAngle(this.createPanel()))
  }

  if (!ss.containsLabel && ss.edges.length === 0) {
    this.container.appendChild(this.addFlip(this.createPanel()))
  }

  if (ss.vertices.length > 1) {
    this.container.appendChild(this.addAlign(this.createPanel()))
    this.container.appendChild(this.addDistribute(this.createPanel()))
  }

  this.container.appendChild(this.addGroupOps(this.createPanel()))
}

/**
 *
 */
ArrangePanel.prototype.addLayerOps = function(div) {
  let ui = this.editorUi

  let btn = MxUtils.button(MxResources.get('toFront'), function(evt) {
    ui.actions.get('toFront').funct()
  })

  btn.setAttribute(
    'title',
    MxResources.get('toFront') +
      ' (' +
      this.editorUi.actions.get('toFront').shortcut +
      ')'
  )
  btn.style.width = '100px'
  btn.style.marginRight = '2px'
  div.appendChild(btn)

  btn = MxUtils.button(MxResources.get('toBack'), function(evt) {
    ui.actions.get('toBack').funct()
  })

  btn.setAttribute(
    'title',
    MxResources.get('toBack') +
      ' (' +
      this.editorUi.actions.get('toBack').shortcut +
      ')'
  )
  btn.style.width = '100px'
  div.appendChild(btn)

  return div
}

/**
 *
 */
ArrangePanel.prototype.addGroupOps = function(div) {
  let ui = this.editorUi
  let graph = ui.editor.graph
  let cell = graph.getSelectionCell()
  let ss = this.format.getSelectionState() // eslint-disable-line no-unused-vars
  let count = 0
  let btn = null

  div.style.paddingTop = '8px'
  div.style.paddingBottom = '6px'

  if (graph.getSelectionCount() > 1) {
    btn = MxUtils.button(MxResources.get('group'), function(evt) {
      ui.actions.get('group').funct()
    })

    btn.setAttribute(
      'title',
      MxResources.get('group') +
        ' (' +
        this.editorUi.actions.get('group').shortcut +
        ')'
    )
    btn.style.width = '202px'
    btn.style.marginBottom = '2px'
    div.appendChild(btn)
    count++
  } else if (
    graph.getSelectionCount() === 1 &&
    !graph.getModel().isEdge(cell) &&
    !graph.isSwimlane(cell) &&
    graph.getModel().getChildCount(cell) > 0
  ) {
    btn = MxUtils.button(MxResources.get('ungroup'), function(evt) {
      ui.actions.get('ungroup').funct()
    })

    btn.setAttribute(
      'title',
      MxResources.get('ungroup') +
        ' (' +
        this.editorUi.actions.get('ungroup').shortcut +
        ')'
    )
    btn.style.width = '202px'
    btn.style.marginBottom = '2px'
    div.appendChild(btn)
    count++
  }

  if (
    graph.getSelectionCount() === 1 &&
    graph.getModel().isVertex(cell) &&
    graph.getModel().isVertex(graph.getModel().getParent(cell))
  ) {
    if (count > 0) {
      MxUtils.br(div)
    }

    btn = MxUtils.button(MxResources.get('removeFromGroup'), function(evt) {
      ui.actions.get('removeFromGroup').funct()
    })

    btn.setAttribute('title', MxResources.get('removeFromGroup'))
    btn.style.width = '202px'
    btn.style.marginBottom = '2px'
    div.appendChild(btn)
    count++
  } else if (graph.getSelectionCount() > 0) {
    if (count > 0) {
      MxUtils.br(div)
    }

    btn = MxUtils.button(
      MxResources.get('clearWaypoints'),
      MxUtils.bind(this, function(evt) {
        this.editorUi.actions.get('clearWaypoints').funct()
      })
    )

    btn.setAttribute(
      'title',
      MxResources.get('clearWaypoints') +
        ' (' +
        this.editorUi.actions.get('clearWaypoints').shortcut +
        ')'
    )
    btn.style.width = '202px'
    btn.style.marginBottom = '2px'
    div.appendChild(btn)

    count++
  }

  if (graph.getSelectionCount() === 1) {
    if (count > 0) {
      MxUtils.br(div)
    }

    btn = MxUtils.button(
      MxResources.get('editData'),
      MxUtils.bind(this, function(evt) {
        this.editorUi.actions.get('editData').funct()
      })
    )

    btn.setAttribute(
      'title',
      MxResources.get('editData') +
        ' (' +
        this.editorUi.actions.get('editData').shortcut +
        ')'
    )
    btn.style.width = '100px'
    btn.style.marginBottom = '2px'
    div.appendChild(btn)
    count++

    btn = MxUtils.button(
      MxResources.get('editLink'),
      MxUtils.bind(this, function(evt) {
        this.editorUi.actions.get('editLink').funct()
      })
    )

    btn.setAttribute('title', MxResources.get('editLink'))
    btn.style.width = '100px'
    btn.style.marginLeft = '2px'
    btn.style.marginBottom = '2px'
    div.appendChild(btn)
    count++
  }

  if (count === 0) {
    div.style.display = 'none'
  }

  return div
}

/**
 *
 */
ArrangePanel.prototype.addAlign = function(div) {
  let graph = this.editorUi.editor.graph
  div.style.paddingTop = '6px'
  div.style.paddingBottom = '12px'
  div.appendChild(this.createTitle(MxResources.get('align')))

  let stylePanel = document.createElement('div')
  stylePanel.style.position = 'relative'
  stylePanel.style.paddingLeft = '0px'
  stylePanel.style.borderWidth = '0px'
  stylePanel.className = 'geToolbarContainer'

  if (MxClient.IS_QUIRKS) {
    div.style.height = '60px'
  }

  let left = this.editorUi.toolbar.addButton(
    'geSprite-alignleft',
    MxResources.get('left'),
    function() {
      graph.alignCells(MxConstants.ALIGN_LEFT)
    },
    stylePanel
  )
  let center = this.editorUi.toolbar.addButton(
    'geSprite-aligncenter',
    MxResources.get('center'),
    function() {
      graph.alignCells(MxConstants.ALIGN_CENTER)
    },
    stylePanel
  )
  let right = this.editorUi.toolbar.addButton(
    'geSprite-alignright',
    MxResources.get('right'),
    function() {
      graph.alignCells(MxConstants.ALIGN_RIGHT)
    },
    stylePanel
  )

  let top = this.editorUi.toolbar.addButton(
    'geSprite-aligntop',
    MxResources.get('top'),
    function() {
      graph.alignCells(MxConstants.ALIGN_TOP)
    },
    stylePanel
  )
  let middle = this.editorUi.toolbar.addButton(
    'geSprite-alignmiddle',
    MxResources.get('middle'),
    function() {
      graph.alignCells(MxConstants.ALIGN_MIDDLE)
    },
    stylePanel
  )
  let bottom = this.editorUi.toolbar.addButton(
    'geSprite-alignbottom',
    MxResources.get('bottom'),
    function() {
      graph.alignCells(MxConstants.ALIGN_BOTTOM)
    },
    stylePanel
  )

  this.styleButtons([left, center, right, top, middle, bottom])
  right.style.marginRight = '6px'
  div.appendChild(stylePanel)

  return div
}

/**
 *
 */
ArrangePanel.prototype.addFlip = function(div) {
  let ui = this.editorUi
  let editor = ui.editor
  let graph = editor.graph
  div.style.paddingTop = '6px'
  div.style.paddingBottom = '10px'

  let span = document.createElement('div')
  span.style.marginTop = '2px'
  span.style.marginBottom = '8px'
  span.style.fontWeight = 'bold'
  MxUtils.write(span, MxResources.get('flip'))
  div.appendChild(span)

  let btn = MxUtils.button(MxResources.get('horizontal'), function(evt) {
    graph.toggleCellStyles(MxConstants.STYLE_FLIPH, false)
  })

  btn.setAttribute('title', MxResources.get('horizontal'))
  btn.style.width = '100px'
  btn.style.marginRight = '2px'
  div.appendChild(btn)

  btn = MxUtils.button(MxResources.get('vertical'), function(evt) {
    graph.toggleCellStyles(MxConstants.STYLE_FLIPV, false)
  })

  btn.setAttribute('title', MxResources.get('vertical'))
  btn.style.width = '100px'
  div.appendChild(btn)

  return div
}

/**
 *
 */
ArrangePanel.prototype.addDistribute = function(div) {
  let ui = this.editorUi
  let editor = ui.editor
  let graph = editor.graph
  div.style.paddingTop = '6px'
  div.style.paddingBottom = '12px'

  div.appendChild(this.createTitle(MxResources.get('distribute')))

  let btn = MxUtils.button(MxResources.get('horizontal'), function(evt) {
    graph.distributeCells(true)
  })

  btn.setAttribute('title', MxResources.get('horizontal'))
  btn.style.width = '100px'
  btn.style.marginRight = '2px'
  div.appendChild(btn)

  btn = MxUtils.button(MxResources.get('vertical'), function(evt) {
    graph.distributeCells(false)
  })

  btn.setAttribute('title', MxResources.get('vertical'))
  btn.style.width = '100px'
  div.appendChild(btn)

  return div
}

/**
 *
 */
ArrangePanel.prototype.addAngle = function(div) {
  let ui = this.editorUi
  let editor = ui.editor
  let graph = editor.graph
  let ss = this.format.getSelectionState()

  div.style.paddingBottom = '8px'

  let span = document.createElement('div')
  span.style.position = 'absolute'
  span.style.width = '70px'
  span.style.marginTop = '0px'
  span.style.fontWeight = 'bold'

  let input = null
  let update = null
  let btn = null

  if (ss.edges.length === 0) {
    MxUtils.write(span, MxResources.get('angle'))
    div.appendChild(span)

    input = this.addUnitInput(div, '°', 20, 44, function() {
      update.apply(this, arguments)
    })

    MxUtils.br(div)
    div.style.paddingTop = '10px'
  } else {
    div.style.paddingTop = '8px'
  }

  if (!ss.containsLabel) {
    let label = MxResources.get('reverse')

    if (ss.vertices.length > 0 && ss.edges.length > 0) {
      label = MxResources.get('turn') + ' / ' + label
    } else if (ss.vertices.length > 0) {
      label = MxResources.get('turn')
    }

    btn = MxUtils.button(label, function(evt) {
      ui.actions.get('turn').funct()
    })

    btn.setAttribute(
      'title',
      label + ' (' + this.editorUi.actions.get('turn').shortcut + ')'
    )
    btn.style.width = '202px'
    div.appendChild(btn)

    if (input !== null) {
      btn.style.marginTop = '8px'
    }
  }

  if (input !== null) {
    var listener = MxUtils.bind(this, function(sender, evt, force) {
      if (force || document.activeElement !== input) {
        ss = this.format.getSelectionState()
        let tmp = parseFloat(
          MxUtils.getValue(ss.style, MxConstants.STYLE_ROTATION, 0)
        )
        input.value = isNaN(tmp) ? '' : tmp + '°'
      }
    })

    update = this.installInputHandler(
      input,
      MxConstants.STYLE_ROTATION,
      0,
      0,
      360,
      '°',
      null,
      true
    )
    this.addKeyHandler(input, listener)

    graph.getModel().addListener(MxEvent.CHANGE, listener)
    this.listeners.push({
      destroy: function() {
        graph.getModel().removeListener(listener)
      }
    })
    listener()
  }

  return div
}

/**
 *
 */
ArrangePanel.prototype.addGeometry = function(container) {
  let ui = this.editorUi
  let graph = ui.editor.graph
  let rect = this.format.getSelectionState()

  let div = this.createPanel()
  div.style.paddingBottom = '8px'

  let span = document.createElement('div')
  span.style.position = 'absolute'
  span.style.width = '50px'
  span.style.marginTop = '0px'
  span.style.fontWeight = 'bold'
  MxUtils.write(span, MxResources.get('size'))
  div.appendChild(span)

  let widthUpdate, heightUpdate, leftUpdate, topUpdate
  let width = this.addUnitInput(div, 'pt', 84, 44, function() {
    widthUpdate.apply(this, arguments)
  })
  let height = this.addUnitInput(div, 'pt', 20, 44, function() {
    heightUpdate.apply(this, arguments)
  })

  let autosizeBtn = document.createElement('div')
  autosizeBtn.className = 'geSprite geSprite-fit'
  autosizeBtn.setAttribute(
    'title',
    MxResources.get('autosize') +
      ' (' +
      this.editorUi.actions.get('autosize').shortcut +
      ')'
  )
  autosizeBtn.style.position = 'relative'
  autosizeBtn.style.cursor = 'pointer'
  autosizeBtn.style.marginTop = '-3px'
  autosizeBtn.style.border = '0px'
  autosizeBtn.style.left = '52px'
  MxUtils.setOpacity(autosizeBtn, 50)

  MxEvent.addListener(autosizeBtn, 'mouseenter', function() {
    MxUtils.setOpacity(autosizeBtn, 100)
  })

  MxEvent.addListener(autosizeBtn, 'mouseleave', function() {
    MxUtils.setOpacity(autosizeBtn, 50)
  })

  MxEvent.addListener(autosizeBtn, 'click', function() {
    ui.actions.get('autosize').funct()
  })

  div.appendChild(autosizeBtn)
  this.addLabel(div, MxResources.get('width'), 84)
  this.addLabel(div, MxResources.get('height'), 20)
  MxUtils.br(div)

  let wrapper = document.createElement('div')
  wrapper.style.paddingTop = '8px'
  wrapper.style.paddingRight = '20px'
  wrapper.style.whiteSpace = 'nowrap'
  wrapper.style.textAlign = 'right'
  let opt = this.createCellOption(
    MxResources.get('constrainProportions'),
    MxConstants.STYLE_ASPECT,
    null,
    'fixed',
    'null'
  )
  opt.style.width = '100%'
  wrapper.appendChild(opt)
  div.appendChild(wrapper)

  let listener
  let constrainCheckbox = opt.getElementsByTagName('input')[0]
  this.addKeyHandler(width, listener)
  this.addKeyHandler(height, listener)

  widthUpdate = this.addGeometryHandler(width, function(geo, value) {
    if (geo.width > 0) {
      let value
      value = Math.max(1, value)

      if (constrainCheckbox.checked) {
        geo.height = Math.round((geo.height * value * 100) / geo.width) / 100
      }

      geo.width = value
    }
  })
  heightUpdate = this.addGeometryHandler(height, function(geo, value) {
    if (geo.height > 0) {
      let value
      value = Math.max(1, value)

      if (constrainCheckbox.checked) {
        geo.width = Math.round((geo.width * value * 100) / geo.height) / 100
      }

      geo.height = value
    }
  })

  container.appendChild(div)

  let div2 = this.createPanel()
  div2.style.paddingBottom = '30px'

  span = document.createElement('div')
  span.style.position = 'absolute'
  span.style.width = '70px'
  span.style.marginTop = '0px'
  span.style.fontWeight = 'bold'
  MxUtils.write(span, MxResources.get('position'))
  div2.appendChild(span)

  let left = this.addUnitInput(div2, 'pt', 84, 44, function() {
    leftUpdate.apply(this, arguments)
  })
  let top = this.addUnitInput(div2, 'pt', 20, 44, function() {
    topUpdate.apply(this, arguments)
  })

  MxUtils.br(div2)
  this.addLabel(div2, MxResources.get('left'), 84)
  this.addLabel(div2, MxResources.get('top'), 20)

  listener = MxUtils.bind(this, function(sender, evt, force) {
    rect = this.format.getSelectionState()

    if (
      !rect.containsLabel &&
      rect.vertices.length === graph.getSelectionCount() &&
      rect.width !== null &&
      rect.height !== null
    ) {
      div.style.display = ''

      if (force || document.activeElement !== width) {
        width.value = rect.width + (rect.width === '' ? '' : ' pt')
      }

      if (force || document.activeElement !== height) {
        height.value = rect.height + (rect.height === '' ? '' : ' pt')
      }
    } else {
      div.style.display = 'none'
    }

    if (
      rect.vertices.length === graph.getSelectionCount() &&
      rect.x !== null &&
      rect.y !== null
    ) {
      div2.style.display = ''

      if (force || document.activeElement !== left) {
        left.value = rect.x + (rect.x === '' ? '' : ' pt')
      }

      if (force || document.activeElement !== top) {
        top.value = rect.y + (rect.y === '' ? '' : ' pt')
      }
    } else {
      div2.style.display = 'none'
    }
  })

  this.addKeyHandler(left, listener)
  this.addKeyHandler(top, listener)

  graph.getModel().addListener(MxEvent.CHANGE, listener)
  this.listeners.push({
    destroy: function() {
      graph.getModel().removeListener(listener)
    }
  })
  listener()

  leftUpdate = this.addGeometryHandler(left, function(geo, value) {
    if (geo.relative) {
      geo.offset.x = value
    } else {
      geo.x = value
    }
  })
  topUpdate = this.addGeometryHandler(top, function(geo, value) {
    if (geo.relative) {
      geo.offset.y = value
    } else {
      geo.y = value
    }
  })

  container.appendChild(div2)
}

/**
 *
 */
ArrangePanel.prototype.addGeometryHandler = function(input, fn) {
  let ui = this.editorUi
  let graph = ui.editor.graph
  let initialValue = null

  function update(evt) {
    if (input.value !== '') {
      let value = parseFloat(input.value)

      if (value !== initialValue) {
        graph.getModel().beginUpdate()
        try {
          let cells = graph.getSelectionCells()

          for (let i = 0; i < cells.length; i++) {
            if (graph.getModel().isVertex(cells[i])) {
              let geo = graph.getCellGeometry(cells[i])

              if (geo !== null) {
                geo = geo.clone()
                fn(geo, value)

                graph.getModel().setGeometry(cells[i], geo)
              }
            }
          }
        } finally {
          graph.getModel().endUpdate()
        }

        initialValue = value
        input.value = value + ' pt'
      } else if (isNaN(value)) {
        input.value = initialValue + ' pt'
      }
    }

    MxEvent.consume(evt)
  }

  MxEvent.addListener(input, 'blur', update)
  MxEvent.addListener(input, 'change', update)
  MxEvent.addListener(input, 'focus', function() {
    initialValue = input.value
  })

  return update
}

ArrangePanel.prototype.addEdgeGeometryHandler = function(input, fn) {
  let ui = this.editorUi
  let graph = ui.editor.graph
  let initialValue = null

  function update(evt) {
    if (input.value !== '') {
      let value = parseFloat(input.value)

      if (isNaN(value)) {
        input.value = initialValue + ' pt'
      } else if (value !== initialValue) {
        graph.getModel().beginUpdate()
        try {
          let cells = graph.getSelectionCells()

          for (let i = 0; i < cells.length; i++) {
            if (graph.getModel().isEdge(cells[i])) {
              let geo = graph.getCellGeometry(cells[i])

              if (geo !== null) {
                geo = geo.clone()
                fn(geo, value)

                graph.getModel().setGeometry(cells[i], geo)
              }
            }
          }
        } finally {
          graph.getModel().endUpdate()
        }

        initialValue = value
        input.value = value + ' pt'
      }
    }

    MxEvent.consume(evt)
  }

  MxEvent.addListener(input, 'blur', update)
  MxEvent.addListener(input, 'change', update)
  MxEvent.addListener(input, 'focus', function() {
    initialValue = input.value
  })

  return update
}

/**
 *
 */
ArrangePanel.prototype.addEdgeGeometry = function(container) {
  let ui = this.editorUi
  let graph = ui.editor.graph
  let rect = this.format.getSelectionState()

  let div = this.createPanel()

  let span = document.createElement('div')
  span.style.position = 'absolute'
  span.style.width = '70px'
  span.style.marginTop = '0px'
  span.style.fontWeight = 'bold'
  MxUtils.write(span, MxResources.get('width'))
  div.appendChild(span)

  let widthUpdate, xtUpdate, ytUpdate, xsUpdate, ysUpdate, listener
  let width = this.addUnitInput(div, 'pt', 20, 44, function() {
    widthUpdate.apply(this, arguments)
  })

  MxUtils.br(div)
  this.addKeyHandler(width, listener)

  widthUpdate = function(evt) {
    // Maximum stroke width is 999
    let value = parseInt(width.value)
    value = Math.min(999, Math.max(1, isNaN(value) ? 1 : value))

    if (
      value !==
      MxUtils.getValue(
        rect.style,
        'width',
        mxCellRenderer.defaultShapes['flexArrow'].prototype.defaultWidth
      )
    ) {
      graph.setCellStyles('width', value, graph.getSelectionCells())
      ui.fireEvent(
        new MxEventObject(
          'styleChanged',
          'keys',
          ['width'],
          'values',
          [value],
          'cells',
          graph.getSelectionCells()
        )
      )
    }

    width.value = value + ' pt'
    MxEvent.consume(evt)
  }

  MxEvent.addListener(width, 'blur', widthUpdate)
  MxEvent.addListener(width, 'change', widthUpdate)

  container.appendChild(div)

  let divs = this.createPanel()
  divs.style.paddingBottom = '30px'

  span = document.createElement('div')
  span.style.position = 'absolute'
  span.style.width = '70px'
  span.style.marginTop = '0px'
  span.style.fontWeight = 'bold'
  MxUtils.write(span, 'Start')
  divs.appendChild(span)

  let xs = this.addUnitInput(divs, 'pt', 84, 44, function() {
    xsUpdate.apply(this, arguments)
  })
  let ys = this.addUnitInput(divs, 'pt', 20, 44, function() {
    ysUpdate.apply(this, arguments)
  })

  MxUtils.br(divs)
  this.addLabel(divs, MxResources.get('left'), 84)
  this.addLabel(divs, MxResources.get('top'), 20)
  container.appendChild(divs)
  this.addKeyHandler(xs, listener)
  this.addKeyHandler(ys, listener)

  let divt = this.createPanel()
  divt.style.paddingBottom = '30px'

  span = document.createElement('div')
  span.style.position = 'absolute'
  span.style.width = '70px'
  span.style.marginTop = '0px'
  span.style.fontWeight = 'bold'
  MxUtils.write(span, 'End')
  divt.appendChild(span)

  let xt = this.addUnitInput(divt, 'pt', 84, 44, function() {
    xtUpdate.apply(this, arguments)
  })
  let yt = this.addUnitInput(divt, 'pt', 20, 44, function() {
    ytUpdate.apply(this, arguments)
  })

  MxUtils.br(divt)
  this.addLabel(divt, MxResources.get('left'), 84)
  this.addLabel(divt, MxResources.get('top'), 20)
  container.appendChild(divt)
  this.addKeyHandler(xt, listener)
  this.addKeyHandler(yt, listener)

  listener = MxUtils.bind(this, function(sender, evt, force) {
    rect = this.format.getSelectionState()
    let cell = graph.getSelectionCell()

    if (rect.style.shape === 'link' || rect.style.shape === 'flexArrow') {
      div.style.display = ''

      if (force || document.activeElement !== width) {
        let value = MxUtils.getValue(
          rect.style,
          'width',
          mxCellRenderer.defaultShapes['flexArrow'].prototype.defaultWidth
        )
        width.value = value + ' pt'
      }
    } else {
      div.style.display = 'none'
    }

    if (graph.getSelectionCount() === 1 && graph.model.isEdge(cell)) {
      let geo = graph.model.getGeometry(cell)

      if (
        geo.sourcePoint !== null &&
        graph.model.getTerminal(cell, true) === null
      ) {
        xs.value = geo.sourcePoint.x
        ys.value = geo.sourcePoint.y
      } else {
        divs.style.display = 'none'
      }

      if (
        geo.targetPoint !== null &&
        graph.model.getTerminal(cell, false) === null
      ) {
        xt.value = geo.targetPoint.x
        yt.value = geo.targetPoint.y
      } else {
        divt.style.display = 'none'
      }
    } else {
      divs.style.display = 'none'
      divt.style.display = 'none'
    }
  })

  xsUpdate = this.addEdgeGeometryHandler(xs, function(geo, value) {
    geo.sourcePoint.x = value
  })

  ysUpdate = this.addEdgeGeometryHandler(ys, function(geo, value) {
    geo.sourcePoint.y = value
  })

  xtUpdate = this.addEdgeGeometryHandler(xt, function(geo, value) {
    geo.targetPoint.x = value
  })

  ytUpdate = this.addEdgeGeometryHandler(yt, function(geo, value) {
    geo.targetPoint.y = value
  })

  graph.getModel().addListener(MxEvent.CHANGE, listener)
  this.listeners.push({
    destroy: function() {
      graph.getModel().removeListener(listener)
    }
  })
  listener()
}

/**
 * Adds the label menu items to the given menu and parent.
 */
export class TextFormatPanel {
  constructor(format, editorUi, container) {
    BaseFormatPanel.call(this, format, editorUi, container)
    this.init()
  }
}

MxUtils.extend(TextFormatPanel, BaseFormatPanel)

/**
 * Adds the label menu items to the given menu and parent.
 */
TextFormatPanel.prototype.init = function() {
  this.container.style.borderBottom = 'none'
  this.addFont(this.container)
}

/**
 * Adds the label menu items to the given menu and parent.
 */
TextFormatPanel.prototype.addFont = function(container) {
  let ui = this.editorUi
  let editor = ui.editor
  let graph = editor.graph
  let ss = this.format.getSelectionState()

  let title = this.createTitle(MxResources.get('font'))
  title.style.paddingLeft = '18px'
  title.style.paddingTop = '10px'
  title.style.paddingBottom = '6px'
  container.appendChild(title)

  let stylePanel = this.createPanel()
  stylePanel.style.paddingTop = '2px'
  stylePanel.style.paddingBottom = '2px'
  stylePanel.style.position = 'relative'
  stylePanel.style.marginLeft = '-2px'
  stylePanel.style.borderWidth = '0px'
  stylePanel.className = 'geToolbarContainer'

  if (MxClient.IS_QUIRKS) {
    stylePanel.style.display = 'block'
  }

  if (graph.cellEditor.isContentEditing()) {
    let cssPanel = stylePanel.cloneNode()

    let cssMenu = this.editorUi.toolbar.addMenu(
      MxResources.get('style'),
      MxResources.get('style'),
      true,
      'formatBlock',
      cssPanel
    )
    cssMenu.style.color = 'rgb(112, 112, 112)'
    cssMenu.style.whiteSpace = 'nowrap'
    cssMenu.style.overflow = 'hidden'
    cssMenu.style.margin = '0px'
    this.addArrow(cssMenu)
    cssMenu.style.width = '192px'
    cssMenu.style.height = '15px'

    let arrow = cssMenu.getElementsByTagName('div')[0]
    arrow.style.cssFloat = 'right'
    container.appendChild(cssPanel)

    // Workaround for offset in FF
    if (MxClient.IS_FF) {
      cssMenu.getElementsByTagName('div')[0].style.marginTop = '-18px'
    }
  }

  container.appendChild(stylePanel)

  let colorPanel = this.createPanel()
  colorPanel.style.marginTop = '8px'
  colorPanel.style.borderTop = '1px solid #c0c0c0'
  colorPanel.style.paddingTop = '6px'
  colorPanel.style.paddingBottom = '6px'

  let fontMenu = this.editorUi.toolbar.addMenu(
    'Helvetica',
    MxResources.get('fontFamily'),
    true,
    'fontFamily',
    stylePanel
  )
  fontMenu.style.color = 'rgb(112, 112, 112)'
  fontMenu.style.whiteSpace = 'nowrap'
  fontMenu.style.overflow = 'hidden'
  fontMenu.style.margin = '0px'

  this.addArrow(fontMenu)
  fontMenu.style.width = '192px'
  fontMenu.style.height = '15px'

  // Workaround for offset in FF
  if (MxClient.IS_FF) {
    fontMenu.getElementsByTagName('div')[0].style.marginTop = '-18px'
  }

  let stylePanel2 = stylePanel.cloneNode(false)
  stylePanel2.style.marginLeft = '-3px'
  let fontStyleItems = this.editorUi.toolbar.addItems(
    ['bold', 'italic', 'underline'],
    stylePanel2,
    true
  )
  fontStyleItems[0].setAttribute(
    'title',
    MxResources.get('bold') +
      ' (' +
      this.editorUi.actions.get('bold').shortcut +
      ')'
  )
  fontStyleItems[1].setAttribute(
    'title',
    MxResources.get('italic') +
      ' (' +
      this.editorUi.actions.get('italic').shortcut +
      ')'
  )
  fontStyleItems[2].setAttribute(
    'title',
    MxResources.get('underline') +
      ' (' +
      this.editorUi.actions.get('underline').shortcut +
      ')'
  )

  let verticalItem = this.editorUi.toolbar.addItems(
    ['vertical'],
    stylePanel2,
    true
  )[0]

  if (MxClient.IS_QUIRKS) {
    MxUtils.br(container)
  }

  container.appendChild(stylePanel2)

  this.styleButtons(fontStyleItems)
  this.styleButtons([verticalItem])

  let stylePanel3 = stylePanel.cloneNode(false)
  stylePanel3.style.marginLeft = '-3px'
  stylePanel3.style.paddingBottom = '0px'

  // Helper function to return a wrapper function does not pass any arguments
  let callFn = function(fn) {
    return function() {
      return fn()
    }
  }

  let left = this.editorUi.toolbar.addButton(
    'geSprite-left',
    MxResources.get('left'),
    graph.cellEditor.isContentEditing() ? function() {
      document.execCommand('justifyleft', false, null)
    } : callFn(this.editorUi.menus.createStyleChangeFunction([MxConstants.STYLE_ALIGN], [MxConstants.ALIGN_LEFT])), stylePanel3)

  let center = this.editorUi.toolbar.addButton('geSprite-center', MxResources.get('center'), graph.cellEditor.isContentEditing() ? function() {
    document.execCommand('justifycenter', false, null)
  } : callFn(this.editorUi.menus.createStyleChangeFunction([MxConstants.STYLE_ALIGN], [MxConstants.ALIGN_CENTER])), stylePanel3)

  let right = this.editorUi.toolbar.addButton('geSprite-right', MxResources.get('right'), graph.cellEditor.isContentEditing() ? function() {
    document.execCommand('justifyright', false, null)
  } : callFn(this.editorUi.menus.createStyleChangeFunction([MxConstants.STYLE_ALIGN], [MxConstants.ALIGN_RIGHT])), stylePanel3)

  this.styleButtons([left, center, right])

  if (graph.cellEditor.isContentEditing()) {
    let clear = this.editorUi.toolbar.addButton('geSprite-removeformat', MxResources.get('removeFormat'), function() {
      document.execCommand('removeformat', false, null)
    }, stylePanel2
    )
    this.styleButtons([clear])
  }

  let top = this.editorUi.toolbar.addButton(
    'geSprite-top',
    MxResources.get('top'),
    callFn(
      this.editorUi.menus.createStyleChangeFunction(
        [MxConstants.STYLE_VERTICAL_ALIGN],
        [MxConstants.ALIGN_TOP]
      )
    ),
    stylePanel3
  )
  let middle = this.editorUi.toolbar.addButton(
    'geSprite-middle',
    MxResources.get('middle'),
    callFn(
      this.editorUi.menus.createStyleChangeFunction(
        [MxConstants.STYLE_VERTICAL_ALIGN],
        [MxConstants.ALIGN_MIDDLE]
      )
    ),
    stylePanel3
  )
  let bottom = this.editorUi.toolbar.addButton(
    'geSprite-bottom',
    MxResources.get('bottom'),
    callFn(
      this.editorUi.menus.createStyleChangeFunction(
        [MxConstants.STYLE_VERTICAL_ALIGN],
        [MxConstants.ALIGN_BOTTOM]
      )
    ),
    stylePanel3
  )

  this.styleButtons([top, middle, bottom])

  if (MxClient.IS_QUIRKS) {
    MxUtils.br(container)
  }

  container.appendChild(stylePanel3)

  // Hack for updating UI state below based on current text selection
  // currentTable is the current selected DOM table updated below
  let sub, sup, full, tableWrapper, currentTable, tableCell, tableRow

  if (graph.cellEditor.isContentEditing()) {
    top.style.display = 'none'
    middle.style.display = 'none'
    bottom.style.display = 'none'
    verticalItem.style.display = 'none'

    full = this.editorUi.toolbar.addButton(
      'geSprite-justifyfull',
      null,
      function() {
        document.execCommand('justifyfull', false, null)
      },
      stylePanel3
    )
    this.styleButtons([
      full,
      (sub = this.editorUi.toolbar.addButton(
        'geSprite-subscript',
        MxResources.get('subscript') + ' (' + Editor.ctrlKey + '+,)',
        function() {
          document.execCommand('subscript', false, null)
        },
        stylePanel3
      )),
      (sup = this.editorUi.toolbar.addButton(
        'geSprite-superscript',
        MxResources.get('superscript') + ' (' + Editor.ctrlKey + '+.)',
        function() {
          document.execCommand('superscript', false, null)
        },
        stylePanel3
      ))
    ])
    full.style.marginRight = '9px'

    let tmp = stylePanel3.cloneNode(false)
    tmp.style.paddingTop = '4px'
    let btns = [
      this.editorUi.toolbar.addButton(
        'geSprite-orderedlist',
        MxResources.get('numberedList'),
        function() {
          document.execCommand('insertorderedlist', false, null)
        },
        tmp
      ),
      this.editorUi.toolbar.addButton(
        'geSprite-unorderedlist',
        MxResources.get('bulletedList'),
        function() {
          document.execCommand('insertunorderedlist', false, null)
        },
        tmp
      ),
      this.editorUi.toolbar.addButton(
        'geSprite-outdent',
        MxResources.get('decreaseIndent'),
        function() {
          document.execCommand('outdent', false, null)
        },
        tmp
      ),
      this.editorUi.toolbar.addButton(
        'geSprite-indent',
        MxResources.get('increaseIndent'),
        function() {
          document.execCommand('indent', false, null)
        },
        tmp
      ),
      this.editorUi.toolbar.addButton(
        'geSprite-code',
        MxResources.get('html'),
        function() {
          graph.cellEditor.toggleViewMode()
        },
        tmp
      )
    ]
    this.styleButtons(btns)
    btns[btns.length - 1].style.marginLeft = '9px'

    if (MxClient.IS_QUIRKS) {
      MxUtils.br(container)
      tmp.style.height = '40'
    }

    container.appendChild(tmp)
  } else {
    fontStyleItems[2].style.marginRight = '9px'
    right.style.marginRight = '9px'
  }

  // Label position
  let stylePanel4 = stylePanel.cloneNode(false)
  stylePanel4.style.marginLeft = '0px'
  stylePanel4.style.paddingTop = '8px'
  stylePanel4.style.paddingBottom = '4px'
  stylePanel4.style.fontWeight = 'normal'

  MxUtils.write(stylePanel4, MxResources.get('position'))

  // Adds label position options
  let positionSelect = document.createElement('select')
  positionSelect.style.position = 'absolute'
  positionSelect.style.right = '20px'
  positionSelect.style.width = '97px'
  positionSelect.style.marginTop = '-2px'

  let directions = [
    'topLeft',
    'top',
    'topRight',
    'left',
    'center',
    'right',
    'bottomLeft',
    'bottom',
    'bottomRight'
  ]
  let lset = {
    topLeft: [
      MxConstants.ALIGN_LEFT,
      MxConstants.ALIGN_TOP,
      MxConstants.ALIGN_RIGHT,
      MxConstants.ALIGN_BOTTOM
    ],
    top: [
      MxConstants.ALIGN_CENTER,
      MxConstants.ALIGN_TOP,
      MxConstants.ALIGN_CENTER,
      MxConstants.ALIGN_BOTTOM
    ],
    topRight: [
      MxConstants.ALIGN_RIGHT,
      MxConstants.ALIGN_TOP,
      MxConstants.ALIGN_LEFT,
      MxConstants.ALIGN_BOTTOM
    ],
    left: [
      MxConstants.ALIGN_LEFT,
      MxConstants.ALIGN_MIDDLE,
      MxConstants.ALIGN_RIGHT,
      MxConstants.ALIGN_MIDDLE
    ],
    center: [
      MxConstants.ALIGN_CENTER,
      MxConstants.ALIGN_MIDDLE,
      MxConstants.ALIGN_CENTER,
      MxConstants.ALIGN_MIDDLE
    ],
    right: [
      MxConstants.ALIGN_RIGHT,
      MxConstants.ALIGN_MIDDLE,
      MxConstants.ALIGN_LEFT,
      MxConstants.ALIGN_MIDDLE
    ],
    bottomLeft: [
      MxConstants.ALIGN_LEFT,
      MxConstants.ALIGN_BOTTOM,
      MxConstants.ALIGN_RIGHT,
      MxConstants.ALIGN_TOP
    ],
    bottom: [
      MxConstants.ALIGN_CENTER,
      MxConstants.ALIGN_BOTTOM,
      MxConstants.ALIGN_CENTER,
      MxConstants.ALIGN_TOP
    ],
    bottomRight: [
      MxConstants.ALIGN_RIGHT,
      MxConstants.ALIGN_BOTTOM,
      MxConstants.ALIGN_LEFT,
      MxConstants.ALIGN_TOP
    ]
  }

  for (let i = 0; i < directions.length; i++) {
    let positionOption = document.createElement('option')
    positionOption.setAttribute('value', directions[i])
    MxUtils.write(positionOption, MxResources.get(directions[i]))
    positionSelect.appendChild(positionOption)
  }

  stylePanel4.appendChild(positionSelect)

  // Writing direction
  let stylePanel5 = stylePanel.cloneNode(false)
  stylePanel5.style.marginLeft = '0px'
  stylePanel5.style.paddingTop = '4px'
  stylePanel5.style.paddingBottom = '4px'
  stylePanel5.style.fontWeight = 'normal'

  MxUtils.write(stylePanel5, MxResources.get('writingDirection'))

  // Adds writing direction options
  // LATER: Handle reselect of same option in all selects (change event
  // is not fired for same option so have opened state on click) and
  // handle multiple different styles for current selection
  let dirSelect = document.createElement('select')
  dirSelect.style.position = 'absolute'
  dirSelect.style.right = '20px'
  dirSelect.style.width = '97px'
  dirSelect.style.marginTop = '-2px'

  // NOTE: For automatic we use the value null since automatic
  // requires the text to be non formatted and non-wrapped
  let dirs = ['automatic', 'leftToRight', 'rightToLeft']
  let dirSet = {
    automatic: null,
    leftToRight: MxConstants.TEXT_DIRECTION_LTR,
    rightToLeft: MxConstants.TEXT_DIRECTION_RTL
  }

  for (let i = 0; i < dirs.length; i++) {
    let dirOption = document.createElement('option')
    dirOption.setAttribute('value', dirs[i])
    MxUtils.write(dirOption, MxResources.get(dirs[i]))
    dirSelect.appendChild(dirOption)
  }

  stylePanel5.appendChild(dirSelect)

  if (!graph.isEditing()) {
    container.appendChild(stylePanel4)

    MxEvent.addListener(positionSelect, 'change', function(evt) {
      graph.getModel().beginUpdate()
      try {
        let vals = lset[positionSelect.value]

        if (vals !== null) {
          graph.setCellStyles(
            MxConstants.STYLE_LABEL_POSITION,
            vals[0],
            graph.getSelectionCells()
          )
          graph.setCellStyles(
            MxConstants.STYLE_VERTICAL_LABEL_POSITION,
            vals[1],
            graph.getSelectionCells()
          )
          graph.setCellStyles(
            MxConstants.STYLE_ALIGN,
            vals[2],
            graph.getSelectionCells()
          )
          graph.setCellStyles(
            MxConstants.STYLE_VERTICAL_ALIGN,
            vals[3],
            graph.getSelectionCells()
          )
        }
      } finally {
        graph.getModel().endUpdate()
      }

      MxEvent.consume(evt)
    })

    // LATER: Update dir in text editor while editing and update style with label
    // NOTE: The tricky part is handling and passing on the auto value
    container.appendChild(stylePanel5)

    MxEvent.addListener(dirSelect, 'change', function(evt) {
      graph.setCellStyles(
        MxConstants.STYLE_TEXT_DIRECTION,
        dirSet[dirSelect.value],
        graph.getSelectionCells()
      )
      MxEvent.consume(evt)
    })
  }

  // Font size
  let input = document.createElement('input')
  input.style.textAlign = 'right'
  input.style.marginTop = '4px'

  if (!MxClient.IS_QUIRKS) {
    input.style.position = 'absolute'
    input.style.right = '32px'
  }

  input.style.width = '46px'
  input.style.height = MxClient.IS_QUIRKS ? '21px' : '17px'
  stylePanel2.appendChild(input)

  // Workaround for font size 4 if no text is selected is update font size below
  // after first character was entered (as the font element is lazy created)
  let pendingFontSize = null

  let inputUpdate = this.installInputHandler(
    input,
    MxConstants.STYLE_FONTSIZE,
    Menus.prototype.defaultFontSize,
    1,
    999,
    ' pt',
    function(fontSize) {
      // IE does not support containsNode
      // KNOWN: Fixes font size issues but bypasses undo
      if (window.getSelection && !MxClient.IS_IE && !MxClient.IS_IE11) {
        let selection = window.getSelection()
        let container = selection.rangeCount > 0 ? selection.getRangeAt(0).commonAncestorContainer : graph.cellEditor.textarea
        let updateSize = function(elt, ignoreContains) {
          if (elt !== graph.cellEditor.textarea && (ignoreContains || selection.containsNode(elt, true))) {
            if (elt.nodeName === 'FONT') {
              elt.removeAttribute('size')
              elt.style.fontSize = fontSize + 'px'
            } else {
              let css = MxUtils.getCurrentStyle(elt)
              if (css.fontSize !== fontSize + 'px') {
                if (MxUtils.getCurrentStyle(elt.parentNode).fontSize !== fontSize + 'px') {
                  elt.style.fontSize = fontSize + 'px'
                } else {
                  elt.style.fontSize = ''
                }
              }
            }
          }
        }
        // Wraps text node or mixed selection with leading text in a font element
        if (
          container === graph.cellEditor.textarea ||
          container.nodeType !== MxConstants.NODETYPE_ELEMENT
        ) {
          document.execCommand('fontSize', false, '1')
        }

        if (container !== graph.cellEditor.textarea) {
          container = container.parentNode
        }

        if (container.nodeType === MxConstants.NODETYPE_ELEMENT) {
          let elts = container.getElementsByTagName('*')
          updateSize(container)

          for (let i = 0; i < elts.length; i++) {
            updateSize(elts[i])
          }
        }

        input.value = fontSize + ' pt'
      } else {
        pendingFontSize = fontSize

        // Workaround for can't set font size in px is to change font size afterwards
        document.execCommand('fontSize', false, '4')
        let elts = graph.cellEditor.textarea.getElementsByTagName('font')

        for (let i = 0; i < elts.length; i++) {
          if (elts[i].getAttribute('size') === '4') {
            elts[i].removeAttribute('size')
            elts[i].style.fontSize = pendingFontSize + 'px'

            // Overrides fontSize in input with the one just assigned as a workaround
            // for potential fontSize values of parent elements that don't match
            window.setTimeout(function() {
              input.value = pendingFontSize + ' pt'
              pendingFontSize = null
            }, 0)

            break
          }
        }
      }
    },
    true
  )

  let stepper = this.createStepper(
    input,
    inputUpdate,
    1,
    10,
    true,
    Menus.prototype.defaultFontSize
  )
  stepper.style.display = input.style.display
  stepper.style.marginTop = '4px'

  if (!MxClient.IS_QUIRKS) {
    stepper.style.right = '20px'
  }

  stylePanel2.appendChild(stepper)

  let arrow = fontMenu.getElementsByTagName('div')[0]
  arrow.style.cssFloat = 'right'

  let bgColorApply = null
  let currentBgColor = '#ffffff'

  let fontColorApply = null
  let currentFontColor = '#000000'

  let bgPanel = graph.cellEditor.isContentEditing()
    ? this.createColorOption(
      MxResources.get('backgroundColor'),
      function() {
        return currentBgColor
      },
      function(color) {
        document.execCommand(
          'backcolor',
          false,
          color !== MxConstants.NONE ? color : 'transparent'
        )
      },
      '#ffffff',
      {
        install: function(apply) {
          bgColorApply = apply
        },
        destroy: function() {
          bgColorApply = null
        }
      },
      null,
      true
    )
    : this.createCellColorOption(
      MxResources.get('backgroundColor'),
      MxConstants.STYLE_LABEL_BACKGROUNDCOLOR,
      '#ffffff',
      null,
      function(color) {
        graph.updateLabelElements(graph.getSelectionCells(), function(elt) {
          elt.style.backgroundColor = null
        })
      }
    )
  bgPanel.style.fontWeight = 'bold'

  let borderPanel = this.createCellColorOption(
    MxResources.get('borderColor'),
    MxConstants.STYLE_LABEL_BORDERCOLOR,
    '#000000'
  )
  borderPanel.style.fontWeight = 'bold'

  let panel = graph.cellEditor.isContentEditing()
    ? this.createColorOption(
      MxResources.get('fontColor'),
      function() {
        return currentFontColor
      },
      function(color) {
        document.execCommand(
          'forecolor',
          false,
          color !== MxConstants.NONE ? color : 'transparent'
        )
      },
      '#000000',
      {
        install: function(apply) {
          fontColorApply = apply
        },
        destroy: function() {
          fontColorApply = null
        }
      },
      null,
      true
    )
    : this.createCellColorOption(
      MxResources.get('fontColor'),
      MxConstants.STYLE_FONTCOLOR,
      '#000000',
      function(color) {
        if (color === null || color === MxConstants.NONE) {
          bgPanel.style.display = 'none'
        } else {
          bgPanel.style.display = ''
        }

        borderPanel.style.display = bgPanel.style.display
      },
      function(color) {
        if (color === null || color === MxConstants.NONE) {
          graph.setCellStyles(
            MxConstants.STYLE_NOLABEL,
            '1',
            graph.getSelectionCells()
          )
        } else {
          graph.setCellStyles(
            MxConstants.STYLE_NOLABEL,
            null,
            graph.getSelectionCells()
          )
        }

        graph.updateLabelElements(graph.getSelectionCells(), function(elt) {
          elt.removeAttribute('color')
          elt.style.color = null
        })
      }
    )
  panel.style.fontWeight = 'bold'

  colorPanel.appendChild(panel)
  colorPanel.appendChild(bgPanel)

  if (!graph.cellEditor.isContentEditing()) {
    colorPanel.appendChild(borderPanel)
  }

  container.appendChild(colorPanel)

  let extraPanel = this.createPanel()
  extraPanel.style.paddingTop = '2px'
  extraPanel.style.paddingBottom = '4px'

  // LATER: Fix toggle using '' instead of 'null'
  let wwOpt = this.createCellOption(
    MxResources.get('wordWrap'),
    MxConstants.STYLE_WHITE_SPACE,
    null,
    'wrap',
    'null',
    null,
    null,
    true
  )
  wwOpt.style.fontWeight = 'bold'

  // Word wrap in edge labels only supported via labelWidth style
  if (!ss.containsLabel && !ss.autoSize && ss.edges.length === 0) {
    extraPanel.appendChild(wwOpt)
  }

  // Delegates switch of style to formattedText action as it also convertes newlines
  let htmlOpt = this.createCellOption(
    MxResources.get('formattedText'),
    'html',
    '0',
    null,
    null,
    null,
    ui.actions.get('formattedText')
  )
  htmlOpt.style.fontWeight = 'bold'
  extraPanel.appendChild(htmlOpt)

  let spacingPanel = this.createPanel()
  spacingPanel.style.paddingTop = '10px'
  spacingPanel.style.paddingBottom = '28px'
  spacingPanel.style.fontWeight = 'normal'

  let span = document.createElement('div')
  span.style.position = 'absolute'
  span.style.width = '70px'
  span.style.marginTop = '0px'
  span.style.fontWeight = 'bold'
  MxUtils.write(span, MxResources.get('spacing'))
  spacingPanel.appendChild(span)

  let topUpdate, globalUpdate, leftUpdate, bottomUpdate, rightUpdate
  let topSpacing = this.addUnitInput(spacingPanel, 'pt', 91, 44, function() {
    topUpdate.apply(this, arguments)
  })
  let globalSpacing = this.addUnitInput(spacingPanel, 'pt', 20, 44, function() {
    globalUpdate.apply(this, arguments)
  })

  MxUtils.br(spacingPanel)
  this.addLabel(spacingPanel, MxResources.get('top'), 91)
  this.addLabel(spacingPanel, MxResources.get('global'), 20)
  MxUtils.br(spacingPanel)
  MxUtils.br(spacingPanel)

  let leftSpacing = this.addUnitInput(spacingPanel, 'pt', 162, 44, function() {
    leftUpdate.apply(this, arguments)
  })
  let bottomSpacing = this.addUnitInput(spacingPanel, 'pt', 91, 44, function() {
    bottomUpdate.apply(this, arguments)
  })
  let rightSpacing = this.addUnitInput(spacingPanel, 'pt', 20, 44, function() {
    rightUpdate.apply(this, arguments)
  })

  MxUtils.br(spacingPanel)
  this.addLabel(spacingPanel, MxResources.get('left'), 162)
  this.addLabel(spacingPanel, MxResources.get('bottom'), 91)
  this.addLabel(spacingPanel, MxResources.get('right'), 20)

  if (!graph.cellEditor.isContentEditing()) {
    container.appendChild(extraPanel)
    container.appendChild(
      this.createRelativeOption(
        MxResources.get('opacity'),
        MxConstants.STYLE_TEXT_OPACITY
      )
    )
    container.appendChild(spacingPanel)
  } else {
    let selState = null
    var lineHeightInput = null // eslint-disable-line no-unused-vars

    container.appendChild(
      this.createRelativeOption(
        MxResources.get('lineheight'),
        null,
        null,
        function(input) {
          let value = input.value === '' ? 120 : parseInt(input.value)
          value = Math.max(0, isNaN(value) ? 120 : value)

          if (selState !== null) {
            graph.cellEditor.restoreSelection(selState)
            selState = null
          }

          let selectedElement = graph.getSelectedElement()
          let node = selectedElement

          while (
            node !== null &&
            node.nodeType !== MxConstants.NODETYPE_ELEMENT
          ) {
            node = node.parentNode
          }

          if (
            node !== null &&
            node === graph.cellEditor.textarea &&
            graph.cellEditor.textarea.firstChild !== null
          ) {
            if (graph.cellEditor.textarea.firstChild.nodeName !== 'P') {
              graph.cellEditor.textarea.innerHTML =
                '<p>' + graph.cellEditor.textarea.innerHTML + '</p>'
            }

            node = graph.cellEditor.textarea.firstChild
          }

          if (node !== null && node !== graph.cellEditor.textarea) {
            node.style.lineHeight = value + '%'
          }

          input.value = value + ' %'
        },
        function(input) {
          // Used in CSS handler to update current value
          lineHeightInput = input

          // KNOWN: Arrow up/down clear selection text in quirks/IE 8
          // Text size via arrow button limits to 16 in IE11. Why?
          MxEvent.addListener(input, 'mousedown', function() {
            if (document.activeElement === graph.cellEditor.textarea) {
              selState = graph.cellEditor.saveSelection()
            }
          })

          MxEvent.addListener(input, 'touchstart', function() {
            if (document.activeElement === graph.cellEditor.textarea) {
              selState = graph.cellEditor.saveSelection()
            }
          })

          input.value = '120 %'
        }
      )
    )

    let insertPanel = stylePanel.cloneNode(false)
    insertPanel.style.paddingLeft = '0px'
    let insertBtns = this.editorUi.toolbar.addItems(
      ['link', 'image'],
      insertPanel,
      true
    )

    let btns = [
      this.editorUi.toolbar.addButton(
        'geSprite-horizontalrule',
        MxResources.get('insertHorizontalRule'),
        function() {
          document.execCommand('inserthorizontalrule', false)
        },
        insertPanel
      ),
      this.editorUi.toolbar.addMenuFunctionInContainer(
        insertPanel,
        'geSprite-table',
        MxResources.get('table'),
        false,
        MxUtils.bind(this, function(menu) {
          this.editorUi.menus.addInsertTableItem(menu)
        })
      )
    ]
    this.styleButtons(insertBtns)
    this.styleButtons(btns)

    let wrapper2 = this.createPanel()
    wrapper2.style.paddingTop = '10px'
    wrapper2.style.paddingBottom = '10px'
    wrapper2.appendChild(this.createTitle(MxResources.get('insert')))
    wrapper2.appendChild(insertPanel)
    container.appendChild(wrapper2)

    if (MxClient.IS_QUIRKS) {
      wrapper2.style.height = '70'
    }

    let tablePanel = stylePanel.cloneNode(false)
    tablePanel.style.paddingLeft = '0px'

    btns = [
      this.editorUi.toolbar.addButton(
        'geSprite-insertcolumnbefore',
        MxResources.get('insertColumnBefore'),
        function() {
          try {
            if (currentTable !== null) {
              graph.selectNode(
                graph.insertColumn(
                  currentTable,
                  tableCell !== null ? tableCell.cellIndex : 0
                )
              )
            }
          } catch (e) {
            alert(e)
          }
        },
        tablePanel
      ),
      this.editorUi.toolbar.addButton(
        'geSprite-insertcolumnafter',
        MxResources.get('insertColumnAfter'),
        function() {
          try {
            if (currentTable !== null) {
              graph.selectNode(
                graph.insertColumn(
                  currentTable,
                  tableCell !== null ? tableCell.cellIndex + 1 : -1
                )
              )
            }
          } catch (e) {
            alert(e)
          }
        },
        tablePanel
      ),
      this.editorUi.toolbar.addButton(
        'geSprite-deletecolumn',
        MxResources.get('deleteColumn'),
        function() {
          try {
            if (currentTable !== null && tableCell !== null) {
              graph.deleteColumn(currentTable, tableCell.cellIndex)
            }
          } catch (e) {
            alert(e)
          }
        },
        tablePanel
      ),
      this.editorUi.toolbar.addButton(
        'geSprite-insertrowbefore',
        MxResources.get('insertRowBefore'),
        function() {
          try {
            if (currentTable !== null && tableRow !== null) {
              graph.selectNode(
                graph.insertRow(currentTable, tableRow.sectionRowIndex)
              )
            }
          } catch (e) {
            alert(e)
          }
        },
        tablePanel
      ),
      this.editorUi.toolbar.addButton(
        'geSprite-insertrowafter',
        MxResources.get('insertRowAfter'),
        function() {
          try {
            if (currentTable !== null && tableRow !== null) {
              graph.selectNode(
                graph.insertRow(currentTable, tableRow.sectionRowIndex + 1)
              )
            }
          } catch (e) {
            alert(e)
          }
        },
        tablePanel
      ),
      this.editorUi.toolbar.addButton(
        'geSprite-deleterow',
        MxResources.get('deleteRow'),
        function() {
          try {
            if (currentTable !== null && tableRow !== null) {
              graph.deleteRow(currentTable, tableRow.sectionRowIndex)
            }
          } catch (e) {
            alert(e)
          }
        },
        tablePanel
      )
    ]
    this.styleButtons(btns)
    btns[2].style.marginRight = '9px'

    let wrapper3 = this.createPanel()
    wrapper3.style.paddingTop = '10px'
    wrapper3.style.paddingBottom = '10px'
    wrapper3.appendChild(this.createTitle(MxResources.get('table')))
    wrapper3.appendChild(tablePanel)

    if (MxClient.IS_QUIRKS) {
      MxUtils.br(container)
      wrapper3.style.height = '70'
    }

    let tablePanel2 = stylePanel.cloneNode(false)
    tablePanel2.style.paddingLeft = '0px'

    btns = [
      this.editorUi.toolbar.addButton(
        'geSprite-strokecolor',
        MxResources.get('borderColor'),
        MxUtils.bind(this, function() {
          if (currentTable !== null) {
            // Converts rgb(r,g,b) values
            let color = currentTable.style.borderColor.replace(
              /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
              function($0, $1, $2, $3) {
                return (
                  '#' +
                  ('0' + Number($1).toString(16)).substr(-2) +
                  ('0' + Number($2).toString(16)).substr(-2) +
                  ('0' + Number($3).toString(16)).substr(-2)
                )
              }
            )
            this.editorUi.pickColor(color, function(newColor) {
              if (newColor === null || newColor === MxConstants.NONE) {
                currentTable.removeAttribute('border')
                currentTable.style.border = ''
                currentTable.style.borderCollapse = ''
              } else {
                currentTable.setAttribute('border', '1')
                currentTable.style.border = '1px solid ' + newColor
                currentTable.style.borderCollapse = 'collapse'
              }
            })
          }
        }),
        tablePanel2
      ),
      this.editorUi.toolbar.addButton(
        'geSprite-fillcolor',
        MxResources.get('backgroundColor'),
        MxUtils.bind(this, function() {
          // Converts rgb(r,g,b) values
          if (currentTable !== null) {
            let color = currentTable.style.backgroundColor.replace(
              /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
              function($0, $1, $2, $3) {
                return (
                  '#' +
                  ('0' + Number($1).toString(16)).substr(-2) +
                  ('0' + Number($2).toString(16)).substr(-2) +
                  ('0' + Number($3).toString(16)).substr(-2)
                )
              }
            )
            this.editorUi.pickColor(color, function(newColor) {
              if (newColor === null || newColor === MxConstants.NONE) {
                currentTable.style.backgroundColor = ''
              } else {
                currentTable.style.backgroundColor = newColor
              }
            })
          }
        }),
        tablePanel2
      ),
      this.editorUi.toolbar.addButton(
        'geSprite-fit',
        MxResources.get('spacing'),
        function() {
          if (currentTable !== null) {
            let value = currentTable.getAttribute('cellPadding') || 0

            let dlg = new FilenameDialog(
              ui,
              value,
              MxResources.get('apply'),
              MxUtils.bind(this, function(newValue) {
                if (newValue !== null && newValue.length > 0) {
                  currentTable.setAttribute('cellPadding', newValue)
                } else {
                  currentTable.removeAttribute('cellPadding')
                }
              }),
              MxResources.get('spacing')
            )
            ui.showDialog(dlg.container, 300, 80, true, true)
            dlg.init()
          }
        },
        tablePanel2
      ),
      this.editorUi.toolbar.addButton(
        'geSprite-left',
        MxResources.get('left'),
        function() {
          if (currentTable !== null) {
            currentTable.setAttribute('align', 'left')
          }
        },
        tablePanel2
      ),
      this.editorUi.toolbar.addButton(
        'geSprite-center',
        MxResources.get('center'),
        function() {
          if (currentTable !== null) {
            currentTable.setAttribute('align', 'center')
          }
        },
        tablePanel2
      ),
      this.editorUi.toolbar.addButton(
        'geSprite-right',
        MxResources.get('right'),
        function() {
          if (currentTable !== null) {
            currentTable.setAttribute('align', 'right')
          }
        },
        tablePanel2
      )
    ]
    this.styleButtons(btns)
    btns[2].style.marginRight = '9px'

    if (MxClient.IS_QUIRKS) {
      MxUtils.br(wrapper3)
      MxUtils.br(wrapper3)
    }

    wrapper3.appendChild(tablePanel2)
    container.appendChild(wrapper3)

    tableWrapper = wrapper3
  }

  function setSelected(elt, selected) {
    if (MxClient.IS_IE && (MxClient.IS_QUIRKS || document.documentMode < 10)) {
      elt.style.filter = selected
        ? 'progid:DXImageTransform.Microsoft.Gradient(' +
          "StartColorStr='#c5ecff', EndColorStr='#87d4fb', GradientType=0)"
        : ''
    } else {
      elt.style.backgroundImage = selected
        ? 'linear-gradient(#c5ecff 0px,#87d4fb 100%)'
        : ''
    }
  }

  let listener = MxUtils.bind(this, function(sender, evt, force) {
    ss = this.format.getSelectionState()
    let fontStyle = MxUtils.getValue(ss.style, MxConstants.STYLE_FONTSTYLE, 0)
    setSelected(
      fontStyleItems[0],
      (fontStyle & MxConstants.FONT_BOLD) === MxConstants.FONT_BOLD
    )
    setSelected(
      fontStyleItems[1],
      (fontStyle & MxConstants.FONT_ITALIC) === MxConstants.FONT_ITALIC
    )
    setSelected(
      fontStyleItems[2],
      (fontStyle & MxConstants.FONT_UNDERLINE) === MxConstants.FONT_UNDERLINE
    )
    fontMenu.firstChild.nodeValue = MxUtils.htmlEntities(
      MxUtils.getValue(
        ss.style,
        MxConstants.STYLE_FONTFAMILY,
        Menus.prototype.defaultFont
      )
    )

    setSelected(
      verticalItem,
      MxUtils.getValue(ss.style, MxConstants.STYLE_HORIZONTAL, '1') === '0'
    )

    if (force || document.activeElement !== input) {
      let tmp = parseFloat(
        MxUtils.getValue(
          ss.style,
          MxConstants.STYLE_FONTSIZE,
          Menus.prototype.defaultFontSize
        )
      )
      input.value = isNaN(tmp) ? '' : tmp + ' pt'
    }

    let align = MxUtils.getValue(
      ss.style,
      MxConstants.STYLE_ALIGN,
      MxConstants.ALIGN_CENTER
    )
    setSelected(left, align === MxConstants.ALIGN_LEFT)
    setSelected(center, align === MxConstants.ALIGN_CENTER)
    setSelected(right, align === MxConstants.ALIGN_RIGHT)

    let valign = MxUtils.getValue(
      ss.style,
      MxConstants.STYLE_VERTICAL_ALIGN,
      MxConstants.ALIGN_MIDDLE
    )
    setSelected(top, valign === MxConstants.ALIGN_TOP)
    setSelected(middle, valign === MxConstants.ALIGN_MIDDLE)
    setSelected(bottom, valign === MxConstants.ALIGN_BOTTOM)

    let pos = MxUtils.getValue(
      ss.style,
      MxConstants.STYLE_LABEL_POSITION,
      MxConstants.ALIGN_CENTER
    )
    let vpos = MxUtils.getValue(
      ss.style,
      MxConstants.STYLE_VERTICAL_LABEL_POSITION,
      MxConstants.ALIGN_MIDDLE
    )

    if (pos === MxConstants.ALIGN_LEFT && vpos === MxConstants.ALIGN_TOP) {
      positionSelect.value = 'topLeft'
    } else if (
      pos === MxConstants.ALIGN_CENTER &&
      vpos === MxConstants.ALIGN_TOP
    ) {
      positionSelect.value = 'top'
    } else if (
      pos === MxConstants.ALIGN_RIGHT &&
      vpos === MxConstants.ALIGN_TOP
    ) {
      positionSelect.value = 'topRight'
    } else if (
      pos === MxConstants.ALIGN_LEFT &&
      vpos === MxConstants.ALIGN_BOTTOM
    ) {
      positionSelect.value = 'bottomLeft'
    } else if (
      pos === MxConstants.ALIGN_CENTER &&
      vpos === MxConstants.ALIGN_BOTTOM
    ) {
      positionSelect.value = 'bottom'
    } else if (
      pos === MxConstants.ALIGN_RIGHT &&
      vpos === MxConstants.ALIGN_BOTTOM
    ) {
      positionSelect.value = 'bottomRight'
    } else if (pos === MxConstants.ALIGN_LEFT) {
      positionSelect.value = 'left'
    } else if (pos === MxConstants.ALIGN_RIGHT) {
      positionSelect.value = 'right'
    } else {
      positionSelect.value = 'center'
    }

    let dir = MxUtils.getValue(
      ss.style,
      MxConstants.STYLE_TEXT_DIRECTION,
      MxConstants.DEFAULT_TEXT_DIRECTION
    )

    if (dir === MxConstants.TEXT_DIRECTION_RTL) {
      dirSelect.value = 'rightToLeft'
    } else if (dir === MxConstants.TEXT_DIRECTION_LTR) {
      dirSelect.value = 'leftToRight'
    } else if (dir === MxConstants.TEXT_DIRECTION_AUTO) {
      dirSelect.value = 'automatic'
    }

    if (force || document.activeElement !== globalSpacing) {
      let tmp = parseFloat(
        MxUtils.getValue(ss.style, MxConstants.STYLE_SPACING, 2)
      )
      globalSpacing.value = isNaN(tmp) ? '' : tmp + ' pt'
    }

    if (force || document.activeElement !== topSpacing) {
      let tmp = parseFloat(
        MxUtils.getValue(ss.style, MxConstants.STYLE_SPACING_TOP, 0)
      )
      topSpacing.value = isNaN(tmp) ? '' : tmp + ' pt'
    }

    if (force || document.activeElement !== rightSpacing) {
      let tmp = parseFloat(
        MxUtils.getValue(ss.style, MxConstants.STYLE_SPACING_RIGHT, 0)
      )
      rightSpacing.value = isNaN(tmp) ? '' : tmp + ' pt'
    }

    if (force || document.activeElement !== bottomSpacing) {
      let tmp = parseFloat(
        MxUtils.getValue(ss.style, MxConstants.STYLE_SPACING_BOTTOM, 0)
      )
      bottomSpacing.value = isNaN(tmp) ? '' : tmp + ' pt'
    }

    if (force || document.activeElement !== leftSpacing) {
      let tmp = parseFloat(
        MxUtils.getValue(ss.style, MxConstants.STYLE_SPACING_LEFT, 0)
      )
      leftSpacing.value = isNaN(tmp) ? '' : tmp + ' pt'
    }
  })

  globalUpdate = this.installInputHandler(
    globalSpacing,
    MxConstants.STYLE_SPACING,
    2,
    -999,
    999,
    ' pt'
  )
  topUpdate = this.installInputHandler(
    topSpacing,
    MxConstants.STYLE_SPACING_TOP,
    0,
    -999,
    999,
    ' pt'
  )
  rightUpdate = this.installInputHandler(
    rightSpacing,
    MxConstants.STYLE_SPACING_RIGHT,
    0,
    -999,
    999,
    ' pt'
  )
  bottomUpdate = this.installInputHandler(
    bottomSpacing,
    MxConstants.STYLE_SPACING_BOTTOM,
    0,
    -999,
    999,
    ' pt'
  )
  leftUpdate = this.installInputHandler(
    leftSpacing,
    MxConstants.STYLE_SPACING_LEFT,
    0,
    -999,
    999,
    ' pt'
  )

  this.addKeyHandler(input, listener)
  this.addKeyHandler(globalSpacing, listener)
  this.addKeyHandler(topSpacing, listener)
  this.addKeyHandler(rightSpacing, listener)
  this.addKeyHandler(bottomSpacing, listener)
  this.addKeyHandler(leftSpacing, listener)

  graph.getModel().addListener(MxEvent.CHANGE, listener)
  this.listeners.push({
    destroy: function() {
      graph.getModel().removeListener(listener)
    }
  })
  listener()

  if (graph.cellEditor.isContentEditing()) {
    let updating = false

    let updateCssHandler = function() {
      if (!updating) {
        updating = true

        window.setTimeout(function() {
          let selectedElement = graph.getSelectedElement()
          let node = selectedElement

          while (
            node !== null &&
            node.nodeType !== MxConstants.NODETYPE_ELEMENT
          ) {
            node = node.parentNode
          }

          if (node !== null) {
            // Workaround for commonAncestor on range in IE11 returning parent of common ancestor
            if (
              node === graph.cellEditor.textarea &&
              graph.cellEditor.textarea.children.length === 1 &&
              graph.cellEditor.textarea.firstChild.nodeType ===
                MxConstants.NODETYPE_ELEMENT
            ) {
              node = graph.cellEditor.textarea.firstChild
            }

            let getRelativeLineHeight = function(fontSize, lineHeight, elt) {
              if (elt.style.lineHeight.substring(elt.style.lineHeight.length - 1) === '%') {
                return parseInt(elt.style.lineHeight) / 100
              } else {
                return lineHeight.substring(lineHeight.length - 2) === 'px' ? parseFloat(lineHeight) / fontSize : parseInt(lineHeight)
              }
            }

            let getAbsoluteFontSize = function(fontSize) {
              if (fontSize.substring(fontSize.length - 2) === 'px') {
                return parseFloat(fontSize)
              } else {
                return MxConstants.DEFAULT_FONTSIZE
              }
            }

            // let realCss = MxUtils.getCurrentStyle(selectedElement);
            let css = MxUtils.getCurrentStyle(node)
            let fontSize = getAbsoluteFontSize(css.fontSize)
            let lineHeight = getRelativeLineHeight(
              fontSize,
              css.lineHeight,
              node
            )

            // Finds common font size
            let elts = node.getElementsByTagName('*')

            // IE does not support containsNode
            if (
              elts.length > 0 &&
              window.getSelection &&
              !MxClient.IS_IE &&
              !MxClient.IS_IE11
            ) {
              let selection = window.getSelection()

              for (let i = 0; i < elts.length; i++) {
                if (selection.containsNode(elts[i], true)) {
                  let temp
                  temp = MxUtils.getCurrentStyle(elts[i])
                  fontSize = Math.max(
                    getAbsoluteFontSize(temp.fontSize),
                    fontSize
                  )
                  let lh = getRelativeLineHeight(
                    fontSize,
                    temp.lineHeight,
                    elts[i]
                  )

                  if (lh !== lineHeight || isNaN(lh)) {
                    lineHeight = ''
                  }
                }
              }
            }

            if (css !== null) {
              setSelected(
                fontStyleItems[0],
                css.fontWeight === 'bold' ||
                  graph.getParentByName(
                    node,
                    'B',
                    graph.cellEditor.textarea
                  ) !== null
              )
              setSelected(
                fontStyleItems[1],
                css.fontStyle === 'italic' ||
                  graph.getParentByName(
                    node,
                    'I',
                    graph.cellEditor.textarea
                  ) !== null
              )
              setSelected(
                fontStyleItems[2],
                graph.getParentByName(node, 'U', graph.cellEditor.textarea) !==
                  null
              )
              setSelected(left, css.textAlign === 'left')
              setSelected(center, css.textAlign === 'center')
              setSelected(right, css.textAlign === 'right')
              setSelected(full, css.textAlign === 'justify')
              setSelected(
                sup,
                graph.getParentByName(
                  node,
                  'SUP',
                  graph.cellEditor.textarea
                ) !== null
              )
              setSelected(
                sub,
                graph.getParentByName(
                  node,
                  'SUB',
                  graph.cellEditor.textarea
                ) !== null
              )

              currentTable = graph.getParentByName(
                node,
                'TABLE',
                graph.cellEditor.textarea
              )
              tableRow =
                currentTable === null
                  ? null
                  : graph.getParentByName(node, 'TR', currentTable)
              tableCell =
                currentTable === null
                  ? null
                  : graph.getParentByName(node, 'TD', currentTable)
              tableWrapper.style.display = currentTable !== null ? '' : 'none'

              if (document.activeElement !== input) {
                if (
                  node.nodeName === 'FONT' &&
                  node.getAttribute('size') === '4' &&
                  pendingFontSize !== null
                ) {
                  node.removeAttribute('size')
                  node.style.fontSize = pendingFontSize + ' pt'
                  pendingFontSize = null
                } else {
                  input.value = isNaN(fontSize) ? '' : fontSize + ' pt'
                }

                let lh = parseFloat(lineHeight)

                if (!isNaN(lh)) {
                  lineHeightInput.value = Math.round(lh * 100) + ' %'
                } else {
                  lineHeightInput.value = '100 %'
                }
              }

              // Converts rgb(r,g,b) values
              let color = css.color.replace(
                /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
                function($0, $1, $2, $3) {
                  return (
                    '#' +
                    ('0' + Number($1).toString(16)).substr(-2) +
                    ('0' + Number($2).toString(16)).substr(-2) +
                    ('0' + Number($3).toString(16)).substr(-2)
                  )
                }
              )
              let color2 = css.backgroundColor.replace(
                /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
                function($0, $1, $2, $3) {
                  return (
                    '#' +
                    ('0' + Number($1).toString(16)).substr(-2) +
                    ('0' + Number($2).toString(16)).substr(-2) +
                    ('0' + Number($3).toString(16)).substr(-2)
                  )
                }
              )

              // Updates the color picker for the current font
              if (fontColorApply !== null) {
                if (color.charAt(0) === '#') {
                  currentFontColor = color
                } else {
                  currentFontColor = '#000000'
                }

                fontColorApply(currentFontColor, true)
              }

              if (bgColorApply !== null) {
                if (color2.charAt(0) === '#') {
                  currentBgColor = color2
                } else {
                  currentBgColor = null
                }

                bgColorApply(currentBgColor, true)
              }

              // Workaround for firstChild is null or not an object
              // in the log which seems to be IE8- only / 29.01.15
              if (fontMenu.firstChild !== null) {
                // Strips leading and trailing quotes
                let ff = css.fontFamily

                if (ff.charAt(0) === "'") {
                  ff = ff.substring(1)
                }

                if (ff.charAt(ff.length - 1) === "'") {
                  ff = ff.substring(0, ff.length - 1)
                }

                if (ff.charAt(0) === '"') {
                  ff = ff.substring(1)
                }

                if (ff.charAt(ff.length - 1) === '"') {
                  ff = ff.substring(0, ff.length - 1)
                }

                fontMenu.firstChild.nodeValue = ff
              }
            }
          }

          updating = false
        }, 0)
      }
    }

    MxEvent.addListener(graph.cellEditor.textarea, 'input', updateCssHandler)
    MxEvent.addListener(graph.cellEditor.textarea, 'touchend', updateCssHandler)
    MxEvent.addListener(graph.cellEditor.textarea, 'mouseup', updateCssHandler)
    MxEvent.addListener(graph.cellEditor.textarea, 'keyup', updateCssHandler)
    this.listeners.push({
      destroy: function() {
        // No need to remove listener since textarea is destroyed after edit
      }
    })
    updateCssHandler()
  }

  return container
}

/**
 * Adds the label menu items to the given menu and parent.
 */
export class StyleFormatPanel {
  constructor(format, editorUi, container) {
    BaseFormatPanel.call(this, format, editorUi, container)
    this.init()
  }
}

MxUtils.extend(StyleFormatPanel, BaseFormatPanel)

/**
 *
 */
StyleFormatPanel.prototype.defaultStrokeColor = 'black'

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.init = function() {
  let ui = this.editorUi
  let editor = ui.editor
  let graph = editor.graph // eslint-disable-line no-unused-vars
  let ss = this.format.getSelectionState()

  if (!ss.containsImage || ss.style.shape === 'image') {
    this.container.appendChild(this.addFill(this.createPanel()))
  }

  this.container.appendChild(this.addStroke(this.createPanel()))
  this.container.appendChild(this.addLineJumps(this.createPanel()))
  let opacityPanel = this.createRelativeOption(
    MxResources.get('opacity'),
    MxConstants.STYLE_OPACITY,
    41
  )
  opacityPanel.style.paddingTop = '8px'
  opacityPanel.style.paddingBottom = '8px'
  this.container.appendChild(opacityPanel)
  this.container.appendChild(this.addEffects(this.createPanel()))
  let opsPanel = this.addEditOps(this.createPanel())

  if (opsPanel.firstChild !== null) {
    MxUtils.br(opsPanel)
  }

  this.container.appendChild(this.addStyleOps(opsPanel))
}

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addEditOps = function(div) {
  let ss = this.format.getSelectionState()
  let btn = null

  if (this.editorUi.editor.graph.getSelectionCount() === 1) {
    btn = MxUtils.button(
      MxResources.get('editStyle'),
      MxUtils.bind(this, function(evt) {
        this.editorUi.actions.get('editStyle').funct()
      })
    )

    btn.setAttribute(
      'title',
      MxResources.get('editStyle') +
        ' (' +
        this.editorUi.actions.get('editStyle').shortcut +
        ')'
    )
    btn.style.width = '202px'
    btn.style.marginBottom = '2px'

    div.appendChild(btn)
  }

  if (ss.image) {
    let btn2 = MxUtils.button(
      MxResources.get('editImage'),
      MxUtils.bind(this, function(evt) {
        this.editorUi.actions.get('image').funct()
      })
    )

    btn2.setAttribute('title', MxResources.get('editImage'))
    btn2.style.marginBottom = '2px'

    if (btn === null) {
      btn2.style.width = '202px'
    } else {
      btn.style.width = '100px'
      btn2.style.width = '100px'
      btn2.style.marginLeft = '2px'
    }

    div.appendChild(btn2)
  }

  return div
}

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addFill = function(container) {
  let ui = this.editorUi
  let graph = ui.editor.graph
  let ss = this.format.getSelectionState()
  container.style.paddingTop = '6px'
  container.style.paddingBottom = '6px'

  // Adds gradient direction option
  let gradientSelect = document.createElement('select')
  gradientSelect.style.position = 'absolute'
  gradientSelect.style.marginTop = '-2px'
  gradientSelect.style.right = MxClient.IS_QUIRKS ? '52px' : '72px'
  gradientSelect.style.width = '70px'

  // Stops events from bubbling to color option event handler
  MxEvent.addListener(gradientSelect, 'click', function(evt) {
    MxEvent.consume(evt)
  })

  let gradientPanel = this.createCellColorOption(
    MxResources.get('gradient'),
    MxConstants.STYLE_GRADIENTCOLOR,
    '#ffffff',
    function(color) {
      if (color === null || color === MxConstants.NONE) {
        gradientSelect.style.display = 'none'
      } else {
        gradientSelect.style.display = ''
      }
    }
  )

  let fillKey =
    ss.style.shape === 'image'
      ? MxConstants.STYLE_IMAGE_BACKGROUND
      : MxConstants.STYLE_FILLCOLOR

  let fillPanel = this.createCellColorOption(
    MxResources.get('fill'),
    fillKey,
    '#ffffff'
  )
  fillPanel.style.fontWeight = 'bold'

  let tmpColor = MxUtils.getValue(ss.style, fillKey, null)
  gradientPanel.style.display =
    tmpColor !== null &&
    tmpColor !== MxConstants.NONE &&
    ss.fill &&
    ss.style.shape !== 'image'
      ? ''
      : 'none'

  let directions = [
    MxConstants.DIRECTION_NORTH,
    MxConstants.DIRECTION_EAST,
    MxConstants.DIRECTION_SOUTH,
    MxConstants.DIRECTION_WEST
  ]

  for (let i = 0; i < directions.length; i++) {
    let gradientOption = document.createElement('option')
    gradientOption.setAttribute('value', directions[i])
    MxUtils.write(gradientOption, MxResources.get(directions[i]))
    gradientSelect.appendChild(gradientOption)
  }

  gradientPanel.appendChild(gradientSelect)

  let listener = MxUtils.bind(this, function() {
    ss = this.format.getSelectionState()
    let value = MxUtils.getValue(
      ss.style,
      MxConstants.STYLE_GRADIENT_DIRECTION,
      MxConstants.DIRECTION_SOUTH
    )

    // Handles empty string which is not allowed as a value
    if (value === '') {
      value = MxConstants.DIRECTION_SOUTH
    }

    gradientSelect.value = value
    container.style.display = ss.fill ? '' : 'none'

    let fillColor = MxUtils.getValue(
      ss.style,
      MxConstants.STYLE_FILLCOLOR,
      null
    )

    if (
      !ss.fill ||
      ss.containsImage ||
      fillColor === null ||
      fillColor === MxConstants.NONE ||
      ss.style.shape === 'filledEdge'
    ) {
      gradientPanel.style.display = 'none'
    } else {
      gradientPanel.style.display = ''
    }
  })

  graph.getModel().addListener(MxEvent.CHANGE, listener)
  this.listeners.push({
    destroy: function() {
      graph.getModel().removeListener(listener)
    }
  })
  listener()

  MxEvent.addListener(gradientSelect, 'change', function(evt) {
    graph.setCellStyles(
      MxConstants.STYLE_GRADIENT_DIRECTION,
      gradientSelect.value,
      graph.getSelectionCells()
    )
    MxEvent.consume(evt)
  })

  container.appendChild(fillPanel)
  container.appendChild(gradientPanel)

  // Adds custom colors
  let custom = this.getCustomColors()

  for (let i = 0; i < custom.length; i++) {
    container.appendChild(
      this.createCellColorOption(
        custom[i].title,
        custom[i].key,
        custom[i].defaultValue
      )
    )
  }

  return container
}

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.getCustomColors = function() {
  let ss = this.format.getSelectionState()
  let result = []

  if (ss.style.shape === 'swimlane') {
    result.push({
      title: MxResources.get('laneColor'),
      key: 'swimlaneFillColor',
      defaultValue: '#ffffff'
    })
  }

  return result
}

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addStroke = function(container) {
  let ui = this.editorUi
  let graph = ui.editor.graph
  let ss = this.format.getSelectionState()

  container.style.paddingTop = '4px'
  container.style.paddingBottom = '4px'
  container.style.whiteSpace = 'normal'

  let colorPanel = document.createElement('div')
  colorPanel.style.fontWeight = 'bold'

  // Adds gradient direction option
  let styleSelect = document.createElement('select')
  styleSelect.style.position = 'absolute'
  styleSelect.style.marginTop = '-2px'
  styleSelect.style.right = '72px'
  styleSelect.style.width = '80px'

  let styles = ['sharp', 'rounded', 'curved']

  for (let i = 0; i < styles.length; i++) {
    let styleOption = document.createElement('option')
    styleOption.setAttribute('value', styles[i])
    MxUtils.write(styleOption, MxResources.get(styles[i]))
    styleSelect.appendChild(styleOption)
  }

  MxEvent.addListener(styleSelect, 'change', function(evt) {
    graph.getModel().beginUpdate()
    try {
      let keys = [MxConstants.STYLE_ROUNDED, MxConstants.STYLE_CURVED]
      // Default for rounded is 1
      let values = ['0', null]

      if (styleSelect.value === 'rounded') {
        values = ['1', null]
      } else if (styleSelect.value === 'curved') {
        values = [null, '1']
      }

      for (let i = 0; i < keys.length; i++) {
        graph.setCellStyles(keys[i], values[i], graph.getSelectionCells())
      }

      ui.fireEvent(
        new MxEventObject(
          'styleChanged',
          'keys',
          keys,
          'values',
          values,
          'cells',
          graph.getSelectionCells()
        )
      )
    } finally {
      graph.getModel().endUpdate()
    }

    MxEvent.consume(evt)
  })

  // Stops events from bubbling to color option event handler
  MxEvent.addListener(styleSelect, 'click', function(evt) {
    MxEvent.consume(evt)
  })

  let strokeKey =
    ss.style.shape === 'image'
      ? MxConstants.STYLE_IMAGE_BORDER
      : MxConstants.STYLE_STROKECOLOR

  let lineColor = this.createCellColorOption(
    MxResources.get('line'),
    strokeKey,
    '#000000'
  )
  lineColor.appendChild(styleSelect)
  colorPanel.appendChild(lineColor)

  // Used if only edges selected
  let stylePanel = colorPanel.cloneNode(false)
  stylePanel.style.fontWeight = 'normal'
  stylePanel.style.whiteSpace = 'nowrap'
  stylePanel.style.position = 'relative'
  stylePanel.style.paddingLeft = '16px'
  stylePanel.style.marginBottom = '2px'
  stylePanel.style.marginTop = '2px'
  stylePanel.className = 'geToolbarContainer'

  let addItem = MxUtils.bind(this, function(
    menu,
    width,
    cssName,
    keys,
    values
  ) {
    let item = this.editorUi.menus.styleChange(
      menu,
      '',
      keys,
      values,
      'geIcon',
      null
    )

    let pat = document.createElement('div')
    pat.style.width = width + 'px'
    pat.style.height = '1px'
    pat.style.borderBottom = '1px ' + cssName + ' ' + this.defaultStrokeColor
    pat.style.paddingTop = '6px'

    item.firstChild.firstChild.style.padding = '0px 4px 0px 4px'
    item.firstChild.firstChild.style.width = width + 'px'
    item.firstChild.firstChild.appendChild(pat)

    return item
  })

  let pattern = this.editorUi.toolbar.addMenuFunctionInContainer(
    stylePanel,
    'geSprite-orthogonal',
    MxResources.get('pattern'),
    false,
    MxUtils.bind(this, function(menu) {
      addItem(
        menu,
        75,
        'solid',
        [MxConstants.STYLE_DASHED, MxConstants.STYLE_DASH_PATTERN],
        [null, null]
      ).setAttribute('title', MxResources.get('solid'))
      addItem(
        menu,
        75,
        'dashed',
        [MxConstants.STYLE_DASHED, MxConstants.STYLE_DASH_PATTERN],
        ['1', null]
      ).setAttribute('title', MxResources.get('dashed'))
      addItem(
        menu,
        75,
        'dotted',
        [MxConstants.STYLE_DASHED, MxConstants.STYLE_DASH_PATTERN],
        ['1', '1 1']
      ).setAttribute('title', MxResources.get('dotted') + ' (1)')
      addItem(
        menu,
        75,
        'dotted',
        [MxConstants.STYLE_DASHED, MxConstants.STYLE_DASH_PATTERN],
        ['1', '1 2']
      ).setAttribute('title', MxResources.get('dotted') + ' (2)')
      addItem(
        menu,
        75,
        'dotted',
        [MxConstants.STYLE_DASHED, MxConstants.STYLE_DASH_PATTERN],
        ['1', '1 4']
      ).setAttribute('title', MxResources.get('dotted') + ' (3)')
    })
  )

  // Used for mixed selection (vertices and edges)
  let altStylePanel = stylePanel.cloneNode(false)

  let edgeShape = this.editorUi.toolbar.addMenuFunctionInContainer(
    altStylePanel,
    'geSprite-connection',
    MxResources.get('connection'),
    false,
    MxUtils.bind(this, function(menu) {
      this.editorUi.menus
        .styleChange(
          menu,
          '',
          [
            MxConstants.STYLE_SHAPE,
            MxConstants.STYLE_STARTSIZE,
            MxConstants.STYLE_ENDSIZE,
            'width'
          ],
          [null, null, null, null],
          'geIcon geSprite geSprite-connection',
          null,
          true
        )
        .setAttribute('title', MxResources.get('line'))
      this.editorUi.menus
        .styleChange(
          menu,
          '',
          [
            MxConstants.STYLE_SHAPE,
            MxConstants.STYLE_STARTSIZE,
            MxConstants.STYLE_ENDSIZE,
            'width'
          ],
          ['link', null, null, null],
          'geIcon geSprite geSprite-linkedge',
          null,
          true
        )
        .setAttribute('title', MxResources.get('link'))
      this.editorUi.menus
        .styleChange(
          menu,
          '',
          [
            MxConstants.STYLE_SHAPE,
            MxConstants.STYLE_STARTSIZE,
            MxConstants.STYLE_ENDSIZE,
            'width'
          ],
          ['flexArrow', null, null, null],
          'geIcon geSprite geSprite-arrow',
          null,
          true
        )
        .setAttribute('title', MxResources.get('arrow'))
      this.editorUi.menus
        .styleChange(
          menu,
          '',
          [
            MxConstants.STYLE_SHAPE,
            MxConstants.STYLE_STARTSIZE,
            MxConstants.STYLE_ENDSIZE,
            'width'
          ],
          ['arrow', null, null, null],
          'geIcon geSprite geSprite-simplearrow',
          null,
          true
        )
        .setAttribute('title', MxResources.get('simpleArrow'))
    })
  )

  let altPattern = this.editorUi.toolbar.addMenuFunctionInContainer(
    altStylePanel,
    'geSprite-orthogonal',
    MxResources.get('pattern'),
    false,
    MxUtils.bind(this, function(menu) {
      addItem(
        menu,
        33,
        'solid',
        [MxConstants.STYLE_DASHED, MxConstants.STYLE_DASH_PATTERN],
        [null, null]
      ).setAttribute('title', MxResources.get('solid'))
      addItem(
        menu,
        33,
        'dashed',
        [MxConstants.STYLE_DASHED, MxConstants.STYLE_DASH_PATTERN],
        ['1', null]
      ).setAttribute('title', MxResources.get('dashed'))
      addItem(
        menu,
        33,
        'dotted',
        [MxConstants.STYLE_DASHED, MxConstants.STYLE_DASH_PATTERN],
        ['1', '1 1']
      ).setAttribute('title', MxResources.get('dotted') + ' (1)')
      addItem(
        menu,
        33,
        'dotted',
        [MxConstants.STYLE_DASHED, MxConstants.STYLE_DASH_PATTERN],
        ['1', '1 2']
      ).setAttribute('title', MxResources.get('dotted') + ' (2)')
      addItem(
        menu,
        33,
        'dotted',
        [MxConstants.STYLE_DASHED, MxConstants.STYLE_DASH_PATTERN],
        ['1', '1 4']
      ).setAttribute('title', MxResources.get('dotted') + ' (3)')
    })
  )

  let stylePanel2 = stylePanel.cloneNode(false)

  // Stroke width
  let input = document.createElement('input')
  input.style.textAlign = 'right'
  input.style.marginTop = '2px'
  input.style.width = '41px'
  input.setAttribute('title', MxResources.get('linewidth'))

  stylePanel.appendChild(input)

  let altInput = input.cloneNode(true)
  altStylePanel.appendChild(altInput)

  function update(evt) {
    // Maximum stroke width is 999
    let value = parseInt(input.value)
    value = Math.min(999, Math.max(1, isNaN(value) ? 1 : value))

    if (
      value !== MxUtils.getValue(ss.style, MxConstants.STYLE_STROKEWIDTH, 1)
    ) {
      graph.setCellStyles(
        MxConstants.STYLE_STROKEWIDTH,
        value,
        graph.getSelectionCells()
      )
      ui.fireEvent(
        new MxEventObject(
          'styleChanged',
          'keys',
          [MxConstants.STYLE_STROKEWIDTH],
          'values',
          [value],
          'cells',
          graph.getSelectionCells()
        )
      )
    }

    input.value = value + ' pt'
    MxEvent.consume(evt)
  }

  function altUpdate(evt) {
    // Maximum stroke width is 999
    let value = parseInt(altInput.value)
    value = Math.min(999, Math.max(1, isNaN(value) ? 1 : value))

    if (
      value !== MxUtils.getValue(ss.style, MxConstants.STYLE_STROKEWIDTH, 1)
    ) {
      graph.setCellStyles(
        MxConstants.STYLE_STROKEWIDTH,
        value,
        graph.getSelectionCells()
      )
      ui.fireEvent(
        new MxEventObject(
          'styleChanged',
          'keys',
          [MxConstants.STYLE_STROKEWIDTH],
          'values',
          [value],
          'cells',
          graph.getSelectionCells()
        )
      )
    }

    altInput.value = value + ' pt'
    MxEvent.consume(evt)
  }

  let stepper = this.createStepper(input, update, 1, 9)
  stepper.style.display = input.style.display
  stepper.style.marginTop = '2px'
  stylePanel.appendChild(stepper)

  let altStepper = this.createStepper(altInput, altUpdate, 1, 9)
  altStepper.style.display = altInput.style.display
  altStepper.style.marginTop = '2px'
  altStylePanel.appendChild(altStepper)

  if (!MxClient.IS_QUIRKS) {
    input.style.position = 'absolute'
    input.style.right = '32px'
    input.style.height = '15px'
    stepper.style.right = '20px'

    altInput.style.position = 'absolute'
    altInput.style.right = '32px'
    altInput.style.height = '15px'
    altStepper.style.right = '20px'
  } else {
    input.style.height = '17px'
    altInput.style.height = '17px'
  }

  MxEvent.addListener(input, 'blur', update)
  MxEvent.addListener(input, 'change', update)

  MxEvent.addListener(altInput, 'blur', altUpdate)
  MxEvent.addListener(altInput, 'change', altUpdate)

  if (MxClient.IS_QUIRKS) {
    MxUtils.br(stylePanel2)
    MxUtils.br(stylePanel2)
  }

  let edgeStyle = this.editorUi.toolbar.addMenuFunctionInContainer(
    stylePanel2,
    'geSprite-orthogonal',
    MxResources.get('waypoints'),
    false,
    MxUtils.bind(this, function(menu) {
      if (ss.style.shape !== 'arrow') {
        this.editorUi.menus
          .edgeStyleChange(
            menu,
            '',
            [
              MxConstants.STYLE_EDGE,
              MxConstants.STYLE_CURVED,
              MxConstants.STYLE_NOEDGESTYLE
            ],
            [null, null, null],
            'geIcon geSprite geSprite-straight',
            null,
            true
          )
          .setAttribute('title', MxResources.get('straight'))
        this.editorUi.menus
          .edgeStyleChange(
            menu,
            '',
            [
              MxConstants.STYLE_EDGE,
              MxConstants.STYLE_CURVED,
              MxConstants.STYLE_NOEDGESTYLE
            ],
            ['orthogonalEdgeStyle', null, null],
            'geIcon geSprite geSprite-orthogonal',
            null,
            true
          )
          .setAttribute('title', MxResources.get('orthogonal'))
        this.editorUi.menus
          .edgeStyleChange(
            menu,
            '',
            [
              MxConstants.STYLE_EDGE,
              MxConstants.STYLE_ELBOW,
              MxConstants.STYLE_CURVED,
              MxConstants.STYLE_NOEDGESTYLE
            ],
            ['elbowEdgeStyle', null, null, null],
            'geIcon geSprite geSprite-horizontalelbow',
            null,
            true
          )
          .setAttribute('title', MxResources.get('simple'))
        this.editorUi.menus
          .edgeStyleChange(
            menu,
            '',
            [
              MxConstants.STYLE_EDGE,
              MxConstants.STYLE_ELBOW,
              MxConstants.STYLE_CURVED,
              MxConstants.STYLE_NOEDGESTYLE
            ],
            ['elbowEdgeStyle', 'vertical', null, null],
            'geIcon geSprite geSprite-verticalelbow',
            null,
            true
          )
          .setAttribute('title', MxResources.get('simple'))
        this.editorUi.menus
          .edgeStyleChange(
            menu,
            '',
            [
              MxConstants.STYLE_EDGE,
              MxConstants.STYLE_ELBOW,
              MxConstants.STYLE_CURVED,
              MxConstants.STYLE_NOEDGESTYLE
            ],
            ['isometricEdgeStyle', null, null, null],
            'geIcon geSprite geSprite-horizontalisometric',
            null,
            true
          )
          .setAttribute('title', MxResources.get('isometric'))
        this.editorUi.menus
          .edgeStyleChange(
            menu,
            '',
            [
              MxConstants.STYLE_EDGE,
              MxConstants.STYLE_ELBOW,
              MxConstants.STYLE_CURVED,
              MxConstants.STYLE_NOEDGESTYLE
            ],
            ['isometricEdgeStyle', 'vertical', null, null],
            'geIcon geSprite geSprite-verticalisometric',
            null,
            true
          )
          .setAttribute('title', MxResources.get('isometric'))

        if (ss.style.shape === 'connector') {
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [
                MxConstants.STYLE_EDGE,
                MxConstants.STYLE_CURVED,
                MxConstants.STYLE_NOEDGESTYLE
              ],
              ['orthogonalEdgeStyle', '1', null],
              'geIcon geSprite geSprite-curved',
              null,
              true
            )
            .setAttribute('title', MxResources.get('curved'))
        }

        this.editorUi.menus
          .edgeStyleChange(
            menu,
            '',
            [
              MxConstants.STYLE_EDGE,
              MxConstants.STYLE_CURVED,
              MxConstants.STYLE_NOEDGESTYLE
            ],
            ['entityRelationEdgeStyle', null, null],
            'geIcon geSprite geSprite-entity',
            null,
            true
          )
          .setAttribute('title', MxResources.get('entityRelation'))
      }
    })
  )

  let lineStart = this.editorUi.toolbar.addMenuFunctionInContainer(
    stylePanel2,
    'geSprite-startclassic',
    MxResources.get('linestart'),
    false,
    MxUtils.bind(this, function(menu) {
      if (
        ss.style.shape === 'connector' ||
        ss.style.shape === 'flexArrow' ||
        ss.style.shape === 'filledEdge'
      ) {
        let item = this.editorUi.menus.edgeStyleChange(
          menu,
          '',
          [MxConstants.STYLE_STARTARROW, 'startFill'],
          [MxConstants.NONE, 0],
          'geIcon',
          null,
          false
        )
        item.setAttribute('title', MxResources.get('none'))
        item.firstChild.firstChild.innerHTML =
          '<font style="font-size:10px;">' +
          MxUtils.htmlEntities(MxResources.get('none')) +
          '</font>'

        if (ss.style.shape === 'connector' || ss.style.shape === 'filledEdge') {
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_STARTARROW, 'startFill'],
              [MxConstants.ARROW_CLASSIC, 1],
              'geIcon geSprite geSprite-startclassic',
              null,
              false
            )
            .setAttribute('title', MxResources.get('classic'))
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_STARTARROW, 'startFill'],
            [MxConstants.ARROW_CLASSIC_THIN, 1],
            'geIcon geSprite geSprite-startclassicthin',
            null,
            false
          )
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_STARTARROW, 'startFill'],
              [MxConstants.ARROW_OPEN, 0],
              'geIcon geSprite geSprite-startopen',
              null,
              false
            )
            .setAttribute('title', MxResources.get('openArrow'))
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_STARTARROW, 'startFill'],
            [MxConstants.ARROW_OPEN_THIN, 0],
            'geIcon geSprite geSprite-startopenthin',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_STARTARROW, 'startFill'],
            ['openAsync', 0],
            'geIcon geSprite geSprite-startopenasync',
            null,
            false
          )
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_STARTARROW, 'startFill'],
              [MxConstants.ARROW_BLOCK, 1],
              'geIcon geSprite geSprite-startblock',
              null,
              false
            )
            .setAttribute('title', MxResources.get('block'))
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_STARTARROW, 'startFill'],
            [MxConstants.ARROW_BLOCK_THIN, 1],
            'geIcon geSprite geSprite-startblockthin',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_STARTARROW, 'startFill'],
            ['async', 1],
            'geIcon geSprite geSprite-startasync',
            null,
            false
          )
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_STARTARROW, 'startFill'],
              [MxConstants.ARROW_OVAL, 1],
              'geIcon geSprite geSprite-startoval',
              null,
              false
            )
            .setAttribute('title', MxResources.get('oval'))
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_STARTARROW, 'startFill'],
              [MxConstants.ARROW_DIAMOND, 1],
              'geIcon geSprite geSprite-startdiamond',
              null,
              false
            )
            .setAttribute('title', MxResources.get('diamond'))
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_STARTARROW, 'startFill'],
              [MxConstants.ARROW_DIAMOND_THIN, 1],
              'geIcon geSprite geSprite-startthindiamond',
              null,
              false
            )
            .setAttribute('title', MxResources.get('diamondThin'))
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_STARTARROW, 'startFill'],
              [MxConstants.ARROW_CLASSIC, 0],
              'geIcon geSprite geSprite-startclassictrans',
              null,
              false
            )
            .setAttribute('title', MxResources.get('classic'))
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_STARTARROW, 'startFill'],
            [MxConstants.ARROW_CLASSIC_THIN, 0],
            'geIcon geSprite geSprite-startclassicthintrans',
            null,
            false
          )
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_STARTARROW, 'startFill'],
              [MxConstants.ARROW_BLOCK, 0],
              'geIcon geSprite geSprite-startblocktrans',
              null,
              false
            )
            .setAttribute('title', MxResources.get('block'))
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_STARTARROW, 'startFill'],
            [MxConstants.ARROW_BLOCK_THIN, 0],
            'geIcon geSprite geSprite-startblockthintrans',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_STARTARROW, 'startFill'],
            ['async', 0],
            'geIcon geSprite geSprite-startasynctrans',
            null,
            false
          )
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_STARTARROW, 'startFill'],
              [MxConstants.ARROW_OVAL, 0],
              'geIcon geSprite geSprite-startovaltrans',
              null,
              false
            )
            .setAttribute('title', MxResources.get('oval'))
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_STARTARROW, 'startFill'],
              [MxConstants.ARROW_DIAMOND, 0],
              'geIcon geSprite geSprite-startdiamondtrans',
              null,
              false
            )
            .setAttribute('title', MxResources.get('diamond'))
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_STARTARROW, 'startFill'],
              [MxConstants.ARROW_DIAMOND_THIN, 0],
              'geIcon geSprite geSprite-startthindiamondtrans',
              null,
              false
            )
            .setAttribute('title', MxResources.get('diamondThin'))

          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_STARTARROW, 'startFill'],
            ['dash', 0],
            'geIcon geSprite geSprite-startdash',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_STARTARROW, 'startFill'],
            ['cross', 0],
            'geIcon geSprite geSprite-startcross',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_STARTARROW, 'startFill'],
            ['circlePlus', 0],
            'geIcon geSprite geSprite-startcircleplus',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_STARTARROW, 'startFill'],
            ['circle', 1],
            'geIcon geSprite geSprite-startcircle',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_STARTARROW, 'startFill'],
            ['ERone', 0],
            'geIcon geSprite geSprite-starterone',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_STARTARROW, 'startFill'],
            ['ERmandOne', 0],
            'geIcon geSprite geSprite-starteronetoone',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_STARTARROW, 'startFill'],
            ['ERmany', 0],
            'geIcon geSprite geSprite-startermany',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_STARTARROW, 'startFill'],
            ['ERoneToMany', 0],
            'geIcon geSprite geSprite-starteronetomany',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_STARTARROW, 'startFill'],
            ['ERzeroToOne', 1],
            'geIcon geSprite geSprite-starteroneopt',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_STARTARROW, 'startFill'],
            ['ERzeroToMany', 1],
            'geIcon geSprite geSprite-startermanyopt',
            null,
            false
          )
        } else {
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_STARTARROW],
              [MxConstants.ARROW_BLOCK],
              'geIcon geSprite geSprite-startblocktrans',
              null,
              false
            )
            .setAttribute('title', MxResources.get('block'))
        }
      }
    })
  )

  let lineEnd = this.editorUi.toolbar.addMenuFunctionInContainer(
    stylePanel2,
    'geSprite-endclassic',
    MxResources.get('lineend'),
    false,
    MxUtils.bind(this, function(menu) {
      if (
        ss.style.shape === 'connector' ||
        ss.style.shape === 'flexArrow' ||
        ss.style.shape === 'filledEdge'
      ) {
        let item = this.editorUi.menus.edgeStyleChange(
          menu,
          '',
          [MxConstants.STYLE_ENDARROW, 'endFill'],
          [MxConstants.NONE, 0],
          'geIcon',
          null,
          false
        )
        item.setAttribute('title', MxResources.get('none'))
        item.firstChild.firstChild.innerHTML =
          '<font style="font-size:10px;">' +
          MxUtils.htmlEntities(MxResources.get('none')) +
          '</font>'

        if (ss.style.shape === 'connector' || ss.style.shape === 'filledEdge') {
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_ENDARROW, 'endFill'],
              [MxConstants.ARROW_CLASSIC, 1],
              'geIcon geSprite geSprite-endclassic',
              null,
              false
            )
            .setAttribute('title', MxResources.get('classic'))
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_ENDARROW, 'endFill'],
            [MxConstants.ARROW_CLASSIC_THIN, 1],
            'geIcon geSprite geSprite-endclassicthin',
            null,
            false
          )
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_ENDARROW, 'endFill'],
              [MxConstants.ARROW_OPEN, 0],
              'geIcon geSprite geSprite-endopen',
              null,
              false
            )
            .setAttribute('title', MxResources.get('openArrow'))
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_ENDARROW, 'endFill'],
            [MxConstants.ARROW_OPEN_THIN, 0],
            'geIcon geSprite geSprite-endopenthin',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_ENDARROW, 'endFill'],
            ['openAsync', 0],
            'geIcon geSprite geSprite-endopenasync',
            null,
            false
          )
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_ENDARROW, 'endFill'],
              [MxConstants.ARROW_BLOCK, 1],
              'geIcon geSprite geSprite-endblock',
              null,
              false
            )
            .setAttribute('title', MxResources.get('block'))
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_ENDARROW, 'endFill'],
            [MxConstants.ARROW_BLOCK_THIN, 1],
            'geIcon geSprite geSprite-endblockthin',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_ENDARROW, 'endFill'],
            ['async', 1],
            'geIcon geSprite geSprite-endasync',
            null,
            false
          )
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_ENDARROW, 'endFill'],
              [MxConstants.ARROW_OVAL, 1],
              'geIcon geSprite geSprite-endoval',
              null,
              false
            )
            .setAttribute('title', MxResources.get('oval'))
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_ENDARROW, 'endFill'],
              [MxConstants.ARROW_DIAMOND, 1],
              'geIcon geSprite geSprite-enddiamond',
              null,
              false
            )
            .setAttribute('title', MxResources.get('diamond'))
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_ENDARROW, 'endFill'],
              [MxConstants.ARROW_DIAMOND_THIN, 1],
              'geIcon geSprite geSprite-endthindiamond',
              null,
              false
            )
            .setAttribute('title', MxResources.get('diamondThin'))
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_ENDARROW, 'endFill'],
              [MxConstants.ARROW_CLASSIC, 0],
              'geIcon geSprite geSprite-endclassictrans',
              null,
              false
            )
            .setAttribute('title', MxResources.get('classic'))
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_ENDARROW, 'endFill'],
            [MxConstants.ARROW_CLASSIC_THIN, 0],
            'geIcon geSprite geSprite-endclassicthintrans',
            null,
            false
          )
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_ENDARROW, 'endFill'],
              [MxConstants.ARROW_BLOCK, 0],
              'geIcon geSprite geSprite-endblocktrans',
              null,
              false
            )
            .setAttribute('title', MxResources.get('block'))
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_ENDARROW, 'endFill'],
            [MxConstants.ARROW_BLOCK_THIN, 0],
            'geIcon geSprite geSprite-endblockthintrans',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_ENDARROW, 'endFill'],
            ['async', 0],
            'geIcon geSprite geSprite-endasynctrans',
            null,
            false
          )
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_ENDARROW, 'endFill'],
              [MxConstants.ARROW_OVAL, 0],
              'geIcon geSprite geSprite-endovaltrans',
              null,
              false
            )
            .setAttribute('title', MxResources.get('oval'))
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_ENDARROW, 'endFill'],
              [MxConstants.ARROW_DIAMOND, 0],
              'geIcon geSprite geSprite-enddiamondtrans',
              null,
              false
            )
            .setAttribute('title', MxResources.get('diamond'))
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_ENDARROW, 'endFill'],
              [MxConstants.ARROW_DIAMOND_THIN, 0],
              'geIcon geSprite geSprite-endthindiamondtrans',
              null,
              false
            )
            .setAttribute('title', MxResources.get('diamondThin'))

          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_ENDARROW, 'endFill'],
            ['dash', 0],
            'geIcon geSprite geSprite-enddash',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_ENDARROW, 'endFill'],
            ['cross', 0],
            'geIcon geSprite geSprite-endcross',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_ENDARROW, 'endFill'],
            ['circlePlus', 0],
            'geIcon geSprite geSprite-endcircleplus',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_ENDARROW, 'endFill'],
            ['circle', 1],
            'geIcon geSprite geSprite-endcircle',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_ENDARROW, 'endFill'],
            ['ERone', 0],
            'geIcon geSprite geSprite-enderone',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_ENDARROW, 'endFill'],
            ['ERmandOne', 0],
            'geIcon geSprite geSprite-enderonetoone',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_ENDARROW, 'endFill'],
            ['ERmany', 0],
            'geIcon geSprite geSprite-endermany',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_ENDARROW, 'endFill'],
            ['ERoneToMany', 0],
            'geIcon geSprite geSprite-enderonetomany',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_ENDARROW, 'endFill'],
            ['ERzeroToOne', 1],
            'geIcon geSprite geSprite-enderoneopt',
            null,
            false
          )
          this.editorUi.menus.edgeStyleChange(
            menu,
            '',
            [MxConstants.STYLE_ENDARROW, 'endFill'],
            ['ERzeroToMany', 1],
            'geIcon geSprite geSprite-endermanyopt',
            null,
            false
          )
        } else {
          this.editorUi.menus
            .edgeStyleChange(
              menu,
              '',
              [MxConstants.STYLE_ENDARROW],
              [MxConstants.ARROW_BLOCK],
              'geIcon geSprite geSprite-endblocktrans',
              null,
              false
            )
            .setAttribute('title', MxResources.get('block'))
        }
      }
    })
  )

  this.addArrow(edgeShape, 8)
  this.addArrow(edgeStyle)
  this.addArrow(lineStart)
  this.addArrow(lineEnd)

  let symbol = this.addArrow(pattern, 9)
  symbol.className = 'geIcon'
  symbol.style.width = '84px'

  let altSymbol = this.addArrow(altPattern, 9)
  altSymbol.className = 'geIcon'
  altSymbol.style.width = '22px'

  let solid = document.createElement('div')
  solid.style.width = '85px'
  solid.style.height = '1px'
  solid.style.borderBottom = '1px solid ' + this.defaultStrokeColor
  solid.style.marginBottom = '9px'
  symbol.appendChild(solid)

  let altSolid = document.createElement('div')
  altSolid.style.width = '23px'
  altSolid.style.height = '1px'
  altSolid.style.borderBottom = '1px solid ' + this.defaultStrokeColor
  altSolid.style.marginBottom = '9px'
  altSymbol.appendChild(altSolid)

  pattern.style.height = '15px'
  altPattern.style.height = '15px'
  edgeShape.style.height = '15px'
  edgeStyle.style.height = '17px'
  lineStart.style.marginLeft = '3px'
  lineStart.style.height = '17px'
  lineEnd.style.marginLeft = '3px'
  lineEnd.style.height = '17px'

  container.appendChild(colorPanel)
  container.appendChild(altStylePanel)
  container.appendChild(stylePanel)

  let arrowPanel = stylePanel.cloneNode(false)
  arrowPanel.style.paddingBottom = '6px'
  arrowPanel.style.paddingTop = '4px'
  arrowPanel.style.fontWeight = 'normal'

  let span = document.createElement('div')
  span.style.position = 'absolute'
  span.style.marginLeft = '3px'
  span.style.marginBottom = '12px'
  span.style.marginTop = '2px'
  span.style.fontWeight = 'normal'
  span.style.width = '76px'

  MxUtils.write(span, MxResources.get('lineend'))
  arrowPanel.appendChild(span)

  let endSpacingUpdate, endSizeUpdate
  let endSpacing = this.addUnitInput(arrowPanel, 'pt', 74, 33, function() {
    endSpacingUpdate.apply(this, arguments)
  })
  let endSize = this.addUnitInput(arrowPanel, 'pt', 20, 33, function() {
    endSizeUpdate.apply(this, arguments)
  })

  MxUtils.br(arrowPanel)

  let spacer = document.createElement('div')
  spacer.style.height = '8px'
  arrowPanel.appendChild(spacer)

  span = span.cloneNode(false)
  MxUtils.write(span, MxResources.get('linestart'))
  arrowPanel.appendChild(span)

  let startSpacingUpdate, startSizeUpdate
  let startSpacing = this.addUnitInput(arrowPanel, 'pt', 74, 33, function() {
    startSpacingUpdate.apply(this, arguments)
  })
  let startSize = this.addUnitInput(arrowPanel, 'pt', 20, 33, function() {
    startSizeUpdate.apply(this, arguments)
  })

  MxUtils.br(arrowPanel)
  this.addLabel(arrowPanel, MxResources.get('spacing'), 74, 50)
  this.addLabel(arrowPanel, MxResources.get('size'), 20, 50)
  MxUtils.br(arrowPanel)

  let perimeterPanel = colorPanel.cloneNode(false)
  perimeterPanel.style.fontWeight = 'normal'
  perimeterPanel.style.position = 'relative'
  perimeterPanel.style.paddingLeft = '16px'
  perimeterPanel.style.marginBottom = '2px'
  perimeterPanel.style.marginTop = '6px'
  perimeterPanel.style.borderWidth = '0px'
  perimeterPanel.style.paddingBottom = '18px'

  span = document.createElement('div')
  span.style.position = 'absolute'
  span.style.marginLeft = '3px'
  span.style.marginBottom = '12px'
  span.style.marginTop = '1px'
  span.style.fontWeight = 'normal'
  span.style.width = '120px'
  MxUtils.write(span, MxResources.get('perimeter'))
  perimeterPanel.appendChild(span)

  let perimeterUpdate
  let perimeterSpacing = this.addUnitInput(
    perimeterPanel,
    'pt',
    20,
    41,
    function() {
      perimeterUpdate.apply(this, arguments)
    }
  )

  if (ss.edges.length === graph.getSelectionCount()) {
    container.appendChild(stylePanel2)

    if (MxClient.IS_QUIRKS) {
      MxUtils.br(container)
      MxUtils.br(container)
    }

    container.appendChild(arrowPanel)
  } else if (ss.vertices.length === graph.getSelectionCount()) {
    if (MxClient.IS_QUIRKS) {
      MxUtils.br(container)
    }

    container.appendChild(perimeterPanel)
  }

  let listener = MxUtils.bind(this, function(sender, evt, force) {
    ss = this.format.getSelectionState()
    let color = MxUtils.getValue(ss.style, strokeKey, null) // eslint-disable-line no-unused-vars

    if (force || document.activeElement !== input) {
      let tmp = parseInt(
        MxUtils.getValue(ss.style, MxConstants.STYLE_STROKEWIDTH, 1)
      )
      input.value = isNaN(tmp) ? '' : tmp + ' pt'
    }

    if (force || document.activeElement !== altInput) {
      let tmp = parseInt(
        MxUtils.getValue(ss.style, MxConstants.STYLE_STROKEWIDTH, 1)
      )
      altInput.value = isNaN(tmp) ? '' : tmp + ' pt'
    }

    styleSelect.style.visibility =
      ss.style.shape === 'connector' || ss.style.shape === 'filledEdge'
        ? ''
        : 'hidden'

    if (MxUtils.getValue(ss.style, MxConstants.STYLE_CURVED, null) === '1') {
      styleSelect.value = 'curved'
    } else if (
      MxUtils.getValue(ss.style, MxConstants.STYLE_ROUNDED, null) === '1'
    ) {
      styleSelect.value = 'rounded'
    }

    if (MxUtils.getValue(ss.style, MxConstants.STYLE_DASHED, null) === '1') {
      if (
        MxUtils.getValue(ss.style, MxConstants.STYLE_DASH_PATTERN, null) ===
        null
      ) {
        solid.style.borderBottom = '1px dashed ' + this.defaultStrokeColor
      } else {
        solid.style.borderBottom = '1px dotted ' + this.defaultStrokeColor
      }
    } else {
      solid.style.borderBottom = '1px solid ' + this.defaultStrokeColor
    }

    altSolid.style.borderBottom = solid.style.borderBottom

    // Updates toolbar icon for edge style
    let edgeStyleDiv = edgeStyle.getElementsByTagName('div')[0]
    let es = MxUtils.getValue(ss.style, MxConstants.STYLE_EDGE, null)

    if (
      MxUtils.getValue(ss.style, MxConstants.STYLE_NOEDGESTYLE, null) === '1'
    ) {
      es = null
    }

    if (
      es === 'orthogonalEdgeStyle' &&
      MxUtils.getValue(ss.style, MxConstants.STYLE_CURVED, null) === '1'
    ) {
      edgeStyleDiv.className = 'geSprite geSprite-curved'
    } else if (es === 'straight' || es === 'none' || es === null) {
      edgeStyleDiv.className = 'geSprite geSprite-straight'
    } else if (es === 'entityRelationEdgeStyle') {
      edgeStyleDiv.className = 'geSprite geSprite-entity'
    } else if (es === 'elbowEdgeStyle') {
      edgeStyleDiv.className =
        'geSprite ' +
        (MxUtils.getValue(ss.style, MxConstants.STYLE_ELBOW, null) ===
        'vertical'
          ? 'geSprite-verticalelbow'
          : 'geSprite-horizontalelbow')
    } else if (es === 'isometricEdgeStyle') {
      edgeStyleDiv.className =
        'geSprite ' +
        (MxUtils.getValue(ss.style, MxConstants.STYLE_ELBOW, null) ===
        'vertical'
          ? 'geSprite-verticalisometric'
          : 'geSprite-horizontalisometric')
    } else {
      edgeStyleDiv.className = 'geSprite geSprite-orthogonal'
    }

    // Updates icon for edge shape
    let edgeShapeDiv = edgeShape.getElementsByTagName('div')[0]

    if (ss.style.shape === 'link') {
      edgeShapeDiv.className = 'geSprite geSprite-linkedge'
    } else if (ss.style.shape === 'flexArrow') {
      edgeShapeDiv.className = 'geSprite geSprite-arrow'
    } else if (ss.style.shape === 'arrow') {
      edgeShapeDiv.className = 'geSprite geSprite-simplearrow'
    } else {
      edgeShapeDiv.className = 'geSprite geSprite-connection'
    }

    if (ss.edges.length === graph.getSelectionCount()) {
      altStylePanel.style.display = ''
      stylePanel.style.display = 'none'
    } else {
      altStylePanel.style.display = 'none'
      stylePanel.style.display = ''
    }

    function updateArrow(marker, fill, elt, prefix) {
      let markerDiv = elt.getElementsByTagName('div')[0]

      markerDiv.className = ui.getCssClassForMarker(
        prefix,
        ss.style.shape,
        marker,
        fill
      )

      if (markerDiv.className === 'geSprite geSprite-noarrow') {
        markerDiv.innerHTML = MxUtils.htmlEntities(MxResources.get('none'))
        markerDiv.style.backgroundImage = 'none'
        markerDiv.style.verticalAlign = 'top'
        markerDiv.style.marginTop = '5px'
        markerDiv.style.fontSize = '10px'
        markerDiv.style.filter = 'none'
        markerDiv.style.color = this.defaultStrokeColor
        markerDiv.nextSibling.style.marginTop = '0px'
      }

      return markerDiv
    }

    let sourceDiv = updateArrow(
      MxUtils.getValue(ss.style, MxConstants.STYLE_STARTARROW, null),
      MxUtils.getValue(ss.style, 'startFill', '1'),
      lineStart,
      'start'
    )
    let targetDiv = updateArrow(
      MxUtils.getValue(ss.style, MxConstants.STYLE_ENDARROW, null),
      MxUtils.getValue(ss.style, 'endFill', '1'),
      lineEnd,
      'end'
    )

    // Special cases for markers
    if (ss.style.shape === 'arrow') {
      sourceDiv.className = 'geSprite geSprite-noarrow'
      targetDiv.className = 'geSprite geSprite-endblocktrans'
    } else if (ss.style.shape === 'link') {
      sourceDiv.className = 'geSprite geSprite-noarrow'
      targetDiv.className = 'geSprite geSprite-noarrow'
    }

    MxUtils.setOpacity(edgeStyle, ss.style.shape === 'arrow' ? 30 : 100)

    if (
      ss.style.shape !== 'connector' &&
      ss.style.shape !== 'flexArrow' &&
      ss.style.shape !== 'filledEdge'
    ) {
      MxUtils.setOpacity(lineStart, 30)
      MxUtils.setOpacity(lineEnd, 30)
    } else {
      MxUtils.setOpacity(lineStart, 100)
      MxUtils.setOpacity(lineEnd, 100)
    }

    if (force || document.activeElement !== startSize) {
      let tmp = parseInt(
        MxUtils.getValue(
          ss.style,
          MxConstants.STYLE_STARTSIZE,
          MxConstants.DEFAULT_MARKERSIZE
        )
      )
      startSize.value = isNaN(tmp) ? '' : tmp + ' pt'
    }

    if (force || document.activeElement !== startSpacing) {
      let tmp = parseInt(
        MxUtils.getValue(
          ss.style,
          MxConstants.STYLE_SOURCE_PERIMETER_SPACING,
          0
        )
      )
      startSpacing.value = isNaN(tmp) ? '' : tmp + ' pt'
    }

    if (force || document.activeElement !== endSize) {
      let tmp = parseInt(
        MxUtils.getValue(
          ss.style,
          MxConstants.STYLE_ENDSIZE,
          MxConstants.DEFAULT_MARKERSIZE
        )
      )
      endSize.value = isNaN(tmp) ? '' : tmp + ' pt'
    }

    if (force || document.activeElement !== startSpacing) {
      let tmp = parseInt(
        MxUtils.getValue(
          ss.style,
          MxConstants.STYLE_TARGET_PERIMETER_SPACING,
          0
        )
      )
      endSpacing.value = isNaN(tmp) ? '' : tmp + ' pt'
    }

    if (force || document.activeElement !== perimeterSpacing) {
      let tmp = parseInt(
        MxUtils.getValue(ss.style, MxConstants.STYLE_PERIMETER_SPACING, 0)
      )
      perimeterSpacing.value = isNaN(tmp) ? '' : tmp + ' pt'
    }
  })

  startSizeUpdate = this.installInputHandler(
    startSize,
    MxConstants.STYLE_STARTSIZE,
    MxConstants.DEFAULT_MARKERSIZE,
    0,
    999,
    ' pt'
  )
  startSpacingUpdate = this.installInputHandler(
    startSpacing,
    MxConstants.STYLE_SOURCE_PERIMETER_SPACING,
    0,
    -999,
    999,
    ' pt'
  )
  endSizeUpdate = this.installInputHandler(
    endSize,
    MxConstants.STYLE_ENDSIZE,
    MxConstants.DEFAULT_MARKERSIZE,
    0,
    999,
    ' pt'
  )
  endSpacingUpdate = this.installInputHandler(
    endSpacing,
    MxConstants.STYLE_TARGET_PERIMETER_SPACING,
    0,
    -999,
    999,
    ' pt'
  )
  perimeterUpdate = this.installInputHandler(
    perimeterSpacing,
    MxConstants.STYLE_PERIMETER_SPACING,
    0,
    0,
    999,
    ' pt'
  )

  this.addKeyHandler(input, listener)
  this.addKeyHandler(startSize, listener)
  this.addKeyHandler(startSpacing, listener)
  this.addKeyHandler(endSize, listener)
  this.addKeyHandler(endSpacing, listener)
  this.addKeyHandler(perimeterSpacing, listener)

  graph.getModel().addListener(MxEvent.CHANGE, listener)
  this.listeners.push({
    destroy: function() {
      graph.getModel().removeListener(listener)
    }
  })
  listener()

  return container
}

/**
 * Adds UI for configuring line jumps.
 */
StyleFormatPanel.prototype.addLineJumps = function(container) {
  let ss = this.format.getSelectionState()
  let Graph
  if (
    Graph.lineJumpsEnabled &&
    ss.edges.length > 0 &&
    ss.vertices.length === 0 &&
    ss.lineJumps
  ) {
    container.style.padding = '8px 0px 24px 18px'

    let ui = this.editorUi
    let editor = ui.editor
    let graph = editor.graph

    let span = document.createElement('div')
    span.style.position = 'absolute'
    span.style.fontWeight = 'bold'
    span.style.width = '80px'

    MxUtils.write(span, MxResources.get('lineJumps'))
    container.appendChild(span)

    let styleSelect = document.createElement('select')
    styleSelect.style.position = 'absolute'
    styleSelect.style.marginTop = '-2px'
    styleSelect.style.right = '76px'
    styleSelect.style.width = '62px'

    let styles = ['none', 'arc', 'gap', 'sharp']

    for (let i = 0; i < styles.length; i++) {
      let styleOption = document.createElement('option')
      styleOption.setAttribute('value', styles[i])
      MxUtils.write(styleOption, MxResources.get(styles[i]))
      styleSelect.appendChild(styleOption)
    }

    MxEvent.addListener(styleSelect, 'change', function(evt) {
      graph.getModel().beginUpdate()
      try {
        graph.setCellStyles(
          'jumpStyle',
          styleSelect.value,
          graph.getSelectionCells()
        )
        ui.fireEvent(
          new MxEventObject(
            'styleChanged',
            'keys',
            ['jumpStyle'],
            'values',
            [styleSelect.value],
            'cells',
            graph.getSelectionCells()
          )
        )
      } finally {
        graph.getModel().endUpdate()
      }

      MxEvent.consume(evt)
    })

    // Stops events from bubbling to color option event handler
    MxEvent.addListener(styleSelect, 'click', function(evt) {
      MxEvent.consume(evt)
    })

    container.appendChild(styleSelect)

    let jumpSizeUpdate

    let jumpSize = this.addUnitInput(container, 'pt', 22, 33, function() {
      jumpSizeUpdate.apply(this, arguments)
    })

    jumpSizeUpdate = this.installInputHandler(
      jumpSize,
      'jumpSize',
      Graph.defaultJumpSize,
      0,
      999,
      ' pt'
    )

    let listener = MxUtils.bind(this, function(sender, evt, force) {
      ss = this.format.getSelectionState()
      styleSelect.value = MxUtils.getValue(ss.style, 'jumpStyle', 'none')

      if (force || document.activeElement !== jumpSize) {
        let tmp = parseInt(
          MxUtils.getValue(ss.style, 'jumpSize', Graph.defaultJumpSize)
        )
        jumpSize.value = isNaN(tmp) ? '' : tmp + ' pt'
      }
    })

    this.addKeyHandler(jumpSize, listener)

    graph.getModel().addListener(MxEvent.CHANGE, listener)
    this.listeners.push({
      destroy: function() {
        graph.getModel().removeListener(listener)
      }
    })
    listener()
  } else {
    container.style.display = 'none'
  }

  return container
}

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addEffects = function(div) {
  let ui = this.editorUi
  let editor = ui.editor
  let graph = editor.graph
  let ss = this.format.getSelectionState()

  div.style.paddingTop = '0px'
  div.style.paddingBottom = '2px'

  let table = document.createElement('table')

  if (MxClient.IS_QUIRKS) {
    table.style.fontSize = '1em'
  }

  table.style.width = '100%'
  table.style.fontWeight = 'bold'
  table.style.paddingRight = '20px'
  let tbody = document.createElement('tbody')
  let row = document.createElement('tr')
  row.style.padding = '0px'
  let left = document.createElement('td')
  left.style.padding = '0px'
  left.style.width = '50%'
  left.setAttribute('valign', 'top')

  let right = left.cloneNode(true)
  right.style.paddingLeft = '8px'
  row.appendChild(left)
  row.appendChild(right)
  tbody.appendChild(row)
  table.appendChild(tbody)
  div.appendChild(table)

  let current = left
  let count = 0

  let addOption = MxUtils.bind(this, function(label, key, defaultValue) {
    let opt = this.createCellOption(label, key, defaultValue)
    opt.style.width = '100%'
    current.appendChild(opt)
    current = current === left ? right : left
    count++
  })

  let listener = MxUtils.bind(this, function(sender, evt, force) {
    ss = this.format.getSelectionState()

    left.innerHTML = ''
    right.innerHTML = ''
    current = left

    if (ss.rounded) {
      addOption(MxResources.get('rounded'), MxConstants.STYLE_ROUNDED, 0)
    }

    if (ss.style.shape === 'swimlane') {
      addOption(MxResources.get('divider'), 'swimlaneLine', 1)
    }

    if (!ss.containsImage) {
      addOption(MxResources.get('shadow'), MxConstants.STYLE_SHADOW, 0)
    }

    if (ss.glass) {
      addOption(MxResources.get('glass'), MxConstants.STYLE_GLASS, 0)
    }

    if (ss.comic) {
      addOption(MxResources.get('comic'), 'comic', 0)
    }

    if (count === 0) {
      div.style.display = 'none'
    }
  })

  graph.getModel().addListener(MxEvent.CHANGE, listener)
  this.listeners.push({
    destroy: function() {
      graph.getModel().removeListener(listener)
    }
  })
  listener()

  return div
}

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleFormatPanel.prototype.addStyleOps = function(div) {
  div.style.paddingTop = '10px'
  div.style.paddingBottom = '10px'

  let btn = MxUtils.button(
    MxResources.get('setAsDefaultStyle'),
    MxUtils.bind(this, function(evt) {
      this.editorUi.actions.get('setAsDefaultStyle').funct()
    })
  )

  btn.setAttribute(
    'title',
    MxResources.get('setAsDefaultStyle') +
      ' (' +
      this.editorUi.actions.get('setAsDefaultStyle').shortcut +
      ')'
  )
  btn.style.width = '202px'
  div.appendChild(btn)

  return div
}

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel = function(format, editorUi, container) {
  BaseFormatPanel.call(this, format, editorUi, container)
  this.init()
}

MxUtils.extend(DiagramFormatPanel, BaseFormatPanel)

/**
 * Switch to disable page view.
 */
DiagramFormatPanel.showPageView = true

/**
 * Specifies if the background image option should be shown. Default is true.
 */
DiagramFormatPanel.prototype.showBackgroundImageOption = true

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.init = function() {
  let ui = this.editorUi
  let editor = ui.editor
  let graph = editor.graph

  this.container.appendChild(this.addView(this.createPanel()))

  if (graph.isEnabled()) {
    this.container.appendChild(this.addOptions(this.createPanel()))
    this.container.appendChild(this.addPaperSize(this.createPanel()))
    this.container.appendChild(this.addStyleOps(this.createPanel()))
  }
}

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addView = function(div) {
  let ui = this.editorUi
  let editor = ui.editor
  let graph = editor.graph

  div.appendChild(this.createTitle(MxResources.get('view')))

  // Grid
  this.addGridOption(div)

  if (graph.isEnabled()) {
    // Page View
    if (DiagramFormatPanel.showPageView) {
      div.appendChild(
        this.createOption(
          MxResources.get('pageView'),
          function() {
            return graph.pageVisible
          },
          function(checked) {
            ui.actions.get('pageView').funct()
          },
          {
            install: function(apply) {
              this.listener = function() {
                apply(graph.pageVisible)
              }

              ui.addListener('pageViewChanged', this.listener)
            },
            destroy: function() {
              ui.removeListener(this.listener)
            }
          }
        )
      )
    }

    // Background
    let bg = this.createColorOption(
      MxResources.get('background'),
      function() {
        return graph.background
      },
      function(color) {
        let change = new ChangePageSetup(ui, color)
        change.ignoreImage = true

        graph.model.execute(change)
      },
      '#ffffff',
      {
        install: function(apply) {
          this.listener = function() {
            apply(graph.background)
          }

          ui.addListener('backgroundColorChanged', this.listener)
        },
        destroy: function() {
          ui.removeListener(this.listener)
        }
      }
    )

    if (this.showBackgroundImageOption) {
      let btn = MxUtils.button(MxResources.get('image'), function(evt) {
        ui.showBackgroundImageDialog()
        MxEvent.consume(evt)
      })

      btn.style.position = 'absolute'
      btn.className = 'geColorBtn'
      btn.style.marginTop = '-4px'
      btn.style.paddingBottom =
        document.documentMode === 11 || MxClient.IS_MT ? '0px' : '2px'
      btn.style.height = '22px'
      btn.style.right = MxClient.IS_QUIRKS ? '52px' : '72px'
      btn.style.width = '56px'

      bg.appendChild(btn)
    }

    div.appendChild(bg)
  }

  return div
}

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addOptions = function(div) {
  let ui = this.editorUi
  let editor = ui.editor
  let graph = editor.graph

  div.appendChild(this.createTitle(MxResources.get('options')))

  if (graph.isEnabled()) {
    // Connection arrows
    div.appendChild(
      this.createOption(
        MxResources.get('connectionArrows'),
        function() {
          return graph.connectionArrowsEnabled
        },
        function(checked) {
          ui.actions.get('connectionArrows').funct()
        },
        {
          install: function(apply) {
            this.listener = function() {
              apply(graph.connectionArrowsEnabled)
            }

            ui.addListener('connectionArrowsChanged', this.listener)
          },
          destroy: function() {
            ui.removeListener(this.listener)
          }
        }
      )
    )

    // Connection points
    div.appendChild(
      this.createOption(
        MxResources.get('connectionPoints'),
        function() {
          return graph.connectionHandler.isEnabled()
        },
        function(checked) {
          ui.actions.get('connectionPoints').funct()
        },
        {
          install: function(apply) {
            this.listener = function() {
              apply(graph.connectionHandler.isEnabled())
            }

            ui.addListener('connectionPointsChanged', this.listener)
          },
          destroy: function() {
            ui.removeListener(this.listener)
          }
        }
      )
    )

    // Guides
    div.appendChild(
      this.createOption(
        MxResources.get('guides'),
        function() {
          return graph.graphHandler.guidesEnabled
        },
        function(checked) {
          ui.actions.get('guides').funct()
        },
        {
          install: function(apply) {
            this.listener = function() {
              apply(graph.graphHandler.guidesEnabled)
            }

            ui.addListener('guidesEnabledChanged', this.listener)
          },
          destroy: function() {
            ui.removeListener(this.listener)
          }
        }
      )
    )
  }

  return div
}

/**
 *
 */
DiagramFormatPanel.prototype.addGridOption = function(container) {
  let ui = this.editorUi
  let graph = ui.editor.graph

  let input = document.createElement('input')
  input.style.position = 'absolute'
  input.style.textAlign = 'right'
  input.style.width = '38px'
  input.value = graph.getGridSize() + ' pt'

  let stepper = this.createStepper(input, update)
  input.style.display = graph.isGridEnabled() ? '' : 'none'
  stepper.style.display = input.style.display

  MxEvent.addListener(input, 'keydown', function(e) {
    if (e.keyCode === 13) {
      graph.container.focus()
      MxEvent.consume(e)
    } else if (e.keyCode === 27) {
      input.value = graph.getGridSize()
      graph.container.focus()
      MxEvent.consume(e)
    }
  })

  function update(evt) {
    let value = parseInt(input.value)
    value = Math.max(1, isNaN(value) ? 10 : value)

    if (value !== graph.getGridSize()) {
      graph.setGridSize(value)
    }

    input.value = value + ' pt'
    MxEvent.consume(evt)
  }

  MxEvent.addListener(input, 'blur', update)
  MxEvent.addListener(input, 'change', update)

  if (MxClient.IS_SVG) {
    input.style.marginTop = '-2px'
    input.style.right = '84px'
    stepper.style.marginTop = '-16px'
    stepper.style.right = '72px'

    let panel = this.createColorOption(
      MxResources.get('grid'),
      function() {
        let color = graph.view.gridColor

        return graph.isGridEnabled() ? color : null
      },
      function(color) {
        if (color === MxConstants.NONE) {
          graph.setGridEnabled(false)
          ui.fireEvent(new MxEventObject('gridEnabledChanged'))
        } else {
          graph.setGridEnabled(true)
          ui.setGridColor(color)
        }

        input.style.display = graph.isGridEnabled() ? '' : 'none'
        stepper.style.display = input.style.display
      },
      '#e0e0e0',
      {
        install: function(apply) {
          this.listener = function() {
            apply(graph.isGridEnabled() ? graph.view.gridColor : null)
          }

          ui.addListener('gridColorChanged', this.listener)
          ui.addListener('gridEnabledChanged', this.listener)
        },
        destroy: function() {
          ui.removeListener(this.listener)
        }
      }
    )

    panel.appendChild(input)
    panel.appendChild(stepper)
    container.appendChild(panel)
  } else {
    input.style.marginTop = '2px'
    input.style.right = '32px'
    stepper.style.marginTop = '2px'
    stepper.style.right = '20px'

    container.appendChild(input)
    container.appendChild(stepper)

    container.appendChild(
      this.createOption(
        MxResources.get('grid'),
        function() {
          return graph.isGridEnabled()
        },
        function(checked) {
          graph.setGridEnabled(checked)

          if (graph.isGridEnabled()) {
            graph.view.gridColor = '#e0e0e0'
          }

          ui.fireEvent(new MxEventObject('gridEnabledChanged'))
        },
        {
          install: function(apply) {
            this.listener = function() {
              input.style.display = graph.isGridEnabled() ? '' : 'none'
              stepper.style.display = input.style.display

              apply(graph.isGridEnabled())
            }

            ui.addListener('gridEnabledChanged', this.listener)
          },
          destroy: function() {
            ui.removeListener(this.listener)
          }
        }
      )
    )
  }
}

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addDocumentProperties = function(div) {
  // Hook for subclassers
  let ui = this.editorUi
  let editor = ui.editor
  let graph = editor.graph // eslint-disable-line no-unused-vars

  div.appendChild(this.createTitle(MxResources.get('options')))

  return div
}

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addPaperSize = function(div) {
  let ui = this.editorUi
  let editor = ui.editor
  let graph = editor.graph

  div.appendChild(this.createTitle(MxResources.get('paperSize')))

  let accessor = PageSetupDialog.addPageFormatPanel(
    div,
    'formatpanel',
    graph.pageFormat,
    function(pageFormat) {
      if (
        graph.pageFormat === null ||
        graph.pageFormat.width !== pageFormat.width ||
        graph.pageFormat.height !== pageFormat.height
      ) {
        let change = new ChangePageSetup(ui, null, null, pageFormat)
        change.ignoreColor = true
        change.ignoreImage = true

        graph.model.execute(change)
      }
    }
  )

  this.addKeyHandler(accessor.widthInput, function() {
    accessor.set(graph.pageFormat)
  })
  this.addKeyHandler(accessor.heightInput, function() {
    accessor.set(graph.pageFormat)
  })

  let listener = function() {
    accessor.set(graph.pageFormat)
  }

  ui.addListener('pageFormatChanged', listener)
  this.listeners.push({
    destroy: function() {
      ui.removeListener(listener)
    }
  })

  graph.getModel().addListener(MxEvent.CHANGE, listener)
  this.listeners.push({
    destroy: function() {
      graph.getModel().removeListener(listener)
    }
  })

  return div
}

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.addStyleOps = function(div) {
  let btn = MxUtils.button(
    MxResources.get('editData'),
    MxUtils.bind(this, function(evt) {
      this.editorUi.actions.get('editData').funct()
    })
  )

  btn.setAttribute(
    'title',
    MxResources.get('editData') +
      ' (' +
      this.editorUi.actions.get('editData').shortcut +
      ')'
  )
  btn.style.width = '202px'
  btn.style.marginBottom = '2px'
  div.appendChild(btn)

  MxUtils.br(div)

  btn = MxUtils.button(
    MxResources.get('clearDefaultStyle'),
    MxUtils.bind(this, function(evt) {
      this.editorUi.actions.get('clearDefaultStyle').funct()
    })
  )

  btn.setAttribute(
    'title',
    MxResources.get('clearDefaultStyle') +
      ' (' +
      this.editorUi.actions.get('clearDefaultStyle').shortcut +
      ')'
  )
  btn.style.width = '202px'
  div.appendChild(btn)

  return div
}

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramFormatPanel.prototype.destroy = function() {
  BaseFormatPanel.prototype.destroy.apply(this, arguments)

  if (this.gridEnabledListener) {
    this.editorUi.removeListener(this.gridEnabledListener)
    this.gridEnabledListener = null
  }
}
