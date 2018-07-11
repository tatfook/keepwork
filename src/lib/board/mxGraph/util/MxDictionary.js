/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxDictionary
 *
 * A wrapper class for an associative array with object keys. Note: This
 * implementation uses <mxObjectIdentitiy> to turn object keys into strings.
 *
 * Constructor: mxEventSource
 *
 * Constructs a new dictionary which allows object to be used as keys.
 */

import MxObjectIdentity from './MxObjectIdentity'

export default class MxDictionary {
  constructor() {
    this.clear()
  }
}

/**
 * Function: map
 *
 * Stores the (key, value) pairs in this dictionary.
 */
MxDictionary.prototype.map = null

/**
 * Function: clear
 *
 * Clears the dictionary.
 */
MxDictionary.prototype.clear = function() {
  this.map = {}
}

/**
 * Function: get
 *
 * Returns the value for the given key.
 */
MxDictionary.prototype.get = function(key) {
  let id = MxObjectIdentity.get(key)

  return this.map[id]
}

/**
 * Function: put
 *
 * Stores the value under the given key and returns the previous
 * value for that key.
 */
MxDictionary.prototype.put = function(key, value) {
  let id = MxObjectIdentity.get(key)
  let previous = this.map[id]
  this.map[id] = value

  return previous
}

/**
 * Function: remove
 *
 * Removes the value for the given key and returns the value that
 * has been removed.
 */
MxDictionary.prototype.remove = function(key) {
  let id = MxObjectIdentity.get(key)
  let previous = this.map[id]
  delete this.map[id]

  return previous
}

/**
 * Function: getKeys
 *
 * Returns all keys as an array.
 */
MxDictionary.prototype.getKeys = function() {
  let result = []

  for (let key in this.map) {
    result.push(key)
  }

  return result
}

/**
 * Function: getValues
 *
 * Returns all values as an array.
 */
MxDictionary.prototype.getValues = function() {
  let result = []

  for (let key in this.map) {
    result.push(this.map[key])
  }

  return result
}

/**
 * Function: visit
 *
 * Visits all entries in the dictionary using the given function with the
 * following signature: function(key, value) where key is a string and
 * value is an object.
 *
 * Parameters:
 *
 * visitor - A function that takes the key and value as arguments.
 */
MxDictionary.prototype.visit = function(visitor) {
  for (let key in this.map) {
    visitor(key, this.map[key])
  }
}
