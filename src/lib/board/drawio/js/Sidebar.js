/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Construcs a new sidebar for the given editor.
 */

import MxUtils from '@/lib/board/mxGraph/util/MxUtils.js'
import MxClient from '@/lib/board/mxGraph/MxClient.js'
import MxEvent from '@/lib/board/mxGraph/util/MxEvent.js'
import MxResources from '@/lib/board/mxGraph/util/MxResources.js'
import MxPoint from '@/lib/board/mxGraph/util/MxPoint.js'
import MxPopupMenu from '@/lib/board/mxGraph/util/MxPopupMenu.js'
import MxDictionary from '@/lib/board/mxGraph/util/MxDictionary.js'
import Editor from './Editor.js'
import Graph, { HoverIcons } from './Graph.js'
import Dialog from '@/lib/board/Dialog.js'
import MxCell from '@/lib/board/mxGraph/model/MxCell.js'
import MxEventObject from '@/lib/board/mxGraph/util/MxEventObject.js'
import MxGeometry from '@/lib/board/mxGraph/model/MxGeometry.js'
import MxConstants from '@/lib/board/mxGraph/util/MxConstants.js'
import MxRectangle from '@/lib/board/mxGraph/util/MxRectangle.js'
import MxStackLayout from '@/lib/board/mxGraph/layout/MxStackLayout.js'
import MxDragSource from '@/lib/board/mxGraph/util/MxDragSource.js'
import MxCodec from '@/lib/board/mxGraph/io/MxCodec.js'
import MxGraphModel from '@/lib/board/mxGraph/model/MxGraphModel.js'
import mxStencilRegistry from '@/lib/board/mxGraph/shape/mxStencilRegistry.js'

export default class Sidebar {
  constructor(editorUi, container) {
    this.editorUi = editorUi
    this.container = container
    this.palettes = new Object()
    this.taglist = new Object()
    this.showTooltips = true
    this.graph = editorUi.createTemporaryGraph(
      this.editorUi.editor.graph.getStylesheet()
    )
    this.graph.cellRenderer.antiAlias = false
    this.graph.foldingEnabled = false
    this.graph.container.style.visibility = 'hidden'
    document.body.appendChild(this.graph.container)

    this.pointerUpHandler = MxUtils.bind(this, function() {
      this.showTooltips = true
    })

    MxEvent.addListener(
      document,
      MxClient.IS_POINTER ? 'pointerup' : 'mouseup',
      this.pointerUpHandler
    )

    this.pointerDownHandler = MxUtils.bind(this, function() {
      this.showTooltips = false
      this.hideTooltip()
    })

    MxEvent.addListener(
      document,
      MxClient.IS_POINTER ? 'pointerdown' : 'mousedown',
      this.pointerDownHandler
    )

    this.pointerMoveHandler = MxUtils.bind(this, function(evt) {
      let src = MxEvent.getSource(evt)

      while (src !== null) {
        if (src === this.currentElt) {
          return
        }

        src = src.parentNode
      }

      this.hideTooltip()
    })

    MxEvent.addListener(
      document,
      MxClient.IS_POINTER ? 'pointermove' : 'mousemove',
      this.pointerMoveHandler
    )

    // Handles mouse leaving the window
    this.pointerOutHandler = MxUtils.bind(this, function(evt) {
      if (evt.toElement === null && evt.relatedTarget === null) {
        this.hideTooltip()
      }
    })

    MxEvent.addListener(
      document,
      MxClient.IS_POINTER ? 'pointerout' : 'mouseout',
      this.pointerOutHandler
    )

    // Enables tooltips after scroll
    MxEvent.addListener(
      container,
      'scroll',
      MxUtils.bind(this, function() {
        this.showTooltips = true
      })
    )

    this.init()

    // Pre-fetches tooltip image
    if (!MxClient.IS_SVG) {
      new Image().src = IMAGE_PATH + '/tooltip.png'
    }
  }
}

/**
 * Adds all palettes to the sidebar.
 */
Sidebar.prototype.init = function() {
  let dir = STENCIL_PATH

  this.addSearchPalette(true)
  this.addGeneralPalette(true)
  this.addMiscPalette(false)
  this.addAdvancedPalette(false)
  this.addBasicPalette(dir)
  this.addStencilPalette(
    'arrows',
    MxResources.get('arrows'),
    dir + '/arrows.xml',
    ';whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;strokeWidth=2'
  )
  this.addUmlPalette(false)
  this.addBpmnPalette(dir, false)
  this.addStencilPalette(
    'flowchart',
    'Flowchart',
    dir + '/flowchart.xml',
    ';whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;strokeWidth=2'
  )
  this.addImagePalette(
    'clipart',
    MxResources.get('clipart'),
    dir + '/clipart/',
    '_128x128.png',
    [
      'Earth_globe',
      'Empty_Folder',
      'Full_Folder',
      'Gear',
      'Lock',
      'Software',
      'Virus',
      'Email',
      'Database',
      'Router_Icon',
      'iPad',
      'iMac',
      'Laptop',
      'MacBook',
      'Monitor_Tower',
      'Printer',
      'Server_Tower',
      'Workstation',
      'Firewall_02',
      'Wireless_Router_N',
      'Credit_Card',
      'Piggy_Bank',
      'Graph',
      'Safe',
      'Shopping_Cart',
      'Suit1',
      'Suit2',
      'Suit3',
      'Pilot1',
      'Worker1',
      'Soldier1',
      'Doctor1',
      'Tech1',
      'Security1',
      'Telesales1'
    ],
    null,
    {
      Wireless_Router_N: 'wireless router switch wap wifi access point wlan',
      Router_Icon: 'router switch'
    }
  )
}

/**
 * Sets the default font size.
 */
Sidebar.prototype.collapsedImage = !MxClient.IS_SVG
  ? IMAGE_PATH + '/collapsed.gif'
  : 'data:image/gif;base64,R0lGODlhDQANAIABAJmZmf///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNUQyRTJFNjZGNUYxMUU1QjZEOThCNDYxMDQ2MzNCQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNUQyRTJFNzZGNUYxMUU1QjZEOThCNDYxMDQ2MzNCQiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFERjc3MEUxNkY1RjExRTVCNkQ5OEI0NjEwNDYzM0JCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjFERjc3MEUyNkY1RjExRTVCNkQ5OEI0NjEwNDYzM0JCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAAQAsAAAAAA0ADQAAAhSMj6lrwAjcC1GyahV+dcZJgeIIFgA7'

/**
 * Sets the default font size.
 */
Sidebar.prototype.expandedImage = !MxClient.IS_SVG
  ? IMAGE_PATH + '/expanded.gif'
  : 'data:image/gif;base64,R0lGODlhDQANAIABAJmZmf///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxREY3NzBERjZGNUYxMUU1QjZEOThCNDYxMDQ2MzNCQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxREY3NzBFMDZGNUYxMUU1QjZEOThCNDYxMDQ2MzNCQiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFERjc3MERENkY1RjExRTVCNkQ5OEI0NjEwNDYzM0JCIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjFERjc3MERFNkY1RjExRTVCNkQ5OEI0NjEwNDYzM0JCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAAQAsAAAAAA0ADQAAAhGMj6nL3QAjVHIu6azbvPtWAAA7'

/**
 * Sets the default font size.
 */
Sidebar.prototype.tooltipImage = !MxClient.IS_SVG
  ? IMAGE_PATH + '/tooltip.png'
  : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAbCAMAAAB7jU7LAAAACVBMVEX///+ZmZn///9Y2COLAAAAA3RSTlP//wDXyg1BAAAAOElEQVR42mXQMQ4AMAgDsWv//+iutcJmIQSk+9dJpVKpVCqVSqVSqZTdncWzF8/NeP7FkxWenPEDOnUBiL3jWx0AAAAASUVORK5CYII='

/**
 *
 */
Sidebar.prototype.searchImage = !MxClient.IS_SVG
  ? IMAGE_PATH + '/search.png'
  : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAEaSURBVHjabNGxS5VxFIfxz71XaWuQUJCG/gCHhgTD9VpEETg4aMOlQRp0EoezObgcd220KQiXmpretTAHQRBdojlQEJyukPdt+b1ywfvAGc7wnHP4nlZd1yKijQW8xzNc4Su+ZOYfQ3T6/f4YNvEJYzjELXp4VVXVz263+7cR2niBxAFeZ2YPi3iHR/gYERPDwhpOsd6sz8x/mfkNG3iOlWFhFj8y89J9KvzGXER0GuEaD42mgwHqUtoljbcRsTBCeINpfM/MgZLKPpaxFxGbOCqDXmILN7hoJrTKH+axhxmcYRxP0MIDnOBDZv5q1XUNIuJxifJp+UNV7t7BFM6xeic0RMQ4Bpl5W/ol7GISx/eEUUTECrbx+f8A8xhiZht9zsgAAAAASUVORK5CYII='

/**
 *
 */
Sidebar.prototype.dragPreviewBorder = '1px dashed black'

/**
 * Specifies if tooltips should be visible. Default is true.
 */
Sidebar.prototype.enableTooltips = true

/**
 * Specifies the delay for the tooltip. Default is 16 px.
 */
Sidebar.prototype.tooltipBorder = 16

/**
 * Specifies the delay for the tooltip. Default is 300 ms.
 */
Sidebar.prototype.tooltipDelay = 300

/**
 * Specifies the delay for the drop target icons. Default is 200 ms.
 */
Sidebar.prototype.dropTargetDelay = 200

/**
 * Specifies the URL of the gear image.
 */
Sidebar.prototype.gearImage = STENCIL_PATH + '/clipart/Gear_128x128.png'

/**
 * Specifies the width of the thumbnails.
 */
Sidebar.prototype.thumbWidth = 36

/**
 * Specifies the height of the thumbnails.
 */
Sidebar.prototype.thumbHeight = 36

/**
 * Specifies the padding for the thumbnails. Default is 3.
 */
Sidebar.prototype.thumbPadding = document.documentMode >= 5 ? 0 : 1

/**
 * Specifies the delay for the tooltip. Default is 2 px.
 */
Sidebar.prototype.thumbBorder = 2

/**
 * Specifies the size of the sidebar titles.
 */
Sidebar.prototype.sidebarTitleSize = 9

/**
 * Specifies if titles in the sidebar should be enabled.
 */
Sidebar.prototype.sidebarTitles = false

/**
 * Specifies if titles in the tooltips should be enabled.
 */
Sidebar.prototype.tooltipTitles = true

/**
 * Specifies if titles in the tooltips should be enabled.
 */
Sidebar.prototype.maxTooltipWidth = 400

/**
 * Specifies if titles in the tooltips should be enabled.
 */
Sidebar.prototype.maxTooltipHeight = 400

/**
 * Specifies if stencil files should be loaded and added to the search index
 * when stencil palettes are added. If this is false then the stencil files
 * are lazy-loaded when the palette is shown.
 */
Sidebar.prototype.addStencilsToIndex = true

/**
 * Specifies the width for clipart images. Default is 80.
 */
Sidebar.prototype.defaultImageWidth = 80

/**
 * Specifies the height for clipart images. Default is 80.
 */
Sidebar.prototype.defaultImageHeight = 80

/**
 * Adds all palettes to the sidebar.
 */
Sidebar.prototype.getTooltipOffset = function() {
  return new MxPoint(0, 0)
}

/**
 * Adds all palettes to the sidebar.
 */
Sidebar.prototype.showTooltip = function(elt, cells, w, h, title, showLabel) {
  if (this.enableTooltips && this.showTooltips) {
    if (this.currentElt !== elt) {
      if (this.thread !== null) {
        window.clearTimeout(this.thread)
        this.thread = null
      }

      let show = MxUtils.bind(this, function() {
        // Lazy creation of the DOM nodes and graph instance
        if (this.tooltip === null) {
          this.tooltip = document.createElement('div')
          this.tooltip.className = 'geSidebarTooltip'
          this.tooltip.style.zIndex = MxPopupMenu.prototype.zIndex - 1
          document.body.appendChild(this.tooltip)

          this.graph2 = new Graph(
            this.tooltip,
            null,
            null,
            this.editorUi.editor.graph.getStylesheet()
          )
          this.graph2.resetViewOnRootChange = false
          this.graph2.foldingEnabled = false
          this.graph2.gridEnabled = false
          this.graph2.autoScroll = false
          this.graph2.setTooltips(false)
          this.graph2.setConnectable(false)
          this.graph2.setEnabled(false)

          if (!MxClient.IS_SVG) {
            this.graph2.view.canvas.style.position = 'relative'
          }

          this.tooltipImage = MxUtils.createImage(this.tooltipImage)
          this.tooltipImage.className = 'geSidebarTooltipImage'
          this.tooltipImage.style.zIndex = MxPopupMenu.prototype.zIndex - 1
          this.tooltipImage.style.position = 'absolute'
          this.tooltipImage.style.width = '14px'
          this.tooltipImage.style.height = '27px'

          document.body.appendChild(this.tooltipImage)
        }

        this.graph2.model.clear()
        this.graph2.view.setTranslate(this.tooltipBorder, this.tooltipBorder)

        if (w > this.maxTooltipWidth || h > this.maxTooltipHeight) {
          this.graph2.view.scale =
            Math.round(
              Math.min(this.maxTooltipWidth / w, this.maxTooltipHeight / h) *
                100
            ) / 100
        } else {
          this.graph2.view.scale = 1
        }

        this.tooltip.style.display = 'block'
        this.graph2.labelsVisible = showLabel === null || showLabel
        let fo = MxClient.NO_FO
        MxClient.NO_FO = Editor.prototype.originalNoForeignObject
        this.graph2.addCells(cells)
        MxClient.NO_FO = fo

        let bounds = this.graph2.getGraphBounds()
        let width = bounds.width + 2 * this.tooltipBorder + 4
        let height = bounds.height + 2 * this.tooltipBorder

        if (MxClient.IS_QUIRKS) {
          height += 4
          this.tooltip.style.overflow = 'hidden'
        } else {
          this.tooltip.style.overflow = 'visible'
        }

        this.tooltipImage.style.visibility = 'visible'
        this.tooltip.style.width = width + 'px'

        // Adds title for entry
        if (this.tooltipTitles && title !== null && title.length > 0) {
          if (this.tooltipTitle === null) {
            this.tooltipTitle = document.createElement('div')
            this.tooltipTitle.style.borderTop = '1px solid gray'
            this.tooltipTitle.style.textAlign = 'center'
            this.tooltipTitle.style.width = '100%'

            // Oversize titles are cut-off currently. Should make tooltip wider later.
            this.tooltipTitle.style.overflow = 'hidden'
            this.tooltipTitle.style.position = 'absolute'
            this.tooltipTitle.style.paddingTop = '6px'
            this.tooltipTitle.style.bottom = '6px'

            this.tooltip.appendChild(this.tooltipTitle)
          } else {
            this.tooltipTitle.innerHTML = ''
          }

          this.tooltipTitle.style.display = ''
          MxUtils.write(this.tooltipTitle, title)

          let ddy = this.tooltipTitle.offsetHeight + 10
          height += ddy

          if (MxClient.IS_SVG) {
            this.tooltipTitle.style.marginTop = 2 - ddy + 'px'
          } else {
            height -= 6
            this.tooltipTitle.style.top = height - ddy + 'px'
          }
        } else if (
          this.tooltipTitle !== null &&
          this.tooltipTitle.parentNode !== null
        ) {
          this.tooltipTitle.style.display = 'none'
        }

        this.tooltip.style.height = height + 'px'
        let x0 = -Math.round(bounds.x - this.tooltipBorder)
        let y0 = -Math.round(bounds.y - this.tooltipBorder)

        let b = document.body
        let d = document.documentElement
        let off = this.getTooltipOffset()
        let bottom = Math.max(b.clientHeight || 0, d.clientHeight)
        let left =
          this.container.clientWidth +
          this.editorUi.splitSize +
          3 +
          this.editorUi.container.offsetLeft +
          off.x
        let top =
          Math.min(
            bottom - height - 20 /* status bar*/,
            Math.max(
              0,
              this.editorUi.container.offsetTop +
                this.container.offsetTop +
                elt.offsetTop -
                this.container.scrollTop -
                height / 2 +
                16
            )
          ) + off.y

        if (MxClient.IS_SVG) {
          if (x0 !== 0 || y0 !== 0) {
            this.graph2.view.canvas.setAttribute(
              'transform',
              'translate(' + x0 + ',' + y0 + ')'
            )
          } else {
            this.graph2.view.canvas.removeAttribute('transform')
          }
        } else {
          this.graph2.view.drawPane.style.left = x0 + 'px'
          this.graph2.view.drawPane.style.top = y0 + 'px'
        }

        // Workaround for ignored position CSS style in IE9
        // (changes to relative without the following line)
        this.tooltip.style.position = 'absolute'
        this.tooltip.style.left = left + 'px'
        this.tooltip.style.top = top + 'px'
        this.tooltipImage.style.left = left - 13 + 'px'
        this.tooltipImage.style.top = top + height / 2 - 13 + 'px'
      })

      if (this.tooltip !== null && this.tooltip.style.display !== 'none') {
        show()
      } else {
        this.thread = window.setTimeout(show, this.tooltipDelay)
      }

      this.currentElt = elt
    }
  }
}

/**
 * Hides the current tooltip.
 */
Sidebar.prototype.hideTooltip = function() {
  if (this.thread !== null) {
    window.clearTimeout(this.thread)
    this.thread = null
  }

  if (this.tooltip !== null) {
    this.tooltip.style.display = 'none'
    this.tooltipImage.style.visibility = 'hidden'
    this.currentElt = null
  }
}

/**
 * Hides the current tooltip.
 */
Sidebar.prototype.addDataEntry = function(tags, width, height, title, data) {
  return this.addEntry(
    tags,
    MxUtils.bind(this, function() {
      return this.createVertexTemplateFromData(data, width, height, title)
    })
  )
}

/**
 * Hides the current tooltip.
 */
Sidebar.prototype.addEntry = function(tags, fn) {
  if (this.taglist !== null && tags !== null && tags.length > 0) {
    // Replaces special characters
    let tmp = tags
      .toLowerCase()
      .replace(/[/,()]/g, ' ')
      .split(' ')

    let doAddEntry = MxUtils.bind(this, function(tag) {
      if (tag.length > 1) {
        let entry = this.taglist[tag]

        if (typeof entry !== 'object') {
          entry = { entries: [], dict: new MxDictionary() }
          this.taglist[tag] = entry
        }

        // Ignores duplicates
        if (entry.dict.get(fn) === null) {
          entry.dict.put(fn, fn)
          entry.entries.push(fn)
        }
      }
    })

    for (let i = 0; i < tmp.length; i++) {
      doAddEntry(tmp[i])

      // Adds additional entry with removed trailing numbers
      let normalized = tmp[i].replace(/\.*\d*$/, '')

      if (normalized !== tmp[i]) {
        doAddEntry(normalized)
      }
    }
  }

  return fn
}

/**
 * Adds shape search UI.
 */
Sidebar.prototype.searchEntries = function(searchTerms, count, page, success, error) {
  let tmp = searchTerms.toLowerCase().split(' ')

  if (this.taglist !== null && searchTerms !== null) {
    let dict = new MxDictionary()
    let max = (page + 1) * count
    let results = []
    let index = 0

    for (let i = 0; i < tmp.length; i++) {
      if (tmp[i].length > 0) {
        let entry = this.taglist[tmp[i]]
        let tmpDict = new MxDictionary()

        if (entry !== null) {
          let arr = entry.entries
          results = []

          for (let j = 0; j < arr.length; j++) {
            let entry = arr[j]

            // NOTE Array does not contain duplicates
            if ((index === 0) === (dict.get(entry) === null)) {
              tmpDict.put(entry, entry)
              results.push(entry)

              if (i === tmp.length - 1 && results.length === max) {
                success(results.slice(page * count, max), max, true, tmp)

                return
              }
            }
          }
        } else {
          results = []
        }

        dict = tmpDict
        index++
      }
    }

    let len = results.length
    success(results.slice(page * count, (page + 1) * count), len, false, tmp)
  } else {
    success([], null, null, tmp)
  }
}

/**
 * Adds shape search UI.
 */
Sidebar.prototype.filterTags = function(tags) {
  if (tags !== null) {
    let arr = tags.split(' ')
    let result = []
    let hash = {}

    // Ignores tags with leading numbers, strips trailing numbers
    for (let i = 0; i < arr.length; i++) {
      // Removes duplicates
      if (hash[arr[i]] === null) {
        hash[arr[i]] = '1'
        result.push(arr[i])
      }
    }

    return result.join(' ')
  }

  return null
}

