/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxToolbar
 *
 * Creates a toolbar inside a given DOM node. The toolbar may contain icons,
 * buttons and combo boxes.
 *
 * Event: MxEvent.SELECT
 *
 * Fires when an item was selected in the toolbar. The <code>function</code>
 * property contains the function that was selected in <selectMode>.
 *
 * Constructor: MxToolbar
 *
 * Constructs a toolbar in the specified container.
 *
 * Parameters:
 *
 * container - DOM node that contains the toolbar.
 */

import MxEventSource from './MxEventSource'
import MxUtils from './MxUtils'
import MxEvent from './MxEvent'
import MxClient from '@/lib/board/mxGraph/MxClient'
import MxPopupMenu from './MxPopupMenu'
import MxEventObject from './MxEventObject'
import MxPoint from './MxPoint'

export default class MxToolbar {
  constructor(container) {
    this.container = container
  }
}

/**
 * Extends MxEventSource.
 */
MxToolbar.prototype = new MxEventSource()
MxToolbar.prototype.constructor = MxToolbar

/**
 * Variable: container
 *
 * Reference to the DOM nodes that contains the toolbar.
 */
MxToolbar.prototype.container = null

/**
 * Variable: enabled
 *
 * Specifies if events are handled. Default is true.
 */
MxToolbar.prototype.enabled = true

/**
 * Variable: noReset
 *
 * Specifies if <resetMode> requires a forced flag of true for resetting
 * the current mode in the toolbar. Default is false. This is set to true
 * if the toolbar item is double clicked to avoid a reset after a single
 * use of the item.
 */
MxToolbar.prototype.noReset = false

/**
 * Variable: updateDefaultMode
 *
 * Boolean indicating if the default mode should be the last selected
 * switch mode or the first inserted switch mode. Default is true, that
 * is the last selected switch mode is the default mode. The default mode
 * is the mode to be selected after a reset of the toolbar. If this is
 * false, then the default mode is the first inserted mode item regardless
 * of what was last selected. Otherwise, the selected item after a reset is
 * the previously selected item.
 */
MxToolbar.prototype.updateDefaultMode = true

/**
 * Function: addItem
 *
 * Adds the given function as an image with the specified title and icon
 * and returns the new image node.
 *
 * Parameters:
 *
 * title - Optional string that is used as the tooltip.
 * icon - Optional URL of the image to be used. If no URL is given, then a
 * button is created.
 * funct - Function to execute on a mouse click.
 * pressedIcon - Optional URL of the pressed image. Default is a gray
 * background.
 * style - Optional style classname. Default is mxToolbarItem.
 * factoryMethod - Optional factory method for popup menu, eg.
 * function(menu, evt, cell) { menu.addItem('Hello, World!'); }
 */
MxToolbar.prototype.addItem = function(
  title,
  icon,
  funct,
  pressedIcon,
  style,
  factoryMethod
) {
  let img = document.createElement(icon !== null ? 'img' : 'button')
  let initialClassName =
    style || (factoryMethod !== null ? 'mxToolbarMode' : 'mxToolbarItem')
  img.className = initialClassName
  img.setAttribute('src', icon)

  if (title !== null) {
    if (icon !== null) {
      img.setAttribute('title', title)
    } else {
      MxUtils.write(img, title)
    }
  }

  this.container.appendChild(img)

  // Invokes the function on a click on the toolbar item
  if (funct !== null) {
    MxEvent.addListener(img, 'click', funct)

    if (MxClient.IS_TOUCH) {
      MxEvent.addListener(img, 'touchend', funct)
    }
  }

  let mouseHandler = MxUtils.bind(this, function(evt) {
    if (pressedIcon !== null) {
      img.setAttribute('src', icon)
    } else {
      img.style.backgroundColor = ''
    }
  })

  // Highlights the toolbar item with a gray background
  // while it is being clicked with the mouse
  MxEvent.addGestureListeners(
    img,
    MxUtils.bind(this, function(evt) {
      if (pressedIcon !== null) {
        img.setAttribute('src', pressedIcon)
      } else {
        img.style.backgroundColor = 'gray'
      }

      // Popup Menu
      if (factoryMethod !== null) {
        if (this.menu === null) {
          this.menu = new MxPopupMenu()
          this.menu.init()
        }

        let last = this.currentImg

        if (this.menu.isMenuShowing()) {
          this.menu.hideMenu()
        }

        if (last !== img) {
          // Redirects factory method to local factory method
          this.currentImg = img
          this.menu.factoryMethod = factoryMethod

          let point = new MxPoint(
            img.offsetLeft,
            img.offsetTop + img.offsetHeight
          )
          this.menu.popup(point.x, point.y, null, evt)

          // Sets and overrides to restore classname
          if (this.menu.isMenuShowing()) {
            img.className = initialClassName + 'Selected'

            this.menu.hideMenu = function() {
              MxPopupMenu.prototype.hideMenu.apply(this)
              img.className = initialClassName
              this.currentImg = null
            }
          }
        }
      }
    }),
    null,
    mouseHandler
  )

  MxEvent.addListener(img, 'mouseout', mouseHandler)

  return img
}

