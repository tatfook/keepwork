/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxVertexHandler
 *
 * Event handler for resizing cells. This handler is automatically created in
 * <mxGraph.createHandler>.
 *
 * Constructor: MxVertexHandler
 *
 * Constructs an event handler that allows to resize vertices
 * and groups.
 *
 * Parameters:
 *
 * state - <mxCellState> of the cell to be resized.
 */
import MxUtils from '../util/MxUtils'
import MxEvent from '../util/MxEvent'
import MxRectangle from '../util/MxRectangle'
import MxConstants from '../util/MxConstants'
import MxGraphHandler from './MxGraphHandler'
import MxRectangleShape from '../shape/MxRectangleShape'
import MxImageShape from '../shape/MxImageShape'
import MxEllipse from '../shape/MxEllipse'
import MxClient from '../MxClient'
import MxPoint from '../util/MxPoint'
export default class MxVertexHandler {
  constructor(state) {
    if (state !== null) {
      this.state = state
      this.init()

      // Handles escape keystrokes
      this.escapeHandler = MxUtils.bind(this, function(sender, evt) {
        if (this.livePreview && this.index !== null) {
          // Redraws the live preview
          this.state.view.graph.cellRenderer.redraw(this.state, true)

          // Redraws connected edges
          this.state.view.invalidate(this.state.cell)
          this.state.invalid = false
          this.state.view.validate()
        }

        this.reset()
      })

      this.state.view.graph.addListener(MxEvent.ESCAPE, this.escapeHandler)
    }
  };
}

/**
 * Variable: graph
 *
 * Reference to the enclosing <mxGraph>.
 */
MxVertexHandler.prototype.graph = null

/**
 * Variable: state
 *
 * Reference to the <mxCellState> being modified.
 */
MxVertexHandler.prototype.state = null

/**
 * Variable: singleSizer
 *
 * Specifies if only one sizer handle at the bottom, right corner should be
 * used. Default is false.
 */
MxVertexHandler.prototype.singleSizer = false

/**
 * Variable: index
 *
 * Holds the index of the current handle.
 */
MxVertexHandler.prototype.index = null

/**
 * Variable: allowHandleBoundsCheck
 *
 * Specifies if the bounds of handles should be used for hit-detection in IE or
 * if <tolerance> > 0. Default is true.
 */
MxVertexHandler.prototype.allowHandleBoundsCheck = true

/**
 * Variable: handleImage
 *
 * Optional <mxImage> to be used as handles. Default is null.
 */
MxVertexHandler.prototype.handleImage = null

/**
 * Variable: tolerance
 *
 * Optional tolerance for hit-detection in <getHandleForEvent>. Default is 0.
 */
MxVertexHandler.prototype.tolerance = 0

/**
 * Variable: rotationEnabled
 *
 * Specifies if a rotation handle should be visible. Default is false.
 */
MxVertexHandler.prototype.rotationEnabled = false

/**
 * Variable: parentHighlightEnabled
 *
 * Specifies if the parent should be highlighted if a child cell is selected.
 * Default is false.
 */
MxVertexHandler.prototype.parentHighlightEnabled = false

/**
 * Variable: rotationRaster
 *
 * Specifies if rotation steps should be "rasterized" depening on the distance
 * to the handle. Default is true.
 */
MxVertexHandler.prototype.rotationRaster = true

/**
 * Variable: rotationCursor
 *
 * Specifies the cursor for the rotation handle. Default is 'crosshair'.
 */
MxVertexHandler.prototype.rotationCursor = 'crosshair'

/**
 * Variable: livePreview
 *
 * Specifies if resize should change the cell in-place. This is an experimental
 * feature for non-touch devices. Default is false.
 */
MxVertexHandler.prototype.livePreview = false

/**
 * Variable: manageSizers
 *
 * Specifies if sizers should be hidden and spaced if the vertex is small.
 * Default is false.
 */
MxVertexHandler.prototype.manageSizers = false

/**
 * Variable: constrainGroupByChildren
 *
 * Specifies if the size of groups should be constrained by the children.
 * Default is false.
 */
MxVertexHandler.prototype.constrainGroupByChildren = false

/**
 * Variable: rotationHandleVSpacing
 *
 * Vertical spacing for rotation icon. Default is -16.
 */
MxVertexHandler.prototype.rotationHandleVSpacing = -16

/**
 * Variable: horizontalOffset
 *
 * The horizontal offset for the handles. This is updated in <redrawHandles>
 * if <manageSizers> is true and the sizers are offset horizontally.
 */
MxVertexHandler.prototype.horizontalOffset = 0

/**
 * Variable: verticalOffset
 *
 * The horizontal offset for the handles. This is updated in <redrawHandles>
 * if <manageSizers> is true and the sizers are offset vertically.
 */
MxVertexHandler.prototype.verticalOffset = 0

/**
 * Function: init
 *
 * Initializes the shapes required for this vertex handler.
 */
MxVertexHandler.prototype.init = function() {
  this.graph = this.state.view.graph
  this.selectionBounds = this.getSelectionBounds(this.state)
  this.bounds = new MxRectangle(this.selectionBounds.x, this.selectionBounds.y, this.selectionBounds.width, this.selectionBounds.height)
  this.selectionBorder = this.createSelectionShape(this.bounds)
  // VML dialect required here for event transparency in IE
  this.selectionBorder.dialect = (this.graph.dialect !== MxConstants.DIALECT_SVG) ? MxConstants.DIALECT_VML : MxConstants.DIALECT_SVG
  this.selectionBorder.pointerEvents = false
  this.selectionBorder.rotation = Number(this.state.style[MxConstants.STYLE_ROTATION] || '0')
  this.selectionBorder.init(this.graph.getView().getOverlayPane())
  MxEvent.redirectMouseEvents(this.selectionBorder.node, this.graph, this.state)

  if (this.graph.isCellMovable(this.state.cell)) {
    this.selectionBorder.setCursor(MxConstants.CURSOR_MOVABLE_VERTEX)
  }

  // Adds the sizer handles
  if (MxGraphHandler.prototype.maxCells <= 0 || this.graph.getSelectionCount() < MxGraphHandler.prototype.maxCells) {
    let resizable = this.graph.isCellResizable(this.state.cell)
    this.sizers = []

    if (resizable || (this.graph.isLabelMovable(this.state.cell) && this.state.width >= 2 && this.state.height >= 2)) {
      let i = 0

      if (resizable) {
        if (!this.singleSizer) {
          this.sizers.push(this.createSizer('nw-resize', i++))
          this.sizers.push(this.createSizer('n-resize', i++))
          this.sizers.push(this.createSizer('ne-resize', i++))
          this.sizers.push(this.createSizer('w-resize', i++))
          this.sizers.push(this.createSizer('e-resize', i++))
          this.sizers.push(this.createSizer('sw-resize', i++))
          this.sizers.push(this.createSizer('s-resize', i++))
        }

        this.sizers.push(this.createSizer('se-resize', i++))
      }

      let geo = this.graph.model.getGeometry(this.state.cell)

      if (geo !== null && !geo.relative && !this.graph.isSwimlane(this.state.cell) && this.graph.isLabelMovable(this.state.cell)) {
        // Marks this as the label handle for getHandleForEvent
        this.labelShape = this.createSizer(MxConstants.CURSOR_LABEL_HANDLE, MxEvent.LABEL_HANDLE, MxConstants.LABEL_HANDLE_SIZE, MxConstants.LABEL_HANDLE_FILLCOLOR)
        this.sizers.push(this.labelShape)
      }
    } else if (this.graph.isCellMovable(this.state.cell) && !this.graph.isCellResizable(this.state.cell) && this.state.width < 2 && this.state.height < 2) {
      this.labelShape = this.createSizer(MxConstants.CURSOR_MOVABLE_VERTEX,
        MxEvent.LABEL_HANDLE, null, MxConstants.LABEL_HANDLE_FILLCOLOR)
      this.sizers.push(this.labelShape)
    }
  }

  // Adds the rotation handler
  if (this.isRotationHandleVisible()) {
    this.rotationShape = this.createSizer(this.rotationCursor, MxEvent.ROTATION_HANDLE, MxConstants.HANDLE_SIZE + 3, MxConstants.HANDLE_FILLCOLOR)
    this.sizers.push(this.rotationShape)
  }

  this.customHandles = this.createCustomHandles()
  this.redraw()

  if (this.constrainGroupByChildren) {
    this.updateMinBounds()
  }
}

