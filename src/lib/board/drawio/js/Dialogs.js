/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new open dialog.
 */
import MxClient from '../../mxGraph/MxClient'
import { OpenFile, Editor } from '../../Editor'
import Jscolor from '../jscolor/jscolor'
import Dialog from '../../Dialog'
import MxEvent from '../../mxGraph/util/MxEvent'
import MxResources from '../../mxGraph/util/MxResources'
import MxUtils from '../../mxGraph/util/MxUtils'
import MxEventObject from '../../mxGraph/util/MxEventObject'
import Graph from '../js/Graph'
import MxGraphModel from '../../mxGraph/model/MxGraphModel'
import MxCodec from '../../mxGraph/io/MxCodec'
import MxConstants from '../../mxGraph/util/MxConstants'
import MxXmlCanvas2D from '../../mxGraph/util/MxXmlCanvas2D'
import MxImageExport from '../../mxGraph/util/MxImageExport'
import MxXmlRequest from '../../mxGraph/util/MxXmlRequest'
import MxForm from '../../mxGraph/util/MxForm'
import MxWindow from '../../mxGraph/util/MxWindow'
import EditorUi from '../js/EditorUi'
import MxCell from '../../mxGraph/model/MxCell'

export class OpenDialog {
  constructor() {
    let iframe = document.createElement('iframe')
    iframe.style.backgroundColor = 'transparent'
    iframe.allowTransparency = 'true'
    iframe.style.borderStyle = 'none'
    iframe.style.borderWidth = '0px'
    iframe.style.overflow = 'hidden'
    iframe.frameBorder = '0'

    // Adds padding as a workaround for box model in older IE versions
    let dx =
      MxClient.IS_VML &&
      (document.documentMode === null || document.documentMode < 8)
        ? 20
        : 0

    iframe.setAttribute(
      'width',
      (Editor.useLocalStorage ? 640 : 320) + dx + 'px'
    )
    iframe.setAttribute(
      'height',
      (Editor.useLocalStorage ? 480 : 220) + dx + 'px'
    )
    iframe.setAttribute('src', window.OPEN_FORM)

    this.container = iframe
  }
}

/**
 * Constructs a new color dialog.
 */
export class ColorDialog {
  constructor(editorUi, color, apply, cancelFn) {
    this.editorUi = editorUi

    let input = document.createElement('input')
    input.style.marginBottom = '10px'
    input.style.width = '216px'

    // Required for picker to render in IE
    if (MxClient.IS_IE) {
      input.style.marginTop = '10px'
      document.body.appendChild(input)
    }

    this.init = function() {
      if (!MxClient.IS_TOUCH) {
        input.focus()
      }
    }

    let picker = new Jscolor.Color(input)
    picker.pickerOnfocus = false
    picker.showPicker()

    let div = document.createElement('div')
    Jscolor.picker.box.style.position = 'relative'
    Jscolor.picker.box.style.width = '230px'
    Jscolor.picker.box.style.height = '100px'
    Jscolor.picker.box.style.paddingBottom = '10px'
    div.appendChild(Jscolor.picker.box)

    let center = document.createElement('center')

    function createRecentColorTable() {
      let table = addPresets(
        ColorDialog.recentColors.length === 0
          ? ['FFFFFF']
          : ColorDialog.recentColors,
        11,
        'FFFFFF',
        true
      )
      table.style.marginBottom = '8px'

      return table
    }

    function addPresets(presets, rowLength, defaultColor, addResetOption) {
      rowLength = rowLength !== null ? rowLength : 12
      let table = document.createElement('table')
      table.style.borderCollapse = 'collapse'
      table.setAttribute('cellspacing', '0')
      table.style.marginBottom = '20px'
      table.style.cellSpacing = '0px'
      let tbody = document.createElement('tbody')
      table.appendChild(tbody)

      let rows = presets.length / rowLength

      for (let row = 0; row < rows; row++) {
        var tr = document.createElement('tr')

        for (let i = 0; i < rowLength; i++) {
          ;(function(clr) {
            let td = document.createElement('td')
            td.style.border = '1px solid black'
            td.style.padding = '0px'
            td.style.width = '16px'
            td.style.height = '16px'

            if (clr === null) {
              clr = defaultColor
            }

            if (clr === 'none') {
              td.style.background =
                "url('" + Dialog.prototype.noColorImage + "')"
            } else {
              td.style.backgroundColor = '#' + clr
            }

            tr.appendChild(td)

            if (clr !== null) {
              td.style.cursor = 'pointer'

              MxEvent.addListener(td, 'click', function() {
                if (clr === 'none') {
                  picker.fromString('ffffff')
                  input.value = 'none'
                } else {
                  picker.fromString(clr)
                }
              })
            }
          })(presets[row * rowLength + i])
        }

        tbody.appendChild(tr)
      }

      if (addResetOption) {
        let td = document.createElement('td')
        td.setAttribute('title', MxResources.get('reset'))
        td.style.border = '1px solid black'
        td.style.padding = '0px'
        td.style.width = '16px'
        td.style.height = '16px'
        td.style.backgroundImage = "url('" + Dialog.prototype.closeImage + "')"
        td.style.backgroundPosition = 'center center'
        td.style.backgroundRepeat = 'no-repeat'
        td.style.cursor = 'pointer'

        tr.appendChild(td)

        MxEvent.addListener(td, 'click', function() {
          ColorDialog.resetRecentColors()
          table.parentNode.replaceChild(createRecentColorTable(), table)
        })
      }

      center.appendChild(table)

      return table
    }

    div.appendChild(input)
    MxUtils.br(div)

    // Adds recent colors
    createRecentColorTable()

    // Adds presets
    let table = addPresets(this.presetColors)
    table.style.marginBottom = '8px'
    table = addPresets(this.defaultColors)
    table.style.marginBottom = '16px'

    div.appendChild(center)

    let buttons = document.createElement('div')
    buttons.style.textAlign = 'right'
    buttons.style.whiteSpace = 'nowrap'

    let cancelBtn = MxUtils.button(MxResources.get('cancel'), function() {
      editorUi.hideDialog()

      if (cancelFn !== null) {
        cancelFn()
      }
    })
    cancelBtn.className = 'geBtn'

    if (editorUi.editor.cancelFirst) {
      buttons.appendChild(cancelBtn)
    }

    let applyFunction = apply !== null ? apply : this.createApplyFunction()

    let applyBtn = MxUtils.button(MxResources.get('apply'), function() {
      let color = input.value
      ColorDialog.addRecentColor(color, 12)

      if (color !== 'none' && color.charAt(0) !== '#') {
        color = '#' + color
      }

      applyFunction(color)
      editorUi.hideDialog()
    })
    applyBtn.className = 'geBtn gePrimaryBtn'
    buttons.appendChild(applyBtn)

    if (!editorUi.editor.cancelFirst) {
      buttons.appendChild(cancelBtn)
    }

    if (color !== null) {
      if (color === 'none') {
        picker.fromString('ffffff')
        input.value = 'none'
      } else {
        picker.fromString(color)
      }
    }

    div.appendChild(buttons)
    this.picker = picker
    this.colorInput = input

    // LATER: Only fires if input if focused, should always
    // fire if this dialog is showing.
    MxEvent.addListener(div, 'keydown', function(e) {
      if (e.keyCode === 27) {
        editorUi.hideDialog()

        if (cancelFn !== null) {
          cancelFn()
        }

        MxEvent.consume(e)
      }
    })

    this.container = div
  }
}

/**
 * Creates function to apply value
 */
ColorDialog.prototype.presetColors = [
  'E6D0DE',
  'CDA2BE',
  'B5739D',
  'E1D5E7',
  'C3ABD0',
  'A680B8',
  'D4E1F5',
  'A9C4EB',
  '7EA6E0',
  'D5E8D4',
  '9AC7BF',
  '67AB9F',
  'D5E8D4',
  'B9E0A5',
  '97D077',
  'FFF2CC',
  'FFE599',
  'FFD966',
  'FFF4C3',
  'FFCE9F',
  'FFB570',
  'F8CECC',
  'F19C99',
  'EA6B66'
]

/**
 * Creates function to apply value
 */
