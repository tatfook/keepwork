/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
/**
 * Class: MxConnectionHandler
 *
 * Graph event handler that creates new connections. Uses <mxTerminalMarker>
 * for finding and highlighting the source and target vertices and
 * <factoryMethod> to create the edge instance. This handler is built-into
 * <mxGraph.connectionHandler> and enabled using <mxGraph.setConnectable>.
 *
 * Example:
 *
 * (code)
 * new MxConnectionHandler(graph, function(source, target, style)
 * {
 *   edge = new MxCell('', new MxGeometry());
 *   edge.setEdge(true);
 *   edge.setStyle(style);
 *   edge.geometry.relative = true;
 *   return edge;
 * });
 * (end)
 *
 * Here is an alternative solution that just sets a specific user object for
 * new edges by overriding <insertEdge>.
 *
 * (code)
 * mxConnectionHandlerInsertEdge = MxConnectionHandler.prototype.insertEdge;
 * MxConnectionHandler.prototype.insertEdge = function(parent, id, value, source, target, style)
 * {
 *   value = 'Test';
 *
 *   return mxConnectionHandlerInsertEdge.apply(this, arguments);
 * };
 * (end)
 *
 * Using images to trigger connections:
 *
 * This handler uses mxTerminalMarker to find the source and target cell for
 * the new connection and creates a new edge using <connect>. The new edge is
 * created using <createEdge> which in turn uses <factoryMethod> or creates a
 * new default edge.
 *
 * The handler uses a "highlight-paradigm" for indicating if a cell is being
 * used as a source or target terminal, as seen in other diagramming products.
 * In order to allow both, moving and connecting cells at the same time,
 * <MxConstants.DEFAULT_HOTSPOT> is used in the handler to determine the hotspot
 * of a cell, that is, the region of the cell which is used to trigger a new
 * connection. The constant is a value between 0 and 1 that specifies the
 * amount of the width and height around the center to be used for the hotspot
 * of a cell and its default value is 0.5. In addition,
 * <MxConstants.MIN_HOTSPOT_SIZE> defines the minimum number of pixels for the
 * width and height of the hotspot.
 *
 * This solution, while standards compliant, may be somewhat confusing because
 * there is no visual indicator for the hotspot and the highlight is seen to
 * switch on and off while the mouse is being moved in and out. Furthermore,
 * this paradigm does not allow to create different connections depending on
 * the highlighted hotspot as there is only one hotspot per cell and it
 * normally does not allow cells to be moved and connected at the same time as
 * there is no clear indication of the connectable area of the cell.
 *
 * To come across these issues, the handle has an additional <createIcons> hook
 * with a default implementation that allows to create one icon to be used to
 * trigger new connections. If this icon is specified, then new connections can
 * only be created if the image is clicked while the cell is being highlighted.
 * The <createIcons> hook may be overridden to create more than one
 * <MxImageShape> for creating new connections, but the default implementation
 * supports one image and is used as follows:
 *
 * In order to display the "connect image" whenever the mouse is over the cell,
 * an DEFAULT_HOTSPOT of 1 should be used:
 *
 * (code)
 * MxConstants.DEFAULT_HOTSPOT = 1;
 * (end)
 *
 * In order to avoid confusion with the highlighting, the highlight color
 * should not be used with a connect image:
 *
 * (code)
 * MxConstants.HIGHLIGHT_COLOR = null;
 * (end)
 *
 * To install the image, the connectImage field of the MxConnectionHandler must
 * be assigned a new <mxImage> instance:
 *
 * (code)
 * MxConnectionHandler.prototype.connectImage = new mxImage('images/green-dot.gif', 14, 14);
 * (end)
 *
 * This will use the green-dot.gif with a width and height of 14 pixels as the
 * image to trigger new connections. In createIcons the icon field of the
 * handler will be set in order to remember the icon that has been clicked for
 * creating the new connection. This field will be available under selectedIcon
 * in the connect method, which may be overridden to take the icon that
 * triggered the new connection into account. This is useful if more than one
 * icon may be used to create a connection.
 *
 * Group: Events
 *
 * Event: MxEvent.START
 *
 * Fires when a new connection is being created by the user. The <code>state</code>
 * property contains the state of the source cell.
 *
 * Event: MxEvent.CONNECT
 *
 * Fires between begin- and endUpdate in <connect>. The <code>cell</code>
 * property contains the inserted edge, the <code>event</code> and <code>target</code>
 * properties contain the respective arguments that were passed to <connect> (where
 * target corresponds to the dropTarget argument). Finally, the <code>terminal</code>
 * property corresponds to the target argument in <connect> or the clone of the source
 * terminal if <createTarget> is enabled.
 *
 * Note that the target is the cell under the mouse where the mouse button was released.
 * Depending on the logic in the handler, this doesn't necessarily have to be the target
 * of the inserted edge. To print the source, target or any optional ports IDs that the
 * edge is connected to, the following code can be used. To get more details about the
 * actual connection point, <mxGraph.getConnectionConstraint> can be used. To resolve
 * the port IDs, use <mxGraphModel.getCell>.
 *
 * (code)
 * graph.connectionHandler.addListener(MxEvent.CONNECT, function(sender, evt)
 * {
 *   let edge = evt.getProperty('cell');
 *   let source = graph.getModel().getTerminal(edge, true);
 *   let target = graph.getModel().getTerminal(edge, false);
 *
 *   let style = graph.getCellStyle(edge);
 *   let sourcePortId = style[MxConstants.STYLE_SOURCE_PORT];
 *   let targetPortId = style[MxConstants.STYLE_TARGET_PORT];
 *
 *   MxLog.show();
 *   MxLog.debug('connect', edge, source.id, target.id, sourcePortId, targetPortId);
 * });
 * (end)
 *
 * Event: MxEvent.RESET
 *
 * Fires when the <reset> method is invoked.
 *
 * Constructor: MxConnectionHandler
 *
 * Constructs an event handler that connects vertices using the specified
 * factory method to create the new edges. Modify
 * <MxConstants.ACTIVE_REGION> to setup the region on a cell which triggers
 * the creation of a new connection or use connect icons as explained
 * above.
 *
 * Parameters:
 *
 * graph - Reference to the enclosing <mxGraph>.
 * factoryMethod - Optional function to create the edge. The function takes
 * the source and target <MxCell> as the first and second argument and an
 * optional cell style from the preview as the third argument. It returns
 * the <MxCell> that represents the new edge.
 */
import MxEventSource from '../util/MxEventSource'
import MxUtils from '../util/MxUtils'
import MxEvent from '../util/MxEvent'
import MxPoint from '../util/MxPoint'
import MxConstants from '../util/MxConstants'
import MxClient from '../MxClient'
import MxPolyline from '../shape/MxPolyline'
import MxConstraintHandler from './MxConstraintHandler'
import MxCellMarker from './MxCellMarker'
import MxEventObject from '../util/MxEventObject'
import MxRectangle from '../util/MxRectangle'
import MxImageShape from '../shape/MxImageShape'
import MxMouseEvent from '../util/MxMouseEvent'
import MxGeometry from '../model/MxGeometry'
import MxLog from '../util/MxLog'
import MxCell from '../model/MxCell'
export default class MxConnectionHandler {
  constructor(graph, factoryMethod) {
    MxEventSource.call(this)

    if (graph !== null) {
      this.graph = graph
      this.factoryMethod = factoryMethod
      this.init()

      // Handles escape keystrokes
      this.escapeHandler = MxUtils.bind(this, function(sender, evt) {
        this.reset()
      })

      this.graph.addListener(MxEvent.ESCAPE, this.escapeHandler)
    }
  };
}