/**
 * Adds the general palette to the sidebar.
 */
Sidebar.prototype.cloneCell = function(cell, value) {
  let clone = cell.clone()

  if (value !== null) {
    clone.value = value
  }

  return clone
}

/**
 * Adds shape search UI.
 */
Sidebar.prototype.addSearchPalette = function(expand) {
  let elt = document.createElement('div')
  elt.style.visibility = 'hidden'
  this.container.appendChild(elt)

  let div = document.createElement('div')
  div.className = 'geSidebar'
  div.style.boxSizing = 'border-box'
  div.style.overflow = 'hidden'
  div.style.width = '100%'
  div.style.padding = '8px'
  div.style.paddingTop = '14px'
  div.style.paddingBottom = '0px'

  if (!expand) {
    div.style.display = 'none'
  }

  let inner = document.createElement('div')
  inner.style.whiteSpace = 'nowrap'
  inner.style.textOverflow = 'clip'
  inner.style.paddingBottom = '8px'
  inner.style.cursor = 'default'

  let input = document.createElement('input')
  input.setAttribute('placeholder', MxResources.get('searchShapes'))
  input.setAttribute('type', 'text')
  input.style.fontSize = '12px'
  input.style.overflow = 'hidden'
  input.style.boxSizing = 'border-box'
  input.style.border = 'solid 1px #d5d5d5'
  input.style.borderRadius = '4px'
  input.style.width = '100%'
  input.style.outline = 'none'
  input.style.padding = '6px'
  inner.appendChild(input)

  let cross = document.createElement('img')
  cross.setAttribute('src', Sidebar.prototype.searchImage)
  cross.setAttribute('title', MxResources.get('search'))
  cross.style.position = 'relative'
  cross.style.left = '-18px'

  if (MxClient.IS_QUIRKS) {
    input.style.height = '28px'
    cross.style.top = '-4px'
  } else {
    cross.style.top = '1px'
  }

  // Needed to block event transparency in IE
  cross.style.background =
    "url('" + this.editorUi.editor.transparentImage + "')"

  let find

  inner.appendChild(cross)
  div.appendChild(inner)

  let center = document.createElement('center')
  let button = MxUtils.button(MxResources.get('moreResults'), function() {
    find()
  })
  button.style.display = 'none'

  // Workaround for inherited line-height in quirks mode
  button.style.lineHeight = 'normal'
  button.style.marginTop = '4px'
  button.style.marginBottom = '8px'
  center.style.paddingTop = '4px'
  center.style.paddingBottom = '8px'

  center.appendChild(button)
  div.appendChild(center)

  let searchTerm = ''
  let active = false
  let complete = false
  let page = 0
  let hash = new Object()

  // Count is dynamically updated below
  let count = 12

  let clearDiv = MxUtils.bind(this, function() {
    active = false
    this.currentSearch = null
    let child = div.firstChild

    while (child !== null) {
      let next = child.nextSibling

      if (child !== inner && child !== center) {
        child.parentNode.removeChild(child)
      }

      child = next
    }
  })

  MxEvent.addListener(cross, 'click', function() {
    if (cross.getAttribute('src') === Dialog.prototype.closeImage) {
      cross.setAttribute('src', Sidebar.prototype.searchImage)
      cross.setAttribute('title', MxResources.get('search'))
      button.style.display = 'none'
      input.value = ''
      searchTerm = ''
      clearDiv()
    }

    input.focus()
  })

  find = MxUtils.bind(this, function() {
    // Shows 4 rows (minimum 4 results)
    count =
      4 *
      Math.max(
        1,
        Math.floor(this.container.clientWidth / (this.thumbWidth + 10))
      )
    this.hideTooltip()

    if (input.value !== '') {
      if (center.parentNode !== null) {
        if (searchTerm !== input.value) {
          clearDiv()
          searchTerm = input.value
          hash = new Object()
          complete = false
          page = 0
        }

        if (!active && !complete) {
          button.setAttribute('disabled', 'true')
          button.style.display = ''
          button.style.cursor = 'wait'
          button.innerHTML = MxResources.get('loading') + '...'
          active = true

          // Ignores old results
          let current = new Object()
          this.currentSearch = current

          this.searchEntries(
            searchTerm,
            count,
            page,
            MxUtils.bind(this, function(results, len, more, terms) {
              if (this.currentSearch === current) {
                results = results !== null ? results : []
                active = false
                page++
                center.parentNode.removeChild(center)
                this.insertSearchHint(
                  div,
                  searchTerm,
                  count,
                  page,
                  results,
                  len,
                  more,
                  terms
                )

                for (let i = 0; i < results.length; i++) {
                  let elt = results[i]()

                  // Avoids duplicates in results
                  if (hash[elt.innerHTML] === null) {
                    hash[elt.innerHTML] = '1'
                    div.appendChild(results[i]())
                  }
                }

                if (more) {
                  button.removeAttribute('disabled')
                  button.innerHTML = MxResources.get('moreResults')
                } else {
                  button.innerHTML = MxResources.get('reset')
                  button.style.display = 'none'
                  complete = true
                }

                button.style.cursor = ''
                div.appendChild(center)
              }
            }),
            MxUtils.bind(this, function() {
              // TODO: Error handling
              button.style.cursor = ''
            })
          )
        }
      }
    } else {
      clearDiv()
      input.value = ''
      searchTerm = ''
      hash = new Object()
      button.style.display = 'none'
      complete = false
      input.focus()
    }
  })

  MxEvent.addListener(
    input,
    'keydown',
    MxUtils.bind(this, function(evt) {
      if (evt.keyCode === 13 /* Enter */) {
        find()
        MxEvent.consume(evt)
      }
    })
  )

  MxEvent.addListener(input, 'focus', function() {
    input.style.paddingRight = ''
  })

  MxEvent.addListener(input, 'blur', function() {
    input.style.paddingRight = '20px'
  })

  input.style.paddingRight = '20px'

  MxEvent.addListener(
    input,
    'keyup',
    MxUtils.bind(this, function(evt) {
      if (input.value === '') {
        cross.setAttribute('src', Sidebar.prototype.searchImage)
        cross.setAttribute('title', MxResources.get('search'))
      } else {
        cross.setAttribute('src', Dialog.prototype.closeImage)
        cross.setAttribute('title', MxResources.get('reset'))
      }

      if (input.value === '') {
        complete = true
        button.style.display = 'none'
      } else if (input.value !== searchTerm) {
        button.style.display = 'none'
        complete = false
      } else if (!active) {
        if (complete) {
          button.style.display = 'none'
        } else {
          button.style.display = ''
        }
      }
    })
  )

  // Workaround for blocked text selection in Editor
  MxEvent.addListener(input, 'mousedown', function(evt) {
    if (evt.stopPropagation) {
      evt.stopPropagation()
    }

    evt.cancelBubble = true
  })

  // Workaround for blocked text selection in Editor
  MxEvent.addListener(input, 'selectstart', function(evt) {
    if (evt.stopPropagation) {
      evt.stopPropagation()
    }

    evt.cancelBubble = true
  })

  let outer = document.createElement('div')
  outer.appendChild(div)
  this.container.appendChild(outer)

  // Keeps references to the DOM nodes
  this.palettes['search'] = [elt, outer]
}

/**
 * Adds the general palette to the sidebar.
 */
Sidebar.prototype.insertSearchHint = function(
  div,
  searchTerm,
  count,
  page,
  results,
  len,
  more,
  terms
) {
  if (results.length === 0 && page === 1) {
    let err = document.createElement('div')
    err.className = 'geTitle'
    err.style.cssText =
      'background-color:transparent;border-color:transparent;' +
      'color:gray;padding:6px 0px 0px 0px !important;margin:4px 8px 4px 8px;' +
      'text-align:center;cursor:default !important'

    MxUtils.write(err, MxResources.get('noResultsFor', [searchTerm]))
    div.appendChild(err)
  }
}

/**
 * Adds the general palette to the sidebar.
 */
Sidebar.prototype.addGeneralPalette = function(expand) {
  let lineTags =
    'line lines connector connectors connection connections arrow arrows '

  let fns = [
    this.createVertexTemplateEntry(
      'rounded=0;whiteSpace=wrap;html=1;',
      120,
      60,
      '',
      'Rectangle',
      null,
      null,
      'rect rectangle box'
    ),
    this.createVertexTemplateEntry(
      'rounded=1;whiteSpace=wrap;html=1;',
      120,
      60,
      '',
      'Rounded Rectangle',
      null,
      null,
      'rounded rect rectangle box'
    ),
    // Explicit strokecolor/fillcolor=none is a workaround to maintain transparent background regardless of current style
    this.createVertexTemplateEntry(
      'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;',
      40,
      20,
      'Text',
      'Text',
      null,
      null,
      'text textbox textarea label'
    ),
    this.createVertexTemplateEntry(
      'text;html=1;strokeColor=none;fillColor=none;spacing=5;spacingTop=-20;whiteSpace=wrap;overflow=hidden;rounded=0;',
      190,
      120,
      '<h1>Heading</h1><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
      'Textbox',
      null,
      null,
      'text textbox textarea'
    ),
    this.createVertexTemplateEntry(
      'ellipse;whiteSpace=wrap;html=1;',
      120,
      80,
      '',
      'Ellipse',
      null,
      null,
      'oval ellipse state'
    ),
    this.createVertexTemplateEntry(
      'whiteSpace=wrap;html=1;aspect=fixed;',
      80,
      80,
      '',
      'Square',
      null,
      null,
      'square'
    ),
    this.createVertexTemplateEntry(
      'ellipse;whiteSpace=wrap;html=1;aspect=fixed;',
      80,
      80,
      '',
      'Circle',
      null,
      null,
      'circle'
    ),
    this.createVertexTemplateEntry(
      'shape=process;whiteSpace=wrap;html=1;',
      120,
      60,
      '',
      'Process',
      null,
      null,
      'process task'
    ),
    this.createVertexTemplateEntry(
      'rhombus;whiteSpace=wrap;html=1;',
      80,
      80,
      '',
      'Diamond',
      null,
      null,
      'diamond rhombus if condition decision conditional question test'
    ),
    this.createVertexTemplateEntry(
      'shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;',
      120,
      60,
      '',
      'Parallelogram'
    ),
    this.createVertexTemplateEntry(
      'shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;',
      120,
      80,
      '',
      'Hexagon',
      null,
      null,
      'hexagon preparation'
    ),
    this.createVertexTemplateEntry(
      'triangle;whiteSpace=wrap;html=1;',
      60,
      80,
      '',
      'Triangle',
      null,
      null,
      'triangle logic inverter buffer'
    ),
    this.createVertexTemplateEntry(
      'shape=cylinder;whiteSpace=wrap;html=1;boundedLbl=1;',
      60,
      80,
      '',
      'Cylinder',
      null,
      null,
      'cylinder data database'
    ),
    this.createVertexTemplateEntry(
      'ellipse;shape=cloud;whiteSpace=wrap;html=1;',
      120,
      80,
      '',
      'Cloud',
      null,
      null,
      'cloud network'
    ),
    this.createVertexTemplateEntry(
      'shape=document;whiteSpace=wrap;html=1;boundedLbl=1;',
      120,
      80,
      '',
      'Document'
    ),
    this.createVertexTemplateEntry(
      'shape=internalStorage;whiteSpace=wrap;html=1;',
      80,
      80,
      '',
      'Internal Storage'
    ),
    this.createVertexTemplateEntry(
      'shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;',
      120,
      80,
      '',
      'Cube'
    ),
    this.createVertexTemplateEntry(
      'shape=step;perimeter=stepPerimeter;whiteSpace=wrap;html=1;fixedSize=1;',
      120,
      80,
      '',
      'Step'
    ),
    this.createVertexTemplateEntry(
      'shape=trapezoid;perimeter=trapezoidPerimeter;whiteSpace=wrap;html=1;',
      120,
      60,
      '',
      'Trapezoid'
    ),
    this.createVertexTemplateEntry(
      'shape=tape;whiteSpace=wrap;html=1;',
      120,
      100,
      '',
      'Tape'
    ),
    this.createVertexTemplateEntry(
      'shape=note;whiteSpace=wrap;html=1;',
      80,
      100,
      '',
      'Note'
    ),
    this.createVertexTemplateEntry(
      'shape=card;whiteSpace=wrap;html=1;',
      80,
      100,
      '',
      'Card'
    ),
    this.createVertexTemplateEntry(
      'shape=callout;whiteSpace=wrap;html=1;perimeter=calloutPerimeter;',
      120,
      80,
      '',
      'Callout'
    ),
    this.createVertexTemplateEntry(
      'shape=umlActor;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;html=1;outlineConnect=0;',
      30,
      60,
      'Actor',
      'Actor',
      false,
      null,
      'user person human stickman'
    ),
    this.addEntry(
      'curve',
      MxUtils.bind(this, function() {
        let cell = new MxCell(
          '',
          new MxGeometry(0, 0, 50, 50),
          'curved=1;endArrow=classic;html=1;'
        )
        cell.geometry.setTerminalPoint(new MxPoint(0, 50), true)
        cell.geometry.setTerminalPoint(new MxPoint(50, 0), false)
        cell.geometry.points = [new MxPoint(50, 50), new MxPoint(0, 0)]
        cell.geometry.relative = true
        cell.edge = true

        return this.createEdgeTemplateFromCells(
          [cell],
          cell.geometry.width,
          cell.geometry.height,
          'Curve'
        )
      })
    ),
    this.createEdgeTemplateEntry(
      'shape=flexArrow;endArrow=classic;startArrow=classic;html=1;fillColor=#ffffff;',
      50,
      50,
      '',
      'Bidirectional Arrow',
      null,
      lineTags + 'bidirectional'
    ),
    this.createEdgeTemplateEntry(
      'shape=flexArrow;endArrow=classic;html=1;fillColor=#ffffff;',
      50,
      50,
      '',
      'Arrow',
      null,
      lineTags + 'directional directed'
    ),
    this.createEdgeTemplateEntry(
      'shape=link;html=1;',
      50,
      50,
      '',
      'Link',
      null,
      lineTags + 'link'
    ),
    this.createEdgeTemplateEntry(
      'endArrow=none;dashed=1;html=1;',
      50,
      50,
      '',
      'Dashed Line',
      null,
      lineTags + 'dashed undirected no'
    ),
    this.createEdgeTemplateEntry(
      'endArrow=none;html=1;',
      50,
      50,
      '',
      'Line',
      null,
      lineTags + 'simple undirected plain blank no'
    ),
    this.createEdgeTemplateEntry(
      'endArrow=classic;startArrow=classic;html=1;',
      50,
      50,
      '',
      'Bidirectional Connector',
      null,
      lineTags + 'bidirectional'
    ),
    this.createEdgeTemplateEntry(
      'endArrow=classic;html=1;',
      50,
      50,
      '',
      'Directional Connector',
      null,
      lineTags + 'directional directed'
    )
  ]

  this.addPaletteFunctions(
    'general',
    MxResources.get('general'),
    expand !== null ? expand : true,
    fns
  )
}

/**
 * Adds the general palette to the sidebar.
 */
Sidebar.prototype.addBasicPalette = function(dir) {
  this.addStencilPalette(
    'basic',
    MxResources.get('basic'),
    dir + '/basic.xml',
    ';whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#000000;strokeWidth=2',
    null,
    null,
    null,
    null,
    [
      this.createVertexTemplateEntry(
        'shape=partialRectangle;whiteSpace=wrap;html=1;top=0;bottom=0;fillColor=none;',
        120,
        60,
        '',
        'Partial Rectangle'
      ),
      this.createVertexTemplateEntry(
        'shape=partialRectangle;whiteSpace=wrap;html=1;right=0;top=0;bottom=0;fillColor=none;routingCenterX=-0.5;',
        120,
        60,
        '',
        'Partial Rectangle'
      ),
      this.createVertexTemplateEntry(
        'shape=partialRectangle;whiteSpace=wrap;html=1;bottom=0;right=0;fillColor=none;',
        120,
        60,
        '',
        'Partial Rectangle'
      ),
      this.createVertexTemplateEntry(
        'shape=partialRectangle;whiteSpace=wrap;html=1;top=0;left=0;fillColor=none;',
        120,
        60,
        '',
        'Partial Rectangle'
      )
    ]
  )
}

/**
 * Adds the general palette to the sidebar.
 */