/**
 * Function: isRotationHandleVisible
 *
 * Returns true if the rotation handle should be showing.
 */
MxVertexHandler.prototype.isRotationHandleVisible = function() {
  return this.graph.isEnabled() && this.rotationEnabled && this.graph.isCellRotatable(this.state.cell) && (MxGraphHandler.prototype.maxCells <= 0 || this.graph.getSelectionCount() < MxGraphHandler.prototype.maxCells) && this.state.width >= 2 && this.state.height >= 2
}

/**
 * Function: isConstrainedEvent
 *
 * Returns true if the aspect ratio if the cell should be maintained.
 */
MxVertexHandler.prototype.isConstrainedEvent = function(me) {
  return MxEvent.isShiftDown(me.getEvent()) || this.state.style[MxConstants.STYLE_ASPECT] === 'fixed'
}

/**
 * Function: isCenteredEvent
 *
 * Returns true if the center of the vertex should be maintained during the resize.
 */
MxVertexHandler.prototype.isCenteredEvent = function(state, me) {
  return false
}

/**
 * Function: createCustomHandles
 *
 * Returns an array of custom handles. This implementation returns null.
 */
MxVertexHandler.prototype.createCustomHandles = function() {
  return null
}

/**
 * Function: updateMinBounds
 *
 * Initializes the shapes required for this vertex handler.
 */
MxVertexHandler.prototype.updateMinBounds = function() {
  let children = this.graph.getChildCells(this.state.cell)

  if (children.length > 0) {
    this.minBounds = this.graph.view.getBounds(children)

    if (this.minBounds !== null) {
      let s = this.state.view.scale
      let t = this.state.view.translate

      this.minBounds.x -= this.state.x
      this.minBounds.y -= this.state.y
      this.minBounds.x /= s
      this.minBounds.y /= s
      this.minBounds.width /= s
      this.minBounds.height /= s
      this.x0 = this.state.x / s - t.x
      this.y0 = this.state.y / s - t.y
    }
  }
}

/**
 * Function: getSelectionBounds
 *
 * Returns the MxRectangle that defines the bounds of the selection
 * border.
 */
MxVertexHandler.prototype.getSelectionBounds = function(state) {
  return new MxRectangle(Math.round(state.x), Math.round(state.y), Math.round(state.width), Math.round(state.height))
}

/**
 * Function: createParentHighlightShape
 *
 * Creates the shape used to draw the selection border.
 */
MxVertexHandler.prototype.createParentHighlightShape = function(bounds) {
  return this.createSelectionShape(bounds)
}

/**
 * Function: createSelectionShape
 *
 * Creates the shape used to draw the selection border.
 */
MxVertexHandler.prototype.createSelectionShape = function(bounds) {
  let shape = new MxRectangleShape(bounds, null, this.getSelectionColor())
  shape.strokewidth = this.getSelectionStrokeWidth()
  shape.isDashed = this.isSelectionDashed()

  return shape
}

/**
 * Function: getSelectionColor
 *
 * Returns <MxConstants.VERTEX_SELECTION_COLOR>.
 */
MxVertexHandler.prototype.getSelectionColor = function() {
  return MxConstants.VERTEX_SELECTION_COLOR
}

/**
 * Function: getSelectionStrokeWidth
 *
 * Returns <MxConstants.VERTEX_SELECTION_STROKEWIDTH>.
 */
MxVertexHandler.prototype.getSelectionStrokeWidth = function() {
  return MxConstants.VERTEX_SELECTION_STROKEWIDTH
}

/**
 * Function: isSelectionDashed
 *
 * Returns <MxConstants.VERTEX_SELECTION_DASHED>.
 */
MxVertexHandler.prototype.isSelectionDashed = function() {
  return MxConstants.VERTEX_SELECTION_DASHED
}

/**
 * Function: createSizer
 *
 * Creates a sizer handle for the specified cursor and index and returns
 * the new <MxRectangleShape> that represents the handle.
 */
MxVertexHandler.prototype.createSizer = function(cursor, index, size, fillColor) {
  size = size || MxConstants.HANDLE_SIZE

  let bounds = new MxRectangle(0, 0, size, size)
  let sizer = this.createSizerShape(bounds, index, fillColor)

  if (sizer.isHtmlAllowed() && this.state.text !== null && this.state.text.node.parentNode === this.graph.container) {
    sizer.bounds.height -= 1
    sizer.bounds.width -= 1
    sizer.dialect = MxConstants.DIALECT_STRICTHTML
    sizer.init(this.graph.container)
  } else {
    sizer.dialect = (this.graph.dialect !== MxConstants.DIALECT_SVG)
      ? MxConstants.DIALECT_MIXEDHTML : MxConstants.DIALECT_SVG
    sizer.init(this.graph.getView().getOverlayPane())
  }

  MxEvent.redirectMouseEvents(sizer.node, this.graph, this.state)

  if (this.graph.isEnabled()) {
    sizer.setCursor(cursor)
  }

  if (!this.isSizerVisible(index)) {
    sizer.visible = false
  }

  return sizer
}

/**
 * Function: isSizerVisible
 *
 * Returns true if the sizer for the given index is visible.
 * This returns true for all given indices.
 */
MxVertexHandler.prototype.isSizerVisible = function(index) {
  return true
}

/**
 * Function: createSizerShape
 *
 * Creates the shape used for the sizer handle for the specified bounds an
 * index. Only images and rectangles should be returned if support for HTML
 * labels with not foreign objects is required.
 */