/**
 * Extends MxEventSource.
 */
MxUtils.extend(MxConnectionHandler, MxEventSource)

/**
 * Variable: graph
 *
 * Reference to the enclosing <mxGraph>.
 */
MxConnectionHandler.prototype.graph = null

/**
 * Variable: factoryMethod
 *
 * Function that is used for creating new edges. The function takes the
 * source and target <MxCell> as the first and second argument and returns
 * a new <MxCell> that represents the edge. This is used in <createEdge>.
 */
MxConnectionHandler.prototype.factoryMethod = true

/**
 * Variable: moveIconFront
 *
 * Specifies if icons should be displayed inside the graph container instead
 * of the overlay pane. This is used for HTML labels on vertices which hide
 * the connect icon. This has precendence over <moveIconBack> when set
 * to true. Default is false.
 */
MxConnectionHandler.prototype.moveIconFront = false

/**
 * Variable: moveIconBack
 *
 * Specifies if icons should be moved to the back of the overlay pane. This can
 * be set to true if the icons of the connection handler conflict with other
 * handles, such as the vertex label move handle. Default is false.
 */
MxConnectionHandler.prototype.moveIconBack = false

/**
 * Variable: connectImage
 *
 * <mxImage> that is used to trigger the creation of a new connection. This
 * is used in <createIcons>. Default is null.
 */
MxConnectionHandler.prototype.connectImage = null

/**
 * Variable: targetConnectImage
 *
 * Specifies if the connect icon should be centered on the target state
 * while connections are being previewed. Default is false.
 */
MxConnectionHandler.prototype.targetConnectImage = false

/**
 * Variable: enabled
 *
 * Specifies if events are handled. Default is true.
 */
MxConnectionHandler.prototype.enabled = true

/**
 * Variable: select
 *
 * Specifies if new edges should be selected. Default is true.
 */
MxConnectionHandler.prototype.select = true

/**
 * Variable: createTarget
 *
 * Specifies if <createTargetVertex> should be called if no target was under the
 * mouse for the new connection. Setting this to true means the connection
 * will be drawn as valid if no target is under the mouse, and
 * <createTargetVertex> will be called before the connection is created between
 * the source cell and the newly created vertex in <createTargetVertex>, which
 * can be overridden to create a new target. Default is false.
 */
MxConnectionHandler.prototype.createTarget = false

/**
 * Variable: marker
 *
 * Holds the <mxTerminalMarker> used for finding source and target cells.
 */
MxConnectionHandler.prototype.marker = null

/**
 * Variable: constraintHandler
 *
 * Holds the <MxConstraintHandler> used for drawing and highlighting
 * constraints.
 */
MxConnectionHandler.prototype.constraintHandler = null

/**
 * Variable: error
 *
 * Holds the current validation error while connections are being created.
 */
MxConnectionHandler.prototype.error = null

/**
 * Variable: waypointsEnabled
 *
 * Specifies if single clicks should add waypoints on the new edge. Default is
 * false.
 */
MxConnectionHandler.prototype.waypointsEnabled = false

/**
 * Variable: ignoreMouseDown
 *
 * Specifies if the connection handler should ignore the state of the mouse
 * button when highlighting the source. Default is false, that is, the
 * handler only highlights the source if no button is being pressed.
 */
MxConnectionHandler.prototype.ignoreMouseDown = false

/**
 * Variable: first
 *
 * Holds the <MxPoint> where the mouseDown took place while the handler is
 * active.
 */
MxConnectionHandler.prototype.first = null

/**
 * Variable: connectIconOffset
 *
 * Holds the offset for connect icons during connection preview.
 * Default is MxPoint(0, <MxConstants.TOOLTIP_VERTICAL_OFFSET>).
 * Note that placing the icon under the mouse pointer with an
 * offset of (0,0) will affect hit detection.
 */
MxConnectionHandler.prototype.connectIconOffset = new MxPoint(0, MxConstants.TOOLTIP_VERTICAL_OFFSET)

/**
 * Variable: edgeState
 *
 * Optional <mxCellState> that represents the preview edge while the
 * handler is active. This is created in <createEdgeState>.
 */
MxConnectionHandler.prototype.edgeState = null

/**
 * Variable: changeHandler
 *
 * Holds the change event listener for later removal.
 */
MxConnectionHandler.prototype.changeHandler = null

/**
 * Variable: drillHandler
 *
 * Holds the drill event listener for later removal.
 */
MxConnectionHandler.prototype.drillHandler = null

/**
 * Variable: mouseDownCounter
 *
 * Counts the number of mouseDown events since the start. The initial mouse
 * down event counts as 1.
 */
MxConnectionHandler.prototype.mouseDownCounter = 0

/**
 * Variable: movePreviewAway
 *
 * Switch to enable moving the preview away from the mousepointer. This is required in browsers
 * where the preview cannot be made transparent to events and if the built-in hit detection on
 * the HTML elements in the page should be used. Default is the value of <MxClient.IS_VML>.
 */
MxConnectionHandler.prototype.movePreviewAway = MxClient.IS_VML

/**
 * Variable: outlineConnect
 *
 * Specifies if connections to the outline of a highlighted target should be
 * enabled. This will allow to place the connection point along the outline of
 * the highlighted target. Default is false.
 */
MxConnectionHandler.prototype.outlineConnect = false

/**
 * Variable: livePreview
 *
 * Specifies if the actual shape of the edge state should be used for the preview.
 * Default is false. (Ignored if no edge state is created in <createEdgeState>.)
 */
MxConnectionHandler.prototype.livePreview = false

/**
 * Variable: cursor
 *
 * Specifies the cursor to be used while the handler is active. Default is null.
 */
MxConnectionHandler.prototype.cursor = null

/**
 * Variable: insertBeforeSource
 *
 * Specifies if new edges should be inserted before the source vertex in the
 * cell hierarchy. Default is false for backwards compatibility.
 */
MxConnectionHandler.prototype.insertBeforeSource = false

/**
 * Function: isEnabled
 *
 * Returns true if events are handled. This implementation
 * returns <enabled>.
 */
MxConnectionHandler.prototype.isEnabled = function() {
  return this.enabled
}

/**
 * Function: setEnabled
 *
 * Enables or disables event handling. This implementation
 * updates <enabled>.
 *
 * Parameters:
 *
 * enabled - Boolean that specifies the new enabled state.
 */
MxConnectionHandler.prototype.setEnabled = function(enabled) {
  this.enabled = enabled
}

/**
 * Function: isInsertBefore
 *
 * Returns <insertBeforeSource> for non-loops and false for loops.
 *
 * Parameters:
 *
 * edge - <MxCell> that represents the edge to be inserted.
 * source - <MxCell> that represents the source terminal.
 * target - <MxCell> that represents the target terminal.
 * evt - Mousedown event of the connect gesture.
 * dropTarget - <MxCell> that represents the cell under the mouse when it was
 * released.
 */
MxConnectionHandler.prototype.isInsertBefore = function(edge, source, target, evt, dropTarget) {
  return this.insertBeforeSource && source !== target
}

/**
 * Function: isCreateTarget
 *
 * Returns <createTarget>.
 *
 * Parameters:
 *
 * evt - Current active native pointer event.
 */
MxConnectionHandler.prototype.isCreateTarget = function(evt) {
  return this.createTarget
}

/**
 * Function: setCreateTarget
 *
 * Sets <createTarget>.
 */
MxConnectionHandler.prototype.setCreateTarget = function(value) {
  this.createTarget = value
}

/**
 * Function: createShape
 *
 * Creates the preview shape for new connections.
 */
