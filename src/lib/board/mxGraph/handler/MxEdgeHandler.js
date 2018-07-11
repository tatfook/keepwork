/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxEdgeHandler
 *
 * Graph event handler that reconnects edges and modifies control points and
 * the edge label location. Uses <mxTerminalMarker> for finding and
 * highlighting new source and target vertices. This handler is automatically
 * created in <mxGraph.createHandler> for each selected edge.
 *
 * To enable adding/removing control points, the following code can be used:
 *
 * (code)
 * MxEdgeHandler.prototype.addEnabled = true;
 * MxEdgeHandler.prototype.removeEnabled = true;
 * (end)
 *
 * Note: This experimental feature is not recommended for production use.
 *
 * Constructor: MxEdgeHandler
 *
 * Constructs an edge handler for the specified <mxCellState>.
 *
 * Parameters:
 *
 * state - <mxCellState> of the cell to be handled.
 */
import MxUtils from '../util/MxUtils'
import MxEvent from '../util/MxEvent'
import MxConstraintHandler from './MxConstraintHandler'
import MxConstants from '../util/MxConstants'
import MxGraphHandler from './MxGraphHandler'
import MxPoint from '../util/MxPoint'
import MxRectangleShape from '../shape/MxRectangleShape'
import MxCellMarker from './MxCellMarker'
import MxEdgeStyle from '../view/MxEdgeStyle'
import MxImageShape from '../shape/MxImageShape'
import MxRectangle from '../util/MxRectangle'
import MxClient from '../MxClient'
import MxConnectionConstraint from '../view/MxConnectionConstraint'
export default class MxEdgeHandler {
  constructor(state) {
    if (state !== null) {
      this.state = state
      this.init()

      // Handles escape keystrokes
      this.escapeHandler = MxUtils.bind(this, function(sender, evt) {
        let dirty = this.index !== null
        this.reset()

        if (dirty) {
          this.graph.cellRenderer.redraw(this.state, false, state.view.isRendering())
        }
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
MxEdgeHandler.prototype.graph = null

/**
 * Variable: state
 *
 * Reference to the <mxCellState> being modified.
 */
MxEdgeHandler.prototype.state = null

/**
 * Variable: marker
 *
 * Holds the <mxTerminalMarker> which is used for highlighting terminals.
 */
MxEdgeHandler.prototype.marker = null

/**
 * Variable: constraintHandler
 *
 * Holds the <MxConstraintHandler> used for drawing and highlighting
 * constraints.
 */
MxEdgeHandler.prototype.constraintHandler = null

/**
 * Variable: error
 *
 * Holds the current validation error while a connection is being changed.
 */
MxEdgeHandler.prototype.error = null

/**
 * Variable: shape
 *
 * Holds the <mxShape> that represents the preview edge.
 */
MxEdgeHandler.prototype.shape = null

/**
 * Variable: bends
 *
 * Holds the <mxShapes> that represent the points.
 */
MxEdgeHandler.prototype.bends = null

/**
 * Variable: labelShape
 *
 * Holds the <mxShape> that represents the label position.
 */
MxEdgeHandler.prototype.labelShape = null

/**
 * Variable: cloneEnabled
 *
 * Specifies if cloning by control-drag is enabled. Default is true.
 */
MxEdgeHandler.prototype.cloneEnabled = true

/**
 * Variable: addEnabled
 *
 * Specifies if adding bends by shift-click is enabled. Default is false.
 * Note: This experimental feature is not recommended for production use.
 */
MxEdgeHandler.prototype.addEnabled = false

/**
 * Variable: removeEnabled
 *
 * Specifies if removing bends by shift-click is enabled. Default is false.
 * Note: This experimental feature is not recommended for production use.
 */
MxEdgeHandler.prototype.removeEnabled = false

/**
 * Variable: dblClickRemoveEnabled
 *
 * Specifies if removing bends by double click is enabled. Default is false.
 */
MxEdgeHandler.prototype.dblClickRemoveEnabled = false

/**
 * Variable: mergeRemoveEnabled
 *
 * Specifies if removing bends by dropping them on other bends is enabled.
 * Default is false.
 */
MxEdgeHandler.prototype.mergeRemoveEnabled = false

/**
 * Variable: straightRemoveEnabled
 *
 * Specifies if removing bends by creating straight segments should be enabled.
 * If enabled, this can be overridden by holding down the alt key while moving.
 * Default is false.
 */
MxEdgeHandler.prototype.straightRemoveEnabled = false

/**
 * Variable: virtualBendsEnabled
 *
 * Specifies if virtual bends should be added in the center of each
 * segments. These bends can then be used to add new waypoints.
 * Default is false.
 */
MxEdgeHandler.prototype.virtualBendsEnabled = false

/**
 * Variable: virtualBendOpacity
 *
 * Opacity to be used for virtual bends (see <virtualBendsEnabled>).
 * Default is 20.
 */
MxEdgeHandler.prototype.virtualBendOpacity = 20

/**
 * Variable: parentHighlightEnabled
 *
 * Specifies if the parent should be highlighted if a child cell is selected.
 * Default is false.
 */
MxEdgeHandler.prototype.parentHighlightEnabled = false

/**
 * Variable: preferHtml
 *
 * Specifies if bends should be added to the graph container. This is updated
 * in <init> based on whether the edge or one of its terminals has an HTML
 * label in the container.
 */
MxEdgeHandler.prototype.preferHtml = false

/**
 * Variable: allowHandleBoundsCheck
 *
 * Specifies if the bounds of handles should be used for hit-detection in IE
 * Default is true.
 */
MxEdgeHandler.prototype.allowHandleBoundsCheck = true

/**
 * Variable: snapToTerminals
 *
 * Specifies if waypoints should snap to the routing centers of terminals.
 * Default is false.
 */
MxEdgeHandler.prototype.snapToTerminals = false

/**
 * Variable: handleImage
 *
 * Optional <mxImage> to be used as handles. Default is null.
 */
MxEdgeHandler.prototype.handleImage = null

/**
 * Variable: tolerance
 *
 * Optional tolerance for hit-detection in <getHandleForEvent>. Default is 0.
 */
MxEdgeHandler.prototype.tolerance = 0

/**
 * Variable: outlineConnect
 *
 * Specifies if connections to the outline of a highlighted target should be
 * enabled. This will allow to place the connection point along the outline of
 * the highlighted target. Default is false.
 */
MxEdgeHandler.prototype.outlineConnect = false

/**
 * Variable: manageLabelHandle
 *
 * Specifies if the label handle should be moved if it intersects with another
 * handle. Uses <checkLabelHandle> for checking and moving. Default is false.
 */
MxEdgeHandler.prototype.manageLabelHandle = false

/**
 * Function: init
 *
 * Initializes the shapes required for this edge handler.
 */
MxEdgeHandler.prototype.init = function() {
  this.graph = this.state.view.graph
  this.marker = this.createMarker()
  this.constraintHandler = new MxConstraintHandler(this.graph)

  // Clones the original points from the cell
  // and makes sure at least one point exists
  this.points = []

  // Uses the absolute points of the state
  // for the initial configuration and preview
  this.abspoints = this.getSelectionPoints(this.state)
  this.shape = this.createSelectionShape(this.abspoints)
  this.shape.dialect = (this.graph.dialect !== MxConstants.DIALECT_SVG)
    ? MxConstants.DIALECT_MIXEDHTML : MxConstants.DIALECT_SVG
  this.shape.init(this.graph.getView().getOverlayPane())
  this.shape.pointerEvents = false
  this.shape.setCursor(MxConstants.CURSOR_MOVABLE_EDGE)
  MxEvent.redirectMouseEvents(this.shape.node, this.graph, this.state)

  // Updates preferHtml
  this.preferHtml = this.state.text !== null && this.state.text.node.parentNode === this.graph.container

  if (!this.preferHtml) {
    // Checks source terminal
    let sourceState = this.state.getVisibleTerminalState(true)

    if (sourceState !== null) {
      this.preferHtml = sourceState.text !== null && sourceState.text.node.parentNode === this.graph.container
    }

    if (!this.preferHtml) {
      // Checks target terminal
      let targetState = this.state.getVisibleTerminalState(false)

      if (targetState !== null) {
        this.preferHtml = targetState.text !== null && targetState.text.node.parentNode === this.graph.container
      }
    }
  }

  // Adds highlight for parent group
  if (this.parentHighlightEnabled) {
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

  // Creates bends for the non-routed absolute points
  // or bends that don't correspond to points
  if (this.graph.getSelectionCount() < MxGraphHandler.prototype.maxCells || MxGraphHandler.prototype.maxCells <= 0) {
    this.bends = this.createBends()

    if (this.isVirtualBendsEnabled()) {
      this.virtualBends = this.createVirtualBends()
    }
  }

  // Adds a rectangular handle for the label position
  this.label = new MxPoint(this.state.absoluteOffset.x, this.state.absoluteOffset.y)
  this.labelShape = this.createLabelHandleShape()
  this.initBend(this.labelShape)
  this.labelShape.setCursor(MxConstants.CURSOR_LABEL_HANDLE)

  this.customHandles = this.createCustomHandles()

  this.redraw()
}

/**
 * Function: createCustomHandles
 *
 * Returns an array of custom handles. This implementation returns null.
 */
MxEdgeHandler.prototype.createCustomHandles = function() {
  return null
}

/**
 * Function: isVirtualBendsEnabled
 *
 * Returns true if virtual bends should be added. This returns true if
 * <virtualBendsEnabled> is true and the current style allows and
 * renders custom waypoints.
 */
MxEdgeHandler.prototype.isVirtualBendsEnabled = function(evt) {
  return this.virtualBendsEnabled && (this.state.style[MxConstants.STYLE_EDGE] === null || this.state.style[MxConstants.STYLE_EDGE] === MxConstants.NONE || this.state.style[MxConstants.STYLE_NOEDGESTYLE] === 1) && MxUtils.getValue(this.state.style, MxConstants.STYLE_SHAPE, null) !== 'arrow'
}

/**
 * Function: isAddPointEvent
 *
 * Returns true if the given event is a trigger to add a new point. This
 * implementation returns true if shift is pressed.
 */
MxEdgeHandler.prototype.isAddPointEvent = function(evt) {
  return MxEvent.isShiftDown(evt)
}

/**
 * Function: isRemovePointEvent
 *
 * Returns true if the given event is a trigger to remove a point. This
 * implementation returns true if shift is pressed.
 */
MxEdgeHandler.prototype.isRemovePointEvent = function(evt) {
  return MxEvent.isShiftDown(evt)
}

/**
 * Function: getSelectionPoints
 *
 * Returns the list of points that defines the selection stroke.
 */
MxEdgeHandler.prototype.getSelectionPoints = function(state) {
  return state.absolutePoints
}

/**
 * Function: createSelectionShape
 *
 * Creates the shape used to draw the selection border.
 */
MxEdgeHandler.prototype.createParentHighlightShape = function(bounds) {
  let shape = new MxRectangleShape(bounds, null, this.getSelectionColor())
  shape.strokewidth = this.getSelectionStrokeWidth()
  shape.isDashed = this.isSelectionDashed()

  return shape
}

/**
 * Function: createSelectionShape
 *
 * Creates the shape used to draw the selection border.
 */
MxEdgeHandler.prototype.createSelectionShape = function(points) {
  let shape = new this.state.shape.constructor()
  shape.outline = true
  shape.apply(this.state)

  shape.isDashed = this.isSelectionDashed()
  shape.stroke = this.getSelectionColor()
  shape.isShadow = false

  return shape
}

/**
 * Function: getSelectionColor
 *
 * Returns <MxConstants.EDGE_SELECTION_COLOR>.
 */
MxEdgeHandler.prototype.getSelectionColor = function() {
  return MxConstants.EDGE_SELECTION_COLOR
}

/**
 * Function: getSelectionStrokeWidth
 *
 * Returns <MxConstants.EDGE_SELECTION_STROKEWIDTH>.
 */
MxEdgeHandler.prototype.getSelectionStrokeWidth = function() {
  return MxConstants.EDGE_SELECTION_STROKEWIDTH
}

/**
 * Function: isSelectionDashed
 *
 * Returns <MxConstants.EDGE_SELECTION_DASHED>.
 */
MxEdgeHandler.prototype.isSelectionDashed = function() {
  return MxConstants.EDGE_SELECTION_DASHED
}

/**
 * Function: isConnectableCell
 *
 * Returns true if the given cell is connectable. This is a hook to
 * disable floating connections. This implementation returns true.
 */
MxEdgeHandler.prototype.isConnectableCell = function(cell) {
  return true
}

/**
 * Function: getCellAt
 *
 * Creates and returns the <MxCellMarker> used in <marker>.
 */
MxEdgeHandler.prototype.getCellAt = function(x, y) {
  return (!this.outlineConnect) ? this.graph.getCellAt(x, y) : null
}

/**
 * Function: createMarker
 *
 * Creates and returns the <MxCellMarker> used in <marker>.
 */
MxEdgeHandler.prototype.createMarker = function() {
  let marker = new MxCellMarker(this.graph)
  let self = this // closure

  // Only returns edges if they are connectable and never returns
  // the edge that is currently being modified
  marker.getCell = function(me) {
    let cell = MxCellMarker.prototype.getCell.apply(this, arguments)

    // Checks for cell at preview point (with grid)
    if ((cell === self.state.cell || cell === null) && self.currentPoint !== null) {
      cell = self.graph.getCellAt(self.currentPoint.x, self.currentPoint.y)
    }

    // Uses connectable parent vertex if one exists
    if (cell !== null && !this.graph.isCellConnectable(cell)) {
      let parent = this.graph.getModel().getParent(cell)

      if (this.graph.getModel().isVertex(parent) && this.graph.isCellConnectable(parent)) {
        cell = parent
      }
    }

    let model = self.graph.getModel()

    if ((this.graph.isSwimlane(cell) && self.currentPoint !== null && this.graph.hitsSwimlaneContent(cell, self.currentPoint.x, self.currentPoint.y)) || (!self.isConnectableCell(cell)) || (cell === self.state.cell || (cell !== null && !self.graph.connectableEdges && model.isEdge(cell))) || model.isAncestor(self.state.cell, cell)) {
      cell = null
    }

    if (!this.graph.isCellConnectable(cell)) {
      cell = null
    }

    return cell
  }

  // Sets the highlight color according to validateConnection
  marker.isValidState = function(state) {
    let model = self.graph.getModel()
    let other = self.graph.view.getTerminalPort(state,
      self.graph.view.getState(model.getTerminal(self.state.cell,
        !self.isSource)), !self.isSource)
    let otherCell = (other !== null) ? other.cell : null
    let source = (self.isSource) ? state.cell : otherCell
    let target = (self.isSource) ? otherCell : state.cell

    // Updates the error message of the handler
    self.error = self.validateConnection(source, target)

    return self.error === null
  }

  return marker
}

/**
 * Function: validateConnection
 *
 * Returns the error message or an empty string if the connection for the
 * given source, target pair is not valid. Otherwise it returns null. This
 * implementation uses <mxGraph.getEdgeValidationError>.
 *
 * Parameters:
 *
 * source - <mxCell> that represents the source terminal.
 * target - <mxCell> that represents the target terminal.
 */
MxEdgeHandler.prototype.validateConnection = function(source, target) {
  return this.graph.getEdgeValidationError(this.state.cell, source, target)
}

/**
 * Function: createBends
 *
 * Creates and returns the bends used for modifying the edge. This is
 * typically an array of <mxRectangleShapes>.
 */
MxEdgeHandler.prototype.createBends = function() {
  let cell = this.state.cell
  let bends = []

  for (let i = 0; i < this.abspoints.length; i++) {
    if (this.isHandleVisible(i)) {
      let source = i === 0
      let target = i === this.abspoints.length - 1
      let terminal = source || target

      if (terminal || this.graph.isCellBendable(cell)) {
        (MxUtils.bind(this, function(index) {
          let bend = this.createHandleShape(index)
          this.initBend(bend, MxUtils.bind(this, MxUtils.bind(this, function() {
            if (this.dblClickRemoveEnabled) {
              this.removePoint(this.state, index)
            }
          })))

          if (this.isHandleEnabled(i)) {
            bend.setCursor((terminal) ? MxConstants.CURSOR_TERMINAL_HANDLE : MxConstants.CURSOR_BEND_HANDLE)
          }

          bends.push(bend)

          if (!terminal) {
            this.points.push(new MxPoint(0, 0))
            bend.node.style.visibility = 'hidden'
          }
        }))(i)
      }
    }
  }

  return bends
}

/**
 * Function: createVirtualBends
 *
 * Creates and returns the bends used for modifying the edge. This is
 * typically an array of <mxRectangleShapes>.
 */
MxEdgeHandler.prototype.createVirtualBends = function() {
  let cell = this.state.cell
  // let last = this.abspoints[0]
  let bends = []

  if (this.graph.isCellBendable(cell)) {
    for (let i = 1; i < this.abspoints.length; i++) {
      (MxUtils.bind(this, function(bend) {
        this.initBend(bend)
        bend.setCursor(MxConstants.CURSOR_VIRTUAL_BEND_HANDLE)
        bends.push(bend)
      }))(this.createHandleShape())
    }
  }

  return bends
}

/**
 * Function: isHandleEnabled
 *
 * Creates the shape used to display the given bend.
 */
MxEdgeHandler.prototype.isHandleEnabled = function(index) {
  return true
}

/**
 * Function: isHandleVisible
 *
 * Returns true if the handle at the given index is visible.
 */
MxEdgeHandler.prototype.isHandleVisible = function(index) {
  let source = this.state.getVisibleTerminalState(true)
  let target = this.state.getVisibleTerminalState(false)
  let geo = this.graph.getCellGeometry(this.state.cell)
  let edgeStyle = (geo !== null) ? this.graph.view.getEdgeStyle(this.state, geo.points, source, target) : null

  return edgeStyle !== MxEdgeStyle.EntityRelation || index === 0 || index === this.abspoints.length - 1
}

/**
 * Function: createHandleShape
 *
 * Creates the shape used to display the given bend. Note that the index may be
 * null for special cases, such as when called from
 * <mxElbowEdgeHandler.createVirtualBend>. Only images and rectangles should be
 * returned if support for HTML labels with not foreign objects is required.
 * Index if null for virtual handles.
 */
MxEdgeHandler.prototype.createHandleShape = function(index) {
  if (this.handleImage !== null) {
    let shape = new MxImageShape(new MxRectangle(0, 0, this.handleImage.width, this.handleImage.height), this.handleImage.src)

    // Allows HTML rendering of the images
    shape.preserveImageAspect = false

    return shape
  } else {
    let s = MxConstants.HANDLE_SIZE

    if (this.preferHtml) {
      s -= 1
    }

    return new MxRectangleShape(new MxRectangle(0, 0, s, s), MxConstants.HANDLE_FILLCOLOR, MxConstants.HANDLE_STROKECOLOR)
  }
}

/**
 * Function: createLabelHandleShape
 *
 * Creates the shape used to display the the label handle.
 */
MxEdgeHandler.prototype.createLabelHandleShape = function() {
  if (this.labelHandleImage !== null) {
    let shape = new MxImageShape(new MxRectangle(0, 0, this.labelHandleImage.width, this.labelHandleImage.height), this.labelHandleImage.src)

    // Allows HTML rendering of the images
    shape.preserveImageAspect = false

    return shape
  } else {
    let s = MxConstants.LABEL_HANDLE_SIZE
    return new MxRectangleShape(new MxRectangle(0, 0, s, s), MxConstants.LABEL_HANDLE_FILLCOLOR, MxConstants.HANDLE_STROKECOLOR)
  }
}

/**
 * Function: initBend
 *
 * Helper method to initialize the given bend.
 *
 * Parameters:
 *
 * bend - <mxShape> that represents the bend to be initialized.
 */
MxEdgeHandler.prototype.initBend = function(bend, dblClick) {
  if (this.preferHtml) {
    bend.dialect = MxConstants.DIALECT_STRICTHTML
    bend.init(this.graph.container)
  } else {
    bend.dialect = (this.graph.dialect !== MxConstants.DIALECT_SVG)
      ? MxConstants.DIALECT_MIXEDHTML : MxConstants.DIALECT_SVG
    bend.init(this.graph.getView().getOverlayPane())
  }

  MxEvent.redirectMouseEvents(bend.node, this.graph, this.state,
    null, null, null, dblClick)

  // Fixes lost event tracking for images in quirks / IE8 standards
  if (MxClient.IS_QUIRKS || document.documentMode === 8) {
    MxEvent.addListener(bend.node, 'dragstart', function(evt) {
      MxEvent.consume(evt)

      return false
    })
  }

  if (MxClient.IS_TOUCH) {
    bend.node.setAttribute('pointer-events', 'none')
  }
}

/**
 * Function: getHandleForEvent
 *
 * Returns the index of the handle for the given event.
 */
MxEdgeHandler.prototype.getHandleForEvent = function(me) {
  // Connection highlight may consume events before they reach sizer handle
  let tol = (!MxEvent.isMouseEvent(me.getEvent())) ? this.tolerance : 1
  let hit = (this.allowHandleBoundsCheck && (MxClient.IS_IE || tol > 0))
    ? new MxRectangle(me.getGraphX() - tol, me.getGraphY() - tol, 2 * tol, 2 * tol) : null
  let minDistSq = null
  let result = null

  function checkShape(shape) {
    if (shape !== null && shape.node.style.display !== 'none' && shape.node.style.visibility !== 'hidden' && (me.isSource(shape) || (hit !== null && MxUtils.intersects(shape.bounds, hit)))) {
      let dx = me.getGraphX() - shape.bounds.getCenterX()
      let dy = me.getGraphY() - shape.bounds.getCenterY()
      let tmp = dx * dx + dy * dy

      if (minDistSq === null || tmp <= minDistSq) {
        minDistSq = tmp

        return true
      }
    }

    return false
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

  if (me.isSource(this.state.text) || checkShape(this.labelShape)) {
    result = MxEvent.LABEL_HANDLE
  }

  if (this.bends !== null) {
    for (let i = 0; i < this.bends.length; i++) {
      if (checkShape(this.bends[i])) {
        result = i
      }
    }
  }

  if (this.virtualBends !== null && this.isAddVirtualBendEvent(me)) {
    for (let i = 0; i < this.virtualBends.length; i++) {
      if (checkShape(this.virtualBends[i])) {
        result = MxEvent.VIRTUAL_HANDLE - i
      }
    }
  }

  return result
}

/**
 * Function: isAddVirtualBendEvent
 *
 * Returns true if the given event allows virtual bends to be added. This
 * implementation returns true.
 */
MxEdgeHandler.prototype.isAddVirtualBendEvent = function(me) {
  return true
}

/**
 * Function: isCustomHandleEvent
 *
 * Returns true if the given event allows custom handles to be changed. This
 * implementation returns true.
 */
MxEdgeHandler.prototype.isCustomHandleEvent = function(me) {
  return true
}

/**
 * Function: mouseDown
 *
 * Handles the event by checking if a special element of the handler
 * was clicked, in which case the index parameter is non-null. The
 * indices may be one of <LABEL_HANDLE> or the number of the respective
 * control point. The source and target points are used for reconnecting
 * the edge.
 */
MxEdgeHandler.prototype.mouseDown = function(sender, me) {
  let handle = this.getHandleForEvent(me)

  if (this.bends !== null && this.bends[handle] !== null) {
    let b = this.bends[handle].bounds
    this.snapPoint = new MxPoint(b.getCenterX(), b.getCenterY())
  }

  if (this.addEnabled && handle === null && this.isAddPointEvent(me.getEvent())) {
    this.addPoint(this.state, me.getEvent())
    me.consume()
  } else if (handle !== null && !me.isConsumed() && this.graph.isEnabled()) {
    if (this.removeEnabled && this.isRemovePointEvent(me.getEvent())) {
      this.removePoint(this.state, handle)
    } else if (handle !== MxEvent.LABEL_HANDLE || this.graph.isLabelMovable(me.getCell())) {
      if (handle <= MxEvent.VIRTUAL_HANDLE) {
        MxUtils.setOpacity(this.virtualBends[MxEvent.VIRTUAL_HANDLE - handle].node, 100)
      }

      this.start(me.getX(), me.getY(), handle)
    }

    me.consume()
  }
}

/**
 * Function: start
 *
 * Starts the handling of the mouse gesture.
 */
MxEdgeHandler.prototype.start = function(x, y, index) {
  this.startX = x
  this.startY = y

  this.isSource = (this.bends === null) ? false : index === 0
  this.isTarget = (this.bends === null) ? false : index === this.bends.length - 1
  this.isLabel = index === MxEvent.LABEL_HANDLE

  if (this.isSource || this.isTarget) {
    let cell = this.state.cell
    let terminal = this.graph.model.getTerminal(cell, this.isSource)

    if ((terminal === null && this.graph.isTerminalPointMovable(cell, this.isSource)) || (terminal !== null && this.graph.isCellDisconnectable(cell, terminal, this.isSource))) {
      this.index = index
    }
  } else {
    this.index = index
  }

  // Hides other custom handles
  if (this.index <= MxEvent.CUSTOM_HANDLE && this.index > MxEvent.VIRTUAL_HANDLE) {
    if (this.customHandles !== null) {
      for (let i = 0; i < this.customHandles.length; i++) {
        if (i !== MxEvent.CUSTOM_HANDLE - this.index) {
          this.customHandles[i].setVisible(false)
        }
      }
    }
  }
}

/**
 * Function: clonePreviewState
 *
 * Returns a clone of the current preview state for the given point and terminal.
 */
MxEdgeHandler.prototype.clonePreviewState = function(point, terminal) {
  return this.state.clone()
}

/**
 * Function: getSnapToTerminalTolerance
 *
 * Returns the tolerance for the guides. Default value is
 * gridSize * scale / 2.
 */
MxEdgeHandler.prototype.getSnapToTerminalTolerance = function() {
  return this.graph.gridSize * this.graph.view.scale / 2
}

/**
 * Function: updateHint
 *
 * Hook for subclassers do show details while the handler is active.
 */
MxEdgeHandler.prototype.updateHint = function(me, point) { }

/**
 * Function: removeHint
 *
 * Hooks for subclassers to hide details when the handler gets inactive.
 */
MxEdgeHandler.prototype.removeHint = function() { }

/**
 * Function: roundLength
 *
 * Hook for rounding the unscaled width or height. This uses Math.round.
 */
MxEdgeHandler.prototype.roundLength = function(length) {
  return Math.round(length)
}

/**
 * Function: isSnapToTerminalsEvent
 *
 * Returns true if <snapToTerminals> is true and if alt is not pressed.
 */
MxEdgeHandler.prototype.isSnapToTerminalsEvent = function(me) {
  return this.snapToTerminals && !MxEvent.isAltDown(me.getEvent())
}

/**
 * Function: getPointForEvent
 *
 * Returns the point for the given event.
 */
MxEdgeHandler.prototype.getPointForEvent = function(me) {
  let view = this.graph.getView()
  let scale = view.scale
  let point = new MxPoint(this.roundLength(me.getGraphX() / scale) * scale,
    this.roundLength(me.getGraphY() / scale) * scale)

  let tt = this.getSnapToTerminalTolerance()
  let overrideX = false
  let overrideY = false

  function snapToPoint(pt) {
    if (pt !== null) {
      let x = pt.x

      if (Math.abs(point.x - x) < tt) {
        point.x = x
        overrideX = true
      }

      let y = pt.y

      if (Math.abs(point.y - y) < tt) {
        point.y = y
        overrideY = true
      }
    }
  }
  function snapToTerminal(terminal) {
    if (terminal !== null) {
      snapToPoint.call(this, new MxPoint(view.getRoutingCenterX(terminal),
        view.getRoutingCenterY(terminal)))
    }
  }
  if (tt > 0 && this.isSnapToTerminalsEvent(me)) {
    // Temporary function
    snapToTerminal.call(this, this.state.getVisibleTerminalState(true))
    snapToTerminal.call(this, this.state.getVisibleTerminalState(false))

    if (this.state.absolutePoints !== null) {
      for (let i = 0; i < this.state.absolutePoints.length; i++) {
        snapToPoint.call(this, this.state.absolutePoints[i])
      }
    }
  }

  if (this.graph.isGridEnabledEvent(me.getEvent())) {
    let tr = view.translate

    if (!overrideX) {
      point.x = (this.graph.snap(point.x / scale - tr.x) + tr.x) * scale
    }

    if (!overrideY) {
      point.y = (this.graph.snap(point.y / scale - tr.y) + tr.y) * scale
    }
  }

  return point
}

/**
 * Function: getPreviewTerminalState
 *
 * Updates the given preview state taking into account the state of the constraint handler.
 */
MxEdgeHandler.prototype.getPreviewTerminalState = function(me) {
  this.constraintHandler.update(me, this.isSource, true, me.isSource(this.marker.highlight.shape) ? null : this.currentPoint)

  if (this.constraintHandler.currentFocus !== null && this.constraintHandler.currentConstraint !== null) {
    // Handles special case where grid is large and connection point is at actual point in which
    // case the outline is not followed as long as we're < gridSize / 2 away from that point
    if (this.marker.highlight !== null && this.marker.highlight.state !== null && this.marker.highlight.state.cell === this.constraintHandler.currentFocus.cell) {
      // Direct repaint needed if cell already highlighted
      if (this.marker.highlight.shape.stroke !== 'transparent') {
        this.marker.highlight.shape.stroke = 'transparent'
        this.marker.highlight.repaint()
      }
    } else {
      this.marker.markCell(this.constraintHandler.currentFocus.cell, 'transparent')
    }

    let model = this.graph.getModel()
    let other = this.graph.view.getTerminalPort(this.state,
      this.graph.view.getState(model.getTerminal(this.state.cell,
        !this.isSource)), !this.isSource)
    let otherCell = (other !== null) ? other.cell : null
    let source = (this.isSource) ? this.constraintHandler.currentFocus.cell : otherCell
    let target = (this.isSource) ? otherCell : this.constraintHandler.currentFocus.cell

    // Updates the error message of the handler
    this.error = this.validateConnection(source, target)
    let result = null

    if (this.error === null) {
      result = this.constraintHandler.currentFocus
    } else {
      this.constraintHandler.reset()
    }

    return result
  } else if (!this.graph.isIgnoreTerminalEvent(me.getEvent())) {
    this.marker.process(me)

    return this.marker.getValidState()
  } else {
    this.marker.reset()

    return null
  }
}

/**
 * Function: getPreviewPoints
 *
 * Updates the given preview state taking into account the state of the constraint handler.
 *
 * Parameters:
 *
 * pt - <MxPoint> that contains the current pointer position.
 * me - Optional <mxMouseEvent> that contains the current event.
 */
MxEdgeHandler.prototype.getPreviewPoints = function(pt, me) {
  let geometry = this.graph.getCellGeometry(this.state.cell)
  let points = (geometry.points !== null) ? geometry.points.slice() : null
  let point = new MxPoint(pt.x, pt.y)
  let result = null

  if (!this.isSource && !this.isTarget) {
    this.convertPoint(point, false)

    if (points === null) {
      points = [point]
    } else {
      // Adds point from virtual bend
      if (this.index <= MxEvent.VIRTUAL_HANDLE) {
        points.splice(MxEvent.VIRTUAL_HANDLE - this.index, 0, point)
      }

      // Removes point if dragged on terminal point
      if (!this.isSource && !this.isTarget) {
        for (let i = 0; i < this.bends.length; i++) {
          if (i !== this.index) {
            let bend = this.bends[i]

            if (bend !== null && MxUtils.contains(bend.bounds, pt.x, pt.y)) {
              if (this.index <= MxEvent.VIRTUAL_HANDLE) {
                points.splice(MxEvent.VIRTUAL_HANDLE - this.index, 1)
              } else {
                points.splice(this.index - 1, 1)
              }

              result = points
            }
          }
        }

        // Removes point if user tries to straighten a segment
        if (result === null && this.straightRemoveEnabled && (me === null || !MxEvent.isAltDown(me.getEvent()))) {
          let tol = this.graph.tolerance * this.graph.tolerance
          let abs = this.state.absolutePoints.slice()
          abs[this.index] = pt

          // Handes special case where removing waypoint affects tolerance (flickering)
          let src = this.state.getVisibleTerminalState(true)

          if (src !== null) {
            let c = this.graph.getConnectionConstraint(this.state, src, true)

            // Checks if point is not fixed
            if (c === null || this.graph.getConnectionPoint(src, c) === null) {
              abs[0] = new MxPoint(src.view.getRoutingCenterX(src), src.view.getRoutingCenterY(src))
            }
          }

          let trg = this.state.getVisibleTerminalState(false)

          if (trg !== null) {
            let c = this.graph.getConnectionConstraint(this.state, trg, false)

            // Checks if point is not fixed
            if (c === null || this.graph.getConnectionPoint(trg, c) === null) {
              abs[abs.length - 1] = new MxPoint(trg.view.getRoutingCenterX(trg), trg.view.getRoutingCenterY(trg))
            }
          }

          // 错误不明 Move function declaration to function body root. (no-inner-declarations）
          function checkRemove(idx, tmp) {
            if (idx > 0 && idx < abs.length - 1 && MxUtils.ptSegDistSq(abs[idx - 1].x, abs[idx - 1].y, abs[idx + 1].x, abs[idx + 1].y, tmp.x, tmp.y) < tol) {
              points.splice(idx - 1, 1)
              result = points
            }
          };

          // LATER: Check if other points can be removed if a segment is made straight
          checkRemove(this.index, pt)
        }
      }

      // Updates existing point
      if (result === null && this.index > MxEvent.VIRTUAL_HANDLE) {
        points[this.index - 1] = point
      }
    }
  } else if (this.graph.resetEdgesOnConnect) {
    points = null
  }

  return (result !== null) ? result : points
}

/**
 * Function: isOutlineConnectEvent
 *
 * Returns true if <outlineConnect> is true and the source of the event is the outline shape
 * or shift is pressed.
 */
MxEdgeHandler.prototype.isOutlineConnectEvent = function(me) {
  let offset = MxUtils.getOffset(this.graph.container)
  let evt = me.getEvent()

  let clientX = MxEvent.getClientX(evt)
  let clientY = MxEvent.getClientY(evt)

  let doc = document.documentElement
  let left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
  let top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)

  let gridX = this.currentPoint.x - this.graph.container.scrollLeft + offset.x - left
  let gridY = this.currentPoint.y - this.graph.container.scrollTop + offset.y - top

  return this.outlineConnect && !MxEvent.isShiftDown(me.getEvent()) && (me.isSource(this.marker.highlight.shape) || (MxEvent.isAltDown(me.getEvent()) && me.getState() !== null) || this.marker.highlight.isHighlightAt(clientX, clientY) || ((gridX !== clientX || gridY !== clientY) && me.getState() === null && this.marker.highlight.isHighlightAt(gridX, gridY)))
}

/**
 * Function: updatePreviewState
 *
 * Updates the given preview state taking into account the state of the constraint handler.
 */
MxEdgeHandler.prototype.updatePreviewState = function(edge, point, terminalState, me, outline) {
  // Computes the points for the edge style and terminals
  let sourceState = (this.isSource) ? terminalState : this.state.getVisibleTerminalState(true)
  let targetState = (this.isTarget) ? terminalState : this.state.getVisibleTerminalState(false)

  let sourceConstraint = this.graph.getConnectionConstraint(edge, sourceState, true)
  let targetConstraint = this.graph.getConnectionConstraint(edge, targetState, false)

  let constraint = this.constraintHandler.currentConstraint

  if (constraint === null && outline) {
    if (terminalState !== null) {
      // Handles special case where mouse is on outline away from actual end point
      // in which case the grid is ignored and mouse point is used instead
      if (me.isSource(this.marker.highlight.shape)) {
        point = new MxPoint(me.getGraphX(), me.getGraphY())
      }

      constraint = this.graph.getOutlineConstraint(point, terminalState, me)
      this.constraintHandler.setFocus(me, terminalState, this.isSource)
      this.constraintHandler.currentConstraint = constraint
      this.constraintHandler.currentPoint = point
    } else {
      constraint = new MxConnectionConstraint()
    }
  }

  if (this.outlineConnect && this.marker.highlight !== null && this.marker.highlight.shape !== null) {
    let s = this.graph.view.scale

    if (this.constraintHandler.currentConstraint !== null && this.constraintHandler.currentFocus !== null) {
      this.marker.highlight.shape.stroke = (outline) ? MxConstants.OUTLINE_HIGHLIGHT_COLOR : 'transparent'
      this.marker.highlight.shape.strokewidth = MxConstants.OUTLINE_HIGHLIGHT_STROKEWIDTH / s / s
      this.marker.highlight.repaint()
    } else if (this.marker.hasValidState()) {
      this.marker.highlight.shape.stroke = (this.marker.getValidState() === me.getState())
        ? MxConstants.DEFAULT_VALID_COLOR : 'transparent'
      this.marker.highlight.shape.strokewidth = MxConstants.HIGHLIGHT_STROKEWIDTH / s / s
      this.marker.highlight.repaint()
    }
  }

  if (this.isSource) {
    sourceConstraint = constraint
  } else if (this.isTarget) {
    targetConstraint = constraint
  }

  if (this.isSource || this.isTarget) {
    if (constraint !== null && constraint.point !== null) {
      edge.style[(this.isSource) ? MxConstants.STYLE_EXIT_X : MxConstants.STYLE_ENTRY_X] = constraint.point.x
      edge.style[(this.isSource) ? MxConstants.STYLE_EXIT_Y : MxConstants.STYLE_ENTRY_Y] = constraint.point.y
    } else {
      delete edge.style[(this.isSource) ? MxConstants.STYLE_EXIT_X : MxConstants.STYLE_ENTRY_X]
      delete edge.style[(this.isSource) ? MxConstants.STYLE_EXIT_Y : MxConstants.STYLE_ENTRY_Y]
    }
  }

  edge.setVisibleTerminalState(sourceState, true)
  edge.setVisibleTerminalState(targetState, false)

  if (!this.isSource || sourceState !== null) {
    edge.view.updateFixedTerminalPoint(edge, sourceState, true, sourceConstraint)
  }

  if (!this.isTarget || targetState !== null) {
    edge.view.updateFixedTerminalPoint(edge, targetState, false, targetConstraint)
  }

  if ((this.isSource || this.isTarget) && terminalState === null) {
    edge.setAbsoluteTerminalPoint(point, this.isSource)

    if (this.marker.getMarkedState() === null) {
      this.error = (this.graph.allowDanglingEdges) ? null : ''
    }
  }

  edge.view.updatePoints(edge, this.points, sourceState, targetState)
  edge.view.updateFloatingTerminalPoints(edge, sourceState, targetState)
}

/**
 * Function: mouseMove
 *
 * Handles the event by updating the preview.
 */
MxEdgeHandler.prototype.mouseMove = function(sender, me) {
  if (this.index !== null && this.marker !== null) {
    this.currentPoint = this.getPointForEvent(me)
    this.error = null

    // Uses the current point from the constraint handler if available
    if (!this.graph.isIgnoreTerminalEvent(me.getEvent()) && MxEvent.isShiftDown(me.getEvent()) && this.snapPoint !== null) {
      if (Math.abs(this.snapPoint.x - this.currentPoint.x) < Math.abs(this.snapPoint.y - this.currentPoint.y)) {
        this.currentPoint.x = this.snapPoint.x
      } else {
        this.currentPoint.y = this.snapPoint.y
      }
    }

    if (this.index <= MxEvent.CUSTOM_HANDLE && this.index > MxEvent.VIRTUAL_HANDLE) {
      if (this.customHandles !== null) {
        this.customHandles[MxEvent.CUSTOM_HANDLE - this.index].processEvent(me)
      }
    } else if (this.isLabel) {
      this.label.x = this.currentPoint.x
      this.label.y = this.currentPoint.y
    } else {
      this.points = this.getPreviewPoints(this.currentPoint, me)
      let terminalState = (this.isSource || this.isTarget) ? this.getPreviewTerminalState(me) : null

      if (this.constraintHandler.currentConstraint !== null && this.constraintHandler.currentFocus !== null && this.constraintHandler.currentPoint !== null) {
        this.currentPoint = this.constraintHandler.currentPoint.clone()
      } else if (this.outlineConnect) {
        // Need to check outline before cloning terminal state
        let outline = (this.isSource || this.isTarget) ? this.isOutlineConnectEvent(me) : false

        if (outline) {
          terminalState = this.marker.highlight.state
        } else if (terminalState !== null && terminalState !== me.getState() && this.marker.highlight.shape !== null) {
          this.marker.highlight.shape.stroke = 'transparent'
          this.marker.highlight.repaint()
          terminalState = null
        }
      }

      let clone = this.clonePreviewState(this.currentPoint, (terminalState !== null) ? terminalState.cell : null)
      this.updatePreviewState(clone, this.currentPoint, terminalState, me) // , outline

      // Sets the color of the preview to valid or invalid, updates the
      // points of the preview and redraws
      let color = (this.error === null) ? this.marker.validColor : this.marker.invalidColor
      this.setPreviewColor(color)
      this.abspoints = clone.absolutePoints
      this.active = true
    }

    // This should go before calling isOutlineConnectEvent above. As a workaround
    // we add an offset of gridSize to the hint to avoid problem with hit detection
    // in highlight.isHighlightAt (which uses comonentFromPoint)
    this.updateHint(me, this.currentPoint)
    this.drawPreview()
    MxEvent.consume(me.getEvent())
    me.consume()
  } else if (MxClient.IS_IE && this.getHandleForEvent(me) !== null) {
    // Workaround for disabling the connect highlight when over handle
    me.consume(false)
  }
}

/**
 * Function: mouseUp
 *
 * Handles the event to applying the previewed changes on the edge by
 * using <moveLabel>, <connect> or <changePoints>.
 */
MxEdgeHandler.prototype.mouseUp = function(sender, me) {
  // Workaround for wrong event source in Webkit
  if (this.index !== null && this.marker !== null) {
    let edge = this.state.cell

    // Ignores event if mouse has not been moved
    if (me.getX() !== this.startX || me.getY() !== this.startY) {
      let clone = !this.graph.isIgnoreTerminalEvent(me.getEvent()) && this.graph.isCloneEvent(me.getEvent()) && this.cloneEnabled && this.graph.isCellsCloneable()

      // Displays the reason for not carriying out the change
      // if there is an error message with non-zero length
      if (this.error !== null) {
        if (this.error.length > 0) {
          this.graph.validationAlert(this.error)
        }
      } else if (this.index <= MxEvent.CUSTOM_HANDLE && this.index > MxEvent.VIRTUAL_HANDLE) {
        if (this.customHandles !== null) {
          let model = this.graph.getModel()

          model.beginUpdate()
          try {
            this.customHandles[MxEvent.CUSTOM_HANDLE - this.index].execute()
          } finally {
            model.endUpdate()
          }
        }
      } else if (this.isLabel) {
        this.moveLabel(this.state, this.label.x, this.label.y)
      } else if (this.isSource || this.isTarget) {
        let terminal = null

        if (this.constraintHandler.currentConstraint !== null && this.constraintHandler.currentFocus !== null) {
          terminal = this.constraintHandler.currentFocus.cell
        }

        if (terminal === null && this.marker.hasValidState() && this.marker.highlight !== null && this.marker.highlight.shape !== null && this.marker.highlight.shape.stroke !== 'transparent' && this.marker.highlight.shape.stroke !== 'white') {
          terminal = this.marker.validState.cell
        }

        if (terminal !== null) {
          let model = this.graph.getModel()
          let parent = model.getParent(edge)

          model.beginUpdate()
          try {
            // Clones and adds the cell
            if (clone) {
              let geo = model.getGeometry(edge)
              let clone = this.graph.cloneCells([edge])[0]
              model.add(parent, clone, model.getChildCount(parent))

              if (geo !== null) {
                geo = geo.clone()
                model.setGeometry(clone, geo)
              }

              let other = model.getTerminal(edge, !this.isSource)
              this.graph.connectCell(clone, other, !this.isSource)

              edge = clone
            }

            edge = this.connect(edge, terminal, this.isSource, clone, me)
          } finally {
            model.endUpdate()
          }
        } else if (this.graph.isAllowDanglingEdges()) {
          let pt = this.abspoints[(this.isSource) ? 0 : this.abspoints.length - 1]
          pt.x = this.roundLength(pt.x / this.graph.view.scale - this.graph.view.translate.x)
          pt.y = this.roundLength(pt.y / this.graph.view.scale - this.graph.view.translate.y)

          let pstate = this.graph.getView().getState(
            this.graph.getModel().getParent(edge))

          if (pstate !== null) {
            pt.x -= pstate.origin.x
            pt.y -= pstate.origin.y
          }

          pt.x -= this.graph.panDx / this.graph.view.scale
          pt.y -= this.graph.panDy / this.graph.view.scale

          // Destroys and recreates this handler
          edge = this.changeTerminalPoint(edge, pt, this.isSource, clone)
        }
      } else if (this.active) {
        edge = this.changePoints(edge, this.points, clone)
      } else {
        this.graph.getView().invalidate(this.state.cell)
        this.graph.getView().validate(this.state.cell)
      }
    }

    // Resets the preview color the state of the handler if this
    // handler has not been recreated
    if (this.marker !== null) {
      this.reset()

      // Updates the selection if the edge has been cloned
      if (edge !== this.state.cell) {
        this.graph.setSelectionCell(edge)
      }
    }

    me.consume()
  }
}

/**
 * Function: reset
 *
 * Resets the state of this handler.
 */
MxEdgeHandler.prototype.reset = function() {
  if (this.active) {
    this.refresh()
  }

  this.error = null
  this.index = null
  this.label = null
  this.points = null
  this.snapPoint = null
  this.isLabel = false
  this.isSource = false
  this.isTarget = false
  this.active = false

  if (this.livePreview && this.sizers !== null) {
    for (let i = 0; i < this.sizers.length; i++) {
      if (this.sizers[i] !== null) {
        this.sizers[i].node.style.display = ''
      }
    }
  }

  if (this.marker !== null) {
    this.marker.reset()
  }

  if (this.constraintHandler !== null) {
    this.constraintHandler.reset()
  }

  if (this.customHandles !== null) {
    for (let i = 0; i < this.customHandles.length; i++) {
      this.customHandles[i].reset()
    }
  }

  this.setPreviewColor(MxConstants.EDGE_SELECTION_COLOR)
  this.removeHint()
  this.redraw()
}

/**
 * Function: setPreviewColor
 *
 * Sets the color of the preview to the given value.
 */
MxEdgeHandler.prototype.setPreviewColor = function(color) {
  if (this.shape !== null) {
    this.shape.stroke = color
  }
}

/**
 * Function: convertPoint
 *
 * Converts the given point in-place from screen to unscaled, untranslated
 * graph coordinates and applies the grid. Returns the given, modified
 * point instance.
 *
 * Parameters:
 *
 * point - <MxPoint> to be converted.
 * gridEnabled - Boolean that specifies if the grid should be applied.
 */
MxEdgeHandler.prototype.convertPoint = function(point, gridEnabled) {
  let scale = this.graph.getView().getScale()
  let tr = this.graph.getView().getTranslate()

  if (gridEnabled) {
    point.x = this.graph.snap(point.x)
    point.y = this.graph.snap(point.y)
  }

  point.x = Math.round(point.x / scale - tr.x)
  point.y = Math.round(point.y / scale - tr.y)

  let pstate = this.graph.getView().getState(
    this.graph.getModel().getParent(this.state.cell))

  if (pstate !== null) {
    point.x -= pstate.origin.x
    point.y -= pstate.origin.y
  }

  return point
}

/**
 * Function: moveLabel
 *
 * Changes the coordinates for the label of the given edge.
 *
 * Parameters:
 *
 * edge - <mxCell> that represents the edge.
 * x - Integer that specifies the x-coordinate of the new location.
 * y - Integer that specifies the y-coordinate of the new location.
 */
MxEdgeHandler.prototype.moveLabel = function(edgeState, x, y) {
  let model = this.graph.getModel()
  let geometry = model.getGeometry(edgeState.cell)

  if (geometry !== null) {
    let scale = this.graph.getView().scale
    geometry = geometry.clone()

    if (geometry.relative) {
      // Resets the relative location stored inside the geometry
      let pt = this.graph.getView().getRelativePoint(edgeState, x, y)
      geometry.x = Math.round(pt.x * 10000) / 10000
      geometry.y = Math.round(pt.y)

      // Resets the offset inside the geometry to find the offset
      // from the resulting point
      geometry.offset = new MxPoint(0, 0)
      pt = this.graph.view.getPoint(edgeState, geometry)
      geometry.offset = new MxPoint(Math.round((x - pt.x) / scale), Math.round((y - pt.y) / scale))
    } else {
      let points = edgeState.absolutePoints
      let p0 = points[0]
      let pe = points[points.length - 1]

      if (p0 !== null && pe !== null) {
        let cx = p0.x + (pe.x - p0.x) / 2
        let cy = p0.y + (pe.y - p0.y) / 2

        geometry.offset = new MxPoint(Math.round((x - cx) / scale), Math.round((y - cy) / scale))
        geometry.x = 0
        geometry.y = 0
      }
    }

    model.setGeometry(edgeState.cell, geometry)
  }
}

/**
 * Function: connect
 *
 * Changes the terminal or terminal point of the given edge in the graph
 * model.
 *
 * Parameters:
 *
 * edge - <mxCell> that represents the edge to be reconnected.
 * terminal - <mxCell> that represents the new terminal.
 * isSource - Boolean indicating if the new terminal is the source or
 * target terminal.
 * isClone - Boolean indicating if the new connection should be a clone of
 * the old edge.
 * me - <mxMouseEvent> that contains the mouse up event.
 */
MxEdgeHandler.prototype.connect = function(edge, terminal, isSource, isClone, me) {
  let model = this.graph.getModel()
  // let parent = model.getParent(edge)

  model.beginUpdate()
  try {
    let constraint = this.constraintHandler.currentConstraint

    if (constraint === null) {
      constraint = new MxConnectionConstraint()
    }

    this.graph.connectCell(edge, terminal, isSource, constraint)
  } finally {
    model.endUpdate()
  }

  return edge
}

/**
 * Function: changeTerminalPoint
 *
 * Changes the terminal point of the given edge.
 */
MxEdgeHandler.prototype.changeTerminalPoint = function(edge, point, isSource, clone) {
  let model = this.graph.getModel()

  model.beginUpdate()
  try {
    if (clone) {
      let parent = model.getParent(edge)
      let terminal = model.getTerminal(edge, !isSource)
      edge = this.graph.cloneCells([edge])[0]
      model.add(parent, edge, model.getChildCount(parent))
      model.setTerminal(edge, terminal, !isSource)
    }

    let geo = model.getGeometry(edge)

    if (geo !== null) {
      geo = geo.clone()
      geo.setTerminalPoint(point, isSource)
      model.setGeometry(edge, geo)
      this.graph.connectCell(edge, null, isSource, new MxConnectionConstraint())
    }
  } finally {
    model.endUpdate()
  }

  return edge
}

/**
 * Function: changePoints
 *
 * Changes the control points of the given edge in the graph model.
 */
MxEdgeHandler.prototype.changePoints = function(edge, points, clone) {
  let model = this.graph.getModel()
  model.beginUpdate()
  try {
    if (clone) {
      let parent = model.getParent(edge)
      let source = model.getTerminal(edge, true)
      let target = model.getTerminal(edge, false)
      edge = this.graph.cloneCells([edge])[0]
      model.add(parent, edge, model.getChildCount(parent))
      model.setTerminal(edge, source, true)
      model.setTerminal(edge, target, false)
    }

    let geo = model.getGeometry(edge)

    if (geo !== null) {
      geo = geo.clone()
      geo.points = points

      model.setGeometry(edge, geo)
    }
  } finally {
    model.endUpdate()
  }

  return edge
}

/**
 * Function: addPoint
 *
 * Adds a control point for the given state and event.
 */
MxEdgeHandler.prototype.addPoint = function(state, evt) {
  let pt = MxUtils.convertPoint(this.graph.container, MxEvent.getClientX(evt),
    MxEvent.getClientY(evt))
  let gridEnabled = this.graph.isGridEnabledEvent(evt)
  this.convertPoint(pt, gridEnabled)
  this.addPointAt(state, pt.x, pt.y)
  MxEvent.consume(evt)
}

/**
 * Function: addPointAt
 *
 * Adds a control point at the given point.
 */
MxEdgeHandler.prototype.addPointAt = function(state, x, y) {
  let geo = this.graph.getCellGeometry(state.cell)
  let pt = new MxPoint(x, y)

  if (geo !== null) {
    geo = geo.clone()
    let t = this.graph.view.translate
    let s = this.graph.view.scale
    let offset = new MxPoint(t.x * s, t.y * s)

    let parent = this.graph.model.getParent(this.state.cell)

    if (this.graph.model.isVertex(parent)) {
      let pState = this.graph.view.getState(parent)
      offset = new MxPoint(pState.x, pState.y)
    }

    let index = MxUtils.findNearestSegment(state, pt.x * s + offset.x, pt.y * s + offset.y)

    if (geo.points === null) {
      geo.points = [pt]
    } else {
      geo.points.splice(index, 0, pt)
    }

    this.graph.getModel().setGeometry(state.cell, geo)
    this.refresh()
    this.redraw()
  }
}

/**
 * Function: removePoint
 *
 * Removes the control point at the given index from the given state.
 */
MxEdgeHandler.prototype.removePoint = function(state, index) {
  if (index > 0 && index < this.abspoints.length - 1) {
    let geo = this.graph.getCellGeometry(this.state.cell)

    if (geo !== null && geo.points !== null) {
      geo = geo.clone()
      geo.points.splice(index - 1, 1)
      this.graph.getModel().setGeometry(state.cell, geo)
      this.refresh()
      this.redraw()
    }
  }
}

/**
 * Function: getHandleFillColor
 *
 * Returns the fillcolor for the handle at the given index.
 */
MxEdgeHandler.prototype.getHandleFillColor = function(index) {
  let isSource = index === 0
  let cell = this.state.cell
  let terminal = this.graph.getModel().getTerminal(cell, isSource)
  let color = MxConstants.HANDLE_FILLCOLOR

  if ((terminal !== null && !this.graph.isCellDisconnectable(cell, terminal, isSource)) || (terminal === null && !this.graph.isTerminalPointMovable(cell, isSource))) {
    color = MxConstants.LOCKED_HANDLE_FILLCOLOR
  } else if (terminal !== null && this.graph.isCellDisconnectable(cell, terminal, isSource)) {
    color = MxConstants.CONNECT_HANDLE_FILLCOLOR
  }

  return color
}

/**
 * Function: redraw
 *
 * Redraws the preview, and the bends- and label control points.
 */
MxEdgeHandler.prototype.redraw = function() {
  this.abspoints = this.state.absolutePoints.slice()
  this.redrawHandles()

  let g = this.graph.getModel().getGeometry(this.state.cell)
  let pts = g.points

  if (this.bends !== null && this.bends.length > 0) {
    if (pts !== null) {
      if (this.points === null) {
        this.points = []
      }

      for (let i = 1; i < this.bends.length - 1; i++) {
        if (this.bends[i] !== null && this.abspoints[i] !== null) {
          this.points[i - 1] = pts[i - 1]
        }
      }
    }
  }

  this.drawPreview()
}

/**
 * Function: redrawHandles
 *
 * Redraws the handles.
 */
MxEdgeHandler.prototype.redrawHandles = function() {
  let cell = this.state.cell

  // Updates the handle for the label position
  let b = this.labelShape.bounds
  this.label = new MxPoint(this.state.absoluteOffset.x, this.state.absoluteOffset.y)
  this.labelShape.bounds = new MxRectangle(Math.round(this.label.x - b.width / 2),
    Math.round(this.label.y - b.height / 2), b.width, b.height)

  // Shows or hides the label handle depending on the label
  let lab = this.graph.getLabel(cell)
  this.labelShape.visible = (lab !== null && lab.length > 0 && this.graph.isLabelMovable(cell))

  if (this.bends !== null && this.bends.length > 0) {
    let n = this.abspoints.length - 1

    let p0 = this.abspoints[0]
    let x0 = p0.x
    let y0 = p0.y

    b = this.bends[0].bounds
    this.bends[0].bounds = new MxRectangle(Math.floor(x0 - b.width / 2),
      Math.floor(y0 - b.height / 2), b.width, b.height)
    this.bends[0].fill = this.getHandleFillColor(0)
    this.bends[0].redraw()

    if (this.manageLabelHandle) {
      this.checkLabelHandle(this.bends[0].bounds)
    }

    let pe = this.abspoints[n]
    let xn = pe.x
    let yn = pe.y

    let bn = this.bends.length - 1
    b = this.bends[bn].bounds
    this.bends[bn].bounds = new MxRectangle(Math.floor(xn - b.width / 2),
      Math.floor(yn - b.height / 2), b.width, b.height)
    this.bends[bn].fill = this.getHandleFillColor(bn)
    this.bends[bn].redraw()

    if (this.manageLabelHandle) {
      this.checkLabelHandle(this.bends[bn].bounds)
    }

    this.redrawInnerBends(p0, pe)
  }

  if (this.abspoints !== null && this.virtualBends !== null && this.virtualBends.length > 0) {
    let last = this.abspoints[0]

    for (let i = 0; i < this.virtualBends.length; i++) {
      if (this.virtualBends[i] !== null && this.abspoints[i + 1] !== null) {
        let pt = this.abspoints[i + 1]
        let b = this.virtualBends[i]
        let x = last.x + (pt.x - last.x) / 2
        let y = last.y + (pt.y - last.y) / 2
        b.bounds = new MxRectangle(Math.floor(x - b.bounds.width / 2),
          Math.floor(y - b.bounds.height / 2), b.bounds.width, b.bounds.height)
        b.redraw()
        MxUtils.setOpacity(b.node, this.virtualBendOpacity)
        last = pt

        if (this.manageLabelHandle) {
          this.checkLabelHandle(b.bounds)
        }
      }
    }
  }

  if (this.labelShape !== null) {
    this.labelShape.redraw()
  }

  if (this.customHandles !== null) {
    for (let i = 0; i < this.customHandles.length; i++) {
      this.customHandles[i].redraw()
    }
  }
}

/**
 * Function: hideHandles
 *
 * Shortcut to <hideSizers>.
 */
MxEdgeHandler.prototype.setHandlesVisible = function(visible) {
  if (this.bends !== null) {
    for (let i = 0; i < this.bends.length; i++) {
      this.bends[i].node.style.display = (visible) ? '' : 'none'
    }
  }

  if (this.virtualBends !== null) {
    for (let i = 0; i < this.virtualBends.length; i++) {
      this.virtualBends[i].node.style.display = (visible) ? '' : 'none'
    }
  }

  if (this.labelShape !== null) {
    this.labelShape.node.style.display = (visible) ? '' : 'none'
  }

  if (this.customHandles !== null) {
    for (let i = 0; i < this.customHandles.length; i++) {
      this.customHandles[i].setVisible(visible)
    }
  }
}

/**
 * Function: redrawInnerBends
 *
 * Updates and redraws the inner bends.
 *
 * Parameters:
 *
 * p0 - <MxPoint> that represents the location of the first point.
 * pe - <MxPoint> that represents the location of the last point.
 */
MxEdgeHandler.prototype.redrawInnerBends = function(p0, pe) {
  for (let i = 1; i < this.bends.length - 1; i++) {
    if (this.bends[i] !== null) {
      if (this.abspoints[i] !== null) {
        let x = this.abspoints[i].x
        let y = this.abspoints[i].y

        let b = this.bends[i].bounds
        this.bends[i].node.style.visibility = 'visible'
        this.bends[i].bounds = new MxRectangle(Math.round(x - b.width / 2),
          Math.round(y - b.height / 2), b.width, b.height)

        if (this.manageLabelHandle) {
          this.checkLabelHandle(this.bends[i].bounds)
        } else if (this.handleImage === null && this.labelShape.visible && MxUtils.intersects(this.bends[i].bounds, this.labelShape.bounds)) {
          let w = MxConstants.HANDLE_SIZE + 3
          let h = MxConstants.HANDLE_SIZE + 3
          this.bends[i].bounds = new MxRectangle(Math.round(x - w / 2), Math.round(y - h / 2), w, h)
        }

        this.bends[i].redraw()
      } else {
        this.bends[i].destroy()
        this.bends[i] = null
      }
    }
  }
}

/**
 * Function: checkLabelHandle
 *
 * Checks if the label handle intersects the given bounds and moves it if it
 * intersects.
 */
MxEdgeHandler.prototype.checkLabelHandle = function(b) {
  if (this.labelShape !== null) {
    let b2 = this.labelShape.bounds

    if (MxUtils.intersects(b, b2)) {
      if (b.getCenterY() < b2.getCenterY()) {
        b2.y = b.y + b.height
      } else {
        b2.y = b.y - b2.height
      }
    }
  }
}

/**
 * Function: drawPreview
 *
 * Redraws the preview.
 */
MxEdgeHandler.prototype.drawPreview = function() {
  if (this.isLabel) {
    let b = this.labelShape.bounds
    let bounds = new MxRectangle(Math.round(this.label.x - b.width / 2),
      Math.round(this.label.y - b.height / 2), b.width, b.height)
    this.labelShape.bounds = bounds
    this.labelShape.redraw()
  } else if (this.shape !== null) {
    this.shape.apply(this.state)
    this.shape.points = this.abspoints
    this.shape.scale = this.state.view.scale
    this.shape.isDashed = this.isSelectionDashed()
    this.shape.stroke = this.getSelectionColor()
    this.shape.strokewidth = this.getSelectionStrokeWidth() / this.shape.scale / this.shape.scale
    this.shape.isShadow = false
    this.shape.redraw()
  }

  if (this.parentHighlight !== null) {
    this.parentHighlight.redraw()
  }
}

/**
 * Function: refresh
 *
 * Refreshes the bends of this handler.
 */
MxEdgeHandler.prototype.refresh = function() {
  this.abspoints = this.getSelectionPoints(this.state)
  this.points = []

  if (this.shape !== null) {
    this.shape.points = this.abspoints
  }

  if (this.bends !== null) {
    this.destroyBends(this.bends)
    this.bends = this.createBends()
  }

  if (this.virtualBends !== null) {
    this.destroyBends(this.virtualBends)
    this.virtualBends = this.createVirtualBends()
  }

  if (this.customHandles !== null) {
    this.destroyBends(this.customHandles)
    this.customHandles = this.createCustomHandles()
  }

  // Puts label node on top of bends
  if (this.labelShape !== null && this.labelShape.node !== null && this.labelShape.node.parentNode !== null) {
    this.labelShape.node.parentNode.appendChild(this.labelShape.node)
  }
}

/**
 * Function: destroyBends
 *
 * Destroys all elements in <bends>.
 */
MxEdgeHandler.prototype.destroyBends = function(bends) {
  if (bends !== null) {
    for (let i = 0; i < bends.length; i++) {
      if (bends[i] !== null) {
        bends[i].destroy()
      }
    }
  }
}

/**
 * Function: destroy
 *
 * Destroys the handler and all its resources and DOM nodes. This does
 * normally not need to be called as handlers are destroyed automatically
 * when the corresponding cell is deselected.
 */
MxEdgeHandler.prototype.destroy = function() {
  if (this.escapeHandler !== null) {
    this.state.view.graph.removeListener(this.escapeHandler)
    this.escapeHandler = null
  }

  if (this.marker !== null) {
    this.marker.destroy()
    this.marker = null
  }

  if (this.shape !== null) {
    this.shape.destroy()
    this.shape = null
  }

  if (this.parentHighlight !== null) {
    this.parentHighlight.destroy()
    this.parentHighlight = null
  }

  if (this.labelShape !== null) {
    this.labelShape.destroy()
    this.labelShape = null
  }

  if (this.constraintHandler !== null) {
    this.constraintHandler.destroy()
    this.constraintHandler = null
  }

  this.destroyBends(this.virtualBends)
  this.virtualBends = null

  this.destroyBends(this.customHandles)
  this.customHandles = null

  this.destroyBends(this.bends)
  this.bends = null

  this.removeHint()
}
