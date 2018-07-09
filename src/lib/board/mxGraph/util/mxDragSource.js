/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxDragSource
 *
 * Wrapper to create a drag source from a DOM element so that the element can
 * be dragged over a graph and dropped into the graph as a new cell.
 *
 * Problem is that in the dropHandler the current preview location is not
 * available, so the preview and the dropHandler must match.
 *
 * Constructor: MxDragSource
 *
 * Constructs a new drag source for the given element.
 */

import MxEvent from './MxEvent.js'
import MxUtils from './MxUtils.js'
import MxClient from '@/lib/board/mxGraph/MxClient.js'
import MxGuide from './MxGuide.js'
import MxCellHighlight from '@/lib/board/mxGraph/handler/MxCellHighlight.js'
import MxConstants from './MxConstants.js'
import MxRectangle from './MxRectangle.js'
import MxPoint from './MxPoint.js'

export default class MxDragSource {
  constructor(element, dropHandler) {
    this.element = element
    this.dropHandler = dropHandler

    // Handles a drag gesture on the element
    MxEvent.addGestureListeners(
      element,
      MxUtils.bind(this, function(evt) {
        this.mouseDown(evt)
      })
    )

    // Prevents native drag and drop
    MxEvent.addListener(element, 'dragstart', function(evt) {
      MxEvent.consume(evt)
    })

    this.eventConsumer = function(sender, evt) {
      let evtName = evt.getProperty('eventName')
      let me = evt.getProperty('event')

      if (evtName !== MxEvent.MOUSE_DOWN) {
        me.consume()
      }
    }
  }
}

/**
 * Variable: element
 *
 * Reference to the DOM node which was made draggable.
 */
MxDragSource.prototype.element = null

/**
 * Variable: dropHandler
 *
 * Holds the DOM node that is used to represent the drag preview. If this is
 * null then the source element will be cloned and used for the drag preview.
 */
MxDragSource.prototype.dropHandler = null

/**
 * Variable: dragOffset
 *
 * <MxPoint> that specifies the offset of the <dragElement>. Default is null.
 */
MxDragSource.prototype.dragOffset = null

/**
 * Variable: dragElement
 *
 * Holds the DOM node that is used to represent the drag preview. If this is
 * null then the source element will be cloned and used for the drag preview.
 */
MxDragSource.prototype.dragElement = null

/**
 * Variable: previewElement
 *
 * Optional <MxRectangle> that specifies the unscaled size of the preview.
 */
MxDragSource.prototype.previewElement = null

/**
 * Variable: enabled
 *
 * Specifies if this drag source is enabled. Default is true.
 */
MxDragSource.prototype.enabled = true

/**
 * Variable: currentGraph
 *
 * Reference to the <mxGraph> that is the current drop target.
 */
MxDragSource.prototype.currentGraph = null

/**
 * Variable: currentDropTarget
 *
 * Holds the current drop target under the mouse.
 */
MxDragSource.prototype.currentDropTarget = null

/**
 * Variable: currentPoint
 *
 * Holds the current drop location.
 */
MxDragSource.prototype.currentPoint = null

/**
 * Variable: currentGuide
 *
 * Holds an <MxGuide> for the <currentGraph> if <dragPreview> is not null.
 */
MxDragSource.prototype.currentGuide = null

/**
 * Variable: currentGuide
 *
 * Holds an <MxGuide> for the <currentGraph> if <dragPreview> is not null.
 */
MxDragSource.prototype.currentHighlight = null

/**
 * Variable: autoscroll
 *
 * Specifies if the graph should scroll automatically. Default is true.
 */
MxDragSource.prototype.autoscroll = true

/**
 * Variable: guidesEnabled
 *
 * Specifies if <MxGuide> should be enabled. Default is true.
 */
MxDragSource.prototype.guidesEnabled = true

/**
 * Variable: gridEnabled
 *
 * Specifies if the grid should be allowed. Default is true.
 */
MxDragSource.prototype.gridEnabled = true

/**
 * Variable: highlightDropTargets
 *
 * Specifies if drop targets should be highlighted. Default is true.
 */
MxDragSource.prototype.highlightDropTargets = true

/**
 * Variable: dragElementZIndex
 *
 * ZIndex for the drag element. Default is 100.
 */
MxDragSource.prototype.dragElementZIndex = 100

/**
 * Variable: dragElementOpacity
 *
 * Opacity of the drag element in %. Default is 70.
 */
MxDragSource.prototype.dragElementOpacity = 70

/**
 * Function: isEnabled
 *
 * Returns <enabled>.
 */