MxConnectionHandler.prototype.createShape = function() {
  // Creates the edge preview
  let shape = (this.livePreview && this.edgeState !== null)
    ? this.graph.cellRenderer.createShape(this.edgeState)
    : new MxPolyline([], MxConstants.INVALID_COLOR)
  shape.dialect = (this.graph.dialect !== MxConstants.DIALECT_SVG)
    ? MxConstants.DIALECT_VML : MxConstants.DIALECT_SVG
  shape.scale = this.graph.view.scale
  shape.pointerEvents = false
  shape.isDashed = true
  shape.init(this.graph.getView().getOverlayPane())
  MxEvent.redirectMouseEvents(shape.node, this.graph, null)

  return shape
}

/**
 * Function: init
 *
 * Initializes the shapes required for this connection handler. This should
 * be invoked if <mxGraph.container> is assigned after the connection
 * handler has been created.
 */
MxConnectionHandler.prototype.init = function() {
  this.graph.addMouseListener(this)
  this.marker = this.createMarker()
  this.constraintHandler = new MxConstraintHandler(this.graph)

  // Redraws the icons if the graph changes
  this.changeHandler = MxUtils.bind(this, function(sender) {
    if (this.iconState !== null) {
      this.iconState = this.graph.getView().getState(this.iconState.cell)
    }

    if (this.iconState !== null) {
      this.redrawIcons(this.icons, this.iconState)
      this.constraintHandler.reset()
    } else if (this.previous !== null && this.graph.view.getState(this.previous.cell) === null) {
      this.reset()
    }
  })

  this.graph.getModel().addListener(MxEvent.CHANGE, this.changeHandler)
  this.graph.getView().addListener(MxEvent.SCALE, this.changeHandler)
  this.graph.getView().addListener(MxEvent.TRANSLATE, this.changeHandler)
  this.graph.getView().addListener(MxEvent.SCALE_AND_TRANSLATE, this.changeHandler)

  // Removes the icon if we step into/up or start editing
  this.drillHandler = MxUtils.bind(this, function(sender) {
    this.reset()
  })

  this.graph.addListener(MxEvent.START_EDITING, this.drillHandler)
  this.graph.getView().addListener(MxEvent.DOWN, this.drillHandler)
  this.graph.getView().addListener(MxEvent.UP, this.drillHandler)
}

/**
 * Function: isConnectableCell
 *
 * Returns true if the given cell is connectable. This is a hook to
 * disable floating connections. This implementation returns true.
 */
MxConnectionHandler.prototype.isConnectableCell = function(cell) {
  return true
}

/**
 * Function: createMarker
 *
 * Creates and returns the <MxCellMarker> used in <marker>.
 */
MxConnectionHandler.prototype.createMarker = function() {
  let marker = new MxCellMarker(this.graph)
  marker.hotspotEnabled = true

  // Overrides to return cell at location only if valid (so that
  // there is no highlight for invalid cells)
  marker.getCell = MxUtils.bind(this, function(me) {
    let cell = MxCellMarker.prototype.getCell.apply(marker, arguments)
    this.error = null

    // Checks for cell at preview point (with grid)
    if (cell === null && this.currentPoint !== null) {
      cell = this.graph.getCellAt(this.currentPoint.x, this.currentPoint.y)
    }

    // Uses connectable parent vertex if one exists
    if (cell !== null && !this.graph.isCellConnectable(cell)) {
      let parent = this.graph.getModel().getParent(cell)

      if (this.graph.getModel().isVertex(parent) && this.graph.isCellConnectable(parent)) {
        cell = parent
      }
    }

    if ((this.graph.isSwimlane(cell) && this.currentPoint !== null && this.graph.hitsSwimlaneContent(cell, this.currentPoint.x, this.currentPoint.y)) || !this.isConnectableCell(cell)) {
      cell = null
    }

    if (cell !== null) {
      if (this.isConnecting()) {
        if (this.previous !== null) {
          this.error = this.validateConnection(this.previous.cell, cell)

          if (this.error !== null && this.error.length === 0) {
            cell = null

            // Enables create target inside groups
            if (this.isCreateTarget(me.getEvent())) {
              this.error = null
            }
          }
        }
      } else if (!this.isValidSource(cell, me)) {
        cell = null
      }
    } else if (this.isConnecting() && !this.isCreateTarget(me.getEvent()) && !this.graph.allowDanglingEdges) {
      this.error = ''
    }

    return cell
  })

  // Sets the highlight color according to validateConnection
  marker.isValidState = MxUtils.bind(this, function(state) {
    if (this.isConnecting()) {
      return this.error === null
    } else {
      return MxCellMarker.prototype.isValidState.apply(marker, arguments)
    }
  })

  // Overrides to use marker color only in highlight mode or for
  // target selection
  marker.getMarkerColor = MxUtils.bind(this, function(evt, state, isValid) {
    return (this.connectImage === null || this.isConnecting())
      ? MxCellMarker.prototype.getMarkerColor.apply(marker, arguments)
      : null
  })

  // Overrides to use hotspot only for source selection otherwise
  // intersects always returns true when over a cell
  marker.intersects = MxUtils.bind(this, function(state, evt) {
    if (this.connectImage !== null || this.isConnecting()) {
      return true
    }

    return MxCellMarker.prototype.intersects.apply(marker, arguments)
  })

  return marker
}

/**
 * Function: start
 *
 * Starts a new connection for the given state and coordinates.
 */
MxConnectionHandler.prototype.start = function(state, x, y, edgeState) {
  this.previous = state
  this.first = new MxPoint(x, y)
  this.edgeState = (edgeState !== null) ? edgeState : this.createEdgeState(null)

  // Marks the source state
  this.marker.currentColor = this.marker.validColor
  this.marker.markedState = state
  this.marker.mark()

  this.fireEvent(new MxEventObject(MxEvent.START, 'state', this.previous))
}

/**
 * Function: isConnecting
 *
 * Returns true if the source terminal has been clicked and a new
 * connection is currently being previewed.
 */
MxConnectionHandler.prototype.isConnecting = function() {
  return this.first !== null && this.shape !== null
}

/**
 * Function: isValidSource
 *
 * Returns <mxGraph.isValidSource> for the given source terminal.
 *
 * Parameters:
 *
 * cell - <MxCell> that represents the source terminal.
 * me - <MxMouseEvent> that is associated with this call.
 */
MxConnectionHandler.prototype.isValidSource = function(cell, me) {
  return this.graph.isValidSource(cell)
}

/**
 * Function: isValidTarget
 *
 * Returns true. The call to <mxGraph.isValidTarget> is implicit by calling
 * <mxGraph.getEdgeValidationError> in <validateConnection>. This is an
 * additional hook for disabling certain targets in this specific handler.
 *
 * Parameters:
 *
 * cell - <MxCell> that represents the target terminal.
 */
MxConnectionHandler.prototype.isValidTarget = function(cell) {
  return true
}

/**
 * Function: validateConnection
 *
 * Returns the error message or an empty string if the connection for the
 * given source target pair is not valid. Otherwise it returns null. This
 * implementation uses <mxGraph.getEdgeValidationError>.
 *
 * Parameters:
 *
 * source - <MxCell> that represents the source terminal.
 * target - <MxCell> that represents the target terminal.
 */
MxConnectionHandler.prototype.validateConnection = function(source, target) {
  if (!this.isValidTarget(target)) {
    return ''
  }

  return this.graph.getEdgeValidationError(null, source, target)
}

/**
 * Function: getConnectImage
 *
 * Hook to return the <mxImage> used for the connection icon of the given
 * <mxCellState>. This implementation returns <connectImage>.
 *
 * Parameters:
 *
 * state - <mxCellState> whose connect image should be returned.
 */
