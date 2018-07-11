/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Construcs a new toolbar for the given editor.
 */

import MxClient from '@/lib/board/mxGraph/MxClient'
import MxUtils from '@/lib/board/mxGraph/util/MxUtils'
import MxEvent from '@/lib/board/mxGraph/util/MxEvent'
import EditorUi from './EditorUi'
import MxResources from '@/lib/board/mxGraph/util/MxResources'
import MxConstants from '@/lib/board/mxGraph/util/MxConstants'
import Menus from './Menus'
import Editor from './Editor'
import { FilenameDialog } from './Dialogs'
import MxPopupMenu from '@/lib/board/mxGraph/util/MxPopupMenu'

export default class Toolbar {
  constructor(editorUi, container) {
    this.editorUi = editorUi
    this.container = container
    this.staticElements = []
    this.init()

    // Global handler to hide the current menu
    this.gestureHandler = MxUtils.bind(this, function(evt) {
      if (this.editorUi.currentMenu !== null && MxEvent.getSource(evt) !== this.editorUi.currentMenu.div) {
        this.hideMenu()
      }
    })

    MxEvent.addGestureListeners(document, this.gestureHandler)
  }
};

/**
 * Image for the dropdown arrow.
 */
Toolbar.prototype.dropdownImage = (!MxClient.IS_SVG) ? IMAGE_PATH + '/dropdown.gif' : 'data:image/gif;base64,R0lGODlhDQANAIABAHt7e////yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCREM1NkJFMjE0NEMxMUU1ODk1Q0M5MjQ0MTA4QjNDMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCREM1NkJFMzE0NEMxMUU1ODk1Q0M5MjQ0MTA4QjNDMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkQzOUMzMjZCMTQ0QjExRTU4OTVDQzkyNDQxMDhCM0MxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkQzOUMzMjZDMTQ0QjExRTU4OTVDQzkyNDQxMDhCM0MxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAAQAsAAAAAA0ADQAAAhGMj6nL3QAjVHIu6azbvPtWAAA7'

/**
 * Image element for the dropdown arrow.
 */
Toolbar.prototype.dropdownImageHtml = '<img border="0" style="position:absolute;right:4px;top:' + ((!EditorUi.compactUi) ? 8 : 6) + 'px;" src="' + Toolbar.prototype.dropdownImage + '" valign="middle"/>'

/**
 * Defines the background for selected buttons.
 */
Toolbar.prototype.selectedBackground = '#d0d0d0'

/**
 * Defines the background for selected buttons.
 */
Toolbar.prototype.unselectedBackground = 'none'

/**
 * Array that contains the DOM nodes that should never be removed.
 */
Toolbar.prototype.staticElements = null

/**
 * Adds the toolbar elements.
 */
