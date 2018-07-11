/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxWindow
 *
 * Basic window inside a document.
 *
 * Examples:
 *
 * Creating a simple window.
 *
 * (code)
 * let tb = document.createElement('div');
 * let wnd = new MxWindow('Title', tb, 100, 100, 200, 200, true, true);
 * wnd.setVisible(true);
 * (end)
 *
 * Creating a window that contains an iframe.
 *
 * (code)
 * let frame = document.createElement('iframe');
 * frame.setAttribute('width', '192px');
 * frame.setAttribute('height', '172px');
 * frame.setAttribute('src', 'http://www.example.com/');
 * frame.style.backgroundColor = 'white';
 *
 * let w = document.body.clientWidth;
 * let h = (document.body.clientHeight || document.documentElement.clientHeight);
 * let wnd = new MxWindow('Title', frame, (w-200)/2, (h-200)/3, 200, 200);
 * wnd.setVisible(true);
 * (end)
 *
 * To limit the movement of a window, eg. to keep it from being moved beyond
 * the top, left corner the following method can be overridden (recommended):
 *
 * (code)
 * wnd.setLocation = function(x, y)
 * {
 *   x = Math.max(0, x);
 *   y = Math.max(0, y);
 *   MxWindow.prototype.setLocation.apply(this, arguments);
 * };
 * (end)
 *
 * Or the following event handler can be used:
 *
 * (code)
 * wnd.addListener(MxEvent.MOVE, function(e)
 * {
 *   wnd.setLocation(Math.max(0, wnd.getX()), Math.max(0, wnd.getY()));
 * });
 * (end)
 *
 * To keep a window inside the current window:
 *
 * (code)
 * MxEvent.addListener(window, 'resize', MxUtils.bind(this, function()
 * {
 *   let iw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
 *   let ih = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
 *
 *   let x = this.window.getX();
 *   let y = this.window.getY();
 *
 *   if (x + this.window.table.clientWidth > iw)
 *   {
 *     x = Math.max(0, iw - this.window.table.clientWidth);
 *   }
 *
 *   if (y + this.window.table.clientHeight > ih)
 *   {
 *     y = Math.max(0, ih - this.window.table.clientHeight);
 *   }
 *
 *   if (this.window.getX() !== x || this.window.getY() !== y)
 *   {
 *     this.window.setLocation(x, y);
 *   }
 * }));
 * (end)
 *
 * Event: MxEvent.MOVE_START
 *
 * Fires before the window is moved. The <code>event</code> property contains
 * the corresponding mouse event.
 *
 * Event: MxEvent.MOVE
 *
 * Fires while the window is being moved. The <code>event</code> property
 * contains the corresponding mouse event.
 *
 * Event: MxEvent.MOVE_END
 *
 * Fires after the window is moved. The <code>event</code> property contains
 * the corresponding mouse event.
 *
 * Event: MxEvent.RESIZE_START
 *
 * Fires before the window is resized. The <code>event</code> property contains
 * the corresponding mouse event.
 *
 * Event: MxEvent.RESIZE
 *
 * Fires while the window is being resized. The <code>event</code> property
 * contains the corresponding mouse event.
 *
 * Event: MxEvent.RESIZE_END
 *
 * Fires after the window is resized. The <code>event</code> property contains
 * the corresponding mouse event.
 *
 * Event: MxEvent.MAXIMIZE
 *
 * Fires after the window is maximized. The <code>event</code> property
 * contains the corresponding mouse event.
 *
 * Event: MxEvent.MINIMIZE
 *
 * Fires after the window is minimized. The <code>event</code> property
 * contains the corresponding mouse event.
 *
 * Event: MxEvent.NORMALIZE
 *
 * Fires after the window is normalized, that is, it returned from
 * maximized or minimized state. The <code>event</code> property contains the
 * corresponding mouse event.
 *
 * Event: MxEvent.ACTIVATE
 *
 * Fires after a window is activated. The <code>previousWindow</code> property
 * contains the previous window. The event sender is the active window.
 *
 * Event: MxEvent.SHOW
 *
 * Fires after the window is shown. This event has no properties.
 *
 * Event: MxEvent.HIDE
 *
 * Fires after the window is hidden. This event has no properties.
 *
 * Event: MxEvent.CLOSE
 *
 * Fires before the window is closed. The <code>event</code> property contains
 * the corresponding mouse event.
 *
 * Event: MxEvent.DESTROY
 *
 * Fires before the window is destroyed. This event has no properties.
 *
 * Constructor: MxWindow
 *
 * Constructs a new window with the given dimension and title to display
 * the specified content. The window elements use the given style as a
 * prefix for the classnames of the respective window elements, namely,
 * the window title and window pane. The respective postfixes are appended
 * to the given stylename as follows:
 *
 *   style - Base style for the window.
 *   style+Title - Style for the window title.
 *   style+Pane - Style for the window pane.
 *
 * The default value for style is MxWindow, resulting in the following
 * classnames for the window elements: MxWindow, mxWindowTitle and
 * mxWindowPane.
 *
 * If replaceNode is given then the window replaces the given DOM node in
 * the document.
 *
 * Parameters:
 *
 * title - String that represents the title of the new window.
 * content - DOM node that is used as the window content.
 * x - X-coordinate of the window location.
 * y - Y-coordinate of the window location.
 * width - Width of the window.
 * height - Optional height of the window. Default is to match the height
 * of the content at the specified width.
 * minimizable - Optional boolean indicating if the window is minimizable.
 * Default is true.
 * movable - Optional boolean indicating if the window is movable. Default
 * is true.
 * replaceNode - Optional DOM node that the window should replace.
 * style - Optional base classname for the window elements. Default is
 * MxWindow.
 */

