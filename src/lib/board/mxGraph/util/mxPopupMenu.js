/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxPopupMenu
 *
 * Basic popup menu. To add a vertical scrollbar to a given submenu, the
 * following code can be used.
 *
 * (code)
 * let mxPopupMenuShowMenu = MxPopupMenu.prototype.showMenu;
 * MxPopupMenu.prototype.showMenu = function()
 * {
 *   mxPopupMenuShowMenu.apply(this, arguments);
 *
 *   this.div.style.overflowY = 'auto';
 *   this.div.style.overflowX = 'hidden';
 *   this.div.style.maxHeight = '160px';
 * };
 * (end)
 *
 * Constructor: MxPopupMenu
 *
 * Constructs a popupmenu.
 *
 * Event: MxEvent.SHOW
 *
 * Fires after the menu has been shown in <popup>.
 */

import MxEventSource from './MxEventSource.js'
import MxClient from '@/lib/board/mxGraph/MxClient.js'
import MxEvent from './MxEvent.js'
import MxUtils from './MxUtils.js'
import MxEventObject from './MxEventObject.js'

export default class MxPopupMenu {
  constructor(factoryMethod) {
    this.factoryMethod = factoryMethod

    if (factoryMethod !== null) {
      this.init()
    }
  }
}

/**
 * Extends MxEventSource.
 */
MxPopupMenu.prototype = new MxEventSource()
MxPopupMenu.prototype.constructor = MxPopupMenu

/**
 * Variable: submenuImage
 *
 * URL of the image to be used for the submenu icon.
 */
MxPopupMenu.prototype.submenuImage = MxClient.imageBasePath + '/submenu.gif'

/**
 * Variable: zIndex
 *
 * Specifies the zIndex for the popupmenu and its shadow. Default is 1006.
 */
MxPopupMenu.prototype.zIndex = 10006

/**
 * Variable: factoryMethod
 *
 * Function that is used to create the popup menu. The function takes the
 * current panning handler, the <mxCell> under the mouse and the mouse
 * event that triggered the call as arguments.
 */
MxPopupMenu.prototype.factoryMethod = null

/**
 * Variable: useLeftButtonForPopup
 *
 * Specifies if popupmenus should be activated by clicking the left mouse
 * button. Default is false.
 */
MxPopupMenu.prototype.useLeftButtonForPopup = false

/**
 * Variable: enabled
 *
 * Specifies if events are handled. Default is true.
 */
MxPopupMenu.prototype.enabled = true

/**
 * Variable: itemCount
 *
 * Contains the number of times <addItem> has been called for a new menu.
 */
MxPopupMenu.prototype.itemCount = 0

/**
 * Variable: autoExpand
 *
 * Specifies if submenus should be expanded on mouseover. Default is false.
 */
MxPopupMenu.prototype.autoExpand = false

/**
 * Variable: smartSeparators
 *
 * Specifies if separators should only be added if a menu item follows them.
 * Default is false.
 */
MxPopupMenu.prototype.smartSeparators = false

/**
 * Variable: labels
 *
 * Specifies if any labels should be visible. Default is true.
 */
MxPopupMenu.prototype.labels = true

/**
 * Function: init
 *
 * Initializes the shapes required for this vertex handler.
 */
MxPopupMenu.prototype.init = function() {
  // Adds the inner table
  this.table = document.createElement('table')
  this.table.className = 'MxPopupMenu'

  this.tbody = document.createElement('tbody')
  this.table.appendChild(this.tbody)

  // Adds the outer div
  this.div = document.createElement('div')
  this.div.className = 'MxPopupMenu'
  this.div.style.display = 'inline'
  this.div.style.zIndex = this.zIndex
  this.div.appendChild(this.table)

  // Disables the context menu on the outer div
  MxEvent.disableContextMenu(this.div)
}

/**
 * Function: isEnabled
 *
 * Returns true if events are handled. This implementation
 * returns <enabled>.
 */