Sidebar.prototype.addMiscPalette = function(expand) {
  let lineTags =
    'line lines connector connectors connection connections arrow arrows '

  let fns = [
    this.createVertexTemplateEntry(
      'text;strokeColor=none;fillColor=none;html=1;fontSize=24;fontStyle=1;verticalAlign=middle;align=center;',
      100,
      40,
      'Title',
      'Title',
      null,
      null,
      'text heading title'
    ),
    this.createVertexTemplateEntry(
      'text;strokeColor=none;fillColor=none;html=1;whiteSpace=wrap;verticalAlign=middle;overflow=hidden;',
      100,
      80,
      '<ul><li>Value 1</li><li>Value 2</li><li>Value 3</li></ul>',
      'Unordered List'
    ),
    this.createVertexTemplateEntry(
      'text;strokeColor=none;fillColor=none;html=1;whiteSpace=wrap;verticalAlign=middle;overflow=hidden;',
      100,
      80,
      '<ol><li>Value 1</li><li>Value 2</li><li>Value 3</li></ol>',
      'Ordered List'
    ),
    this.createVertexTemplateEntry(
      'text;html=1;strokeColor=#c0c0c0;fillColor=#ffffff;overflow=fill;rounded=0;',
      280,
      160,
      '<table border="1" width="100%" height="100%" cellpadding="4" style="width:100%;height:100%;border-collapse:collapse;">' +
        '<tr style="background-color:#A7C942;color:#ffffff;border:1px solid #98bf21;"><th align="left">Title 1</th><th align="left">Title 2</th><th align="left">Title 3</th></tr>' +
        '<tr style="border:1px solid #98bf21;"><td>Value 1</td><td>Value 2</td><td>Value 3</td></tr>' +
        '<tr style="background-color:#EAF2D3;border:1px solid #98bf21;"><td>Value 4</td><td>Value 5</td><td>Value 6</td></tr>' +
        '<tr style="border:1px solid #98bf21;"><td>Value 7</td><td>Value 8</td><td>Value 9</td></tr>' +
        '<tr style="background-color:#EAF2D3;border:1px solid #98bf21;"><td>Value 10</td><td>Value 11</td><td>Value 12</td></tr></table>',
      'Table 1'
    ),
    this.createVertexTemplateEntry(
      'text;html=1;strokeColor=#c0c0c0;fillColor=none;overflow=fill;',
      180,
      140,
      '<table border="0" width="100%" height="100%" style="width:100%;height:100%;border-collapse:collapse;">' +
        '<tr><td align="center">Value 1</td><td align="center">Value 2</td><td align="center">Value 3</td></tr>' +
        '<tr><td align="center">Value 4</td><td align="center">Value 5</td><td align="center">Value 6</td></tr>' +
        '<tr><td align="center">Value 7</td><td align="center">Value 8</td><td align="center">Value 9</td></tr></table>',
      'Table 2'
    ),
    this.createVertexTemplateEntry(
      'text;html=1;strokeColor=none;fillColor=none;overflow=fill;',
      180,
      140,
      '<table border="1" width="100%" height="100%" style="width:100%;height:100%;border-collapse:collapse;">' +
        '<tr><td align="center">Value 1</td><td align="center">Value 2</td><td align="center">Value 3</td></tr>' +
        '<tr><td align="center">Value 4</td><td align="center">Value 5</td><td align="center">Value 6</td></tr>' +
        '<tr><td align="center">Value 7</td><td align="center">Value 8</td><td align="center">Value 9</td></tr></table>',
      'Table 3'
    ),
    this.createVertexTemplateEntry(
      'text;html=1;strokeColor=none;fillColor=none;overflow=fill;',
      160,
      140,
      '<table border="1" width="100%" height="100%" cellpadding="4" style="width:100%;height:100%;border-collapse:collapse;">' +
        '<tr><th align="center"><b>Title</b></th></tr>' +
        '<tr><td align="center">Section 1.1\nSection 1.2\nSection 1.3</td></tr>' +
        '<tr><td align="center">Section 2.1\nSection 2.2\nSection 2.3</td></tr></table>',
      'Table 4'
    ),
    this.addEntry(
      'link hyperlink',
      MxUtils.bind(this, function() {
        let cell = new MxCell(
          'Link',
          new MxGeometry(0, 0, 60, 40),
          'text;html=1;strokeColor=none;fillColor=none;whiteSpace=wrap;align=center;verticalAlign=middle;fontColor=#0000EE;fontStyle=4;'
        )
        cell.vertex = true
        this.graph.setLinkForCell(cell, 'https://www.draw.io')

        return this.createVertexTemplateFromCells(
          [cell],
          cell.geometry.width,
          cell.geometry.height,
          'Link'
        )
      })
    ),
    this.addEntry(
      'timestamp date time text label',
      MxUtils.bind(this, function() {
        let cell = new MxCell(
          '%date{ddd mmm dd yyyy HH:MM:ss}%',
          new MxGeometry(0, 0, 160, 20),
          'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;'
        )
        cell.vertex = true
        this.graph.setAttributeForCell(cell, 'placeholders', '1')

        return this.createVertexTemplateFromCells(
          [cell],
          cell.geometry.width,
          cell.geometry.height,
          'Timestamp'
        )
      })
    ),
    this.addEntry(
      'variable placeholder metadata hello world text label',
      MxUtils.bind(this, function() {
        let cell = new MxCell(
          '%name% Text',
          new MxGeometry(0, 0, 80, 20),
          'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;overflow=hidden;'
        )
        cell.vertex = true
        this.graph.setAttributeForCell(cell, 'placeholders', '1')
        this.graph.setAttributeForCell(cell, 'name', 'Variable')

        return this.createVertexTemplateFromCells(
          [cell],
          cell.geometry.width,
          cell.geometry.height,
          'Variable'
        )
      })
    ),
    this.createVertexTemplateEntry(
      'shape=ext;double=1;rounded=0;whiteSpace=wrap;html=1;',
      120,
      80,
      '',
      'Double Rectangle',
      null,
      null,
      'rect rectangle box double'
    ),
    this.createVertexTemplateEntry(
      'shape=ext;double=1;rounded=1;whiteSpace=wrap;html=1;',
      120,
      80,
      '',
      'Double Rounded Rectangle',
      null,
      null,
      'rounded rect rectangle box double'
    ),
    this.createVertexTemplateEntry(
      'ellipse;shape=doubleEllipse;whiteSpace=wrap;html=1;',
      100,
      60,
      '',
      'Double Ellipse',
      null,
      null,
      'oval ellipse start end state double'
    ),
    this.createVertexTemplateEntry(
      'shape=ext;double=1;whiteSpace=wrap;html=1;aspect=fixed;',
      80,
      80,
      '',
      'Double Square',
      null,
      null,
      'double square'
    ),
    this.createVertexTemplateEntry(
      'ellipse;shape=doubleEllipse;whiteSpace=wrap;html=1;aspect=fixed;',
      80,
      80,
      '',
      'Double Circle',
      null,
      null,
      'double circle'
    ),
    this.createEdgeTemplateEntry(
      'rounded=0;comic=1;strokeWidth=2;endArrow=blockThin;html=1;fontFamily=Comic Sans MS;fontStyle=1;',
      50,
      50,
      '',
      'Comic Arrow'
    ),
    this.createVertexTemplateEntry(
      'html=1;whiteSpace=wrap;comic=1;strokeWidth=2;fontFamily=Comic Sans MS;fontStyle=1;',
      120,
      60,
      'RECTANGLE',
      'Comic Rectangle',
      true,
      null,
      'comic rectangle rect box text retro'
    ),
    this.createVertexTemplateEntry(
      'rhombus;html=1;align=center;whiteSpace=wrap;comic=1;strokeWidth=2;fontFamily=Comic Sans MS;fontStyle=1;',
      100,
      100,
      'DIAMOND',
      'Comic Diamond',
      true,
      null,
      'comic diamond rhombus if condition decision conditional question test retro'
    ),
    this.createVertexTemplateEntry(
      'html=1;whiteSpace=wrap;aspect=fixed;shape=isoRectangle;',
      150,
      90,
      '',
      'Isometric Square',
      true,
      null,
      'rectangle rect box iso isometric'
    ),
    this.createVertexTemplateEntry(
      'html=1;whiteSpace=wrap;aspect=fixed;shape=isoCube;',
      90,
      100,
      '',
      'Isometric Cube',
      true,
      null,
      'cube box iso isometric'
    ),
    this.createEdgeTemplateEntry(
      'edgeStyle=isometricEdgeStyle;endArrow=none;html=1;',
      50,
      100,
      '',
      'Isometric Edge 1'
    ),
    this.createEdgeTemplateEntry(
      'edgeStyle=isometricEdgeStyle;endArrow=none;html=1;elbow=vertical;',
      50,
      100,
      '',
      'Isometric Edge 2'
    ),
    this.createVertexTemplateEntry(
      'shape=curlyBracket;whiteSpace=wrap;html=1;rounded=1;',
      20,
      120,
      '',
      'Curly Bracket'
    ),
    this.createVertexTemplateEntry(
      'line;strokeWidth=2;html=1;',
      160,
      10,
      '',
      'Horizontal Line'
    ),
    this.createVertexTemplateEntry(
      'line;strokeWidth=2;direction=south;html=1;',
      10,
      160,
      '',
      'Vertical Line'
    ),
    this.createVertexTemplateEntry(
      'line;strokeWidth=4;html=1;perimeter=backbonePerimeter;points=[];outlineConnect=0;',
      160,
      10,
      '',
      'Horizontal Backbone',
      false,
      null,
      'backbone bus network'
    ),
    this.createVertexTemplateEntry(
      'line;strokeWidth=4;direction=south;html=1;perimeter=backbonePerimeter;points=[];outlineConnect=0;',
      10,
      160,
      '',
      'Vertical Backbone',
      false,
      null,
      'backbone bus network'
    ),
    this.createVertexTemplateEntry(
      'shape=crossbar;whiteSpace=wrap;html=1;rounded=1;',
      120,
      20,
      '',
      'Crossbar',
      false,
      null,
      'crossbar distance measure dimension unit'
    ),
    this.createVertexTemplateEntry(
      'shape=image;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;imageAspect=1;aspect=fixed;image=' +
        this.gearImage,
      52,
      61,
      '',
      'Image (Fixed Aspect)',
      false,
      null,
      'fixed image icon symbol'
    ),
    this.createVertexTemplateEntry(
      'shape=image;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;imageAspect=0;image=' +
        this.gearImage,
      50,
      60,
      '',
      'Image (Variable Aspect)',
      false,
      null,
      'strechted image icon symbol'
    ),
    this.createVertexTemplateEntry(
      'icon;html=1;image=' + this.gearImage,
      60,
      60,
      'Icon',
      'Icon',
      false,
      null,
      'icon image symbol'
    ),
    this.createVertexTemplateEntry(
      'label;whiteSpace=wrap;html=1;image=' + this.gearImage,
      140,
      60,
      'Label',
      'Label 1',
      null,
      null,
      'label image icon symbol'
    ),
    this.createVertexTemplateEntry(
      'label;whiteSpace=wrap;html=1;align=center;verticalAlign=bottom;spacingLeft=0;spacingBottom=4;imageAlign=center;imageVerticalAlign=top;image=' +
        this.gearImage,
      120,
      80,
      'Label',
      'Label 2',
      null,
      null,
      'label image icon symbol'
    ),
    this.addEntry('shape group container', function() {
      let sb = this
      let cell = new MxCell(
        'Label',
        new MxGeometry(0, 0, 160, 70),
        'html=1;whiteSpace=wrap;container=1;recursiveResize=0;collapsible=0;'
      )
      cell.vertex = true

      let symbol = new MxCell(
        '',
        new MxGeometry(20, 20, 20, 30),
        'triangle;html=1;whiteSpace=wrap;'
      )
      symbol.vertex = true
      cell.insert(symbol)

      return sb.createVertexTemplateFromCells(
        [cell],
        cell.geometry.width,
        cell.geometry.height,
        'Shape Group'
      )
    }),
    this.createVertexTemplateEntry(
      'shape=partialRectangle;whiteSpace=wrap;html=1;left=0;right=0;fillColor=none;',
      120,
      60,
      '',
      'Partial Rectangle'
    ),
    this.createVertexTemplateEntry(
      'shape=partialRectangle;whiteSpace=wrap;html=1;bottom=1;right=1;top=0;bottom=1;fillColor=none;routingCenterX=-0.5;',
      120,
      60,
      '',
      'Partial Rectangle'
    ),
    this.createEdgeTemplateEntry(
      'edgeStyle=segmentEdgeStyle;endArrow=classic;html=1;',
      50,
      50,
      '',
      'Manual Line',
      null,
      lineTags + 'manual'
    ),
    this.createEdgeTemplateEntry(
      'shape=filledEdge;rounded=0;fixDash=1;endArrow=none;strokeWidth=10;fillColor=#ffffff;edgeStyle=orthogonalEdgeStyle;',
      60,
      40,
      '',
      'Filled Edge'
    ),
    this.createEdgeTemplateEntry(
      'edgeStyle=elbowEdgeStyle;elbow=horizontal;endArrow=classic;html=1;',
      50,
      50,
      '',
      'Horizontal Elbow',
      null,
      lineTags + 'elbow horizontal'
    ),
    this.createEdgeTemplateEntry(
      'edgeStyle=elbowEdgeStyle;elbow=vertical;endArrow=classic;html=1;',
      50,
      50,
      '',
      'Vertical Elbow',
      null,
      lineTags + 'elbow vertical'
    )
  ]

  this.addPaletteFunctions(
    'misc',
    MxResources.get('misc'),
    expand !== null ? expand : true,
    fns
  )
}
/**
 * Adds the container palette to the sidebar.
 */
Sidebar.prototype.addAdvancedPalette = function(expand) {
  this.addPaletteFunctions(
    'advanced',
    MxResources.get('advanced'),
    expand !== null ? expand : false,
    this.createAdvancedShapes()
  )
}

/**
 * Adds the container palette to the sidebar.
 */
Sidebar.prototype.createAdvancedShapes = function() {
  // Avoids having to bind all functions to "this"
  let sb = this

  // Reusable cells
  let field = new MxCell(
    'List Item',
    new MxGeometry(0, 0, 60, 26),
    'text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;'
  )
  field.vertex = true

  return [
    this.createVertexTemplateEntry(
      'shape=xor;whiteSpace=wrap;html=1;',
      60,
      80,
      '',
      'Or',
      null,
      null,
      'logic or'
    ),
    this.createVertexTemplateEntry(
      'shape=or;whiteSpace=wrap;html=1;',
      60,
      80,
      '',
      'And',
      null,
      null,
      'logic and'
    ),
    this.createVertexTemplateEntry(
      'shape=dataStorage;whiteSpace=wrap;html=1;',
      100,
      80,
      '',
      'Data Storage'
    ),
    this.createVertexTemplateEntry(
      'shape=tapeData;whiteSpace=wrap;html=1;perimeter=ellipsePerimeter;',
      80,
      80,
      '',
      'Tape Data'
    ),
    this.createVertexTemplateEntry(
      'shape=manualInput;whiteSpace=wrap;html=1;',
      80,
      80,
      '',
      'Manual Input'
    ),
    this.createVertexTemplateEntry(
      'shape=loopLimit;whiteSpace=wrap;html=1;',
      100,
      80,
      '',
      'Loop Limit'
    ),
    this.createVertexTemplateEntry(
      'shape=offPageConnector;whiteSpace=wrap;html=1;',
      80,
      80,
      '',
      'Off Page Connector'
    ),
    this.createVertexTemplateEntry(
      'shape=delay;whiteSpace=wrap;html=1;',
      80,
      40,
      '',
      'Delay'
    ),
    this.createVertexTemplateEntry(
      'shape=display;whiteSpace=wrap;html=1;',
      80,
      40,
      '',
      'Display'
    ),
    this.createVertexTemplateEntry(
      'shape=singleArrow;direction=west;whiteSpace=wrap;html=1;',
      100,
      60,
      '',
      'Arrow Left'
    ),
    this.createVertexTemplateEntry(
      'shape=singleArrow;whiteSpace=wrap;html=1;',
      100,
      60,
      '',
      'Arrow Right'
    ),
    this.createVertexTemplateEntry(
      'shape=singleArrow;direction=north;whiteSpace=wrap;html=1;',
      60,
      100,
      '',
      'Arrow Up'
    ),
    this.createVertexTemplateEntry(
      'shape=singleArrow;direction=south;whiteSpace=wrap;html=1;',
      60,
      100,
      '',
      'Arrow Down'
    ),
    this.createVertexTemplateEntry(
      'shape=doubleArrow;whiteSpace=wrap;html=1;',
      100,
      60,
      '',
      'Double Arrow'
    ),
    this.createVertexTemplateEntry(
      'shape=doubleArrow;direction=south;whiteSpace=wrap;html=1;',
      60,
      100,
      '',
      'Double Arrow Vertical',
      null,
      null,
      'double arrow'
    ),
    this.createVertexTemplateEntry(
      'shape=actor;whiteSpace=wrap;html=1;',
      40,
      60,
      '',
      'User',
      null,
      null,
      'user person human'
    ),
    this.createVertexTemplateEntry(
      'shape=cross;whiteSpace=wrap;html=1;',
      80,
      80,
      '',
      'Cross'
    ),
    this.createVertexTemplateEntry(
      'shape=corner;whiteSpace=wrap;html=1;',
      80,
      80,
      '',
      'Corner'
    ),
    this.createVertexTemplateEntry(
      'shape=tee;whiteSpace=wrap;html=1;',
      80,
      80,
      '',
      'Tee'
    ),
    this.createVertexTemplateEntry(
      'shape=datastore;whiteSpace=wrap;html=1;',
      60,
      60,
      '',
      'Data Store',
      null,
      null,
      'data store cylinder database'
    ),
    this.createVertexTemplateEntry(
      'shape=orEllipse;perimeter=ellipsePerimeter;whiteSpace=wrap;html=1;',
      80,
      80,
      '',
      'Or',
      null,
      null,
      'or circle oval ellipse'
    ),
    this.createVertexTemplateEntry(
      'shape=sumEllipse;perimeter=ellipsePerimeter;whiteSpace=wrap;html=1;',
      80,
      80,
      '',
      'Sum',
      null,
      null,
      'sum circle oval ellipse'
    ),
    this.createVertexTemplateEntry(
      'shape=lineEllipse;perimeter=ellipsePerimeter;whiteSpace=wrap;html=1;',
      80,
      80,
      '',
      'Ellipse with horizontal divider',
      null,
      null,
      'circle oval ellipse'
    ),
    this.createVertexTemplateEntry(
      'shape=lineEllipse;line=vertical;perimeter=ellipsePerimeter;whiteSpace=wrap;html=1;',
      80,
      80,
      '',
      'Ellipse with vertical divider',
      null,
      null,
      'circle oval ellipse'
    ),
    this.createVertexTemplateEntry(
      'shape=sortShape;perimeter=rhombusPerimeter;whiteSpace=wrap;html=1;',
      80,
      80,
      '',
      'Sort',
      null,
      null,
      'sort'
    ),
    this.createVertexTemplateEntry(
      'shape=collate;whiteSpace=wrap;html=1;',
      80,
      80,
      '',
      'Collate',
      null,
      null,
      'collate'
    ),
    this.createVertexTemplateEntry(
      'shape=switch;whiteSpace=wrap;html=1;',
      60,
      60,
      '',
      'Switch',
      null,
      null,
      'switch router'
    ),
    this.addEntry('process bar', function() {
      return sb.createVertexTemplateFromData(
        'zZXRaoMwFIafJpcDjbNrb2233rRQ8AkyPdPQaCRJV+3T7yTG2rUVBoOtgpDzn/xJzncCIdGyateKNeVW5iBI9EqipZLS9KOqXYIQhAY8J9GKUBrgT+jbRDZ02aBhCmrzEwPtDZ9MHKBXdkpmoDWKCVN9VptO+Kw+8kqwGqMkK7nIN6yTB7uTNizbD1FSSsVPsjYMC1qFKHxwIZZSSIVxLZ1/nJNar5+oQPMT7IYCrqUta1ENzuqGaeOFTArBGs3f3Vmtoo2Se7ja1h00kSoHK4bBIKUNy3hdoPYU0mF91i9mT8EEL2ocZ3gKa00ayWujLZY4IfHKFonVDLsRGgXuQ90zBmWgneyTk3yT1iArMKrDKUeem9L3ajHrbSXwohxsQd/ggOleKM7ese048J2/fwuim1uQGmhQCW8vQMkacP3GCQgBFMftHEsr7cYYe95CnmKTPMFbYD8CQ++DGQy+/M5X4ku5wHYmdIktfvk9tecpavThqS3m/0YtnqIWPTy1cD77K2wYjo+Ay317I74A',
        296,
        100,
        'Process Bar'
      )
    }),
    this.createVertexTemplateEntry(
      'swimlane;',
      200,
      200,
      'Container',
      'Container',
      null,
      null,
      'container swimlane lane pool group'
    ),
    this.addEntry('list group erd table', function() {
      let cell = new MxCell(
        'List',
        new MxGeometry(0, 0, 140, 110),
        'swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=none;horizontalStack=0;' +
          'resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;'
      )
      cell.vertex = true
      cell.insert(sb.cloneCell(field, 'Item 1'))
      cell.insert(sb.cloneCell(field, 'Item 2'))
      cell.insert(sb.cloneCell(field, 'Item 3'))

      return sb.createVertexTemplateFromCells(
        [cell],
        cell.geometry.width,
        cell.geometry.height,
        'List'
      )
    }),
    this.addEntry('list item entry value group erd table', function() {
      return sb.createVertexTemplateFromCells(
        [sb.cloneCell(field, 'List Item')],
        field.geometry.width,
        field.geometry.height,
        'List Item'
      )
    })
  ]
}

/**
 * Adds the general palette to the sidebar.
 */