ColorDialog.prototype.defaultColors = [
  'none',
  'FFFFFF',
  'E6E6E6',
  'CCCCCC',
  'B3B3B3',
  '999999',
  '808080',
  '666666',
  '4D4D4D',
  '333333',
  '1A1A1A',
  '000000',
  'FFCCCC',
  'FFE6CC',
  'FFFFCC',
  'E6FFCC',
  'CCFFCC',
  'CCFFE6',
  'CCFFFF',
  'CCE5FF',
  'CCCCFF',
  'E5CCFF',
  'FFCCFF',
  'FFCCE6',
  'FF9999',
  'FFCC99',
  'FFFF99',
  'CCFF99',
  '99FF99',
  '99FFCC',
  '99FFFF',
  '99CCFF',
  '9999FF',
  'CC99FF',
  'FF99FF',
  'FF99CC',
  'FF6666',
  'FFB366',
  'FFFF66',
  'B3FF66',
  '66FF66',
  '66FFB3',
  '66FFFF',
  '66B2FF',
  '6666FF',
  'B266FF',
  'FF66FF',
  'FF66B3',
  'FF3333',
  'FF9933',
  'FFFF33',
  '99FF33',
  '33FF33',
  '33FF99',
  '33FFFF',
  '3399FF',
  '3333FF',
  '9933FF',
  'FF33FF',
  'FF3399',
  'FF0000',
  'FF8000',
  'FFFF00',
  '80FF00',
  '00FF00',
  '00FF80',
  '00FFFF',
  '007FFF',
  '0000FF',
  '7F00FF',
  'FF00FF',
  'FF0080',
  'CC0000',
  'CC6600',
  'CCCC00',
  '66CC00',
  '00CC00',
  '00CC66',
  '00CCCC',
  '0066CC',
  '0000CC',
  '6600CC',
  'CC00CC',
  'CC0066',
  '990000',
  '994C00',
  '999900',
  '4D9900',
  '009900',
  '00994D',
  '009999',
  '004C99',
  '000099',
  '4C0099',
  '990099',
  '99004D',
  '660000',
  '663300',
  '666600',
  '336600',
  '006600',
  '006633',
  '006666',
  '003366',
  '000066',
  '330066',
  '660066',
  '660033',
  '330000',
  '331A00',
  '333300',
  '1A3300',
  '003300',
  '00331A',
  '003333',
  '001933',
  '000033',
  '190033',
  '330033',
  '33001A'
]

/**
 * Creates function to apply value
 */
ColorDialog.prototype.createApplyFunction = function() {
  return MxUtils.bind(this, function(color) {
    let graph = this.editorUi.editor.graph

    graph.getModel().beginUpdate()
    try {
      graph.setCellStyles(this.currentColorKey, color)
      this.editorUi.fireEvent(
        new MxEventObject(
          'styleChanged',
          'keys',
          [this.currentColorKey],
          'values',
          [color],
          'cells',
          graph.getSelectionCells()
        )
      )
    } finally {
      graph.getModel().endUpdate()
    }
  })
}

/**
 *
 */
ColorDialog.recentColors = []

/**
 * Adds recent color for later use.
 */
ColorDialog.addRecentColor = function(color, max) {
  if (color !== null) {
    MxUtils.remove(color, ColorDialog.recentColors)
    ColorDialog.recentColors.splice(0, 0, color)

    if (ColorDialog.recentColors.length >= max) {
      ColorDialog.recentColors.pop()
    }
  }
}

/**
 * Adds recent color for later use.
 */
ColorDialog.resetRecentColors = function() {
  ColorDialog.recentColors = []
}

/**
 * Constructs a new about dialog.
 */
export class AboutDialog {
  constructor(editorUi) {
    let div = document.createElement('div')
    div.setAttribute('align', 'center')
    let h3 = document.createElement('h3')
    MxUtils.write(h3, MxResources.get('about') + ' GraphEditor')
    div.appendChild(h3)
    let img = document.createElement('img')
    img.style.border = '0px'
    img.setAttribute('width', '176')
    img.setAttribute('width', '151')
    img.setAttribute('src', IMAGE_PATH + '/logo.png')
    div.appendChild(img)
    MxUtils.br(div)
    MxUtils.write(div, 'Powered by mxGraph ' + MxClient.VERSION)
    MxUtils.br(div)
    let link = document.createElement('a')
    link.setAttribute('href', 'http://www.jgraph.com/')
    link.setAttribute('target', '_blank')
    MxUtils.write(link, 'www.jgraph.com')
    div.appendChild(link)
    MxUtils.br(div)
    MxUtils.br(div)
    let closeBtn = MxUtils.button(MxResources.get('close'), function() {
      editorUi.hideDialog()
    })
    closeBtn.className = 'geBtn gePrimaryBtn'
    div.appendChild(closeBtn)

    this.container = div
  }
}

/**
 * Constructs a new filename dialog.
 */
export class FilenameDialog {
  constructor(
    editorUi,
    filename,
    buttonText,
    fn,
    label,
    validateFn,
    content,
    helpLink,
    closeOnBtn,
    cancelFn
  ) {
    closeOnBtn = closeOnBtn !== null ? closeOnBtn : true
    let row, td

    let table = document.createElement('table')
    let tbody = document.createElement('tbody')
    table.style.marginTop = '8px'

    row = document.createElement('tr')

    td = document.createElement('td')
    td.style.whiteSpace = 'nowrap'
    td.style.fontSize = '10pt'
    td.style.width = '120px'
    MxUtils.write(td, (label || MxResources.get('filename')) + ':')

    row.appendChild(td)

    let nameInput = document.createElement('input')
    nameInput.setAttribute('value', filename || '')
    nameInput.style.marginLeft = '4px'
    nameInput.style.width = '180px'

    let genericBtn = MxUtils.button(buttonText, function() {
      if (validateFn === null || validateFn(nameInput.value)) {
        if (closeOnBtn) {
          editorUi.hideDialog()
        }

        fn(nameInput.value)
      }
    })
    genericBtn.className = 'geBtn gePrimaryBtn'

    this.init = function() {
      if (label === null && content !== null) {
        return
      }

      nameInput.focus()

      if (
        MxClient.IS_GC ||
        MxClient.IS_FF ||
        document.documentMode >= 5 ||
        MxClient.IS_QUIRKS
      ) {
        nameInput.select()
      } else {
        document.execCommand('selectAll', false, null)
      }

      // Installs drag and drop handler for links
      if (Graph.fileSupport) {
        // Setup the dnd listeners
        let dlg = table.parentNode
        // let graph = editorUi.editor.graph
        let dropElt = null

        MxEvent.addListener(dlg, 'dragleave', function(evt) {
          if (dropElt !== null) {
            dropElt.style.backgroundColor = ''
            dropElt = null
          }

          evt.stopPropagation()
          evt.preventDefault()
        })

        MxEvent.addListener(
          dlg,
          'dragover',
          MxUtils.bind(this, function(evt) {
            // IE 10 does not implement pointer-events so it can't have a drop highlight
            if (
              dropElt === null &&
              (!MxClient.IS_IE || document.documentMode > 10)
            ) {
              dropElt = nameInput
              dropElt.style.backgroundColor = '#ebf2f9'
            }

            evt.stopPropagation()
            evt.preventDefault()
          })
        )

        MxEvent.addListener(
          dlg,
          'drop',
          MxUtils.bind(this, function(evt) {
            if (dropElt !== null) {
              dropElt.style.backgroundColor = ''
              dropElt = null
            }

            if (MxUtils.indexOf(evt.dataTransfer.types, 'text/uri-list') >= 0) {
              nameInput.value = decodeURIComponent(
                evt.dataTransfer.getData('text/uri-list')
              )
              genericBtn.click()
            }

            evt.stopPropagation()
            evt.preventDefault()
          })
        )
      }
    }

    td = document.createElement('td')
    td.appendChild(nameInput)
    row.appendChild(td)

    if (label !== null || content === null) {
      tbody.appendChild(row)
    }

    if (content !== null) {
      row = document.createElement('tr')
      td = document.createElement('td')
      td.colSpan = 2
      td.appendChild(content)
      row.appendChild(td)
      tbody.appendChild(row)
    }

    row = document.createElement('tr')
    td = document.createElement('td')
    td.colSpan = 2
    td.style.paddingTop = '20px'
    td.style.whiteSpace = 'nowrap'
    td.setAttribute('align', 'right')

    let cancelBtn = MxUtils.button(MxResources.get('cancel'), function() {
      editorUi.hideDialog()

      if (cancelFn !== null) {
        cancelFn()
      }
    })
    cancelBtn.className = 'geBtn'

    if (editorUi.editor.cancelFirst) {
      td.appendChild(cancelBtn)
    }

    if (helpLink !== null) {
      let helpBtn = MxUtils.button(MxResources.get('help'), function() {
        window.open(helpLink)
      })

      helpBtn.className = 'geBtn'
      td.appendChild(helpBtn)
    }

    MxEvent.addListener(nameInput, 'keypress', function(e) {
      if (e.keyCode === 13) {
        genericBtn.click()
      }
    })

    td.appendChild(genericBtn)

    if (!editorUi.editor.cancelFirst) {
      td.appendChild(cancelBtn)
    }

    row.appendChild(td)
    tbody.appendChild(row)
    table.appendChild(tbody)

    this.container = table
  }
}

/**
 * Constructs a new textarea dialog.
 */