import MxEventSource from './MxEventSource'
import MxClient from '@/lib/board/mxGraph/MxClient'
import MxRectangle from './MxRectangle'
import MxUtils from './MxUtils'
import MxEvent from './MxEvent'
import MxConstants from './MxConstants'
import MxEventObject from './MxEventObject'

export default class MxWindow {
  constructor(
    title,
    content,
    x,
    y,
    width,
    height,
    minimizable,
    movable,
    replaceNode,
    style
  ) {
    if (content !== null) {
      minimizable = minimizable !== null ? minimizable : true
      this.content = content
      this.init(x, y, width, height, style)

      this.installMaximizeHandler()
      this.installMinimizeHandler()
      this.installCloseHandler()
      this.setMinimizable(minimizable)
      this.setTitle(title)

      if (movable === null || movable) {
        this.installMoveHandler()
      }

      if (replaceNode !== null && replaceNode.parentNode !== null) {
        replaceNode.parentNode.replaceChild(this.div, replaceNode)
      } else {
        document.body.appendChild(this.div)
      }
    }
  }
}

/**
 * Extends MxEventSource.
 */
MxWindow.prototype = new MxEventSource()
MxWindow.prototype.constructor = MxWindow

/**
 * Variable: closeImage
 *
 * URL of the image to be used for the close icon in the titlebar.
 */
MxWindow.prototype.closeImage = MxClient.imageBasePath + '/close.gif'

/**
 * Variable: minimizeImage
 *
 * URL of the image to be used for the minimize icon in the titlebar.
 */
MxWindow.prototype.minimizeImage = MxClient.imageBasePath + '/minimize.gif'

/**
 * Variable: normalizeImage
 *
 * URL of the image to be used for the normalize icon in the titlebar.
 */
MxWindow.prototype.normalizeImage = MxClient.imageBasePath + '/normalize.gif'

/**
 * Variable: maximizeImage
 *
 * URL of the image to be used for the maximize icon in the titlebar.
 */
MxWindow.prototype.maximizeImage = MxClient.imageBasePath + '/maximize.gif'

/**
 * Variable: normalizeImage
 *
 * URL of the image to be used for the resize icon.
 */
MxWindow.prototype.resizeImage = MxClient.imageBasePath + '/resize.gif'

/**
 * Variable: visible
 *
 * Boolean flag that represents the visible state of the window.
 */
MxWindow.prototype.visible = false

/**
 * Variable: minimumSize
 *
 * <MxRectangle> that specifies the minimum width and height of the window.
 * Default is (50, 40).
 */
MxWindow.prototype.minimumSize = new MxRectangle(0, 0, 50, 40)

/**
 * Variable: destroyOnClose
 *
 * Specifies if the window should be destroyed when it is closed. If this
 * is false then the window is hidden using <setVisible>. Default is true.
 */
