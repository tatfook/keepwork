/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxPanningHandler
 *
 * Event handler that pans and creates popupmenus. To use the left
 * mousebutton for panning without interfering with cell moving and
 * resizing, use <isUseLeftButton> and <isIgnoreCell>. For grid size
 * steps while panning, use <useGrid>. This handler is built-into
 * <mxGraph.panningHandler> and enabled using <mxGraph.setPanning>.
 *
 * Constructor: MxPanningHandler
 *
 * Constructs an event handler that creates a <mxPopupMenu>
 * and pans the graph.
 *
 * Event: MxEvent.PAN_START
 *
 * Fires when the panning handler changes its <active> state to true. The
 * <code>event</code> property contains the corresponding <mxMouseEvent>.
 *
 * Event: MxEvent.PAN
 *
 * Fires while handle is processing events. The <code>event</code> property contains
 * the corresponding <mxMouseEvent>.
 *
 * Event: MxEvent.PAN_END
 *
 * Fires when the panning handler changes its <active> state to false. The
 * <code>event</code> property contains the corresponding <mxMouseEvent>.
 */
import MxUtils from '../util/MxUtils'
import MxEvent from '../util/MxEvent'
import MxEventObject from '../util/MxEventObject'
import MxEventSource from '../util/MxEventSource'
export default class MxPanningHandler {
  constructor(graph) {
    if (graph !== null) {
      this.graph = graph
      this.graph.addMouseListener(this)

      // Handles force panning event
      this.forcePanningHandler = MxUtils.bind(this, function(sender, evt) {
        let evtName = evt.getProperty('eventName')
        let me = evt.getProperty('event')

        if (evtName === MxEvent.MOUSE_DOWN && this.isForcePanningEvent(me)) {
          this.start(me)
          this.active = true
          this.fireEvent(new MxEventObject(MxEvent.PAN_START, 'event', me))
          me.consume()
        }
      })

      this.graph.addListener(MxEvent.FIRE_MOUSE_EVENT, this.forcePanningHandler)

      // Handles pinch gestures
      this.gestureHandler = MxUtils.bind(this, function(sender, eo) {
        if (this.isPinchEnabled()) {
          let evt = eo.getProperty('event')

          if (!MxEvent.isConsumed(evt) && evt.type === 'gesturestart') {
            this.initialScale = this.graph.view.scale

            // Forces start of panning when pinch gesture starts
            if (!this.active && this.mouseDownEvent !== null) {
              this.start(this.mouseDownEvent)
              this.mouseDownEvent = null
            }
          } else if (evt.type === 'gestureend' && this.initialScale !== null) {
            this.initialScale = null
          }

          if (this.initialScale !== null) {
            let value = Math.round(this.initialScale * evt.scale * 100) / 100

            if (this.minScale !== null) {
              value = Math.max(this.minScale, value)
            }

            if (this.maxScale !== null) {
              value = Math.min(this.maxScale, value)
            }

            if (this.graph.view.scale !== value) {
              this.graph.zoomTo(value)
              MxEvent.consume(evt)
            }
          }
        }
      })

      this.graph.addListener(MxEvent.GESTURE, this.gestureHandler)

      this.mouseUpListener = MxUtils.bind(this, function() {
        if (this.active) {
          this.reset()
        }
      })

      // Stops scrolling on every mouseup anywhere in the document
      MxEvent.addListener(document, 'mouseup', this.mouseUpListener)
    }
  };
}

/**
 * Extends MxEventSource.
 */
MxPanningHandler.prototype = new MxEventSource()
MxPanningHandler.prototype.constructor = MxPanningHandler

/**
 * Variable: graph
 *
 * Reference to the enclosing <mxGraph>.
 */
MxPanningHandler.prototype.graph = null

/**
 * Variable: useLeftButtonForPanning
 *
 * Specifies if panning should be active for the left mouse button.
 * Setting this to true may conflict with <mxRubberband>. Default is false.
 */
MxPanningHandler.prototype.useLeftButtonForPanning = false

/**
 * Variable: usePopupTrigger
 *
 * Specifies if <MxEvent.isPopupTrigger> should also be used for panning.
 */
MxPanningHandler.prototype.usePopupTrigger = true

