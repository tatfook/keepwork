import MxConnector from '../shape/MxConnector'
import MxConstants from '../util/MxConstants'
import MxRectangleShape from '../shape/MxRectangleShape'
import MxText from '../shape/MxText'
import MxEllipse from '../shape/MxEllipse'
import MxRhombus from '../shape/MxRhombus'
import MxCylinder from '../shape/MxCylinder'
import MxActor from '../shape/MxActor'
import MxTriangle from '../shape/MxTriangle'
import MxHexagon from '../shape/MxHexagon'
import MxCloud from '../shape/MxCloud'
import MxLine from '../shape/MxLine'
import MxArrow from '../shape/MxArrow'
import MxArrowConnector from '../shape/MxArrowConnector'
import MxDoubleEllipse from '../shape/MxDoubleEllipse'
import MxSwimlane from '../shape/MxSwimlane'
import MxImageShape from '../shape/MxImageShape'
import MxLabel from '../shape/MxLabel'
import MxStencilRegistry from '../shape/MxStencilRegistry'
import MxShape from '../shape/MxShape'
import MxUtils from '../util/MxUtils'
import MxRectangle from '../util/MxRectangle'
import MxClient from '../MxClient'
import MxEvent from '../util/MxEvent'
import MxMouseEvent from '../util/MxMouseEvent'
import MxDictionary from '../util/MxDictionary'
import MxEventObject from '../util/MxEventObject'
import MxPoint from '../util/MxPoint'

/**
 * Copyright (c) 2006-2017, JGraph Ltd
 * Copyright (c) 2006-2017, Gaudenz Alder
 */
/**
 * Class: MxCellRenderer
 *
 * Renders cells into a document object model. The <defaultShapes> is a global
 * map of shapename, constructor pairs that is used in all instances. You can
 * get a list of all available shape names using the following code.
 *
 * In general the cell renderer is in charge of creating, redrawing and
 * destroying the shape and label associated with a cell state, as well as
 * some other graphical objects, namely controls and overlays. The shape
 * hieararchy in the display (ie. the hierarchy in which the DOM nodes
 * appear in the document) does not reflect the cell hierarchy. The shapes
 * are a (flat) sequence of shapes and labels inside the draw pane of the
 * graph view, with some exceptions, namely the HTML labels being placed
 * directly inside the graph container for certain browsers.
 *
 * (code)
 * mxLog.show();
 * for (var i in MxCellRenderer.defaultShapes)
 * {
 *   mxLog.debug(i);
 * }
 * (end)
 *
 * Constructor: MxCellRenderer
 *
 * Constructs a new cell renderer with the following built-in shapes:
 * arrow, rectangle, ellipse, rhombus, image, line, label, cylinder,
 * swimlane, connector, actor and cloud.
 */
export default class MxCellRenderer {

}

/**
 * Variable: defaultShapes
 *
 * Static array that contains the globally registered shapes which are
 * known to all instances of this class. For adding new shapes you should
 * use the static <MxCellRenderer.registerShape> function.
 */
MxCellRenderer.defaultShapes = {} // new Object()

/**
 * Variable: defaultEdgeShape
 *
 * Defines the default shape for edges. Default is <MxConnector>.
 */
MxCellRenderer.prototype.defaultEdgeShape = MxConnector

/**
 * Variable: defaultVertexShape
 *
 * Defines the default shape for vertices. Default is <MxRectangleShape>.
 */
MxCellRenderer.prototype.defaultVertexShape = MxRectangleShape

/**
 * Variable: DefaultTextShape
 *
 * Defines the default shape for labels. Default is <MxText>.
 */
MxCellRenderer.prototype.DefaultTextShape = MxText

/**
 * Variable: legacyControlPosition
 *
 * Specifies if the folding icon should ignore the horizontal
 * orientation of a swimlane. Default is true.
 */
MxCellRenderer.prototype.legacyControlPosition = true

/**
 * Variable: legacySpacing
 *
 * Specifies if spacing and label position should be ignored if overflow is
 * fill or width. Default is true for backwards compatiblity.
 */
MxCellRenderer.prototype.legacySpacing = true

/**
 * Variable: antiAlias
 *
 * Anti-aliasing option for new shapes. Default is true.
 */
MxCellRenderer.prototype.antiAlias = true

/**
 * Variable: forceControlClickHandler
 *
 * Specifies if the enabled state of the graph should be ignored in the control
 * click handler (to allow folding in disabled graphs). Default is false.
 */
MxCellRenderer.prototype.forceControlClickHandler = false

/**
 * Function: registerShape
 *
 * Registers the given constructor under the specified key in this instance
 * of the renderer.
 *
 * Example:
 *
 * (code)
 * MxCellRenderer.registerShape(MxConstants.SHAPE_RECTANGLE, MxRectangleShape);
 * (end)
 *
 * Parameters:
 *
 * key - String representing the shape name.
 * shape - Constructor of the <MxShape> subclass.
 */
MxCellRenderer.registerShape = function(key, shape) {
  MxCellRenderer.defaultShapes[key] = shape
}

// Adds default shapes into the default shapes array
MxCellRenderer.registerShape(MxConstants.SHAPE_RECTANGLE, MxRectangleShape)
MxCellRenderer.registerShape(MxConstants.SHAPE_ELLIPSE, MxEllipse)
MxCellRenderer.registerShape(MxConstants.SHAPE_RHOMBUS, MxRhombus)
MxCellRenderer.registerShape(MxConstants.SHAPE_CYLINDER, MxCylinder)
MxCellRenderer.registerShape(MxConstants.SHAPE_CONNECTOR, MxConnector)
MxCellRenderer.registerShape(MxConstants.SHAPE_ACTOR, MxActor)
MxCellRenderer.registerShape(MxConstants.SHAPE_TRIANGLE, MxTriangle)
MxCellRenderer.registerShape(MxConstants.SHAPE_HEXAGON, MxHexagon)
MxCellRenderer.registerShape(MxConstants.SHAPE_CLOUD, MxCloud)
MxCellRenderer.registerShape(MxConstants.SHAPE_LINE, MxLine)
MxCellRenderer.registerShape(MxConstants.SHAPE_ARROW, MxArrow)
MxCellRenderer.registerShape(MxConstants.SHAPE_ARROW_CONNECTOR, MxArrowConnector)
MxCellRenderer.registerShape(MxConstants.SHAPE_DOUBLE_ELLIPSE, MxDoubleEllipse)
MxCellRenderer.registerShape(MxConstants.SHAPE_SWIMLANE, MxSwimlane)
MxCellRenderer.registerShape(MxConstants.SHAPE_IMAGE, MxImageShape)
MxCellRenderer.registerShape(MxConstants.SHAPE_LABEL, MxLabel)