MxWindow.prototype.destroyOnClose = true

/**
 * Variable: contentHeightCorrection
 *
 * Defines the correction factor for computing the height of the contentWrapper.
 * Default is 6 for IE 7/8 standards mode and 2 for all other browsers and modes.
 */
MxWindow.prototype.contentHeightCorrection =
  document.documentMode === 8 || document.documentMode === 7 ? 6 : 2

/**
 * Variable: title
 *
 * Reference to the DOM node (TD) that contains the title.
 */
MxWindow.prototype.title = null

/**
 * Variable: content
 *
 * Reference to the DOM node that represents the window content.
 */
MxWindow.prototype.content = null

/**
 * Function: init
 *
 * Initializes the DOM tree that represents the window.
 */
MxWindow.prototype.init = function(x, y, width, height, style) {
  style = style !== null ? style : 'MxWindow'

  this.div = document.createElement('div')
  this.div.className = style

  this.div.style.left = x + 'px'
  this.div.style.top = y + 'px'
  this.table = document.createElement('table')
  this.table.className = style

  // Disables built-in pan and zoom in IE10 and later
  if (MxClient.IS_POINTER) {
    this.div.style.touchAction = 'none'
  }

  // Workaround for table size problems in FF
  if (width !== null) {
    if (!MxClient.IS_QUIRKS) {
      this.div.style.width = width + 'px'
    }

    this.table.style.width = width + 'px'
  }

  if (height !== null) {
    if (!MxClient.IS_QUIRKS) {
      this.div.style.height = height + 'px'
    }

    this.table.style.height = height + 'px'
  }

  // Creates title row
  let tbody = document.createElement('tbody')
  let tr = document.createElement('tr')

  this.title = document.createElement('td')
  this.title.className = style + 'Title'

  this.buttons = document.createElement('div')
  this.buttons.style.position = 'absolute'
  this.buttons.style.display = 'inline-block'
  this.buttons.style.right = '4px'
  this.buttons.style.top = '5px'
  this.title.appendChild(this.buttons)

  tr.appendChild(this.title)
  tbody.appendChild(tr)

  // Creates content row and table cell
  tr = document.createElement('tr')
  this.td = document.createElement('td')
  this.td.className = style + 'Pane'

  if (document.documentMode === 7) {
    this.td.style.height = '100%'
  }

  this.contentWrapper = document.createElement('div')
  this.contentWrapper.className = style + 'Pane'
  this.contentWrapper.style.width = '100%'
  this.contentWrapper.appendChild(this.content)

  // Workaround for div around div restricts height
  // of inner div if outerdiv has hidden overflow
  if (MxClient.IS_QUIRKS || this.content.nodeName.toUpperCase() !== 'DIV') {
    this.contentWrapper.style.height = '100%'
  }

  // Puts all content into the DOM
  this.td.appendChild(this.contentWrapper)
  tr.appendChild(this.td)
  tbody.appendChild(tr)
  this.table.appendChild(tbody)
  this.div.appendChild(this.table)

  // Puts the window on top of other windows when clicked
  let activator = MxUtils.bind(this, function(evt) {
    this.activate()
  })

  MxEvent.addGestureListeners(this.title, activator)
  MxEvent.addGestureListeners(this.table, activator)

  this.hide()
}

/**
 * Function: setTitle
 *
 * Sets the window title to the given string. HTML markup inside the title
 * will be escaped.
 */
MxWindow.prototype.setTitle = function(title) {
  // Removes all text content nodes (normally just one)
  let child = this.title.firstChild

  while (child !== null) {
    let next = child.nextSibling

    if (child.nodeType === MxConstants.NODETYPE_TEXT) {
      child.parentNode.removeChild(child)
    }

    child = next
  }

  MxUtils.write(this.title, title || '')
  this.title.appendChild(this.buttons)
}

/**
 * Function: setScrollable
 *
 * Sets if the window contents should be scrollable.
 */
MxWindow.prototype.setScrollable = function(scrollable) {
  // Workaround for hang in Presto 2.5.22 (Opera 10.5)
  if (navigator.userAgent.indexOf('Presto/2.5') < 0) {
    if (scrollable) {
      this.contentWrapper.style.overflow = 'auto'
    } else {
      this.contentWrapper.style.overflow = 'hidden'
    }
  }
}