/**
 * Variable: ignoreCell
 *
 * Specifies if panning should be active even if there is a cell under the
 * mousepointer. Default is false.
 */
MxPanningHandler.prototype.ignoreCell = false

/**
 * Variable: previewEnabled
 *
 * Specifies if the panning should be previewed. Default is true.
 */
MxPanningHandler.prototype.previewEnabled = true

/**
 * Variable: useGrid
 *
 * Specifies if the panning steps should be aligned to the grid size.
 * Default is false.
 */
MxPanningHandler.prototype.useGrid = false

/**
 * Variable: panningEnabled
 *
 * Specifies if panning should be enabled. Default is true.
 */
MxPanningHandler.prototype.panningEnabled = true

/**
 * Variable: pinchEnabled
 *
 * Specifies if pinch gestures should be handled as zoom. Default is true.
 */
MxPanningHandler.prototype.pinchEnabled = true

/**
 * Variable: maxScale
 *
 * Specifies the maximum scale. Default is 8.
 */
MxPanningHandler.prototype.maxScale = 8

/**
 * Variable: minScale
 *
 * Specifies the minimum scale. Default is 0.01.
 */
MxPanningHandler.prototype.minScale = 0.01

/**
 * Variable: dx
 *
 * Holds the current horizontal offset.
 */
MxPanningHandler.prototype.dx = null

/**
 * Variable: dy
 *
 * Holds the current vertical offset.
 */
MxPanningHandler.prototype.dy = null

/**
 * Variable: startX
 *
 * Holds the x-coordinate of the start point.
 */
MxPanningHandler.prototype.startX = 0

/**
 * Variable: startY
 *
 * Holds the y-coordinate of the start point.
 */
MxPanningHandler.prototype.startY = 0

/**
 * Function: isActive
 *
 * Returns true if the handler is currently active.
 */
MxPanningHandler.prototype.isActive = function() {
  return this.active || this.initialScale !== null
}

/**
 * Function: isPanningEnabled
 *
 * Returns <panningEnabled>.
 */
MxPanningHandler.prototype.isPanningEnabled = function() {
  return this.panningEnabled
}

/**
 * Function: setPanningEnabled
 *
 * Sets <panningEnabled>.
 */
MxPanningHandler.prototype.setPanningEnabled = function(value) {
  this.panningEnabled = value
}

/**
 * Function: isPinchEnabled
 *
 * Returns <pinchEnabled>.
 */
MxPanningHandler.prototype.isPinchEnabled = function() {
  return this.pinchEnabled
}

/**
 * Function: setPinchEnabled
 *
 * Sets <pinchEnabled>.
 */
MxPanningHandler.prototype.setPinchEnabled = function(value) {
  this.pinchEnabled = value
}

/**
 * Function: isPanningTrigger
 *
 * Returns true if the given event is a panning trigger for the optional
 * given cell. This returns true if control-shift is pressed or if
 * <usePopupTrigger> is true and the event is a popup trigger.
 */
MxPanningHandler.prototype.isPanningTrigger = function(me) {
  let evt = me.getEvent()

  return (this.useLeftButtonForPanning && me.getState() === null && MxEvent.isLeftMouseButton(evt)) || (MxEvent.isControlDown(evt) && MxEvent.isShiftDown(evt)) || (this.usePopupTrigger && MxEvent.isPopupTrigger(evt))
}

/**
 * Function: isForcePanningEvent
 *
 * Returns true if the given <mxMouseEvent> should start panning. This
 * implementation always returns true if <ignoreCell> is true or for
 * multi touch events.
 */
MxPanningHandler.prototype.isForcePanningEvent = function(me) {
  return this.ignoreCell || MxEvent.isMultiTouchEvent(me.getEvent())
}

/**
 * Function: mouseDown
 *
 * Handles the event by initiating the panning. By consuming the event all
 * subsequent events of the gesture are redirected to this handler.
 */
MxPanningHandler.prototype.mouseDown = function(sender, me) {
  this.mouseDownEvent = me

  if (!me.isConsumed() && this.isPanningEnabled() && !this.active && this.isPanningTrigger(me)) {
    this.start(me)
    this.consumePanningTrigger(me)
  }
}

/**
 * Function: start
 *
 * Starts panning at the given event.
 */
