/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
/**
 * Class: MxRubberband
 *
 * Event handler that selects rectangular regions. This is not built-into
 * <mxGraph>. To enable rubberband selection in a graph, use the following code.
 *
 * Example:
 *
 * (code)
 * let rubberband = new MxRubberband(graph);
 * (end)
 *
 * Constructor: MxRubberband
 *
 * Constructs an event handler that selects rectangular regions in the graph
 * using rubberband selection.
 */
import MxUtils from '../util/MxUtils'
import MxEvent from '../util/MxEvent'
import MxClient from '../MxClient'
import MxPoint from '../util/MxPoint'
import MxMouseEvent from '../util/MxMouseEvent'
import MxRectangle from '../util/MxRectangle'
export default class MxRubberband {
  constructor(graph) {
    if (graph !== null) {
      this.graph = graph
      this.graph.addMouseListener(this)

      // Handles force rubberband event
      this.forceRubberbandHandler = MxUtils.bind(this, function(sender, evt) {
        let evtName = evt.getProperty('eventName')
        let me = evt.getProperty('event')

        if (evtName === MxEvent.MOUSE_DOWN && this.isForceRubberbandEvent(me)) {
          let offset = MxUtils.getOffset(this.graph.container)
          let origin = MxUtils.getScrollOrigin(this.graph.container)
          origin.x -= offset.x
          origin.y -= offset.y
          this.start(me.getX() + origin.x, me.getY() + origin.y)
          me.consume(false)
        }
      })

      this.graph.addListener(MxEvent.FIRE_MOUSE_EVENT, this.forceRubberbandHandler)

      // Repaints the marquee after autoscroll
      this.panHandler = MxUtils.bind(this, function() {
        this.repaint()
      })

      this.graph.addListener(MxEvent.PAN, this.panHandler)

      // Does not show menu if any touch gestures take place after the trigger
      this.gestureHandler = MxUtils.bind(this, function(sender, eo) {
        if (this.first !== null) {
          this.reset()
        }
      })

      this.graph.addListener(MxEvent.GESTURE, this.gestureHandler)

      // Automatic deallocation of memory
      if (MxClient.IS_IE) {
        MxEvent.addListener(window, 'unload',
          MxUtils.bind(this, function() {
            this.destroy()
          })
        )
      }
    }
  };
}

/**
 * Variable: defaultOpacity
 *
 * Specifies the default opacity to be used for the rubberband div. Default
 * is 20.
 */
MxRubberband.prototype.defaultOpacity = 20

/**
 * Variable: enabled
 *
 * Specifies if events are handled. Default is true.
 */
MxRubberband.prototype.enabled = true

/**
 * Variable: div
 *
 * Holds the DIV element which is currently visible.
 */
MxRubberband.prototype.div = null

/**
 * Variable: sharedDiv
 *
 * Holds the DIV element which is used to display the rubberband.
 */
MxRubberband.prototype.sharedDiv = null

/**
 * Variable: currentX
 *
 * Holds the value of the x argument in the last call to <update>.
 */
MxRubberband.prototype.currentX = 0

/**
 * Variable: currentY
 *
 * Holds the value of the y argument in the last call to <update>.
 */
MxRubberband.prototype.currentY = 0

/**
 * Variable: fadeOut
 *
 * Optional fade out effect. Default is false.
 */
MxRubberband.prototype.fadeOut = false

/**
 * Function: isEnabled
 *
 * Returns true if events are handled. This implementation returns
 * <enabled>.
 */
MxRubberband.prototype.isEnabled = function() {
  return this.enabled
}

/**
 * Function: setEnabled
 *
 * Enables or disables event handling. This implementation updates
 * <enabled>.
 */
MxRubberband.prototype.setEnabled = function(enabled) {
  this.enabled = enabled
}

/**
 * Function: isForceRubberbandEvent
 *
 * Returns true if the given <MxMouseEvent> should start rubberband selection.
 * This implementation returns true if the alt key is pressed.
 */
MxRubberband.prototype.isForceRubberbandEvent = function(me) {
  return MxEvent.isAltDown(me.getEvent())
}

/**
 * Function: mouseDown
 *
 * Handles the event by initiating a rubberband selection. By consuming the
 * event all subsequent events of the gesture are redirected to this
 * handler.
 */
MxRubberband.prototype.mouseDown = function(sender, me) {
  if (!me.isConsumed() && this.isEnabled() && this.graph.isEnabled() && me.getState() === null && !MxEvent.isMultiTouchEvent(me.getEvent())) {
    let offset = MxUtils.getOffset(this.graph.container)
    let origin = MxUtils.getScrollOrigin(this.graph.container)
    origin.x -= offset.x
    origin.y -= offset.y
    this.start(me.getX() + origin.x, me.getY() + origin.y)

    // Does not prevent the default for this event so that the
    // event processing chain is still executed even if we start
    // rubberbanding. This is required eg. in ExtJs to hide the
    // current context menu. In mouseMove we'll make sure we're
    // not selecting anything while we're rubberbanding.
    me.consume(false)
  }
}

/**
 * Function: start
 *
 * Sets the start point for the rubberband selection.
 */