Sidebar.prototype.addUmlPalette = function(expand) {
  // Avoids having to bind all functions to "this"
  let sb = this

  // Reusable cells
  let field = new MxCell(
    '+ field: type',
    new MxGeometry(0, 0, 100, 26),
    'text;strokeColor=none;fillColor=none;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;'
  )
  field.vertex = true

  let divider = new MxCell(
    '',
    new MxGeometry(0, 0, 40, 8),
    'line;strokeWidth=1;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=3;spacingRight=3;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;'
  )
  divider.vertex = true

  // Default tags
  let dt = 'uml static class '

  let fns = [
    this.createVertexTemplateEntry(
      'html=1;',
      110,
      50,
      'Object',
      'Object',
      null,
      null,
      dt + 'object instance'
    ),
    this.createVertexTemplateEntry(
      'html=1;',
      110,
      50,
      '&laquo;interface&raquo;<br><b>Name</b>',
      'Interface',
      null,
      null,
      dt + 'interface object instance annotated annotation'
    ),
    this.addEntry(dt + 'object instance', function() {
      let cell = new MxCell(
        'Classname',
        new MxGeometry(0, 0, 160, 90),
        'swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;'
      )
      cell.vertex = true
      cell.insert(field.clone())
      cell.insert(divider.clone())
      cell.insert(sb.cloneCell(field, '+ method(type): type'))

      return sb.createVertexTemplateFromCells(
        [cell],
        cell.geometry.width,
        cell.geometry.height,
        'Class'
      )
    }),
    this.addEntry(dt + 'section subsection', function() {
      let cell = new MxCell(
        'Classname',
        new MxGeometry(0, 0, 140, 110),
        'swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=none;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;'
      )
      cell.vertex = true
      cell.insert(field.clone())
      cell.insert(field.clone())
      cell.insert(field.clone())

      return sb.createVertexTemplateFromCells(
        [cell],
        cell.geometry.width,
        cell.geometry.height,
        'Class 2'
      )
    }),
    this.addEntry(
      dt + 'item member method function variable field attribute label',
      function() {
        return sb.createVertexTemplateFromCells(
          [sb.cloneCell(field, '+ item: attribute')],
          field.geometry.width,
          field.geometry.height,
          'Item 1'
        )
      }
    ),
    this.addEntry(
      dt + 'item member method function variable field attribute label',
      function() {
        let cell = new MxCell(
          'item: attribute',
          new MxGeometry(0, 0, 120, field.geometry.height),
          'label;fontStyle=0;strokeColor=none;fillColor=none;align=left;verticalAlign=top;overflow=hidden;' +
            'spacingLeft=28;spacingRight=4;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;imageWidth=16;imageHeight=16;image=' +
            sb.gearImage
        )
        cell.vertex = true

        return sb.createVertexTemplateFromCells(
          [cell],
          cell.geometry.width,
          cell.geometry.height,
          'Item 2'
        )
      }
    ),
    this.addEntry(dt + 'divider hline line separator', function() {
      return sb.createVertexTemplateFromCells(
        [divider.clone()],
        divider.geometry.width,
        divider.geometry.height,
        'Divider'
      )
    }),
    this.addEntry(dt + 'spacer space gap separator', function() {
      let cell = new MxCell(
        '',
        new MxGeometry(0, 0, 20, 14),
        'text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;spacingTop=-1;spacingLeft=4;spacingRight=4;rotatable=0;labelPosition=right;points=[];portConstraint=eastwest;'
      )
      cell.vertex = true

      return sb.createVertexTemplateFromCells(
        [cell.clone()],
        cell.geometry.width,
        cell.geometry.height,
        'Spacer'
      )
    }),
    this.createVertexTemplateEntry(
      'text;align=center;fontStyle=1;verticalAlign=middle;spacingLeft=3;spacingRight=3;strokeColor=none;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;',
      80,
      26,
      'Title',
      'Title',
      null,
      null,
      dt + 'title label'
    ),
    this.addEntry(dt + 'component', function() {
      let cell = new MxCell(
        '&laquo;Annotation&raquo;<br/><b>Component</b>',
        new MxGeometry(0, 0, 180, 90),
        'html=1;'
      )
      cell.vertex = true

      let symbol = new MxCell(
        '',
        new MxGeometry(1, 0, 20, 20),
        'shape=component;jettyWidth=8;jettyHeight=4;'
      )
      symbol.vertex = true
      symbol.geometry.relative = true
      symbol.geometry.offset = new MxPoint(-27, 7)
      cell.insert(symbol)

      return sb.createVertexTemplateFromCells(
        [cell],
        cell.geometry.width,
        cell.geometry.height,
        'Component'
      )
    }),
    this.addEntry(dt + 'component', function() {
      let cell = new MxCell(
        '<p style="margin:0px;margin-top:6px;text-align:center;"><b>Component</b></p>' +
          '<hr/><p style="margin:0px;margin-left:8px;">+ Attribute1: Type<br/>+ Attribute2: Type</p>',
        new MxGeometry(0, 0, 180, 90),
        'align=left;overflow=fill;html=1;'
      )
      cell.vertex = true

      let symbol = new MxCell(
        '',
        new MxGeometry(1, 0, 20, 20),
        'shape=component;jettyWidth=8;jettyHeight=4;'
      )
      symbol.vertex = true
      symbol.geometry.relative = true
      symbol.geometry.offset = new MxPoint(-24, 4)
      cell.insert(symbol)

      return sb.createVertexTemplateFromCells(
        [cell],
        cell.geometry.width,
        cell.geometry.height,
        'Component with Attributes'
      )
    }),
    this.createVertexTemplateEntry(
      'verticalAlign=top;align=left;spacingTop=8;spacingLeft=2;spacingRight=12;shape=cube;size=10;direction=south;fontStyle=4;html=1;',
      180,
      120,
      'Block',
      'Block',
      null,
      null,
      dt + 'block'
    ),
    this.createVertexTemplateEntry(
      'shape=component;align=left;spacingLeft=36;',
      120,
      60,
      'Module',
      'Module',
      null,
      null,
      dt + 'module'
    ),
    this.createVertexTemplateEntry(
      'shape=folder;fontStyle=1;spacingTop=10;tabWidth=40;tabHeight=14;tabPosition=left;html=1;',
      70,
      50,
      'package',
      'Package',
      null,
      null,
      dt + 'package'
    ),
    this.createVertexTemplateEntry(
      'verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1;',
      160,
      90,
      '<p style="margin:0px;margin-top:4px;text-align:center;text-decoration:underline;"><b>Object:Type</b></p><hr/>' +
        '<p style="margin:0px;margin-left:8px;">field1 = value1<br/>field2 = value2<br>field3 = value3</p>',
      'Object',
      null,
      null,
      dt + 'object instance'
    ),
    this.createVertexTemplateEntry(
      'verticalAlign=top;align=left;overflow=fill;html=1;',
      180,
      90,
      '<div style="box-sizing:border-box;width:100%;background:#e4e4e4;padding:2px;">Tablename</div>' +
        '<table style="width:100%;font-size:1em;" cellpadding="2" cellspacing="0">' +
        '<tr><td>PK</td><td>uniqueId</td></tr><tr><td>FK1</td><td>' +
        'foreignKey</td></tr><tr><td></td><td>fieldname</td></tr></table>',
      'Entity',
      null,
      null,
      'er entity table'
    ),
    this.addEntry(dt + 'object instance', function() {
      let cell = new MxCell(
        '<p style="margin:0px;margin-top:4px;text-align:center;">' +
          '<b>Class</b></p>' +
          '<hr size="1"/><div style="height:2px;"></div>',
        new MxGeometry(0, 0, 140, 60),
        'verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1;'
      )
      cell.vertex = true

      return sb.createVertexTemplateFromCells(
        [cell.clone()],
        cell.geometry.width,
        cell.geometry.height,
        'Class 3'
      )
    }),
    this.addEntry(dt + 'object instance', function() {
      let cell = new MxCell(
        '<p style="margin:0px;margin-top:4px;text-align:center;">' +
          '<b>Class</b></p>' +
          '<hr size="1"/><div style="height:2px;"></div><hr size="1"/><div style="height:2px;"></div>',
        new MxGeometry(0, 0, 140, 60),
        'verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1;'
      )
      cell.vertex = true

      return sb.createVertexTemplateFromCells(
        [cell.clone()],
        cell.geometry.width,
        cell.geometry.height,
        'Class 4'
      )
    }),
    this.addEntry(dt + 'object instance', function() {
      let cell = new MxCell(
        '<p style="margin:0px;margin-top:4px;text-align:center;">' +
          '<b>Class</b></p>' +
          '<hr size="1"/><p style="margin:0px;margin-left:4px;">+ field: Type</p><hr size="1"/>' +
          '<p style="margin:0px;margin-left:4px;">+ method(): Type</p>',
        new MxGeometry(0, 0, 160, 90),
        'verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1;'
      )
      cell.vertex = true

      return sb.createVertexTemplateFromCells(
        [cell.clone()],
        cell.geometry.width,
        cell.geometry.height,
        'Class 5'
      )
    }),
    this.addEntry(dt + 'object instance', function() {
      let cell = new MxCell(
        '<p style="margin:0px;margin-top:4px;text-align:center;">' +
          '<i>&lt;&lt;Interface&gt;&gt;</i><br/><b>Interface</b></p>' +
          '<hr size="1"/><p style="margin:0px;margin-left:4px;">+ field1: Type<br/>' +
          '+ field2: Type</p>' +
          '<hr size="1"/><p style="margin:0px;margin-left:4px;">' +
          '+ method1(Type): Type<br/>' +
          '+ method2(Type, Type): Type</p>',
        new MxGeometry(0, 0, 190, 140),
        'verticalAlign=top;align=left;overflow=fill;fontSize=12;fontFamily=Helvetica;html=1;'
      )
      cell.vertex = true

      return sb.createVertexTemplateFromCells(
        [cell.clone()],
        cell.geometry.width,
        cell.geometry.height,
        'Interface 2'
      )
    }),
    this.createVertexTemplateEntry(
      'shape=lollipop;direction=south;html=1;',
      30,
      10,
      '',
      'Provided Interface',
      null,
      null,
      dt + 'provided interface'
    ),
    this.createVertexTemplateEntry(
      'shape=requires;direction=north;html=1;',
      30,
      20,
      '',
      'Required Interface',
      null,
      null,
      dt + 'required interface'
    ),
    this.createVertexTemplateEntry(
      'shape=umlBoundary;whiteSpace=wrap;html=1;',
      100,
      80,
      'Boundary Object',
      'Boundary Object',
      null,
      null,
      'uml boundary object'
    ),
    this.createVertexTemplateEntry(
      'ellipse;shape=umlEntity;whiteSpace=wrap;html=1;',
      80,
      80,
      'Entity Object',
      'Entity Object',
      null,
      null,
      'uml entity object'
    ),
    this.createVertexTemplateEntry(
      'ellipse;shape=umlControl;whiteSpace=wrap;html=1;',
      70,
      80,
      'Control Object',
      'Control Object',
      null,
      null,
      'uml control object'
    ),
    this.createVertexTemplateEntry(
      'shape=umlActor;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;html=1;',
      30,
      60,
      'Actor',
      'Actor',
      false,
      null,
      'uml actor'
    ),
    this.createVertexTemplateEntry(
      'ellipse;whiteSpace=wrap;html=1;',
      140,
      70,
      'Use Case',
      'Use Case',
      null,
      null,
      'uml use case usecase'
    ),
    this.addEntry('uml activity state start', function() {
      let cell = new MxCell(
        '',
        new MxGeometry(0, 0, 30, 30),
        'ellipse;html=1;shape=startState;fillColor=#000000;strokeColor=#ff0000;'
      )
      cell.vertex = true

      let edge = new MxCell(
        '',
        new MxGeometry(0, 0, 0, 0),
        'edgeStyle=orthogonalEdgeStyle;html=1;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;'
      )
      edge.geometry.setTerminalPoint(new MxPoint(15, 90), false)
      edge.geometry.relative = true
      edge.edge = true

      cell.insertEdge(edge, true)

      return sb.createVertexTemplateFromCells([cell, edge], 30, 90, 'Start')
    }),
    this.addEntry('uml activity state', function() {
      let cell = new MxCell(
        'Activity',
        new MxGeometry(0, 0, 120, 40),
        'rounded=1;whiteSpace=wrap;html=1;arcSize=40;fillColor=#ffffc0;strokeColor=#ff0000;'
      )
      cell.vertex = true

      let edge = new MxCell(
        '',
        new MxGeometry(0, 0, 0, 0),
        'edgeStyle=orthogonalEdgeStyle;html=1;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;'
      )
      edge.geometry.setTerminalPoint(new MxPoint(60, 100), false)
      edge.geometry.relative = true
      edge.edge = true

      cell.insertEdge(edge, true)

      return sb.createVertexTemplateFromCells(
        [cell, edge],
        120,
        100,
        'Activity'
      )
    }),
    this.addEntry('uml activity composite state', function() {
      let cell = new MxCell(
        'Composite State',
        new MxGeometry(0, 0, 160, 60),
        'swimlane;html=1;fontStyle=1;align=center;verticalAlign=middle;childLayout=stackLayout;horizontal=1;startSize=30;horizontalStack=0;resizeParent=0;resizeLast=1;container=0;collapsible=0;rounded=1;arcSize=30;strokeColor=#ff0000;fillColor=#ffffc0;swimlaneFillColor=#ffffc0;'
      )
      cell.vertex = true

      let cell1 = new MxCell(
        'Subtitle',
        new MxGeometry(0, 0, 200, 26),
        'text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;spacingLeft=4;spacingRight=4;whiteSpace=wrap;overflow=hidden;rotatable=0;'
      )
      cell1.vertex = true
      cell.insert(cell1)

      let edge = new MxCell(
        '',
        new MxGeometry(0, 0, 0, 0),
        'edgeStyle=orthogonalEdgeStyle;html=1;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;'
      )
      edge.geometry.setTerminalPoint(new MxPoint(80, 120), false)
      edge.geometry.relative = true
      edge.edge = true

      cell.insertEdge(edge, true)

      return sb.createVertexTemplateFromCells(
        [cell, edge],
        160,
        120,
        'Composite State'
      )
    }),
    this.addEntry('uml activity condition', function() {
      let cell = new MxCell(
        'Condition',
        new MxGeometry(0, 0, 80, 40),
        'rhombus;whiteSpace=wrap;html=1;fillColor=#ffffc0;strokeColor=#ff0000;'
      )
      cell.vertex = true

      let edge1 = new MxCell(
        'no',
        new MxGeometry(0, 0, 0, 0),
        'edgeStyle=orthogonalEdgeStyle;html=1;align=left;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;'
      )
      edge1.geometry.setTerminalPoint(new MxPoint(180, 20), false)
      edge1.geometry.relative = true
      edge1.geometry.x = -1
      edge1.edge = true

      cell.insertEdge(edge1, true)

      let edge2 = new MxCell(
        'yes',
        new MxGeometry(0, 0, 0, 0),
        'edgeStyle=orthogonalEdgeStyle;html=1;align=left;verticalAlign=top;endArrow=open;endSize=8;strokeColor=#ff0000;'
      )
      edge2.geometry.setTerminalPoint(new MxPoint(40, 100), false)
      edge2.geometry.relative = true
      edge2.geometry.x = -1
      edge2.edge = true

      cell.insertEdge(edge2, true)

      return sb.createVertexTemplateFromCells(
        [cell, edge1, edge2],
        180,
        100,
        'Condition'
      )
    }),
    this.addEntry('uml activity fork join', function() {
      let cell = new MxCell(
        '',
        new MxGeometry(0, 0, 200, 10),
        'shape=line;html=1;strokeWidth=6;strokeColor=#ff0000;'
      )
      cell.vertex = true

      let edge = new MxCell(
        '',
        new MxGeometry(0, 0, 0, 0),
        'edgeStyle=orthogonalEdgeStyle;html=1;verticalAlign=bottom;endArrow=open;endSize=8;strokeColor=#ff0000;'
      )
      edge.geometry.setTerminalPoint(new MxPoint(100, 80), false)
      edge.geometry.relative = true
      edge.edge = true

      cell.insertEdge(edge, true)

      return sb.createVertexTemplateFromCells(
        [cell, edge],
        200,
        80,
        'Fork/Join'
      )
    }),
    this.createVertexTemplateEntry(
      'ellipse;html=1;shape=endState;fillColor=#000000;strokeColor=#ff0000;',
      30,
      30,
      '',
      'End',
      null,
      null,
      'uml activity state end'
    ),
    this.createVertexTemplateEntry(
      'shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;',
      100,
      300,
      ':Object',
      'Lifeline',
      null,
      null,
      'uml sequence participant lifeline'
    ),
    this.createVertexTemplateEntry(
      'shape=umlLifeline;participant=umlActor;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;labelBackgroundColor=#ffffff;outlineConnect=0;',
      20,
      300,
      '',
      'Actor Lifeline',
      null,
      null,
      'uml sequence participant lifeline actor'
    ),
    this.createVertexTemplateEntry(
      'shape=umlLifeline;participant=umlBoundary;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;labelBackgroundColor=#ffffff;outlineConnect=0;',
      50,
      300,
      '',
      'Boundary Lifeline',
      null,
      null,
      'uml sequence participant lifeline boundary'
    ),
    this.createVertexTemplateEntry(
      'shape=umlLifeline;participant=umlEntity;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;labelBackgroundColor=#ffffff;outlineConnect=0;',
      40,
      300,
      '',
      'Entity Lifeline',
      null,
      null,
      'uml sequence participant lifeline entity'
    ),
    this.createVertexTemplateEntry(
      'shape=umlLifeline;participant=umlControl;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;labelBackgroundColor=#ffffff;outlineConnect=0;',
      40,
      300,
      '',
      'Control Lifeline',
      null,
      null,
      'uml sequence participant lifeline control'
    ),
    this.createVertexTemplateEntry(
      'shape=umlFrame;whiteSpace=wrap;html=1;',
      300,
      200,
      'frame',
      'Frame',
      null,
      null,
      'uml sequence frame'
    ),
    this.createVertexTemplateEntry(
      'shape=umlDestroy;whiteSpace=wrap;html=1;strokeWidth=3;',
      30,
      30,
      '',
      'Destruction',
      null,
      null,
      'uml sequence destruction destroy'
    ),
    this.createVertexTemplateEntry(
      'shape=note;whiteSpace=wrap;html=1;size=14;verticalAlign=top;align=left;spacingTop=-6;',
      100,
      70,
      'Note',
      'Note',
      null,
      null,
      'uml note'
    ),
    this.addEntry('uml sequence invoke invocation call activation', function() {
      let cell = new MxCell(
        '',
        new MxGeometry(0, 0, 10, 80),
        'html=1;points=[];perimeter=orthogonalPerimeter;'
      )
      cell.vertex = true

      let edge = new MxCell(
        'dispatch',
        new MxGeometry(0, 0, 0, 0),
        'html=1;verticalAlign=bottom;startArrow=oval;endArrow=block;startSize=8;'
      )
      edge.geometry.setTerminalPoint(new MxPoint(-60, 0), true)
      edge.geometry.relative = true
      edge.edge = true

      cell.insertEdge(edge, false)

      return sb.createVertexTemplateFromCells(
        [cell, edge],
        10,
        80,
        'Found Message'
      )
    }),
    this.addEntry(
      'uml sequence invoke call delegation synchronous invocation activation',
      function() {
        let cell = new MxCell(
          '',
          new MxGeometry(0, 0, 10, 80),
          'html=1;points=[];perimeter=orthogonalPerimeter;'
        )
        cell.vertex = true

        let edge1 = new MxCell(
          'dispatch',
          new MxGeometry(0, 0, 0, 0),
          'html=1;verticalAlign=bottom;endArrow=block;entryX=0;entryY=0;'
        )
        edge1.geometry.setTerminalPoint(new MxPoint(-70, 0), true)
        edge1.geometry.relative = true
        edge1.edge = true

        cell.insertEdge(edge1, false)

        let edge2 = new MxCell(
          'return',
          new MxGeometry(0, 0, 0, 0),
          'html=1;verticalAlign=bottom;endArrow=open;dashed=1;endSize=8;exitX=0;exitY=0.95;'
        )
        edge2.geometry.setTerminalPoint(new MxPoint(-70, 76), false)
        edge2.geometry.relative = true
        edge2.edge = true

        cell.insertEdge(edge2, true)

        return sb.createVertexTemplateFromCells(
          [cell, edge1, edge2],
          10,
          80,
          'Synchronous Invocation'
        )
      }
    ),
    this.addEntry(
      'uml sequence self call recursion delegation activation',
      function() {
        let cell = new MxCell(
          '',
          new MxGeometry(0, 20, 10, 40),
          'html=1;points=[];perimeter=orthogonalPerimeter;'
        )
        cell.vertex = true

        let edge = new MxCell(
          'self call',
          new MxGeometry(0, 0, 0, 0),
          'edgeStyle=orthogonalEdgeStyle;html=1;align=left;spacingLeft=2;endArrow=block;rounded=0;entryX=1;entryY=0;'
        )
        edge.geometry.setTerminalPoint(new MxPoint(5, 0), true)
        edge.geometry.points = [new MxPoint(30, 0)]
        edge.geometry.relative = true
        edge.edge = true

        cell.insertEdge(edge, false)

        return sb.createVertexTemplateFromCells(
          [cell, edge],
          10,
          60,
          'Self Call'
        )
      }
    ),
    this.addEntry(
      'uml sequence invoke call delegation callback activation',
      function() {
        // TODO: Check if more entries should be converted to compressed XML
        return sb.createVertexTemplateFromData(
          'xZRNT8MwDIZ/Ta6oaymD47rBTkiTuMAxW6wmIm0q19s6fj1OE3V0Y2iCA4dK8euP2I+riGxedUuUjX52CqzIHkU2R+conKpuDtaKNDFKZAuRpgl/In264J303qSRCDVdk5CGhJ20WwhKEFo62ChoqritxURkReNMTa2X80LkC68AmgoIkEWHpF3pamlXR7WIFwASdBeb7KXY4RIc5+KBQ/ZGkY4RYY5Egyl1zLqLmmyDXQ6Zx4n5EIf+HkB2BmAjrV3LzftPIPw4hgNn1pQ1a2tH5Cp2QK1miG7vNeu4iJe4pdeY2BtvbCQDGlAljMCQxBJotJ8rWCFYSWY3LvUdmZi68rvkkLiU6QnL1m1xAzHoBOdw61WEb88II9AW67/ydQ2wq1Cy1aAGvOrFfPh6997qDA3g+dxzv3nIL6MPU/8T+kMw8+m4QPgdfrEJNo8PSQj/+s58Ag===',
          10,
          60,
          'Callback'
        )
      }
    ),
    this.createVertexTemplateEntry(
      'html=1;points=[];perimeter=orthogonalPerimeter;',
      10,
      80,
      '',
      'Activation',
      null,
      null,
      'uml sequence activation'
    ),
    this.createEdgeTemplateEntry(
      'html=1;verticalAlign=bottom;startArrow=oval;startFill=1;endArrow=block;startSize=8;',
      60,
      0,
      'dispatch',
      'Found Message 1',
      null,
      'uml sequence message call invoke dispatch'
    ),
    this.createEdgeTemplateEntry(
      'html=1;verticalAlign=bottom;startArrow=circle;startFill=1;endArrow=open;startSize=6;endSize=8;',
      80,
      0,
      'dispatch',
      'Found Message 2',
      null,
      'uml sequence message call invoke dispatch'
    ),
    this.createEdgeTemplateEntry(
      'html=1;verticalAlign=bottom;endArrow=block;',
      80,
      0,
      'dispatch',
      'Message',
      null,
      'uml sequence message call invoke dispatch'
    ),
    this.addEntry('uml sequence return message', function() {
      let edge = new MxCell(
        'return',
        new MxGeometry(0, 0, 0, 0),
        'html=1;verticalAlign=bottom;endArrow=open;dashed=1;endSize=8;'
      )
      edge.geometry.setTerminalPoint(new MxPoint(80, 0), true)
      edge.geometry.setTerminalPoint(new MxPoint(0, 0), false)
      edge.geometry.relative = true
      edge.edge = true

      return sb.createEdgeTemplateFromCells([edge], 80, 0, 'Return')
    }),
    this.addEntry('uml relation', function() {
      let edge = new MxCell(
        'name',
        new MxGeometry(0, 0, 0, 0),
        'endArrow=block;endFill=1;html=1;edgeStyle=orthogonalEdgeStyle;align=left;verticalAlign=top;'
      )
      edge.geometry.setTerminalPoint(new MxPoint(0, 0), true)
      edge.geometry.setTerminalPoint(new MxPoint(160, 0), false)
      edge.geometry.relative = true
      edge.geometry.x = -1
      edge.edge = true

      let cell = new MxCell(
        '1',
        new MxGeometry(-1, 0, 0, 0),
        'resizable=0;html=1;align=left;verticalAlign=bottom;labelBackgroundColor=#ffffff;fontSize=10;'
      )
      cell.geometry.relative = true
      cell.setConnectable(false)
      cell.vertex = true
      edge.insert(cell)

      return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Relation 1')
    }),
    this.addEntry('uml association', function() {
      let edge = new MxCell(
        '',
        new MxGeometry(0, 0, 0, 0),
        'endArrow=none;html=1;edgeStyle=orthogonalEdgeStyle;'
      )
      edge.geometry.setTerminalPoint(new MxPoint(0, 0), true)
      edge.geometry.setTerminalPoint(new MxPoint(160, 0), false)
      edge.geometry.relative = true
      edge.edge = true

      let cell1 = new MxCell(
        'parent',
        new MxGeometry(-1, 0, 0, 0),
        'resizable=0;html=1;align=left;verticalAlign=bottom;labelBackgroundColor=#ffffff;fontSize=10;'
      )
      cell1.geometry.relative = true
      cell1.setConnectable(false)
      cell1.vertex = true
      edge.insert(cell1)

      let cell2 = new MxCell(
        'child',
        new MxGeometry(1, 0, 0, 0),
        'resizable=0;html=1;align=right;verticalAlign=bottom;labelBackgroundColor=#ffffff;fontSize=10;'
      )
      cell2.geometry.relative = true
      cell2.setConnectable(false)
      cell2.vertex = true
      edge.insert(cell2)

      return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Association 1')
    }),
    this.addEntry('uml aggregation', function() {
      let edge = new MxCell(
        '1',
        new MxGeometry(0, 0, 0, 0),
        'endArrow=open;html=1;endSize=12;startArrow=diamondThin;startSize=14;startFill=0;edgeStyle=orthogonalEdgeStyle;align=left;verticalAlign=bottom;'
      )
      edge.geometry.setTerminalPoint(new MxPoint(0, 0), true)
      edge.geometry.setTerminalPoint(new MxPoint(160, 0), false)
      edge.geometry.relative = true
      edge.geometry.x = -1
      edge.geometry.y = 3
      edge.edge = true

      return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Aggregation 1')
    }),
    this.addEntry('uml composition', function() {
      let edge = new MxCell(
        '1',
        new MxGeometry(0, 0, 0, 0),
        'endArrow=open;html=1;endSize=12;startArrow=diamondThin;startSize=14;startFill=1;edgeStyle=orthogonalEdgeStyle;align=left;verticalAlign=bottom;'
      )
      edge.geometry.setTerminalPoint(new MxPoint(0, 0), true)
      edge.geometry.setTerminalPoint(new MxPoint(160, 0), false)
      edge.geometry.relative = true
      edge.geometry.x = -1
      edge.geometry.y = 3
      edge.edge = true

      return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Composition 1')
    }),
    this.addEntry('uml relation', function() {
      let edge = new MxCell(
        'Relation',
        new MxGeometry(0, 0, 0, 0),
        'endArrow=open;html=1;endSize=12;startArrow=diamondThin;startSize=14;startFill=0;edgeStyle=orthogonalEdgeStyle;'
      )
      edge.geometry.setTerminalPoint(new MxPoint(0, 0), true)
      edge.geometry.setTerminalPoint(new MxPoint(160, 0), false)
      edge.geometry.relative = true
      edge.edge = true

      let cell1 = new MxCell(
        '0..n',
        new MxGeometry(-1, 0, 0, 0),
        'resizable=0;html=1;align=left;verticalAlign=top;labelBackgroundColor=#ffffff;fontSize=10;'
      )
      cell1.geometry.relative = true
      cell1.setConnectable(false)
      cell1.vertex = true
      edge.insert(cell1)

      let cell2 = new MxCell(
        '1',
        new MxGeometry(1, 0, 0, 0),
        'resizable=0;html=1;align=right;verticalAlign=top;labelBackgroundColor=#ffffff;fontSize=10;'
      )
      cell2.geometry.relative = true
      cell2.setConnectable(false)
      cell2.vertex = true
      edge.insert(cell2)

      return sb.createEdgeTemplateFromCells([edge], 160, 0, 'Relation 2')
    }),
    this.createEdgeTemplateEntry(
      'endArrow=open;endSize=12;dashed=1;html=1;',
      160,
      0,
      'Use',
      'Dependency',
      null,
      'uml dependency use'
    ),
    this.createEdgeTemplateEntry(
      'endArrow=block;endSize=16;endFill=0;html=1;',
      160,
      0,
      'Extends',
      'Generalization',
      null,
      'uml generalization extend'
    ),
    this.createEdgeTemplateEntry(
      'endArrow=block;startArrow=block;endFill=1;startFill=1;html=1;',
      160,
      0,
      '',
      'Association 2',
      null,
      'uml association'
    ),
    this.createEdgeTemplateEntry(
      'endArrow=open;startArrow=circlePlus;endFill=0;startFill=0;endSize=8;html=1;',
      160,
      0,
      '',
      'Inner Class',
      null,
      'inner class'
    ),
    this.createEdgeTemplateEntry(
      'endArrow=open;startArrow=cross;endFill=0;startFill=0;endSize=8;startSize=10;html=1;',
      160,
      0,
      '',
      'Terminate',
      null,
      'terminate'
    ),
    this.createEdgeTemplateEntry(
      'endArrow=block;dashed=1;endFill=0;endSize=12;html=1;',
      160,
      0,
      '',
      'Implementation',
      null,
      'realization implementation'
    ),
    this.createEdgeTemplateEntry(
      'endArrow=diamondThin;endFill=0;endSize=24;html=1;',
      160,
      0,
      '',
      'Aggregation 2',
      null,
      'aggregation'
    ),
    this.createEdgeTemplateEntry(
      'endArrow=diamondThin;endFill=1;endSize=24;html=1;',
      160,
      0,
      '',
      'Composition 2',
      null,
      'composition'
    ),
    this.createEdgeTemplateEntry(
      'endArrow=open;endFill=1;endSize=12;html=1;',
      160,
      0,
      '',
      'Association 3',
      null,
      'association'
    )
  ]

  this.addPaletteFunctions('uml', MxResources.get('uml'), expand || false, fns)
}