MxPopupMenu.prototype.isEnabled = function() {
  return this.enabled
}

/**
 * Function: setEnabled
 *
 * Enables or disables event handling. This implementation
 * updates <enabled>.
 */
MxPopupMenu.prototype.setEnabled = function(enabled) {
  this.enabled = enabled
}

/**
 * Function: isPopupTrigger
 *
 * Returns true if the given event is a popupmenu trigger for the optional
 * given cell.
 *
 * Parameters:
 *
 * me - <mxMouseEvent> that represents the mouse event.
 */
MxPopupMenu.prototype.isPopupTrigger = function(me) {
  return (
    me.isPopupTrigger() ||
    (this.useLeftButtonForPopup && MxEvent.isLeftMouseButton(me.getEvent()))
  )
}

/**
 * Function: addItem
 *
 * Adds the given item to the given parent item. If no parent item is specified
 * then the item is added to the top-level menu. The return value may be used
 * as the parent argument, ie. as a submenu item. The return value is the table
 * row that represents the item.
 *
 * Paramters:
 *
 * title - String that represents the title of the menu item.
 * image - Optional URL for the image icon.
 * funct - Function associated that takes a mouseup or touchend event.
 * parent - Optional item returned by <addItem>.
 * iconCls - Optional string that represents the CSS class for the image icon.
 * IconsCls is ignored if image is given.
 * enabled - Optional boolean indicating if the item is enabled. Default is true.
 * active - Optional boolean indicating if the menu should implement any event handling.
 * Default is true.
 */
MxPopupMenu.prototype.addItem = function(
  title,
  image,
  funct,
  parent,
  iconCls,
  enabled,
  active
) {
  parent = parent || this
  this.itemCount++

  // Smart separators only added if element contains items
  if (parent.willAddSeparator) {
    if (parent.containsItems) {
      this.addSeparator(parent, true)
    }

    parent.willAddSeparator = false
  }

  parent.containsItems = true
  let tr = document.createElement('tr')
  tr.className = 'mxPopupMenuItem'
  let col1 = document.createElement('td')
  col1.className = 'mxPopupMenuIcon'

  // Adds the given image into the first column
  if (image !== null) {
    let img = document.createElement('img')
    img.src = image
    col1.appendChild(img)
  } else if (iconCls !== null) {
    let div = document.createElement('div')
    div.className = iconCls
    col1.appendChild(div)
  }

  tr.appendChild(col1)

  if (this.labels) {
    let col2 = document.createElement('td')
    col2.className =
      'mxPopupMenuItem' + (enabled !== null && !enabled ? ' mxDisabled' : '')

    MxUtils.write(col2, title)
    col2.align = 'left'
    tr.appendChild(col2)

    let col3 = document.createElement('td')
    col3.className =
      'mxPopupMenuItem' + (enabled !== null && !enabled ? ' mxDisabled' : '')
    col3.style.paddingRight = '6px'
    col3.style.textAlign = 'right'

    tr.appendChild(col3)

    if (parent.div === null) {
      this.createSubmenu(parent)
    }
  }

  parent.tbody.appendChild(tr)

  if (active !== false && enabled !== false) {
    let currentSelection = null

    MxEvent.addGestureListeners(
      tr,
      MxUtils.bind(this, function(evt) {
        this.eventReceiver = tr

        if (parent.activeRow !== tr && parent.activeRow !== parent) {
          if (
            parent.activeRow !== null &&
            parent.activeRow.div.parentNode !== null
          ) {
            this.hideSubmenu(parent)
          }

          if (tr.div !== null) {
            this.showSubmenu(parent, tr)
            parent.activeRow = tr
          }
        }

        // Workaround for lost current selection in page because of focus in IE
        if (MxClient.IS_QUIRKS || document.documentMode === 8) {
          currentSelection = document.selection.createRange()
        }

        MxEvent.consume(evt)
      }),
      MxUtils.bind(this, function(evt) {
        if (parent.activeRow !== tr && parent.activeRow !== parent) {
          if (
            parent.activeRow !== null &&
            parent.activeRow.div.parentNode !== null
          ) {
            this.hideSubmenu(parent)
          }

          if (this.autoExpand && tr.div !== null) {
            this.showSubmenu(parent, tr)
            parent.activeRow = tr
          }
        }

        // Sets hover style because TR in IE doesn't have hover
        tr.className = 'mxPopupMenuItemHover'
      }),
      MxUtils.bind(this, function(evt) {
        // EventReceiver avoids clicks on a submenu item
        // which has just been shown in the mousedown
        if (this.eventReceiver === tr) {
          if (parent.activeRow !== tr) {
            this.hideMenu()
          }

          // Workaround for lost current selection in page because of focus in IE
          if (currentSelection !== null) {
            // Workaround for "unspecified error" in IE8 standards
            try {
              currentSelection.select()
            } catch (e) {
              // ignore
            }

            currentSelection = null
          }

          if (funct !== null) {
            funct(evt)
          }
        }

        this.eventReceiver = null
        MxEvent.consume(evt)
      })
    )

    // Resets hover style because TR in IE doesn't have hover
    MxEvent.addListener(
      tr,
      'mouseout',
      MxUtils.bind(this, function(evt) {
        tr.className = 'mxPopupMenuItem'
      })
    )
  }

  return tr
}