Toolbar.prototype.init = function() {
  let sw = screen.width

  // Takes into account initial compact mode
  sw -= (screen.height > 740) ? 56 : 0

  if (sw >= 700) {
    let formatMenu = this.addMenu('', MxResources.get('view') + ' (' + MxResources.get('panTooltip') + ')', true, 'viewPanels', null, true)
    this.addDropDownArrow(formatMenu, 'geSprite-formatpanel', 38, 50, -4, -3, 36, -8)
    this.addSeparator()
  }

  let viewMenu = this.addMenu('', MxResources.get('zoom') + ' (Alt+Mousewheel)', true, 'viewZoom', null, true)
  viewMenu.showDisabled = true
  viewMenu.style.whiteSpace = 'nowrap'
  viewMenu.style.position = 'relative'
  viewMenu.style.overflow = 'hidden'

  if (EditorUi.compactUi) {
    viewMenu.style.width = (MxClient.IS_QUIRKS) ? '58px' : '50px'
  } else {
    viewMenu.style.width = (MxClient.IS_QUIRKS) ? '62px' : '36px'
  }

  if (sw >= 420) {
    this.addSeparator()
    let elts = this.addItems(['zoomIn', 'zoomOut'])
    elts[0].setAttribute('title', MxResources.get('zoomIn') + ' (' + this.editorUi.actions.get('zoomIn').shortcut + ')')
    elts[1].setAttribute('title', MxResources.get('zoomOut') + ' (' + this.editorUi.actions.get('zoomOut').shortcut + ')')
  }

  // Updates the label if the scale changes
  this.updateZoom = MxUtils.bind(this, function() {
    viewMenu.innerHTML = Math.round(this.editorUi.editor.graph.view.scale * 100) + '%' + this.dropdownImageHtml

    if (EditorUi.compactUi) {
      viewMenu.getElementsByTagName('img')[0].style.right = '1px'
      viewMenu.getElementsByTagName('img')[0].style.top = '5px'
    }
  })

  this.editorUi.editor.graph.view.addListener(MxEvent.EVENT_SCALE, this.updateZoom)
  this.editorUi.editor.addListener('resetGraphView', this.updateZoom)

  let elts = this.addItems(['-', 'undo', 'redo'])
  elts[1].setAttribute('title', MxResources.get('undo') + ' (' + this.editorUi.actions.get('undo').shortcut + ')')
  elts[2].setAttribute('title', MxResources.get('redo') + ' (' + this.editorUi.actions.get('redo').shortcut + ')')

  if (sw >= 320) {
    let elts = this.addItems(['-', 'delete'])
    elts[1].setAttribute('title', MxResources.get('delete') + ' (' + this.editorUi.actions.get('delete').shortcut + ')')
  }

  if (sw >= 550) {
    this.addItems(['-', 'toFront', 'toBack'])
  }

  if (sw >= 740) {
    this.addItems(['-', 'fillColor'])

    if (sw >= 780) {
      this.addItems(['strokeColor'])

      if (sw >= 820) {
        this.addItems(['shadow'])
      }
    }
  }

  if (sw >= 400) {
    this.addSeparator()

    if (sw >= 440) {
      this.edgeShapeMenu = this.addMenuFunction('', MxResources.get('connection'), false, MxUtils.bind(this, function(menu) {
        this.editorUi.menus.edgeStyleChange(menu, '', [MxConstants.STYLE_SHAPE, 'width'], [null, null], 'geIcon geSprite geSprite-connection', null, true).setAttribute('title', MxResources.get('line'))
        this.editorUi.menus.edgeStyleChange(menu, '', [MxConstants.STYLE_SHAPE, 'width'], ['link', null], 'geIcon geSprite geSprite-linkedge', null, true).setAttribute('title', MxResources.get('link'))
        this.editorUi.menus.edgeStyleChange(menu, '', [MxConstants.STYLE_SHAPE, 'width'], ['flexArrow', null], 'geIcon geSprite geSprite-arrow', null, true).setAttribute('title', MxResources.get('arrow'))
        this.editorUi.menus.edgeStyleChange(menu, '', [MxConstants.STYLE_SHAPE, 'width'], ['arrow', null], 'geIcon geSprite geSprite-simplearrow', null, true).setAttribute('title', MxResources.get('simpleArrow'))
      }))

      this.addDropDownArrow(this.edgeShapeMenu, 'geSprite-connection', 44, 50, 0, 0, 22, -4)
    }

    this.edgeStyleMenu = this.addMenuFunction('geSprite-orthogonal', MxResources.get('waypoints'), false, MxUtils.bind(this, function(menu) {
      this.editorUi.menus.edgeStyleChange(menu, '', [MxConstants.STYLE_EDGE, MxConstants.STYLE_CURVED, MxConstants.STYLE_NOEDGESTYLE], [null, null, null], 'geIcon geSprite geSprite-straight', null, true).setAttribute('title', MxResources.get('straight'))
      this.editorUi.menus.edgeStyleChange(menu, '', [MxConstants.STYLE_EDGE, MxConstants.STYLE_CURVED, MxConstants.STYLE_NOEDGESTYLE], ['orthogonalEdgeStyle', null, null], 'geIcon geSprite geSprite-orthogonal', null, true).setAttribute('title', MxResources.get('orthogonal'))
      this.editorUi.menus.edgeStyleChange(menu, '', [MxConstants.STYLE_EDGE, MxConstants.STYLE_ELBOW, MxConstants.STYLE_CURVED, MxConstants.STYLE_NOEDGESTYLE], ['elbowEdgeStyle', null, null, null], 'geIcon geSprite geSprite-horizontalelbow', null, true).setAttribute('title', MxResources.get('simple'))
      this.editorUi.menus.edgeStyleChange(menu, '', [MxConstants.STYLE_EDGE, MxConstants.STYLE_ELBOW, MxConstants.STYLE_CURVED, MxConstants.STYLE_NOEDGESTYLE], ['elbowEdgeStyle', 'vertical', null, null], 'geIcon geSprite geSprite-verticalelbow', null, true).setAttribute('title', MxResources.get('simple'))
      this.editorUi.menus.edgeStyleChange(menu, '', [MxConstants.STYLE_EDGE, MxConstants.STYLE_ELBOW, MxConstants.STYLE_CURVED, MxConstants.STYLE_NOEDGESTYLE], ['isometricEdgeStyle', null, null, null], 'geIcon geSprite geSprite-horizontalisometric', null, true).setAttribute('title', MxResources.get('isometric'))
      this.editorUi.menus.edgeStyleChange(menu, '', [MxConstants.STYLE_EDGE, MxConstants.STYLE_ELBOW, MxConstants.STYLE_CURVED, MxConstants.STYLE_NOEDGESTYLE], ['isometricEdgeStyle', 'vertical', null, null], 'geIcon geSprite geSprite-verticalisometric', null, true).setAttribute('title', MxResources.get('isometric'))
      this.editorUi.menus.edgeStyleChange(menu, '', [MxConstants.STYLE_EDGE, MxConstants.STYLE_CURVED, MxConstants.STYLE_NOEDGESTYLE], ['orthogonalEdgeStyle', '1', null], 'geIcon geSprite geSprite-curved', null, true).setAttribute('title', MxResources.get('curved'))
      this.editorUi.menus.edgeStyleChange(menu, '', [MxConstants.STYLE_EDGE, MxConstants.STYLE_CURVED, MxConstants.STYLE_NOEDGESTYLE], ['entityRelationEdgeStyle', null, null], 'geIcon geSprite geSprite-entity', null, true).setAttribute('title', MxResources.get('entityRelation'))
    }))

    this.addDropDownArrow(this.edgeStyleMenu, 'geSprite-orthogonal', 44, 50, 0, 0, 22, -4)
  }

  this.addSeparator()

  let insertMenu = this.addMenu('', MxResources.get('insert') + ' (' + MxResources.get('doubleClickTooltip') + ')', true, 'insert', null, true)
  this.addDropDownArrow(insertMenu, 'geSprite-plus', 38, 48, -4, -3, 36, -8)
}