/**
 * Function: initializeShape
 *
 * Initializes the shape in the given state by calling its init method with
 * the correct container after configuring it using <configureShape>.
 *
 * Parameters:
 *
 * state - <mxCellState> for which the shape should be initialized.
 */
MxCellRenderer.prototype.initializeShape = function(state) {
  state.shape.dialect = state.view.graph.dialect
  this.configureShape(state)
  state.shape.init(state.view.getDrawPane())
}

/**
 * Function: createShape
 *
 * Creates and returns the shape for the given cell state.
 *
 * Parameters:
 *
 * state - <mxCellState> for which the shape should be created.
 */
MxCellRenderer.prototype.createShape = function(state) {
  var shape = null

  if (state.style !== null) {
    // Checks if there is a stencil for the name and creates
    // a shape instance for the stencil if one exists
    var stencil = MxStencilRegistry.getStencil(state.style[MxConstants.STYLE_SHAPE])

    if (stencil !== null) {
      shape = new MxShape(stencil)
    } else {
      let Ctor = this.getShapeConstructor(state)
      shape = new Ctor()
    }
  }

  return shape
}

/**
 * Function: createIndicatorShape
 *
 * Creates the indicator shape for the given cell state.
 *
 * Parameters:
 *
 * state - <mxCellState> for which the indicator shape should be created.
 */
MxCellRenderer.prototype.createIndicatorShape = function(state) {
  state.shape.indicatorShape = this.getShape(state.view.graph.getIndicatorShape(state))
}

/**
 * Function: getShape
 *
 * Returns the shape for the given name from <defaultShapes>.
 */
MxCellRenderer.prototype.getShape = function(name) {
  return (name !== null) ? MxCellRenderer.defaultShapes[name] : null
}

/**
 * Function: getShapeConstructor
 *
 * Returns the constructor to be used for creating the shape.
 */
MxCellRenderer.prototype.getShapeConstructor = function(state) {
  var ctor = this.getShape(state.style[MxConstants.STYLE_SHAPE])

  if (ctor === null) {
    ctor = (state.view.graph.getModel().isEdge(state.cell))
      ? this.defaultEdgeShape : this.defaultVertexShape
  }

  return ctor
}

/**
 * Function: configureShape
 *
 * Configures the shape for the given cell state.
 *
 * Parameters:
 *
 * state - <mxCellState> for which the shape should be configured.
 */
MxCellRenderer.prototype.configureShape = function(state) {
  state.shape.apply(state)
  state.shape.image = state.view.graph.getImage(state)
  state.shape.indicatorColor = state.view.graph.getIndicatorColor(state)
  state.shape.indicatorStrokeColor = state.style[MxConstants.STYLE_INDICATOR_STROKECOLOR]
  state.shape.indicatorGradientColor = state.view.graph.getIndicatorGradientColor(state)
  state.shape.indicatorDirection = state.style[MxConstants.STYLE_INDICATOR_DIRECTION]
  state.shape.indicatorImage = state.view.graph.getIndicatorImage(state)

  this.postConfigureShape(state)
}

/**
 * Function: postConfigureShape
 *
 * Replaces any reserved words used for attributes, eg. inherit,
 * indicated or swimlane for colors in the shape for the given state.
 * This implementation resolves these keywords on the fill, stroke
 * and gradient color keys.
 */
MxCellRenderer.prototype.postConfigureShape = function(state) {
  if (state.shape !== null) {
    this.resolveColor(state, 'indicatorColor', MxConstants.STYLE_FILLCOLOR)
    this.resolveColor(state, 'indicatorGradientColor', MxConstants.STYLE_GRADIENTCOLOR)
    this.resolveColor(state, 'fill', MxConstants.STYLE_FILLCOLOR)
    this.resolveColor(state, 'stroke', MxConstants.STYLE_STROKECOLOR)
    this.resolveColor(state, 'gradient', MxConstants.STYLE_GRADIENTCOLOR)
  }
}

/**
 * Function: checkPlaceholderStyles
 *
 * Resolves special keywords 'inherit', 'indicated' and 'swimlane' and sets
 * the respective color on the shape.
 */
MxCellRenderer.prototype.checkPlaceholderStyles = function(state) {
  // LATER: Check if the color has actually changed
  if (state.style !== null) {
    var values = ['inherit', 'swimlane', 'indicated']
    var styles = [MxConstants.STYLE_FILLCOLOR, MxConstants.STYLE_STROKECOLOR, MxConstants.STYLE_GRADIENTCOLOR]

    for (var i = 0; i < styles.length; i++) {
      if (MxUtils.indexOf(values, state.style[styles[i]]) >= 0) {
        return true
      }
    }
  }

  return false
}

/**
 * Function: resolveColor
 *
 * Resolves special keywords 'inherit', 'indicated' and 'swimlane' and sets
 * the respective color on the shape.
 */
MxCellRenderer.prototype.resolveColor = function(state, field, key) {
  var value = state.shape[field]
  var graph = state.view.graph
  var referenced = null

  if (value === 'inherit') {
    referenced = graph.model.getParent(state.cell)
  } else if (value === 'swimlane') {
    state.shape[field] = (key === MxConstants.STYLE_STROKECOLOR) ? '#000000' : '#ffffff'

    if (graph.model.getTerminal(state.cell, false) !== null) {
      referenced = graph.model.getTerminal(state.cell, false)
    } else {
      referenced = state.cell
    }

    referenced = graph.getSwimlane(referenced)
    key = graph.swimlaneIndicatorColorAttribute
  } else if (value === 'indicated') {
    state.shape[field] = state.shape.indicatorColor
  }

  if (referenced !== null) {
    var rstate = graph.getView().getState(referenced)
    state.shape[field] = null

    if (rstate !== null) {
      if (rstate.shape !== null && field !== 'indicatorColor') {
        state.shape[field] = rstate.shape[field]
      } else {
        state.shape[field] = rstate.style[key]
      }
    }
  }
}