MxConnectionHandler.prototype.getConnectImage = function(state) {
  return this.connectImage
}

/**
 * Function: isMoveIconToFrontForState
 *
 * Returns true if the state has a HTML label in the graph's container, otherwise
 * it returns <moveIconFront>.
 *
 * Parameters:
 *
 * state - <mxCellState> whose connect icons should be returned.
 */
MxConnectionHandler.prototype.isMoveIconToFrontForState = function(state) {
  if (state.text !== null && state.text.node.parentNode === this.graph.container) {
    return true
  }

  return this.moveIconFront
}

/**
 * Function: createIcons
 *
 * Creates the array <mxImageShapes> that represent the connect icons for
 * the given <mxCellState>.
 *
 * Parameters:
 *
 * state - <mxCellState> whose connect icons should be returned.
 */
MxConnectionHandler.prototype.createIcons = function(state) {
  let image = this.getConnectImage(state)

  if (image !== null && state !== null) {
    this.iconState = state
    let icons = []

    // Cannot use HTML for the connect icons because the icon receives all
    // mouse move events in IE, must use VML and SVG instead even if the
    // connect-icon appears behind the selection border and the selection
    // border consumes the events before the icon gets a chance
    let bounds = new MxRectangle(0, 0, image.width, image.height)
    let icon = new MxImageShape(bounds, image.src, null, null, 0)
    icon.preserveImageAspect = false

    if (this.isMoveIconToFrontForState(state)) {
      icon.dialect = MxConstants.DIALECT_STRICTHTML
      icon.init(this.graph.container)
    } else {
      icon.dialect = (this.graph.dialect === MxConstants.DIALECT_SVG)
        ? MxConstants.DIALECT_SVG : MxConstants.DIALECT_VML
      icon.init(this.graph.getView().getOverlayPane())

      // Move the icon back in the overlay pane
      if (this.moveIconBack && icon.node.previousSibling !== null) {
        icon.node.parentNode.insertBefore(icon.node, icon.node.parentNode.firstChild)
      }
    }

    icon.node.style.cursor = MxConstants.CURSOR_CONNECT

    // Events transparency
    let getState = MxUtils.bind(this, function() {
      return (this.currentState !== null) ? this.currentState : state
    })

    // Updates the local icon before firing the mouse down event.
    let mouseDown = MxUtils.bind(this, function(evt) {
      if (!MxEvent.isConsumed(evt)) {
        this.icon = icon
        this.graph.fireMouseEvent(MxEvent.MOUSE_DOWN,
          new MxMouseEvent(evt, getState()))
      }
    })

    MxEvent.redirectMouseEvents(icon.node, this.graph, getState, mouseDown)

    icons.push(icon)
    this.redrawIcons(icons, this.iconState)

    return icons
  }

  return null
}

/**
 * Function: redrawIcons
 *
 * Redraws the given array of <mxImageShapes>.
 *
 * Parameters:
 *
 * icons - Optional array of <mxImageShapes> to be redrawn.
 */
MxConnectionHandler.prototype.redrawIcons = function(icons, state) {
  if (icons !== null && icons[0] !== null && state !== null) {
    let pos = this.getIconPosition(icons[0], state)
    icons[0].bounds.x = pos.x
    icons[0].bounds.y = pos.y
    icons[0].redraw()
  }
}

/**
 * Function: redrawIcons
 *
 * Redraws the given array of <mxImageShapes>.
 *
 * Parameters:
 *
 * icons - Optional array of <mxImageShapes> to be redrawn.
 */
MxConnectionHandler.prototype.getIconPosition = function(icon, state) {
  let scale = this.graph.getView().scale
  let cx = state.getCenterX()
  let cy = state.getCenterY()

  if (this.graph.isSwimlane(state.cell)) {
    let size = this.graph.getStartSize(state.cell)

    cx = (size.width !== 0) ? state.x + size.width * scale / 2 : cx
    cy = (size.height !== 0) ? state.y + size.height * scale / 2 : cy

    let alpha = MxUtils.toRadians(MxUtils.getValue(state.style, MxConstants.STYLE_ROTATION) || 0)

    if (alpha !== 0) {
      let cos = Math.cos(alpha)
      let sin = Math.sin(alpha)
      let ct = new MxPoint(state.getCenterX(), state.getCenterY())
      let pt = MxUtils.getRotatedPoint(new MxPoint(cx, cy), cos, sin, ct)
      cx = pt.x
      cy = pt.y
    }
  }

  return new MxPoint(cx - icon.bounds.width / 2,
    cy - icon.bounds.height / 2)
}

/**
 * Function: destroyIcons
 *
 * Destroys the connect icons and resets the respective state.
 */
MxConnectionHandler.prototype.destroyIcons = function() {
  if (this.icons !== null) {
    for (let i = 0; i < this.icons.length; i++) {
      this.icons[i].destroy()
    }

    this.icons = null
    this.icon = null
    this.selectedIcon = null
    this.iconState = null
  }
}

/**
 * Function: isStartEvent
 *
 * Returns true if the given mouse down event should start this handler. The
 * This implementation returns true if the event does not force marquee
 * selection, and the currentConstraint and currentFocus of the
 * <constraintHandler> are not null, or <previous> and <error> are not null and
 * <icons> is null or <icons> and <icon> are not null.
 */
MxConnectionHandler.prototype.isStartEvent = function(me) {
  return ((this.constraintHandler.currentFocus !== null && this.constraintHandler.currentConstraint !== null) || (this.previous !== null && this.error === null && (this.icons === null || (this.icons !== null && this.icon !== null))))
}

/**
 * Function: mouseDown
 *
 * Handles the event by initiating a new connection.
 */
MxConnectionHandler.prototype.mouseDown = function(sender, me) {
  this.mouseDownCounter++

  if (this.isEnabled() && this.graph.isEnabled() && !me.isConsumed() && !this.isConnecting() && this.isStartEvent(me)) {
    if (this.constraintHandler.currentConstraint !== null && this.constraintHandler.currentFocus !== null && this.constraintHandler.currentPoint !== null) {
      this.sourceConstraint = this.constraintHandler.currentConstraint
      this.previous = this.constraintHandler.currentFocus
      this.first = this.constraintHandler.currentPoint.clone()
    } else {
      // Stores the location of the initial mousedown
      this.first = new MxPoint(me.getGraphX(), me.getGraphY())
    }

    this.edgeState = this.createEdgeState(me)
    this.mouseDownCounter = 1

    if (this.waypointsEnabled && this.shape === null) {
      this.waypoints = null
      this.shape = this.createShape()

      if (this.edgeState !== null) {
        this.shape.apply(this.edgeState)
      }
    }

    // Stores the starting point in the geometry of the preview
    if (this.previous === null && this.edgeState !== null) {
      let pt = this.graph.getPointForEvent(me.getEvent())
      this.edgeState.cell.geometry.setTerminalPoint(pt, true)
    }

    this.fireEvent(new MxEventObject(MxEvent.START, 'state', this.previous))

    me.consume()
  }

  this.selectedIcon = this.icon
  this.icon = null
}

/**
 * Function: isImmediateConnectSource
 *
 * Returns true if a tap on the given source state should immediately start
 * connecting. This implementation returns true if the state is not movable
 * in the graph.
 */
MxConnectionHandler.prototype.isImmediateConnectSource = function(state) {
  return !this.graph.isCellMovable(state.cell)
}