/**
 * Adds the toolbar elements.
 */
Toolbar.prototype.addDropDownArrow = function(menu, sprite, width, atlasWidth, left, top, atlasDelta, atlasLeft) {
  atlasDelta = (atlasDelta !== null) ? atlasDelta : 32
  left = (EditorUi.compactUi) ? left : atlasLeft

  menu.style.whiteSpace = 'nowrap'
  menu.style.overflow = 'hidden'
  menu.style.position = 'relative'
  menu.innerHTML = '<div class="geSprite ' + sprite + '" style="margin-left:' + left + 'px;margin-top:' + top + 'px;"></div>' + this.dropdownImageHtml
  menu.style.width = (MxClient.IS_QUIRKS) ? atlasWidth + 'px' : (atlasWidth - atlasDelta) + 'px'

  if (MxClient.IS_QUIRKS) {
    menu.style.height = (EditorUi.compactUi) ? '24px' : '26px'
  }

  // Fix for item size in kennedy theme
  if (EditorUi.compactUi) {
    menu.getElementsByTagName('img')[0].style.left = '24px'
    menu.getElementsByTagName('img')[0].style.top = '5px'
    menu.style.width = (MxClient.IS_QUIRKS) ? width + 'px' : (width - 10) + 'px'
  }
}

/**
 * Sets the current font name.
 */
Toolbar.prototype.setFontName = function(value) {
  if (this.fontMenu !== null) {
    this.fontMenu.innerHTML = '<div style="width:60px;overflow:hidden;display:inline-block;">' + MxUtils.htmlEntities(value) + '</div>' + this.dropdownImageHtml
  }
}

/**
 * Sets the current font name.
 */
Toolbar.prototype.setFontSize = function(value) {
  if (this.sizeMenu !== null) {
    this.sizeMenu.innerHTML = '<div style="width:24px;overflow:hidden;display:inline-block;">' + value + '</div>' + this.dropdownImageHtml
  }
}

/**
 * Hides the current menu.
 */