export class TextareaDialog {
  constructor(
    editorUi,
    title,
    url,
    fn,
    cancelFn,
    cancelTitle,
    w,
    h,
    addButtons,
    noHide,
    noWrap,
    applyTitle
  ) {
    w = w !== null ? w : 300
    h = h !== null ? h : 120
    noHide = noHide !== null ? noHide : false
    let row, td

    let table = document.createElement('table')
    let tbody = document.createElement('tbody')

    row = document.createElement('tr')

    td = document.createElement('td')
    td.style.fontSize = '10pt'
    td.style.width = '100px'
    MxUtils.write(td, title)

    row.appendChild(td)
    tbody.appendChild(row)

    row = document.createElement('tr')
    td = document.createElement('td')

    let nameInput = document.createElement('textarea')

    if (noWrap) {
      nameInput.setAttribute('wrap', 'off')
    }

    nameInput.setAttribute('spellcheck', 'false')
    nameInput.setAttribute('autocorrect', 'off')
    nameInput.setAttribute('autocomplete', 'off')
    nameInput.setAttribute('autocapitalize', 'off')

    MxUtils.write(nameInput, url || '')
    nameInput.style.resize = 'none'
    nameInput.style.width = w + 'px'
    nameInput.style.height = h + 'px'

    this.textarea = nameInput

    this.init = function() {
      nameInput.focus()
      nameInput.scrollTop = 0
    }

    td.appendChild(nameInput)
    row.appendChild(td)

    tbody.appendChild(row)

    row = document.createElement('tr')
    td = document.createElement('td')
    td.style.paddingTop = '14px'
    td.style.whiteSpace = 'nowrap'
    td.setAttribute('align', 'right')

    let cancelBtn = MxUtils.button(
      cancelTitle || MxResources.get('cancel'),
      function() {
        editorUi.hideDialog()

        if (cancelFn !== null) {
          cancelFn()
        }
      }
    )
    cancelBtn.className = 'geBtn'

    if (editorUi.editor.cancelFirst) {
      td.appendChild(cancelBtn)
    }

    if (addButtons !== null) {
      addButtons(td)
    }

    if (fn !== null) {
      let genericBtn = MxUtils.button(
        applyTitle || MxResources.get('apply'),
        function() {
          if (!noHide) {
            editorUi.hideDialog()
          }

          fn(nameInput.value)
        }
      )

      genericBtn.className = 'geBtn gePrimaryBtn'
      td.appendChild(genericBtn)
    }

    if (!editorUi.editor.cancelFirst) {
      td.appendChild(cancelBtn)
    }

    row.appendChild(td)
    tbody.appendChild(row)
    table.appendChild(tbody)
    this.container = table
  }
}

/**
 * Constructs a new edit file dialog.
 */
export class EditDiagramDialog {
  constructor(editorUi) {
    let div = document.createElement('div')
    div.style.textAlign = 'right'
    let textarea = document.createElement('textarea')
    textarea.setAttribute('wrap', 'off')
    textarea.setAttribute('spellcheck', 'false')
    textarea.setAttribute('autocorrect', 'off')
    textarea.setAttribute('autocomplete', 'off')
    textarea.setAttribute('autocapitalize', 'off')
    textarea.style.overflow = 'auto'
    textarea.style.resize = 'none'
    textarea.style.width = '600px'
    textarea.style.height = '360px'
    textarea.style.marginBottom = '16px'

    textarea.value = MxUtils.getPrettyXml(editorUi.editor.getGraphXml())
    div.appendChild(textarea)

    this.init = function() {
      textarea.focus()
    }

    // 移出函数1
    function handleDrop(evt) {
      evt.stopPropagation()
      evt.preventDefault()

      if (evt.dataTransfer.files.length > 0) {
        let file = evt.dataTransfer.files[0]
        let reader = new FileReader()

        reader.onload = function(e) {
          textarea.value = e.target.result
        }

        reader.readAsText(file)
      } else {
        textarea.value = editorUi.extractGraphModelFromEvent(evt)
      }
    }
    // 移出函数2
    function handleDragOver(evt) {
      evt.stopPropagation()
      evt.preventDefault()
    }
    // Enables dropping files
    if (Graph.fileSupport) {
      // 被移出函数位置1
      // 被移出函数位置2
      handleDrop() // 新修改方法1
      handleDragOver() // 新修改方法1
      // Setup the dnd listeners.
      textarea.addEventListener('dragover', handleDragOver, false)
      textarea.addEventListener('drop', handleDrop, false)
    }

    let cancelBtn = MxUtils.button(MxResources.get('cancel'), function() {
      editorUi.hideDialog()
    })
    cancelBtn.className = 'geBtn'

    if (editorUi.editor.cancelFirst) {
      div.appendChild(cancelBtn)
    }

    let select = document.createElement('select')
    select.style.width = '180px'
    select.className = 'geBtn'

    if (editorUi.editor.graph.isEnabled()) {
      let replaceOption = document.createElement('option')
      replaceOption.setAttribute('value', 'replace')
      MxUtils.write(replaceOption, MxResources.get('replaceExistingDrawing'))
      select.appendChild(replaceOption)
    }

    let newOption = document.createElement('option')
    newOption.setAttribute('value', 'new')
    MxUtils.write(newOption, MxResources.get('openInNewWindow'))

    if (EditDiagramDialog.showNewWindowOption) {
      select.appendChild(newOption)
    }

    if (editorUi.editor.graph.isEnabled()) {
      let importOption = document.createElement('option')
      importOption.setAttribute('value', 'import')
      MxUtils.write(importOption, MxResources.get('addToExistingDrawing'))
      select.appendChild(importOption)
    }

    div.appendChild(select)

    let okBtn = MxUtils.button(MxResources.get('ok'), function() {
      // Removes all illegal control characters before parsing
      let data = editorUi.editor.graph.zapGremlins(MxUtils.trim(textarea.value))
      let error = null

      if (select.value === 'new') {
        window.openFile = new OpenFile(function() {
          editorUi.hideDialog()
          window.openFile = null
        })

        window.openFile.setData(data, null)
        window.open(editorUi.getUrl())
      } else if (select.value === 'replace') {
        editorUi.editor.graph.model.beginUpdate()
        try {
          editorUi.editor.setGraphXml(MxUtils.parseXml(data).documentElement)
          // LATER: Why is hideDialog between begin-/endUpdate faster?
          editorUi.hideDialog()
        } catch (e) {
          error = e
        } finally {
          editorUi.editor.graph.model.endUpdate()
        }
      } else if (select.value === 'import') {
        editorUi.editor.graph.model.beginUpdate()
        try {
          let doc = MxUtils.parseXml(data)
          let model = new MxGraphModel()
          let codec = new MxCodec(doc)
          codec.decode(doc.documentElement, model)

          let children = model.getChildren(model.getChildAt(model.getRoot(), 0))
          editorUi.editor.graph.setSelectionCells(
            editorUi.editor.graph.importCells(children)
          )

          // LATER: Why is hideDialog between begin-/endUpdate faster?
          editorUi.hideDialog()
        } catch (e) {
          error = e
        } finally {
          editorUi.editor.graph.model.endUpdate()
        }
      }

      if (error !== null) {
        MxUtils.alert(error.message)
      }
    })
    okBtn.className = 'geBtn gePrimaryBtn'
    div.appendChild(okBtn)

    if (!editorUi.editor.cancelFirst) {
      div.appendChild(cancelBtn)
    }

    this.container = div
  }
}

/**
 *
 */
EditDiagramDialog.showNewWindowOption = true

/**
 * Constructs a new export dialog.
 */