MxDragSource.prototype.isEnabled = function() {
  return this.enabled
}

/**
 * Function: setEnabled
 *
 * Sets <enabled>.
 */
MxDragSource.prototype.setEnabled = function(value) {
  this.enabled = value
}

/**
 * Function: isGuidesEnabled
 *
 * Returns <guidesEnabled>.
 */
MxDragSource.prototype.isGuidesEnabled = function() {
  return this.guidesEnabled
}

/**
 * Function: setGuidesEnabled
 *
 * Sets <guidesEnabled>.
 */
MxDragSource.prototype.setGuidesEnabled = function(value) {
  this.guidesEnabled = value
}

/**
 * Function: isGridEnabled
 *
 * Returns <gridEnabled>.
 */
MxDragSource.prototype.isGridEnabled = function() {
  return this.gridEnabled
}

/**
 * Function: setGridEnabled
 *
 * Sets <gridEnabled>.
 */
MxDragSource.prototype.setGridEnabled = function(value) {
  this.gridEnabled = value
}

/**
 * Function: getGraphForEvent
 *
 * Returns the graph for the given mouse event. This implementation returns
 * null.
 */
MxDragSource.prototype.getGraphForEvent = function(evt) {
  return null
}

/**
 * Function: getDropTarget
 *
 * Returns the drop target for the given graph and coordinates. This
 * implementation uses <mxGraph.getCellAt>.
 */
MxDragSource.prototype.getDropTarget = function(graph, x, y, evt) {
  return graph.getCellAt(x, y)
}

/**
 * Function: createDragElement
 *
 * Creates and returns a clone of the <dragElementPrototype> or the <element>
 * if the former is not defined.
 */
MxDragSource.prototype.createDragElement = function(evt) {
  return this.element.cloneNode(true)
}

/**
 * Function: createPreviewElement
 *
 * Creates and returns an element which can be used as a preview in the given
 * graph.
 */
MxDragSource.prototype.createPreviewElement = function(graph) {
  return null
}

/**
 * Function: isActive
 *
 * Returns true if this drag source is active.
 */
MxDragSource.prototype.isActive = function() {
  return this.mouseMoveHandler !== null
}

/**
 * Function: reset
 *
 * Stops and removes everything and restores the state of the object.
 */
MxDragSource.prototype.reset = function() {
  if (this.currentGraph !== null) {
    this.dragExit(this.currentGraph)
    this.currentGraph = null
  }

  this.removeDragElement()
  this.removeListeners()
  this.stopDrag()
}

/**
 * Function: mouseDown
 *
 * Returns the drop target for the given graph and coordinates. This
 * implementation uses <mxGraph.getCellAt>.
 *
 * To ignore popup menu events for a drag source, this function can be
 * overridden as follows.
 *
 * (code)
 * let mouseDown = dragSource.mouseDown;
 *
 * dragSource.mouseDown = function(evt)
 * {
 *   if (!MxEvent.isPopupTrigger(evt))
 *   {
 *     mouseDown.apply(this, arguments);
 *   }
 * };
 * (end)
 */
MxDragSource.prototype.mouseDown = function(evt) {
  if (
    this.enabled &&
    !MxEvent.isConsumed(evt) &&
    this.mouseMoveHandler === null
  ) {
    this.startDrag(evt)
    this.mouseMoveHandler = MxUtils.bind(this, this.mouseMove)
    this.mouseUpHandler = MxUtils.bind(this, this.mouseUp)
    MxEvent.addGestureListeners(
      document,
      null,
      this.mouseMoveHandler,
      this.mouseUpHandler
    )

    if (MxClient.IS_TOUCH && !MxEvent.isMouseEvent(evt)) {
      this.eventSource = MxEvent.getSource(evt)
      MxEvent.addGestureListeners(
        this.eventSource,
        null,
        this.mouseMoveHandler,
        this.mouseUpHandler
      )
    }
  }
}

/**
 * Function: startDrag
 *
 * Creates the <dragElement> using <createDragElement>.
 */
MxDragSource.prototype.startDrag = function(evt) {
  this.dragElement = this.createDragElement(evt)
  this.dragElement.style.position = 'absolute'
  this.dragElement.style.zIndex = this.dragElementZIndex
  MxUtils.setOpacity(this.dragElement, this.dragElementOpacity)
}

/**
 * Function: stopDrag
 *
 * Invokes <removeDragElement>.
 */
MxDragSource.prototype.stopDrag = function() {
  // LATER: This used to have a mouse event. If that is still needed we need to add another
  // final call to the DnD protocol to add a cleanup step in the case of escape press, which
  // is not associated with a mouse event and which currently calles this method.
  this.removeDragElement()
}