Toolbar.prototype.createTextToolbar = function() {
  let graph = this.editorUi.editor.graph

  let styleElt = this.addMenu('', MxResources.get('style'), true, 'formatBlock')
  styleElt.style.position = 'relative'
  styleElt.style.whiteSpace = 'nowrap'
  styleElt.style.overflow = 'hidden'
  styleElt.innerHTML = MxResources.get('style') + this.dropdownImageHtml

  if (EditorUi.compactUi) {
    styleElt.style.paddingRight = '18px'
    styleElt.getElementsByTagName('img')[0].style.right = '1px'
    styleElt.getElementsByTagName('img')[0].style.top = '5px'
  }

  this.addSeparator()

  this.fontMenu = this.addMenu('', MxResources.get('fontFamily'), true, 'fontFamily')
  this.fontMenu.style.position = 'relative'
  this.fontMenu.style.whiteSpace = 'nowrap'
  this.fontMenu.style.overflow = 'hidden'
  this.fontMenu.style.width = (MxClient.IS_QUIRKS) ? '80px' : '60px'

  this.setFontName(Menus.prototype.defaultFont)

  if (EditorUi.compactUi) {
    this.fontMenu.style.paddingRight = '18px'
    this.fontMenu.getElementsByTagName('img')[0].style.right = '1px'
    this.fontMenu.getElementsByTagName('img')[0].style.top = '5px'
  }

  this.addSeparator()

  this.sizeMenu = this.addMenu(Menus.prototype.defaultFontSize, MxResources.get('fontSize'), true, 'fontSize')
  this.sizeMenu.style.position = 'relative'
  this.sizeMenu.style.whiteSpace = 'nowrap'
  this.sizeMenu.style.overflow = 'hidden'
  this.sizeMenu.style.width = (MxClient.IS_QUIRKS) ? '44px' : '24px'

  this.setFontSize(Menus.prototype.defaultFontSize)

  if (EditorUi.compactUi) {
    this.sizeMenu.style.paddingRight = '18px'
    this.sizeMenu.getElementsByTagName('img')[0].style.right = '1px'
    this.sizeMenu.getElementsByTagName('img')[0].style.top = '5px'
  }

  let elts = this.addItems(['-', 'undo', 'redo', '-', 'bold', 'italic', 'underline'])
  elts[1].setAttribute('title', MxResources.get('undo') + ' (' + this.editorUi.actions.get('undo').shortcut + ')')
  elts[2].setAttribute('title', MxResources.get('redo') + ' (' + this.editorUi.actions.get('redo').shortcut + ')')
  elts[4].setAttribute('title', MxResources.get('bold') + ' (' + this.editorUi.actions.get('bold').shortcut + ')')
  elts[5].setAttribute('title', MxResources.get('italic') + ' (' + this.editorUi.actions.get('italic').shortcut + ')')
  elts[6].setAttribute('title', MxResources.get('underline') + ' (' + this.editorUi.actions.get('underline').shortcut + ')')

  // KNOWN: Lost focus after click on submenu with text (not icon) in quirks and IE8. This is because the TD seems
  // to catch the focus on click in these browsers. NOTE: Workaround in MxPopupMenu for icon items (without text).
  let alignMenu = this.addMenuFunction('', MxResources.get('align'), false, MxUtils.bind(this, function(menu) {
    elt = menu.addItem('', null, MxUtils.bind(this, function() {
      document.execCommand('justifyleft', false, null)
    }), null, 'geIcon geSprite geSprite-left')
    elt.setAttribute('title', MxResources.get('left'))

    elt = menu.addItem('', null, MxUtils.bind(this, function() {
      document.execCommand('justifycenter', false, null)
    }), null, 'geIcon geSprite geSprite-center')
    elt.setAttribute('title', MxResources.get('center'))

    elt = menu.addItem('', null, MxUtils.bind(this, function() {
      document.execCommand('justifyright', false, null)
    }), null, 'geIcon geSprite geSprite-right')
    elt.setAttribute('title', MxResources.get('right'))

    elt = menu.addItem('', null, MxUtils.bind(this, function() {
      document.execCommand('justifyfull', false, null)
    }), null, 'geIcon geSprite geSprite-justifyfull')
    elt.setAttribute('title', MxResources.get('justifyfull'))

    elt = menu.addItem('', null, MxUtils.bind(this, function() {
      document.execCommand('insertorderedlist', false, null)
    }), null, 'geIcon geSprite geSprite-orderedlist')
    elt.setAttribute('title', MxResources.get('numberedList'))

    elt = menu.addItem('', null, MxUtils.bind(this, function() {
      document.execCommand('insertunorderedlist', false, null)
    }), null, 'geIcon geSprite geSprite-unorderedlist')
    elt.setAttribute('title', MxResources.get('bulletedList'))

    elt = menu.addItem('', null, MxUtils.bind(this, function() {
      document.execCommand('outdent', false, null)
    }), null, 'geIcon geSprite geSprite-outdent')
    elt.setAttribute('title', MxResources.get('decreaseIndent'))

    elt = menu.addItem('', null, MxUtils.bind(this, function() {
      document.execCommand('indent', false, null)
    }), null, 'geIcon geSprite geSprite-indent')
    elt.setAttribute('title', MxResources.get('increaseIndent'))
  }))

  alignMenu.style.position = 'relative'
  alignMenu.style.whiteSpace = 'nowrap'
  alignMenu.style.overflow = 'hidden'
  alignMenu.innerHTML = '<div class="geSprite geSprite-left" style="margin-left:-2px;"></div>' + this.dropdownImageHtml
  alignMenu.style.width = (MxClient.IS_QUIRKS) ? '50px' : '30px'

  if (EditorUi.compactUi) {
    alignMenu.getElementsByTagName('img')[0].style.left = '22px'
    alignMenu.getElementsByTagName('img')[0].style.top = '5px'
  }

  let formatMenu = this.addMenuFunction('', MxResources.get('format'), false, MxUtils.bind(this, function(menu) {
    elt = menu.addItem('', null, this.editorUi.actions.get('subscript').funct,
      null, 'geIcon geSprite geSprite-subscript')
    elt.setAttribute('title', MxResources.get('subscript') + ' (' + Editor.ctrlKey + '+,)')

    elt = menu.addItem('', null, this.editorUi.actions.get('superscript').funct,
      null, 'geIcon geSprite geSprite-superscript')
    elt.setAttribute('title', MxResources.get('superscript') + ' (' + Editor.ctrlKey + '+.)')

    // KNOWN: IE+FF don't return keyboard focus after color dialog (calling focus doesn't help)
    elt = menu.addItem('', null, this.editorUi.actions.get('fontColor').funct,
      null, 'geIcon geSprite geSprite-fontcolor')
    elt.setAttribute('title', MxResources.get('fontColor'))

    elt = menu.addItem('', null, this.editorUi.actions.get('backgroundColor').funct,
      null, 'geIcon geSprite geSprite-fontbackground')
    elt.setAttribute('title', MxResources.get('backgroundColor'))

    elt = menu.addItem('', null, MxUtils.bind(this, function() {
      document.execCommand('removeformat', false, null)
    }), null, 'geIcon geSprite geSprite-removeformat')
    elt.setAttribute('title', MxResources.get('removeFormat'))
  }))

  formatMenu.style.position = 'relative'
  formatMenu.style.whiteSpace = 'nowrap'
  formatMenu.style.overflow = 'hidden'
  formatMenu.innerHTML = '<div class="geSprite geSprite-dots" style="margin-left:-2px;"></div>' + this.dropdownImageHtml
  formatMenu.style.width = (MxClient.IS_QUIRKS) ? '50px' : '30px'

  if (EditorUi.compactUi) {
    formatMenu.getElementsByTagName('img')[0].style.left = '22px'
    formatMenu.getElementsByTagName('img')[0].style.top = '5px'
  }

  this.addSeparator()

  this.addButton('geIcon geSprite geSprite-code', MxResources.get('html'), function() {
    graph.cellEditor.toggleViewMode()

    if (graph.cellEditor.textarea.innerHTML.length > 0 && (graph.cellEditor.textarea.innerHTML !== '&nbsp;' || !graph.cellEditor.clearOnChange)) {
      window.setTimeout(function() {
        document.execCommand('selectAll', false, null)
      })
    }
  })

  this.addSeparator()

  // FIXME: Uses geButton here and geLabel in main menu
  let insertMenu = this.addMenuFunction('', MxResources.get('insert'), true, MxUtils.bind(this, function(menu) {
    menu.addItem(MxResources.get('insertLink'), null, MxUtils.bind(this, function() {
      this.editorUi.actions.get('link').funct()
    }))

    menu.addItem(MxResources.get('insertImage'), null, MxUtils.bind(this, function() {
      this.editorUi.actions.get('image').funct()
    }))

    menu.addItem(MxResources.get('insertHorizontalRule'), null, MxUtils.bind(this, function() {
      document.execCommand('inserthorizontalrule', false, null)
    }))
  }))

  insertMenu.style.whiteSpace = 'nowrap'
  insertMenu.style.overflow = 'hidden'
  insertMenu.style.position = 'relative'
  insertMenu.innerHTML = '<div class="geSprite geSprite-plus" style="margin-left:-4px;margin-top:-3px;"></div>' + this.dropdownImageHtml
  insertMenu.style.width = (MxClient.IS_QUIRKS) ? '36px' : '16px'

  // Fix for item size in kennedy theme
  if (EditorUi.compactUi) {
    insertMenu.getElementsByTagName('img')[0].style.left = '24px'
    insertMenu.getElementsByTagName('img')[0].style.top = '5px'
    insertMenu.style.width = (MxClient.IS_QUIRKS) ? '50px' : '30px'
  }

  this.addSeparator()

  // KNOWN: All table stuff does not work with undo/redo
  // KNOWN: Lost focus after click on submenu with text (not icon) in quirks and IE8. This is because the TD seems
  // to catch the focus on click in these browsers. NOTE: Workaround in MxPopupMenu for icon items (without text).
  let elt = this.addMenuFunction('geIcon geSprite geSprite-table', MxResources.get('table'), false, MxUtils.bind(this, function(menu) {
    let elt = graph.getSelectedElement()
    let cell = graph.getParentByName(elt, 'TD', graph.cellEditor.text2)
    let row = graph.getParentByName(elt, 'TR', graph.cellEditor.text2)

    if (row === null) {
      this.editorUi.menus.addInsertTableItem(menu)
    } else {
      let table = graph.getParentByName(row, 'TABLE', graph.cellEditor.text2)

      elt = menu.addItem('', null, MxUtils.bind(this, function() {
        try {
          graph.selectNode(graph.insertColumn(table, (cell !== null) ? cell.cellIndex : 0))
        } catch (e) {
          MxUtils.alert(MxResources.get('error') + ': ' + e.message)
        }
      }), null, 'geIcon geSprite geSprite-insertcolumnbefore')
      elt.setAttribute('title', MxResources.get('insertColumnBefore'))

      elt = menu.addItem('', null, MxUtils.bind(this, function() {
        try {
          graph.selectNode(graph.insertColumn(table, (cell !== null) ? cell.cellIndex + 1 : -1))
        } catch (e) {
          MxUtils.alert(MxResources.get('error') + ': ' + e.message)
        }
      }), null, 'geIcon geSprite geSprite-insertcolumnafter')
      elt.setAttribute('title', MxResources.get('insertColumnAfter'))

      elt = menu.addItem('Delete column', null, MxUtils.bind(this, function() {
        if (cell !== null) {
          try {
            graph.deleteColumn(table, cell.cellIndex)
          } catch (e) {
            MxUtils.alert(MxResources.get('error') + ': ' + e.message)
          }
        }
      }), null, 'geIcon geSprite geSprite-deletecolumn')
      elt.setAttribute('title', MxResources.get('deleteColumn'))

      elt = menu.addItem('', null, MxUtils.bind(this, function() {
        try {
          graph.selectNode(graph.insertRow(table, row.sectionRowIndex))
        } catch (e) {
          MxUtils.alert(MxResources.get('error') + ': ' + e.message)
        }
      }), null, 'geIcon geSprite geSprite-insertrowbefore')
      elt.setAttribute('title', MxResources.get('insertRowBefore'))

      elt = menu.addItem('', null, MxUtils.bind(this, function() {
        try {
          graph.selectNode(graph.insertRow(table, row.sectionRowIndex + 1))
        } catch (e) {
          MxUtils.alert(MxResources.get('error') + ': ' + e.message)
        }
      }), null, 'geIcon geSprite geSprite-insertrowafter')
      elt.setAttribute('title', MxResources.get('insertRowAfter'))

      elt = menu.addItem('', null, MxUtils.bind(this, function() {
        try {
          graph.deleteRow(table, row.sectionRowIndex)
        } catch (e) {
          MxUtils.alert(MxResources.get('error') + ': ' + e.message)
        }
      }), null, 'geIcon geSprite geSprite-deleterow')
      elt.setAttribute('title', MxResources.get('deleteRow'))

      elt = menu.addItem('', null, MxUtils.bind(this, function() {
        // Converts rgb(r,g,b) values
        let color = table.style.borderColor.replace(/\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g, function($0, $1, $2, $3) {
          return '#' + ('0' + Number($1).toString(16)).substr(-2) + ('0' + Number($2).toString(16)).substr(-2) + ('0' + Number($3).toString(16)).substr(-2)
        })
        this.editorUi.pickColor(color, function(newColor) {
          if (newColor === null || newColor === MxConstants.NONE) {
            table.removeAttribute('border')
            table.style.border = ''
            table.style.borderCollapse = ''
          } else {
            table.setAttribute('border', '1')
            table.style.border = '1px solid ' + newColor
            table.style.borderCollapse = 'collapse'
          }
        })
      }), null, 'geIcon geSprite geSprite-strokecolor')
      elt.setAttribute('title', MxResources.get('borderColor'))

      elt = menu.addItem('', null, MxUtils.bind(this, function() {
        // Converts rgb(r,g,b) values
        let color = table.style.backgroundColor.replace(
          /\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
          function($0, $1, $2, $3) {
            return '#' + ('0' + Number($1).toString(16)).substr(-2) + ('0' + Number($2).toString(16)).substr(-2) + ('0' + Number($3).toString(16)).substr(-2)
          })
        this.editorUi.pickColor(color, function(newColor) {
          if (newColor === null || newColor === MxConstants.NONE) {
            table.style.backgroundColor = ''
          } else {
            table.style.backgroundColor = newColor
          }
        })
      }), null, 'geIcon geSprite geSprite-fillcolor')
      elt.setAttribute('title', MxResources.get('backgroundColor'))

      elt = menu.addItem('', null, MxUtils.bind(this, function() {
        let value = table.getAttribute('cellPadding') || 0

        let dlg = new FilenameDialog(this.editorUi, value, MxResources.get('apply'), MxUtils.bind(this, function(newValue) {
          if (newValue !== null && newValue.length > 0) {
            table.setAttribute('cellPadding', newValue)
          } else {
            table.removeAttribute('cellPadding')
          }
        }), MxResources.get('spacing'))
        this.editorUi.showDialog(dlg.container, 300, 80, true, true)
        dlg.init()
      }), null, 'geIcon geSprite geSprite-fit')
      elt.setAttribute('title', MxResources.get('spacing'))

      elt = menu.addItem('', null, MxUtils.bind(this, function() {
        table.setAttribute('align', 'left')
      }), null, 'geIcon geSprite geSprite-left')
      elt.setAttribute('title', MxResources.get('left'))

      elt = menu.addItem('', null, MxUtils.bind(this, function() {
        table.setAttribute('align', 'center')
      }), null, 'geIcon geSprite geSprite-center')
      elt.setAttribute('title', MxResources.get('center'))

      elt = menu.addItem('', null, MxUtils.bind(this, function() {
        table.setAttribute('align', 'right')
      }), null, 'geIcon geSprite geSprite-right')
      elt.setAttribute('title', MxResources.get('right'))
    }
  }))

  elt.style.position = 'relative'
  elt.style.whiteSpace = 'nowrap'
  elt.style.overflow = 'hidden'
  elt.innerHTML = '<div class="geSprite geSprite-table" style="margin-left:-2px;"></div>' + this.dropdownImageHtml
  elt.style.width = (MxClient.IS_QUIRKS) ? '50px' : '30px'

  // Fix for item size in kennedy theme
  if (EditorUi.compactUi) {
    elt.getElementsByTagName('img')[0].style.left = '22px'
    elt.getElementsByTagName('img')[0].style.top = '5px'
  }
}