export class ExportDialog {
  constructor(editorUi) {
    let graph = editorUi.editor.graph
    let bounds = graph.getGraphBounds()
    let scale = graph.view.scale

    let width = Math.ceil(bounds.width / scale)
    let height = Math.ceil(bounds.height / scale)

    let row, td

    let table = document.createElement('table')
    let tbody = document.createElement('tbody')
    table.setAttribute('cellpadding', MxClient.IS_SF ? '0' : '2')

    row = document.createElement('tr')

    td = document.createElement('td')
    td.style.fontSize = '10pt'
    td.style.width = '100px'
    MxUtils.write(td, MxResources.get('filename') + ':')

    row.appendChild(td)

    let nameInput = document.createElement('input')
    nameInput.setAttribute('value', editorUi.editor.getOrCreateFilename())
    nameInput.style.width = '180px'

    td = document.createElement('td')
    td.appendChild(nameInput)
    row.appendChild(td)

    tbody.appendChild(row)

    row = document.createElement('tr')

    td = document.createElement('td')
    td.style.fontSize = '10pt'
    MxUtils.write(td, MxResources.get('format') + ':')

    row.appendChild(td)

    let imageFormatSelect = document.createElement('select')
    imageFormatSelect.style.width = '180px'

    let pngOption = document.createElement('option')
    pngOption.setAttribute('value', 'png')
    MxUtils.write(pngOption, MxResources.get('formatPng'))
    imageFormatSelect.appendChild(pngOption)

    let gifOption = document.createElement('option')

    if (ExportDialog.showGifOption) {
      gifOption.setAttribute('value', 'gif')
      MxUtils.write(gifOption, MxResources.get('formatGif'))
      imageFormatSelect.appendChild(gifOption)
    }

    let jpgOption = document.createElement('option')
    jpgOption.setAttribute('value', 'jpg')
    MxUtils.write(jpgOption, MxResources.get('formatJpg'))
    imageFormatSelect.appendChild(jpgOption)

    let pdfOption = document.createElement('option')
    pdfOption.setAttribute('value', 'pdf')
    MxUtils.write(pdfOption, MxResources.get('formatPdf'))
    imageFormatSelect.appendChild(pdfOption)

    let svgOption = document.createElement('option')
    svgOption.setAttribute('value', 'svg')
    MxUtils.write(svgOption, MxResources.get('formatSvg'))
    imageFormatSelect.appendChild(svgOption)

    if (ExportDialog.showXmlOption) {
      let xmlOption = document.createElement('option')
      xmlOption.setAttribute('value', 'xml')
      MxUtils.write(xmlOption, MxResources.get('formatXml'))
      imageFormatSelect.appendChild(xmlOption)
    }

    td = document.createElement('td')
    td.appendChild(imageFormatSelect)
    row.appendChild(td)

    tbody.appendChild(row)

    row = document.createElement('tr')

    td = document.createElement('td')
    td.style.fontSize = '10pt'
    MxUtils.write(td, MxResources.get('zoom') + ' (%):')

    row.appendChild(td)

    let zoomInput = document.createElement('input')
    zoomInput.setAttribute('type', 'number')
    zoomInput.setAttribute('value', '100')
    zoomInput.style.width = '180px'

    td = document.createElement('td')
    td.appendChild(zoomInput)
    row.appendChild(td)

    tbody.appendChild(row)

    row = document.createElement('tr')

    td = document.createElement('td')
    td.style.fontSize = '10pt'
    MxUtils.write(td, MxResources.get('width') + ':')

    row.appendChild(td)

    let widthInput = document.createElement('input')
    widthInput.setAttribute('value', width)
    widthInput.style.width = '180px'

    td = document.createElement('td')
    td.appendChild(widthInput)
    row.appendChild(td)

    tbody.appendChild(row)

    row = document.createElement('tr')

    td = document.createElement('td')
    td.style.fontSize = '10pt'
    MxUtils.write(td, MxResources.get('height') + ':')

    row.appendChild(td)

    let heightInput = document.createElement('input')
    heightInput.setAttribute('value', height)
    heightInput.style.width = '180px'

    td = document.createElement('td')
    td.appendChild(heightInput)
    row.appendChild(td)

    tbody.appendChild(row)

    row = document.createElement('tr')

    td = document.createElement('td')
    td.style.fontSize = '10pt'
    MxUtils.write(td, MxResources.get('background') + ':')

    row.appendChild(td)

    let transparentCheckbox = document.createElement('input')
    transparentCheckbox.setAttribute('type', 'checkbox')
    transparentCheckbox.checked =
      graph.background === null || graph.background === MxConstants.NONE

    td = document.createElement('td')
    td.appendChild(transparentCheckbox)
    MxUtils.write(td, MxResources.get('transparent'))

    row.appendChild(td)

    tbody.appendChild(row)

    row = document.createElement('tr')

    td = document.createElement('td')
    td.style.fontSize = '10pt'
    MxUtils.write(td, MxResources.get('borderWidth') + ':')

    row.appendChild(td)

    let borderInput = document.createElement('input')
    borderInput.setAttribute('type', 'number')
    borderInput.setAttribute('value', ExportDialog.lastBorderValue)
    borderInput.style.width = '180px'

    td = document.createElement('td')
    td.appendChild(borderInput)
    row.appendChild(td)

    tbody.appendChild(row)
    table.appendChild(tbody)

    // Handles changes in the export format
    function formatChanged() {
      let name = nameInput.value
      let dot = name.lastIndexOf('.')

      if (dot > 0) {
        nameInput.value = name.substring(0, dot + 1) + imageFormatSelect.value
      } else {
        nameInput.value = name + '.' + imageFormatSelect.value
      }

      if (imageFormatSelect.value === 'xml') {
        zoomInput.setAttribute('disabled', 'true')
        widthInput.setAttribute('disabled', 'true')
        heightInput.setAttribute('disabled', 'true')
        borderInput.setAttribute('disabled', 'true')
      } else {
        zoomInput.removeAttribute('disabled')
        widthInput.removeAttribute('disabled')
        heightInput.removeAttribute('disabled')
        borderInput.removeAttribute('disabled')
      }

      if (
        imageFormatSelect.value === 'png' ||
        imageFormatSelect.value === 'svg'
      ) {
        transparentCheckbox.removeAttribute('disabled')
      } else {
        transparentCheckbox.setAttribute('disabled', 'disabled')
      }
    }

    MxEvent.addListener(imageFormatSelect, 'change', formatChanged)
    formatChanged()

    function checkValues() {
      if (
        widthInput.value * heightInput.value > MAX_AREA ||
        widthInput.value <= 0
      ) {
        widthInput.style.backgroundColor = 'red'
      } else {
        widthInput.style.backgroundColor = ''
      }

      if (
        widthInput.value * heightInput.value > MAX_AREA ||
        heightInput.value <= 0
      ) {
        heightInput.style.backgroundColor = 'red'
      } else {
        heightInput.style.backgroundColor = ''
      }
    }

    MxEvent.addListener(zoomInput, 'change', function() {
      let s = Math.max(0, parseFloat(zoomInput.value) || 100) / 100
      zoomInput.value = parseFloat((s * 100).toFixed(2))

      if (width > 0) {
        widthInput.value = Math.floor(width * s)
        heightInput.value = Math.floor(height * s)
      } else {
        zoomInput.value = '100'
        widthInput.value = width
        heightInput.value = height
      }

      checkValues()
    })

    MxEvent.addListener(widthInput, 'change', function() {
      let s = parseInt(widthInput.value) / width

      if (s > 0) {
        zoomInput.value = parseFloat((s * 100).toFixed(2))
        heightInput.value = Math.floor(height * s)
      } else {
        zoomInput.value = '100'
        widthInput.value = width
        heightInput.value = height
      }

      checkValues()
    })

    MxEvent.addListener(heightInput, 'change', function() {
      let s = parseInt(heightInput.value) / height

      if (s > 0) {
        zoomInput.value = parseFloat((s * 100).toFixed(2))
        widthInput.value = Math.floor(width * s)
      } else {
        zoomInput.value = '100'
        widthInput.value = width
        heightInput.value = height
      }

      checkValues()
    })

    row = document.createElement('tr')
    td = document.createElement('td')
    td.setAttribute('align', 'right')
    td.style.paddingTop = '22px'
    td.colSpan = 2

    let saveBtn = MxUtils.button(
      MxResources.get('export'),
      MxUtils.bind(this, function() {
        if (parseInt(zoomInput.value) <= 0) {
          MxUtils.alert(MxResources.get('drawingEmpty'))
        } else {
          let name = nameInput.value
          let format = imageFormatSelect.value
          let s = Math.max(0, parseFloat(zoomInput.value) || 100) / 100
          let b = Math.max(0, parseInt(borderInput.value))
          let bg = graph.background

          if (
            (format === 'svg' || format === 'png') &&
            transparentCheckbox.checked
          ) {
            bg = null
          } else if (bg === null || bg === MxConstants.NONE) {
            bg = '#ffffff'
          }

          ExportDialog.lastBorderValue = b
          ExportDialog.exportFile(editorUi, name, format, bg, s, b)
        }
      })
    )
    saveBtn.className = 'geBtn gePrimaryBtn'

    let cancelBtn = MxUtils.button(MxResources.get('cancel'), function() {
      editorUi.hideDialog()
    })
    cancelBtn.className = 'geBtn'

    if (editorUi.editor.cancelFirst) {
      td.appendChild(cancelBtn)
      td.appendChild(saveBtn)
    } else {
      td.appendChild(saveBtn)
      td.appendChild(cancelBtn)
    }

    row.appendChild(td)
    tbody.appendChild(row)
    table.appendChild(tbody)
    this.container = table
  }
}

/**
 * Remembers last value for border.
 */
ExportDialog.lastBorderValue = 0

/**
 * Global switches for the export dialog.
 */
ExportDialog.showGifOption = true

/**
 * Global switches for the export dialog.
 */
ExportDialog.showXmlOption = true

/**
 * Hook for getting the export format. Returns null for the default
 * intermediate XML export format or a function that returns the
 * parameter and value to be used in the request in the form
 * key=value, where value should be URL encoded.
 */