/**
 * Function: createEdgeState
 *
 * Hook to return an <mxCellState> which may be used during the preview.
 * This implementation returns null.
 *
 * Use the following code to create a preview for an existing edge style:
 *
 * (code)
 * graph.connectionHandler.createEdgeState = function(me)
 * {
 *   let edge = graph.createEdge(null, null, null, null, null, 'edgeStyle=elbowEdgeStyle');
 *
 *   return new mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge));
 * };
 * (end)
 */
MxConnectionHandler.prototype.createEdgeState = function(me) {
  return null
}

/**
 * Function: isOutlineConnectEvent
 *
 * Returns true if <outlineConnect> is true and the source of the event is the outline shape
 * or shift is pressed.
 */
MxConnectionHandler.prototype.isOutlineConnectEvent = function(me) {
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
 * Function: updateCurrentState
 *
 * Updates the current state for a given mouse move event by using
 * the <marker>.
 */
MxConnectionHandler.prototype.updateCurrentState = function(me, point) {
  this.constraintHandler.update(me, this.first === null, false, (this.first === null || me.isSource(this.marker.highlight.shape)) ? null : point)

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

    // Updates validation state
    if (this.previous !== null) {
      this.error = this.validateConnection(this.previous.cell, this.constraintHandler.currentFocus.cell)

      if (this.error === null) {
        this.currentState = this.constraintHandler.currentFocus
      } else {
        this.constraintHandler.reset()
      }
    }
  } else {
    if (this.graph.isIgnoreTerminalEvent(me.getEvent())) {
      this.marker.reset()
      this.currentState = null
    } else {
      this.marker.process(me)
      this.currentState = this.marker.getValidState()
    }

    let outline = this.isOutlineConnectEvent(me)

    if (this.currentState !== null && outline) {
      // Handles special case where mouse is on outline away from actual end point
      // in which case the grid is ignored and mouse point is used instead
      if (me.isSource(this.marker.highlight.shape)) {
        point = new MxPoint(me.getGraphX(), me.getGraphY())
      }

      let constraint = this.graph.getOutlineConstraint(point, this.currentState, me)
      this.constraintHandler.setFocus(me, this.currentState, false)
      this.constraintHandler.currentConstraint = constraint
      this.constraintHandler.currentPoint = point
    }

    if (this.outlineConnect) {
      if (this.marker.highlight !== null && this.marker.highlight.shape !== null) {
        let s = this.graph.view.scale

        if (this.constraintHandler.currentConstraint !== null && this.constraintHandler.currentFocus !== null) {
          this.marker.highlight.shape.stroke = MxConstants.OUTLINE_HIGHLIGHT_COLOR
          this.marker.highlight.shape.strokewidth = MxConstants.OUTLINE_HIGHLIGHT_STROKEWIDTH / s / s
          this.marker.highlight.repaint()
        } else if (this.marker.hasValidState()) {
          // Handles special case where actual end point of edge and current mouse point
          // are not equal (due to grid snapping) and there is no hit on shape or highlight
          if (this.marker.getValidState() !== me.getState()) {
            this.marker.highlight.shape.stroke = 'transparent'
            this.currentState = null
          } else {
            this.marker.highlight.shape.stroke = MxConstants.DEFAULT_VALID_COLOR
          }

          this.marker.highlight.shape.strokewidth = MxConstants.HIGHLIGHT_STROKEWIDTH / s / s
          this.marker.highlight.repaint()
        }
      }
    }
  }
}

/**
 * Function: convertWaypoint
 *
 * Converts the given point from screen coordinates to model coordinates.
 */
MxConnectionHandler.prototype.convertWaypoint = function(point) {
  let scale = this.graph.getView().getScale()
  let tr = this.graph.getView().getTranslate()

  point.x = point.x / scale - tr.x
  point.y = point.y / scale - tr.y
}

/**
 * Function: snapToPreview
 *
 * Called to snap the given point to the current preview. This snaps to the
 * first point of the preview if alt is not pressed.
 */
MxConnectionHandler.prototype.snapToPreview = function(me, point) {
  if (!MxEvent.isAltDown(me.getEvent()) && this.previous !== null) {
    let tol = this.graph.gridSize * this.graph.view.scale / 2
    let tmp = (this.sourceConstraint !== null) ? this.first
      : new MxPoint(this.previous.getCenterX(), this.previous.getCenterY())

    if (Math.abs(tmp.x - me.getGraphX()) < tol) {
      point.x = tmp.x
    }

    if (Math.abs(tmp.y - me.getGraphY()) < tol) {
      point.y = tmp.y
    }
  }
}

/**
 * Function: mouseMove
 *
 * Handles the event by updating the preview edge or by highlighting
 * a possible source or target terminal.
 */