/**
 * Adds the BPMN library to the sidebar.
 */
Sidebar.prototype.addBpmnPalette = function(dir, expand) {
  // Avoids having to bind all functions to "this"
  let sb = this

  let fns = [
    this.createVertexTemplateEntry(
      'shape=ext;rounded=1;html=1;whiteSpace=wrap;',
      120,
      80,
      'Task',
      'Process',
      null,
      null,
      'bpmn task process'
    ),
    this.createVertexTemplateEntry(
      'shape=ext;rounded=1;html=1;whiteSpace=wrap;double=1;',
      120,
      80,
      'Transaction',
      'Transaction',
      null,
      null,
      'bpmn transaction'
    ),
    this.createVertexTemplateEntry(
      'shape=ext;rounded=1;html=1;whiteSpace=wrap;dashed=1;dashPattern=1 4;',
      120,
      80,
      'Event\nSub-Process',
      'Event Sub-Process',
      null,
      null,
      'bpmn event subprocess sub process sub-process'
    ),
    this.createVertexTemplateEntry(
      'shape=ext;rounded=1;html=1;whiteSpace=wrap;strokeWidth=3;',
      120,
      80,
      'Call Activity',
      'Call Activity',
      null,
      null,
      'bpmn call activity'
    ),
    this.addEntry('bpmn subprocess sub process sub-process', function() {
      let cell = new MxCell(
        'Sub-Process',
        new MxGeometry(0, 0, 120, 80),
        'html=1;whiteSpace=wrap;rounded=1;'
      )
      cell.vertex = true

      let cell1 = new MxCell(
        '',
        new MxGeometry(0.5, 1, 14, 14),
        'html=1;shape=plus;'
      )
      cell1.vertex = true
      cell1.geometry.relative = true
      cell1.geometry.offset = new MxPoint(-7, -14)
      cell.insert(cell1)

      return sb.createVertexTemplateFromCells(
        [cell],
        cell.geometry.width,
        cell.geometry.height,
        'Sub-Process'
      )
    }),
    this.addEntry(
      this.getTagsForStencil(
        'mxgraph.bpmn',
        'loop',
        'subprocess sub process sub-process looped'
      ).join(' '),
      function() {
        let cell = new MxCell(
          'Looped\nSub-Process',
          new MxGeometry(0, 0, 120, 80),
          'html=1;whiteSpace=wrap;rounded=1'
        )
        cell.vertex = true

        let cell1 = new MxCell(
          '',
          new MxGeometry(0.5, 1, 14, 14),
          'html=1;shape=mxgraph.bpmn.loop;'
        )
        cell1.vertex = true
        cell1.geometry.relative = true
        cell1.geometry.offset = new MxPoint(-15, -14)
        cell.insert(cell1)

        let cell2 = new MxCell(
          '',
          new MxGeometry(0.5, 1, 14, 14),
          'html=1;shape=plus;'
        )
        cell2.vertex = true
        cell2.geometry.relative = true
        cell2.geometry.offset = new MxPoint(1, -14)
        cell.insert(cell2)

        return sb.createVertexTemplateFromCells(
          [cell],
          cell.geometry.width,
          cell.geometry.height,
          'Looped Sub-Process'
        )
      }
    ),
    this.addEntry('bpmn receive task', function() {
      let cell = new MxCell(
        'Receive',
        new MxGeometry(0, 0, 120, 80),
        'html=1;whiteSpace=wrap;rounded=1;'
      )
      cell.vertex = true

      let cell1 = new MxCell(
        '',
        new MxGeometry(0, 0, 20, 14),
        'html=1;shape=message;'
      )
      cell1.vertex = true
      cell1.geometry.relative = true
      cell1.geometry.offset = new MxPoint(7, 7)
      cell.insert(cell1)

      return sb.createVertexTemplateFromCells(
        [cell],
        cell.geometry.width,
        cell.geometry.height,
        'Receive Task'
      )
    }),
    this.addEntry(
      this.getTagsForStencil('mxgraph.bpmn', 'user_task').join(' '),
      function() {
        let cell = new MxCell(
          'User',
          new MxGeometry(0, 0, 120, 80),
          'html=1;whiteSpace=wrap;rounded=1;'
        )
        cell.vertex = true

        let cell1 = new MxCell(
          '',
          new MxGeometry(0, 0, 14, 14),
          'html=1;shape=mxgraph.bpmn.user_task;'
        )
        cell1.vertex = true
        cell1.geometry.relative = true
        cell1.geometry.offset = new MxPoint(7, 7)
        cell.insert(cell1)

        let cell2 = new MxCell(
          '',
          new MxGeometry(0.5, 1, 14, 14),
          'html=1;shape=plus;'
        )
        cell2.vertex = true
        cell2.geometry.relative = true
        cell2.geometry.offset = new MxPoint(-7, -14)
        cell.insert(cell2)

        return sb.createVertexTemplateFromCells(
          [cell],
          cell.geometry.width,
          cell.geometry.height,
          'User Task'
        )
      }
    ),
    this.addEntry(
      this.getTagsForStencil('mxgraph.bpmn', 'timer_start', 'attached').join(
        ' '
      ),
      function() {
        let cell = new MxCell(
          'Process',
          new MxGeometry(0, 0, 120, 80),
          'html=1;whiteSpace=wrap;rounded=1;'
        )
        cell.vertex = true

        let cell1 = new MxCell(
          '',
          new MxGeometry(1, 1, 30, 30),
          'shape=mxgraph.bpmn.timer_start;perimeter=ellipsePerimeter;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;'
        )
        cell1.vertex = true
        cell1.geometry.relative = true
        cell1.geometry.offset = new MxPoint(-40, -15)
        cell.insert(cell1)

        return sb.createVertexTemplateFromCells(
          [cell],
          120,
          95,
          'Attached Timer Event 1'
        )
      }
    ),
    this.addEntry(
      this.getTagsForStencil('mxgraph.bpmn', 'timer_start', 'attached').join(
        ' '
      ),
      function() {
        let cell = new MxCell(
          'Process',
          new MxGeometry(0, 0, 120, 80),
          'html=1;whiteSpace=wrap;rounded=1;'
        )
        cell.vertex = true

        let cell1 = new MxCell(
          '',
          new MxGeometry(1, 0, 30, 30),
          'shape=mxgraph.bpmn.timer_start;perimeter=ellipsePerimeter;html=1;labelPosition=right;labelBackgroundColor=#ffffff;align=left;'
        )
        cell1.vertex = true
        cell1.geometry.relative = true
        cell1.geometry.offset = new MxPoint(-15, 10)
        cell.insert(cell1)

        return sb.createVertexTemplateFromCells(
          [cell],
          135,
          80,
          'Attached Timer Event 2'
        )
      }
    ),
    this.createVertexTemplateEntry(
      'swimlane;html=1;horizontal=0;startSize=20;',
      320,
      240,
      'Pool',
      'Pool',
      null,
      null,
      'bpmn pool'
    ),
    this.createVertexTemplateEntry(
      'swimlane;html=1;horizontal=0;swimlaneFillColor=white;swimlaneLine=0;',
      300,
      120,
      'Lane',
      'Lane',
      null,
      null,
      'bpmn lane'
    ),
    this.createVertexTemplateEntry(
      'shape=hexagon;html=1;whiteSpace=wrap;perimeter=hexagonPerimeter;',
      60,
      50,
      '',
      'Conversation',
      null,
      null,
      'bpmn conversation'
    ),
    this.createVertexTemplateEntry(
      'shape=hexagon;html=1;whiteSpace=wrap;perimeter=hexagonPerimeter;strokeWidth=4',
      60,
      50,
      '',
      'Call Conversation',
      null,
      null,
      'bpmn call conversation'
    ),
    this.addEntry(
      'bpmn subconversation sub conversation sub-conversation',
      function() {
        let cell = new MxCell(
          '',
          new MxGeometry(0, 0, 60, 50),
          'shape=hexagon;whiteSpace=wrap;html=1;perimeter=hexagonPerimeter;'
        )
        cell.vertex = true

        let cell1 = new MxCell(
          '',
          new MxGeometry(0.5, 1, 14, 14),
          'html=1;shape=plus;'
        )
        cell1.vertex = true
        cell1.geometry.relative = true
        cell1.geometry.offset = new MxPoint(-7, -14)
        cell.insert(cell1)

        return sb.createVertexTemplateFromCells(
          [cell],
          cell.geometry.width,
          cell.geometry.height,
          'Sub-Conversation'
        )
      }
    ),
    this.addEntry('bpmn data object', function() {
      let cell = new MxCell(
        '',
        new MxGeometry(0, 0, 40, 60),
        'shape=note;whiteSpace=wrap;size=16;html=1;'
      )
      cell.vertex = true

      let cell1 = new MxCell(
        '',
        new MxGeometry(0, 0, 14, 14),
        'html=1;shape=singleArrow;arrowWidth=0.4;arrowSize=0.4;'
      )
      cell1.vertex = true
      cell1.geometry.relative = true
      cell1.geometry.offset = new MxPoint(2, 2)
      cell.insert(cell1)

      let cell2 = new MxCell(
        '',
        new MxGeometry(0.5, 1, 14, 14),
        'html=1;whiteSpace=wrap;shape=parallelMarker;'
      )
      cell2.vertex = true
      cell2.geometry.relative = true
      cell2.geometry.offset = new MxPoint(-7, -14)
      cell.insert(cell2)

      return sb.createVertexTemplateFromCells(
        [cell],
        cell.geometry.width,
        cell.geometry.height,
        'Data Object'
      )
    }),
    this.createVertexTemplateEntry(
      'shape=datastore;whiteSpace=wrap;html=1;',
      60,
      60,
      '',
      'Data Store',
      null,
      null,
      'bpmn data store'
    ),
    this.createVertexTemplateEntry(
      'shape=plus;html=1;',
      14,
      14,
      '',
      'Sub-Process Marker',
      null,
      null,
      'bpmn subprocess sub process sub-process marker'
    ),
    this.createVertexTemplateEntry(
      'shape=mxgraph.bpmn.loop;html=1;',
      14,
      14,
      '',
      'Loop Marker',
      null,
      null,
      'bpmn loop marker'
    ),
    this.createVertexTemplateEntry(
      'shape=parallelMarker;html=1;',
      14,
      14,
      '',
      'Parallel MI Marker',
      null,
      null,
      'bpmn parallel mi marker'
    ),
    this.createVertexTemplateEntry(
      'shape=parallelMarker;direction=south;html=1;',
      14,
      14,
      '',
      'Sequential MI Marker',
      null,
      null,
      'bpmn sequential mi marker'
    ),
    this.createVertexTemplateEntry(
      'shape=mxgraph.bpmn.ad_hoc;fillColor=#000000;html=1;',
      14,
      14,
      '',
      'Ad Hoc Marker',
      null,
      null,
      'bpmn ad hoc marker'
    ),
    this.createVertexTemplateEntry(
      'shape=mxgraph.bpmn.compensation;html=1;',
      14,
      14,
      '',
      'Compensation Marker',
      null,
      null,
      'bpmn compensation marker'
    ),
    this.createVertexTemplateEntry(
      'shape=message;whiteSpace=wrap;html=1;fillColor=#000000;strokeColor=#ffffff;strokeWidth=2;',
      40,
      30,
      '',
      'Send Task',
      null,
      null,
      'bpmn send task'
    ),
    this.createVertexTemplateEntry(
      'shape=message;whiteSpace=wrap;html=1;',
      40,
      30,
      '',
      'Receive Task',
      null,
      null,
      'bpmn receive task'
    ),
    this.createVertexTemplateEntry(
      'shape=mxgraph.bpmn.user_task;html=1;',
      14,
      14,
      '',
      'User Task',
      null,
      null,
      this.getTagsForStencil('mxgraph.bpmn', 'user_task').join(' ')
    ),
    this.createVertexTemplateEntry(
      'shape=mxgraph.bpmn.manual_task;html=1;',
      14,
      14,
      '',
      'Manual Task',
      null,
      null,
      this.getTagsForStencil('mxgraph.bpmn', 'user_task').join(' ')
    ),
    this.createVertexTemplateEntry(
      'shape=mxgraph.bpmn.business_rule_task;html=1;',
      14,
      14,
      '',
      'Business Rule Task',
      null,
      null,
      this.getTagsForStencil('mxgraph.bpmn', 'business_rule_task').join(' ')
    ),
    this.createVertexTemplateEntry(
      'shape=mxgraph.bpmn.service_task;html=1;',
      14,
      14,
      '',
      'Service Task',
      null,
      null,
      this.getTagsForStencil('mxgraph.bpmn', 'service_task').join(' ')
    ),
    this.createVertexTemplateEntry(
      'shape=mxgraph.bpmn.script_task;html=1;',
      14,
      14,
      '',
      'Script Task',
      null,
      null,
      this.getTagsForStencil('mxgraph.bpmn', 'script_task').join(' ')
    ),
    this.createVertexTemplateEntry(
      'html=1;shape=mxgraph.flowchart.annotation_2;align=left;',
      50,
      100,
      '',
      'Annotation',
      null,
      null,
      this.getTagsForStencil(
        'bpmn',
        'annotation_1',
        'bpmn business process model '
      ).join(' ')
    ),
    this.createVertexTemplateEntry(
      'rounded=1;arcSize=10;dashed=1;strokeColor=#000000;fillColor=none;gradientColor=none;dashPattern=8 3 1 3;strokeWidth=2;',
      200,
      200,
      '',
      'Group',
      null,
      null,
      this.getTagsForStencil(
        'bpmn',
        'group',
        'bpmn business process model '
      ).join(' ')
    ),
    this.createEdgeTemplateEntry(
      'endArrow=block;endFill=1;endSize=6;html=1;',
      100,
      0,
      '',
      'Sequence Flow',
      null,
      'bpmn sequence flow'
    ),
    this.createEdgeTemplateEntry(
      'startArrow=dash;startSize=8;endArrow=block;endFill=1;endSize=6;html=1;',
      100,
      0,
      '',
      'Default Flow',
      null,
      'bpmn default flow'
    ),
    this.createEdgeTemplateEntry(
      'startArrow=diamondThin;startFill=0;startSize=14;endArrow=block;endFill=1;endSize=6;html=1;',
      100,
      0,
      '',
      'Conditional Flow',
      null,
      'bpmn conditional flow'
    ),
    this.createEdgeTemplateEntry(
      'startArrow=oval;startFill=0;startSize=7;endArrow=block;endFill=0;endSize=10;dashed=1;html=1;',
      100,
      0,
      '',
      'Message Flow 1',
      null,
      'bpmn message flow'
    ),
    this.addEntry('bpmn message flow', function() {
      let edge = new MxCell(
        '',
        new MxGeometry(0, 0, 0, 0),
        'startArrow=oval;startFill=0;startSize=7;endArrow=block;endFill=0;endSize=10;dashed=1;html=1;'
      )
      edge.geometry.setTerminalPoint(new MxPoint(0, 0), true)
      edge.geometry.setTerminalPoint(new MxPoint(100, 0), false)
      edge.geometry.relative = true
      edge.edge = true

      let cell = new MxCell(
        '',
        new MxGeometry(0, 0, 20, 14),
        'shape=message;html=1;'
      )
      cell.geometry.relative = true
      cell.setConnectable(false)
      cell.vertex = true
      cell.geometry.offset = new MxPoint(-10, -7)
      edge.insert(cell)

      return sb.createEdgeTemplateFromCells([edge], 100, 0, 'Message Flow 2')
    }),
    this.createEdgeTemplateEntry(
      'shape=link;html=1;',
      100,
      0,
      '',
      'Link',
      null,
      'bpmn link'
    )
  ]

  this.addPaletteFunctions(
    'bpmn',
    'BPMN ' + MxResources.get('general'),
    false,
    fns
  )
}