/**
 * Adds a checkmark to the given menuitem.
 */
MxPopupMenu.prototype.addCheckmark = function(item, img) {
  let td = item.firstChild.nextSibling
  td.style.backgroundImage = "url('" + img + "')"
  td.style.backgroundRepeat = 'no-repeat'
  td.style.backgroundPosition = '2px 50%'
}

/**
 * Function: createSubmenu
 *
 * Creates the nodes required to add submenu items inside the given parent
 * item. This is called in <addItem> if a parent item is used for the first
 * time. This adds various DOM nodes and a <submenuImage> to the parent.
 *
 * Parameters:
 *
 * parent - An item returned by <addItem>.
 */
MxPopupMenu.prototype.createSubmenu = function(parent) {
  parent.table = document.createElement('table')
  parent.table.className = 'MxPopupMenu'

  parent.tbody = document.createElement('tbody')
  parent.table.appendChild(parent.tbody)

  parent.div = document.createElement('div')
  parent.div.className = 'MxPopupMenu'

  parent.div.style.position = 'absolute'
  parent.div.style.display = 'inline'
  parent.div.style.zIndex = this.zIndex

  parent.div.appendChild(parent.table)

  let img = document.createElement('img')
  img.setAttribute('src', this.submenuImage)

  // Last column of the submenu item in the parent menu
  let td = parent.firstChild.nextSibling.nextSibling
  td.appendChild(img)
}

/**
 * Function: showSubmenu
 *
 * Shows the submenu inside the given parent row.
 */
MxPopupMenu.prototype.showSubmenu = function(parent, row) {
  if (row.div !== null) {
    row.div.style.left =
      parent.div.offsetLeft + row.offsetLeft + row.offsetWidth - 1 + 'px'
    row.div.style.top = parent.div.offsetTop + row.offsetTop + 'px'
    document.body.appendChild(row.div)

    // Moves the submenu to the left side if there is no space
    let left = parseInt(row.div.offsetLeft)
    let width = parseInt(row.div.offsetWidth)
    let offset = MxUtils.getDocumentScrollOrigin(document)

    let b = document.body
    let d = document.documentElement

    let right = offset.x + (b.clientWidth || d.clientWidth)

    if (left + width > right) {
      row.div.style.left =
        Math.max(0, parent.div.offsetLeft - width + (MxClient.IS_IE ? 6 : -6)) +
        'px'
    }

    MxUtils.fit(row.div)
  }
}