ExportDialog.exportFile = function(editorUi, name, format, bg, s, b) {
  let graph = editorUi.editor.graph

  if (format === 'xml') {
    ExportDialog.saveLocalFile(
      editorUi,
      MxUtils.getXml(editorUi.editor.getGraphXml()),
      name,
      format
    )
  } else if (format === 'svg') {
    ExportDialog.saveLocalFile(
      editorUi,
      MxUtils.getXml(graph.getSvg(bg, s, b)),
      name,
      format
    )
  } else {
    let bounds = graph.getGraphBounds()

    // New image export
    let xmlDoc = MxUtils.createXmlDocument()
    let root = xmlDoc.createElement('output')
    xmlDoc.appendChild(root)

    // Renders graph. Offset will be multiplied with state's scale when painting state.
    let xmlCanvas = new MxXmlCanvas2D(root)
    xmlCanvas.translate(
      Math.floor((b / s - bounds.x) / graph.view.scale),
      Math.floor((b / s - bounds.y) / graph.view.scale)
    )
    xmlCanvas.scale(s / graph.view.scale)

    let imgExport = new MxImageExport()
    imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas)

    // Puts request data together
    let param = 'xml=' + encodeURIComponent(MxUtils.getXml(root))
    let w = Math.ceil((bounds.width * s) / graph.view.scale + 2 * b)
    let h = Math.ceil((bounds.height * s) / graph.view.scale + 2 * b)

    // Requests image if request is valid
    if (param.length <= MAX_REQUEST_SIZE && w * h < MAX_AREA) {
      editorUi.hideDialog()
      let req = new MxXmlRequest(
        EXPORT_URL,
        'format=' +
          format +
          '&filename=' +
          encodeURIComponent(name) +
          '&bg=' +
          (bg !== null ? bg : 'none') +
          '&w=' +
          w +
          '&h=' +
          h +
          '&' +
          param
      )
      req.simulate(document, '_blank')
    } else {
      MxUtils.alert(MxResources.get('drawingTooLarge'))
    }
  }
}

/**
 * Hook for getting the export format. Returns null for the default
 * intermediate XML export format or a function that returns the
 * parameter and value to be used in the request in the form
 * key=value, where value should be URL encoded.
 */
ExportDialog.saveLocalFile = function(editorUi, data, filename, format) {
  if (data.length < MAX_REQUEST_SIZE) {
    editorUi.hideDialog()
    let req = new MxXmlRequest(
      SAVE_URL,
      'xml=' +
        encodeURIComponent(data) +
        '&filename=' +
        encodeURIComponent(filename) +
        '&format=' +
        format
    )
    req.simulate(document, '_blank')
  } else {
    MxUtils.alert(MxResources.get('drawingTooLarge'))
    MxUtils.popup(xml)
  }
}

/**
 * Constructs a new metadata dialog.
 */
export class EditDataDialog {
  constructor(ui, cell) {
    let div = document.createElement('div')
    let graph = ui.editor.graph

    let value = graph.getModel().getValue(cell)

    // Converts the value to an XML node
    if (!MxUtils.isNode(value)) {
      let doc = MxUtils.createXmlDocument()
      let obj = doc.createElement('object')
      obj.setAttribute('label', value || '')
      value = obj
    }

    // Creates the dialog contents
    let form = new MxForm('properties')
    form.table.style.width = '100%'

    let attrs = value.attributes
    let names = []
    let texts = []
    let count = 0

    // FIXME: Fix remove button for quirks mode
    let addRemoveButton = function(text, name) {
      let wrapper = document.createElement('div')
      wrapper.style.position = 'relative'
      wrapper.style.paddingRight = '20px'
      wrapper.style.boxSizing = 'border-box'
      wrapper.style.width = '100%'

      let removeAttr = document.createElement('a')
      let img = MxUtils.createImage(Dialog.prototype.closeImage)
      img.style.height = '9px'
      img.style.fontSize = '9px'
      img.style.marginBottom = MxClient.IS_IE11 ? '-1px' : '5px'

      removeAttr.className = 'geButton'
      removeAttr.setAttribute('title', MxResources.get('delete'))
      removeAttr.style.position = 'absolute'
      removeAttr.style.top = '4px'
      removeAttr.style.right = '0px'
      removeAttr.style.margin = '0px'
      removeAttr.style.width = '9px'
      removeAttr.style.height = '9px'
      removeAttr.style.cursor = 'pointer'
      removeAttr.appendChild(img)

      let removeAttrFn = (function(name) {
        return function() {
          let count = 0

          for (let j = 0; j < names.length; j++) {
            if (names[j] === name) {
              texts[j] = null
              form.table.deleteRow(count)

              break
            }

            if (texts[j] !== null) {
              count++
            }
          }
        }
      })(name)

      MxEvent.addListener(removeAttr, 'click', removeAttrFn)

      let parent = text.parentNode
      wrapper.appendChild(text)
      wrapper.appendChild(removeAttr)
      parent.appendChild(wrapper)
    }

    let addTextArea = function(index, name, value) {
      names[index] = name
      texts[index] = form.addTextarea(names[count] + ':', value, 2)
      texts[index].style.width = '100%'

      addRemoveButton(texts[index], name)
    }

    let temp = []

    for (let i = 0; i < attrs.length; i++) {
      if (
        attrs[i].nodeName !== 'label' &&
        attrs[i].nodeName !== 'placeholders'
      ) {
        temp.push({ name: attrs[i].nodeName, value: attrs[i].nodeValue })
      }
    }

    // Sorts by name
    temp.sort(function(a, b) {
      if (a.name < b.name) {
        return -1
      } else if (a.name > b.name) {
        return 1
      } else {
        return 0
      }
    })

    for (let i = 0; i < temp.length; i++) {
      addTextArea(count, temp[i].name, temp[i].value)
      count++
    }

    let top = document.createElement('div')
    top.style.cssText =
      'position:absolute;left:30px;right:30px;overflow-y:auto;top:30px;bottom:80px;'
    top.appendChild(form.table)

    let newProp = document.createElement('div')
    newProp.style.whiteSpace = 'nowrap'
    newProp.style.marginTop = '6px'

    let nameInput = document.createElement('input')
    nameInput.setAttribute('placeholder', MxResources.get('enterPropertyName'))
    nameInput.setAttribute('type', 'text')
    nameInput.setAttribute(
      'size',
      MxClient.IS_IE || MxClient.IS_IE11 ? '18' : '22'
    )
    nameInput.style.marginLeft = '2px'

    newProp.appendChild(nameInput)
    top.appendChild(newProp)
    div.appendChild(top)

    let addBtn = MxUtils.button(MxResources.get('addProperty'), function() {
      let name = nameInput.value

      // Avoid ':' in attribute names which seems to be valid in Chrome
      if (
        name.length > 0 &&
        name !== 'label' &&
        name !== 'placeholders' &&
        name.indexOf(':') < 0
      ) {
        try {
          let idx = MxUtils.indexOf(names, name)

          if (idx >= 0 && texts[idx] !== null) {
            texts[idx].focus()
          } else {
            // Checks if the name is valid
            let clone = value.cloneNode(false)
            clone.setAttribute(name, '')

            if (idx >= 0) {
              names.splice(idx, 1)
              texts.splice(idx, 1)
            }

            names.push(name)
            let text = form.addTextarea(name + ':', '', 2)
            text.style.width = '100%'
            texts.push(text)
            addRemoveButton(text, name)

            text.focus()
          }

          nameInput.value = ''
        } catch (e) {
          MxUtils.alert(e)
        }
      } else {
        MxUtils.alert(MxResources.get('invalidName'))
      }
    })

    this.init = function() {
      if (texts.length > 0) {
        texts[0].focus()
      } else {
        nameInput.focus()
      }
    }

    addBtn.setAttribute('disabled', 'disabled')
    addBtn.style.marginLeft = '10px'
    addBtn.style.width = '144px'
    newProp.appendChild(addBtn)

    let cancelBtn = MxUtils.button(MxResources.get('cancel'), function() {
      ui.hideDialog.apply(ui, arguments)
    })

    cancelBtn.className = 'geBtn'

    let applyBtn = MxUtils.button(MxResources.get('apply'), function() {
      try {
        ui.hideDialog.apply(ui, arguments)

        // Clones and updates the value
        value = value.cloneNode(true)
        let removeLabel = false

        for (let i = 0; i < names.length; i++) {
          if (texts[i] === null) {
            value.removeAttribute(names[i])
          } else {
            value.setAttribute(names[i], texts[i].value)
            removeLabel =
              removeLabel ||
              (names[i] === 'placeholder' &&
                value.getAttribute('placeholders') === '1')
          }
        }

        // Removes label if placeholder is assigned
        if (removeLabel) {
          value.removeAttribute('label')
        }

        // Updates the value of the cell (undoable)
        graph.getModel().setValue(cell, value)
      } catch (e) {
        MxUtils.alert(e)
      }
    })
    applyBtn.className = 'geBtn gePrimaryBtn'

    function updateAddBtn() {
      if (nameInput.value.length > 0) {
        addBtn.removeAttribute('disabled')
      } else {
        addBtn.setAttribute('disabled', 'disabled')
      }
    }

    MxEvent.addListener(nameInput, 'keyup', updateAddBtn)

    // Catches all changes that don't fire a keyup (such as paste via mouse)
    MxEvent.addListener(nameInput, 'change', updateAddBtn)

    let buttons = document.createElement('div')
    buttons.style.cssText =
      'position:absolute;left:30px;right:30px;text-align:right;bottom:30px;height:40px;'

    if (
      ui.editor.graph.getModel().isVertex(cell) ||
      ui.editor.graph.getModel().isEdge(cell)
    ) {
      let replace = document.createElement('span')
      replace.style.marginRight = '10px'
      let input = document.createElement('input')
      input.setAttribute('type', 'checkbox')
      input.style.marginRight = '6px'

      if (value.getAttribute('placeholders') === '1') {
        input.setAttribute('checked', 'checked')
        input.defaultChecked = true
      }

      MxEvent.addListener(input, 'click', function() {
        if (value.getAttribute('placeholders') === '1') {
          value.removeAttribute('placeholders')
        } else {
          value.setAttribute('placeholders', '1')
        }
      })

      replace.appendChild(input)
      MxUtils.write(replace, MxResources.get('placeholders'))

      if (EditDataDialog.placeholderHelpLink !== null) {
        let link = document.createElement('a')
        link.setAttribute('href', EditDataDialog.placeholderHelpLink)
        link.setAttribute('title', MxResources.get('help'))
        link.setAttribute('target', '_blank')
        link.style.marginLeft = '10px'
        link.style.cursor = 'help'

        let icon = document.createElement('img')
        icon.setAttribute('border', '0')
        icon.setAttribute('valign', 'middle')
        icon.style.marginTop = MxClient.IS_IE11 ? '0px' : '-4px'
        icon.setAttribute('src', Editor.helpImage)
        link.appendChild(icon)

        replace.appendChild(link)
      }

      buttons.appendChild(replace)
    }

    if (ui.editor.cancelFirst) {
      buttons.appendChild(cancelBtn)
      buttons.appendChild(applyBtn)
    } else {
      buttons.appendChild(applyBtn)
      buttons.appendChild(cancelBtn)
    }

    div.appendChild(buttons)
    this.container = div
  }
}