MxConnectionHandler.prototype.mouseMove = function(sender, me) {
  if (!me.isConsumed() && (this.ignoreMouseDown || this.first !== null || !this.graph.isMouseDown)) {
    // Handles special case when handler is disabled during highlight
    if (!this.isEnabled() && this.currentState !== null) {
      this.destroyIcons()
      this.currentState = null
    }

    let view = this.graph.getView()
    let scale = view.scale
    let tr = view.translate
    let point = new MxPoint(me.getGraphX(), me.getGraphY())
    this.error = null

    if (this.graph.isGridEnabledEvent(me.getEvent())) {
      point = new MxPoint((this.graph.snap(point.x / scale - tr.x) + tr.x) * scale,
        (this.graph.snap(point.y / scale - tr.y) + tr.y) * scale)
    }

    this.snapToPreview(me, point)
    this.currentPoint = point

    if (this.first !== null || (this.isEnabled() && this.graph.isEnabled())) {
      this.updateCurrentState(me, point)
    }

    if (this.first !== null) {
      let constraint = null
      let current = point

      // Uses the current point from the constraint handler if available
      if (this.constraintHandler.currentConstraint !== null && this.constraintHandler.currentFocus !== null && this.constraintHandler.currentPoint !== null) {
        constraint = this.constraintHandler.currentConstraint
        current = this.constraintHandler.currentPoint.clone()
      } else if (this.previous !== null && !this.graph.isIgnoreTerminalEvent(me.getEvent()) && MxEvent.isShiftDown(me.getEvent())) {
        if (Math.abs(this.previous.getCenterX() - point.x) < Math.abs(this.previous.getCenterY() - point.y)) {
          point.x = this.previous.getCenterX()
        } else {
          point.y = this.previous.getCenterY()
        }
      }

      let pt2 = this.first

      // Moves the connect icon with the mouse
      if (this.selectedIcon !== null) {
        let w = this.selectedIcon.bounds.width
        let h = this.selectedIcon.bounds.height

        if (this.currentState !== null && this.targetConnectImage) {
          let pos = this.getIconPosition(this.selectedIcon, this.currentState)
          this.selectedIcon.bounds.x = pos.x
          this.selectedIcon.bounds.y = pos.y
        } else {
          let bounds = new MxRectangle(me.getGraphX() + this.connectIconOffset.x,
            me.getGraphY() + this.connectIconOffset.y, w, h)
          this.selectedIcon.bounds = bounds
        }

        this.selectedIcon.redraw()
      }

      // Uses edge state to compute the terminal points
      if (this.edgeState !== null) {
        this.updateEdgeState(current, constraint)
        current = this.edgeState.absolutePoints[this.edgeState.absolutePoints.length - 1]
        pt2 = this.edgeState.absolutePoints[0]
      } else {
        if (this.currentState !== null) {
          if (this.constraintHandler.currentConstraint === null) {
            let tmp = this.getTargetPerimeterPoint(this.currentState, me)

            if (tmp !== null) {
              current = tmp
            }
          }
        }

        // Computes the source perimeter point
        if (this.sourceConstraint === null && this.previous !== null) {
          let next = (this.waypoints !== null && this.waypoints.length > 0)
            ? this.waypoints[0] : current
          let tmp = this.getSourcePerimeterPoint(this.previous, next, me)

          if (tmp !== null) {
            pt2 = tmp
          }
        }
      }

      // Makes sure the cell under the mousepointer can be detected
      // by moving the preview shape away from the mouse. This
      // makes sure the preview shape does not prevent the detection
      // of the cell under the mousepointer even for slow gestures.
      if (this.currentState === null && this.movePreviewAway) {
        let tmp = pt2

        if (this.edgeState !== null && this.edgeState.absolutePoints.length >= 2) {
          let tmp2 = this.edgeState.absolutePoints[this.edgeState.absolutePoints.length - 2]

          if (tmp2 !== null) {
            tmp = tmp2
          }
        }

        let dx = current.x - tmp.x
        let dy = current.y - tmp.y

        let len = Math.sqrt(dx * dx + dy * dy)

        if (len === 0) {
          return
        }

        // Stores old point to reuse when creating edge
        this.originalPoint = current.clone()
        current.x -= dx * 4 / len
        current.y -= dy * 4 / len
      } else {
        this.originalPoint = null
      }

      // Creates the preview shape (lazy)
      if (this.shape === null) {
        let dx = Math.abs(point.x - this.first.x)
        let dy = Math.abs(point.y - this.first.y)

        if (dx > this.graph.tolerance || dy > this.graph.tolerance) {
          this.shape = this.createShape()

          if (this.edgeState !== null) {
            this.shape.apply(this.edgeState)
          }

          // Revalidates current connection
          this.updateCurrentState(me, point)
        }
      }

      // Updates the points in the preview edge
      if (this.shape !== null) {
        if (this.edgeState !== null) {
          this.shape.points = this.edgeState.absolutePoints
        } else {
          let pts = [pt2]

          if (this.waypoints !== null) {
            pts = pts.concat(this.waypoints)
          }

          pts.push(current)
          this.shape.points = pts
        }

        this.drawPreview()
      }

      // Makes sure endpoint of edge is visible during connect
      if (this.cursor !== null) {
        this.graph.container.style.cursor = this.cursor
      }

      MxEvent.consume(me.getEvent())
      me.consume()
    } else if (!this.isEnabled() || !this.graph.isEnabled()) {
      this.constraintHandler.reset()
    } else if (this.previous !== this.currentState && this.edgeState === null) {
      this.destroyIcons()

      // Sets the cursor on the current shape
      if (this.currentState !== null && this.error === null && this.constraintHandler.currentConstraint === null) {
        this.icons = this.createIcons(this.currentState)

        if (this.icons === null) {
          this.currentState.setCursor(MxConstants.CURSOR_CONNECT)
          me.consume()
        }
      }

      this.previous = this.currentState
    } else if (this.previous === this.currentState && this.currentState !== null && this.icons === null && !this.graph.isMouseDown) {
      // Makes sure that no cursors are changed
      me.consume()
    }

    if (!this.graph.isMouseDown && this.currentState !== null && this.icons !== null) {
      let hitsIcon = false
      let target = me.getSource()

      for (let i = 0; i < this.icons.length && !hitsIcon; i++) {
        hitsIcon = target === this.icons[i].node || target.parentNode === this.icons[i].node
      }

      if (!hitsIcon) {
        this.updateIcons(this.currentState, this.icons, me)
      }
    }
  } else {
    this.constraintHandler.reset()
  }
}

/**
 * Function: updateEdgeState
 *
 * Updates <edgeState>.
 */
MxConnectionHandler.prototype.updateEdgeState = function(current, constraint) {
  // TODO: Use generic method for writing constraint to style
  if (this.sourceConstraint !== null && this.sourceConstraint.point !== null) {
    this.edgeState.style[MxConstants.STYLE_EXIT_X] = this.sourceConstraint.point.x
    this.edgeState.style[MxConstants.STYLE_EXIT_Y] = this.sourceConstraint.point.y
  }

  if (constraint !== null && constraint.point !== null) {
    this.edgeState.style[MxConstants.STYLE_ENTRY_X] = constraint.point.x
    this.edgeState.style[MxConstants.STYLE_ENTRY_Y] = constraint.point.y
  } else {
    delete this.edgeState.style[MxConstants.STYLE_ENTRY_X]
    delete this.edgeState.style[MxConstants.STYLE_ENTRY_Y]
  }

  this.edgeState.absolutePoints = [null, (this.currentState !== null) ? null : current]
  this.graph.view.updateFixedTerminalPoint(this.edgeState, this.previous, true, this.sourceConstraint)

  if (this.currentState !== null) {
    if (constraint === null) {
      constraint = this.graph.getConnectionConstraint(this.edgeState, this.previous, false)
    }

    this.edgeState.setAbsoluteTerminalPoint(null, false)
    this.graph.view.updateFixedTerminalPoint(this.edgeState, this.currentState, false, constraint)
  }

  // Scales and translates the waypoints to the model
  let realPoints = null

  if (this.waypoints !== null) {
    realPoints = []

    for (let i = 0; i < this.waypoints.length; i++) {
      let pt = this.waypoints[i].clone()
      this.convertWaypoint(pt)
      realPoints[i] = pt
    }
  }

  this.graph.view.updatePoints(this.edgeState, realPoints, this.previous, this.currentState)
  this.graph.view.updateFloatingTerminalPoints(this.edgeState, this.previous, this.currentState)
}

/**
 * Function: getTargetPerimeterPoint
 *
 * Returns the perimeter point for the given target state.
 *
 * Parameters:
 *
 * state - <mxCellState> that represents the target cell state.
 * me - <MxMouseEvent> that represents the mouse move.
 */
MxConnectionHandler.prototype.getTargetPerimeterPoint = function(state, me) {
  let result = null
  let view = state.view
  let targetPerimeter = view.getPerimeterFunction(state)

  if (targetPerimeter !== null) {
    let next = (this.waypoints !== null && this.waypoints.length > 0)
      ? this.waypoints[this.waypoints.length - 1]
      : new MxPoint(this.previous.getCenterX(), this.previous.getCenterY())
    let tmp = targetPerimeter(view.getPerimeterBounds(state),
      this.edgeState, next, false)

    if (tmp !== null) {
      result = tmp
    }
  } else {
    result = new MxPoint(state.getCenterX(), state.getCenterY())
  }

  return result
}

/**
 * Function: getSourcePerimeterPoint
 *
 * Hook to update the icon position(s) based on a mouseOver event. This is
 * an empty implementation.
 *
 * Parameters:
 *
 * state - <mxCellState> that represents the target cell state.
 * next - <MxPoint> that represents the next point along the previewed edge.
 * me - <MxMouseEvent> that represents the mouse move.
 */
MxConnectionHandler.prototype.getSourcePerimeterPoint = function(state, next, me) {
  let result = null
  let view = state.view
  let sourcePerimeter = view.getPerimeterFunction(state)
  let c = new MxPoint(state.getCenterX(), state.getCenterY())

  if (sourcePerimeter !== null) {
    let theta = MxUtils.getValue(state.style, MxConstants.STYLE_ROTATION, 0)
    let rad = -theta * (Math.PI / 180)

    if (theta !== 0) {
      next = MxUtils.getRotatedPoint(new MxPoint(next.x, next.y), Math.cos(rad), Math.sin(rad), c)
    }

    let tmp = sourcePerimeter(view.getPerimeterBounds(state), state, next, false)

    if (tmp !== null) {
      if (theta !== 0) {
        tmp = MxUtils.getRotatedPoint(new MxPoint(tmp.x, tmp.y), Math.cos(-rad), Math.sin(-rad), c)
      }

      result = tmp
    }
  } else {
    result = c
  }

  return result
}

