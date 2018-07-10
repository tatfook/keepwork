/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxEventObject
 *
 * The MxEventObject is a wrapper for all properties of a single event.
 * Additionally, it also offers functions to consume the event and check if it
 * was consumed as follows:
 *
 * (code)
 * evt.consume();
 * INV: evt.isConsumed() === true
 * (end)
 *
 * Constructor: MxEventObject
 *
 * Constructs a new event object with the specified name. An optional
 * sequence of key, value pairs can be appended to define properties.
 *
 * Example:
 *
 * (code)
 * new MxEventObject("eventName", key1, val1, .., keyN, valN)
 * (end)
 */
export default class MxEventObject {
  constructor(name) {
    this.name = name
    this.properties = []

    for (let i = 1; i < arguments.length; i += 2) {
      if (arguments[i + 1] !== null) {
        this.properties[arguments[i]] = arguments[i + 1]
      }
    }
  }
}

/**
 * variable: name
 *
 * Holds the name.
 */
MxEventObject.prototype.name = null

/**
 * variable: properties
 *
 * Holds the properties as an associative array.
 */
MxEventObject.prototype.properties = null

/**
 * variable: consumed
 *
 * Holds the consumed state. Default is false.
 */
MxEventObject.prototype.consumed = false

/**
 * Function: getName
 *
 * Returns <name>.
 */
MxEventObject.prototype.getName = function() {
  return this.name
}

/**
 * Function: getProperties
 *
 * Returns <properties>.
 */
MxEventObject.prototype.getProperties = function() {
  return this.properties
}

/**
 * Function: getProperty
 *
 * Returns the property for the given key.
 */
MxEventObject.prototype.getProperty = function(key) {
  return this.properties[key]
}

/**
 * Function: isConsumed
 *
 * Returns true if the event has been consumed.
 */
MxEventObject.prototype.isConsumed = function() {
  return this.consumed
}

/**
 * Function: consume
 *
 * Consumes the event.
 */
MxEventObject.prototype.consume = function() {
  this.consumed = true
}