MxVertexHandler.prototype.createSizerShape = function(bounds, index, fillColor) {
  if (this.handleImage !== null) {
    bounds = new MxRectangle(bounds.x, bounds.y, this.handleImage.width, this.handleImage.height)
    let shape = new MxImageShape(bounds, this.handleImage.src)

    // Allows HTML rendering of the images
    shape.preserveImageAspect = false

    return shape
  } else if (index === MxEvent.ROTATION_HANDLE) {
    return new MxEllipse(bounds, fillColor || MxConstants.HANDLE_FILLCOLOR, MxConstants.HANDLE_STROKECOLOR)
  } else {
    return new MxRectangleShape(bounds, fillColor || MxConstants.HANDLE_FILLCOLOR, MxConstants.HANDLE_STROKECOLOR)
  }
}

/**
 * Function: createBounds
 *
 * Helper method to create an <MxRectangle> around the given centerpoint
 * with a width and height of 2*s or 6, if no s is given.
 */
MxVertexHandler.prototype.moveSizerTo = function(shape, x, y) {
  if (shape !== null) {
    shape.bounds.x = Math.floor(x - shape.bounds.width / 2)
    shape.bounds.y = Math.floor(y - shape.bounds.height / 2)

    // Fixes visible inactive handles in VML
    if (shape.node !== null && shape.node.style.display !== 'none') {
      shape.redraw()
    }
  }
}

/**
 * Function: getHandleForEvent
 *
 * Returns the index of the handle for the given event. This returns the index
 * of the sizer from where the event originated or <MxEvent.LABEL_INDEX>.
 */
MxVertexHandler.prototype.getHandleForEvent = function(me) {
  // Connection highlight may consume events before they reach sizer handle
  let tol = (!MxEvent.isMouseEvent(me.getEvent())) ? this.tolerance : 1
  let hit = (this.allowHandleBoundsCheck && (MxClient.IS_IE || tol > 0))
    ? new MxRectangle(me.getGraphX() - tol, me.getGraphY() - tol, 2 * tol, 2 * tol) : null

  function checkShape(shape) {
    return shape !== null && (me.isSource(shape) || (hit !== null && MxUtils.intersects(shape.bounds, hit) && shape.node.style.display !== 'none' && shape.node.style.visibility !== 'hidden'))
  }

  if (this.customHandles !== null && this.isCustomHandleEvent(me)) {
    // Inverse loop order to match display order
    for (let i = this.customHandles.length - 1; i >= 0; i--) {
      if (checkShape(this.customHandles[i].shape)) {
        // LATER: Return reference to active shape
        return MxEvent.CUSTOM_HANDLE - i
      }
    }
  }

  if (checkShape(this.rotationShape)) {
    return MxEvent.ROTATION_HANDLE
  } else if (checkShape(this.labelShape)) {
    return MxEvent.LABEL_HANDLE
  }

  if (this.sizers !== null) {
    for (let i = 0; i < this.sizers.length; i++) {
      if (checkShape(this.sizers[i])) {
        return i
      }
    }
  }

  return null
}

/**
 * Function: isCustomHandleEvent
 *
 * Returns true if the given event allows custom handles to be changed. This
 * implementation returns true.
 */
MxVertexHandler.prototype.isCustomHandleEvent = function(me) {
  return true
}

/**
 * Function: mouseDown
 *
 * Handles the event if a handle has been clicked. By consuming the
 * event all subsequent events of the gesture are redirected to this
 * handler.
 */
MxVertexHandler.prototype.mouseDown = function(sender, me) {
  let tol = (!MxEvent.isMouseEvent(me.getEvent())) ? this.tolerance : 0

  if (!me.isConsumed() && this.graph.isEnabled() && (tol > 0 || me.getState() === this.state)) {
    let handle = this.getHandleForEvent(me)

    if (handle !== null) {
      this.start(me.getGraphX(), me.getGraphY(), handle)
      me.consume()
    }
  }
}

/**
 * Function: isLivePreviewBorder
 *
 * Called if <livePreview> is enabled to check if a border should be painted.
 * This implementation returns true if the shape is transparent.
 */
MxVertexHandler.prototype.isLivePreviewBorder = function() {
  return this.state.shape !== null && this.state.shape.fill === null && this.state.shape.stroke === null
}

/**
 * Function: start
 *
 * Starts the handling of the mouse gesture.
 */
MxVertexHandler.prototype.start = function(x, y, index) {
  this.inTolerance = true
  this.childOffsetX = 0
  this.childOffsetY = 0
  this.index = index
  this.startX = x
  this.startY = y

  // Saves reference to parent state
  let model = this.state.view.graph.model
  let parent = model.getParent(this.state.cell)

  if (this.state.view.currentRoot !== parent && (model.isVertex(parent) || model.isEdge(parent))) {
    this.parentState = this.state.view.graph.view.getState(parent)
  }

  // Creates a preview that can be on top of any HTML label
  this.selectionBorder.node.style.display = (index === MxEvent.ROTATION_HANDLE) ? 'inline' : 'none'

  // Creates the border that represents the new bounds
  if (!this.livePreview || this.isLivePreviewBorder()) {
    this.preview = this.createSelectionShape(this.bounds)

    if (!(MxClient.IS_SVG && Number(this.state.style[MxConstants.STYLE_ROTATION] || '0') !== 0) && this.state.text !== null && this.state.text.node.parentNode === this.graph.container) {
      this.preview.dialect = MxConstants.DIALECT_STRICTHTML
      this.preview.init(this.graph.container)
    } else {
      this.preview.dialect = (this.graph.dialect !== MxConstants.DIALECT_SVG)
        ? MxConstants.DIALECT_VML : MxConstants.DIALECT_SVG
      this.preview.init(this.graph.view.getOverlayPane())
    }
  }

  // Prepares the handles for live preview
  if (this.livePreview) {
    this.hideSizers()

    if (index === MxEvent.ROTATION_HANDLE) {
      this.rotationShape.node.style.display = ''
    } else if (index === MxEvent.LABEL_HANDLE) {
      this.labelShape.node.style.display = ''
    } else if (this.sizers !== null && this.sizers[index] !== null) {
      this.sizers[index].node.style.display = ''
    } else if (index <= MxEvent.CUSTOM_HANDLE && this.customHandles !== null) {
      this.customHandles[MxEvent.CUSTOM_HANDLE - index].setVisible(true)
    }

    // Gets the array of connected edge handlers for redrawing
    let edges = this.graph.getEdges(this.state.cell)
    this.edgeHandlers = []

    for (let i = 0; i < edges.length; i++) {
      let handler = this.graph.selectionCellsHandler.getHandler(edges[i])

      if (handler !== null) {
        this.edgeHandlers.push(handler)
      }
    }
  }
}

/**
 * Function: hideHandles
 *
 * Shortcut to <hideSizers>.
 */
MxVertexHandler.prototype.setHandlesVisible = function(visible) {
  if (this.sizers !== null) {
    for (let i = 0; i < this.sizers.length; i++) {
      this.sizers[i].node.style.display = (visible) ? '' : 'none'
    }
  }

  if (this.customHandles !== null) {
    for (let i = 0; i < this.customHandles.length; i++) {
      this.customHandles[i].setVisible(visible)
    }
  }
}

/**
 * Function: hideSizers
 *
 * Hides all sizers except.
 *
 * Starts the handling of the mouse gesture.
 */
MxVertexHandler.prototype.hideSizers = function() {
  this.setHandlesVisible(false)
}