/**
 * Function: activate
 *
 * Puts the window on top of all other windows.
 */
MxWindow.prototype.activate = function() {
  if (MxWindow.activeWindow !== this) {
    let style = MxUtils.getCurrentStyle(this.getElement())
    let index = style !== null ? style.zIndex : 3

    if (MxWindow.activeWindow) {
      let elt = MxWindow.activeWindow.getElement()

      if (elt !== null && elt.style !== null) {
        elt.style.zIndex = index
      }
    }

    let previousWindow = MxWindow.activeWindow
    this.getElement().style.zIndex = parseInt(index) + 1
    MxWindow.activeWindow = this

    this.fireEvent(
      new MxEventObject(MxEvent.ACTIVATE, 'previousWindow', previousWindow)
    )
  }
}

/**
 * Function: getElement
 *
 * Returuns the outermost DOM node that makes up the window.
 */
MxWindow.prototype.getElement = function() {
  return this.div
}

/**
 * Function: fit
 *
 * Makes sure the window is inside the client area of the window.
 */
MxWindow.prototype.fit = function() {
  MxUtils.fit(this.div)
}

/**
 * Function: isResizable
 *
 * Returns true if the window is resizable.
 */
MxWindow.prototype.isResizable = function() {
  if (this.resize !== null) {
    return this.resize.style.display !== 'none'
  }

  return false
}

/**
 * Function: setResizable
 *
 * Sets if the window should be resizable. To avoid interference with some
 * built-in features of IE10 and later, the use of the following code is
 * recommended if there are resizable <MxWindow>s in the page:
 *
 * (code)
 * if (MxClient.IS_POINTER)
 * {
 *   document.body.style.msTouchAction = 'none';
 * }
 * (end)
 */
MxWindow.prototype.setResizable = function(resizable) {
  if (resizable) {
    if (this.resize === null) {
      this.resize = document.createElement('img')
      this.resize.style.position = 'absolute'
      this.resize.style.bottom = '2px'
      this.resize.style.right = '2px'

      this.resize.setAttribute('src', this.resizeImage)
      this.resize.style.cursor = 'nw-resize'

      let startX = null
      let startY = null
      let width = null
      let height = null

      let start = MxUtils.bind(this, function(evt) {
        // LATER: pointerdown starting on border of resize does start
        // the drag operation but does not fire consecutive events via
        // one of the listeners below (does pan instead).
        // Workaround: document.body.style.msTouchAction = 'none'
        this.activate()
        startX = MxEvent.getClientX(evt)
        startY = MxEvent.getClientY(evt)
        width = this.div.offsetWidth
        height = this.div.offsetHeight

        MxEvent.addGestureListeners(document, null, dragHandler, dropHandler)
        this.fireEvent(new MxEventObject(MxEvent.RESIZE_START, 'event', evt))
        MxEvent.consume(evt)
      })

      // Adds a temporary pair of listeners to intercept
      // the gesture event in the document
      let dragHandler = MxUtils.bind(this, function(evt) {
        if (startX !== null && startY !== null) {
          let dx = MxEvent.getClientX(evt) - startX
          let dy = MxEvent.getClientY(evt) - startY

          this.setSize(width + dx, height + dy)

          this.fireEvent(new MxEventObject(MxEvent.RESIZE, 'event', evt))
          MxEvent.consume(evt)
        }
      })

      let dropHandler = MxUtils.bind(this, function(evt) {
        if (startX !== null && startY !== null) {
          startX = null
          startY = null
          MxEvent.removeGestureListeners(
            document,
            null,
            dragHandler,
            dropHandler
          )
          this.fireEvent(new MxEventObject(MxEvent.RESIZE_END, 'event', evt))
          MxEvent.consume(evt)
        }
      })

      MxEvent.addGestureListeners(this.resize, start, dragHandler, dropHandler)
      this.div.appendChild(this.resize)
    } else {
      this.resize.style.display = 'inline'
    }
  } else if (this.resize !== null) {
    this.resize.style.display = 'none'
  }
}

/**
 * Function: setSize
 *
 * Sets the size of the window.
 */