MxPanningHandler.prototype.start = function(me) {
  this.dx0 = -this.graph.container.scrollLeft
  this.dy0 = -this.graph.container.scrollTop

  // Stores the location of the trigger event
  this.startX = me.getX()
  this.startY = me.getY()
  this.dx = null
  this.dy = null

  this.panningTrigger = true
}

/**
 * Function: consumePanningTrigger
 *
 * Consumes the given <mxMouseEvent> if it was a panning trigger in
 * <mouseDown>. The default is to invoke <mxMouseEvent.consume>. Note that this
 * will block any further event processing. If you haven't disabled built-in
 * context menus and require immediate selection of the cell on mouseDown in
 * Safari and/or on the Mac, then use the following code:
 *
 * (code)
 * MxPanningHandler.prototype.consumePanningTrigger = function(me)
 * {
 *   if (me.evt.preventDefault)
 *   {
 *     me.evt.preventDefault();
 *   }
 *
 *   // Stops event processing in IE
 *   me.evt.returnValue = false;
 *
 *   // Sets local consumed state
 *   if (!mxClient.IS_SF && !mxClient.IS_MAC)
 *   {
 *     me.consumed = true;
 *   }
 * };
 * (end)
 */
MxPanningHandler.prototype.consumePanningTrigger = function(me) {
  me.consume()
}

/**
 * Function: mouseMove
 *
 * Handles the event by updating the panning on the graph.
 */
MxPanningHandler.prototype.mouseMove = function(sender, me) {
  this.dx = me.getX() - this.startX
  this.dy = me.getY() - this.startY

  if (this.active) {
    if (this.previewEnabled) {
      // Applies the grid to the panning steps
      if (this.useGrid) {
        this.dx = this.graph.snap(this.dx)
        this.dy = this.graph.snap(this.dy)
      }

      this.graph.panGraph(this.dx + this.dx0, this.dy + this.dy0)
    }

    this.fireEvent(new MxEventObject(MxEvent.PAN, 'event', me))
  } else if (this.panningTrigger) {
    let tmp = this.active

    // Panning is activated only if the mouse is moved
    // beyond the graph tolerance
    this.active = Math.abs(this.dx) > this.graph.tolerance || Math.abs(this.dy) > this.graph.tolerance

    if (!tmp && this.active) {
      this.fireEvent(new MxEventObject(MxEvent.PAN_START, 'event', me))
    }
  }

  if (this.active || this.panningTrigger) {
    me.consume()
  }
}

/**
 * Function: mouseUp
 *
 * Handles the event by setting the translation on the view or showing the
 * popupmenu.
 */
MxPanningHandler.prototype.mouseUp = function(sender, me) {
  if (this.active) {
    if (this.dx !== null && this.dy !== null) {
      // Ignores if scrollbars have been used for panning
      if (!this.graph.useScrollbarsForPanning || !MxUtils.hasScrollbars(this.graph.container)) {
        let scale = this.graph.getView().scale
        let t = this.graph.getView().translate
        this.graph.panGraph(0, 0)
        this.panGraph(t.x + this.dx / scale, t.y + this.dy / scale)
      }

      me.consume()
    }

    this.fireEvent(new MxEventObject(MxEvent.PAN_END, 'event', me))
  }

  this.reset()
}

/**
 * Function: mouseUp
 *
 * Handles the event by setting the translation on the view or showing the
 * popupmenu.
 */
MxPanningHandler.prototype.reset = function() {
  this.panningTrigger = false
  this.mouseDownEvent = null
  this.active = false
  this.dx = null
  this.dy = null
}

/**
 * Function: panGraph
 *
 * Pans <graph> by the given amount.
 */
MxPanningHandler.prototype.panGraph = function(dx, dy) {
  this.graph.getView().setTranslate(dx, dy)
}

/**
 * Function: destroy
 *
 * Destroys the handler and all its resources and DOM nodes.
 */
MxPanningHandler.prototype.destroy = function() {
  this.graph.removeMouseListener(this)
  this.graph.removeListener(this.forcePanningHandler)
  this.graph.removeListener(this.gestureHandler)
  MxEvent.removeListener(document, 'mouseup', this.mouseUpListener)
}
