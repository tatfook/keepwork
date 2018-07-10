/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxGuide
 *
 * Implements the alignment of selection cells to other cells in the graph.
 *
 * Constructor: MxGuide
 *
 * Constructs a new guide object.
 */
import MxPolyline from '@/lib/board/mxGraph/shape/MxPolyline.js'
import MxConstants from './MxConstants.js'
import MxPoint from './MxPoint.js'

export default class MxGuide {
  constructor(graph, states) {
    this.graph = graph
    this.setStates(states)
  }
}

/**
 * Variable: graph
 *
 * Reference to the enclosing <mxGraph> instance.
 */
MxGuide.prototype.graph = null

/**
 * Variable: states
 *
 * Contains the <mxCellStates> that are used for alignment.
 */
MxGuide.prototype.states = null

/**
 * Variable: horizontal
 *
 * Specifies if horizontal guides are enabled. Default is true.
 */
MxGuide.prototype.horizontal = true

/**
 * Variable: vertical
 *
 * Specifies if vertical guides are enabled. Default is true.
 */
MxGuide.prototype.vertical = true

/**
 * Variable: vertical
 *
 * Holds the <mxShape> for the horizontal guide.
 */
MxGuide.prototype.guideX = null

/**
 * Variable: vertical
 *
 * Holds the <mxShape> for the vertical guide.
 */
MxGuide.prototype.guideY = null

/**
 * Function: setStates
 *
 * Sets the <mxCellStates> that should be used for alignment.
 */
MxGuide.prototype.setStates = function(states) {
  this.states = states
}

/**
 * Function: isEnabledForEvent
 *
 * Returns true if the guide should be enabled for the given native event. This
 * implementation always returns true.
 */
MxGuide.prototype.isEnabledForEvent = function(evt) {
  return true
}

/**
 * Function: getGuideTolerance
 *
 * Returns the tolerance for the guides. Default value is gridSize / 2.
 */
MxGuide.prototype.getGuideTolerance = function() {
  return this.graph.gridSize / 2
}

/**
 * Function: createGuideShape
 *
 * Returns the mxShape to be used for painting the respective guide. This
 * implementation returns a new, dashed and crisp <MxPolyline> using
 * <MxConstants.GUIDE_COLOR> and <MxConstants.GUIDE_STROKEWIDTH> as the format.
 *
 * Parameters:
 *
 * horizontal - Boolean that specifies which guide should be created.
 */
MxGuide.prototype.createGuideShape = function(horizontal) {
  let guide = new MxPolyline(
    [],
    MxConstants.GUIDE_COLOR,
    MxConstants.GUIDE_STROKEWIDTH
  )
  guide.isDashed = true

  return guide
}

/**
 * Function: move
 *
 * Moves the <bounds> by the given <MxPoint> and returnt the snapped point.
 */