MxWindow.prototype.setSize = function(width, height) {
  width = Math.max(this.minimumSize.width, width)
  height = Math.max(this.minimumSize.height, height)

  // Workaround for table size problems in FF
  if (!MxClient.IS_QUIRKS) {
    this.div.style.width = width + 'px'
    this.div.style.height = height + 'px'
  }

  this.table.style.width = width + 'px'
  this.table.style.height = height + 'px'

  if (!MxClient.IS_QUIRKS) {
    this.contentWrapper.style.height =
      this.div.offsetHeight -
      this.title.offsetHeight -
      this.contentHeightCorrection +
      'px'
  }
}

/**
 * Function: setMinimizable
 *
 * Sets if the window is minimizable.
 */
MxWindow.prototype.setMinimizable = function(minimizable) {
  this.minimize.style.display = minimizable ? '' : 'none'
}

/**
 * Function: getMinimumSize
 *
 * Returns an <MxRectangle> that specifies the size for the minimized window.
 * A width or height of 0 means keep the existing width or height. This
 * implementation returns the height of the window title and keeps the width.
 */
MxWindow.prototype.getMinimumSize = function() {
  return new MxRectangle(0, 0, 0, this.title.offsetHeight)
}

/**
 * Function: installMinimizeHandler
 *
 * Installs the event listeners required for minimizing the window.
 */
MxWindow.prototype.installMinimizeHandler = function() {
  this.minimize = document.createElement('img')

  this.minimize.setAttribute('src', this.minimizeImage)
  this.minimize.setAttribute('title', 'Minimize')
  this.minimize.style.cursor = 'pointer'
  this.minimize.style.marginLeft = '2px'
  this.minimize.style.display = 'none'

  this.buttons.appendChild(this.minimize)

  let minimized = false
  let maxDisplay = null
  let height = null

  let funct = MxUtils.bind(this, function(evt) {
    this.activate()

    if (!minimized) {
      minimized = true

      this.minimize.setAttribute('src', this.normalizeImage)
      this.minimize.setAttribute('title', 'Normalize')
      this.contentWrapper.style.display = 'none'
      maxDisplay = this.maximize.style.display

      this.maximize.style.display = 'none'
      height = this.table.style.height

      let minSize = this.getMinimumSize()

      if (minSize.height > 0) {
        if (!MxClient.IS_QUIRKS) {
          this.div.style.height = minSize.height + 'px'
        }

        this.table.style.height = minSize.height + 'px'
      }

      if (minSize.width > 0) {
        if (!MxClient.IS_QUIRKS) {
          this.div.style.width = minSize.width + 'px'
        }

        this.table.style.width = minSize.width + 'px'
      }

      if (this.resize !== null) {
        this.resize.style.visibility = 'hidden'
      }

      this.fireEvent(new MxEventObject(MxEvent.MINIMIZE, 'event', evt))
    } else {
      minimized = false

      this.minimize.setAttribute('src', this.minimizeImage)
      this.minimize.setAttribute('title', 'Minimize')
      this.contentWrapper.style.display = '' // default
      this.maximize.style.display = maxDisplay

      if (!MxClient.IS_QUIRKS) {
        this.div.style.height = height
      }

      this.table.style.height = height

      if (this.resize !== null) {
        this.resize.style.visibility = ''
      }

      this.fireEvent(new MxEventObject(MxEvent.NORMALIZE, 'event', evt))
    }

    MxEvent.consume(evt)
  })

  MxEvent.addGestureListeners(this.minimize, funct)
}

/**
 * Function: setMaximizable
 *
 * Sets if the window is maximizable.
 */
MxWindow.prototype.setMaximizable = function(maximizable) {
  this.maximize.style.display = maximizable ? '' : 'none'
}

/**
 * Function: installMaximizeHandler
 *
 * Installs the event listeners required for maximizing the window.
 */