/**
 * Function: checkTolerance
 *
 * Checks if the coordinates for the given event are within the
 * <mxGraph.tolerance>. If the event is a mouse event then the tolerance is
 * ignored.
 */
MxVertexHandler.prototype.checkTolerance = function(me) {
  if (this.inTolerance && this.startX !== null && this.startY !== null) {
    if (MxEvent.isMouseEvent(me.getEvent()) || Math.abs(me.getGraphX() - this.startX) > this.graph.tolerance || Math.abs(me.getGraphY() - this.startY) > this.graph.tolerance) {
      this.inTolerance = false
    }
  }
}

/**
 * Function: updateHint
 *
 * Hook for subclassers do show details while the handler is active.
 */
MxVertexHandler.prototype.updateHint = function(me) { }

/**
 * Function: removeHint
 *
 * Hooks for subclassers to hide details when the handler gets inactive.
 */
MxVertexHandler.prototype.removeHint = function() { }

/**
 * Function: roundAngle
 *
 * Hook for rounding the angle. This uses Math.round.
 */
MxVertexHandler.prototype.roundAngle = function(angle) {
  return Math.round(angle * 10) / 10
}

/**
 * Function: roundLength
 *
 * Hook for rounding the unscaled width or height. This uses Math.round.
 */
MxVertexHandler.prototype.roundLength = function(length) {
  return Math.round(length)
}

/**
 * Function: mouseMove
 *
 * Handles the event by updating the preview.
 */
MxVertexHandler.prototype.mouseMove = function(sender, me) {
  if (!me.isConsumed() && this.index !== null) {
    // Checks tolerance for ignoring single clicks
    this.checkTolerance(me)

    if (!this.inTolerance) {
      if (this.index <= MxEvent.CUSTOM_HANDLE) {
        if (this.customHandles !== null) {
          this.customHandles[MxEvent.CUSTOM_HANDLE - this.index].processEvent(me)
          this.customHandles[MxEvent.CUSTOM_HANDLE - this.index].active = true
        }
      } else if (this.index === MxEvent.LABEL_HANDLE) {
        this.moveLabel(me)
      } else if (this.index === MxEvent.ROTATION_HANDLE) {
        this.rotateVertex(me)
      } else {
        this.resizeVertex(me)
      }

      this.updateHint(me)
    }

    me.consume()
  } else if (!this.graph.isMouseDown && this.getHandleForEvent(me) !== null) {
    // Workaround for disabling the connect highlight when over handle
    me.consume(false)
  }
}

/**
 * Function: rotateVertex
 *
 * Rotates the vertex.
 */
MxVertexHandler.prototype.moveLabel = function(me) {
  let point = new MxPoint(me.getGraphX(), me.getGraphY())
  let tr = this.graph.view.translate
  let scale = this.graph.view.scale

  if (this.graph.isGridEnabledEvent(me.getEvent())) {
    point.x = (this.graph.snap(point.x / scale - tr.x) + tr.x) * scale
    point.y = (this.graph.snap(point.y / scale - tr.y) + tr.y) * scale
  }

  let index = (this.rotationShape !== null) ? this.sizers.length - 2 : this.sizers.length - 1
  this.moveSizerTo(this.sizers[index], point.x, point.y)
}

/**
 * Function: rotateVertex
 *
 * Rotates the vertex.
 */
MxVertexHandler.prototype.rotateVertex = function(me) {
  let point = new MxPoint(me.getGraphX(), me.getGraphY())
  let dx = this.state.x + this.state.width / 2 - point.x
  let dy = this.state.y + this.state.height / 2 - point.y
  this.currentAlpha = (dx !== 0) ? Math.atan(dy / dx) * 180 / Math.PI + 90 : ((dy < 0) ? 180 : 0)

  if (dx > 0) {
    this.currentAlpha -= 180
  }

  // Rotation raster
  if (this.rotationRaster && this.graph.isGridEnabledEvent(me.getEvent())) {
    let dx = point.x - this.state.getCenterX()
    let dy = point.y - this.state.getCenterY()
    let dist = Math.abs(Math.sqrt(dx * dx + dy * dy) - 20) * 3
    let raster = Math.max(1, 5 * Math.min(3, Math.max(0, Math.round(80 / Math.abs(dist)))))

    this.currentAlpha = Math.round(this.currentAlpha / raster) * raster
  } else {
    this.currentAlpha = this.roundAngle(this.currentAlpha)
  }

  this.selectionBorder.rotation = this.currentAlpha
  this.selectionBorder.redraw()

  if (this.livePreview) {
    this.redrawHandles()
  }
}

/**
 * Function: rotateVertex
 *
 * Rotates the vertex.
 */