/**
 * Function: removeDragElement
 *
 * Removes and destroys the <dragElement>.
 */
MxDragSource.prototype.removeDragElement = function() {
  if (this.dragElement !== null) {
    if (this.dragElement.parentNode !== null) {
      this.dragElement.parentNode.removeChild(this.dragElement)
    }

    this.dragElement = null
  }
}

/**
 * Function: graphContainsEvent
 *
 * Returns true if the given graph contains the given event.
 */
MxDragSource.prototype.graphContainsEvent = function(graph, evt) {
  let x = MxEvent.getClientX(evt)
  let y = MxEvent.getClientY(evt)
  let offset = MxUtils.getOffset(graph.container)
  let origin = MxUtils.getScrollOrigin()

  // Checks if event is inside the bounds of the graph container
  return (
    x >= offset.x - origin.x &&
    y >= offset.y - origin.y &&
    x <= offset.x - origin.x + graph.container.offsetWidth &&
    y <= offset.y - origin.y + graph.container.offsetHeight
  )
}

/**
 * Function: mouseMove
 *
 * Gets the graph for the given event using <getGraphForEvent>, updates the
 * <currentGraph>, calling <dragEnter> and <dragExit> on the new and old graph,
 * respectively, and invokes <dragOver> if <currentGraph> is not null.
 */
MxDragSource.prototype.mouseMove = function(evt) {
  let graph = this.getGraphForEvent(evt)

  // Checks if event is inside the bounds of the graph container
  if (graph !== null && !this.graphContainsEvent(graph, evt)) {
    graph = null
  }

  if (graph !== this.currentGraph) {
    if (this.currentGraph !== null) {
      this.dragExit(this.currentGraph, evt)
    }

    this.currentGraph = graph

    if (this.currentGraph !== null) {
      this.dragEnter(this.currentGraph, evt)
    }
  }

  if (this.currentGraph !== null) {
    this.dragOver(this.currentGraph, evt)
  }

  if (
    this.dragElement !== null &&
    (this.previewElement === null ||
      this.previewElement.style.visibility !== 'visible')
  ) {
    let x = MxEvent.getClientX(evt)
    let y = MxEvent.getClientY(evt)

    if (this.dragElement.parentNode === null) {
      document.body.appendChild(this.dragElement)
    }

    this.dragElement.style.visibility = 'visible'

    if (this.dragOffset !== null) {
      x += this.dragOffset.x
      y += this.dragOffset.y
    }

    let offset = MxUtils.getDocumentScrollOrigin(document)

    this.dragElement.style.left = x + offset.x + 'px'
    this.dragElement.style.top = y + offset.y + 'px'
  } else if (this.dragElement !== null) {
    this.dragElement.style.visibility = 'hidden'
  }

  MxEvent.consume(evt)
}

/**
 * Function: mouseUp
 *
 * Processes the mouse up event and invokes <drop>, <dragExit> and <stopDrag>
 * as required.
 */
MxDragSource.prototype.mouseUp = function(evt) {
  if (this.currentGraph !== null) {
    if (
      this.currentPoint !== null &&
      (this.previewElement === null ||
        this.previewElement.style.visibility !== 'hidden')
    ) {
      let scale = this.currentGraph.view.scale
      let tr = this.currentGraph.view.translate
      let x = this.currentPoint.x / scale - tr.x
      let y = this.currentPoint.y / scale - tr.y

      this.drop(this.currentGraph, evt, this.currentDropTarget, x, y)
    }

    this.dragExit(this.currentGraph)
    this.currentGraph = null
  }

  this.stopDrag()
  this.removeListeners()

  MxEvent.consume(evt)
}

/**
 * Function: removeListeners
 *
 * Actives the given graph as a drop target.
 */
MxDragSource.prototype.removeListeners = function() {
  if (this.eventSource !== null) {
    MxEvent.removeGestureListeners(
      this.eventSource,
      null,
      this.mouseMoveHandler,
      this.mouseUpHandler
    )
    this.eventSource = null
  }

  MxEvent.removeGestureListeners(
    document,
    null,
    this.mouseMoveHandler,
    this.mouseUpHandler
  )
  this.mouseMoveHandler = null
  this.mouseUpHandler = null
}

/**
 * Function: dragEnter
 *
 * Actives the given graph as a drop target.
 */