MxRubberband.prototype.start = function(x, y) {
  this.first = new MxPoint(x, y)

  let container = this.graph.container

  function createMouseEvent(evt) {
    let me = new MxMouseEvent(evt)
    let pt = MxUtils.convertPoint(container, me.getX(), me.getY())

    me.graphX = pt.x
    me.graphY = pt.y

    return me
  };

  this.dragHandler = MxUtils.bind(this, function(evt) {
    this.mouseMove(this.graph, createMouseEvent(evt))
  })

  this.dropHandler = MxUtils.bind(this, function(evt) {
    this.mouseUp(this.graph, createMouseEvent(evt))
  })

  // Workaround for rubberband stopping if the mouse leaves the container in Firefox
  if (MxClient.IS_FF) {
    MxEvent.addGestureListeners(document, null, this.dragHandler, this.dropHandler)
  }
}

/**
 * Function: mouseMove
 *
 * Handles the event by updating therubberband selection.
 */
MxRubberband.prototype.mouseMove = function(sender, me) {
  if (!me.isConsumed() && this.first !== null) {
    let origin = MxUtils.getScrollOrigin(this.graph.container)
    let offset = MxUtils.getOffset(this.graph.container)
    origin.x -= offset.x
    origin.y -= offset.y
    let x = me.getX() + origin.x
    let y = me.getY() + origin.y
    let dx = this.first.x - x
    let dy = this.first.y - y
    let tol = this.graph.tolerance

    if (this.div !== null || Math.abs(dx) > tol || Math.abs(dy) > tol) {
      if (this.div === null) {
        this.div = this.createShape()
      }

      // Clears selection while rubberbanding. This is required because
      // the event is not consumed in mouseDown.
      MxUtils.clearSelection()

      this.update(x, y)
      me.consume()
    }
  }
}

/**
 * Function: createShape
 *
 * Creates the rubberband selection shape.
 */
MxRubberband.prototype.createShape = function() {
  if (this.sharedDiv === null) {
    this.sharedDiv = document.createElement('div')
    this.sharedDiv.className = 'MxRubberband'
    MxUtils.setOpacity(this.sharedDiv, this.defaultOpacity)
  }

  this.graph.container.appendChild(this.sharedDiv)
  let result = this.sharedDiv

  if (MxClient.IS_SVG && (!MxClient.IS_IE || document.documentMode >= 10) && this.fadeOut) {
    this.sharedDiv = null
  }

  return result
}

/**
 * Function: isActive
 *
 * Returns true if this handler is active.
 */
MxRubberband.prototype.isActive = function(sender, me) {
  return this.div !== null && this.div.style.display !== 'none'
}

/**
 * Function: mouseUp
 *
 * Handles the event by selecting the region of the rubberband using
 * <mxGraph.selectRegion>.
 */
MxRubberband.prototype.mouseUp = function(sender, me) {
  let active = this.isActive()
  this.reset()

  if (active) {
    this.execute(me.getEvent())
    me.consume()
  }
}

/**
 * Function: execute
 *
 * Resets the state of this handler and selects the current region
 * for the given event.
 */
MxRubberband.prototype.execute = function(evt) {
  let rect = new MxRectangle(this.x, this.y, this.width, this.height)
  this.graph.selectRegion(rect, evt)
}

/**
 * Function: reset
 *
 * Resets the state of the rubberband selection.
 */
MxRubberband.prototype.reset = function() {
  if (this.div !== null) {
    if (MxClient.IS_SVG && (!MxClient.IS_IE || document.documentMode >= 10) && this.fadeOut) {
      let temp = this.div
      MxUtils.setPrefixedStyle(temp.style, 'transition', 'all 0.2s linear')
      temp.style.pointerEvents = 'none'
      temp.style.opacity = 0

      window.setTimeout(function() {
        temp.parentNode.removeChild(temp)
      }, 200)
    } else {
      this.div.parentNode.removeChild(this.div)
    }
  }

  MxEvent.removeGestureListeners(document, null, this.dragHandler, this.dropHandler)
  this.dragHandler = null
  this.dropHandler = null

  this.currentX = 0
  this.currentY = 0
  this.first = null
  this.div = null
}

/**
 * Function: update
 *
 * Sets <currentX> and <currentY> and calls <repaint>.
 */
MxRubberband.prototype.update = function(x, y) {
  this.currentX = x
  this.currentY = y

  this.repaint()
}

/**
 * Function: repaint
 *
 * Computes the bounding box and updates the style of the <div>.
 */
MxRubberband.prototype.repaint = function() {
  if (this.div !== null) {
    let x = this.currentX - this.graph.panDx
    let y = this.currentY - this.graph.panDy

    this.x = Math.min(this.first.x, x)
    this.y = Math.min(this.first.y, y)
    this.width = Math.max(this.first.x, x) - this.x
    this.height = Math.max(this.first.y, y) - this.y

    let dx = (MxClient.IS_VML) ? this.graph.panDx : 0
    let dy = (MxClient.IS_VML) ? this.graph.panDy : 0

    this.div.style.left = (this.x + dx) + 'px'
    this.div.style.top = (this.y + dy) + 'px'
    this.div.style.width = Math.max(1, this.width) + 'px'
    this.div.style.height = Math.max(1, this.height) + 'px'
  }
}

/**
 * Function: destroy
 *
 * Destroys the handler and all its resources and DOM nodes. This does
 * normally not need to be called, it is called automatically when the
 * window unloads.
 */
MxRubberband.prototype.destroy = function() {
  if (!this.destroyed) {
    this.destroyed = true
    this.graph.removeMouseListener(this)
    this.graph.removeListener(this.forceRubberbandHandler)
    this.graph.removeListener(this.panHandler)
    this.reset()

    if (this.sharedDiv !== null) {
      this.sharedDiv = null
    }
  }
}