MxVertexHandler.prototype.resizeVertex = function(me) {
  let ct = new MxPoint(this.state.getCenterX(), this.state.getCenterY())
  let alpha = MxUtils.toRadians(this.state.style[MxConstants.STYLE_ROTATION] || '0')
  let point = new MxPoint(me.getGraphX(), me.getGraphY())
  let tr = this.graph.view.translate
  let scale = this.graph.view.scale
  let cos = Math.cos(-alpha)
  let sin = Math.sin(-alpha)

  let dx = point.x - this.startX
  let dy = point.y - this.startY

  // Rotates vector for mouse gesture
  let tx = cos * dx - sin * dy
  let ty = sin * dx + cos * dy

  dx = tx
  dy = ty

  let geo = this.graph.getCellGeometry(this.state.cell)
  this.unscaledBounds = this.union(geo, dx / scale, dy / scale, this.index,
    this.graph.isGridEnabledEvent(me.getEvent()), 1,
    new MxPoint(0, 0), this.isConstrainedEvent(me),
    this.isCenteredEvent(this.state, me))

  // Keeps vertex within maximum graph or parent bounds
  if (!geo.relative) {
    let max = this.graph.getMaximumGraphBounds()

    // Handles child cells
    if (max !== null && this.parentState !== null) {
      max = MxRectangle.fromRectangle(max)

      max.x -= (this.parentState.x - tr.x * scale) / scale
      max.y -= (this.parentState.y - tr.y * scale) / scale
    }

    if (this.graph.isConstrainChild(this.state.cell)) {
      let tmp = this.graph.getCellContainmentArea(this.state.cell)

      if (tmp !== null) {
        let overlap = this.graph.getOverlap(this.state.cell)

        if (overlap > 0) {
          tmp = MxRectangle.fromRectangle(tmp)

          tmp.x -= tmp.width * overlap
          tmp.y -= tmp.height * overlap
          tmp.width += 2 * tmp.width * overlap
          tmp.height += 2 * tmp.height * overlap
        }

        if (max === null) {
          max = tmp
        } else {
          max = MxRectangle.fromRectangle(max)
          max.intersect(tmp)
        }
      }
    }

    if (max !== null) {
      if (this.unscaledBounds.x < max.x) {
        this.unscaledBounds.width -= max.x - this.unscaledBounds.x
        this.unscaledBounds.x = max.x
      }

      if (this.unscaledBounds.y < max.y) {
        this.unscaledBounds.height -= max.y - this.unscaledBounds.y
        this.unscaledBounds.y = max.y
      }

      if (this.unscaledBounds.x + this.unscaledBounds.width > max.x + max.width) {
        this.unscaledBounds.width -= this.unscaledBounds.x + this.unscaledBounds.width - max.x - max.width
      }

      if (this.unscaledBounds.y + this.unscaledBounds.height > max.y + max.height) {
        this.unscaledBounds.height -= this.unscaledBounds.y + this.unscaledBounds.height - max.y - max.height
      }
    }
  }

  this.bounds = new MxRectangle(((this.parentState !== null) ? this.parentState.x : tr.x * scale) + (this.unscaledBounds.x) * scale, ((this.parentState !== null) ? this.parentState.y : tr.y * scale) + (this.unscaledBounds.y) * scale, this.unscaledBounds.width * scale, this.unscaledBounds.height * scale)

  if (geo.relative && this.parentState !== null) {
    this.bounds.x += this.state.x - this.parentState.x
    this.bounds.y += this.state.y - this.parentState.y
  }

  cos = Math.cos(alpha)
  sin = Math.sin(alpha)

  let c2 = new MxPoint(this.bounds.getCenterX(), this.bounds.getCenterY())

  dx = c2.x - ct.x
  dy = c2.y - ct.y

  let dx2 = cos * dx - sin * dy
  let dy2 = sin * dx + cos * dy

  let dx3 = dx2 - dx
  let dy3 = dy2 - dy

  let dx4 = this.bounds.x - this.state.x
  let dy4 = this.bounds.y - this.state.y

  let dx5 = cos * dx4 - sin * dy4
  let dy5 = sin * dx4 + cos * dy4

  this.bounds.x += dx3
  this.bounds.y += dy3

  // Rounds unscaled bounds to int
  this.unscaledBounds.x = this.roundLength(this.unscaledBounds.x + dx3 / scale)
  this.unscaledBounds.y = this.roundLength(this.unscaledBounds.y + dy3 / scale)
  this.unscaledBounds.width = this.roundLength(this.unscaledBounds.width)
  this.unscaledBounds.height = this.roundLength(this.unscaledBounds.height)

  // Shifts the children according to parent offset
  if (!this.graph.isCellCollapsed(this.state.cell) && (dx3 !== 0 || dy3 !== 0)) {
    this.childOffsetX = this.state.x - this.bounds.x + dx5
    this.childOffsetY = this.state.y - this.bounds.y + dy5
  } else {
    this.childOffsetX = 0
    this.childOffsetY = 0
  }

  if (this.livePreview) {
    this.updateLivePreview(me)
  }

  if (this.preview !== null) {
    this.drawPreview()
  }
}

/**
 * Function: updateLivePreview
 *
 * Repaints the live preview.
 */
MxVertexHandler.prototype.updateLivePreview = function(me) {
  // TODO: Apply child offset to children in live preview
  let scale = this.graph.view.scale
  let tr = this.graph.view.translate

  // Saves current state
  let tempState = this.state.clone()

  // Temporarily changes size and origin
  this.state.x = this.bounds.x
  this.state.y = this.bounds.y
  this.state.origin = new MxPoint(this.state.x / scale - tr.x, this.state.y / scale - tr.y)
  this.state.width = this.bounds.width
  this.state.height = this.bounds.height

  // Needed to force update of text bounds
  this.state.unscaledWidth = null

  // Redraws cell and handles
  // 旧方法
  let off = this.state.absoluteOffset
  off = new MxPoint(off.x, off.y)
  console.log(off)
  // Required to store and reset absolute offset for updating label position
  this.state.absoluteOffset.x = 0
  this.state.absoluteOffset.y = 0
  let geo = this.graph.getCellGeometry(this.state.cell)

  if (geo !== null) {
    let offset = geo.offset || this.EMPTY_POINT

    if (offset !== null && !geo.relative) {
      this.state.absoluteOffset.x = this.state.view.scale * offset.x
      this.state.absoluteOffset.y = this.state.view.scale * offset.y
    }

    this.state.view.updateVertexLabelOffset(this.state)
  }

  // Draws the live preview
  this.state.view.graph.cellRenderer.redraw(this.state, true)

  // Redraws connected edges TODO: Include child edges
  this.state.view.invalidate(this.state.cell)
  this.state.invalid = false
  this.state.view.validate()
  this.redrawHandles()

  // Restores current state
  this.state.setState(tempState)
}

/**
 * Function: mouseUp
 *
 * Handles the event by applying the changes to the geometry.
 */
MxVertexHandler.prototype.mouseUp = function(sender, me) {
  if (this.index !== null && this.state !== null) {
    let point = new MxPoint(me.getGraphX(), me.getGraphY())

    this.graph.getModel().beginUpdate()
    try {
      if (this.index <= MxEvent.CUSTOM_HANDLE) {
        if (this.customHandles !== null) {
          this.customHandles[MxEvent.CUSTOM_HANDLE - this.index].active = false
          this.customHandles[MxEvent.CUSTOM_HANDLE - this.index].execute()
        }
      } else if (this.index === MxEvent.ROTATION_HANDLE) {
        if (this.currentAlpha !== null) {
          let delta = this.currentAlpha - (this.state.style[MxConstants.STYLE_ROTATION] || 0)

          if (delta !== 0) {
            this.rotateCell(this.state.cell, delta)
          }
        } else {
          this.rotateClick()
        }
      } else {
        let gridEnabled = this.graph.isGridEnabledEvent(me.getEvent())
        let alpha = MxUtils.toRadians(this.state.style[MxConstants.STYLE_ROTATION] || '0')
        let cos = Math.cos(-alpha)
        let sin = Math.sin(-alpha)

        let dx = point.x - this.startX
        let dy = point.y - this.startY

        // Rotates vector for mouse gesture
        let tx = cos * dx - sin * dy
        let ty = sin * dx + cos * dy

        dx = tx
        dy = ty

        let s = this.graph.view.scale
        let recurse = this.isRecursiveResize(this.state, me)
        this.resizeCell(this.state.cell, this.roundLength(dx / s), this.roundLength(dy / s),
          this.index, gridEnabled, this.isConstrainedEvent(me), recurse)
      }
    } finally {
      this.graph.getModel().endUpdate()
    }

    me.consume()
    this.reset()
  }
}

/**
 * Function: rotateCell
 *
 * Rotates the given cell to the given rotation.
 */
MxVertexHandler.prototype.isRecursiveResize = function(state, me) {
  return this.graph.isRecursiveResize(this.state)
}

/**
 * Function: rotateClick
 *
 * Hook for subclassers to implement a single click on the rotation handle.
 * This code is executed as part of the model transaction. This implementation
 * is empty.
 */
MxVertexHandler.prototype.rotateClick = function() { }

/**
 * Function: rotateCell
 *
 * Rotates the given cell and its children by the given angle in degrees.
 *
 * Parameters:
 *
 * cell - <mxCell> to be rotated.
 * angle - Angle in degrees.
 */