/**
 * Function: getLabelValue
 *
 * Returns the value to be used for the label.
 *
 * Parameters:
 *
 * state - <mxCellState> for which the label should be created.
 */
MxCellRenderer.prototype.getLabelValue = function(state) {
  return state.view.graph.getLabel(state.cell)
}

/**
 * Function: createLabel
 *
 * Creates the label for the given cell state.
 *
 * Parameters:
 *
 * state - <mxCellState> for which the label should be created.
 */
MxCellRenderer.prototype.createLabel = function(state, value) {
  var graph = state.view.graph
  // var isEdge = graph.getModel().isEdge(state.cell)

  if (state.style[MxConstants.STYLE_FONTSIZE] > 0 || state.style[MxConstants.STYLE_FONTSIZE] === null) {
    // Avoids using DOM node for empty labels
    var isForceHtml = (graph.isHtmlLabel(state.cell) || (value !== null && MxUtils.isNode(value)))

    state.text = new this.DefaultTextShape(value, new MxRectangle(),
      (state.style[MxConstants.STYLE_ALIGN] || MxConstants.ALIGN_CENTER),
      graph.getVerticalAlign(state),
      state.style[MxConstants.STYLE_FONTCOLOR],
      state.style[MxConstants.STYLE_FONTFAMILY],
      state.style[MxConstants.STYLE_FONTSIZE],
      state.style[MxConstants.STYLE_FONTSTYLE],
      state.style[MxConstants.STYLE_SPACING],
      state.style[MxConstants.STYLE_SPACING_TOP],
      state.style[MxConstants.STYLE_SPACING_RIGHT],
      state.style[MxConstants.STYLE_SPACING_BOTTOM],
      state.style[MxConstants.STYLE_SPACING_LEFT],
      state.style[MxConstants.STYLE_HORIZONTAL],
      state.style[MxConstants.STYLE_LABEL_BACKGROUNDCOLOR],
      state.style[MxConstants.STYLE_LABEL_BORDERCOLOR],
      graph.isWrapping(state.cell) && graph.isHtmlLabel(state.cell),
      graph.isLabelClipped(state.cell),
      state.style[MxConstants.STYLE_OVERFLOW],
      state.style[MxConstants.STYLE_LABEL_PADDING],
      MxUtils.getValue(state.style, MxConstants.STYLE_TEXT_DIRECTION, MxConstants.DEFAULT_TEXT_DIRECTION))
    state.text.opacity = MxUtils.getValue(state.style, MxConstants.STYLE_TEXT_OPACITY, 100)
    state.text.dialect = (isForceHtml) ? MxConstants.DIALECT_STRICTHTML : state.view.graph.dialect
    state.text.style = state.style
    state.text.state = state
    this.initializeLabel(state, state.text)

    // Workaround for touch devices routing all events for a mouse gesture
    // (down, move, up) via the initial DOM node. IE additionally redirects
    // the event via the initial DOM node but the event source is the node
    // under the mouse, so we need to check if this is the case and force
    // getCellAt for the subsequent mouseMoves and the final mouseUp.
    var forceGetCell = false

    var getState = function(evt) {
      var result = state

      if (MxClient.IS_TOUCH || forceGetCell) {
        var x = MxEvent.getClientX(evt)
        var y = MxEvent.getClientY(evt)

        // Dispatches the drop event to the graph which
        // consumes and executes the source function
        var pt = MxUtils.convertPoint(graph.container, x, y)
        result = graph.view.getState(graph.getCellAt(pt.x, pt.y))
      }

      return result
    }

    // TODO: Add handling for special touch device gestures
    MxEvent.addGestureListeners(state.text.node,
      MxUtils.bind(this, function(evt) {
        if (this.isLabelEvent(state, evt)) {
          graph.fireMouseEvent(MxEvent.MOUSE_DOWN, new MxMouseEvent(evt, state))
          forceGetCell = graph.dialect !== MxConstants.DIALECT_SVG &&
            MxEvent.getSource(evt).nodeName === 'IMG'
        }
      }),
      MxUtils.bind(this, function(evt) {
        if (this.isLabelEvent(state, evt)) {
          graph.fireMouseEvent(MxEvent.MOUSE_MOVE, new MxMouseEvent(evt, getState(evt)))
        }
      }),
      MxUtils.bind(this, function(evt) {
        if (this.isLabelEvent(state, evt)) {
          graph.fireMouseEvent(MxEvent.MOUSE_UP, new MxMouseEvent(evt, getState(evt)))
          forceGetCell = false
        }
      })
    )

    // Uses double click timeout in mxGraph for quirks mode
    if (graph.nativeDblClickEnabled) {
      MxEvent.addListener(state.text.node, 'dblclick',
        MxUtils.bind(this, function(evt) {
          if (this.isLabelEvent(state, evt)) {
            graph.dblClick(evt, state.cell)
            MxEvent.consume(evt)
          }
        })
      )
    }
  }
}

/**
 * Function: initializeLabel
 *
 * Initiailzes the label with a suitable container.
 *
 * Parameters:
 *
 * state - <mxCellState> whose label should be initialized.
 */
MxCellRenderer.prototype.initializeLabel = function(state, shape) {
  if (MxClient.IS_SVG && MxClient.NO_FO && shape.dialect !== MxConstants.DIALECT_SVG) {
    shape.init(state.view.graph.container)
  } else {
    shape.init(state.view.getDrawPane())
  }
}

/**
 * Function: createCellOverlays
 *
 * Creates the actual shape for showing the overlay for the given cell state.
 *
 * Parameters:
 *
 * state - <mxCellState> for which the overlay should be created.
 */