/**
 * Creates and returns the given title element.
 */
Sidebar.prototype.createTitle = function(label) {
  let elt = document.createElement('a')
  elt.setAttribute('href', 'javascript:void(0);')
  elt.setAttribute('title', MxResources.get('sidebarTooltip'))
  elt.className = 'geTitle'
  MxUtils.write(elt, label)

  return elt
}

/**
 * Creates a thumbnail for the given cells.
 */
Sidebar.prototype.createThumb = function(
  cells,
  width,
  height,
  parent,
  title,
  showLabel,
  showTitle,
  realWidth,
  realHeight
) {
  this.graph.labelsVisible = showLabel === null || showLabel
  let fo = MxClient.NO_FO
  MxClient.NO_FO = Editor.prototype.originalNoForeignObject
  this.graph.view.scaleAndTranslate(1, 0, 0)
  this.graph.addCells(cells)
  let bounds = this.graph.getGraphBounds()
  let s =
    Math.floor(
      Math.min(
        (width - 2 * this.thumbBorder) / bounds.width,
        (height - 2 * this.thumbBorder) / bounds.height
      ) * 100
    ) / 100
  this.graph.view.scaleAndTranslate(
    s,
    Math.floor((width - bounds.width * s) / 2 / s - bounds.x),
    Math.floor((height - bounds.height * s) / 2 / s - bounds.y)
  )
  let node = null

  // For supporting HTML labels in IE9 standards mode the container is cloned instead
  if (this.graph.dialect === MxConstants.DIALECT_SVG && !MxClient.NO_FO) {
    node = this.graph.view.getCanvas().ownerSVGElement.cloneNode(true)
  } else {
    // LATER: Check if deep clone can be used for quirks if container in DOM
    node = this.graph.container.cloneNode(false)
    node.innerHTML = this.graph.container.innerHTML

    // Workaround for clipping in older IE versions
    if (MxClient.IS_QUIRKS || document.documentMode === 8) {
      node.firstChild.style.overflow = 'visible'
    }
  }

  this.graph.getModel().clear()
  MxClient.NO_FO = fo

  // Catch-all event handling
  if (MxClient.IS_IE6) {
    parent.style.backgroundImage =
      'url(' + this.editorUi.editor.transparentImage + ')'
  }

  node.style.position = 'relative'
  node.style.overflow = 'hidden'
  node.style.cursor = 'move'
  node.style.left = this.thumbBorder + 'px'
  node.style.top = this.thumbBorder + 'px'
  node.style.width = width + 'px'
  node.style.height = height + 'px'
  node.style.visibility = ''
  node.style.minWidth = ''
  node.style.minHeight = ''

  parent.appendChild(node)

  // Adds title for sidebar entries
  if (this.sidebarTitles && title !== null && showTitle !== false) {
    let border = MxClient.IS_QUIRKS ? 2 * this.thumbPadding + 2 : 0
    parent.style.height =
      this.thumbHeight + border + this.sidebarTitleSize + 8 + 'px'

    let div = document.createElement('div')
    div.style.fontSize = this.sidebarTitleSize + 'px'
    div.style.color = '#303030'
    div.style.textAlign = 'center'
    div.style.whiteSpace = 'nowrap'

    if (MxClient.IS_IE) {
      div.style.height = this.sidebarTitleSize + 12 + 'px'
    }

    div.style.paddingTop = '4px'
    MxUtils.write(div, title)
    parent.appendChild(div)
  }

  return bounds
}

/**
 * Creates and returns a new palette item for the given image.
 */
Sidebar.prototype.createItem = function(
  cells,
  title,
  showLabel,
  showTitle,
  width,
  height,
  allowCellsInserted
) {
  let elt = document.createElement('a')
  elt.setAttribute('href', 'javascript:void(0);')
  elt.className = 'geItem'
  elt.style.overflow = 'hidden'
  let border = MxClient.IS_QUIRKS
    ? 8 + 2 * this.thumbPadding
    : 2 * this.thumbBorder
  elt.style.width = this.thumbWidth + border + 'px'
  elt.style.height = this.thumbHeight + border + 'px'
  elt.style.padding = this.thumbPadding + 'px'

  if (MxClient.IS_IE6) {
    elt.style.border = 'none'
  }

  // Blocks default click action
  MxEvent.addListener(elt, 'click', function(evt) {
    MxEvent.consume(evt)
  })

  this.createThumb(
    cells,
    this.thumbWidth,
    this.thumbHeight,
    elt,
    title,
    showLabel,
    showTitle,
    width,
    height
  )
  let bounds = new MxRectangle(0, 0, width, height)

  if (cells.length > 1 || cells[0].vertex) {
    let ds = this.createDragSource(
      elt,
      this.createDropHandler(cells, true, allowCellsInserted, bounds),
      this.createDragPreview(width, height),
      cells,
      bounds
    )
    this.addClickHandler(elt, ds, cells)

    // Uses guides for vertices only if enabled in graph
    ds.isGuidesEnabled = MxUtils.bind(this, function() {
      return this.editorUi.editor.graph.graphHandler.guidesEnabled
    })
  } else if (cells[0] !== null && cells[0].edge) {
    let ds = this.createDragSource(
      elt,
      this.createDropHandler(cells, false, allowCellsInserted, bounds),
      this.createDragPreview(width, height),
      cells,
      bounds
    )
    this.addClickHandler(elt, ds, cells)
  }

  // Shows a tooltip with the rendered cell
  if (!MxClient.IS_IOS) {
    MxEvent.addGestureListeners(
      elt,
      null,
      MxUtils.bind(this, function(evt) {
        if (MxEvent.isMouseEvent(evt)) {
          this.showTooltip(
            elt,
            cells,
            bounds.width,
            bounds.height,
            title,
            showLabel
          )
        }
      })
    )
  }

  return elt
}

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.updateShapes = function(source, targets) {
  let graph = this.editorUi.editor.graph
  let sourceCellStyle = graph.getCellStyle(source)
  let result = []

  graph.model.beginUpdate()
  try {
    let cellStyle = graph.getModel().getStyle(source)

    // Lists the styles to carry over from the existing shape
    let styles = [
      'shadow',
      'dashed',
      'dashPattern',
      'fontFamily',
      'fontSize',
      'fontColor',
      'align',
      'startFill',
      'startSize',
      'endFill',
      'endSize',
      'strokeColor',
      'strokeWidth',
      'fillColor',
      'gradientColor',
      'html',
      'part',
      'noEdgeStyle',
      'edgeStyle',
      'elbow',
      'childLayout',
      'recursiveResize',
      'container',
      'collapsible',
      'connectable'
    ]

    for (let i = 0; i < targets.length; i++) {
      let targetCell = targets[i]

      if (
        graph.getModel().isVertex(targetCell) ===
          graph.getModel().isVertex(source) ||
        graph.getModel().isEdge(targetCell) === graph.getModel().isEdge(source)
      ) {
        let state = graph.view.getState(targetCell)
        let style =
          state !== null ? state.style : graph.getCellStyle(targets[i])
        graph.getModel().setStyle(targetCell, cellStyle)

        // Removes all children of composite cells
        if (
          state !== null &&
          MxUtils.getValue(state.style, 'composite', '0') === '1'
        ) {
          let childCount = graph.model.getChildCount(targetCell)

          for (let j = childCount; j >= 0; j--) {
            graph.model.remove(graph.model.getChildAt(targetCell, j))
          }
        }

        if (style !== null) {
          // Replaces the participant style in the lifeline shape with the target shape
          if (
            style[MxConstants.STYLE_SHAPE] === 'umlLifeline' &&
            sourceCellStyle[MxConstants.STYLE_SHAPE] !== 'umlLifeline'
          ) {
            graph.setCellStyles(MxConstants.STYLE_SHAPE, 'umlLifeline', [
              targetCell
            ])
            graph.setCellStyles(
              'participant',
              sourceCellStyle[MxConstants.STYLE_SHAPE],
              [targetCell]
            )
          }

          for (let j = 0; j < styles.length; j++) {
            let value = style[styles[j]]

            if (value !== null) {
              graph.setCellStyles(styles[j], value, [targetCell])
            }
          }
        }

        result.push(targetCell)
      }
    }
  } finally {
    graph.model.endUpdate()
  }

  return result
}

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createDropHandler = function(
  cells,
  allowSplit,
  allowCellsInserted,
  bounds
) {
  allowCellsInserted = allowCellsInserted !== null ? allowCellsInserted : true

  return MxUtils.bind(this, function(graph, evt, target, x, y) {
    if (graph.isEnabled()) {
      cells = graph.getImportableCells(cells)

      if (cells.length > 0) {
        graph.stopEditing()

        // Holding alt while mouse is released ignores drop target
        let validDropTarget =
          target !== null && !MxEvent.isAltDown(evt)
            ? graph.isValidDropTarget(target, cells, evt)
            : false
        let select = null

        if (target !== null && !validDropTarget) {
          target = null
        }

        if (!graph.isCellLocked(target || graph.getDefaultParent())) {
          graph.model.beginUpdate()
          try {
            x = Math.round(x)
            y = Math.round(y)

            // Splits the target edge or inserts into target group
            if (allowSplit && graph.isSplitTarget(target, cells, evt)) {
              let clones = graph.cloneCells(cells)
              graph.splitEdge(
                target,
                clones,
                null,
                x - bounds.width / 2,
                y - bounds.height / 2
              )
              select = clones
            } else if (cells.length > 0) {
              select = graph.importCells(cells, x, y, target)
            }

            // Executes parent layout hooks for position/order
            if (graph.layoutManager !== null) {
              let layout = graph.layoutManager.getLayout(target)

              if (layout !== null) {
                let s = graph.view.scale
                let tr = graph.view.translate
                let tx = (x + tr.x) * s
                let ty = (y + tr.y) * s

                for (let i = 0; i < select.length; i++) {
                  layout.moveCell(select[i], tx, ty)
                }
              }
            }

            if (allowCellsInserted) {
              graph.fireEvent(
                new MxEventObject('cellsInserted', 'cells', select)
              )
            }
          } finally {
            graph.model.endUpdate()
          }

          if (select !== null && select.length > 0) {
            graph.scrollCellToVisible(select[0])
            graph.setSelectionCells(select)
          }
        }
      }

      MxEvent.consume(evt)
    }
  })
}

/**
 * Creates and returns a preview element for the given width and height.
 */
Sidebar.prototype.createDragPreview = function(width, height) {
  let elt = document.createElement('div')
  elt.style.border = this.dragPreviewBorder
  elt.style.width = width + 'px'
  elt.style.height = height + 'px'

  return elt
}

/**
 * Creates a drag source for the given element.
 */
Sidebar.prototype.dropAndConnect = function(
  source,
  targets,
  direction,
  dropCellIndex
) {
  let geo = this.getDropAndConnectGeometry(
    source,
    targets[dropCellIndex],
    direction,
    targets
  )

  // Targets without the new edge for selection
  let tmp = []

  if (geo !== null) {
    let graph = this.editorUi.editor.graph

    graph.model.beginUpdate()
    try {
      let sourceGeo = graph.getCellGeometry(source)
      let geo2 = graph.getCellGeometry(targets[dropCellIndex])

      // Handles special case where target should be ignored for stack layouts
      let targetParent = graph.model.getParent(source)
      let validLayout = true

      // Ignores parent if it has a stack layout
      if (graph.layoutManager !== null) {
        let layout = graph.layoutManager.getLayout(targetParent)

        // LATER: Use parent of parent if valid layout
        if (layout !== null && layout.constructor === MxStackLayout) {
          validLayout = false

          let tmp = graph.view.getState(targetParent)

          // Offsets by parent position
          if (tmp !== null) {
            let offset = new MxPoint(
              tmp.x / graph.view.scale - graph.view.translate.x,
              tmp.y / graph.view.scale - graph.view.translate.y
            )
            geo.x += offset.x
            geo.y += offset.y
            let pt = geo.getTerminalPoint(false)

            if (pt !== null) {
              pt.x += offset.x
              pt.y += offset.y
            }
          }
        }
      }

      let dx = geo2.x
      let dy = geo2.y

      // Ignores geometry of edges
      if (graph.model.isEdge(targets[dropCellIndex])) {
        dx = 0
        dy = 0
      }

      let useParent =
        graph.model.isEdge(source) ||
        (sourceGeo !== null && !sourceGeo.relative && validLayout)
      targets = graph.importCells(
        targets,
        geo.x - (useParent ? dx : 0),
        geo.y - (useParent ? dy : 0),
        useParent ? targetParent : null
      )
      tmp = targets

      if (graph.model.isEdge(source)) {
        // Adds new terminal to edge
        // LATER: Push new terminal out radially from edge start point
        graph.model.setTerminal(
          source,
          targets[dropCellIndex],
          direction === MxConstants.DIRECTION_NORTH
        )
      } else if (graph.model.isEdge(targets[dropCellIndex])) {
        // Adds new outgoing connection to vertex and clears points
        graph.model.setTerminal(targets[dropCellIndex], source, true)
        let geo3 = graph.getCellGeometry(targets[dropCellIndex])
        geo3.points = null

        if (geo3.getTerminalPoint(false) !== null) {
          geo3.setTerminalPoint(geo.getTerminalPoint(false), false)
        } else if (useParent && graph.model.isVertex(targetParent)) {
          // Adds parent offset to other nodes
          let tmpState = graph.view.getState(targetParent)
          let offset =
            tmpState.cell !== graph.view.currentRoot
              ? new MxPoint(
                tmpState.x / graph.view.scale - graph.view.translate.x,
                tmpState.y / graph.view.scale - graph.view.translate.y
              )
              : new MxPoint(0, 0)

          graph.cellsMoved(targets, offset.x, offset.y, null, null, true)
        }
      } else {
        geo2 = graph.getCellGeometry(targets[dropCellIndex])
        dx = geo.x - Math.round(geo2.x)
        dy = geo.y - Math.round(geo2.y)
        geo.x = Math.round(geo2.x)
        geo.y = Math.round(geo2.y)
        graph.model.setGeometry(targets[dropCellIndex], geo)
        graph.cellsMoved(targets, dx, dy, null, null, true)
        tmp = targets.slice()
        targets.push(
          graph.insertEdge(
            null,
            null,
            '',
            source,
            targets[dropCellIndex],
            graph.createCurrentEdgeStyle()
          )
        )
      }

      graph.fireEvent(new MxEventObject('cellsInserted', 'cells', targets))
    } finally {
      graph.model.endUpdate()
    }
  }

  return tmp
}

/**
 * Creates a drag source for the given element.
 */
Sidebar.prototype.getDropAndConnectGeometry = function(
  source,
  target,
  direction,
  targets
) {
  let graph = this.editorUi.editor.graph
  let view = graph.view
  let keepSize = targets.length > 1
  let geo = graph.getCellGeometry(source)
  let geo2 = graph.getCellGeometry(target)

  if (geo !== null && geo2 !== null) {
    geo2 = geo2.clone()

    if (graph.model.isEdge(source)) {
      let state = graph.view.getState(source)
      let pts = state.absolutePoints
      let p0 = pts[0]
      let pe = pts[pts.length - 1]

      if (direction === MxConstants.DIRECTION_NORTH) {
        geo2.x = p0.x / view.scale - view.translate.x - geo2.width / 2
        geo2.y = p0.y / view.scale - view.translate.y - geo2.height / 2
      } else {
        geo2.x = pe.x / view.scale - view.translate.x - geo2.width / 2
        geo2.y = pe.y / view.scale - view.translate.y - geo2.height / 2
      }
    } else {
      if (geo.relative) {
        let state = graph.view.getState(source)
        geo = geo.clone()
        geo.x = (state.x - view.translate.x) / view.scale
        geo.y = (state.y - view.translate.y) / view.scale
      }

      let length = graph.defaultEdgeLength

      // Maintains edge length
      if (
        graph.model.isEdge(target) &&
        geo2.getTerminalPoint(true) !== null &&
        geo2.getTerminalPoint(false) !== null
      ) {
        let p0 = geo2.getTerminalPoint(true)
        let pe = geo2.getTerminalPoint(false)
        let dx = pe.x - p0.x
        let dy = pe.y - p0.y

        length = Math.sqrt(dx * dx + dy * dy)

        geo2.x = geo.getCenterX()
        geo2.y = geo.getCenterY()
        geo2.width = 1
        geo2.height = 1

        if (direction === MxConstants.DIRECTION_NORTH) {
          geo2.height = length
          geo2.y = geo.y - length
          geo2.setTerminalPoint(new MxPoint(geo2.x, geo2.y), false)
        } else if (direction === MxConstants.DIRECTION_EAST) {
          geo2.width = length
          geo2.x = geo.x + geo.width
          geo2.setTerminalPoint(new MxPoint(geo2.x + geo2.width, geo2.y), false)
        } else if (direction === MxConstants.DIRECTION_SOUTH) {
          geo2.height = length
          geo2.y = geo.y + geo.height
          geo2.setTerminalPoint(
            new MxPoint(geo2.x, geo2.y + geo2.height),
            false
          )
        } else if (direction === MxConstants.DIRECTION_WEST) {
          geo2.width = length
          geo2.x = geo.x - length
          geo2.setTerminalPoint(new MxPoint(geo2.x, geo2.y), false)
        }
      } else {
        // Try match size or ignore if width or height < 45 which
        // is considered special enough to be ignored here
        if (
          !keepSize &&
          geo2.width > 45 &&
          geo2.height > 45 &&
          geo.width > 45 &&
          geo.height > 45
        ) {
          geo2.width = geo2.width * (geo.height / geo2.height)
          geo2.height = geo.height
        }

        geo2.x = geo.x + geo.width / 2 - geo2.width / 2
        geo2.y = geo.y + geo.height / 2 - geo2.height / 2

        if (direction === MxConstants.DIRECTION_NORTH) {
          geo2.y = geo2.y - geo.height / 2 - geo2.height / 2 - length
        } else if (direction === MxConstants.DIRECTION_EAST) {
          geo2.x = geo2.x + geo.width / 2 + geo2.width / 2 + length
        } else if (direction === MxConstants.DIRECTION_SOUTH) {
          geo2.y = geo2.y + geo.height / 2 + geo2.height / 2 + length
        } else if (direction === MxConstants.DIRECTION_WEST) {
          geo2.x = geo2.x - geo.width / 2 - geo2.width / 2 - length
        }

        // Adds offset to match cells without connecting edge
        if (
          graph.model.isEdge(target) &&
          geo2.getTerminalPoint(true) !== null &&
          target.getTerminal(false) !== null
        ) {
          let targetGeo = graph.getCellGeometry(target.getTerminal(false))

          if (targetGeo !== null) {
            if (direction === MxConstants.DIRECTION_NORTH) {
              geo2.x -= targetGeo.getCenterX()
              geo2.y -= targetGeo.getCenterY() + targetGeo.height / 2
            } else if (direction === MxConstants.DIRECTION_EAST) {
              geo2.x -= targetGeo.getCenterX() - targetGeo.width / 2
              geo2.y -= targetGeo.getCenterY()
            } else if (direction === MxConstants.DIRECTION_SOUTH) {
              geo2.x -= targetGeo.getCenterX()
              geo2.y -= targetGeo.getCenterY() - targetGeo.height / 2
            } else if (direction === MxConstants.DIRECTION_WEST) {
              geo2.x -= targetGeo.getCenterX() + targetGeo.width / 2
              geo2.y -= targetGeo.getCenterY()
            }
          }
        }
      }
    }
  }

  return geo2
}