MxVertexHandler.prototype.rotateCell = function(cell, angle, parent) {
  if (angle !== 0) {
    let model = this.graph.getModel()

    if (model.isVertex(cell) || model.isEdge(cell)) {
      if (!model.isEdge(cell)) {
        let state = this.graph.view.getState(cell)
        let style = (state !== null) ? state.style : this.graph.getCellStyle(cell)

        if (style !== null) {
          let total = (style[MxConstants.STYLE_ROTATION] || 0) + angle
          this.graph.setCellStyles(MxConstants.STYLE_ROTATION, total, [cell])
        }
      }

      let geo = this.graph.getCellGeometry(cell)

      if (geo !== null) {
        let pgeo = this.graph.getCellGeometry(parent)

        if (pgeo !== null && !model.isEdge(parent)) {
          geo = geo.clone()
          geo.rotate(angle, new MxPoint(pgeo.width / 2, pgeo.height / 2))
          model.setGeometry(cell, geo)
        }

        if ((model.isVertex(cell) && !geo.relative) || model.isEdge(cell)) {
          // Recursive rotation
          let childCount = model.getChildCount(cell)

          for (let i = 0; i < childCount; i++) {
            this.rotateCell(model.getChildAt(cell, i), angle, cell)
          }
        }
      }
    }
  }
}

/**
 * Function: reset
 *
 * Resets the state of this handler.
 */
MxVertexHandler.prototype.reset = function() {
  if (this.sizers !== null && this.index !== null && this.sizers[this.index] !== null && this.sizers[this.index].node.style.display === 'none') {
    this.sizers[this.index].node.style.display = ''
  }

  this.currentAlpha = null
  this.inTolerance = null
  this.index = null

  // TODO: Reset and redraw cell states for live preview
  if (this.preview !== null) {
    this.preview.destroy()
    this.preview = null
  }

  if (this.livePreview && this.sizers !== null) {
    for (let i = 0; i < this.sizers.length; i++) {
      if (this.sizers[i] !== null) {
        this.sizers[i].node.style.display = ''
      }
    }
  }

  if (this.customHandles !== null) {
    for (let i = 0; i < this.customHandles.length; i++) {
      if (this.customHandles[i].active) {
        this.customHandles[i].active = false
        this.customHandles[i].reset()
      } else {
        this.customHandles[i].setVisible(true)
      }
    }
  }

  // Checks if handler has been destroyed
  if (this.selectionBorder !== null) {
    this.selectionBorder.node.style.display = 'inline'
    this.selectionBounds = this.getSelectionBounds(this.state)
    this.bounds = new MxRectangle(this.selectionBounds.x, this.selectionBounds.y,
      this.selectionBounds.width, this.selectionBounds.height)
    this.drawPreview()
  }

  this.removeHint()
  this.redrawHandles()
  this.edgeHandlers = null
  this.unscaledBounds = null
}

/**
 * Function: resizeCell
 *
 * Uses the given vector to change the bounds of the given cell
 * in the graph using <mxGraph.resizeCell>.
 */
MxVertexHandler.prototype.resizeCell = function(cell, dx, dy, index, gridEnabled, constrained, recurse) {
  let geo = this.graph.model.getGeometry(cell)

  if (geo !== null) {
    if (index === MxEvent.LABEL_HANDLE) {
      let scale = this.graph.view.scale
      dx = Math.round((this.labelShape.bounds.getCenterX() - this.startX) / scale)
      dy = Math.round((this.labelShape.bounds.getCenterY() - this.startY) / scale)

      geo = geo.clone()

      if (geo.offset === null) {
        geo.offset = new MxPoint(dx, dy)
      } else {
        geo.offset.x += dx
        geo.offset.y += dy
      }

      this.graph.model.setGeometry(cell, geo)
    } else if (this.unscaledBounds !== null) {
      let scale = this.graph.view.scale

      if (this.childOffsetX !== 0 || this.childOffsetY !== 0) {
        this.moveChildren(cell, Math.round(this.childOffsetX / scale), Math.round(this.childOffsetY / scale))
      }

      this.graph.resizeCell(cell, this.unscaledBounds, recurse)
    }
  }
}

/**
 * Function: moveChildren
 *
 * Moves the children of the given cell by the given vector.
 */
MxVertexHandler.prototype.moveChildren = function(cell, dx, dy) {
  let model = this.graph.getModel()
  let childCount = model.getChildCount(cell)

  for (let i = 0; i < childCount; i++) {
    let child = model.getChildAt(cell, i)
    let geo = this.graph.getCellGeometry(child)

    if (geo !== null) {
      geo = geo.clone()
      geo.translate(dx, dy)
      model.setGeometry(child, geo)
    }
  }
}
/**
 * Function: union
 *
 * Returns the union of the given bounds and location for the specified
 * handle index.
 *
 * To override this to limit the size of vertex via a minWidth/-Height style,
 * the following code can be used.
 *
 * (code)
 * let vertexHandlerUnion = MxVertexHandler.prototype.union;
 * MxVertexHandler.prototype.union = function(bounds, dx, dy, index, gridEnabled, scale, tr, constrained)
 * {
 *   let result = vertexHandlerUnion.apply(this, arguments);
 *
 *   result.width = Math.max(result.width, MxUtils.getNumber(this.state.style, 'minWidth', 0));
 *   result.height = Math.max(result.height, MxUtils.getNumber(this.state.style, 'minHeight', 0));
 *
 *   return result;
 * };
 * (end)
 *
 * The minWidth/-Height style can then be used as follows:
 *
 * (code)
 * graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30, 'minWidth=100;minHeight=100;');
 * (end)
 *
 * To override this to update the height for a wrapped text if the width of a vertex is
 * changed, the following can be used.
 *
 * (code)
 * let mxVertexHandlerUnion = MxVertexHandler.prototype.union;
 * MxVertexHandler.prototype.union = function(bounds, dx, dy, index, gridEnabled, scale, tr, constrained)
 * {
 *   let result = mxVertexHandlerUnion.apply(this, arguments);
 *   let s = this.state;
 *
 *   if (this.graph.isHtmlLabel(s.cell) && (index === 3 || index === 4) &&
 *       s.text !== null && s.style[MxConstants.STYLE_WHITE_SPACE] === 'wrap')
 *   {
 *     let label = this.graph.getLabel(s.cell);
 *     let fontSize = MxUtils.getNumber(s.style, MxConstants.STYLE_FONTSIZE, MxConstants.DEFAULT_FONTSIZE);
 *     let ww = result.width / s.view.scale - s.text.spacingRight - s.text.spacingLeft
 *
 *     result.height = MxUtils.getSizeForString(label, fontSize, s.style[MxConstants.STYLE_FONTFAMILY], ww).height;
 *   }
 *
 *   return result;
 * };
 * (end)
 */