MxCellRenderer.prototype.createCellOverlays = function(state) {
  var graph = state.view.graph
  var overlays = graph.getCellOverlays(state.cell)
  var dict = null

  if (overlays !== null) {
    dict = new MxDictionary()

    for (var i = 0; i < overlays.length; i++) {
      var shape = (state.overlays !== null) ? state.overlays.remove(overlays[i]) : null

      if (shape === null) {
        var tmp = new MxImageShape(new MxRectangle(), overlays[i].image.src)
        tmp.dialect = state.view.graph.dialect
        tmp.preserveImageAspect = false
        tmp.overlay = overlays[i]
        this.initializeOverlay(state, tmp)
        this.installCellOverlayListeners(state, overlays[i], tmp)

        if (overlays[i].cursor !== null) {
          tmp.node.style.cursor = overlays[i].cursor
        }

        dict.put(overlays[i], tmp)
      } else {
        dict.put(overlays[i], shape)
      }
    }
  }

  // Removes unused
  if (state.overlays !== null) {
    state.overlays.visit(function(id, shape) {
      shape.destroy()
    })
  }

  state.overlays = dict
}

/**
 * Function: initializeOverlay
 *
 * Initializes the given overlay.
 *
 * Parameters:
 *
 * state - <mxCellState> for which the overlay should be created.
 * overlay - <MxImageShape> that represents the overlay.
 */
MxCellRenderer.prototype.initializeOverlay = function(state, overlay) {
  overlay.init(state.view.getOverlayPane())
}

/**
 * Function: installOverlayListeners
 *
 * Installs the listeners for the given <mxCellState>, <mxCellOverlay> and
 * <MxShape> that represents the overlay.
 */
MxCellRenderer.prototype.installCellOverlayListeners = function(state, overlay, shape) {
  var graph = state.view.graph

  MxEvent.addListener(shape.node, 'click', function(evt) {
    if (graph.isEditing()) {
      graph.stopEditing(!graph.isInvokesStopCellEditing())
    }

    overlay.fireEvent(new MxEventObject(MxEvent.CLICK,
      'event', evt, 'cell', state.cell))
  })

  MxEvent.addGestureListeners(shape.node,
    function(evt) {
      MxEvent.consume(evt)
    },
    function(evt) {
      graph.fireMouseEvent(MxEvent.MOUSE_MOVE,
        new MxMouseEvent(evt, state))
    })

  if (MxClient.IS_TOUCH) {
    MxEvent.addListener(shape.node, 'touchend', function(evt) {
      overlay.fireEvent(new MxEventObject(MxEvent.CLICK,
        'event', evt, 'cell', state.cell))
    })
  }
}

/**
 * Function: createControl
 *
 * Creates the control for the given cell state.
 *
 * Parameters:
 *
 * state - <mxCellState> for which the control should be created.
 */
MxCellRenderer.prototype.createControl = function(state) {
  var graph = state.view.graph
  var image = graph.getFoldingImage(state)

  if (graph.foldingEnabled && image !== null) {
    if (state.control === null) {
      var b = new MxRectangle(0, 0, image.width, image.height)
      state.control = new MxImageShape(b, image.src)
      state.control.preserveImageAspect = false
      state.control.dialect = graph.dialect

      this.initControl(state, state.control, true, this.createControlClickHandler(state))
    }
  } else if (state.control !== null) {
    state.control.destroy()
    state.control = null
  }
}

/**
 * Function: createControlClickHandler
 *
 * Hook for creating the click handler for the folding icon.
 *
 * Parameters:
 *
 * state - <mxCellState> whose control click handler should be returned.
 */
MxCellRenderer.prototype.createControlClickHandler = function(state) {
  var graph = state.view.graph

  return MxUtils.bind(this, function(evt) {
    if (this.forceControlClickHandler || graph.isEnabled()) {
      var collapse = !graph.isCellCollapsed(state.cell)
      graph.foldCells(collapse, false, [state.cell], null, evt)
      MxEvent.consume(evt)
    }
  })
}

/**
 * Function: initControl
 *
 * Initializes the given control and returns the corresponding DOM node.
 *
 * Parameters:
 *
 * state - <mxCellState> for which the control should be initialized.
 * control - <MxShape> to be initialized.
 * handleEvents - Boolean indicating if mousedown and mousemove should fire events via the graph.
 * clickHandler - Optional function to implement clicks on the control.
 */
MxCellRenderer.prototype.initControl = function(state, control, handleEvents, clickHandler) {
  var graph = state.view.graph

  // In the special case where the label is in HTML and the display is SVG the image
  // should go into the graph container directly in order to be clickable. Otherwise
  // it is obscured by the HTML label that overlaps the cell.
  var isForceHtml = graph.isHtmlLabel(state.cell) && MxClient.NO_FO &&
    graph.dialect === MxConstants.DIALECT_SVG

  if (isForceHtml) {
    control.dialect = MxConstants.DIALECT_PREFERHTML
    control.init(graph.container)
    control.node.style.zIndex = 1
  } else {
    control.init(state.view.getOverlayPane())
  }

  var node = control.innerNode || control.node

  // Workaround for missing click event on iOS is to check tolerance below
  if (clickHandler !== null && !MxClient.IS_IOS) {
    if (graph.isEnabled()) {
      node.style.cursor = 'pointer'
    }

    MxEvent.addListener(node, 'click', clickHandler)
  }

  if (handleEvents) {
    var first = null

    MxEvent.addGestureListeners(node,
      function(evt) {
        first = new MxPoint(MxEvent.getClientX(evt), MxEvent.getClientY(evt))
        graph.fireMouseEvent(MxEvent.MOUSE_DOWN, new MxMouseEvent(evt, state))
        MxEvent.consume(evt)
      },
      function(evt) {
        graph.fireMouseEvent(MxEvent.MOUSE_MOVE, new MxMouseEvent(evt, state))
      },
      function(evt) {
        graph.fireMouseEvent(MxEvent.MOUSE_UP, new MxMouseEvent(evt, state))
        MxEvent.consume(evt)
      })

    // Uses capture phase for event interception to stop bubble phase
    if (clickHandler !== null && MxClient.IS_IOS) {
      node.addEventListener('touchend', function(evt) {
        if (first !== null) {
          var tol = graph.tolerance

          if (Math.abs(first.x - MxEvent.getClientX(evt)) < tol &&
            Math.abs(first.y - MxEvent.getClientY(evt)) < tol) {
            clickHandler.call(clickHandler, evt)
            MxEvent.consume(evt)
          }
        }
      }, true)
    }
  }

  return node
}