/**
 * Creates a drag source for the given element.
 */
Sidebar.prototype.createDragSource = function(
  elt,
  dropHandler,
  preview,
  cells,
  bounds
) {
  // Checks if the cells contain any vertices
  let ui = this.editorUi
  let graph = ui.editor.graph
  let freeSourceEdge = null
  let firstVertex = null
  let sidebar = this

  for (let i = 0; i < cells.length; i++) {
    if (
      firstVertex === null &&
      this.editorUi.editor.graph.model.isVertex(cells[i])
    ) {
      firstVertex = i
    } else if (
      freeSourceEdge === null &&
      this.editorUi.editor.graph.model.isEdge(cells[i]) &&
      this.editorUi.editor.graph.model.getTerminal(cells[i], true) === null
    ) {
      freeSourceEdge = i
    }

    if (firstVertex !== null && freeSourceEdge !== null) {
      break
    }
  }

  let dragSource = MxUtils.makeDraggable(
    elt,
    this.editorUi.editor.graph,
    MxUtils.bind(this, function(graph, evt, target, x, y) {
      if (this.updateThread !== null) {
        window.clearTimeout(this.updateThread)
      }

      if (
        cells !== null &&
        currentStyleTarget !== null &&
        activeArrow === styleTarget
      ) {
        let tmp = graph.isCellSelected(currentStyleTarget.cell)
          ? graph.getSelectionCells()
          : [currentStyleTarget.cell]
        let updatedCells = this.updateShapes(
          graph.model.isEdge(currentStyleTarget.cell)
            ? cells[0]
            : cells[firstVertex],
          tmp
        )
        graph.setSelectionCells(updatedCells)
      } else if (
        cells !== null &&
        activeArrow !== null &&
        currentTargetState !== null &&
        activeArrow !== styleTarget
      ) {
        let index =
          graph.model.isEdge(currentTargetState.cell) || freeSourceEdge === null
            ? firstVertex
            : freeSourceEdge
        graph.setSelectionCells(
          this.dropAndConnect(currentTargetState.cell, cells, direction, index)
        )
      } else {
        dropHandler.apply(this, arguments)
      }

      if (this.editorUi.hoverIcons !== null) {
        this.editorUi.hoverIcons.update(
          graph.view.getState(graph.getSelectionCell())
        )
      }
    }),
    preview,
    0,
    0,
    this.editorUi.editor.graph.autoscroll,
    true,
    true
  )

  // Stops dragging if cancel is pressed
  this.editorUi.editor.graph.addListener(MxEvent.ESCAPE, function(sender, evt) {
    if (dragSource.isActive()) {
      dragSource.reset()
    }
  })

  // Overrides mouseDown to ignore popup triggers
  let mouseDown = dragSource.mouseDown

  dragSource.mouseDown = function(evt) {
    if (!MxEvent.isPopupTrigger(evt) && !MxEvent.isMultiTouchEvent(evt)) {
      graph.stopEditing()
      mouseDown.apply(this, arguments)
    }
  }

  // Workaround for event redirection via image tag in quirks and IE8
  function createArrow(img, tooltip) {
    let arrow = null

    if (MxClient.IS_IE && !MxClient.IS_SVG) {
      // Workaround for PNG images in IE6
      if (MxClient.IS_IE6 && document.compatMode !== 'CSS1Compat') {
        arrow = document.createElement(MxClient.VML_PREFIX + ':image')
        arrow.setAttribute('src', img.src)
        arrow.style.borderStyle = 'none'
      } else {
        arrow = document.createElement('div')
        arrow.style.backgroundImage = 'url(' + img.src + ')'
        arrow.style.backgroundPosition = 'center'
        arrow.style.backgroundRepeat = 'no-repeat'
      }

      arrow.style.width = img.width + 4 + 'px'
      arrow.style.height = img.height + 4 + 'px'
      arrow.style.display = MxClient.IS_QUIRKS ? 'inline' : 'inline-block'
    } else {
      arrow = MxUtils.createImage(img.src)
      arrow.style.width = img.width + 'px'
      arrow.style.height = img.height + 'px'
    }

    if (tooltip !== null) {
      arrow.setAttribute('title', tooltip)
    }

    MxUtils.setOpacity(arrow, img === this.refreshTarget ? 30 : 20)
    arrow.style.position = 'absolute'
    arrow.style.cursor = 'crosshair'

    return arrow
  }

  let currentTargetState = null
  let currentStateHandle = null
  let currentStyleTarget = null
  let activeTarget = false

  let arrowUp = createArrow(this.triangleUp, MxResources.get('connect'))
  let arrowRight = createArrow(this.triangleRight, MxResources.get('connect'))
  let arrowDown = createArrow(this.triangleDown, MxResources.get('connect'))
  let arrowLeft = createArrow(this.triangleLeft, MxResources.get('connect'))
  let styleTarget = createArrow(this.refreshTarget, MxResources.get('replace'))
  // Workaround for actual parentNode not being updated in old IE
  let styleTargetParent = null
  let roundSource = createArrow(this.roundDrop)
  let roundTarget = createArrow(this.roundDrop)
  let direction = MxConstants.DIRECTION_NORTH
  let activeArrow = null

  function checkArrow(x, y, bounds, arrow) {
    if (arrow.parentNode !== null) {
      if (MxUtils.contains(bounds, x, y)) {
        MxUtils.setOpacity(arrow, 100)
        activeArrow = arrow
      } else {
        MxUtils.setOpacity(arrow, arrow === styleTarget ? 30 : 20)
      }
    }

    return bounds
  }

  // Hides guides and preview if target is active
  let dsCreatePreviewElement = dragSource.createPreviewElement

  // Stores initial size of preview element
  dragSource.createPreviewElement = function(graph) {
    let elt = dsCreatePreviewElement.apply(this, arguments)

    // Pass-through events required to tooltip on replace shape
    if (MxClient.IS_SVG) {
      elt.style.pointerEvents = 'none'
    }

    this.previewElementWidth = elt.style.width
    this.previewElementHeight = elt.style.height

    return elt
  }

  // Shows/hides hover icons
  let dragEnter = dragSource.dragEnter
  dragSource.dragEnter = function(graph, evt) {
    if (ui.hoverIcons !== null) {
      ui.hoverIcons.setDisplay('none')
    }

    dragEnter.apply(this, arguments)
  }

  let dragExit = dragSource.dragExit
  dragSource.dragExit = function(graph, evt) {
    if (ui.hoverIcons !== null) {
      ui.hoverIcons.setDisplay('')
    }

    dragExit.apply(this, arguments)
  }

  dragSource.dragOver = function(graph, evt) {
    MxDragSource.prototype.dragOver.apply(this, arguments)

    if (this.currentGuide !== null && activeArrow !== null) {
      this.currentGuide.hide()
    }

    if (this.previewElement !== null) {
      let view = graph.view

      if (currentStyleTarget !== null && activeArrow === styleTarget) {
        this.previewElement.style.display = graph.model.isEdge(
          currentStyleTarget.cell
        )
          ? 'none'
          : ''

        this.previewElement.style.left = currentStyleTarget.x + 'px'
        this.previewElement.style.top = currentStyleTarget.y + 'px'
        this.previewElement.style.width = currentStyleTarget.width + 'px'
        this.previewElement.style.height = currentStyleTarget.height + 'px'
      } else if (currentTargetState !== null && activeArrow !== null) {
        let index =
          graph.model.isEdge(currentTargetState.cell) || freeSourceEdge === null
            ? firstVertex
            : freeSourceEdge
        let geo = sidebar.getDropAndConnectGeometry(
          currentTargetState.cell,
          cells[index],
          direction,
          cells
        )
        let geo2 = !graph.model.isEdge(currentTargetState.cell)
          ? graph.getCellGeometry(currentTargetState.cell)
          : null
        let geo3 = graph.getCellGeometry(cells[index])
        let parent = graph.model.getParent(currentTargetState.cell)
        let dx = view.translate.x * view.scale
        let dy = view.translate.y * view.scale

        if (
          geo2 !== null &&
          !geo2.relative &&
          graph.model.isVertex(parent) &&
          parent !== view.currentRoot
        ) {
          let pState = view.getState(parent)

          dx = pState.x
          dy = pState.y
        }

        let dx2 = geo3.x
        let dy2 = geo3.y

        // Ignores geometry of edges
        if (graph.model.isEdge(cells[index])) {
          dx2 = 0
          dy2 = 0
        }

        // Shows preview at drop location
        this.previewElement.style.left = (geo.x - dx2) * view.scale + dx + 'px'
        this.previewElement.style.top = (geo.y - dy2) * view.scale + dy + 'px'

        if (cells.length === 1) {
          this.previewElement.style.width = geo.width * view.scale + 'px'
          this.previewElement.style.height = geo.height * view.scale + 'px'
        }

        this.previewElement.style.display = ''
      } else if (
        dragSource.currentHighlight.state !== null &&
        graph.model.isEdge(dragSource.currentHighlight.state.cell)
      ) {
        // Centers drop cells when splitting edges
        this.previewElement.style.left =
          Math.round(
            parseInt(this.previewElement.style.left) -
              (bounds.width * view.scale) / 2
          ) + 'px'
        this.previewElement.style.top =
          Math.round(
            parseInt(this.previewElement.style.top) -
              (bounds.height * view.scale) / 2
          ) + 'px'
      } else {
        this.previewElement.style.width = this.previewElementWidth
        this.previewElement.style.height = this.previewElementHeight
        this.previewElement.style.display = ''
      }
    }
  }

  let startTime = new Date().getTime()
  let timeOnTarget = 0
  let prev = null

  // Gets source cell style to compare shape below
  let sourceCellStyle = this.editorUi.editor.graph.getCellStyle(cells[0])

  // Allows drop into cell only if target is a valid root
  dragSource.getDropTarget = MxUtils.bind(this, function(graph, x, y, evt) {
    // Alt means no targets at all
    // LATER: Show preview where result will go
    let cell =
      !MxEvent.isAltDown(evt) && cells !== null ? graph.getCellAt(x, y) : null

    // Uses connectable parent vertex if one exists
    if (cell !== null && !this.graph.isCellConnectable(cell)) {
      let parent = this.graph.getModel().getParent(cell)

      if (
        this.graph.getModel().isVertex(parent) &&
        this.graph.isCellConnectable(parent)
      ) {
        cell = parent
      }
    }

    // Ignores locked cells
    if (graph.isCellLocked(cell)) {
      cell = null
    }

    let state = graph.view.getState(cell)
    activeArrow = null
    let bbox = null

    // Time on target
    if (prev !== state) {
      prev = state
      startTime = new Date().getTime()
      timeOnTarget = 0

      if (this.updateThread !== null) {
        window.clearTimeout(this.updateThread)
      }

      if (state !== null) {
        this.updateThread = window.setTimeout(function() {
          if (activeArrow === null) {
            prev = state
            dragSource.getDropTarget(graph, x, y, evt)
          }
        }, this.dropTargetDelay + 10)
      }
    } else {
      timeOnTarget = new Date().getTime() - startTime
    }

    // Shift means disabled, delayed on cells with children, shows after this.dropTargetDelay, hides after 2500ms
    if (
      timeOnTarget < 2500 &&
      state !== null &&
      !MxEvent.isShiftDown(evt) &&
      // If shape is equal or target has no stroke, fill and gradient then use longer delay except for images
      ((MxUtils.getValue(state.style, MxConstants.STYLE_SHAPE) !==
        MxUtils.getValue(sourceCellStyle, MxConstants.STYLE_SHAPE) &&
        (MxUtils.getValue(
          state.style,
          MxConstants.STYLE_STROKECOLOR,
          MxConstants.NONE
        ) !== MxConstants.NONE ||
          MxUtils.getValue(
            state.style,
            MxConstants.STYLE_FILLCOLOR,
            MxConstants.NONE
          ) !== MxConstants.NONE ||
          MxUtils.getValue(
            state.style,
            MxConstants.STYLE_GRADIENTCOLOR,
            MxConstants.NONE
          ) !== MxConstants.NONE)) ||
        MxUtils.getValue(sourceCellStyle, MxConstants.STYLE_SHAPE) ===
          'image' ||
        timeOnTarget > 1500 ||
        graph.model.isEdge(state.cell)) &&
      timeOnTarget > this.dropTargetDelay &&
      ((graph.model.isVertex(state.cell) && firstVertex !== null) ||
        (graph.model.isEdge(state.cell) && graph.model.isEdge(cells[0])))
    ) {
      currentStyleTarget = state
      let tmp = graph.model.isEdge(state.cell)
        ? graph.view.getPoint(state)
        : new MxPoint(state.getCenterX(), state.getCenterY())
      tmp = new MxRectangle(
        tmp.x - this.refreshTarget.width / 2,
        tmp.y - this.refreshTarget.height / 2,
        this.refreshTarget.width,
        this.refreshTarget.height
      )

      styleTarget.style.left = Math.floor(tmp.x) + 'px'
      styleTarget.style.top = Math.floor(tmp.y) + 'px'

      if (styleTargetParent === null) {
        graph.container.appendChild(styleTarget)
        styleTargetParent = styleTarget.parentNode
      }

      checkArrow(x, y, tmp, styleTarget)
    } else if (
      // Does not reset on ignored edges
      currentStyleTarget === null ||
      !MxUtils.contains(currentStyleTarget, x, y) ||
      (timeOnTarget > 1500 && !MxEvent.isShiftDown(evt))
    ) {
      currentStyleTarget = null

      if (styleTargetParent !== null) {
        styleTarget.parentNode.removeChild(styleTarget)
        styleTargetParent = null
      }
    } else if (currentStyleTarget !== null && styleTargetParent !== null) {
      // Sets active Arrow as side effect
      let tmp = graph.model.isEdge(currentStyleTarget.cell)
        ? graph.view.getPoint(currentStyleTarget)
        : new MxPoint(
          currentStyleTarget.getCenterX(),
          currentStyleTarget.getCenterY()
        )
      tmp = new MxRectangle(
        tmp.x - this.refreshTarget.width / 2,
        tmp.y - this.refreshTarget.height / 2,
        this.refreshTarget.width,
        this.refreshTarget.height
      )
      checkArrow(x, y, tmp, styleTarget)
    }

    // Checks if inside bounds
    if (
      activeTarget &&
      currentTargetState !== null &&
      !MxEvent.isAltDown(evt) &&
      activeArrow === null
    ) {
      // LATER: Use hit-detection for edges
      bbox = MxRectangle.fromRectangle(currentTargetState)

      if (graph.model.isEdge(currentTargetState.cell)) {
        let pts = currentTargetState.absolutePoints

        if (roundSource.parentNode !== null) {
          let p0 = pts[0]
          bbox.add(
            checkArrow(
              x,
              y,
              new MxRectangle(
                p0.x - this.roundDrop.width / 2,
                p0.y - this.roundDrop.height / 2,
                this.roundDrop.width,
                this.roundDrop.height
              ),
              roundSource
            )
          )
        }

        if (roundTarget.parentNode !== null) {
          let pe = pts[pts.length - 1]
          bbox.add(
            checkArrow(
              x,
              y,
              new MxRectangle(
                pe.x - this.roundDrop.width / 2,
                pe.y - this.roundDrop.height / 2,
                this.roundDrop.width,
                this.roundDrop.height
              ),
              roundTarget
            )
          )
        }
      } else {
        let bds = MxRectangle.fromRectangle(currentTargetState)

        // Uses outer bounding box to take rotation into account
        if (
          currentTargetState.shape !== null &&
          currentTargetState.shape.boundingBox !== null
        ) {
          bds = MxRectangle.fromRectangle(currentTargetState.shape.boundingBox)
        }

        bds.grow(this.graph.tolerance)
        bds.grow(HoverIcons.prototype.arrowSpacing)

        let handler = this.graph.selectionCellsHandler.getHandler(
          currentTargetState.cell
        )

        if (handler !== null) {
          bds.x -= handler.horizontalOffset / 2
          bds.y -= handler.verticalOffset / 2
          bds.width += handler.horizontalOffset
          bds.height += handler.verticalOffset

          // Adds bounding box of rotation handle to avoid overlap
          if (
            handler.rotationShape !== null &&
            handler.rotationShape.node !== null &&
            handler.rotationShape.node.style.visibility !== 'hidden' &&
            handler.rotationShape.node.style.display !== 'none' &&
            handler.rotationShape.boundingBox !== null
          ) {
            bds.add(handler.rotationShape.boundingBox)
          }
        }

        bbox.add(
          checkArrow(
            x,
            y,
            new MxRectangle(
              currentTargetState.getCenterX() - this.triangleUp.width / 2,
              bds.y - this.triangleUp.height,
              this.triangleUp.width,
              this.triangleUp.height
            ),
            arrowUp
          )
        )
        bbox.add(
          checkArrow(
            x,
            y,
            new MxRectangle(
              bds.x + bds.width,
              currentTargetState.getCenterY() - this.triangleRight.height / 2,
              this.triangleRight.width,
              this.triangleRight.height
            ),
            arrowRight
          )
        )
        bbox.add(
          checkArrow(
            x,
            y,
            new MxRectangle(
              currentTargetState.getCenterX() - this.triangleDown.width / 2,
              bds.y + bds.height,
              this.triangleDown.width,
              this.triangleDown.height
            ),
            arrowDown
          )
        )
        bbox.add(
          checkArrow(
            x,
            y,
            new MxRectangle(
              bds.x - this.triangleLeft.width,
              currentTargetState.getCenterY() - this.triangleLeft.height / 2,
              this.triangleLeft.width,
              this.triangleLeft.height
            ),
            arrowLeft
          )
        )
      }

      // Adds tolerance
      if (bbox !== null) {
        bbox.grow(10)
      }
    }

    direction = MxConstants.DIRECTION_NORTH

    if (activeArrow === arrowRight) {
      direction = MxConstants.DIRECTION_EAST
    } else if (activeArrow === arrowDown || activeArrow === roundTarget) {
      direction = MxConstants.DIRECTION_SOUTH
    } else if (activeArrow === arrowLeft) {
      direction = MxConstants.DIRECTION_WEST
    }

    if (currentStyleTarget !== null && activeArrow === styleTarget) {
      state = currentStyleTarget
    }

    let validTarget =
      (firstVertex === null || graph.isCellConnectable(cells[firstVertex])) &&
      ((graph.model.isEdge(cell) && firstVertex !== null) ||
        (graph.model.isVertex(cell) && graph.isCellConnectable(cell)))

    // Drop arrows shown after this.dropTargetDelay, hidden after 5 secs, switches arrows after 500ms
    if (
      (currentTargetState !== null && timeOnTarget >= 5000) ||
      (currentTargetState !== state &&
        (bbox === null ||
          !MxUtils.contains(bbox, x, y) ||
          (timeOnTarget > 500 && activeArrow === null && validTarget)))
    ) {
      activeTarget = false
      currentTargetState =
        (timeOnTarget < 5000 && timeOnTarget > this.dropTargetDelay) ||
        graph.model.isEdge(cell)
          ? state
          : null

      if (currentTargetState !== null && validTarget) {
        let elts = [
          roundSource,
          roundTarget,
          arrowUp,
          arrowRight,
          arrowDown,
          arrowLeft
        ]

        for (let i = 0; i < elts.length; i++) {
          if (elts[i].parentNode !== null) {
            elts[i].parentNode.removeChild(elts[i])
          }
        }

        if (graph.model.isEdge(cell)) {
          let pts = state.absolutePoints

          if (pts !== null) {
            let p0 = pts[0]
            let pe = pts[pts.length - 1]
            let tol = graph.tolerance
            let box = new MxRectangle(x - tol, y - tol, 2 * tol, 2 * tol) // eslint-disable-line no-unused-vars

            roundSource.style.left =
              Math.floor(p0.x - this.roundDrop.width / 2) + 'px'
            roundSource.style.top =
              Math.floor(p0.y - this.roundDrop.height / 2) + 'px'

            roundTarget.style.left =
              Math.floor(pe.x - this.roundDrop.width / 2) + 'px'
            roundTarget.style.top =
              Math.floor(pe.y - this.roundDrop.height / 2) + 'px'

            if (graph.model.getTerminal(cell, true) === null) {
              graph.container.appendChild(roundSource)
            }

            if (graph.model.getTerminal(cell, false) === null) {
              graph.container.appendChild(roundTarget)
            }
          }
        } else {
          let bds = MxRectangle.fromRectangle(state)

          // Uses outer bounding box to take rotation into account
          if (state.shape !== null && state.shape.boundingBox !== null) {
            bds = MxRectangle.fromRectangle(state.shape.boundingBox)
          }

          bds.grow(this.graph.tolerance)
          bds.grow(HoverIcons.prototype.arrowSpacing)

          let handler = this.graph.selectionCellsHandler.getHandler(state.cell)

          if (handler !== null) {
            bds.x -= handler.horizontalOffset / 2
            bds.y -= handler.verticalOffset / 2
            bds.width += handler.horizontalOffset
            bds.height += handler.verticalOffset

            // Adds bounding box of rotation handle to avoid overlap
            if (
              handler.rotationShape !== null &&
              handler.rotationShape.node !== null &&
              handler.rotationShape.node.style.visibility !== 'hidden' &&
              handler.rotationShape.node.style.display !== 'none' &&
              handler.rotationShape.boundingBox !== null
            ) {
              bds.add(handler.rotationShape.boundingBox)
            }
          }

          arrowUp.style.left =
            Math.floor(state.getCenterX() - this.triangleUp.width / 2) + 'px'
          arrowUp.style.top = Math.floor(bds.y - this.triangleUp.height) + 'px'

          arrowRight.style.left = Math.floor(bds.x + bds.width) + 'px'
          arrowRight.style.top =
            Math.floor(state.getCenterY() - this.triangleRight.height / 2) +
            'px'

          arrowDown.style.left = arrowUp.style.left
          arrowDown.style.top = Math.floor(bds.y + bds.height) + 'px'

          arrowLeft.style.left =
            Math.floor(bds.x - this.triangleLeft.width) + 'px'
          arrowLeft.style.top = arrowRight.style.top

          if (state.style['portConstraint'] !== 'eastwest') {
            graph.container.appendChild(arrowUp)
            graph.container.appendChild(arrowDown)
          }

          graph.container.appendChild(arrowRight)
          graph.container.appendChild(arrowLeft)
        }

        // Hides handle for cell under mouse
        if (state !== null) {
          currentStateHandle = graph.selectionCellsHandler.getHandler(
            state.cell
          )

          if (
            currentStateHandle !== null &&
            currentStateHandle.setHandlesVisible !== null
          ) {
            currentStateHandle.setHandlesVisible(false)
          }
        }

        activeTarget = true
      } else {
        let elts = [
          roundSource,
          roundTarget,
          arrowUp,
          arrowRight,
          arrowDown,
          arrowLeft
        ]

        for (let i = 0; i < elts.length; i++) {
          if (elts[i].parentNode !== null) {
            elts[i].parentNode.removeChild(elts[i])
          }
        }
      }
    }

    if (!activeTarget && currentStateHandle !== null) {
      currentStateHandle.setHandlesVisible(true)
    }

    // Handles drop target
    let target =
      (!MxEvent.isAltDown(evt) || MxEvent.isShiftDown(evt)) &&
      !(currentStyleTarget !== null && activeArrow === styleTarget)
        ? MxDragSource.prototype.getDropTarget.apply(this, arguments)
        : null
    let model = graph.getModel()

    if (target !== null) {
      if (activeArrow !== null || !graph.isSplitTarget(target, cells, evt)) {
        // Selects parent group as drop target
        while (
          target !== null &&
          !graph.isValidDropTarget(target, cells, evt) &&
          model.isVertex(model.getParent(target))
        ) {
          target = model.getParent(target)
        }

        if (
          graph.view.currentRoot === target ||
          (!graph.isValidRoot(target) &&
            graph.getModel().getChildCount(target) === 0) ||
          graph.isCellLocked(target) ||
          model.isEdge(target)
        ) {
          target = null
        }
      }
    }

    return target
  })

  dragSource.stopDrag = function() {
    MxDragSource.prototype.stopDrag.apply(this, arguments)

    let elts = [
      roundSource,
      roundTarget,
      styleTarget,
      arrowUp,
      arrowRight,
      arrowDown,
      arrowLeft
    ]

    for (let i = 0; i < elts.length; i++) {
      if (elts[i].parentNode !== null) {
        elts[i].parentNode.removeChild(elts[i])
      }
    }

    if (currentTargetState !== null && currentStateHandle !== null) {
      currentStateHandle.reset()
    }

    currentStateHandle = null
    currentTargetState = null
    currentStyleTarget = null
    styleTargetParent = null
    activeArrow = null
  }

  return dragSource
}