MxVertexHandler.prototype.union = function(bounds, dx, dy, index, gridEnabled, scale, tr, constrained, centered) {
  if (this.singleSizer) {
    let x = bounds.x + bounds.width + dx
    let y = bounds.y + bounds.height + dy

    if (gridEnabled) {
      x = this.graph.snap(x / scale) * scale
      y = this.graph.snap(y / scale) * scale
    }

    let rect = new MxRectangle(bounds.x, bounds.y, 0, 0)
    rect.add(new MxRectangle(x, y, 0, 0))

    return rect
  } else {
    let w0 = bounds.width
    let h0 = bounds.height
    let left = bounds.x - tr.x * scale
    let right = left + w0
    let top = bounds.y - tr.y * scale
    let bottom = top + h0

    let cx = left + w0 / 2
    let cy = top + h0 / 2

    if (index > 4 /* Bottom Row */) {
      bottom = bottom + dy

      if (gridEnabled) {
        bottom = this.graph.snap(bottom / scale) * scale
      }
    } else if (index < 3 /* Top Row */) {
      top = top + dy

      if (gridEnabled) {
        top = this.graph.snap(top / scale) * scale
      }
    }

    if (index === 0 || index === 3 || index === 5 /* Left */) {
      left += dx

      if (gridEnabled) {
        left = this.graph.snap(left / scale) * scale
      }
    } else if (index === 2 || index === 4 || index === 7 /* Right */) {
      right += dx

      if (gridEnabled) {
        right = this.graph.snap(right / scale) * scale
      }
    }

    let width = right - left
    let height = bottom - top

    if (constrained) {
      let geo = this.graph.getCellGeometry(this.state.cell)

      if (geo !== null) {
        let aspect = geo.width / geo.height

        if (index === 1 || index === 2 || index === 7 || index === 6) {
          width = height * aspect
        } else {
          height = width / aspect
        }

        if (index === 0) {
          left = right - width
          top = bottom - height
        }
      }
    }

    if (centered) {
      width += (width - w0)
      height += (height - h0)

      let cdx = cx - (left + width / 2)
      let cdy = cy - (top + height / 2)

      left += cdx
      top += cdy
      right += cdx
      bottom += cdy
    }

    // Flips over left side
    if (width < 0) {
      left += width
      width = Math.abs(width)
    }

    // Flips over top side
    if (height < 0) {
      top += height
      height = Math.abs(height)
    }

    let result = new MxRectangle(left + tr.x * scale, top + tr.y * scale, width, height)

    if (this.minBounds !== null) {
      result.width = Math.max(result.width, this.minBounds.x * scale + this.minBounds.width * scale + Math.max(0, this.x0 * scale - result.x))
      result.height = Math.max(result.height, this.minBounds.y * scale + this.minBounds.height * scale + Math.max(0, this.y0 * scale - result.y))
    }

    return result
  }
}

/**
 * Function: redraw
 *
 * Redraws the handles and the preview.
 */
MxVertexHandler.prototype.redraw = function() {
  this.selectionBounds = this.getSelectionBounds(this.state)
  this.bounds = new MxRectangle(this.selectionBounds.x, this.selectionBounds.y, this.selectionBounds.width, this.selectionBounds.height)

  this.redrawHandles()
  this.drawPreview()
}

/**
 * Returns the padding to be used for drawing handles for the current <bounds>.
 */
MxVertexHandler.prototype.getHandlePadding = function() {
  // KNOWN: Tolerance depends on event type (eg. 0 for mouse events)
  let result = new MxPoint(0, 0)
  let tol = this.tolerance

  if (this.sizers !== null && this.sizers.length > 0 && this.sizers[0] !== null && (this.bounds.width < 2 * this.sizers[0].bounds.width + 2 * tol || this.bounds.height < 2 * this.sizers[0].bounds.height + 2 * tol)) {
    tol /= 2

    result.x = this.sizers[0].bounds.width + tol
    result.y = this.sizers[0].bounds.height + tol
  }

  return result
}

/**
 * Function: redrawHandles
 *
 * Redraws the handles. To hide certain handles the following code can be used.
 *
 * (code)
 * MxVertexHandler.prototype.redrawHandles = function()
 * {
 *   mxVertexHandlerRedrawHandles.apply(this, arguments);
 *
 *   if (this.sizers !== null && this.sizers.length > 7)
 *   {
 *     this.sizers[1].node.style.display = 'none';
 *     this.sizers[6].node.style.display = 'none';
 *   }
 * };
 * (end)
 */