/**
 * Hides the current menu.
 */
Toolbar.prototype.hideMenu = function() {
  this.editorUi.hideCurrentMenu()
}

/**
 * Adds a label to the toolbar.
 */
Toolbar.prototype.addMenu = function(label, tooltip, showLabels, name, c, showAll) {
  let menu = this.editorUi.menus.get(name)
  let elt = this.addMenuFunction(label, tooltip, showLabels, function() {
    menu.funct.apply(menu, arguments)
  }, c, showAll)

  menu.addListener('stateChanged', function() {
    elt.setEnabled(menu.enabled)
  })

  return elt
}

/**
 * Adds a label to the toolbar.
 */
Toolbar.prototype.addMenuFunction = function(label, tooltip, showLabels, funct, c, showAll) {
  return this.addMenuFunctionInContainer((c !== null) ? c : this.container, label, tooltip, showLabels, funct, showAll)
}

/**
 * Adds a label to the toolbar.
 */
Toolbar.prototype.addMenuFunctionInContainer = function(container, label, tooltip, showLabels, funct, showAll) {
  let elt = (showLabels) ? this.createLabel(label) : this.createButton(label)
  this.initElement(elt, tooltip)
  this.addMenuHandler(elt, showLabels, funct, showAll)
  container.appendChild(elt)

  return elt
}

