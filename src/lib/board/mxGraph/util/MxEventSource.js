/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxEventSource
 *
 * Base class for objects that dispatch named events. To create a subclass that
 * inherits from MxEventSource, the following code is used.
 *
 * (code)
 * function MyClass() { };
 *
 * MyClass.prototype = new MxEventSource();
 * MyClass.prototype.constructor = MyClass;
 * (end)
 *
 * Known Subclasses:
 *
 * <mxGraphModel>, <mxGraph>, <mxGraphView>, <mxEditor>, <mxCellOverlay>,
 * <mxToolbar>, <mxWindow>
 *
 * Constructor: MxEventSource
 *
 * Constructs a new event source.
 */

import MxEventObject from './MxEventObject'

export default class MxEventSource {
  constructor(eventSource) {
    this.setEventSource(eventSource)
  }
}

/**
 * variable: eventListeners
 *
 * Holds the event names and associated listeners in an array. The array
 * contains the event name followed by the respective listener for each
 * registered listener.
 */
MxEventSource.prototype.eventListeners = null

/**
 * variable: eventsEnabled
 *
 * Specifies if events can be fired. Default is true.
 */
MxEventSource.prototype.eventsEnabled = true

/**
 * variable: eventSource
 *
 * Optional source for events. Default is null.
 */
MxEventSource.prototype.eventSource = null

/**
 * Function: isEventsEnabled
 *
 * Returns <eventsEnabled>.
 */
MxEventSource.prototype.isEventsEnabled = function() {
  return this.eventsEnabled
}

/**
 * Function: setEventsEnabled
 *
 * Sets <eventsEnabled>.
 */
MxEventSource.prototype.setEventsEnabled = function(value) {
  this.eventsEnabled = value
}

/**
 * Function: getEventSource
 *
 * Returns <eventSource>.
 */
MxEventSource.prototype.getEventSource = function() {
  return this.eventSource
}

/**
 * Function: setEventSource
 *
 * Sets <eventSource>.
 */
MxEventSource.prototype.setEventSource = function(value) {
  this.eventSource = value
}

/**
 * Function: addListener
 *
 * Binds the specified function to the given event name. If no event name
 * is given, then the listener is registered for all events.
 *
 * The parameters of the listener are the sender and an <MxEventObject>.
 */
MxEventSource.prototype.addListener = function(name, funct) {
  if (this.eventListeners === null) {
    this.eventListeners = []
  }

  this.eventListeners.push(name)
  this.eventListeners.push(funct)
}

/**
 * Function: removeListener
 *
 * Removes all occurrences of the given listener from <eventListeners>.
 */
MxEventSource.prototype.removeListener = function(funct) {
  if (this.eventListeners !== null) {
    let i = 0

    while (i < this.eventListeners.length) {
      if (this.eventListeners[i + 1] === funct) {
        this.eventListeners.splice(i, 2)
      } else {
        i += 2
      }
    }
  }
}

/**
 * Function: fireEvent
 *
 * Dispatches the given event to the listeners which are registered for
 * the event. The sender argument is optional. The current execution scope
 * ("this") is used for the listener invocation (see <mxUtils.bind>).
 *
 * Example:
 *
 * (code)
 * fireEvent(new MxEventObject("eventName", key1, val1, .., keyN, valN))
 * (end)
 *
 * Parameters:
 *
 * evt - <MxEventObject> that represents the event.
 * sender - Optional sender to be passed to the listener. Default value is
 * the return value of <getEventSource>.
 */
MxEventSource.prototype.fireEvent = function(evt, sender) {
  if (this.eventListeners !== null && this.isEventsEnabled()) {
    if (evt === null) {
      evt = new MxEventObject()
    }

    if (sender === null) {
      sender = this.getEventSource()
    }

    if (sender === null) {
      sender = this
    }

    let args = [sender, evt]

    for (let i = 0; i < this.eventListeners.length; i += 2) {
      let listen = this.eventListeners[i]

      if (listen === null || listen === evt.getName()) {
        this.eventListeners[i + 1].apply(this, args)
      }
    }
  }
}