/**
 * Function: updateIcons
 *
 * Hook to update the icon position(s) based on a mouseOver event. This is
 * an empty implementation.
 *
 * Parameters:
 *
 * state - <mxCellState> under the mouse.
 * icons - Array of currently displayed icons.
 * me - <MxMouseEvent> that contains the mouse event.
 */
MxConnectionHandler.prototype.updateIcons = function(state, icons, me) {
  // empty
}

/**
 * Function: isStopEvent
 *
 * Returns true if the given mouse up event should stop this handler. The
 * connection will be created if <error> is null. Note that this is only
 * called if <waypointsEnabled> is true. This implemtation returns true
 * if there is a cell state in the given event.
 */
MxConnectionHandler.prototype.isStopEvent = function(me) {
  return me.getState() !== null
}

/**
 * Function: addWaypoint
 *
 * Adds the waypoint for the given event to <waypoints>.
 */
MxConnectionHandler.prototype.addWaypointForEvent = function(me) {
  let point = MxUtils.convertPoint(this.graph.container, me.getX(), me.getY())
  let dx = Math.abs(point.x - this.first.x)
  let dy = Math.abs(point.y - this.first.y)
  let addPoint = this.waypoints !== null || (this.mouseDownCounter > 1 && (dx > this.graph.tolerance || dy > this.graph.tolerance))

  if (addPoint) {
    if (this.waypoints === null) {
      this.waypoints = []
    }

    let scale = this.graph.view.scale
    let point = new MxPoint(this.graph.snap(me.getGraphX() / scale) * scale,
      this.graph.snap(me.getGraphY() / scale) * scale)
    this.waypoints.push(point)
  }
}

/**
 * Function: mouseUp
 *
 * Handles the event by inserting the new connection.
 */
MxConnectionHandler.prototype.mouseUp = function(sender, me) {
  if (!me.isConsumed() && this.isConnecting()) {
    if (this.waypointsEnabled && !this.isStopEvent(me)) {
      this.addWaypointForEvent(me)
      me.consume()

      return
    }

    // Inserts the edge if no validation error exists
    if (this.error === null) {
      let source = (this.previous !== null) ? this.previous.cell : null
      let target = null

      if (this.constraintHandler.currentConstraint !== null && this.constraintHandler.currentFocus !== null) {
        target = this.constraintHandler.currentFocus.cell
      }

      if (target === null && this.currentState !== null) {
        target = this.currentState.cell
      }

      this.connect(source, target, me.getEvent(), me.getCell())
    } else {
      // Selects the source terminal for self-references
      if (this.previous !== null && this.marker.validState !== null && this.previous.cell === this.marker.validState.cell) {
        this.graph.selectCellForEvent(this.marker.source) // , evt
      }

      // Displays the error message if it is not an empty string,
      // for empty error messages, the event is silently dropped
      if (this.error.length > 0) {
        this.graph.validationAlert(this.error)
      }
    }

    // Redraws the connect icons and resets the handler state
    this.destroyIcons()
    me.consume()
  }

  if (this.first !== null) {
    this.reset()
  }
}

/**
 * Function: reset
 *
 * Resets the state of this handler.
 */
MxConnectionHandler.prototype.reset = function() {
  if (this.shape !== null) {
    this.shape.destroy()
    this.shape = null
  }

  // Resets the cursor on the container
  if (this.cursor !== null && this.graph.container !== null) {
    this.graph.container.style.cursor = ''
  }

  this.destroyIcons()
  this.marker.reset()
  this.constraintHandler.reset()
  this.originalPoint = null
  this.currentPoint = null
  this.edgeState = null
  this.previous = null
  this.error = null
  this.sourceConstraint = null
  this.mouseDownCounter = 0
  this.first = null

  this.fireEvent(new MxEventObject(MxEvent.RESET))
}

/**
 * Function: drawPreview
 *
 * Redraws the preview edge using the color and width returned by
 * <getEdgeColor> and <getEdgeWidth>.
 */
MxConnectionHandler.prototype.drawPreview = function() {
  this.updatePreview(this.error === null)
  this.shape.redraw()
}

/**
 * Function: getEdgeColor
 *
 * Returns the color used to draw the preview edge. This returns green if
 * there is no edge validation error and red otherwise.
 *
 * Parameters:
 *
 * valid - Boolean indicating if the color for a valid edge should be
 * returned.
 */
MxConnectionHandler.prototype.updatePreview = function(valid) {
  this.shape.strokewidth = this.getEdgeWidth(valid)
  this.shape.stroke = this.getEdgeColor(valid)
}

/**
 * Function: getEdgeColor
 *
 * Returns the color used to draw the preview edge. This returns green if
 * there is no edge validation error and red otherwise.
 *
 * Parameters:
 *
 * valid - Boolean indicating if the color for a valid edge should be
 * returned.
 */
MxConnectionHandler.prototype.getEdgeColor = function(valid) {
  return (valid) ? MxConstants.VALID_COLOR : MxConstants.INVALID_COLOR
}

/**
 * Function: getEdgeWidth
 *
 * Returns the width used to draw the preview edge. This returns 3 if
 * there is no edge validation error and 1 otherwise.
 *
 * Parameters:
 *
 * valid - Boolean indicating if the width for a valid edge should be
 * returned.
 */
MxConnectionHandler.prototype.getEdgeWidth = function(valid) {
  return (valid) ? 3 : 1
}

/**
 * Function: connect
 *
 * Connects the given source and target using a new edge. This
 * implementation uses <createEdge> to create the edge.
 *
 * Parameters:
 *
 * source - <MxCell> that represents the source terminal.
 * target - <MxCell> that represents the target terminal.
 * evt - Mousedown event of the connect gesture.
 * dropTarget - <MxCell> that represents the cell under the mouse when it was
 * released.
 */