/**
 * Function: isShapeEvent
 *
 * Returns true if the event is for the shape of the given state. This
 * implementation always returns true.
 *
 * Parameters:
 *
 * state - <mxCellState> whose shape fired the event.
 * evt - Mouse event which was fired.
 */
MxCellRenderer.prototype.isShapeEvent = function(state, evt) {
  return true
}

/**
 * Function: isLabelEvent
 *
 * Returns true if the event is for the label of the given state. This
 * implementation always returns true.
 *
 * Parameters:
 *
 * state - <mxCellState> whose label fired the event.
 * evt - Mouse event which was fired.
 */
MxCellRenderer.prototype.isLabelEvent = function(state, evt) {
  return true
}

/**
 * Function: installListeners
 *
 * Installs the event listeners for the given cell state.
 *
 * Parameters:
 *
 * state - <mxCellState> for which the event listeners should be isntalled.
 */
MxCellRenderer.prototype.installListeners = function(state) {
  var graph = state.view.graph

  // Workaround for touch devices routing all events for a mouse
  // gesture (down, move, up) via the initial DOM node. Same for
  // HTML images in all IE versions (VML images are working).
  var getState = function(evt) {
    var result = state

    if ((graph.dialect !== MxConstants.DIALECT_SVG && MxEvent.getSource(evt).nodeName === 'IMG') || MxClient.IS_TOUCH) {
      var x = MxEvent.getClientX(evt)
      var y = MxEvent.getClientY(evt)

      // Dispatches the drop event to the graph which
      // consumes and executes the source function
      var pt = MxUtils.convertPoint(graph.container, x, y)
      result = graph.view.getState(graph.getCellAt(pt.x, pt.y))
    }

    return result
  }

  MxEvent.addGestureListeners(state.shape.node,
    MxUtils.bind(this, function(evt) {
      if (this.isShapeEvent(state, evt)) {
        graph.fireMouseEvent(MxEvent.MOUSE_DOWN, new MxMouseEvent(evt, state))
      }
    }),
    MxUtils.bind(this, function(evt) {
      if (this.isShapeEvent(state, evt)) {
        graph.fireMouseEvent(MxEvent.MOUSE_MOVE, new MxMouseEvent(evt, getState(evt)))
      }
    }),
    MxUtils.bind(this, function(evt) {
      if (this.isShapeEvent(state, evt)) {
        graph.fireMouseEvent(MxEvent.MOUSE_UP, new MxMouseEvent(evt, getState(evt)))
      }
    })
  )

  // Uses double click timeout in mxGraph for quirks mode
  if (graph.nativeDblClickEnabled) {
    MxEvent.addListener(state.shape.node, 'dblclick',
      MxUtils.bind(this, function(evt) {
        if (this.isShapeEvent(state, evt)) {
          graph.dblClick(evt, state.cell)
          MxEvent.consume(evt)
        }
      })
    )
  }
}

/**
 * Function: redrawLabel
 *
 * Redraws the label for the given cell state.
 *
 * Parameters:
 *
 * state - <mxCellState> whose label should be redrawn.
 */
MxCellRenderer.prototype.redrawLabel = function(state, forced) {
  var graph = state.view.graph
  var value = this.getLabelValue(state)
  var wrapping = graph.isWrapping(state.cell)
  var clipping = graph.isLabelClipped(state.cell)
  var isForceHtml = (state.view.graph.isHtmlLabel(state.cell) || (value !== null && MxUtils.isNode(value)))
  var dialect = (isForceHtml) ? MxConstants.DIALECT_STRICTHTML : state.view.graph.dialect
  var overflow = state.style[MxConstants.STYLE_OVERFLOW] || 'visible'

  if (state.text !== null && (state.text.wrap !== wrapping || state.text.clipped !== clipping ||
    state.text.overflow !== overflow || state.text.dialect !== dialect)) {
    state.text.destroy()
    state.text = null
  }

  if (state.text === null && value !== null && (MxUtils.isNode(value) || value.length > 0)) {
    this.createLabel(state, value)
  } else if (state.text !== null && (value === null || value.length === 0)) {
    state.text.destroy()
    state.text = null
  }

  if (state.text !== null) {
    // Forced is true if the style has changed, so to get the updated
    // result in getLabelBounds we apply the new style to the shape
    if (forced) {
      // Checks if a full repaint is needed
      if (state.text.lastValue !== null && this.isTextShapeInvalid(state, state.text)) {
        // Forces a full repaint
        state.text.lastValue = null
      }

      state.text.resetStyles()
      state.text.apply(state)

      // Special case where value is obtained via hook in graph
      state.text.valign = graph.getVerticalAlign(state)
    }

    var bounds = this.getLabelBounds(state)
    var nextScale = this.getTextScale(state)

    if (forced || state.text.value !== value || state.text.isWrapping !== wrapping ||
      state.text.overflow !== overflow || state.text.isClipping !== clipping ||
      state.text.scale !== nextScale || state.text.dialect !== dialect ||
      !state.text.bounds.equals(bounds)) {
      // Forces an update of the text bounding box
      if (state.text.bounds.width !== 0 && state.unscaledWidth !== null &&
        Math.round((state.text.bounds.width /
        state.text.scale * nextScale) - bounds.width) !== 0) {
        state.unscaledWidth = null
      }

      state.text.dialect = dialect
      state.text.value = value
      state.text.bounds = bounds
      state.text.scale = nextScale
      state.text.wrap = wrapping
      state.text.clipped = clipping
      state.text.overflow = overflow

      // Preserves visible state
      var vis = state.text.node.style.visibility
      this.redrawLabelShape(state.text)
      state.text.node.style.visibility = vis
    }
  }
}

/**
 * Function: isTextShapeInvalid
 *
 * Returns true if the style for the text shape has changed.
 *
 * Parameters:
 *
 * state - <mxCellState> whose label should be checked.
 * shape - <MxText> shape to be checked.
 */
