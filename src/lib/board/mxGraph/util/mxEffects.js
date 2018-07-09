/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */

import MxUtils from './MxUtils.js'

let MxEffects = {
  /**
   * Class: MxEffects
   *
   * Provides animation effects.
   */

  /**
   * Function: animateChanges
   *
   * Asynchronous animated move operation. See also: <mxMorphing>.
   *
   * Example:
   *
   * (code)
   * graph.model.addListener(mxEvent.CHANGE, function(sender, evt)
   * {
   *   let changes = evt.getProperty('edit').changes;
   *
   *   if (changes.length < 10)
   *   {
   *     MxEffects.animateChanges(graph, changes);
   *   }
   * });
   * (end)
   *
   * Parameters:
   *
   * graph - <mxGraph> that received the changes.
   * changes - Array of changes to be animated.
   * done - Optional function argument that is invoked after the
   * last step of the animation.
   */
  animateChanges: function(graph, changes, done) {
    let maxStep = 10
    let step = 0

    let animate = function() {
      let isRequired = false

      for (let i = 0; i < changes.length; i++) {
        let change = changes[i]

        if (
          change instanceof mxGeometryChange || // not found
          change instanceof mxTerminalChange || // 下面4个都找到2个一样的
          change instanceof mxValueChange ||
          change instanceof mxChildChange ||
          change instanceof mxStyleChange
        ) {
          let state = graph
            .getView()
            .getState(change.cell || change.child, false)

          if (state !== null) {
            isRequired = true

            if (
              change.constructor !== mxGeometryChange ||
              graph.model.isEdge(change.cell)
            ) {
              MxUtils.setOpacity(state.shape.node, (100 * step) / maxStep)
            } else {
              let scale = graph.getView().scale

              let dx = (change.geometry.x - change.previous.x) * scale
              let dy = (change.geometry.y - change.previous.y) * scale

              let sx = (change.geometry.width - change.previous.width) * scale
              let sy = (change.geometry.height - change.previous.height) * scale

              if (step === 0) {
                state.x -= dx
                state.y -= dy
                state.width -= sx
                state.height -= sy
              } else {
                state.x += dx / maxStep
                state.y += dy / maxStep
                state.width += sx / maxStep
                state.height += sy / maxStep
              }

              graph.cellRenderer.redraw(state)

              // Fades all connected edges and children
              MxEffects.cascadeOpacity(
                graph,
                change.cell,
                (100 * step) / maxStep
              )
            }
          }
        }
      }

      if (step < maxStep && isRequired) {
        step++
        window.setTimeout(animate, delay)
      } else if (done !== null) {
        done()
      }
    }

    let delay = 30
    animate()
  },

  /**
   * Function: cascadeOpacity
   *
   * Sets the opacity on the given cell and its descendants.
   *
   * Parameters:
   *
   * graph - <mxGraph> that contains the cells.
   * cell - <mxCell> to set the opacity for.
   * opacity - New value for the opacity in %.
   */
  cascadeOpacity: function(graph, cell, opacity) {
    // Fades all children
    let childCount = graph.model.getChildCount(cell)

    for (let i = 0; i < childCount; i++) {
      let child = graph.model.getChildAt(cell, i)
      let childState = graph.getView().getState(child)

      if (childState !== null) {
        MxUtils.setOpacity(childState.shape.node, opacity)
        MxEffects.cascadeOpacity(graph, child, opacity)
      }
    }

    // Fades all connected edges
    let edges = graph.model.getEdges(cell)

    if (edges !== null) {
      for (let i = 0; i < edges.length; i++) {
        let edgeState = graph.getView().getState(edges[i])

        if (edgeState !== null) {
          MxUtils.setOpacity(edgeState.shape.node, opacity)
        }
      }
    }
  },

  /**
   * Function: fadeOut
   *
   * Asynchronous fade-out operation.
   */
  fadeOut: function(node, from, remove, step, delay, isEnabled) {
    step = step || 40
    delay = delay || 30

    let opacity = from || 100

    MxUtils.setOpacity(node, opacity)

    if (isEnabled || isEnabled === null) {
      let f = function() {
        opacity = Math.max(opacity - step, 0)
        MxUtils.setOpacity(node, opacity)

        if (opacity > 0) {
          window.setTimeout(f, delay)
        } else {
          node.style.visibility = 'hidden'

          if (remove && node.parentNode) {
            node.parentNode.removeChild(node)
          }
        }
      }
      window.setTimeout(f, delay)
    } else {
      node.style.visibility = 'hidden'

      if (remove && node.parentNode) {
        node.parentNode.removeChild(node)
      }
    }
  }
}

export default MxEffects