/**
 * Adds a handler for inserting the cell with a single click.
 */
Sidebar.prototype.itemClicked = function(cells, ds, evt, elt) {
  let graph = this.editorUi.editor.graph

  // Alt+Click inserts and connects
  if (MxEvent.isAltDown(evt)) {
    if (
      graph.getSelectionCount() === 1 &&
      graph.model.isVertex(graph.getSelectionCell())
    ) {
      let firstVertex = null

      for (let i = 0; i < cells.length && firstVertex === null; i++) {
        if (graph.model.isVertex(cells[i])) {
          firstVertex = i
        }
      }

      if (firstVertex !== null) {
        graph.setSelectionCells(
          this.dropAndConnect(
            graph.getSelectionCell(),
            cells,
            MxEvent.isMetaDown(evt) || MxEvent.isControlDown(evt)
              ? MxEvent.isShiftDown(evt)
                ? MxConstants.DIRECTION_WEST
                : MxConstants.DIRECTION_NORTH
              : MxEvent.isShiftDown(evt)
                ? MxConstants.DIRECTION_EAST
                : MxConstants.DIRECTION_SOUTH,
            firstVertex
          )
        )
        graph.scrollCellToVisible(graph.getSelectionCell())
      }
    }
  } else if (MxEvent.isShiftDown(evt) && !graph.isSelectionEmpty()) {
    // Shift+Click updates shape
    this.updateShapes(cells[0], graph.getSelectionCells())
    graph.scrollCellToVisible(graph.getSelectionCell())
  } else {
    let pt = graph.getFreeInsertPoint()
    ds.drop(graph, evt, null, pt.x, pt.y)

    if (
      this.editorUi.hoverIcons !== null &&
      (MxEvent.isTouchEvent(evt) || MxEvent.isPenEvent(evt))
    ) {
      this.editorUi.hoverIcons.update(
        graph.view.getState(graph.getSelectionCell())
      )
    }
  }
}

/**
 * Adds a handler for inserting the cell with a single click.
 */
Sidebar.prototype.addClickHandler = function(elt, ds, cells) {
  let graph = this.editorUi.editor.graph
  let oldMouseUp = ds.mouseUp
  let first = null

  MxEvent.addGestureListeners(elt, function(evt) {
    first = new MxPoint(MxEvent.getClientX(evt), MxEvent.getClientY(evt))
  })

  ds.mouseUp = MxUtils.bind(this, function(evt) {
    if (
      !MxEvent.isPopupTrigger(evt) &&
      this.currentGraph === null &&
      first !== null
    ) {
      let tol = graph.tolerance

      if (
        Math.abs(first.x - MxEvent.getClientX(evt)) <= tol &&
        Math.abs(first.y - MxEvent.getClientY(evt)) <= tol
      ) {
        this.itemClicked(cells, ds, evt, elt)
      }
    }

    oldMouseUp.apply(ds, arguments)
    first = null

    // Blocks tooltips on this element after single click
    this.currentElt = elt
  })
}

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createVertexTemplateEntry = function(
  style,
  width,
  height,
  value,
  title,
  showLabel,
  showTitle,
  tags
) {
  tags = tags !== null && tags.length > 0 ? tags : title.toLowerCase()

  return this.addEntry(
    tags,
    MxUtils.bind(this, function() {
      return this.createVertexTemplate(
        style,
        width,
        height,
        value,
        title,
        showLabel,
        showTitle
      )
    })
  )
}

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createVertexTemplate = function(
  style,
  width,
  height,
  value,
  title,
  showLabel,
  showTitle,
  allowCellsInserted
) {
  let cells = [
    new MxCell(
      value !== null ? value : '',
      new MxGeometry(0, 0, width, height),
      style
    )
  ]
  cells[0].vertex = true

  return this.createVertexTemplateFromCells(
    cells,
    width,
    height,
    title,
    showLabel,
    showTitle,
    allowCellsInserted
  )
}

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createVertexTemplateFromData = function(
  data,
  width,
  height,
  title,
  showLabel,
  showTitle,
  allowCellsInserted
) {
  let doc = MxUtils.parseXml(this.graph.decompress(data))
  let codec = new MxCodec(doc)

  let model = new MxGraphModel()
  codec.decode(doc.documentElement, model)

  let cells = this.graph.cloneCells(model.root.getChildAt(0).children)

  return this.createVertexTemplateFromCells(
    cells,
    width,
    height,
    title,
    showLabel,
    showTitle,
    allowCellsInserted
  )
}

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createVertexTemplateFromCells = function(
  cells,
  width,
  height,
  title,
  showLabel,
  showTitle,
  allowCellsInserted
) {
  // Use this line to convert calls to this function with lots of boilerplate code for creating cells
  // console.trace('xml', this.graph.compress(MxUtils.getXml(this.graph.encodeCells(cells))), cells);
  return this.createItem(
    cells,
    title,
    showLabel,
    showTitle,
    width,
    height,
    allowCellsInserted
  )
}

/**
 *
 */
Sidebar.prototype.createEdgeTemplateEntry = function(
  style,
  width,
  height,
  value,
  title,
  showLabel,
  tags,
  allowCellsInserted
) {
  tags = tags !== null && tags.length > 0 ? tags : title.toLowerCase()

  return this.addEntry(
    tags,
    MxUtils.bind(this, function() {
      return this.createEdgeTemplate(
        style,
        width,
        height,
        value,
        title,
        showLabel,
        allowCellsInserted
      )
    })
  )
}

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createEdgeTemplate = function(
  style,
  width,
  height,
  value,
  title,
  showLabel,
  allowCellsInserted
) {
  let cell = new MxCell(
    value !== null ? value : '',
    new MxGeometry(0, 0, width, height),
    style
  )
  cell.geometry.setTerminalPoint(new MxPoint(0, height), true)
  cell.geometry.setTerminalPoint(new MxPoint(width, 0), false)
  cell.geometry.relative = true
  cell.edge = true

  return this.createEdgeTemplateFromCells(
    [cell],
    width,
    height,
    title,
    showLabel,
    allowCellsInserted
  )
}

/**
 * Creates a drop handler for inserting the given cells.
 */
Sidebar.prototype.createEdgeTemplateFromCells = function(
  cells,
  width,
  height,
  title,
  showLabel,
  allowCellsInserted
) {
  return this.createItem(
    cells,
    title,
    showLabel,
    true,
    width,
    height,
    allowCellsInserted
  )
}

/**
 * Adds the given palette.
 */
Sidebar.prototype.addPaletteFunctions = function(id, title, expanded, fns) {
  this.addPalette(
    id,
    title,
    expanded,
    MxUtils.bind(this, function(content) {
      for (let i = 0; i < fns.length; i++) {
        content.appendChild(fns[i](content))
      }
    })
  )
}

/**
 * Adds the given palette.
 */
Sidebar.prototype.addPalette = function(id, title, expanded, onInit) {
  let elt = this.createTitle(title)
  this.container.appendChild(elt)

  let div = document.createElement('div')
  div.className = 'geSidebar'

  // Disables built-in pan and zoom in IE10 and later
  if (MxClient.IS_POINTER) {
    div.style.touchAction = 'none'
  }

  if (expanded) {
    onInit(div)
    onInit = null
  } else {
    div.style.display = 'none'
  }

  this.addFoldingHandler(elt, div, onInit)

  let outer = document.createElement('div')
  outer.appendChild(div)
  this.container.appendChild(outer)

  // Keeps references to the DOM nodes
  if (id !== null) {
    this.palettes[id] = [elt, outer]
  }

  return div
}

/**
 * Create the given title element.
 */
Sidebar.prototype.addFoldingHandler = function(title, content, funct) {
  let initialized = false

  // Avoids mixed content warning in IE6-8
  if (!MxClient.IS_IE || document.documentMode >= 8) {
    title.style.backgroundImage =
      content.style.display === 'none'
        ? "url('" + this.collapsedImage + "')"
        : "url('" + this.expandedImage + "')"
  }

  title.style.backgroundRepeat = 'no-repeat'
  title.style.backgroundPosition = '0% 50%'

  MxEvent.addListener(
    title,
    'click',
    MxUtils.bind(this, function(evt) {
      if (content.style.display === 'none') {
        if (!initialized) {
          initialized = true

          if (funct !== null) {
            // Wait cursor does not show up on Mac
            title.style.cursor = 'wait'
            let prev = title.innerHTML
            title.innerHTML = MxResources.get('loading') + '...'

            window.setTimeout(function() {
              let fo = MxClient.NO_FO
              MxClient.NO_FO = Editor.prototype.originalNoForeignObject
              funct(content)
              MxClient.NO_FO = fo
              content.style.display = 'block'
              title.style.cursor = ''
              title.innerHTML = prev
            }, 0)
          } else {
            content.style.display = 'block'
          }
        } else {
          content.style.display = 'block'
        }

        title.style.backgroundImage = "url('" + this.expandedImage + "')"
      } else {
        title.style.backgroundImage = "url('" + this.collapsedImage + "')"
        content.style.display = 'none'
      }

      MxEvent.consume(evt)
    })
  )
}

/**
 * Removes the palette for the given ID.
 */
Sidebar.prototype.removePalette = function(id) {
  let elts = this.palettes[id]

  if (elts !== null) {
    this.palettes[id] = null

    for (let i = 0; i < elts.length; i++) {
      this.container.removeChild(elts[i])
    }

    return true
  }

  return false
}

/**
 * Adds the given image palette.
 */
Sidebar.prototype.addImagePalette = function(
  id,
  title,
  prefix,
  postfix,
  items,
  titles,
  tags
) {
  let showTitles = titles !== null // eslint-disable-line no-unused-vars
  let fns = []

  for (let i = 0; i < items.length; i++) {
    MxUtils.bind(this, function(item, title, tmpTags) {
      if (tmpTags === null) {
        let slash = item.lastIndexOf('/')
        let dot = item.lastIndexOf('.')
        tmpTags = item
          .substring(slash >= 0 ? slash + 1 : 0, dot >= 0 ? dot : item.length)
          .replace(/[-_]/g, ' ')
      }

      fns.push(
        this.createVertexTemplateEntry(
          'image;html=1;labelBackgroundColor=#ffffff;image=' +
            prefix +
            item +
            postfix,
          this.defaultImageWidth,
          this.defaultImageHeight,
          '',
          title,
          title !== null,
          null,
          this.filterTags(tmpTags)
        )
      )
    })(
      items[i],
      titles !== null ? titles[i] : null,
      tags !== null ? tags[items[i]] : null
    )
  }

  this.addPaletteFunctions(id, title, false, fns)
}

/**
 * Creates the array of tags for the given stencil. Duplicates are allowed and will be filtered out later.
 */
Sidebar.prototype.getTagsForStencil = function(
  packageName,
  stencilName,
  moreTags
) {
  let tags = packageName.split('.')

  for (let i = 1; i < tags.length; i++) {
    tags[i] = tags[i].replace(/_/g, ' ')
  }

  tags.push(stencilName.replace(/_/g, ' '))

  if (moreTags !== null) {
    tags.push(moreTags)
  }

  return tags.slice(1, tags.length)
}

/**
 * Adds the given stencil palette.
 */
Sidebar.prototype.addStencilPalette = function(
  id,
  title,
  stencilFile,
  style,
  ignore,
  onInit,
  scale,
  tags,
  customFns
) {
  scale = scale !== null ? scale : 1

  if (this.addStencilsToIndex) {
    // LATER: Handle asynchronous loading dependency
    let fns = []

    if (customFns !== null) {
      for (let i = 0; i < customFns.length; i++) {
        fns.push(customFns[i])
      }
    }

    mxStencilRegistry.loadStencilSet(
      stencilFile,
      MxUtils.bind(this, function(packageName, stencilName, displayName, w, h) {
        if (ignore === null || MxUtils.indexOf(ignore, stencilName) < 0) {
          let tmp = this.getTagsForStencil(packageName, stencilName)
          let tmpTags = tags !== null ? tags[stencilName] : null

          if (tmpTags !== null) {
            tmp.push(tmpTags)
          }

          fns.push(
            this.createVertexTemplateEntry(
              'shape=' + packageName + stencilName.toLowerCase() + style,
              Math.round(w * scale),
              Math.round(h * scale),
              '',
              stencilName.replace(/_/g, ' '),
              null,
              null,
              this.filterTags(tmp.join(' '))
            )
          )
        }
      }),
      true,
      true
    )

    this.addPaletteFunctions(id, title, false, fns)
  } else {
    this.addPalette(
      id,
      title,
      false,
      MxUtils.bind(this, function(content) {
        if (style === null) {
          style = ''
        }

        if (onInit !== null) {
          onInit.call(this, content)
        }

        if (customFns !== null) {
          for (let i = 0; i < customFns.length; i++) {
            customFns[i](content)
          }
        }

        mxStencilRegistry.loadStencilSet(
          stencilFile,
          MxUtils.bind(this, function(
            packageName,
            stencilName,
            displayName,
            w,
            h
          ) {
            if (ignore === null || MxUtils.indexOf(ignore, stencilName) < 0) {
              content.appendChild(
                this.createVertexTemplate(
                  'shape=' + packageName + stencilName.toLowerCase() + style,
                  Math.round(w * scale),
                  Math.round(h * scale),
                  '',
                  stencilName.replace(/_/g, ' '),
                  true
                )
              )
            }
          }),
          true
        )
      })
    )
  }
}

/**
 * Adds the given stencil palette.
 */
Sidebar.prototype.destroy = function() {
  if (this.graph !== null) {
    if (
      this.graph.container !== null &&
      this.graph.container.parentNode !== null
    ) {
      this.graph.container.parentNode.removeChild(this.graph.container)
    }

    this.graph.destroy()
    this.graph = null
  }

  if (this.pointerUpHandler !== null) {
    MxEvent.removeListener(
      document,
      MxClient.IS_POINTER ? 'pointerup' : 'mouseup',
      this.pointerUpHandler
    )
    this.pointerUpHandler = null
  }

  if (this.pointerDownHandler !== null) {
    MxEvent.removeListener(
      document,
      MxClient.IS_POINTER ? 'pointerdown' : 'mousedown',
      this.pointerDownHandler
    )
    this.pointerDownHandler = null
  }

  if (this.pointerMoveHandler !== null) {
    MxEvent.removeListener(
      document,
      MxClient.IS_POINTER ? 'pointermove' : 'mousemove',
      this.pointerMoveHandler
    )
    this.pointerMoveHandler = null
  }

  if (this.pointerOutHandler !== null) {
    MxEvent.removeListener(
      document,
      MxClient.IS_POINTER ? 'pointerout' : 'mouseout',
      this.pointerOutHandler
    )
    this.pointerOutHandler = null
  }
}