MxGuide.prototype.move = function(bounds, delta, gridEnabled) {
  if (
    this.states !== null &&
    (this.horizontal || this.vertical) &&
    bounds !== null &&
    delta !== null
  ) {
    let trx = this.graph.getView().translate
    let scale = this.graph.getView().scale
    let dx = delta.x
    let dy = delta.y

    let overrideX = false
    let stateX = null
    let valueX = null
    let overrideY = false
    let stateY = null
    let valueY = null

    let tt = this.getGuideTolerance()
    let ttX = tt
    let ttY = tt

    let b = bounds.clone()
    b.x += delta.x
    b.y += delta.y

    let left = b.x
    let right = b.x + b.width
    let center = b.getCenterX()
    let top = b.y
    let bottom = b.y + b.height
    let middle = b.getCenterY()

    // Snaps the left, center and right to the given x-coordinate
    let snapX = function(x, state) {
      x += this.graph.panDx
      let override = false

      if (Math.abs(x - center) < ttX) {
        dx = x - bounds.getCenterX()
        ttX = Math.abs(x - center)
        override = true
      } else if (Math.abs(x - left) < ttX) {
        dx = x - bounds.x
        ttX = Math.abs(x - left)
        override = true
      } else if (Math.abs(x - right) < ttX) {
        dx = x - bounds.x - bounds.width
        ttX = Math.abs(x - right)
        override = true
      }

      if (override) {
        stateX = state
        valueX = Math.round(x - this.graph.panDx)

        if (this.guideX === null) {
          this.guideX = this.createGuideShape(true)

          // Makes sure to use either VML or SVG shapes in order to implement
          // event-transparency on the background area of the rectangle since
          // HTML shapes do not let mouseevents through even when transparent
          this.guideX.dialect =
            this.graph.dialect !== MxConstants.DIALECT_SVG
              ? MxConstants.DIALECT_VML
              : MxConstants.DIALECT_SVG
          this.guideX.pointerEvents = false
          this.guideX.init(this.graph.getView().getOverlayPane())
        }
      }

      overrideX = overrideX || override
    }

    // Snaps the top, middle or bottom to the given y-coordinate
    let snapY = function(y, state) {
      y += this.graph.panDy
      let override = false

      if (Math.abs(y - middle) < ttY) {
        dy = y - bounds.getCenterY()
        ttY = Math.abs(y - middle)
        override = true
      } else if (Math.abs(y - top) < ttY) {
        dy = y - bounds.y
        ttY = Math.abs(y - top)
        override = true
      } else if (Math.abs(y - bottom) < ttY) {
        dy = y - bounds.y - bounds.height
        ttY = Math.abs(y - bottom)
        override = true
      }

      if (override) {
        stateY = state
        valueY = Math.round(y - this.graph.panDy)

        if (this.guideY === null) {
          this.guideY = this.createGuideShape(false)

          // Makes sure to use either VML or SVG shapes in order to implement
          // event-transparency on the background area of the rectangle since
          // HTML shapes do not let mouseevents through even when transparent
          this.guideY.dialect =
            this.graph.dialect !== MxConstants.DIALECT_SVG
              ? MxConstants.DIALECT_VML
              : MxConstants.DIALECT_SVG
          this.guideY.pointerEvents = false
          this.guideY.init(this.graph.getView().getOverlayPane())
        }
      }

      overrideY = overrideY || override
    }

    for (let i = 0; i < this.states.length; i++) {
      let state = this.states[i]

      if (state !== null) {
        // Align x
        if (this.horizontal) {
          snapX.call(this, state.getCenterX(), state)
          snapX.call(this, state.x, state)
          snapX.call(this, state.x + state.width, state)
        }

        // Align y
        if (this.vertical) {
          snapY.call(this, state.getCenterY(), state)
          snapY.call(this, state.y, state)
          snapY.call(this, state.y + state.height, state)
        }
      }
    }

    // Moves cells that are off-grid back to the grid on move
    if (gridEnabled) {
      if (!overrideX) {
        let tx =
          bounds.x - (this.graph.snap(bounds.x / scale - trx.x) + trx.x) * scale
        dx = this.graph.snap(dx / scale) * scale - tx
      }

      if (!overrideY) {
        let ty =
          bounds.y - (this.graph.snap(bounds.y / scale - trx.y) + trx.y) * scale
        dy = this.graph.snap(dy / scale) * scale - ty
      }
    }

    // Redraws the guides
    let c = this.graph.container

    if (!overrideX && this.guideX !== null) {
      this.guideX.node.style.visibility = 'hidden'
    } else if (this.guideX !== null) {
      let minY, maxY

      if (stateX !== null && bounds !== null) {
        minY = Math.min(bounds.y + dy - this.graph.panDy, stateX.y)
        maxY = Math.max(
          bounds.y + bounds.height + dy - this.graph.panDy,
          stateX.y + stateX.height
        )
      }

      if (minY !== null && maxY !== null) {
        this.guideX.points = [
          new MxPoint(valueX, minY),
          new MxPoint(valueX, maxY)
        ]
      } else {
        this.guideX.points = [
          new MxPoint(valueX, -this.graph.panDy),
          new MxPoint(valueX, c.scrollHeight - 3 - this.graph.panDy)
        ]
      }

      this.guideX.stroke = this.getGuideColor(stateX, true)
      this.guideX.node.style.visibility = 'visible'
      this.guideX.redraw()
    }

    if (!overrideY && this.guideY !== null) {
      this.guideY.node.style.visibility = 'hidden'
    } else if (this.guideY !== null) {
      let maxX, minX

      if (stateY !== null && bounds !== null) {
        minX = Math.min(bounds.x + dx - this.graph.panDx, stateY.x)
        maxX = Math.max(
          bounds.x + bounds.width + dx - this.graph.panDx,
          stateY.x + stateY.width
        )
      }

      if (minX !== null && maxX !== null) {
        this.guideY.points = [
          new MxPoint(minX, valueY),
          new MxPoint(maxX, valueY)
        ]
      } else {
        this.guideY.points = [
          new MxPoint(-this.graph.panDx, valueY),
          new MxPoint(c.scrollWidth - 3 - this.graph.panDx, valueY)
        ]
      }

      this.guideY.stroke = this.getGuideColor(stateY, false)
      this.guideY.node.style.visibility = 'visible'
      this.guideY.redraw()
    }

    delta = new MxPoint(dx, dy)
  }

  return delta
}

/**
 * Function: hide
 *
 * Hides all current guides.
 */
MxGuide.prototype.getGuideColor = function(state, horizontal) {
  return MxConstants.GUIDE_COLOR
}

/**
 * Function: hide
 *
 * Hides all current guides.
 */
MxGuide.prototype.hide = function() {
  this.setVisible(false)
}

/**
 * Function: setVisible
 *
 * Shows or hides the current guides.
 */
MxGuide.prototype.setVisible = function(visible) {
  if (this.guideX !== null) {
    this.guideX.node.style.visibility = visible ? 'visible' : 'hidden'
  }

  if (this.guideY !== null) {
    this.guideY.node.style.visibility = visible ? 'visible' : 'hidden'
  }
}

/**
 * Function: destroy
 *
 * Destroys all resources that this object uses.
 */
MxGuide.prototype.destroy = function() {
  if (this.guideX !== null) {
    this.guideX.destroy()
    this.guideX = null
  }

  if (this.guideY !== null) {
    this.guideY.destroy()
    this.guideY = null
  }
}
