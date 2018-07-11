/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxTooltipHandler
 *
 * Graph event handler that displays tooltips. <mxGraph.getTooltip> is used to
 * get the tooltip for a cell or handle. This handler is built-into
 * <mxGraph.tooltipHandler> and enabled using <mxGraph.setTooltips>.
 *
 * Example:
 *
 * (code>
 * new MxTooltipHandler(graph);
 * (end)
 *
 * Constructor: MxTooltipHandler
 *
 * Constructs an event handler that displays tooltips with the specified
 * delay (in milliseconds). If no delay is specified then a default delay
 * of 500 ms (0.5 sec) is used.
 *
 * Parameters:
 *
 * graph - Reference to the enclosing <mxGraph>.
 * delay - Optional delay in milliseconds.
 */
import MxEvent from '../util/MxEvent'
import MxUtils from '../util/MxUtils'
import MxConstants from '../util/MxConstants'
export default class MxTooltipHandler {
  constructor(graph, delay) {
    if (graph !== null) {
      this.graph = graph
      this.delay = delay || 500
      this.graph.addMouseListener(this)
    }
  };
}

/**
 * Variable: zIndex
 *
 * Specifies the zIndex for the tooltip and its shadow. Default is 10005.
 */
MxTooltipHandler.prototype.zIndex = 10005

/**
 * Variable: graph
 *
 * Reference to the enclosing <mxGraph>.
 */
MxTooltipHandler.prototype.graph = null

/**
 * Variable: delay
 *
 * Delay to show the tooltip in milliseconds. Default is 500.
 */
MxTooltipHandler.prototype.delay = null

/**
 * Variable: ignoreTouchEvents
 *
 * Specifies if touch and pen events should be ignored. Default is true.
 */
MxTooltipHandler.prototype.ignoreTouchEvents = true

/**
 * Variable: hideOnHover
 *
 * Specifies if the tooltip should be hidden if the mouse is moved over the
 * current cell. Default is false.
 */
MxTooltipHandler.prototype.hideOnHover = false

/**
 * Variable: destroyed
 *
 * True if this handler was destroyed using <destroy>.
 */
MxTooltipHandler.prototype.destroyed = false

/**
 * Variable: enabled
 *
 * Specifies if events are handled. Default is true.
 */
MxTooltipHandler.prototype.enabled = true

/**
 * Function: isEnabled
 *
 * Returns true if events are handled. This implementation
 * returns <enabled>.
 */
MxTooltipHandler.prototype.isEnabled = function() {
  return this.enabled
}

/**
 * Function: setEnabled
 *
 * Enables or disables event handling. This implementation
 * updates <enabled>.
 */
MxTooltipHandler.prototype.setEnabled = function(enabled) {
  this.enabled = enabled
}

/**
 * Function: isHideOnHover
 *
 * Returns <hideOnHover>.
 */
MxTooltipHandler.prototype.isHideOnHover = function() {
  return this.hideOnHover
}

/**
 * Function: setHideOnHover
 *
 * Sets <hideOnHover>.
 */
MxTooltipHandler.prototype.setHideOnHover = function(value) {
  this.hideOnHover = value
}

/**
 * Function: init
 *
 * Initializes the DOM nodes required for this tooltip handler.
 */
MxTooltipHandler.prototype.init = function() {
  if (document.body !== null) {
    this.div = document.createElement('div')
    this.div.className = 'mxTooltip'
    this.div.style.visibility = 'hidden'

    document.body.appendChild(this.div)

    MxEvent.addGestureListeners(this.div, MxUtils.bind(this, function(evt) {
      this.hideTooltip()
    }))
  }
}

/**
 * Function: mouseDown
 *
 * Handles the event by initiating a rubberband selection. By consuming the
 * event all subsequent events of the gesture are redirected to this
 * handler.
 */
MxTooltipHandler.prototype.mouseDown = function(sender, me) {
  this.reset(me, false)
  this.hideTooltip()
}

/**
 * Function: mouseMove
 *
 * Handles the event by updating the rubberband selection.
 */
MxTooltipHandler.prototype.mouseMove = function(sender, me) {
  if (me.getX() !== this.lastX || me.getY() !== this.lastY) {
    this.reset(me, true)

    if (this.isHideOnHover() || me.getState() !== this.state || (me.getSource() !== this.node && (!this.stateSource || (me.getState() !== null && this.stateSource === (me.isSource(me.getState().shape) || !me.isSource(me.getState().text)))))) {
      this.hideTooltip()
    }
  }

  this.lastX = me.getX()
  this.lastY = me.getY()
}

/**
 * Function: mouseUp
 *
 * Handles the event by resetting the tooltip timer or hiding the existing
 * tooltip.
 */
MxTooltipHandler.prototype.mouseUp = function(sender, me) {
  this.reset(me, true)
  this.hideTooltip()
}

/**
 * Function: resetTimer
 *
 * Resets the timer.
 */
MxTooltipHandler.prototype.resetTimer = function() {
  if (this.thread !== null) {
    window.clearTimeout(this.thread)
    this.thread = null
  }
}

/**
 * Function: reset
 *
 * Resets and/or restarts the timer to trigger the display of the tooltip.
 */
MxTooltipHandler.prototype.reset = function(me, restart) {
  if (!this.ignoreTouchEvents || MxEvent.isMouseEvent(me.getEvent())) {
    this.resetTimer()

    if (restart && this.isEnabled() && me.getState() !== null && (this.div === null || this.div.style.visibility === 'hidden')) {
      let state = me.getState()
      let node = me.getSource()
      let x = me.getX()
      let y = me.getY()
      let stateSource = me.isSource(state.shape) || me.isSource(state.text)

      this.thread = window.setTimeout(MxUtils.bind(this, function() {
        if (!this.graph.isEditing() && !this.graph.popupMenuHandler.isMenuShowing() && !this.graph.isMouseDown) {
          // Uses information from inside event cause using the event at
          // this (delayed) point in time is not possible in IE as it no
          // longer contains the required information (member not found)
          let tip = this.graph.getTooltip(state, node, x, y)
          this.show(tip, x, y)
          this.state = state
          this.node = node
          this.stateSource = stateSource
        }
      }), this.delay)
    }
  }
}

/**
 * Function: hide
 *
 * Hides the tooltip and resets the timer.
 */
MxTooltipHandler.prototype.hide = function() {
  this.resetTimer()
  this.hideTooltip()
}

/**
 * Function: hideTooltip
 *
 * Hides the tooltip.
 */
MxTooltipHandler.prototype.hideTooltip = function() {
  if (this.div !== null) {
    this.div.style.visibility = 'hidden'
    this.div.innerHTML = ''
  }
}

/**
 * Function: show
 *
 * Shows the tooltip for the specified cell and optional index at the
 * specified location (with a vertical offset of 10 pixels).
 */
MxTooltipHandler.prototype.show = function(tip, x, y) {
  if (!this.destroyed && tip !== null && tip.length > 0) {
    // Initializes the DOM nodes if required
    if (this.div === null) {
      this.init()
    }

    let origin = MxUtils.getScrollOrigin()

    this.div.style.zIndex = this.zIndex
    this.div.style.left = (x + origin.x) + 'px'
    this.div.style.top = (y + MxConstants.TOOLTIP_VERTICAL_OFFSET + origin.y) + 'px'

    if (!MxUtils.isNode(tip)) {
      this.div.innerHTML = tip.replace(/\n/g, '<br>')
    } else {
      this.div.innerHTML = ''
      this.div.appendChild(tip)
    }

    this.div.style.visibility = ''
    MxUtils.fit(this.div)
  }
}

/**
 * Function: destroy
 *
 * Destroys the handler and all its resources and DOM nodes.
 */
MxTooltipHandler.prototype.destroy = function() {
  if (!this.destroyed) {
    this.graph.removeMouseListener(this)
    MxEvent.release(this.div)

    if (this.div !== null && this.div.parentNode !== null) {
      this.div.parentNode.removeChild(this.div)
    }

    this.destroyed = true
    this.div = null
  }
}
