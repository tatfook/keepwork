/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxMouseEvent
 *
 * Base class for all mouse events in mxGraph. A listener for this event should
 * implement the following methods:
 *
 * (code)
 * graph.addMouseListener(
 * {
 *   mouseDown: function(sender, evt)
 *   {
 *     mxLog.debug('mouseDown');
 *   },
 *   mouseMove: function(sender, evt)
 *   {
 *     mxLog.debug('mouseMove');
 *   },
 *   mouseUp: function(sender, evt)
 *   {
 *     mxLog.debug('mouseUp');
 *   }
 * });
 * (end)
 *
 * Constructor: MxMouseEvent
 *
 * Constructs a new event object for the given arguments.
 *
 * Parameters:
 *
 * evt - Native mouse event.
 * state - Optional <mxCellState> under the mouse.
 *
 */
import MxEvent from './MxEvent'
import MxUtils from './MxUtils'
import MxClient from '@/lib/board/mxGraph/MxClient'

export default class MxMouseEvent {
  constructor(evt, state) {
    this.evt = evt
    this.state = state
    this.sourceState = state
  }
}

/**
 * Variable: consumed
 *
 * Holds the consumed state of this event.
 */
MxMouseEvent.prototype.consumed = false

/**
 * Variable: evt
 *
 * Holds the inner event object.
 */
MxMouseEvent.prototype.evt = null

/**
 * Variable: graphX
 *
 * Holds the x-coordinate of the event in the graph. This value is set in
 * <mxGraph.fireMouseEvent>.
 */
MxMouseEvent.prototype.graphX = null

/**
 * Variable: graphY
 *
 * Holds the y-coordinate of the event in the graph. This value is set in
 * <mxGraph.fireMouseEvent>.
 */
MxMouseEvent.prototype.graphY = null

/**
 * Variable: state
 *
 * Holds the optional <mxCellState> associated with this event.
 */
MxMouseEvent.prototype.state = null

/**
 * Variable: sourceState
 *
 * Holds the <mxCellState> that was passed to the constructor. This can be
 * different from <state> depending on the result of <mxGraph.getEventState>.
 */
MxMouseEvent.prototype.sourceState = null

/**
 * Function: getEvent
 *
 * Returns <evt>.
 */
MxMouseEvent.prototype.getEvent = function() {
  return this.evt
}

/**
 * Function: getSource
 *
 * Returns the target DOM element using <MxEvent.getSource> for <evt>.
 */
MxMouseEvent.prototype.getSource = function() {
  return MxEvent.getSource(this.evt)
}

/**
 * Function: isSource
 *
 * Returns true if the given <mxShape> is the source of <evt>.
 */
MxMouseEvent.prototype.isSource = function(shape) {
  if (shape !== null) {
    return MxUtils.isAncestorNode(shape.node, this.getSource())
  }

  return false
}

/**
 * Function: getX
 *
 * Returns <evt.clientX>.
 */
MxMouseEvent.prototype.getX = function() {
  return MxEvent.getClientX(this.getEvent())
}

/**
 * Function: getY
 *
 * Returns <evt.clientY>.
 */
MxMouseEvent.prototype.getY = function() {
  return MxEvent.getClientY(this.getEvent())
}

/**
 * Function: getGraphX
 *
 * Returns <graphX>.
 */
MxMouseEvent.prototype.getGraphX = function() {
  return this.graphX
}

/**
 * Function: getGraphY
 *
 * Returns <graphY>.
 */
MxMouseEvent.prototype.getGraphY = function() {
  return this.graphY
}

/**
 * Function: getState
 *
 * Returns <state>.
 */
MxMouseEvent.prototype.getState = function() {
  return this.state
}

/**
 * Function: getCell
 *
 * Returns the <mxCell> in <state> is not null.
 */
MxMouseEvent.prototype.getCell = function() {
  let state = this.getState()

  if (state !== null) {
    return state.cell
  }

  return null
}

/**
 * Function: isPopupTrigger
 *
 * Returns true if the event is a popup trigger.
 */
MxMouseEvent.prototype.isPopupTrigger = function() {
  return MxEvent.isPopupTrigger(this.getEvent())
}

/**
 * Function: isConsumed
 *
 * Returns <consumed>.
 */
MxMouseEvent.prototype.isConsumed = function() {
  return this.consumed
}

/**
 * Function: consume
 *
 * Sets <consumed> to true and invokes preventDefault on the native event
 * if such a method is defined. This is used mainly to avoid the cursor from
 * being changed to a text cursor in Webkit. You can use the preventDefault
 * flag to disable this functionality.
 *
 * Parameters:
 *
 * preventDefault - Specifies if the native event should be canceled. Default
 * is true.
 */
MxMouseEvent.prototype.consume = function(preventDefault) {
  preventDefault = preventDefault !== null ? preventDefault : true

  if (preventDefault && this.evt.preventDefault) {
    this.evt.preventDefault()
  }

  // Workaround for images being dragged in IE
  // Does not change returnValue in Opera
  if (MxClient.IS_IE) {
    this.evt.returnValue = true
  }

  // Sets local consumed state
  this.consumed = true
}