/**
 * Optional help link.
 */
EditDataDialog.placeholderHelpLink = null

/**
 * Constructs a new link dialog.
 */
export class LinkDialog {
  constructor(editorUi, initialValue, btnLabel, fn) {
    let div = document.createElement('div')
    MxUtils.write(div, MxResources.get('editLink') + ':')

    let inner = document.createElement('div')
    inner.className = 'geTitle'
    inner.style.backgroundColor = 'transparent'
    inner.style.borderColor = 'transparent'
    inner.style.whiteSpace = 'nowrap'
    inner.style.textOverflow = 'clip'
    inner.style.cursor = 'default'

    if (!MxClient.IS_VML) {
      inner.style.paddingRight = '20px'
    }

    let linkInput = document.createElement('input')
    linkInput.setAttribute('value', initialValue)
    linkInput.setAttribute('placeholder', 'http://www.example.com/')
    linkInput.setAttribute('type', 'text')
    linkInput.style.marginTop = '6px'
    linkInput.style.width = '400px'
    linkInput.style.backgroundImage =
      "url('" + Dialog.prototype.clearImage + "')"
    linkInput.style.backgroundRepeat = 'no-repeat'
    linkInput.style.backgroundPosition = '100% 50%'
    linkInput.style.paddingRight = '14px'

    let cross = document.createElement('div')
    cross.setAttribute('title', MxResources.get('reset'))
    cross.style.position = 'relative'
    cross.style.left = '-16px'
    cross.style.width = '12px'
    cross.style.height = '14px'
    cross.style.cursor = 'pointer'

    // Workaround for inline-block not supported in IE
    cross.style.display = MxClient.IS_VML ? 'inline' : 'inline-block'
    cross.style.top = (MxClient.IS_VML ? 0 : 3) + 'px'

    // Needed to block event transparency in IE
    cross.style.background = 'url(' + IMAGE_PATH + '/transparent.gif)'

    MxEvent.addListener(cross, 'click', function() {
      linkInput.value = ''
      linkInput.focus()
    })

    inner.appendChild(linkInput)
    inner.appendChild(cross)
    div.appendChild(inner)

    this.init = function() {
      linkInput.focus()

      if (
        MxClient.IS_GC ||
        MxClient.IS_FF ||
        document.documentMode >= 5 ||
        MxClient.IS_QUIRKS
      ) {
        linkInput.select()
      } else {
        document.execCommand('selectAll', false, null)
      }
    }

    let btns = document.createElement('div')
    btns.style.marginTop = '18px'
    btns.style.textAlign = 'right'

    MxEvent.addListener(linkInput, 'keypress', function(e) {
      if (e.keyCode === 13) {
        editorUi.hideDialog()
        fn(linkInput.value)
      }
    })

    let cancelBtn = MxUtils.button(MxResources.get('cancel'), function() {
      editorUi.hideDialog()
    })
    cancelBtn.className = 'geBtn'

    if (editorUi.editor.cancelFirst) {
      btns.appendChild(cancelBtn)
    }

    let mainBtn = MxUtils.button(btnLabel, function() {
      editorUi.hideDialog()
      fn(linkInput.value)
    })
    mainBtn.className = 'geBtn gePrimaryBtn'
    btns.appendChild(mainBtn)

    if (!editorUi.editor.cancelFirst) {
      btns.appendChild(cancelBtn)
    }

    div.appendChild(btns)

    this.container = div
  }
}

/**
 *
 */
export class OutlineWindow {
  constructor(editorUi, x, y, w, h) {
    let graph = editorUi.editor.graph

    let div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.width = '100%'
    div.style.height = '100%'
    div.style.border = '1px solid whiteSmoke'
    div.style.overflow = 'hidden'

    this.window = new MxWindow(
      MxResources.get('outline'),
      div,
      x,
      y,
      w,
      h,
      true,
      true
    )
    this.window.destroyOnClose = false
    this.window.setMaximizable(false)
    this.window.setResizable(true)
    this.window.setClosable(true)
    this.window.setVisible(true)

    this.window.setLocation = function(x, y) {
      let iw =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
      let ih =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight

      x = Math.max(0, Math.min(x, iw - this.table.clientWidth))
      y = Math.max(0, Math.min(y, ih - this.table.clientHeight - 48))

      if (this.getX() !== x || this.getY() !== y) {
        MxWindow.prototype.setLocation.apply(this, arguments)
      }
    }

    MxEvent.addListener(
      window,
      'resize',
      MxUtils.bind(this, function() {
        let x = this.window.getX()
        let y = this.window.getY()

        this.window.setLocation(x, y)
      })
    )

    let outline = editorUi.createOutline(this.window)

    this.window.addListener(
      MxEvent.RESIZE,
      MxUtils.bind(this, function() {
        outline.update(false)
        outline.outline.sizeDidChange()
      })
    )

    this.window.addListener(
      MxEvent.SHOW,
      MxUtils.bind(this, function() {
        outline.suspended = false
        outline.outline.refresh()
        outline.update()
      })
    )

    this.window.addListener(
      MxEvent.HIDE,
      MxUtils.bind(this, function() {
        outline.suspended = true
      })
    )

    this.window.addListener(
      MxEvent.NORMALIZE,
      MxUtils.bind(this, function() {
        outline.suspended = false
        outline.update()
      })
    )

    this.window.addListener(
      MxEvent.MINIMIZE,
      MxUtils.bind(this, function() {
        outline.suspended = true
      })
    )

    let outlineCreateGraph = outline.createGraph
    outline.createGraph = function(container) {
      let g = outlineCreateGraph.apply(this, arguments)
      g.gridEnabled = false
      g.pageScale = graph.pageScale
      g.pageFormat = graph.pageFormat
      g.background =
        graph.background === null || graph.background === MxConstants.NONE
          ? graph.defaultPageBackgroundColor
          : graph.background
      g.pageVisible = graph.pageVisible

      let current = MxUtils.getCurrentStyle(graph.container)
      div.style.backgroundColor = current.backgroundColor

      return g
    }

    function update() {
      outline.outline.pageScale = graph.pageScale
      outline.outline.pageFormat = graph.pageFormat
      outline.outline.pageVisible = graph.pageVisible
      outline.outline.background =
        graph.background === null || graph.background === MxConstants.NONE
          ? graph.defaultPageBackgroundColor
          : graph.background

      let current = MxUtils.getCurrentStyle(graph.container)
      div.style.backgroundColor = current.backgroundColor

      if (
        graph.view.backgroundPageShape !== null &&
        outline.outline.view.backgroundPageShape !== null
      ) {
        outline.outline.view.backgroundPageShape.fill =
          graph.view.backgroundPageShape.fill
      }

      outline.outline.refresh()
    }

    outline.init(div)

    editorUi.editor.addListener('resetGraphView', update)
    editorUi.addListener('pageFormatChanged', update)
    editorUi.addListener('backgroundColorChanged', update)
    editorUi.addListener('backgroundImageChanged', update)
    editorUi.addListener('pageViewChanged', function() {
      update()
      outline.update(true)
    })

    if (outline.outline.dialect === MxConstants.DIALECT_SVG) {
      let zoomInAction = editorUi.actions.get('zoomIn')
      let zoomOutAction = editorUi.actions.get('zoomOut')

      MxEvent.addMouseWheelListener(function(evt, up) {
        let outlineWheel = false
        let source = MxEvent.getSource(evt)

        while (source !== null) {
          if (source === outline.outline.view.canvas.ownerSVGElement) {
            outlineWheel = true
            break
          }

          source = source.parentNode
        }

        if (outlineWheel) {
          if (up) {
            zoomInAction.funct()
          } else {
            zoomOutAction.funct()
          }

          MxEvent.consume(evt)
        }
      })
    }
  }
}