/**
 * Function: addCombo
 *
 * Adds and returns a new SELECT element using the given style. The element
 * is placed inside a DIV with the mxToolbarComboContainer style classname.
 *
 * Parameters:
 *
 * style - Optional style classname. Default is mxToolbarCombo.
 */
MxToolbar.prototype.addCombo = function(style) {
  let div = document.createElement('div')
  div.style.display = 'inline'
  div.className = 'mxToolbarComboContainer'

  let select = document.createElement('select')
  select.className = style || 'mxToolbarCombo'
  div.appendChild(select)

  this.container.appendChild(div)

  return select
}

/**
 * Function: addCombo
 *
 * Adds and returns a new SELECT element using the given title as the
 * default element. The selection is reset to this element after each
 * change.
 *
 * Parameters:
 *
 * title - String that specifies the title of the default element.
 * style - Optional style classname. Default is mxToolbarCombo.
 */
MxToolbar.prototype.addActionCombo = function(title, style) {
  let select = document.createElement('select')
  select.className = style || 'mxToolbarCombo'
  this.addOption(select, title, null)

  MxEvent.addListener(select, 'change', function(evt) {
    let value = select.options[select.selectedIndex]
    select.selectedIndex = 0

    if (value.funct !== null) {
      value.funct(evt)
    }
  })

  this.container.appendChild(select)

  return select
}

/**
 * Function: addOption
 *
 * Adds and returns a new OPTION element inside the given SELECT element.
 * If the given value is a function then it is stored in the option's funct
 * field.
 *
 * Parameters:
 *
 * combo - SELECT element that will contain the new entry.
 * title - String that specifies the title of the option.
 * value - Specifies the value associated with this option.
 */
MxToolbar.prototype.addOption = function(combo, title, value) {
  let option = document.createElement('option')
  MxUtils.writeln(option, title)

  if (typeof value === 'function') {
    option.funct = value
  } else {
    option.setAttribute('value', value)
  }

  combo.appendChild(option)

  return option
}

/**
 * Function: addSwitchMode
 *
 * Adds a new selectable item to the toolbar. Only one switch mode item may
 * be selected at a time. The currently selected item is the default item
 * after a reset of the toolbar.
 */
MxToolbar.prototype.addSwitchMode = function(
  title,
  icon,
  funct,
  pressedIcon,
  style
) {
  let img = document.createElement('img')
  img.initialClassName = style || 'mxToolbarMode'
  img.className = img.initialClassName
  img.setAttribute('src', icon)
  img.altIcon = pressedIcon

  if (title !== null) {
    img.setAttribute('title', title)
  }

  MxEvent.addListener(
    img,
    'click',
    MxUtils.bind(this, function(evt) {
      let tmp = this.selectedMode.altIcon

      if (tmp !== null) {
        this.selectedMode.altIcon = this.selectedMode.getAttribute('src')
        this.selectedMode.setAttribute('src', tmp)
      } else {
        this.selectedMode.className = this.selectedMode.initialClassName
      }

      if (this.updateDefaultMode) {
        this.defaultMode = img
      }

      this.selectedMode = img

      tmp = img.altIcon

      if (tmp !== null) {
        img.altIcon = img.getAttribute('src')
        img.setAttribute('src', tmp)
      } else {
        img.className = img.initialClassName + 'Selected'
      }

      this.fireEvent(new MxEventObject(MxEvent.SELECT))
      funct()
    })
  )

  this.container.appendChild(img)

  if (this.defaultMode === null) {
    this.defaultMode = img

    // Function should fire only once so
    // do not pass it with the select event
    this.selectMode(img)
    funct()
  }

  return img
}