MxCellRenderer.prototype.isTextShapeInvalid = function(state, shape) {
  function check(property, stylename, defaultValue) {
    // Workaround for spacing added to directional spacing
    let result
    if (stylename === 'spacingTop' || stylename === 'spacingRight' ||
      stylename === 'spacingBottom' || stylename === 'spacingLeft') {
      result = parseFloat(shape[property]) - parseFloat(shape.spacing) !==
        (state.style[stylename] || defaultValue)
    } else {
      result = shape[property] !== (state.style[stylename] || defaultValue)
    }

    return result
  };

  return check('fontStyle', MxConstants.STYLE_FONTSTYLE, MxConstants.DEFAULT_FONTSTYLE) ||
    check('family', MxConstants.STYLE_FONTFAMILY, MxConstants.DEFAULT_FONTFAMILY) ||
    check('size', MxConstants.STYLE_FONTSIZE, MxConstants.DEFAULT_FONTSIZE) ||
    check('color', MxConstants.STYLE_FONTCOLOR, 'black') ||
    check('align', MxConstants.STYLE_ALIGN, '') ||
    check('valign', MxConstants.STYLE_VERTICAL_ALIGN, '') ||
    check('spacing', MxConstants.STYLE_SPACING, 2) ||
    check('spacingTop', MxConstants.STYLE_SPACING_TOP, 0) ||
    check('spacingRight', MxConstants.STYLE_SPACING_RIGHT, 0) ||
    check('spacingBottom', MxConstants.STYLE_SPACING_BOTTOM, 0) ||
    check('spacingLeft', MxConstants.STYLE_SPACING_LEFT, 0) ||
    check('horizontal', MxConstants.STYLE_HORIZONTAL, true) ||
    check('background', MxConstants.STYLE_LABEL_BACKGROUNDCOLOR) ||
    check('border', MxConstants.STYLE_LABEL_BORDERCOLOR) ||
    check('opacity', MxConstants.STYLE_TEXT_OPACITY, 100) ||
    check('textDirection', MxConstants.STYLE_TEXT_DIRECTION, MxConstants.DEFAULT_TEXT_DIRECTION)
}

/**
 * Function: redrawLabelShape
 *
 * Called to invoked redraw on the given text shape.
 *
 * Parameters:
 *
 * shape - <MxText> shape to be redrawn.
 */
MxCellRenderer.prototype.redrawLabelShape = function(shape) {
  shape.redraw()
}

/**
 * Function: getTextScale
 *
 * Returns the scaling used for the label of the given state
 *
 * Parameters:
 *
 * state - <mxCellState> whose label scale should be returned.
 */
MxCellRenderer.prototype.getTextScale = function(state) {
  return state.view.scale
}

/**
 * Function: getLabelBounds
 *
 * Returns the bounds to be used to draw the label of the given state.
 *
 * Parameters:
 *
 * state - <mxCellState> whose label bounds should be returned.
 */
MxCellRenderer.prototype.getLabelBounds = function(state) {
  var graph = state.view.graph
  var scale = state.view.scale
  var isEdge = graph.getModel().isEdge(state.cell)
  var bounds = new MxRectangle(state.absoluteOffset.x, state.absoluteOffset.y)

  if (isEdge) {
    var spacing = state.text.getSpacing()
    bounds.x += spacing.x * scale
    bounds.y += spacing.y * scale

    var geo = graph.getCellGeometry(state.cell)

    if (geo !== null) {
      bounds.width = Math.max(0, geo.width * scale)
      bounds.height = Math.max(0, geo.height * scale)
    }
  } else {
    // Inverts label position
    if (state.text.isPaintBoundsInverted()) {
      var tmp = bounds.x
      bounds.x = bounds.y
      bounds.y = tmp
    }

    bounds.x += state.x
    bounds.y += state.y

    // Minimum of 1 fixes alignment bug in HTML labels
    bounds.width = Math.max(1, state.width)
    bounds.height = Math.max(1, state.height)

    var sc = MxUtils.getValue(state.style, MxConstants.STYLE_STROKECOLOR, MxConstants.NONE)

    if (sc !== MxConstants.NONE && sc !== '') {
      var s = parseFloat(MxUtils.getValue(state.style, MxConstants.STYLE_STROKEWIDTH, 1)) * scale
      var dx = 1 + Math.floor((s - 1) / 2)
      var dh = Math.floor(s + 1)

      bounds.x += dx
      bounds.y += dx
      bounds.width -= dh
      bounds.height -= dh
    }
  }

  if (state.text.isPaintBoundsInverted()) {
    // Rotates around center of state
    var t = (state.width - state.height) / 2
    bounds.x += t
    bounds.y -= t
    let tmp = bounds.width
    bounds.width = bounds.height
    bounds.height = tmp
  }

  // Shape can modify its label bounds
  if (state.shape !== null) {
    var hpos = MxUtils.getValue(state.style, MxConstants.STYLE_LABEL_POSITION, MxConstants.ALIGN_CENTER)
    var vpos = MxUtils.getValue(state.style, MxConstants.STYLE_VERTICAL_LABEL_POSITION, MxConstants.ALIGN_MIDDLE)

    if (hpos === MxConstants.ALIGN_CENTER && vpos === MxConstants.ALIGN_MIDDLE) {
      bounds = state.shape.getLabelBounds(bounds)
    }
  }

  // Label width style overrides actual label width
  var lw = MxUtils.getValue(state.style, MxConstants.STYLE_LABEL_WIDTH, null)

  if (lw !== null) {
    bounds.width = parseFloat(lw) * scale
  }

  if (!isEdge) {
    this.rotateLabelBounds(state, bounds)
  }

  return bounds
}

/**
 * Function: rotateLabelBounds
 *
 * Adds the shape rotation to the given label bounds and
 * applies the alignment and offsets.
 *
 * Parameters:
 *
 * state - <mxCellState> whose label bounds should be rotated.
 * bounds - <MxRectangle> the rectangle to be rotated.
 */