/**
 * Function: addSeparator
 *
 * Adds a horizontal separator in the given parent item or the top-level menu
 * if no parent is specified.
 *
 * Parameters:
 *
 * parent - Optional item returned by <addItem>.
 * force - Optional boolean to ignore <smartSeparators>. Default is false.
 */
MxPopupMenu.prototype.addSeparator = function(parent, force) {
  parent = parent || this

  if (this.smartSeparators && !force) {
    parent.willAddSeparator = true
  } else if (parent.tbody !== null) {
    parent.willAddSeparator = false
    let tr = document.createElement('tr')

    let col1 = document.createElement('td')
    col1.className = 'mxPopupMenuIcon'
    col1.style.padding = '0 0 0 0px'

    tr.appendChild(col1)

    let col2 = document.createElement('td')
    col2.style.padding = '0 0 0 0px'
    col2.setAttribute('colSpan', '2')

    let hr = document.createElement('hr')
    hr.setAttribute('size', '1')
    col2.appendChild(hr)

    tr.appendChild(col2)

    parent.tbody.appendChild(tr)
  }
}

/**
 * Function: popup
 *
 * Shows the popup menu for the given event and cell.
 *
 * Example:
 *
 * (code)
 * graph.panningHandler.popup = function(x, y, cell, evt)
 * {
 *   MxUtils.alert('Hello, World!');
 * }
 * (end)
 */
MxPopupMenu.prototype.popup = function(x, y, cell, evt) {
  if (this.div !== null && this.tbody !== null && this.factoryMethod !== null) {
    this.div.style.left = x + 'px'
    this.div.style.top = y + 'px'

    // Removes all child nodes from the existing menu
    while (this.tbody.firstChild !== null) {
      MxEvent.release(this.tbody.firstChild)
      this.tbody.removeChild(this.tbody.firstChild)
    }

    this.itemCount = 0
    this.factoryMethod(this, cell, evt)

    if (this.itemCount > 0) {
      this.showMenu()
      this.fireEvent(new MxEventObject(MxEvent.SHOW))
    }
  }
}

/**
 * Function: isMenuShowing
 *
 * Returns true if the menu is showing.
 */
MxPopupMenu.prototype.isMenuShowing = function() {
  return this.div !== null && this.div.parentNode === document.body
}

/**
 * Function: showMenu
 *
 * Shows the menu.
 */
MxPopupMenu.prototype.showMenu = function() {
  // Disables filter-based shadow in IE9 standards mode
  if (document.documentMode >= 9) {
    this.div.style.filter = 'none'
  }

  // Fits the div inside the viewport
  document.body.appendChild(this.div)
  MxUtils.fit(this.div)
}

/**
 * Function: hideMenu
 *
 * Removes the menu and all submenus.
 */
MxPopupMenu.prototype.hideMenu = function() {
  if (this.div !== null) {
    if (this.div.parentNode !== null) {
      this.div.parentNode.removeChild(this.div)
    }

    this.hideSubmenu(this)
    this.containsItems = false
    this.fireEvent(new MxEventObject(MxEvent.HIDE))
  }
}

/**
 * Function: hideSubmenu
 *
 * Removes all submenus inside the given parent.
 *
 * Parameters:
 *
 * parent - An item returned by <addItem>.
 */
MxPopupMenu.prototype.hideSubmenu = function(parent) {
  if (parent.activeRow !== null) {
    this.hideSubmenu(parent.activeRow)

    if (parent.activeRow.div.parentNode !== null) {
      parent.activeRow.div.parentNode.removeChild(parent.activeRow.div)
    }

    parent.activeRow = null
  }
}

/**
 * Function: destroy
 *
 * Destroys the handler and all its resources and DOM nodes.
 */
MxPopupMenu.prototype.destroy = function() {
  if (this.div !== null) {
    MxEvent.release(this.div)

    if (this.div.parentNode !== null) {
      this.div.parentNode.removeChild(this.div)
    }

    this.div = null
  }
}