MxWindow.prototype.installMaximizeHandler = function() {
  this.maximize = document.createElement('img')

  this.maximize.setAttribute('src', this.maximizeImage)
  this.maximize.setAttribute('title', 'Maximize')
  this.maximize.style.cursor = 'default'
  this.maximize.style.marginLeft = '2px'
  this.maximize.style.cursor = 'pointer'
  this.maximize.style.display = 'none'

  this.buttons.appendChild(this.maximize)

  let maximized = false
  let x = null
  let y = null
  let height = null
  let width = null
  let minDisplay = null

  let funct = MxUtils.bind(this, function(evt) {
    this.activate()

    if (this.maximize.style.display !== 'none') {
      if (!maximized) {
        maximized = true

        this.maximize.setAttribute('src', this.normalizeImage)
        this.maximize.setAttribute('title', 'Normalize')
        this.contentWrapper.style.display = ''
        minDisplay = this.minimize.style.display
        this.minimize.style.display = 'none'

        // Saves window state
        x = parseInt(this.div.style.left)
        y = parseInt(this.div.style.top)
        height = this.table.style.height
        width = this.table.style.width

        this.div.style.left = '0px'
        this.div.style.top = '0px'
        let docHeight = Math.max(
          document.body.clientHeight || 0,
          document.documentElement.clientHeight || 0
        )

        if (!MxClient.IS_QUIRKS) {
          this.div.style.width = document.body.clientWidth - 2 + 'px'
          this.div.style.height = docHeight - 2 + 'px'
        }

        this.table.style.width = document.body.clientWidth - 2 + 'px'
        this.table.style.height = docHeight - 2 + 'px'

        if (this.resize !== null) {
          this.resize.style.visibility = 'hidden'
        }

        if (!MxClient.IS_QUIRKS) {
          let style = MxUtils.getCurrentStyle(this.contentWrapper)

          if (style.overflow === 'auto' || this.resize !== null) {
            this.contentWrapper.style.height =
              this.div.offsetHeight -
              this.title.offsetHeight -
              this.contentHeightCorrection +
              'px'
          }
        }

        this.fireEvent(new MxEventObject(MxEvent.MAXIMIZE, 'event', evt))
      } else {
        maximized = false

        this.maximize.setAttribute('src', this.maximizeImage)
        this.maximize.setAttribute('title', 'Maximize')
        this.contentWrapper.style.display = ''
        this.minimize.style.display = minDisplay

        // Restores window state
        this.div.style.left = x + 'px'
        this.div.style.top = y + 'px'

        if (!MxClient.IS_QUIRKS) {
          this.div.style.height = height
          this.div.style.width = width

          let style = MxUtils.getCurrentStyle(this.contentWrapper)

          if (style.overflow === 'auto' || this.resize !== null) {
            this.contentWrapper.style.height =
              this.div.offsetHeight -
              this.title.offsetHeight -
              this.contentHeightCorrection +
              'px'
          }
        }

        this.table.style.height = height
        this.table.style.width = width

        if (this.resize !== null) {
          this.resize.style.visibility = ''
        }

        this.fireEvent(new MxEventObject(MxEvent.NORMALIZE, 'event', evt))
      }

      MxEvent.consume(evt)
    }
  })

  MxEvent.addGestureListeners(this.maximize, funct)
  MxEvent.addListener(this.title, 'dblclick', funct)
}

/**
 * Function: installMoveHandler
 *
 * Installs the event listeners required for moving the window.
 */
MxWindow.prototype.installMoveHandler = function() {
  this.title.style.cursor = 'move'

  MxEvent.addGestureListeners(
    this.title,
    MxUtils.bind(this, function(evt) {
      let startX = MxEvent.getClientX(evt)
      let startY = MxEvent.getClientY(evt)
      let x = this.getX()
      let y = this.getY()

      // Adds a temporary pair of listeners to intercept
      // the gesture event in the document
      let dragHandler = MxUtils.bind(this, function(evt) {
        let dx = MxEvent.getClientX(evt) - startX
        let dy = MxEvent.getClientY(evt) - startY
        this.setLocation(x + dx, y + dy)
        this.fireEvent(new MxEventObject(MxEvent.MOVE, 'event', evt))
        MxEvent.consume(evt)
      })

      let dropHandler = MxUtils.bind(this, function(evt) {
        MxEvent.removeGestureListeners(document, null, dragHandler, dropHandler)
        this.fireEvent(new MxEventObject(MxEvent.MOVE_END, 'event', evt))
        MxEvent.consume(evt)
      })

      MxEvent.addGestureListeners(document, null, dragHandler, dropHandler)
      this.fireEvent(new MxEventObject(MxEvent.MOVE_START, 'event', evt))
      MxEvent.consume(evt)
    })
  )

  // Disables built-in pan and zoom in IE10 and later
  if (MxClient.IS_POINTER) {
    this.title.style.touchAction = 'none'
  }
}