MxCellRenderer.prototype.rotateLabelBounds = function(state, bounds) {
  bounds.y -= state.text.margin.y * bounds.height
  bounds.x -= state.text.margin.x * bounds.width

  if (!this.legacySpacing || (state.style[MxConstants.STYLE_OVERFLOW] !== 'fill' && state.style[MxConstants.STYLE_OVERFLOW] !== 'width')) {
    var s = state.view.scale
    var spacing = state.text.getSpacing()
    bounds.x += spacing.x * s
    bounds.y += spacing.y * s

    var hpos = MxUtils.getValue(state.style, MxConstants.STYLE_LABEL_POSITION, MxConstants.ALIGN_CENTER)
    var vpos = MxUtils.getValue(state.style, MxConstants.STYLE_VERTICAL_LABEL_POSITION, MxConstants.ALIGN_MIDDLE)
    var lw = MxUtils.getValue(state.style, MxConstants.STYLE_LABEL_WIDTH, null)

    bounds.width = Math.max(0, bounds.width - ((hpos === MxConstants.ALIGN_CENTER && lw === null) ? (state.text.spacingLeft * s + state.text.spacingRight * s) : 0))
    bounds.height = Math.max(0, bounds.height - ((vpos === MxConstants.ALIGN_MIDDLE) ? (state.text.spacingTop * s + state.text.spacingBottom * s) : 0))
  }

  var theta = state.text.getTextRotation()

  // Only needed if rotated around another center
  if (theta !== 0 && state !== null && state.view.graph.model.isVertex(state.cell)) {
    var cx = state.getCenterX()
    var cy = state.getCenterY()

    if (bounds.x !== cx || bounds.y !== cy) {
      var rad = theta * (Math.PI / 180)
      let pt = MxUtils.getRotatedPoint(new MxPoint(bounds.x, bounds.y),
        Math.cos(rad), Math.sin(rad), new MxPoint(cx, cy))

      bounds.x = pt.x
      bounds.y = pt.y
    }
  }
}

/**
 * Function: redrawCellOverlays
 *
 * Redraws the overlays for the given cell state.
 *
 * Parameters:
 *
 * state - <mxCellState> whose overlays should be redrawn.
 */
MxCellRenderer.prototype.redrawCellOverlays = function(state, forced) {
  this.createCellOverlays(state)

  if (state.overlays !== null) {
    var rot = MxUtils.mod(MxUtils.getValue(state.style, MxConstants.STYLE_ROTATION, 0), 90)
    var rad = MxUtils.toRadians(rot)
    var cos = Math.cos(rad)
    var sin = Math.sin(rad)

    state.overlays.visit(function(id, shape) {
      var bounds = shape.overlay.getBounds(state)

      if (!state.view.graph.getModel().isEdge(state.cell)) {
        if (state.shape !== null && rot !== 0) {
          var cx = bounds.getCenterX()
          var cy = bounds.getCenterY()

          var point = MxUtils.getRotatedPoint(new MxPoint(cx, cy), cos, sin,
            new MxPoint(state.getCenterX(), state.getCenterY()))

          cx = point.x
          cy = point.y
          bounds.x = Math.round(cx - bounds.width / 2)
          bounds.y = Math.round(cy - bounds.height / 2)
        }
      }

      if (forced || shape.bounds === null || shape.scale !== state.view.scale ||
        !shape.bounds.equals(bounds)) {
        shape.bounds = bounds
        shape.scale = state.view.scale
        shape.redraw()
      }
    })
  }
}

/**
 * Function: redrawControl
 *
 * Redraws the control for the given cell state.
 *
 * Parameters:
 *
 * state - <mxCellState> whose control should be redrawn.
 */
MxCellRenderer.prototype.redrawControl = function(state, forced) {
  var image = state.view.graph.getFoldingImage(state)

  if (state.control !== null && image !== null) {
    var bounds = this.getControlBounds(state, image.width, image.height)
    var r = (this.legacyControlPosition)
      ? MxUtils.getValue(state.style, MxConstants.STYLE_ROTATION, 0)
      : state.shape.getTextRotation()
    var s = state.view.scale

    if (forced || state.control.scale !== s || !state.control.bounds.equals(bounds) ||
      state.control.rotation !== r) {
      state.control.rotation = r
      state.control.bounds = bounds
      state.control.scale = s

      state.control.redraw()
    }
  }
}

/**
 * Function: getControlBounds
 *
 * Returns the bounds to be used to draw the control (folding icon) of the
 * given state.
 */
MxCellRenderer.prototype.getControlBounds = function(state, w, h) {
  if (state.control !== null) {
    var s = state.view.scale
    var cx = state.getCenterX()
    var cy = state.getCenterY()

    if (!state.view.graph.getModel().isEdge(state.cell)) {
      cx = state.x + w * s
      cy = state.y + h * s

      if (state.shape !== null) {
        // TODO: Factor out common code
        var rot = state.shape.getShapeRotation()

        if (this.legacyControlPosition) {
          rot = MxUtils.getValue(state.style, MxConstants.STYLE_ROTATION, 0)
        } else {
          if (state.shape.isPaintBoundsInverted()) {
            var t = (state.width - state.height) / 2
            cx += t
            cy -= t
          }
        }

        if (rot !== 0) {
          var rad = MxUtils.toRadians(rot)
          var cos = Math.cos(rad)
          var sin = Math.sin(rad)

          var point = MxUtils.getRotatedPoint(new MxPoint(cx, cy), cos, sin,
            new MxPoint(state.getCenterX(), state.getCenterY()))
          cx = point.x
          cy = point.y
        }
      }
    }

    return (state.view.graph.getModel().isEdge(state.cell))
      ? new MxRectangle(Math.round(cx - w / 2 * s), Math.round(cy - h / 2 * s), Math.round(w * s), Math.round(h * s))
      : new MxRectangle(Math.round(cx - w / 2 * s), Math.round(cy - h / 2 * s), Math.round(w * s), Math.round(h * s))
  }

  return null
}

/**
 * Function: insertStateAfter
 *
 * Inserts the given array of <mxShapes> after the given nodes in the DOM.
 *
 * Parameters:
 *
 * shapes - Array of <mxShapes> to be inserted.
 * node - Node in <drawPane> after which the shapes should be inserted.
 * htmlNode - Node in the graph container after which the shapes should be inserted that
 * will not go into the <drawPane> (eg. HTML labels without foreignObjects).
 */