/**
 * Adds a separator to the separator.
 */
Toolbar.prototype.addSeparator = function(c) {
  c = (c !== null) ? c : this.container
  let elt = document.createElement('div')
  elt.className = 'geSeparator'
  c.appendChild(elt)

  return elt
}

/**
 * Adds given action item
 */
Toolbar.prototype.addItems = function(keys, c, ignoreDisabled) {
  let items = []

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]

    if (key === '-') {
      items.push(this.addSeparator(c))
    } else {
      items.push(this.addItem('geSprite-' + key.toLowerCase(), key, c, ignoreDisabled))
    }
  }

  return items
}

/**
 * Adds given action item
 */
Toolbar.prototype.addItem = function(sprite, key, c, ignoreDisabled) {
  let action = this.editorUi.actions.get(key)
  let elt = null

  if (action !== null) {
    let tooltip = action.label

    if (action.shortcut !== null) {
      tooltip += ' (' + action.shortcut + ')'
    }

    elt = this.addButton(sprite, tooltip, action.funct, c)

    if (!ignoreDisabled) {
      elt.setEnabled(action.enabled)

      action.addListener('stateChanged', function() {
        elt.setEnabled(action.enabled)
      })
    }
  }

  return elt
}

/**
 * Adds a button to the toolbar.
 */
