/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 *
 * Class: MxAnimation
 *
 * Implements a basic animation in JavaScript.
 *
 * Constructor: MxAnimation
 *
 * Constructs an animation.
 *
 * Parameters:
 *
 * graph - Reference to the enclosing <mxGraph>.
 */

import MxEventSource from './MxEventSource'
import MxUtils from './MxUtils'
import MxEventObject from './MxEventObject'
import MxEvent from './MxEvent'

export default class MxAnimation {
  constructor(delay) {
    this.delay = delay !== null ? delay : 20
  }
}

/**
 * Extends MxEventSource.
 */
MxAnimation.prototype = new MxEventSource()
MxAnimation.prototype.constructor = MxAnimation

/**
 * Variable: delay
 *
 * Specifies the delay between the animation steps. Defaul is 30ms.
 */
MxAnimation.prototype.delay = null

/**
 * Variable: thread
 *
 * Reference to the thread while the animation is running.
 */
MxAnimation.prototype.thread = null

/**
 * Function: isRunning
 *
 * Returns true if the animation is running.
 */
MxAnimation.prototype.isRunning = function() {
  return this.thread !== null
}

/**
 * Function: startAnimation
 *
 * Starts the animation by repeatedly invoking updateAnimation.
 */
MxAnimation.prototype.startAnimation = function() {
  if (this.thread === null) {
    this.thread = window.setInterval(
      MxUtils.bind(this, this.updateAnimation),
      this.delay
    )
  }
}

/**
 * Function: updateAnimation
 *
 * Hook for subclassers to implement the animation. Invoke stopAnimation
 * when finished, startAnimation to resume. This is called whenever the
 * timer fires and fires an MxEvent.EXECUTE event with no properties.
 */
MxAnimation.prototype.updateAnimation = function() {
  this.fireEvent(new MxEventObject(MxEvent.EXECUTE))
}

/**
 * Function: stopAnimation
 *
 * Stops the animation by deleting the timer and fires an <MxEvent.DONE>.
 */
MxAnimation.prototype.stopAnimation = function() {
  if (this.thread !== null) {
    window.clearInterval(this.thread)
    this.thread = null
    this.fireEvent(new MxEventObject(MxEvent.DONE))
  }
}
