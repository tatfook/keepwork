/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxDivResizer
 *
 * Maintains the size of a div element in Internet Explorer. This is a
 * workaround for the right and bottom style being ignored in IE.
 *
 * If you need a div to cover the scrollwidth and -height of a document,
 * then you can use this class as follows:
 *
 * (code)
 * let resizer = new MxDivResizer(background);
 * resizer.getDocumentHeight = function()
 * {
 *   return document.body.scrollHeight;
 * }
 * resizer.getDocumentWidth = function()
 * {
 *   return document.body.scrollWidth;
 * }
 * resizer.resize();
 * (end)
 *
 * Constructor: MxDivResizer
 *
 * Constructs an object that maintains the size of a div
 * element when the window is being resized. This is only
 * required for Internet Explorer as it ignores the respective
 * stylesheet information for DIV elements.
 *
 * Parameters:
 *
 * div - Reference to the DOM node whose size should be maintained.
 * container - Optional Container that contains the div. Default is the
 * window.
 */

import mxUtils from './mxUtils'
import mxEvent from './mxEvent'

export default class MxDivResizer {
  constructor(div, container) {
    if (div.nodeName.toLowerCase() === 'div') {
      if (container === null) {
        container = window
      }

      this.div = div
      let style = mxUtils.getCurrentStyle(div)

      if (style !== null) {
        this.resizeWidth = style.width === 'auto'
        this.resizeHeight = style.height === 'auto'
      }

      mxEvent.addListener(
        container,
        'resize',
        mxUtils.bind(this, function(evt) {
          if (!this.handlingResize) {
            this.handlingResize = true
            this.resize()
            this.handlingResize = false
          }
        })
      )

      this.resize()
    }
  }
}

/**
 * Function: resizeWidth
 *
 * Boolean specifying if the width should be updated.
 */
MxDivResizer.prototype.resizeWidth = true

/**
 * Function: resizeHeight
 *
 * Boolean specifying if the height should be updated.
 */
MxDivResizer.prototype.resizeHeight = true

/**
 * Function: handlingResize
 *
 * Boolean specifying if the width should be updated.
 */
MxDivResizer.prototype.handlingResize = false

/**
 * Function: resize
 *
 * Updates the style of the DIV after the window has been resized.
 */
MxDivResizer.prototype.resize = function() {
  let w = this.getDocumentWidth()
  let h = this.getDocumentHeight()

  let l = parseInt(this.div.style.left)
  let r = parseInt(this.div.style.right)
  let t = parseInt(this.div.style.top)
  let b = parseInt(this.div.style.bottom)

  if (
    this.resizeWidth &&
    !isNaN(l) &&
    !isNaN(r) &&
    l >= 0 &&
    r >= 0 &&
    w - r - l > 0
  ) {
    this.div.style.width = w - r - l + 'px'
  }

  if (
    this.resizeHeight &&
    !isNaN(t) &&
    !isNaN(b) &&
    t >= 0 &&
    b >= 0 &&
    h - t - b > 0
  ) {
    this.div.style.height = h - t - b + 'px'
  }
}

/**
 * Function: getDocumentWidth
 *
 * Hook for subclassers to return the width of the document (without
 * scrollbars).
 */
MxDivResizer.prototype.getDocumentWidth = function() {
  return document.body.clientWidth
}

/**
 * Function: getDocumentHeight
 *
 * Hook for subclassers to return the height of the document (without
 * scrollbars).
 */
MxDivResizer.prototype.getDocumentHeight = function() {
  return document.body.clientHeight
}