Toolbar.prototype.addButton = function(classname, tooltip, funct, c) {
  let elt = this.createButton(classname)
  c = (c !== null) ? c : this.container

  this.initElement(elt, tooltip)
  this.addClickHandler(elt, funct)
  c.appendChild(elt)

  return elt
}

/**
 * Initializes the given toolbar element.
 */
Toolbar.prototype.initElement = function(elt, tooltip) {
  // Adds tooltip
  if (tooltip !== null) {
    elt.setAttribute('title', tooltip)
  }

  this.addEnabledState(elt)
}

/**
 * Adds enabled state with setter to DOM node (avoids JS wrapper).
 */
Toolbar.prototype.addEnabledState = function(elt) {
  let classname = elt.className

  elt.setEnabled = function(value) {
    elt.enabled = value

    if (value) {
      elt.className = classname
    } else {
      elt.className = classname + ' mxDisabled'
    }
  }

  elt.setEnabled(true)
}

/**
 * Adds enabled state with setter to DOM node (avoids JS wrapper).
 */
Toolbar.prototype.addClickHandler = function(elt, funct) {
  if (funct !== null) {
    MxEvent.addListener(elt, 'click', function(evt) {
      if (elt.enabled) {
        funct(evt)
      }

      MxEvent.consume(evt)
    })

    if (document.documentMode !== null && document.documentMode >= 9) {
      // Prevents focus
      MxEvent.addListener(elt, 'mousedown', function(evt) {
        evt.preventDefault()
      })
    }
  }
}