MxCellRenderer.prototype.insertStateAfter = function(state, node, htmlNode) {
  var shapes = this.getShapesForState(state)

  for (var i = 0; i < shapes.length; i++) {
    if (shapes[i] !== null && shapes[i].node !== null) {
      var html = shapes[i].node.parentNode !== state.view.getDrawPane() &&
        shapes[i].node.parentNode !== state.view.getOverlayPane()
      var temp = (html) ? htmlNode : node

      if (temp !== null && temp.nextSibling !== shapes[i].node) {
        if (temp.nextSibling === null) {
          temp.parentNode.appendChild(shapes[i].node)
        } else {
          temp.parentNode.insertBefore(shapes[i].node, temp.nextSibling)
        }
      } else if (temp === null) {
        // Special case: First HTML node should be first sibling after canvas
        if (shapes[i].node.parentNode === state.view.graph.container) {
          var canvas = state.view.canvas

          while (canvas !== null && canvas.parentNode !== state.view.graph.container) {
            canvas = canvas.parentNode
          }

          if (canvas !== null && canvas.nextSibling !== null) {
            if (canvas.nextSibling !== shapes[i].node) {
              shapes[i].node.parentNode.insertBefore(shapes[i].node, canvas.nextSibling)
            }
          } else {
            shapes[i].node.parentNode.appendChild(shapes[i].node)
          }
        } else if (shapes[i].node.parentNode.firstChild !== null && shapes[i].node.parentNode.firstChild !== shapes[i].node) {
          // Inserts the node as the first child of the parent to implement the order
          shapes[i].node.parentNode.insertBefore(shapes[i].node, shapes[i].node.parentNode.firstChild)
        }
      }

      if (html) {
        htmlNode = shapes[i].node
      } else {
        node = shapes[i].node
      }
    }
  }

  return [node, htmlNode]
}

/**
 * Function: getShapesForState
 *
 * Returns the <mxShapes> for the given cell state in the order in which they should
 * appear in the DOM.
 *
 * Parameters:
 *
 * state - <mxCellState> whose shapes should be returned.
 */
MxCellRenderer.prototype.getShapesForState = function(state) {
  return [state.shape, state.text, state.control]
}

/**
 * Function: redraw
 *
 * Updates the bounds or points and scale of the shapes for the given cell
 * state. This is called in mxGraphView.validatePoints as the last step of
 * updating all cells.
 *
 * Parameters:
 *
 * state - <mxCellState> for which the shapes should be updated.
 * force - Optional boolean that specifies if the cell should be reconfiured
 * and redrawn without any additional checks.
 * rendering - Optional boolean that specifies if the cell should actually
 * be drawn into the DOM. If this is false then redraw and/or reconfigure
 * will not be called on the shape.
 */
MxCellRenderer.prototype.redraw = function(state, force, rendering) {
  var shapeChanged = this.redrawShape(state, force, rendering)

  if (state.shape !== null && (rendering === null || rendering)) {
    this.redrawLabel(state, shapeChanged)
    this.redrawCellOverlays(state, shapeChanged)
    this.redrawControl(state, shapeChanged)
  }
}

/**
 * Function: redrawShape
 *
 * Redraws the shape for the given cell state.
 *
 * Parameters:
 *
 * state - <mxCellState> whose label should be redrawn.
 */
MxCellRenderer.prototype.redrawShape = function(state, force, rendering) {
  var model = state.view.graph.model
  var shapeChanged = false

  // Forces creation of new shape if shape style has changed
  if (state.shape !== null && state.shape.style !== null && state.style !== null &&
    state.shape.style[MxConstants.STYLE_SHAPE] !== state.style[MxConstants.STYLE_SHAPE]) {
    state.shape.destroy()
    state.shape = null
  }

  if (state.shape === null && state.view.graph.container !== null &&
    state.cell !== state.view.currentRoot &&
    (model.isVertex(state.cell) || model.isEdge(state.cell))) {
    state.shape = this.createShape(state)

    if (state.shape !== null) {
      state.shape.antiAlias = this.antiAlias

      this.createIndicatorShape(state)
      this.initializeShape(state)
      this.createCellOverlays(state)
      this.installListeners(state)

      // Forces a refresh of the handler if one exists
      state.view.graph.selectionCellsHandler.updateHandler(state)
    }
  } else if (!force && state.shape !== null && (!MxUtils.equalEntries(state.shape.style,
    state.style) || this.checkPlaceholderStyles(state))) {
    state.shape.resetStyles()
    this.configureShape(state)
    // LATER: Ignore update for realtime to fix reset of current gesture
    state.view.graph.selectionCellsHandler.updateHandler(state)
    force = true
  }

  if (state.shape !== null) {
    // Handles changes of the collapse icon
    this.createControl(state)

    // Redraws the cell if required, ignores changes to bounds if points are
    // defined as the bounds are updated for the given points inside the shape
    if (force || this.isShapeInvalid(state, state.shape)) {
      if (state.absolutePoints !== null) {
        state.shape.points = state.absolutePoints.slice()
        state.shape.bounds = null
      } else {
        state.shape.points = null
        state.shape.bounds = new MxRectangle(state.x, state.y, state.width, state.height)
      }

      state.shape.scale = state.view.scale

      if (rendering === null || rendering) {
        this.doRedrawShape(state)
      } else {
        state.shape.updateBoundingBox()
      }

      shapeChanged = true
    }
  }

  return shapeChanged
}

/**
 * Function: doRedrawShape
 *
 * Invokes redraw on the shape of the given state.
 */
MxCellRenderer.prototype.doRedrawShape = function(state) {
  state.shape.redraw()
}

/**
 * Function: isShapeInvalid
 *
 * Returns true if the given shape must be repainted.
 */
MxCellRenderer.prototype.isShapeInvalid = function(state, shape) {
  return shape.bounds === null || shape.scale !== state.view.scale ||
    (state.absolutePoints === null && !shape.bounds.equals(state)) ||
    (state.absolutePoints !== null && !MxUtils.equalPoints(shape.points, state.absolutePoints))
}

/**
 * Function: destroy
 *
 * Destroys the shapes associated with the given cell state.
 *
 * Parameters:
 *
 * state - <mxCellState> for which the shapes should be destroyed.
 */
MxCellRenderer.prototype.destroy = function(state) {
  if (state.shape !== null) {
    if (state.text !== null) {
      state.text.destroy()
      state.text = null
    }

    if (state.overlays !== null) {
      state.overlays.visit(function(id, shape) {
        shape.destroy()
      })

      state.overlays = null
    }

    if (state.control !== null) {
      state.control.destroy()
      state.control = null
    }

    state.shape.destroy()
    state.shape = null
  }
}