/**
 * Function: addMode
 *
 * Adds a new item to the toolbar. The selection is typically reset after
 * the item has been consumed, for example by adding a new vertex to the
 * graph. The reset is not carried out if the item is double clicked.
 *
 * The function argument uses the following signature: funct(evt, cell) where
 * evt is the native mouse event and cell is the cell under the mouse.
 */
MxToolbar.prototype.addMode = function(
  title,
  icon,
  funct,
  pressedIcon,
  style,
  toggle
) {
  toggle = toggle !== null ? toggle : true
  let img = document.createElement(icon !== null ? 'img' : 'button')

  img.initialClassName = style || 'mxToolbarMode'
  img.className = img.initialClassName
  img.setAttribute('src', icon)
  img.altIcon = pressedIcon

  if (title !== null) {
    img.setAttribute('title', title)
  }

  if (this.enabled && toggle) {
    MxEvent.addListener(
      img,
      'click',
      MxUtils.bind(this, function(evt) {
        this.selectMode(img, funct)
        this.noReset = false
      })
    )

    MxEvent.addListener(
      img,
      'dblclick',
      MxUtils.bind(this, function(evt) {
        this.selectMode(img, funct)
        this.noReset = true
      })
    )

    if (this.defaultMode === null) {
      this.defaultMode = img
      this.defaultFunction = funct
      this.selectMode(img, funct)
    }
  }

  this.container.appendChild(img)

  return img
}

/**
 * Function: selectMode
 *
 * Resets the state of the previously selected mode and displays the given
 * DOM node as selected. This function fires a select event with the given
 * function as a parameter.
 */
MxToolbar.prototype.selectMode = function(domNode, funct) {
  if (this.selectedMode !== domNode) {
    if (this.selectedMode !== null) {
      let tmp = this.selectedMode.altIcon

      if (tmp !== null) {
        this.selectedMode.altIcon = this.selectedMode.getAttribute('src')
        this.selectedMode.setAttribute('src', tmp)
      } else {
        this.selectedMode.className = this.selectedMode.initialClassName
      }
    }

    this.selectedMode = domNode
    let tmp = this.selectedMode.altIcon

    if (tmp !== null) {
      this.selectedMode.altIcon = this.selectedMode.getAttribute('src')
      this.selectedMode.setAttribute('src', tmp)
    } else {
      this.selectedMode.className =
        this.selectedMode.initialClassName + 'Selected'
    }

    this.fireEvent(new MxEventObject(MxEvent.SELECT, 'function', funct))
  }
}

/**
 * Function: resetMode
 *
 * Selects the default mode and resets the state of the previously selected
 * mode.
 */
MxToolbar.prototype.resetMode = function(forced) {
  if ((forced || !this.noReset) && this.selectedMode !== this.defaultMode) {
    // The last selected switch mode will be activated
    // so the function was already executed and is
    // no longer required here
    this.selectMode(this.defaultMode, this.defaultFunction)
  }
}

/**
 * Function: addSeparator
 *
 * Adds the specifies image as a separator.
 *
 * Parameters:
 *
 * icon - URL of the separator icon.
 */
MxToolbar.prototype.addSeparator = function(icon) {
  return this.addItem(null, icon, null)
}

/**
 * Function: addBreak
 *
 * Adds a break to the container.
 */
MxToolbar.prototype.addBreak = function() {
  MxUtils.br(this.container)
}

/**
 * Function: addLine
 *
 * Adds a horizontal line to the container.
 */
MxToolbar.prototype.addLine = function() {
  let hr = document.createElement('hr')

  hr.style.marginRight = '6px'
  hr.setAttribute('size', '1')

  this.container.appendChild(hr)
}

/**
 * Function: destroy
 *
 * Removes the toolbar and all its associated resources.
 */
MxToolbar.prototype.destroy = function() {
  MxEvent.release(this.container)
  this.container = null
  this.defaultMode = null
  this.defaultFunction = null
  this.selectedMode = null

  if (this.menu !== null) {
    this.menu.destroy()
  }
}