MxConnectionHandler.prototype.connect = function(source, target, evt, dropTarget) {
  if (target !== null || this.isCreateTarget(evt) || this.graph.allowDanglingEdges) {
    // Uses the common parent of source and target or
    // the default parent to insert the edge
    let model = this.graph.getModel()
    let terminalInserted = false
    let edge = null

    model.beginUpdate()
    try {
      if (source !== null && target === null && !this.graph.isIgnoreTerminalEvent(evt) && this.isCreateTarget(evt)) {
        target = this.createTargetVertex(evt, source)

        if (target !== null) {
          dropTarget = this.graph.getDropTarget([target], evt, dropTarget)
          terminalInserted = true

          // Disables edges as drop targets if the target cell was created
          // FIXME: Should not shift if vertex was aligned (same in Java)
          if (dropTarget === null || !this.graph.getModel().isEdge(dropTarget)) {
            let pstate = this.graph.getView().getState(dropTarget)

            if (pstate !== null) {
              let tmp = model.getGeometry(target)
              tmp.x -= pstate.origin.x
              tmp.y -= pstate.origin.y
            }
          } else {
            dropTarget = this.graph.getDefaultParent()
          }

          this.graph.addCell(target, dropTarget)
        }
      }

      let parent = this.graph.getDefaultParent()

      if (source !== null && target !== null && model.getParent(source) === model.getParent(target) && model.getParent(model.getParent(source)) !== model.getRoot()) {
        parent = model.getParent(source)

        if ((source.geometry !== null && source.geometry.relative) && (target.geometry !== null && target.geometry.relative)) {
          parent = model.getParent(parent)
        }
      }

      // Uses the value of the preview edge state for inserting
      // the new edge into the graph
      let value = null
      let style = null

      if (this.edgeState !== null) {
        value = this.edgeState.cell.value
        style = this.edgeState.cell.style
      }

      edge = this.insertEdge(parent, null, value, source, target, style)

      if (edge !== null) {
        // Updates the connection constraints
        this.graph.setConnectionConstraint(edge, source, true, this.sourceConstraint)
        this.graph.setConnectionConstraint(edge, target, false, this.constraintHandler.currentConstraint)

        // Uses geometry of the preview edge state
        if (this.edgeState !== null) {
          model.setGeometry(edge, this.edgeState.cell.geometry)
        }

        // let parent = model.getParent(source)

        // Inserts edge before source
        if (this.isInsertBefore(edge, source, target, evt, dropTarget)) {
          // let index = null
          let tmp = source

          while (tmp.parent !== null && tmp.geometry !== null && tmp.geometry.relative && tmp.parent !== edge.parent) {
            tmp = this.graph.model.getParent(tmp)
          }

          if (tmp !== null && tmp.parent !== null && tmp.parent === edge.parent) {
            let index = tmp.parent.getIndex(tmp)
            tmp.parent.insert(edge, index)
          }
        }

        // Makes sure the edge has a non-null, relative geometry
        let geo = model.getGeometry(edge)

        if (geo === null) {
          geo = new MxGeometry()
          geo.relative = true

          model.setGeometry(edge, geo)
        }

        // Uses scaled waypoints in geometry
        if (this.waypoints !== null && this.waypoints.length > 0) {
          let s = this.graph.view.scale
          let tr = this.graph.view.translate
          geo.points = []

          for (let i = 0; i < this.waypoints.length; i++) {
            let pt = this.waypoints[i]
            geo.points.push(new MxPoint(pt.x / s - tr.x, pt.y / s - tr.y))
          }
        }

        if (target === null) {
          let t = this.graph.view.translate
          let s = this.graph.view.scale
          let pt = (this.originalPoint !== null)
            ? new MxPoint(this.originalPoint.x / s - t.x, this.originalPoint.y / s - t.y)
            : new MxPoint(this.currentPoint.x / s - t.x, this.currentPoint.y / s - t.y)
          pt.x -= this.graph.panDx / this.graph.view.scale
          pt.y -= this.graph.panDy / this.graph.view.scale
          geo.setTerminalPoint(pt, false)
        }

        this.fireEvent(new MxEventObject(MxEvent.CONNECT, 'cell', edge, 'terminal', target,
          'event', evt, 'target', dropTarget, 'terminalInserted', terminalInserted))
      }
    } catch (e) {
      MxLog.show()
      MxLog.debug(e.message)
    } finally {
      model.endUpdate()
    }

    if (this.select) {
      this.selectCells(edge, (terminalInserted) ? target : null)
    }
  }
}

/**
 * Function: selectCells
 *
 * Selects the given edge after adding a new connection. The target argument
 * contains the target vertex if one has been inserted.
 */
MxConnectionHandler.prototype.selectCells = function(edge, target) {
  this.graph.setSelectionCell(edge)
}

/**
 * Function: insertEdge
 *
 * Creates, inserts and returns the new edge for the given parameters. This
 * implementation does only use <createEdge> if <factoryMethod> is defined,
 * otherwise <mxGraph.insertEdge> will be used.
 */
MxConnectionHandler.prototype.insertEdge = function(parent, id, value, source, target, style) {
  if (this.factoryMethod === null) {
    return this.graph.insertEdge(parent, id, value, source, target, style)
  } else {
    let edge = this.createEdge(value, source, target, style)
    edge = this.graph.addEdge(edge, parent, source, target)

    return edge
  }
}

/**
 * Function: createTargetVertex
 *
 * Hook method for creating new vertices on the fly if no target was
 * under the mouse. This is only called if <createTarget> is true and
 * returns null.
 *
 * Parameters:
 *
 * evt - Mousedown event of the connect gesture.
 * source - <MxCell> that represents the source terminal.
 */
MxConnectionHandler.prototype.createTargetVertex = function(evt, source) {
  // Uses the first non-relative source
  let geo = this.graph.getCellGeometry(source)

  while (geo !== null && geo.relative) {
    source = this.graph.getModel().getParent(source)
    geo = this.graph.getCellGeometry(source)
  }

  let clone = this.graph.cloneCells([source])[0]
  geo = this.graph.getModel().getGeometry(clone)

  if (geo !== null) {
    let t = this.graph.view.translate
    let s = this.graph.view.scale
    let point = new MxPoint(this.currentPoint.x / s - t.x, this.currentPoint.y / s - t.y)
    geo.x = Math.round(point.x - geo.width / 2 - this.graph.panDx / s)
    geo.y = Math.round(point.y - geo.height / 2 - this.graph.panDy / s)

    // Aligns with source if within certain tolerance
    let tol = this.getAlignmentTolerance()

    if (tol > 0) {
      let sourceState = this.graph.view.getState(source)

      if (sourceState !== null) {
        let x = sourceState.x / s - t.x
        let y = sourceState.y / s - t.y

        if (Math.abs(x - geo.x) <= tol) {
          geo.x = Math.round(x)
        }

        if (Math.abs(y - geo.y) <= tol) {
          geo.y = Math.round(y)
        }
      }
    }
  }

  return clone
}

/**
 * Function: getAlignmentTolerance
 *
 * Returns the tolerance for aligning new targets to sources. This returns the grid size / 2.
 */
MxConnectionHandler.prototype.getAlignmentTolerance = function(evt) {
  return (this.graph.isGridEnabled()) ? this.graph.gridSize / 2 : this.graph.tolerance
}

/**
 * Function: createEdge
 *
 * Creates and returns a new edge using <factoryMethod> if one exists. If
 * no factory method is defined, then a new default edge is returned. The
 * source and target arguments are informal, the actual connection is
 * setup later by the caller of this function.
 *
 * Parameters:
 *
 * value - Value to be used for creating the edge.
 * source - <MxCell> that represents the source terminal.
 * target - <MxCell> that represents the target terminal.
 * style - Optional style from the preview edge.
 */
MxConnectionHandler.prototype.createEdge = function(value, source, target, style) {
  let edge = null

  // Creates a new edge using the factoryMethod
  if (this.factoryMethod !== null) {
    edge = this.factoryMethod(source, target, style)
  }

  if (edge === null) {
    edge = new MxCell(value || '')
    edge.setEdge(true)
    edge.setStyle(style)

    let geo = new MxGeometry()
    geo.relative = true
    edge.setGeometry(geo)
  }

  return edge
}

/**
 * Function: destroy
 *
 * Destroys the handler and all its resources and DOM nodes. This should be
 * called on all instances. It is called automatically for the built-in
 * instance created for each <mxGraph>.
 */
MxConnectionHandler.prototype.destroy = function() {
  this.graph.removeMouseListener(this)

  if (this.shape !== null) {
    this.shape.destroy()
    this.shape = null
  }

  if (this.marker !== null) {
    this.marker.destroy()
    this.marker = null
  }

  if (this.constraintHandler !== null) {
    this.constraintHandler.destroy()
    this.constraintHandler = null
  }

  if (this.changeHandler !== null) {
    this.graph.getModel().removeListener(this.changeHandler)
    this.graph.getView().removeListener(this.changeHandler)
    this.changeHandler = null
  }

  if (this.drillHandler !== null) {
    this.graph.removeListener(this.drillHandler)
    this.graph.getView().removeListener(this.drillHandler)
    this.drillHandler = null
  }

  if (this.escapeHandler !== null) {
    this.graph.removeListener(this.escapeHandler)
    this.escapeHandler = null
  }
}
