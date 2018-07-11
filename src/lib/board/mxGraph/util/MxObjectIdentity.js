/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
import MxUtils from './MxUtils'

let MxObjectIdentity = {
  /**
   * Class: MxObjectIdentity
   *
   * Identity for JavaScript objects and functions. This is implemented using
   * a simple incrementing counter which is stored in each object under
   * <FIELD_NAME>.
   *
   * The identity for an object does not change during its lifecycle.
   *
   * Variable: FIELD_NAME
   *
   * Name of the field to be used to store the object ID. Default is
   * <code>mxObjectId</code>.
   */
  FIELD_NAME: 'mxObjectId',

  /**
   * Variable: counter
   *
   * Current counter.
   */
  counter: 0,

  /**
   * Function: get
   *
   * Returns the ID for the given object or function or null if no object
   * is specified.
   */
  get: function(obj) {
    if (obj != null) {
      if (obj[MxObjectIdentity.FIELD_NAME] === null) {
        if (typeof obj === 'object') {
          let ctor = MxUtils.getFunctionName(obj.constructor)
          obj[MxObjectIdentity.FIELD_NAME] =
            ctor + '#' + MxObjectIdentity.counter++
        } else if (typeof obj === 'function') {
          obj[MxObjectIdentity.FIELD_NAME] =
            'Function#' + MxObjectIdentity.counter++
        }
      }

      return obj[MxObjectIdentity.FIELD_NAME]
    }

    return null
  },

  /**
   * Function: clear
   *
   * Deletes the ID from the given object or function.
   */
  clear: function(obj) {
    if (typeof obj === 'object' || typeof obj === 'function') {
      delete obj[MxObjectIdentity.FIELD_NAME]
    }
  }
}