MxDragSource.prototype.dragEnter = function(graph, evt) {
  graph.isMouseDown = true
  graph.isMouseTrigger = MxEvent.isMouseEvent(evt)
  this.previewElement = this.createPreviewElement(graph)

  // Guide is only needed if preview element is used
  if (this.isGuidesEnabled() && this.previewElement !== null) {
    this.currentGuide = new MxGuide(graph, graph.graphHandler.getGuideStates())
  }

  if (this.highlightDropTargets) {
    this.currentHighlight = new MxCellHighlight(
      graph,
      MxConstants.DROP_TARGET_COLOR
    )
  }

  // Consumes all events in the current graph before they are fired
  graph.addListener(MxEvent.FIRE_MOUSE_EVENT, this.eventConsumer)
}

/**
 * Function: dragExit
 *
 * Deactivates the given graph as a drop target.
 */
MxDragSource.prototype.dragExit = function(graph, evt) {
  this.currentDropTarget = null
  this.currentPoint = null
  graph.isMouseDown = false

  // Consumes all events in the current graph before they are fired
  graph.removeListener(this.eventConsumer)

  if (this.previewElement !== null) {
    if (this.previewElement.parentNode !== null) {
      this.previewElement.parentNode.removeChild(this.previewElement)
    }

    this.previewElement = null
  }

  if (this.currentGuide !== null) {
    this.currentGuide.destroy()
    this.currentGuide = null
  }

  if (this.currentHighlight !== null) {
    this.currentHighlight.destroy()
    this.currentHighlight = null
  }
}

/**
 * Function: dragOver
 *
 * Implements autoscroll, updates the <currentPoint>, highlights any drop
 * targets and updates the preview.
 */
MxDragSource.prototype.dragOver = function(graph, evt) {
  let offset = MxUtils.getOffset(graph.container)
  let origin = MxUtils.getScrollOrigin(graph.container)
  let x = MxEvent.getClientX(evt) - offset.x + origin.x - graph.panDx
  let y = MxEvent.getClientY(evt) - offset.y + origin.y - graph.panDy

  if (graph.autoScroll && (this.autoscroll === null || this.autoscroll)) {
    graph.scrollPointToVisible(x, y, graph.autoExtend)
  }

  // Highlights the drop target under the mouse
  if (this.currentHighlight !== null && graph.isDropEnabled()) {
    this.currentDropTarget = this.getDropTarget(graph, x, y, evt)
    let state = graph.getView().getState(this.currentDropTarget)
    this.currentHighlight.highlight(state)
  }

  // Updates the location of the preview
  if (this.previewElement !== null) {
    if (this.previewElement.parentNode === null) {
      graph.container.appendChild(this.previewElement)

      this.previewElement.style.zIndex = '3'
      this.previewElement.style.position = 'absolute'
    }

    let gridEnabled = this.isGridEnabled() && graph.isGridEnabledEvent(evt)
    let hideGuide = true

    // Grid and guides
    if (
      this.currentGuide !== null &&
      this.currentGuide.isEnabledForEvent(evt)
    ) {
      // LATER: HTML preview appears smaller than SVG preview
      let w = parseInt(this.previewElement.style.width)
      let h = parseInt(this.previewElement.style.height)
      let bounds = new MxRectangle(0, 0, w, h)
      let delta = new MxPoint(x, y)
      delta = this.currentGuide.move(bounds, delta, gridEnabled)
      hideGuide = false
      x = delta.x
      y = delta.y
    } else if (gridEnabled) {
      let scale = graph.view.scale
      let tr = graph.view.translate
      let off = graph.gridSize / 2
      x = (graph.snap(x / scale - tr.x - off) + tr.x) * scale
      y = (graph.snap(y / scale - tr.y - off) + tr.y) * scale
    }

    if (this.currentGuide !== null && hideGuide) {
      this.currentGuide.hide()
    }

    if (this.previewOffset !== null) {
      x += this.previewOffset.x
      y += this.previewOffset.y
    }

    this.previewElement.style.left = Math.round(x) + 'px'
    this.previewElement.style.top = Math.round(y) + 'px'
    this.previewElement.style.visibility = 'visible'
  }

  this.currentPoint = new MxPoint(x, y)
}

/**
 * Function: drop
 *
 * Returns the drop target for the given graph and coordinates. This
 * implementation uses <mxGraph.getCellAt>.
 */
MxDragSource.prototype.drop = function(graph, evt, dropTarget, x, y) {
  this.dropHandler(graph, evt, dropTarget, x, y)

  // Had to move this to after the insert because it will
  // affect the scrollbars of the window in IE to try and
  // make the complete container visible.
  // LATER: Should be made optional.
  if (graph.container.style.visibility !== 'hidden') {
    graph.container.focus()
  }
}