/**
 *
 */
export class LayersWindow {
  constructor(editorUi, x, y, w, h) {
    let graph = editorUi.editor.graph

    let div = document.createElement('div')
    div.style.userSelect = 'none'
    div.style.background =
      Dialog.backdropColor === 'white' ? 'whiteSmoke' : Dialog.backdropColor
    div.style.border = '1px solid whiteSmoke'
    div.style.height = '100%'
    div.style.marginBottom = '10px'
    div.style.overflow = 'auto'

    let tbarHeight = !EditorUi.compactUi ? '30px' : '26px'

    let listDiv = document.createElement('div')
    listDiv.style.backgroundColor =
      Dialog.backdropColor === 'white' ? '#a2a2a2' : '#e5e5e5'
    listDiv.style.position = 'absolute'
    listDiv.style.overflow = 'auto'
    listDiv.style.left = '0px'
    listDiv.style.right = '0px'
    listDiv.style.top = '0px'
    listDiv.style.bottom = parseInt(tbarHeight) + 7 + 'px'
    div.appendChild(listDiv)

    let dragSource = null
    let dropIndex = null

    MxEvent.addListener(div, 'dragover', function(evt) {
      evt.dataTransfer.dropEffect = 'move'
      dropIndex = 0
      evt.stopPropagation()
      evt.preventDefault()
    })

    // Workaround for "no element found" error in FF
    MxEvent.addListener(div, 'drop', function(evt) {
      evt.stopPropagation()
      evt.preventDefault()
    })

    let layerCount = null
    let selectionLayer = null

    let ldiv = document.createElement('div')

    ldiv.className = 'geToolbarContainer'
    ldiv.style.position = 'absolute'
    ldiv.style.bottom = '0px'
    ldiv.style.left = '0px'
    ldiv.style.right = '0px'
    ldiv.style.height = tbarHeight
    ldiv.style.overflow = 'hidden'
    ldiv.style.padding = !EditorUi.compactUi ? '1px' : '4px 0px 3px 0px'
    ldiv.style.backgroundColor =
      Dialog.backdropColor === 'white' ? 'whiteSmoke' : Dialog.backdropColor
    ldiv.style.borderWidth = '1px 0px 0px 0px'
    ldiv.style.borderColor = '#c3c3c3'
    ldiv.style.borderStyle = 'solid'
    ldiv.style.display = 'block'
    ldiv.style.whiteSpace = 'nowrap'

    if (MxClient.IS_QUIRKS) {
      ldiv.style.filter = 'none'
    }

    let link = document.createElement('a')
    link.className = 'geButton'

    if (MxClient.IS_QUIRKS) {
      link.style.filter = 'none'
    }

    let removeLink = link.cloneNode()
    removeLink.innerHTML =
      '<div class="geSprite geSprite-delete" style="display:inline-block;"></div>'

    MxEvent.addListener(removeLink, 'click', function(evt) {
      if (graph.isEnabled()) {
        graph.model.beginUpdate()
        try {
          let index = graph.model.root.getIndex(selectionLayer)
          graph.removeCells([selectionLayer], false)

          // Creates default layer if no layer exists
          if (graph.model.getChildCount(graph.model.root) === 0) {
            graph.model.add(graph.model.root, new MxCell())
            graph.setDefaultParent(null)
          } else if (
            index > 0 &&
            index <= graph.model.getChildCount(graph.model.root)
          ) {
            graph.setDefaultParent(
              graph.model.getChildAt(graph.model.root, index - 1)
            )
          } else {
            graph.setDefaultParent(null)
          }
        } finally {
          graph.model.endUpdate()
        }
      }

      MxEvent.consume(evt)
    })

    if (!graph.isEnabled()) {
      removeLink.className = 'geButton mxDisabled'
    }

    ldiv.appendChild(removeLink)

    let insertLink = link.cloneNode()
    insertLink.innerHTML =
      '<div class="geSprite geSprite-insert" style="display:inline-block;"></div>'

    MxEvent.addListener(insertLink, 'click', function(evt) {
      if (graph.isEnabled() && !graph.isSelectionEmpty()) {
        graph.moveCells(graph.getSelectionCells(), 0, 0, false, selectionLayer)
      }
    })

    ldiv.appendChild(insertLink)

    let renameLink = link.cloneNode()
    renameLink.innerHTML =
      '<div class="geSprite geSprite-dots" style="display:inline-block;"></div>'
    renameLink.setAttribute('title', MxResources.get('rename'))

    function renameLayer(layer) {
      if (graph.isEnabled() && layer !== null) {
        let dlg = new FilenameDialog(
          editorUi,
          layer.value || MxResources.get('background'),
          MxResources.get('rename'),
          MxUtils.bind(this, function(newValue) {
            if (newValue !== null) {
              graph.getModel().setValue(layer, newValue)
            }
          }),
          MxResources.get('enterName')
        )
        editorUi.showDialog(dlg.container, 300, 100, true, true)
        dlg.init()
      }
    }

    MxEvent.addListener(renameLink, 'click', function(evt) {
      if (graph.isEnabled()) {
        renameLayer(selectionLayer)
      }

      MxEvent.consume(evt)
    })

    if (!graph.isEnabled()) {
      renameLink.className = 'geButton mxDisabled'
    }

    ldiv.appendChild(renameLink)

    let duplicateLink = link.cloneNode()
    duplicateLink.innerHTML =
      '<div class="geSprite geSprite-duplicate" style="display:inline-block;"></div>'

    MxEvent.addListener(duplicateLink, 'click', function(evt) {
      if (graph.isEnabled()) {
        let newCell = null
        graph.model.beginUpdate()
        try {
          newCell = graph.cloneCells([selectionLayer])[0]
          newCell.value = MxResources.get('untitledLayer')
          newCell.setVisible(true)
          newCell = graph.addCell(newCell, graph.model.root)
          graph.setDefaultParent(newCell)
        } finally {
          graph.model.endUpdate()
        }

        if (newCell !== null && !graph.isCellLocked(newCell)) {
          graph.selectAll(newCell)
        }
      }
    })

    if (!graph.isEnabled()) {
      duplicateLink.className = 'geButton mxDisabled'
    }

    ldiv.appendChild(duplicateLink)

    let addLink = link.cloneNode()
    addLink.innerHTML =
      '<div class="geSprite geSprite-plus" style="display:inline-block;"></div>'
    addLink.setAttribute('title', MxResources.get('addLayer'))

    MxEvent.addListener(addLink, 'click', function(evt) {
      if (graph.isEnabled()) {
        graph.model.beginUpdate()

        try {
          let cell = graph.addCell(
            new MxCell(MxResources.get('untitledLayer')),
            graph.model.root
          )
          graph.setDefaultParent(cell)
        } finally {
          graph.model.endUpdate()
        }
      }

      MxEvent.consume(evt)
    })

    if (!graph.isEnabled()) {
      addLink.className = 'geButton mxDisabled'
    }

    ldiv.appendChild(addLink)

    div.appendChild(ldiv)

    function refresh() {
      layerCount = graph.model.getChildCount(graph.model.root)
      listDiv.innerHTML = ''

      function addLayer(index, label, child, defaultParent) {
        let ldiv = document.createElement('div')
        ldiv.className = 'geToolbarContainer'

        ldiv.style.overflow = 'hidden'
        ldiv.style.position = 'relative'
        ldiv.style.padding = '4px'
        ldiv.style.height = '22px'
        ldiv.style.display = 'block'
        ldiv.style.backgroundColor = 'whiteSmoke'
        ldiv.style.borderWidth = '0px 0px 1px 0px'
        ldiv.style.borderColor = '#c3c3c3'
        ldiv.style.borderStyle = 'solid'
        ldiv.style.whiteSpace = 'nowrap'

        let left = document.createElement('div')
        left.style.display = 'inline-block'
        left.style.width = '100%'
        left.style.textOverflow = 'ellipsis'
        left.style.overflow = 'hidden'

        MxEvent.addListener(ldiv, 'dragover', function(evt) {
          evt.dataTransfer.dropEffect = 'move'
          dropIndex = index
          evt.stopPropagation()
          evt.preventDefault()
        })

        MxEvent.addListener(ldiv, 'dragstart', function(evt) {
          dragSource = ldiv

          // Workaround for no DnD on DIV in FF
          if (MxClient.IS_FF) {
            // LATER: Check what triggers a parse as XML on this in FF after drop
            evt.dataTransfer.setData('Text', '<layer/>')
          }
        })

        MxEvent.addListener(ldiv, 'dragend', function(evt) {
          if (dragSource !== null && dropIndex !== null) {
            graph.addCell(child, graph.model.root, dropIndex)
          }

          dragSource = null
          dropIndex = null
          evt.stopPropagation()
          evt.preventDefault()
        })

        let btn = document.createElement('img')
        btn.setAttribute('draggable', 'false')
        btn.setAttribute('align', 'top')
        btn.setAttribute('border', '0')
        btn.style.padding = '4px'
        btn.setAttribute('title', MxResources.get('lockUnlock'))

        let state = graph.view.getState(child)
        let style = state !== null ? state.style : graph.getCellStyle(child)

        if (MxUtils.getValue(style, 'locked', '0') === '1') {
          btn.setAttribute('src', Dialog.prototype.lockedImage)
        } else {
          btn.setAttribute('src', Dialog.prototype.unlockedImage)
        }

        if (graph.isEnabled()) {
          btn.style.cursor = 'pointer'
        }

        MxEvent.addListener(btn, 'click', function(evt) {
          if (graph.isEnabled()) {
            let value = null

            graph.getModel().beginUpdate()
            try {
              value =
                MxUtils.getValue(style, 'locked', '0') === '1' ? null : '1'
              graph.setCellStyles('locked', value, [child])
            } finally {
              graph.getModel().endUpdate()
            }

            if (value === '1') {
              graph.removeSelectionCells(graph.getModel().getDescendants(child))
            }

            MxEvent.consume(evt)
          }
        })

        left.appendChild(btn)

        let inp = document.createElement('input')
        inp.setAttribute('type', 'checkbox')
        inp.setAttribute(
          'title',
          MxResources.get('hideIt', [
            child.value || MxResources.get('background')
          ])
        )
        inp.style.marginLeft = '4px'
        inp.style.marginRight = '6px'
        inp.style.marginTop = '4px'
        left.appendChild(inp)

        if (graph.model.isVisible(child)) {
          inp.setAttribute('checked', 'checked')
          inp.defaultChecked = true
        }

        MxEvent.addListener(inp, 'click', function(evt) {
          graph.model.setVisible(child, !graph.model.isVisible(child))
          MxEvent.consume(evt)
        })

        MxUtils.write(left, label)
        ldiv.appendChild(left)

        if (graph.isEnabled()) {
          // Fallback if no drag and drop is available
          if (
            MxClient.IS_TOUCH ||
            MxClient.IS_POINTER ||
            MxClient.IS_VML ||
            (MxClient.IS_IE && document.documentMode < 10)
          ) {
            let right = document.createElement('div')
            right.style.display = 'block'
            right.style.textAlign = 'right'
            right.style.whiteSpace = 'nowrap'
            right.style.position = 'absolute'
            right.style.right = '6px'
            right.style.top = '6px'

            // Poor man's change layer order
            if (index > 0) {
              let img2 = document.createElement('a')

              img2.setAttribute('title', MxResources.get('toBack'))

              img2.className = 'geButton'
              img2.style.cssFloat = 'none'
              img2.innerHTML = '&#9660;'
              img2.style.width = '14px'
              img2.style.height = '14px'
              img2.style.fontSize = '14px'
              img2.style.margin = '0px'
              img2.style.marginTop = '-1px'
              right.appendChild(img2)

              MxEvent.addListener(img2, 'click', function(evt) {
                if (graph.isEnabled()) {
                  graph.addCell(child, graph.model.root, index - 1)
                }

                MxEvent.consume(evt)
              })
            }

            if (index >= 0 && index < layerCount - 1) {
              let img1 = document.createElement('a')

              img1.setAttribute('title', MxResources.get('toFront'))

              img1.className = 'geButton'
              img1.style.cssFloat = 'none'
              img1.innerHTML = '&#9650;'
              img1.style.width = '14px'
              img1.style.height = '14px'
              img1.style.fontSize = '14px'
              img1.style.margin = '0px'
              img1.style.marginTop = '-1px'
              right.appendChild(img1)

              MxEvent.addListener(img1, 'click', function(evt) {
                if (graph.isEnabled()) {
                  graph.addCell(child, graph.model.root, index + 1)
                }

                MxEvent.consume(evt)
              })
            }

            ldiv.appendChild(right)
          }

          if (
            MxClient.IS_SVG &&
            (!MxClient.IS_IE || document.documentMode >= 10)
          ) {
            ldiv.setAttribute('draggable', 'true')
            ldiv.style.cursor = 'move'
          }
        }

        MxEvent.addListener(ldiv, 'dblclick', function(evt) {
          let nodeName = MxEvent.getSource(evt).nodeName

          if (nodeName !== 'INPUT' && nodeName !== 'IMG') {
            renameLayer(child)
            MxEvent.consume(evt)
          }
        })

        if (graph.getDefaultParent() === child) {
          ldiv.style.background = '#e6eff8'
          ldiv.style.fontWeight = graph.isEnabled() ? 'bold' : ''
          selectionLayer = child
        } else {
          MxEvent.addListener(ldiv, 'click', function(evt) {
            if (graph.isEnabled()) {
              graph.setDefaultParent(defaultParent)
              graph.view.setCurrentRoot(null)
              refresh()
            }
          })
        }

        listDiv.appendChild(ldiv)
      }

      // Cannot be moved or deleted
      for (let i = layerCount - 1; i >= 0; i--) {
        MxUtils.bind(this, function(child) {
          addLayer(
            i,
            child.value || MxResources.get('background'),
            child,
            child
          )
        })(graph.model.getChildAt(graph.model.root, i))
      }

      removeLink.setAttribute(
        'title',
        MxResources.get('removeIt', [
          selectionLayer.value || MxResources.get('background')
        ])
      )
      insertLink.setAttribute(
        'title',
        MxResources.get('moveSelectionTo', [
          selectionLayer.value || MxResources.get('background')
        ])
      )
      duplicateLink.setAttribute(
        'title',
        MxResources.get('duplicateIt', [
          selectionLayer.value || MxResources.get('background')
        ])
      )
      renameLink.setAttribute(
        'title',
        MxResources.get('renameIt', [
          selectionLayer.value || MxResources.get('background')
        ])
      )

      if (graph.isSelectionEmpty()) {
        insertLink.className = 'geButton mxDisabled'
      }
    }

    refresh()
    graph.model.addListener(MxEvent.CHANGE, function() {
      refresh()
    })

    graph.selectionModel.addListener(MxEvent.CHANGE, function() {
      if (graph.isSelectionEmpty()) {
        insertLink.className = 'geButton mxDisabled'
      } else {
        insertLink.className = 'geButton'
      }
    })

    this.window = new MxWindow(
      MxResources.get('layers'),
      div,
      x,
      y,
      w,
      h,
      true,
      true
    )
    this.window.destroyOnClose = false
    this.window.setMaximizable(false)
    this.window.setResizable(true)
    this.window.setClosable(true)
    this.window.setVisible(true)

    // Make refresh available via instance
    this.refreshLayers = refresh

    this.window.setLocation = function(x, y) {
      let iw =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
      let ih =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight

      x = Math.max(0, Math.min(x, iw - this.table.clientWidth))
      y = Math.max(0, Math.min(y, ih - this.table.clientHeight - 48))

      if (this.getX() !== x || this.getY() !== y) {
        MxWindow.prototype.setLocation.apply(this, arguments)
      }
    }

    MxEvent.addListener(
      window,
      'resize',
      MxUtils.bind(this, function() {
        let x = this.window.getX()
        let y = this.window.getY()

        this.window.setLocation(x, y)
      })
    )
  }
}