/**
 * Function: setLocation
 *
 * Sets the upper, left corner of the window.
 */
MxWindow.prototype.setLocation = function(x, y) {
  this.div.style.left = x + 'px'
  this.div.style.top = y + 'px'
}

/**
 * Function: getX
 *
 * Returns the current position on the x-axis.
 */
MxWindow.prototype.getX = function() {
  return parseInt(this.div.style.left)
}

/**
 * Function: getY
 *
 * Returns the current position on the y-axis.
 */
MxWindow.prototype.getY = function() {
  return parseInt(this.div.style.top)
}

/**
 * Function: installCloseHandler
 *
 * Adds the <closeImage> as a new image node in <closeImg> and installs the
 * <close> event.
 */
MxWindow.prototype.installCloseHandler = function() {
  this.closeImg = document.createElement('img')

  this.closeImg.setAttribute('src', this.closeImage)
  this.closeImg.setAttribute('title', 'Close')
  this.closeImg.style.marginLeft = '2px'
  this.closeImg.style.cursor = 'pointer'
  this.closeImg.style.display = 'none'

  this.buttons.appendChild(this.closeImg)

  MxEvent.addGestureListeners(
    this.closeImg,
    MxUtils.bind(this, function(evt) {
      this.fireEvent(new MxEventObject(MxEvent.CLOSE, 'event', evt))

      if (this.destroyOnClose) {
        this.destroy()
      } else {
        this.setVisible(false)
      }

      MxEvent.consume(evt)
    })
  )
}

/**
 * Function: setImage
 *
 * Sets the image associated with the window.
 *
 * Parameters:
 *
 * image - URL of the image to be used.
 */
MxWindow.prototype.setImage = function(image) {
  this.image = document.createElement('img')
  this.image.setAttribute('src', image)
  this.image.setAttribute('align', 'left')
  this.image.style.marginRight = '4px'
  this.image.style.marginLeft = '0px'
  this.image.style.marginTop = '-2px'

  this.title.insertBefore(this.image, this.title.firstChild)
}

/**
 * Function: setClosable
 *
 * Sets the image associated with the window.
 *
 * Parameters:
 *
 * closable - Boolean specifying if the window should be closable.
 */
MxWindow.prototype.setClosable = function(closable) {
  this.closeImg.style.display = closable ? '' : 'none'
}

/**
 * Function: isVisible
 *
 * Returns true if the window is visible.
 */
MxWindow.prototype.isVisible = function() {
  if (this.div !== null) {
    return this.div.style.display !== 'none'
  }

  return false
}

/**
 * Function: setVisible
 *
 * Shows or hides the window depending on the given flag.
 *
 * Parameters:
 *
 * visible - Boolean indicating if the window should be made visible.
 */
MxWindow.prototype.setVisible = function(visible) {
  if (this.div !== null && this.isVisible() !== visible) {
    if (visible) {
      this.show()
    } else {
      this.hide()
    }
  }
}

/**
 * Function: show
 *
 * Shows the window.
 */
MxWindow.prototype.show = function() {
  this.div.style.display = ''
  this.activate()

  let style = MxUtils.getCurrentStyle(this.contentWrapper)

  if (
    !MxClient.IS_QUIRKS &&
    (style.overflow === 'auto' || this.resize !== null)
  ) {
    this.contentWrapper.style.height =
      this.div.offsetHeight -
      this.title.offsetHeight -
      this.contentHeightCorrection +
      'px'
  }

  this.fireEvent(new MxEventObject(MxEvent.SHOW))
}

/**
 * Function: hide
 *
 * Hides the window.
 */
MxWindow.prototype.hide = function() {
  this.div.style.display = 'none'
  this.fireEvent(new MxEventObject(MxEvent.HIDE))
}

/**
 * Function: destroy
 *
 * Destroys the window and removes all associated resources. Fires a
 * <destroy> event prior to destroying the window.
 */
MxWindow.prototype.destroy = function() {
  this.fireEvent(new MxEventObject(MxEvent.DESTROY))

  if (this.div !== null) {
    MxEvent.release(this.div)
    this.div.parentNode.removeChild(this.div)
    this.div = null
  }

  this.title = null
  this.content = null
  this.contentWrapper = null
}