MxVertexHandler.prototype.redrawHandles = function() {
  let tol = this.tolerance
  this.horizontalOffset = 0
  this.verticalOffset = 0
  let s = this.bounds

  if (this.sizers !== null && this.sizers.length > 0 && this.sizers[0] !== null) {
    if (this.index === null && this.manageSizers && this.sizers.length >= 8) {
      // KNOWN: Tolerance depends on event type (eg. 0 for mouse events)
      let padding = this.getHandlePadding()
      this.horizontalOffset = padding.x
      this.verticalOffset = padding.y

      if (this.horizontalOffset !== 0 || this.verticalOffset !== 0) {
        s = new MxRectangle(s.x, s.y, s.width, s.height)

        s.x -= this.horizontalOffset / 2
        s.width += this.horizontalOffset
        s.y -= this.verticalOffset / 2
        s.height += this.verticalOffset
      }

      if (this.sizers.length >= 8) {
        if ((s.width < 2 * this.sizers[0].bounds.width + 2 * tol) || (s.height < 2 * this.sizers[0].bounds.height + 2 * tol)) {
          this.sizers[0].node.style.display = 'none'
          this.sizers[2].node.style.display = 'none'
          this.sizers[5].node.style.display = 'none'
          this.sizers[7].node.style.display = 'none'
        } else {
          this.sizers[0].node.style.display = ''
          this.sizers[2].node.style.display = ''
          this.sizers[5].node.style.display = ''
          this.sizers[7].node.style.display = ''
        }
      }
    }

    let r = s.x + s.width
    let b = s.y + s.height

    if (this.singleSizer) {
      this.moveSizerTo(this.sizers[0], r, b)
    } else {
      let cx = s.x + s.width / 2
      let cy = s.y + s.height / 2

      if (this.sizers.length >= 8) {
        let crs = ['nw-resize', 'n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize']

        let alpha = MxUtils.toRadians(this.state.style[MxConstants.STYLE_ROTATION] || '0')
        let cos = Math.cos(alpha)
        let sin = Math.sin(alpha)

        let da = Math.round(alpha * 4 / Math.PI)

        let ct = new MxPoint(s.getCenterX(), s.getCenterY())
        let pt = MxUtils.getRotatedPoint(new MxPoint(s.x, s.y), cos, sin, ct)

        this.moveSizerTo(this.sizers[0], pt.x, pt.y)
        this.sizers[0].setCursor(crs[MxUtils.mod(0 + da, crs.length)])

        pt.x = cx
        pt.y = s.y
        pt = MxUtils.getRotatedPoint(pt, cos, sin, ct)

        this.moveSizerTo(this.sizers[1], pt.x, pt.y)
        this.sizers[1].setCursor(crs[MxUtils.mod(1 + da, crs.length)])

        pt.x = r
        pt.y = s.y
        pt = MxUtils.getRotatedPoint(pt, cos, sin, ct)

        this.moveSizerTo(this.sizers[2], pt.x, pt.y)
        this.sizers[2].setCursor(crs[MxUtils.mod(2 + da, crs.length)])

        pt.x = s.x
        pt.y = cy
        pt = MxUtils.getRotatedPoint(pt, cos, sin, ct)

        this.moveSizerTo(this.sizers[3], pt.x, pt.y)
        this.sizers[3].setCursor(crs[MxUtils.mod(7 + da, crs.length)])

        pt.x = r
        pt.y = cy
        pt = MxUtils.getRotatedPoint(pt, cos, sin, ct)

        this.moveSizerTo(this.sizers[4], pt.x, pt.y)
        this.sizers[4].setCursor(crs[MxUtils.mod(3 + da, crs.length)])

        pt.x = s.x
        pt.y = b
        pt = MxUtils.getRotatedPoint(pt, cos, sin, ct)

        this.moveSizerTo(this.sizers[5], pt.x, pt.y)
        this.sizers[5].setCursor(crs[MxUtils.mod(6 + da, crs.length)])

        pt.x = cx
        pt.y = b
        pt = MxUtils.getRotatedPoint(pt, cos, sin, ct)

        this.moveSizerTo(this.sizers[6], pt.x, pt.y)
        this.sizers[6].setCursor(crs[MxUtils.mod(5 + da, crs.length)])

        pt.x = r
        pt.y = b
        pt = MxUtils.getRotatedPoint(pt, cos, sin, ct)

        this.moveSizerTo(this.sizers[7], pt.x, pt.y)
        this.sizers[7].setCursor(crs[MxUtils.mod(4 + da, crs.length)])

        this.moveSizerTo(this.sizers[8], cx + this.state.absoluteOffset.x, cy + this.state.absoluteOffset.y)
      } else if (this.state.width >= 2 && this.state.height >= 2) {
        this.moveSizerTo(this.sizers[0], cx + this.state.absoluteOffset.x, cy + this.state.absoluteOffset.y)
      } else {
        this.moveSizerTo(this.sizers[0], this.state.x, this.state.y)
      }
    }
  }

  if (this.rotationShape !== null) {
    let alpha = MxUtils.toRadians((this.currentAlpha !== null) ? this.currentAlpha : this.state.style[MxConstants.STYLE_ROTATION] || '0')
    let cos = Math.cos(alpha)
    let sin = Math.sin(alpha)

    let ct = new MxPoint(this.state.getCenterX(), this.state.getCenterY())
    let pt = MxUtils.getRotatedPoint(this.getRotationHandlePosition(), cos, sin, ct)

    if (this.rotationShape.node !== null) {
      this.moveSizerTo(this.rotationShape, pt.x, pt.y)

      // Hides rotation handle during text editing
      this.rotationShape.node.style.visibility = (this.state.view.graph.isEditing()) ? 'hidden' : ''
    }
  }

  if (this.selectionBorder !== null) {
    this.selectionBorder.rotation = Number(this.state.style[MxConstants.STYLE_ROTATION] || '0')
  }

  if (this.edgeHandlers !== null) {
    for (let i = 0; i < this.edgeHandlers.length; i++) {
      this.edgeHandlers[i].redraw()
    }
  }

  if (this.customHandles !== null) {
    for (let i = 0; i < this.customHandles.length; i++) {
      let temp = this.customHandles[i].shape.node.style.display
      this.customHandles[i].redraw()
      this.customHandles[i].shape.node.style.display = temp

      // Hides custom handles during text editing
      this.customHandles[i].shape.node.style.visibility = (this.graph.isEditing()) ? 'hidden' : ''
    }
  }

  this.updateParentHighlight()
}

/**
 * Function: getRotationHandlePosition
 *
 * Returns an <MxPoint> that defines the rotation handle position.
 */
MxVertexHandler.prototype.getRotationHandlePosition = function() {
  return new MxPoint(this.bounds.x + this.bounds.width / 2, this.bounds.y + this.rotationHandleVSpacing)
}

/**
 * Function: updateParentHighlight
 *
 * Updates the highlight of the parent if <parentHighlightEnabled> is true.
 */
MxVertexHandler.prototype.updateParentHighlight = function() {
  // If not destroyed
  if (this.selectionBorder !== null) {
    if (this.parentHighlight !== null) {
      let parent = this.graph.model.getParent(this.state.cell)

      if (this.graph.model.isVertex(parent)) {
        let pstate = this.graph.view.getState(parent)
        let b = this.parentHighlight.bounds

        if (pstate !== null && (b.x !== pstate.x || b.y !== pstate.y || b.width !== pstate.width || b.height !== pstate.height)) {
          this.parentHighlight.bounds = pstate
          this.parentHighlight.redraw()
        }
      } else {
        this.parentHighlight.destroy()
        this.parentHighlight = null
      }
    } else if (this.parentHighlightEnabled) {
      let parent = this.graph.model.getParent(this.state.cell)

      if (this.graph.model.isVertex(parent)) {
        let pstate = this.graph.view.getState(parent)

        if (pstate !== null) {
          this.parentHighlight = this.createParentHighlightShape(pstate)
          // VML dialect required here for event transparency in IE
          this.parentHighlight.dialect = (this.graph.dialect !== MxConstants.DIALECT_SVG) ? MxConstants.DIALECT_VML : MxConstants.DIALECT_SVG
          this.parentHighlight.pointerEvents = false
          this.parentHighlight.rotation = Number(pstate.style[MxConstants.STYLE_ROTATION] || '0')
          this.parentHighlight.init(this.graph.getView().getOverlayPane())
        }
      }
    }
  }
}

/**
 * Function: drawPreview
 *
 * Redraws the preview.
 */
MxVertexHandler.prototype.drawPreview = function() {
  if (this.preview !== null) {
    this.preview.bounds = this.bounds

    if (this.preview.node.parentNode === this.graph.container) {
      this.preview.bounds.width = Math.max(0, this.preview.bounds.width - 1)
      this.preview.bounds.height = Math.max(0, this.preview.bounds.height - 1)
    }

    this.preview.rotation = Number(this.state.style[MxConstants.STYLE_ROTATION] || '0')
    this.preview.redraw()
  }

  this.selectionBorder.bounds = this.bounds
  this.selectionBorder.redraw()

  if (this.parentHighlight !== null) {
    this.parentHighlight.redraw()
  }
}

/**
 * Function: destroy
 *
 * Destroys the handler and all its resources and DOM nodes.
 */
MxVertexHandler.prototype.destroy = function() {
  if (this.escapeHandler !== null) {
    this.state.view.graph.removeListener(this.escapeHandler)
    this.escapeHandler = null
  }

  if (this.preview !== null) {
    this.preview.destroy()
    this.preview = null
  }

  if (this.parentHighlight !== null) {
    this.parentHighlight.destroy()
    this.parentHighlight = null
  }

  if (this.selectionBorder !== null) {
    this.selectionBorder.destroy()
    this.selectionBorder = null
  }

  this.labelShape = null
  this.removeHint()

  if (this.sizers !== null) {
    for (let i = 0; i < this.sizers.length; i++) {
      this.sizers[i].destroy()
    }

    this.sizers = null
  }

  if (this.customHandles !== null) {
    for (let i = 0; i < this.customHandles.length; i++) {
      this.customHandles[i].destroy()
    }

    this.customHandles = null
  }
}