/**
 * Creates and returns a new button.
 */
Toolbar.prototype.createButton = function(classname) {
  let elt = document.createElement('a')
  elt.setAttribute('href', 'javascript:void(0);')
  elt.className = 'geButton'

  let inner = document.createElement('div')

  if (classname !== null) {
    inner.className = 'geSprite ' + classname
  }

  elt.appendChild(inner)

  return elt
}

/**
 * Creates and returns a new button.
 */
Toolbar.prototype.createLabel = function(label, tooltip) {
  let elt = document.createElement('a')
  elt.setAttribute('href', 'javascript:void(0);')
  elt.className = 'geLabel'
  MxUtils.write(elt, label)

  return elt
}

/**
 * Adds a handler for showing a menu in the given element.
 */
Toolbar.prototype.addMenuHandler = function(elt, showLabels, funct, showAll) {
  if (funct !== null) {
    let graph = this.editorUi.editor.graph
    let menu = null
    let show = true

    MxEvent.addListener(elt, 'click', MxUtils.bind(this, function(evt) {
      if (show && (elt.enabled === null || elt.enabled)) {
        graph.popupMenuHandler.hideMenu()
        menu = new MxPopupMenu(funct)
        menu.div.className += ' geToolbarMenu'
        menu.showDisabled = showAll
        menu.labels = showLabels
        menu.autoExpand = true

        let offset = MxUtils.getOffset(elt)
        menu.popup(offset.x, offset.y + elt.offsetHeight, null, evt)
        this.editorUi.setCurrentMenu(menu, elt)

        // Workaround for scrollbar hiding menu items
        if (!showLabels && menu.div.scrollHeight > menu.div.clientHeight) {
          menu.div.style.width = '40px'
        }

        menu.hideMenu = MxUtils.bind(this, function() {
          MxPopupMenu.prototype.hideMenu.apply(menu, arguments)
          this.editorUi.resetCurrentMenu()
          menu.destroy()
        })

        // Extends destroy to reset global state
        menu.addListener(MxEvent.EVENT_HIDE, MxUtils.bind(this, function() {
          this.currentElt = null
        }))
      }

      show = true
      MxEvent.consume(evt)
    }))

    // Hides menu if already showing
    MxEvent.addListener(elt, 'mousedown', MxUtils.bind(this, function(evt) {
      show = this.currentElt !== elt

      // Prevents focus
      if (document.documentMode !== null && document.documentMode >= 9) {
        evt.preventDefault()
      }
    }))
  }
}

/**
 * Adds a handler for showing a menu in the given element.
 */
Toolbar.prototype.destroy = function() {
  if (this.gestureHandler !== null) {
    MxEvent.removeGestureListeners(document, this.gestureHandler)
    this.gestureHandler = null
  }
}
