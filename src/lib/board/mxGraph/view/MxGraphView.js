/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxGraphView
 *
 * Extends <MxEventSource> to implement a view for a graph. This class is in
 * charge of computing the absolute coordinates for the relative child
 * geometries, the points for perimeters and edge styles and keeping them
 * cached in <mxCellStates> for faster retrieval. The states are updated
 * whenever the model or the view state (translate, scale) changes. The scale
 * and translate are honoured in the bounds.
 *
 * Event: MxEvent.UNDO
 *
 * Fires after the root was changed in <setCurrentRoot>. The <code>edit</code>
 * property contains the <MxUndoableEdit> which contains the
 * <mxCurrentRootChange>.
 *
 * Event: MxEvent.SCALE_AND_TRANSLATE
 *
 * Fires after the scale and translate have been changed in <scaleAndTranslate>.
 * The <code>scale</code>, <code>previousScale</code>, <code>translate</code>
 * and <code>previousTranslate</code> properties contain the new and previous
 * scale and translate, respectively.
 *
 * Event: MxEvent.SCALE
 *
 * Fires after the scale was changed in <setScale>. The <code>scale</code> and
 * <code>previousScale</code> properties contain the new and previous scale.
 *
 * Event: MxEvent.TRANSLATE
 *
 * Fires after the translate was changed in <setTranslate>. The
 * <code>translate</code> and <code>previousTranslate</code> properties contain
 * the new and previous value for translate.
 *
 * Event: MxEvent.DOWN and MxEvent.UP
 *
 * Fire if the current root is changed by executing an <mxCurrentRootChange>.
 * The event name depends on the location of the root in the cell hierarchy
 * with respect to the current root. The <code>root</code> and
 * <code>previous</code> properties contain the new and previous root,
 * respectively.
 *
 * Constructor: MxGraphView
 *
 * Constructs a new view for the given <mxGraph>.
 *
 * Parameters:
 *
 * graph - Reference to the enclosing <mxGraph>.
 */
import MxEventSource from '../util/MxEventSource'
import MxPoint from '../util/MxPoint'
import MxRectangle from '../util/MxRectangle'
import MxDictionary from '../util/MxDictionary'
import MxClient from '../MxClient'
import MxUndoableEdit from '../util/MxUndoableEdit'
import MxEventObject from '../util/MxEventObject'
import MxEvent from '../util/MxEvent'
import MxLog from '../util/MxLog'
import MxResources from '../util/MxResources'
import MxRectangleShape from '../shape/MxRectangleShape'
import MxImageShape from '../shape/MxImageShape'
import MxUtils from '../util/MxUtils'
import MxMouseEvent from '../util/MxMouseEvent'
import MxConstants from '../util/MxConstants'
import MxStyleRegistry from '../view/MxStyleRegistry'
import MxCellState from './MxCellState'
export default class MxGraphView {
  constructor(graph) {
    this.graph = graph
    this.translate = new MxPoint()
    this.graphBounds = new MxRectangle()
    this.states = new MxDictionary()
  }
}

/**
 * Extends MxEventSource.
 */
MxGraphView.prototype = new MxEventSource()
MxGraphView.prototype.constructor = MxGraphView

/**
 *
 */
MxGraphView.prototype.EMPTY_POINT = new MxPoint()

/**
 * Variable: doneResource
 *
 * Specifies the resource key for the status message after a long operation.
 * If the resource for this key does not exist then the value is used as
 * the status message. Default is 'done'.
 */
MxGraphView.prototype.doneResource = MxClient.language !== 'none' ? 'done' : ''

/**
 * Function: updatingDocumentResource
 *
 * Specifies the resource key for the status message while the document is
 * being updated. If the resource for this key does not exist then the
 * value is used as the status message. Default is 'updatingDocument'.
 */
MxGraphView.prototype.updatingDocumentResource =
  MxClient.language !== 'none' ? 'updatingDocument' : ''

/**
 * Variable: allowEval
 *
 * Specifies if string values in cell styles should be evaluated using
 * <MxUtils.eval>. This will only be used if the string values can't be mapped
 * to objects using <MxStyleRegistry>. Default is false. NOTE: Enabling this
 * switch carries a possible security risk.
 */
MxGraphView.prototype.allowEval = false

/**
 * Variable: captureDocumentGesture
 *
 * Specifies if a gesture should be captured when it goes outside of the
 * graph container. Default is true.
 */
MxGraphView.prototype.captureDocumentGesture = true

/**
 * Variable: optimizeVmlReflows
 *
 * Specifies if the <canvas> should be hidden while rendering in IE8 standards
 * mode and quirks mode. This will significantly improve rendering performance.
 * Default is true.
 */
MxGraphView.prototype.optimizeVmlReflows = true

/**
 * Variable: rendering
 *
 * Specifies if shapes should be created, updated and destroyed using the
 * methods of <mxCellRenderer> in <graph>. Default is true.
 */
MxGraphView.prototype.rendering = true

/**
 * Variable: graph
 *
 * Reference to the enclosing <mxGraph>.
 */
MxGraphView.prototype.graph = null

/**
 * Variable: currentRoot
 *
 * <mxCell> that acts as the root of the displayed cell hierarchy.
 */
MxGraphView.prototype.currentRoot = null

/**
 * Variable: graphBounds
 *
 * <MxRectangle> that caches the scales, translated bounds of the current view.
 */
MxGraphView.prototype.graphBounds = null

/**
 * Variable: scale
 *
 * Specifies the scale. Default is 1 (100%).
 */
MxGraphView.prototype.scale = 1

/**
 * Variable: translate
 *
 * <MxPoint> that specifies the current translation. Default is a new
 * empty <MxPoint>.
 */
MxGraphView.prototype.translate = null

/**
 * Variable: states
 *
 * <MxDictionary> that maps from cell IDs to <mxCellStates>.
 */
MxGraphView.prototype.states = null

/**
 * Variable: updateStyle
 *
 * Specifies if the style should be updated in each validation step. If this
 * is false then the style is only updated if the state is created or if the
 * style of the cell was changed. Default is false.
 */
MxGraphView.prototype.updateStyle = false

/**
 * Variable: lastNode
 *
 * During validation, this contains the last DOM node that was processed.
 */
MxGraphView.prototype.lastNode = null

/**
 * Variable: lastHtmlNode
 *
 * During validation, this contains the last HTML DOM node that was processed.
 */
MxGraphView.prototype.lastHtmlNode = null

/**
 * Variable: lastForegroundNode
 *
 * During validation, this contains the last edge's DOM node that was processed.
 */
MxGraphView.prototype.lastForegroundNode = null

/**
 * Variable: lastForegroundHtmlNode
 *
 * During validation, this contains the last edge HTML DOM node that was processed.
 */
MxGraphView.prototype.lastForegroundHtmlNode = null

/**
 * Function: getGraphBounds
 *
 * Returns <graphBounds>.
 */
MxGraphView.prototype.getGraphBounds = function() {
  return this.graphBounds
}

/**
 * Function: setGraphBounds
 *
 * Sets <graphBounds>.
 */
MxGraphView.prototype.setGraphBounds = function(value) {
  this.graphBounds = value
}

/**
 * Function: getBounds
 *
 * Returns the union of all <mxCellStates> for the given array of <mxCells>.
 *
 * Parameters:
 *
 * cells - Array of <mxCells> whose bounds should be returned.
 */
MxGraphView.prototype.getBounds = function(cells) {
  let result = null

  if (cells !== null && cells.length > 0) {
    let model = this.graph.getModel()

    for (let i = 0; i < cells.length; i++) {
      if (model.isVertex(cells[i]) || model.isEdge(cells[i])) {
        let state = this.getState(cells[i])

        if (state !== null) {
          if (result === null) {
            result = MxRectangle.fromRectangle(state)
          } else {
            result.add(state)
          }
        }
      }
    }
  }

  return result
}

/**
 * Function: setCurrentRoot
 *
 * Sets and returns the current root and fires an <undo> event before
 * calling <mxGraph.sizeDidChange>.
 *
 * Parameters:
 *
 * root - <mxCell> that specifies the root of the displayed cell hierarchy.
 */
MxGraphView.prototype.setCurrentRoot = function(root) {
  if (this.currentRoot !== root) {
    let change = new mxCurrentRootChange(this, root)
    change.execute()
    let edit = new MxUndoableEdit(this, false)
    edit.add(change)
    this.fireEvent(new MxEventObject(MxEvent.UNDO, 'edit', edit))
    this.graph.sizeDidChange()
  }

  return root
}

/**
 * Function: scaleAndTranslate
 *
 * Sets the scale and translation and fires a <scale> and <translate> event
 * before calling <revalidate> followed by <mxGraph.sizeDidChange>.
 *
 * Parameters:
 *
 * scale - Decimal value that specifies the new scale (1 is 100%).
 * dx - X-coordinate of the translation.
 * dy - Y-coordinate of the translation.
 */
MxGraphView.prototype.scaleAndTranslate = function(scale, dx, dy) {
  let previousScale = this.scale
  let previousTranslate = new MxPoint(this.translate.x, this.translate.y)

  if (this.scale !== scale || this.translate.x !== dx || this.translate.y !== dy) {
    this.scale = scale

    this.translate.x = dx
    this.translate.y = dy

    if (this.isEventsEnabled()) {
      this.revalidate()
      this.graph.sizeDidChange()
    }
  }

  this.fireEvent(
    new MxEventObject(
      MxEvent.SCALE_AND_TRANSLATE,
      'scale',
      scale,
      'previousScale',
      previousScale,
      'translate',
      this.translate,
      'previousTranslate',
      previousTranslate
    )
  )
}

/**
 * Function: getScale
 *
 * Returns the <scale>.
 */
MxGraphView.prototype.getScale = function() {
  return this.scale
}

/**
 * Function: setScale
 *
 * Sets the scale and fires a <scale> event before calling <revalidate> followed
 * by <mxGraph.sizeDidChange>.
 *
 * Parameters:
 *
 * value - Decimal value that specifies the new scale (1 is 100%).
 */
MxGraphView.prototype.setScale = function(value) {
  let previousScale = this.scale

  if (this.scale !== value) {
    this.scale = value

    if (this.isEventsEnabled()) {
      this.revalidate()
      this.graph.sizeDidChange()
    }
  }

  this.fireEvent(
    new MxEventObject(
      MxEvent.SCALE,
      'scale',
      value,
      'previousScale',
      previousScale
    )
  )
}

/**
 * Function: getTranslate
 *
 * Returns the <translate>.
 */
MxGraphView.prototype.getTranslate = function() {
  return this.translate
}

/**
 * Function: setTranslate
 *
 * Sets the translation and fires a <translate> event before calling
 * <revalidate> followed by <mxGraph.sizeDidChange>. The translation is the
 * negative of the origin.
 *
 * Parameters:
 *
 * dx - X-coordinate of the translation.
 * dy - Y-coordinate of the translation.
 */
MxGraphView.prototype.setTranslate = function(dx, dy) {
  let previousTranslate = new MxPoint(this.translate.x, this.translate.y)

  if (this.translate.x !== dx || this.translate.y !== dy) {
    this.translate.x = dx
    this.translate.y = dy

    if (this.isEventsEnabled()) {
      this.revalidate()
      this.graph.sizeDidChange()
    }
  }

  this.fireEvent(
    new MxEventObject(
      MxEvent.TRANSLATE,
      'translate',
      this.translate,
      'previousTranslate',
      previousTranslate
    )
  )
}

/**
 * Function: refresh
 *
 * Clears the view if <currentRoot> is not null and revalidates.
 */
MxGraphView.prototype.refresh = function() {
  if (this.currentRoot !== null) {
    this.clear()
  }

  this.revalidate()
}

/**
 * Function: revalidate
 *
 * Revalidates the complete view with all cell states.
 */
MxGraphView.prototype.revalidate = function() {
  this.invalidate()
  this.validate()
}

/**
 * Function: clear
 *
 * Removes the state of the given cell and all descendants if the given
 * cell is not the current root.
 *
 * Parameters:
 *
 * cell - Optional <mxCell> for which the state should be removed. Default
 * is the root of the model.
 * force - Boolean indicating if the current root should be ignored for
 * recursion.
 */
MxGraphView.prototype.clear = function(cell, force, recurse) {
  let model = this.graph.getModel()
  cell = cell || model.getRoot()
  force = force !== null ? force : false
  recurse = recurse !== null ? recurse : true

  this.removeState(cell)

  if (recurse && (force || cell !== this.currentRoot)) {
    let childCount = model.getChildCount(cell)

    for (let i = 0; i < childCount; i++) {
      this.clear(model.getChildAt(cell, i), force)
    }
  } else {
    this.invalidate(cell)
  }
}

/**
 * Function: invalidate
 *
 * Invalidates the state of the given cell, all its descendants and
 * connected edges.
 *
 * Parameters:
 *
 * cell - Optional <mxCell> to be invalidated. Default is the root of the
 * model.
 */
MxGraphView.prototype.invalidate = function(cell, recurse, includeEdges) {
  let model = this.graph.getModel()
  cell = cell || model.getRoot()
  recurse = recurse !== null ? recurse : true
  includeEdges = includeEdges !== null ? includeEdges : true

  let state = this.getState(cell)

  if (state !== null) {
    state.invalid = true
  }

  // Avoids infinite loops for invalid graphs
  if (!cell.invalidating) {
    cell.invalidating = true

    // Recursively invalidates all descendants
    if (recurse) {
      let childCount = model.getChildCount(cell)

      for (let i = 0; i < childCount; i++) {
        let child = model.getChildAt(cell, i)
        this.invalidate(child, recurse, includeEdges)
      }
    }

    // Propagates invalidation to all connected edges
    if (includeEdges) {
      let edgeCount = model.getEdgeCount(cell)

      for (let i = 0; i < edgeCount; i++) {
        this.invalidate(model.getEdgeAt(cell, i), recurse, includeEdges)
      }
    }

    delete cell.invalidating
  }
}

/**
 * Function: validate
 *
 * Calls <validateCell> and <validateCellState> and updates the <graphBounds>
 * using <getBoundingBox>. Finally the background is validated using
 * <validateBackground>.
 *
 * Parameters:
 *
 * cell - Optional <mxCell> to be used as the root of the validation.
 * Default is <currentRoot> or the root of the model.
 */
MxGraphView.prototype.validate = function(cell) {
  let t0 = MxLog.enter('MxGraphView.validate')
  window.status =
    MxResources.get(this.updatingDocumentResource) ||
    this.updatingDocumentResource

  this.resetValidationState()

  // Improves IE rendering speed by minimizing reflows
  let prevDisplay = null

  if (
    this.optimizeVmlReflows &&
    this.canvas !== null &&
    this.textDiv === null &&
    ((document.documentMode === 8 && !MxClient.IS_EM) || MxClient.IS_QUIRKS)
  ) {
    // Placeholder keeps scrollbar positions when canvas is hidden
    this.placeholder = document.createElement('div')
    this.placeholder.style.position = 'absolute'
    this.placeholder.style.width = this.canvas.clientWidth + 'px'
    this.placeholder.style.height = this.canvas.clientHeight + 'px'
    this.canvas.parentNode.appendChild(this.placeholder)

    prevDisplay = this.drawPane.style.display
    this.canvas.style.display = 'none'

    // Creates temporary DIV used for text measuring in mxText.updateBoundingBox
    this.textDiv = document.createElement('div')
    this.textDiv.style.position = 'absolute'
    this.textDiv.style.whiteSpace = 'nowrap'
    this.textDiv.style.visibility = 'hidden'
    this.textDiv.style.display = MxClient.IS_QUIRKS ? 'inline' : 'inline-block'
    this.textDiv.style.zoom = '1'

    document.body.appendChild(this.textDiv)
  }

  let graphBounds = this.getBoundingBox(
    this.validateCellState(
      this.validateCell(
        cell ||
          (this.currentRoot !== null
            ? this.currentRoot
            : this.graph.getModel().getRoot())
      )
    )
  )
  this.setGraphBounds(graphBounds !== null ? graphBounds : this.getEmptyBounds())
  this.validateBackground()

  if (prevDisplay !== null) {
    this.canvas.style.display = prevDisplay
    this.textDiv.parentNode.removeChild(this.textDiv)

    if (this.placeholder !== null) {
      this.placeholder.parentNode.removeChild(this.placeholder)
    }

    // Textdiv cannot be reused
    this.textDiv = null
  }

  this.resetValidationState()

  window.status = MxResources.get(this.doneResource) || this.doneResource
  MxLog.leave('MxGraphView.validate', t0)
}

/**
 * Function: getEmptyBounds
 *
 * Returns the bounds for an empty graph. This returns a rectangle at
 * <translate> with the size of 0 x 0.
 */
MxGraphView.prototype.getEmptyBounds = function() {
  return new MxRectangle(
    this.translate.x * this.scale,
    this.translate.y * this.scale
  )
}

/**
 * Function: getBoundingBox
 *
 * Returns the bounding box of the shape and the label for the given
 * <MxCellState> and its children if recurse is true.
 *
 * Parameters:
 *
 * state - <MxCellState> whose bounding box should be returned.
 * recurse - Optional boolean indicating if the children should be included.
 * Default is true.
 */
MxGraphView.prototype.getBoundingBox = function(state, recurse) {
  recurse = recurse !== null ? recurse : true
  let bbox = null

  if (state !== null) {
    if (state.shape !== null && state.shape.boundingBox !== null) {
      bbox = state.shape.boundingBox.clone()
    }

    // Adds label bounding box to graph bounds
    if (state.text !== null && state.text.boundingBox !== null) {
      if (bbox !== null) {
        bbox.add(state.text.boundingBox)
      } else {
        bbox = state.text.boundingBox.clone()
      }
    }

    if (recurse) {
      let model = this.graph.getModel()
      let childCount = model.getChildCount(state.cell)

      for (let i = 0; i < childCount; i++) {
        let bounds = this.getBoundingBox(
          this.getState(model.getChildAt(state.cell, i))
        )

        if (bounds !== null) {
          if (bbox === null) {
            bbox = bounds
          } else {
            bbox.add(bounds)
          }
        }
      }
    }
  }

  return bbox
}

/**
 * Function: createBackgroundPageShape
 *
 * Creates and returns the shape used as the background page.
 *
 * Parameters:
 *
 * bounds - <MxRectangle> that represents the bounds of the shape.
 */
MxGraphView.prototype.createBackgroundPageShape = function(bounds) {
  return new MxRectangleShape(bounds, 'white', 'black')
}

/**
 * Function: validateBackground
 *
 * Calls <validateBackgroundImage> and <validateBackgroundPage>.
 */
MxGraphView.prototype.validateBackground = function() {
  this.validateBackgroundImage()
  this.validateBackgroundPage()
}

/**
 * Function: validateBackgroundImage
 *
 * Validates the background image.
 */
MxGraphView.prototype.validateBackgroundImage = function() {
  let bg = this.graph.getBackgroundImage()

  if (bg !== null) {
    if (this.backgroundImage === null || this.backgroundImage.image !== bg.src) {
      if (this.backgroundImage !== null) {
        this.backgroundImage.destroy()
      }

      let bounds = new MxRectangle(0, 0, 1, 1)

      this.backgroundImage = new MxImageShape(bounds, bg.src)
      this.backgroundImage.dialect = this.graph.dialect
      this.backgroundImage.init(this.backgroundPane)
      this.backgroundImage.redraw()

      // Workaround for ignored event on background in IE8 standards mode
      if (document.documentMode === 8 && !MxClient.IS_EM) {
        MxEvent.addGestureListeners(
          this.backgroundImage.node,
          MxUtils.bind(this, function(evt) {
            this.graph.fireMouseEvent(MxEvent.MOUSE_DOWN, new MxMouseEvent(evt))
          }),
          MxUtils.bind(this, function(evt) {
            this.graph.fireMouseEvent(MxEvent.MOUSE_MOVE, new MxMouseEvent(evt))
          }),
          MxUtils.bind(this, function(evt) {
            this.graph.fireMouseEvent(MxEvent.MOUSE_UP, new MxMouseEvent(evt))
          })
        )
      }
    }

    this.redrawBackgroundImage(this.backgroundImage, bg)
  } else if (this.backgroundImage !== null) {
    this.backgroundImage.destroy()
    this.backgroundImage = null
  }
}

/**
 * Function: validateBackgroundPage
 *
 * Validates the background page.
 */
MxGraphView.prototype.validateBackgroundPage = function() {
  if (this.graph.pageVisible) {
    let bounds = this.getBackgroundPageBounds()

    if (this.backgroundPageShape === null) {
      this.backgroundPageShape = this.createBackgroundPageShape(bounds)
      this.backgroundPageShape.scale = this.scale
      this.backgroundPageShape.isShadow = true
      this.backgroundPageShape.dialect = this.graph.dialect
      this.backgroundPageShape.init(this.backgroundPane)
      this.backgroundPageShape.redraw()

      // Adds listener for double click handling on background
      if (this.graph.nativeDblClickEnabled) {
        MxEvent.addListener(
          this.backgroundPageShape.node,
          'dblclick',
          MxUtils.bind(this, function(evt) {
            this.graph.dblClick(evt)
          })
        )
      }

      // Adds basic listeners for graph event dispatching outside of the
      // container and finishing the handling of a single gesture
      MxEvent.addGestureListeners(
        this.backgroundPageShape.node,
        MxUtils.bind(this, function(evt) {
          this.graph.fireMouseEvent(MxEvent.MOUSE_DOWN, new MxMouseEvent(evt))
        }),
        MxUtils.bind(this, function(evt) {
          // Hides the tooltip if mouse is outside container
          if (
            this.graph.tooltipHandler !== null &&
            this.graph.tooltipHandler.isHideOnHover()
          ) {
            this.graph.tooltipHandler.hide()
          }

          if (this.graph.isMouseDown && !MxEvent.isConsumed(evt)) {
            this.graph.fireMouseEvent(MxEvent.MOUSE_MOVE, new MxMouseEvent(evt))
          }
        }),
        MxUtils.bind(this, function(evt) {
          this.graph.fireMouseEvent(MxEvent.MOUSE_UP, new MxMouseEvent(evt))
        })
      )
    } else {
      this.backgroundPageShape.scale = this.scale
      this.backgroundPageShape.bounds = bounds
      this.backgroundPageShape.redraw()
    }
  } else if (this.backgroundPageShape !== null) {
    this.backgroundPageShape.destroy()
    this.backgroundPageShape = null
  }
}

/**
 * Function: getBackgroundPageBounds
 *
 * Returns the bounds for the background page.
 */
MxGraphView.prototype.getBackgroundPageBounds = function() {
  let fmt = this.graph.pageFormat
  let ps = this.scale * this.graph.pageScale
  let bounds = new MxRectangle(
    this.scale * this.translate.x,
    this.scale * this.translate.y,
    fmt.width * ps,
    fmt.height * ps
  )

  return bounds
}

/**
 * Function: redrawBackgroundImage
 *
 * Updates the bounds and redraws the background image.
 *
 * Example:
 *
 * If the background image should not be scaled, this can be replaced with
 * the following.
 *
 * (code)
 * MxGraphView.prototype.redrawBackground = function(backgroundImage, bg)
 * {
 *   backgroundImage.bounds.x = this.translate.x;
 *   backgroundImage.bounds.y = this.translate.y;
 *   backgroundImage.bounds.width = bg.width;
 *   backgroundImage.bounds.height = bg.height;
 *
 *   backgroundImage.redraw();
 * };
 * (end)
 *
 * Parameters:
 *
 * backgroundImage - <MxImageShape> that represents the background image.
 * bg - <mxImage> that specifies the image and its dimensions.
 */
MxGraphView.prototype.redrawBackgroundImage = function(backgroundImage, bg) {
  backgroundImage.scale = this.scale
  backgroundImage.bounds.x = this.scale * this.translate.x
  backgroundImage.bounds.y = this.scale * this.translate.y
  backgroundImage.bounds.width = this.scale * bg.width
  backgroundImage.bounds.height = this.scale * bg.height

  backgroundImage.redraw()
}

/**
 * Function: validateCell
 *
 * Recursively creates the cell state for the given cell if visible is true and
 * the given cell is visible. If the cell is not visible but the state exists
 * then it is removed using <removeState>.
 *
 * Parameters:
 *
 * cell - <mxCell> whose <MxCellState> should be created.
 * visible - Optional boolean indicating if the cell should be visible. Default
 * is true.
 */
MxGraphView.prototype.validateCell = function(cell, visible) {
  visible = visible !== null ? visible : true

  if (cell !== null) {
    visible = visible && this.graph.isCellVisible(cell)
    let state = this.getState(cell, visible)

    if (state !== null && !visible) {
      this.removeState(cell)
    } else {
      let model = this.graph.getModel()
      let childCount = model.getChildCount(cell)

      for (let i = 0; i < childCount; i++) {
        this.validateCell(
          model.getChildAt(cell, i),
          visible && (!this.isCellCollapsed(cell) || cell === this.currentRoot)
        )
      }
    }
  }

  return cell
}

/**
 * Function: validateCellState
 *
 * Validates and repaints the <MxCellState> for the given <mxCell>.
 *
 * Parameters:
 *
 * cell - <mxCell> whose <MxCellState> should be validated.
 * recurse - Optional boolean indicating if the children of the cell should be
 * validated. Default is true.
 */
MxGraphView.prototype.validateCellState = function(cell, recurse) {
  recurse = recurse !== null ? recurse : true
  let state = null

  if (cell !== null) {
    state = this.getState(cell)

    if (state !== null) {
      let model = this.graph.getModel()

      if (state.invalid) {
        state.invalid = false

        if (state.style === null) {
          state.style = this.graph.getCellStyle(state.cell)
        }

        if (cell !== this.currentRoot) {
          this.validateCellState(model.getParent(cell), false)
        }

        state.setVisibleTerminalState(
          this.validateCellState(this.getVisibleTerminal(cell, true), false),
          true
        )
        state.setVisibleTerminalState(
          this.validateCellState(this.getVisibleTerminal(cell, false), false),
          false
        )

        this.updateCellState(state)

        // Repaint happens immediately after the cell is validated
        if (cell !== this.currentRoot && !state.invalid) {
          this.graph.cellRenderer.redraw(state, false, this.isRendering())

          // Handles changes to invertex paintbounds after update of rendering shape
          state.updateCachedBounds()
        }
      }

      if (recurse && !state.invalid) {
        // Updates order in DOM if recursively traversing
        if (state.shape !== null) {
          this.stateValidated(state)
        }

        let childCount = model.getChildCount(cell)

        for (let i = 0; i < childCount; i++) {
          this.validateCellState(model.getChildAt(cell, i))
        }
      }
    }
  }

  return state
}

/**
 * Function: updateCellState
 *
 * Updates the given <MxCellState>.
 *
 * Parameters:
 *
 * state - <MxCellState> to be updated.
 */
MxGraphView.prototype.updateCellState = function(state) {
  state.absoluteOffset.x = 0
  state.absoluteOffset.y = 0
  state.origin.x = 0
  state.origin.y = 0
  state.length = 0

  if (state.cell !== this.currentRoot) {
    let model = this.graph.getModel()
    let pState = this.getState(model.getParent(state.cell))

    if (pState !== null && pState.cell !== this.currentRoot) {
      state.origin.x += pState.origin.x
      state.origin.y += pState.origin.y
    }

    let offset = this.graph.getChildOffsetForCell(state.cell)

    if (offset !== null) {
      state.origin.x += offset.x
      state.origin.y += offset.y
    }

    let geo = this.graph.getCellGeometry(state.cell)

    if (geo !== null) {
      if (!model.isEdge(state.cell)) {
        offset = geo.offset || this.EMPTY_POINT

        if (geo.relative && pState !== null) {
          if (model.isEdge(pState.cell)) {
            let origin = this.getPoint(pState, geo)

            if (origin !== null) {
              state.origin.x +=
                origin.x / this.scale - pState.origin.x - this.translate.x
              state.origin.y +=
                origin.y / this.scale - pState.origin.y - this.translate.y
            }
          } else {
            state.origin.x += (geo.x * pState.width) / this.scale + offset.x
            state.origin.y += (geo.y * pState.height) / this.scale + offset.y
          }
        } else {
          state.absoluteOffset.x = this.scale * offset.x
          state.absoluteOffset.y = this.scale * offset.y
          state.origin.x += geo.x
          state.origin.y += geo.y
        }
      }

      state.x = this.scale * (this.translate.x + state.origin.x)
      state.y = this.scale * (this.translate.y + state.origin.y)
      state.width = this.scale * geo.width
      state.unscaledWidth = geo.width
      state.height = this.scale * geo.height

      if (model.isVertex(state.cell)) {
        this.updateVertexState(state, geo)
      }

      if (model.isEdge(state.cell)) {
        this.updateEdgeState(state, geo)
      }
    }
  }

  state.updateCachedBounds()
}

/**
 * Function: isCellCollapsed
 *
 * Returns true if the children of the given cell should not be visible in the
 * view. This implementation uses <mxGraph.isCellVisible> but it can be
 * overidden to use a separate condition.
 */
MxGraphView.prototype.isCellCollapsed = function(cell) {
  return this.graph.isCellCollapsed(cell)
}

/**
 * Function: updateVertexState
 *
 * Validates the given cell state.
 */
MxGraphView.prototype.updateVertexState = function(state, geo) {
  let model = this.graph.getModel()
  let pState = this.getState(model.getParent(state.cell))

  if (geo.relative && pState !== null && !model.isEdge(pState.cell)) {
    let alpha = MxUtils.toRadians(
      pState.style[MxConstants.STYLE_ROTATION] || '0'
    )

    if (alpha !== 0) {
      let cos = Math.cos(alpha)
      let sin = Math.sin(alpha)

      let ct = new MxPoint(state.getCenterX(), state.getCenterY())
      let cx = new MxPoint(pState.getCenterX(), pState.getCenterY())
      let pt = MxUtils.getRotatedPoint(ct, cos, sin, cx)
      state.x = pt.x - state.width / 2
      state.y = pt.y - state.height / 2
    }
  }

  this.updateVertexLabelOffset(state)
}

/**
 * Function: updateEdgeState
 *
 * Validates the given cell state.
 */
MxGraphView.prototype.updateEdgeState = function(state, geo) {
  let source = state.getVisibleTerminalState(true)
  let target = state.getVisibleTerminalState(false)

  // This will remove edges with no terminals and no terminal points
  // as such edges are invalid and produce NPEs in the edge styles.
  // Also removes connected edges that have no visible terminals.
  if (
    (this.graph.model.getTerminal(state.cell, true) !== null &&
      source === null) ||
    (source === null && geo.getTerminalPoint(true) === null) ||
    (this.graph.model.getTerminal(state.cell, false) !== null &&
      target === null) ||
    (target === null && geo.getTerminalPoint(false) === null)
  ) {
    this.clear(state.cell, true)
  } else {
    this.updateFixedTerminalPoints(state, source, target)
    this.updatePoints(state, geo.points, source, target)
    this.updateFloatingTerminalPoints(state, source, target)

    let pts = state.absolutePoints

    if (
      state.cell !== this.currentRoot &&
      (pts === null ||
        pts.length < 2 ||
        pts[0] === null ||
        pts[pts.length - 1] === null)
    ) {
      // This will remove edges with invalid points from the list of states in the view.
      // Happens if the one of the terminals and the corresponding terminal point is null.
      this.clear(state.cell, true)
    } else {
      this.updateEdgeBounds(state)
      this.updateEdgeLabelOffset(state)
    }
  }
}

/**
 * Function: updateVertexLabelOffset
 *
 * Updates the absoluteOffset of the given vertex cell state. This takes
 * into account the label position styles.
 *
 * Parameters:
 *
 * state - <MxCellState> whose absolute offset should be updated.
 */
MxGraphView.prototype.updateVertexLabelOffset = function(state) {
  let h = MxUtils.getValue(
    state.style,
    MxConstants.STYLE_LABEL_POSITION,
    MxConstants.ALIGN_CENTER
  )

  if (h === MxConstants.ALIGN_LEFT) {
    let lw = MxUtils.getValue(state.style, MxConstants.STYLE_LABEL_WIDTH, null)

    if (lw !== null) {
      lw *= this.scale
    } else {
      lw = state.width
    }

    state.absoluteOffset.x -= lw
  } else if (h === MxConstants.ALIGN_RIGHT) {
    state.absoluteOffset.x += state.width
  } else if (h === MxConstants.ALIGN_CENTER) {
    let lw = MxUtils.getValue(state.style, MxConstants.STYLE_LABEL_WIDTH, null)

    if (lw !== null) {
      // Aligns text block with given width inside the vertex width
      let align = MxUtils.getValue(
        state.style,
        MxConstants.STYLE_ALIGN,
        MxConstants.ALIGN_CENTER
      )
      let dx = 0

      if (align === MxConstants.ALIGN_CENTER) {
        dx = 0.5
      } else if (align === MxConstants.ALIGN_RIGHT) {
        dx = 1
      }

      if (dx !== 0) {
        state.absoluteOffset.x -= (lw * this.scale - state.width) * dx
      }
    }
  }

  let v = MxUtils.getValue(
    state.style,
    MxConstants.STYLE_VERTICAL_LABEL_POSITION,
    MxConstants.ALIGN_MIDDLE
  )

  if (v === MxConstants.ALIGN_TOP) {
    state.absoluteOffset.y -= state.height
  } else if (v === MxConstants.ALIGN_BOTTOM) {
    state.absoluteOffset.y += state.height
  }
}

/**
 * Function: resetValidationState
 *
 * Resets the current validation state.
 */
MxGraphView.prototype.resetValidationState = function() {
  this.lastNode = null
  this.lastHtmlNode = null
  this.lastForegroundNode = null
  this.lastForegroundHtmlNode = null
}

/**
 * Function: stateValidated
 *
 * Invoked when a state has been processed in <validatePoints>. This is used
 * to update the order of the DOM nodes of the shape.
 *
 * Parameters:
 *
 * state - <MxCellState> that represents the cell state.
 */
MxGraphView.prototype.stateValidated = function(state) {
  let fg =
    (this.graph.getModel().isEdge(state.cell) &&
      this.graph.keepEdgesInForeground) ||
    (this.graph.getModel().isVertex(state.cell) &&
      this.graph.keepEdgesInBackground)
  let htmlNode = fg
    ? this.lastForegroundHtmlNode || this.lastHtmlNode
    : this.lastHtmlNode
  let node = fg ? this.lastForegroundNode || this.lastNode : this.lastNode
  let result = this.graph.cellRenderer.insertStateAfter(state, node, htmlNode)

  if (fg) {
    this.lastForegroundHtmlNode = result[1]
    this.lastForegroundNode = result[0]
  } else {
    this.lastHtmlNode = result[1]
    this.lastNode = result[0]
  }
}

/**
 * Function: updateFixedTerminalPoints
 *
 * Sets the initial absolute terminal points in the given state before the edge
 * style is computed.
 *
 * Parameters:
 *
 * edge - <MxCellState> whose initial terminal points should be updated.
 * source - <MxCellState> which represents the source terminal.
 * target - <MxCellState> which represents the target terminal.
 */
MxGraphView.prototype.updateFixedTerminalPoints = function(
  edge,
  source,
  target
) {
  this.updateFixedTerminalPoint(
    edge,
    source,
    true,
    this.graph.getConnectionConstraint(edge, source, true)
  )
  this.updateFixedTerminalPoint(
    edge,
    target,
    false,
    this.graph.getConnectionConstraint(edge, target, false)
  )
}

/**
 * Function: updateFixedTerminalPoint
 *
 * Sets the fixed source or target terminal point on the given edge.
 *
 * Parameters:
 *
 * edge - <MxCellState> whose terminal point should be updated.
 * terminal - <MxCellState> which represents the actual terminal.
 * source - Boolean that specifies if the terminal is the source.
 * constraint - <mxConnectionConstraint> that specifies the connection.
 */
MxGraphView.prototype.updateFixedTerminalPoint = function(
  edge,
  terminal,
  source,
  constraint
) {
  edge.setAbsoluteTerminalPoint(
    this.getFixedTerminalPoint(edge, terminal, source, constraint),
    source
  )
}

/**
 * Function: getFixedTerminalPoint
 *
 * Returns the fixed source or target terminal point for the given edge.
 *
 * Parameters:
 *
 * edge - <MxCellState> whose terminal point should be returned.
 * terminal - <MxCellState> which represents the actual terminal.
 * source - Boolean that specifies if the terminal is the source.
 * constraint - <mxConnectionConstraint> that specifies the connection.
 */
MxGraphView.prototype.getFixedTerminalPoint = function(
  edge,
  terminal,
  source,
  constraint
) {
  let pt = null

  if (constraint !== null) {
    pt = this.graph.getConnectionPoint(terminal, constraint)
  }

  if (pt === null && terminal === null) {
    let s = this.scale
    let tr = this.translate
    let orig = edge.origin
    let geo = this.graph.getCellGeometry(edge.cell)
    pt = geo.getTerminalPoint(source)

    if (pt !== null) {
      pt = new MxPoint(s * (tr.x + pt.x + orig.x), s * (tr.y + pt.y + orig.y))
    }
  }

  return pt
}

/**
 * Function: updateBoundsFromStencil
 *
 * Updates the bounds of the given cell state to reflect the bounds of the stencil
 * if it has a fixed aspect and returns the previous bounds as an <MxRectangle> if
 * the bounds have been modified or null otherwise.
 *
 * Parameters:
 *
 * edge - <MxCellState> whose bounds should be updated.
 */
MxGraphView.prototype.updateBoundsFromStencil = function(state) {
  let previous = null

  if (
    state !== null &&
    state.shape !== null &&
    state.shape.stencil !== null &&
    state.shape.stencil.aspect === 'fixed'
  ) {
    previous = MxRectangle.fromRectangle(state)
    let asp = state.shape.stencil.computeAspect(
      state.style,
      state.x,
      state.y,
      state.width,
      state.height
    )
    state.setRect(
      asp.x,
      asp.y,
      state.shape.stencil.w0 * asp.width,
      state.shape.stencil.h0 * asp.height
    )
  }

  return previous
}

/**
 * Function: updatePoints
 *
 * Updates the absolute points in the given state using the specified array
 * of <mxPoints> as the relative points.
 *
 * Parameters:
 *
 * edge - <MxCellState> whose absolute points should be updated.
 * points - Array of <mxPoints> that constitute the relative points.
 * source - <MxCellState> that represents the source terminal.
 * target - <MxCellState> that represents the target terminal.
 */
MxGraphView.prototype.updatePoints = function(edge, points, source, target) {
  if (edge !== null) {
    let pts = []
    pts.push(edge.absolutePoints[0])
    let edgeStyle = this.getEdgeStyle(edge, points, source, target)

    if (edgeStyle !== null) {
      let src = this.getTerminalPort(edge, source, true)
      let trg = this.getTerminalPort(edge, target, false)

      // Uses the stencil bounds for routing and restores after routing
      let srcBounds = this.updateBoundsFromStencil(src)
      let trgBounds = this.updateBoundsFromStencil(trg)

      edgeStyle(edge, src, trg, points, pts)

      // Restores previous bounds
      if (srcBounds !== null) {
        src.setRect(srcBounds.x, srcBounds.y, srcBounds.width, srcBounds.height)
      }

      if (trgBounds !== null) {
        trg.setRect(trgBounds.x, trgBounds.y, trgBounds.width, trgBounds.height)
      }
    } else if (points !== null) {
      for (let i = 0; i < points.length; i++) {
        if (points[i] !== null) {
          let pt = MxUtils.clone(points[i])
          pts.push(this.transformControlPoint(edge, pt))
        }
      }
    }

    let tmp = edge.absolutePoints
    pts.push(tmp[tmp.length - 1])

    edge.absolutePoints = pts
  }
}

/**
 * Function: transformControlPoint
 *
 * Transforms the given control point to an absolute point.
 */
MxGraphView.prototype.transformControlPoint = function(state, pt) {
  if (state !== null && pt !== null) {
    let orig = state.origin

    return new MxPoint(
      this.scale * (pt.x + this.translate.x + orig.x),
      this.scale * (pt.y + this.translate.y + orig.y)
    )
  }

  return null
}

/**
 * Function: isLoopStyleEnabled
 *
 * Returns true if the given edge should be routed with <mxGraph.defaultLoopStyle>
 * or the <MxConstants.STYLE_LOOP> defined for the given edge. This implementation
 * returns true if the given edge is a loop and does not
 */
MxGraphView.prototype.isLoopStyleEnabled = function(
  edge,
  points,
  source,
  target
) {
  let sc = this.graph.getConnectionConstraint(edge, source, true)
  let tc = this.graph.getConnectionConstraint(edge, target, false)

  if (
    (points === null || points.length < 2) &&
    (!MxUtils.getValue(edge.style, MxConstants.STYLE_ORTHOGONAL_LOOP, false) ||
      ((sc === null || sc.point === null) &&
        (tc === null || tc.point === null)))
  ) {
    return source !== null && source === target
  }

  return false
}

/**
 * Function: getEdgeStyle
 *
 * Returns the edge style function to be used to render the given edge state.
 */
MxGraphView.prototype.getEdgeStyle = function(edge, points, source, target) {
  let edgeStyle = this.isLoopStyleEnabled(edge, points, source, target)
    ? MxUtils.getValue(
      edge.style,
      MxConstants.STYLE_LOOP,
      this.graph.defaultLoopStyle
    )
    : !MxUtils.getValue(edge.style, MxConstants.STYLE_NOEDGESTYLE, false)
      ? edge.style[MxConstants.STYLE_EDGE]
      : null

  // Converts string values to objects
  if (typeof edgeStyle === 'string') {
    let tmp = MxStyleRegistry.getValue(edgeStyle)

    if (tmp === null && this.isAllowEval()) {
      tmp = MxUtils.eval(edgeStyle)
    }

    edgeStyle = tmp
  }

  if (typeof edgeStyle === 'function') {
    return edgeStyle
  }

  return null
}

/**
 * Function: updateFloatingTerminalPoints
 *
 * Updates the terminal points in the given state after the edge style was
 * computed for the edge.
 *
 * Parameters:
 *
 * state - <MxCellState> whose terminal points should be updated.
 * source - <MxCellState> that represents the source terminal.
 * target - <MxCellState> that represents the target terminal.
 */
MxGraphView.prototype.updateFloatingTerminalPoints = function(
  state,
  source,
  target
) {
  let pts = state.absolutePoints
  let p0 = pts[0]
  let pe = pts[pts.length - 1]

  if (pe === null && target !== null) {
    this.updateFloatingTerminalPoint(state, target, source, false)
  }

  if (p0 === null && source !== null) {
    this.updateFloatingTerminalPoint(state, source, target, true)
  }
}

/**
 * Function: updateFloatingTerminalPoint
 *
 * Updates the absolute terminal point in the given state for the given
 * start and end state, where start is the source if source is true.
 *
 * Parameters:
 *
 * edge - <MxCellState> whose terminal point should be updated.
 * start - <MxCellState> for the terminal on "this" side of the edge.
 * end - <MxCellState> for the terminal on the other side of the edge.
 * source - Boolean indicating if start is the source terminal state.
 */
MxGraphView.prototype.updateFloatingTerminalPoint = function(
  edge,
  start,
  end,
  source
) {
  edge.setAbsoluteTerminalPoint(
    this.getFloatingTerminalPoint(edge, start, end, source),
    source
  )
}

/**
 * Function: getFloatingTerminalPoint
 *
 * Returns the floating terminal point for the given edge, start and end
 * state, where start is the source if source is true.
 *
 * Parameters:
 *
 * edge - <MxCellState> whose terminal point should be returned.
 * start - <MxCellState> for the terminal on "this" side of the edge.
 * end - <MxCellState> for the terminal on the other side of the edge.
 * source - Boolean indicating if start is the source terminal state.
 */
MxGraphView.prototype.getFloatingTerminalPoint = function(
  edge,
  start,
  end,
  source
) {
  start = this.getTerminalPort(edge, start, source)
  let next = this.getNextPoint(edge, end, source)

  let orth = this.graph.isOrthogonal(edge)
  let alpha = MxUtils.toRadians(
    Number(start.style[MxConstants.STYLE_ROTATION] || '0')
  )
  let center = new MxPoint(start.getCenterX(), start.getCenterY())

  if (alpha !== 0) {
    let cos = Math.cos(-alpha)
    let sin = Math.sin(-alpha)
    next = MxUtils.getRotatedPoint(next, cos, sin, center)
  }

  let border = parseFloat(edge.style[MxConstants.STYLE_PERIMETER_SPACING] || 0)
  border += parseFloat(
    edge.style[ source ? MxConstants.STYLE_SOURCE_PERIMETER_SPACING : MxConstants.STYLE_TARGET_PERIMETER_SPACING ] || 0
  )
  let pt = this.getPerimeterPoint(start, next, alpha === 0 && orth, border)

  if (alpha !== 0) {
    let cos = Math.cos(alpha)
    let sin = Math.sin(alpha)
    pt = MxUtils.getRotatedPoint(pt, cos, sin, center)
  }

  return pt
}

/**
 * Function: getTerminalPort
 *
 * Returns an <MxCellState> that represents the source or target terminal or
 * port for the given edge.
 *
 * Parameters:
 *
 * state - <MxCellState> that represents the state of the edge.
 * terminal - <MxCellState> that represents the terminal.
 * source - Boolean indicating if the given terminal is the source terminal.
 */
MxGraphView.prototype.getTerminalPort = function(state, terminal, source) {
  let key = source
    ? MxConstants.STYLE_SOURCE_PORT
    : MxConstants.STYLE_TARGET_PORT
  let id = MxUtils.getValue(state.style, key)

  if (id !== null) {
    let tmp = this.getState(this.graph.getModel().getCell(id))

    // Only uses ports where a cell state exists
    if (tmp !== null) {
      terminal = tmp
    }
  }

  return terminal
}

/**
 * Function: getPerimeterPoint
 *
 * Returns an <MxPoint> that defines the location of the intersection point between
 * the perimeter and the line between the center of the shape and the given point.
 *
 * Parameters:
 *
 * terminal - <MxCellState> for the source or target terminal.
 * next - <MxPoint> that lies outside of the given terminal.
 * orthogonal - Boolean that specifies if the orthogonal projection onto
 * the perimeter should be returned. If this is false then the intersection
 * of the perimeter and the line between the next and the center point is
 * returned.
 * border - Optional border between the perimeter and the shape.
 */
MxGraphView.prototype.getPerimeterPoint = function(
  terminal,
  next,
  orthogonal,
  border
) {
  let point = null

  if (terminal !== null) {
    let perimeter = this.getPerimeterFunction(terminal)

    if (perimeter !== null && next !== null) {
      let bounds = this.getPerimeterBounds(terminal, border)

      if (bounds.width > 0 || bounds.height > 0) {
        point = new MxPoint(next.x, next.y)
        let flipH = false
        let flipV = false

        if (this.graph.model.isVertex(terminal.cell)) {
          flipH =
            MxUtils.getValue(terminal.style, MxConstants.STYLE_FLIPH, 0) === 1
          flipV =
            MxUtils.getValue(terminal.style, MxConstants.STYLE_FLIPV, 0) === 1

          // Legacy support for stencilFlipH/V
          if (terminal.shape !== null && terminal.shape.stencil !== null) {
            flipH =
              MxUtils.getValue(terminal.style, 'stencilFlipH', 0) === 1 || flipH
            flipV =
              MxUtils.getValue(terminal.style, 'stencilFlipV', 0) === 1 || flipV
          }

          if (flipH) {
            point.x = 2 * bounds.getCenterX() - point.x
          }

          if (flipV) {
            point.y = 2 * bounds.getCenterY() - point.y
          }
        }

        point = perimeter(bounds, terminal, point, orthogonal)

        if (point !== null) {
          if (flipH) {
            point.x = 2 * bounds.getCenterX() - point.x
          }

          if (flipV) {
            point.y = 2 * bounds.getCenterY() - point.y
          }
        }
      }
    }

    if (point === null) {
      point = this.getPoint(terminal)
    }
  }

  return point
}

/**
 * Function: getRoutingCenterX
 *
 * Returns the x-coordinate of the center point for automatic routing.
 */
MxGraphView.prototype.getRoutingCenterX = function(state) {
  let f =
    state.style !== null
      ? parseFloat(state.style[MxConstants.STYLE_ROUTING_CENTER_X]) || 0
      : 0

  return state.getCenterX() + f * state.width
}

/**
 * Function: getRoutingCenterY
 *
 * Returns the y-coordinate of the center point for automatic routing.
 */
MxGraphView.prototype.getRoutingCenterY = function(state) {
  let f =
    state.style !== null
      ? parseFloat(state.style[MxConstants.STYLE_ROUTING_CENTER_Y]) || 0
      : 0

  return state.getCenterY() + f * state.height
}

/**
 * Function: getPerimeterBounds
 *
 * Returns the perimeter bounds for the given terminal, edge pair as an
 * <MxRectangle>.
 *
 * If you have a model where each terminal has a relative child that should
 * act as the graphical endpoint for a connection from/to the terminal, then
 * this method can be replaced as follows:
 *
 * (code)
 * let oldGetPerimeterBounds = MxGraphView.prototype.getPerimeterBounds;
 * MxGraphView.prototype.getPerimeterBounds = function(terminal, edge, isSource)
 * {
 *   let model = this.graph.getModel();
 *   let childCount = model.getChildCount(terminal.cell);
 *
 *   if (childCount > 0)
 *   {
 *     let child = model.getChildAt(terminal.cell, 0);
 *     let geo = model.getGeometry(child);
 *
 *     if (geo !== null &&
 *         geo.relative)
 *     {
 *       let state = this.getState(child);
 *
 *       if (state !== null)
 *       {
 *         terminal = state;
 *       }
 *     }
 *   }
 *
 *   return oldGetPerimeterBounds.apply(this, arguments);
 * };
 * (end)
 *
 * Parameters:
 *
 * terminal - <MxCellState> that represents the terminal.
 * border - Number that adds a border between the shape and the perimeter.
 */
MxGraphView.prototype.getPerimeterBounds = function(terminal, border) {
  border = border !== null ? border : 0

  if (terminal !== null) {
    border += parseFloat(
      terminal.style[MxConstants.STYLE_PERIMETER_SPACING] || 0
    )
  }

  return terminal.getPerimeterBounds(border * this.scale)
}

/**
 * Function: getPerimeterFunction
 *
 * Returns the perimeter function for the given state.
 */
MxGraphView.prototype.getPerimeterFunction = function(state) {
  let perimeter = state.style[MxConstants.STYLE_PERIMETER]

  // Converts string values to objects
  if (typeof perimeter === 'string') {
    let tmp = MxStyleRegistry.getValue(perimeter)

    if (tmp === null && this.isAllowEval()) {
      tmp = MxUtils.eval(perimeter)
    }

    perimeter = tmp
  }

  if (typeof perimeter === 'function') {
    return perimeter
  }

  return null
}

/**
 * Function: getNextPoint
 *
 * Returns the nearest point in the list of absolute points or the center
 * of the opposite terminal.
 *
 * Parameters:
 *
 * edge - <MxCellState> that represents the edge.
 * opposite - <MxCellState> that represents the opposite terminal.
 * source - Boolean indicating if the next point for the source or target
 * should be returned.
 */
MxGraphView.prototype.getNextPoint = function(edge, opposite, source) {
  let pts = edge.absolutePoints
  let point = null

  if (pts !== null && pts.length >= 2) {
    let count = pts.length
    point = pts[source ? Math.min(1, count - 1) : Math.max(0, count - 2)]
  }

  if (point === null && opposite !== null) {
    point = new MxPoint(opposite.getCenterX(), opposite.getCenterY())
  }

  return point
}

/**
 * Function: getVisibleTerminal
 *
 * Returns the nearest ancestor terminal that is visible. The edge appears
 * to be connected to this terminal on the display. The result of this method
 * is cached in <MxCellState.getVisibleTerminalState>.
 *
 * Parameters:
 *
 * edge - <mxCell> whose visible terminal should be returned.
 * source - Boolean that specifies if the source or target terminal
 * should be returned.
 */
MxGraphView.prototype.getVisibleTerminal = function(edge, source) {
  let model = this.graph.getModel()
  let result = model.getTerminal(edge, source)
  let best = result

  while (result !== null && result !== this.currentRoot) {
    if (!this.graph.isCellVisible(best) || this.isCellCollapsed(result)) {
      best = result
    }

    result = model.getParent(result)
  }

  // Checks if the result is not a layer
  if (model.getParent(best) === model.getRoot()) {
    best = null
  }

  return best
}

/**
 * Function: updateEdgeBounds
 *
 * Updates the given state using the bounding box of t
 * he absolute points.
 * Also updates <MxCellState.terminalDistance>, <MxCellState.length> and
 * <MxCellState.segments>.
 *
 * Parameters:
 *
 * state - <MxCellState> whose bounds should be updated.
 */
MxGraphView.prototype.updateEdgeBounds = function(state) {
  let points = state.absolutePoints
  let p0 = points[0]
  let pe = points[points.length - 1]

  if (p0.x !== pe.x || p0.y !== pe.y) {
    let dx = pe.x - p0.x
    let dy = pe.y - p0.y
    state.terminalDistance = Math.sqrt(dx * dx + dy * dy)
  } else {
    state.terminalDistance = 0
  }

  let length = 0
  let segments = []
  let pt = p0

  if (pt !== null) {
    let minX = pt.x
    let minY = pt.y
    let maxX = minX
    let maxY = minY

    for (let i = 1; i < points.length; i++) {
      let tmp = points[i]

      if (tmp !== null) {
        let dx = pt.x - tmp.x
        let dy = pt.y - tmp.y

        let segment = Math.sqrt(dx * dx + dy * dy)
        segments.push(segment)
        length += segment

        pt = tmp

        minX = Math.min(pt.x, minX)
        minY = Math.min(pt.y, minY)
        maxX = Math.max(pt.x, maxX)
        maxY = Math.max(pt.y, maxY)
      }
    }

    state.length = length
    state.segments = segments

    let markerSize = 1 // TODO: include marker size

    state.x = minX
    state.y = minY
    state.width = Math.max(markerSize, maxX - minX)
    state.height = Math.max(markerSize, maxY - minY)
  }
}

/**
 * Function: getPoint
 *
 * Returns the absolute point on the edge for the given relative
 * <mxGeometry> as an <MxPoint>. The edge is represented by the given
 * <MxCellState>.
 *
 * Parameters:
 *
 * state - <MxCellState> that represents the state of the parent edge.
 * geometry - <mxGeometry> that represents the relative location.
 */
MxGraphView.prototype.getPoint = function(state, geometry) {
  let x = state.getCenterX()
  let y = state.getCenterY()

  if (state.segments !== null && (geometry === null || geometry.relative)) {
    let gx = geometry !== null ? geometry.x / 2 : 0
    let pointCount = state.absolutePoints.length
    let dist = Math.round((gx + 0.5) * state.length)
    let segment = state.segments[0]
    let length = 0
    let index = 1

    while (dist >= Math.round(length + segment) && index < pointCount - 1) {
      length += segment
      segment = state.segments[index++]
    }

    let factor = segment === 0 ? 0 : (dist - length) / segment
    let p0 = state.absolutePoints[index - 1]
    let pe = state.absolutePoints[index]

    if (p0 !== null && pe !== null) {
      let gy = 0
      let offsetX = 0
      let offsetY = 0

      if (geometry !== null) {
        gy = geometry.y
        let offset = geometry.offset

        if (offset !== null) {
          offsetX = offset.x
          offsetY = offset.y
        }
      }

      let dx = pe.x - p0.x
      let dy = pe.y - p0.y
      let nx = segment === 0 ? 0 : dy / segment
      let ny = segment === 0 ? 0 : dx / segment

      x = p0.x + dx * factor + (nx * gy + offsetX) * this.scale
      y = p0.y + dy * factor - (ny * gy - offsetY) * this.scale
    }
  } else if (geometry !== null) {
    let offset = geometry.offset

    if (offset !== null) {
      x += offset.x
      y += offset.y
    }
  }

  return new MxPoint(x, y)
}

/**
 * Function: getRelativePoint
 *
 * Gets the relative point that describes the given, absolute label
 * position for the given edge state.
 *
 * Parameters:
 *
 * state - <MxCellState> that represents the state of the parent edge.
 * x - Specifies the x-coordinate of the absolute label location.
 * y - Specifies the y-coordinate of the absolute label location.
 */
MxGraphView.prototype.getRelativePoint = function(edgeState, x, y) {
  let model = this.graph.getModel()
  let geometry = model.getGeometry(edgeState.cell)

  if (geometry !== null) {
    let pointCount = edgeState.absolutePoints.length

    if (geometry.relative && pointCount > 1) {
      let totalLength = edgeState.length
      let segments = edgeState.segments

      // Works which line segment the point of the label is closest to
      let p0 = edgeState.absolutePoints[0]
      let pe = edgeState.absolutePoints[1]
      let minDist = MxUtils.ptSegDistSq(p0.x, p0.y, pe.x, pe.y, x, y)

      let index = 0
      let tmp = 0
      let length = 0

      for (let i = 2; i < pointCount; i++) {
        tmp += segments[i - 2]
        pe = edgeState.absolutePoints[i]
        let dist = MxUtils.ptSegDistSq(p0.x, p0.y, pe.x, pe.y, x, y)

        if (dist <= minDist) {
          minDist = dist
          index = i - 1
          length = tmp
        }

        p0 = pe
      }

      let seg = segments[index]
      p0 = edgeState.absolutePoints[index]
      pe = edgeState.absolutePoints[index + 1]

      let x2 = p0.x
      let y2 = p0.y

      let x1 = pe.x
      let y1 = pe.y

      let px = x
      let py = y

      let xSegment = x2 - x1
      let ySegment = y2 - y1

      px -= x1
      py -= y1
      let projlenSq = 0

      px = xSegment - px
      py = ySegment - py
      let dotprod = px * xSegment + py * ySegment

      if (dotprod <= 0.0) {
        projlenSq = 0
      } else {
        projlenSq =
          (dotprod * dotprod) / (xSegment * xSegment + ySegment * ySegment)
      }

      let projlen = Math.sqrt(projlenSq)

      if (projlen > seg) {
        projlen = seg
      }

      let yDistance = Math.sqrt(
        MxUtils.ptSegDistSq(p0.x, p0.y, pe.x, pe.y, x, y)
      )
      let direction = MxUtils.relativeCcw(p0.x, p0.y, pe.x, pe.y, x, y)

      if (direction === -1) {
        yDistance = -yDistance
      }

      // Constructs the relative point for the label
      return new MxPoint(
        ((totalLength / 2 - length - projlen) / totalLength) * -2,
        yDistance / this.scale
      )
    }
  }

  return new MxPoint()
}

/**
 * Function: updateEdgeLabelOffset
 *
 * Updates <MxCellState.absoluteOffset> for the given state. The absolute
 * offset is normally used for the position of the edge label. Is is
 * calculated from the geometry as an absolute offset from the center
 * between the two endpoints if the geometry is absolute, or as the
 * relative distance between the center along the line and the absolute
 * orthogonal distance if the geometry is relative.
 *
 * Parameters:
 *
 * state - <MxCellState> whose absolute offset should be updated.
 */
MxGraphView.prototype.updateEdgeLabelOffset = function(state) {
  let points = state.absolutePoints

  state.absoluteOffset.x = state.getCenterX()
  state.absoluteOffset.y = state.getCenterY()

  if (points !== null && points.length > 0 && state.segments !== null) {
    let geometry = this.graph.getCellGeometry(state.cell)

    if (geometry.relative) {
      let offset = this.getPoint(state, geometry)

      if (offset !== null) {
        state.absoluteOffset = offset
      }
    } else {
      let p0 = points[0]
      let pe = points[points.length - 1]

      if (p0 !== null && pe !== null) {
        let dx = pe.x - p0.x
        let dy = pe.y - p0.y
        let x0 = 0
        let y0 = 0

        let off = geometry.offset

        if (off !== null) {
          x0 = off.x
          y0 = off.y
        }

        let x = p0.x + dx / 2 + x0 * this.scale
        let y = p0.y + dy / 2 + y0 * this.scale

        state.absoluteOffset.x = x
        state.absoluteOffset.y = y
      }
    }
  }
}

/**
 * Function: getState
 *
 * Returns the <MxCellState> for the given cell. If create is true, then
 * the state is created if it does not yet exist.
 *
 * Parameters:
 *
 * cell - <mxCell> for which the <MxCellState> should be returned.
 * create - Optional boolean indicating if a new state should be created
 * if it does not yet exist. Default is false.
 */
MxGraphView.prototype.getState = function(cell, create) {
  create = create || false
  let state = null

  if (cell !== null) {
    state = this.states.get(cell)

    if (
      create &&
      (state === null || this.updateStyle) &&
      this.graph.isCellVisible(cell)
    ) {
      if (state === null) {
        state = this.createState(cell)
        this.states.put(cell, state)
      } else {
        state.style = this.graph.getCellStyle(cell)
      }
    }
  }

  return state
}

/**
 * Function: isRendering
 *
 * Returns <rendering>.
 */
MxGraphView.prototype.isRendering = function() {
  return this.rendering
}

/**
 * Function: setRendering
 *
 * Sets <rendering>.
 */
MxGraphView.prototype.setRendering = function(value) {
  this.rendering = value
}

/**
 * Function: isAllowEval
 *
 * Returns <allowEval>.
 */
MxGraphView.prototype.isAllowEval = function() {
  return this.allowEval
}

/**
 * Function: setAllowEval
 *
 * Sets <allowEval>.
 */
MxGraphView.prototype.setAllowEval = function(value) {
  this.allowEval = value
}

/**
 * Function: getStates
 *
 * Returns <states>.
 */
MxGraphView.prototype.getStates = function() {
  return this.states
}

/**
 * Function: setStates
 *
 * Sets <states>.
 */
MxGraphView.prototype.setStates = function(value) {
  this.states = value
}

/**
 * Function: getCellStates
 *
 * Returns the <mxCellStates> for the given array of <mxCells>. The array
 * contains all states that are not null, that is, the returned array may
 * have less elements than the given array. If no argument is given, then
 * this returns <states>.
 */
MxGraphView.prototype.getCellStates = function(cells) {
  if (cells === null) {
    return this.states
  } else {
    let result = []

    for (let i = 0; i < cells.length; i++) {
      let state = this.getState(cells[i])

      if (state !== null) {
        result.push(state)
      }
    }

    return result
  }
}

/**
 * Function: removeState
 *
 * Removes and returns the <MxCellState> for the given cell.
 *
 * Parameters:
 *
 * cell - <mxCell> for which the <MxCellState> should be removed.
 */
MxGraphView.prototype.removeState = function(cell) {
  let state = null

  if (cell !== null) {
    state = this.states.remove(cell)

    if (state !== null) {
      this.graph.cellRenderer.destroy(state)
      state.invalid = true
      state.destroy()
    }
  }

  return state
}

/**
 * Function: createState
 *
 * Creates and returns an <MxCellState> for the given cell and initializes
 * it using <mxCellRenderer.initialize>.
 *
 * Parameters:
 *
 * cell - <mxCell> for which a new <MxCellState> should be created.
 */
MxGraphView.prototype.createState = function(cell) {
  return new MxCellState(this, cell, this.graph.getCellStyle(cell))
}

/**
 * Function: getCanvas
 *
 * Returns the DOM node that contains the background-, draw- and
 * overlay- and decoratorpanes.
 */
MxGraphView.prototype.getCanvas = function() {
  return this.canvas
}

/**
 * Function: getBackgroundPane
 *
 * Returns the DOM node that represents the background layer.
 */
MxGraphView.prototype.getBackgroundPane = function() {
  return this.backgroundPane
}

/**
 * Function: getDrawPane
 *
 * Returns the DOM node that represents the main drawing layer.
 */
MxGraphView.prototype.getDrawPane = function() {
  return this.drawPane
}

/**
 * Function: getOverlayPane
 *
 * Returns the DOM node that represents the layer above the drawing layer.
 */
MxGraphView.prototype.getOverlayPane = function() {
  return this.overlayPane
}

/**
 * Function: getDecoratorPane
 *
 * Returns the DOM node that represents the topmost drawing layer.
 */
MxGraphView.prototype.getDecoratorPane = function() {
  return this.decoratorPane
}

/**
 * Function: isContainerEvent
 *
 * Returns true if the event origin is one of the drawing panes or
 * containers of the view.
 */
MxGraphView.prototype.isContainerEvent = function(evt) {
  let source = MxEvent.getSource(evt)

  return (
    source === this.graph.container ||
    source.parentNode === this.backgroundPane ||
    (source.parentNode !== null &&
      source.parentNode.parentNode === this.backgroundPane) ||
    source === this.canvas.parentNode ||
    source === this.canvas ||
    source === this.backgroundPane ||
    source === this.drawPane ||
    source === this.overlayPane ||
    source === this.decoratorPane
  )
}

/**
 * Function: isScrollEvent
 *
 * Returns true if the event origin is one of the scrollbars of the
 * container in IE. Such events are ignored.
 */
MxGraphView.prototype.isScrollEvent = function(evt) {
  let offset = MxUtils.getOffset(this.graph.container)
  let pt = new MxPoint(evt.clientX - offset.x, evt.clientY - offset.y)

  let outWidth = this.graph.container.offsetWidth
  let inWidth = this.graph.container.clientWidth

  if (outWidth > inWidth && pt.x > inWidth + 2 && pt.x <= outWidth) {
    return true
  }

  let outHeight = this.graph.container.offsetHeight
  let inHeight = this.graph.container.clientHeight

  if (outHeight > inHeight && pt.y > inHeight + 2 && pt.y <= outHeight) {
    return true
  }

  return false
}

/**
 * Function: init
 *
 * Initializes the graph event dispatch loop for the specified container
 * and invokes <create> to create the required DOM nodes for the display.
 */
MxGraphView.prototype.init = function() {
  this.installListeners()

  // Creates the DOM nodes for the respective display dialect
  let graph = this.graph

  if (graph.dialect === MxConstants.DIALECT_SVG) {
    this.createSvg()
  } else if (graph.dialect === MxConstants.DIALECT_VML) {
    this.createVml()
  } else {
    this.createHtml()
  }
}

/**
 * Function: installListeners
 *
 * Installs the required listeners in the container.
 */
MxGraphView.prototype.installListeners = function() {
  let graph = this.graph
  let container = graph.container

  if (container !== null) {
    // Support for touch device gestures (eg. pinch to zoom)
    // Double-tap handling is implemented in mxGraph.fireMouseEvent
    if (MxClient.IS_TOUCH) {
      MxEvent.addListener(
        container,
        'gesturestart',
        MxUtils.bind(this, function(evt) {
          graph.fireGestureEvent(evt)
          MxEvent.consume(evt)
        })
      )

      MxEvent.addListener(
        container,
        'gesturechange',
        MxUtils.bind(this, function(evt) {
          graph.fireGestureEvent(evt)
          MxEvent.consume(evt)
        })
      )

      MxEvent.addListener(
        container,
        'gestureend',
        MxUtils.bind(this, function(evt) {
          graph.fireGestureEvent(evt)
          MxEvent.consume(evt)
        })
      )
    }

    // Adds basic listeners for graph event dispatching
    MxEvent.addGestureListeners(
      container,
      MxUtils.bind(this, function(evt) {
        // Condition to avoid scrollbar events starting a rubberband selection
        if (
          this.isContainerEvent(evt) &&
          ((!MxClient.IS_IE &&
            !MxClient.IS_IE11 &&
            !MxClient.IS_GC &&
            !MxClient.IS_OP &&
            !MxClient.IS_SF) ||
            !this.isScrollEvent(evt))
        ) {
          graph.fireMouseEvent(MxEvent.MOUSE_DOWN, new MxMouseEvent(evt))
        }
      }),
      MxUtils.bind(this, function(evt) {
        if (this.isContainerEvent(evt)) {
          graph.fireMouseEvent(MxEvent.MOUSE_MOVE, new MxMouseEvent(evt))
        }
      }),
      MxUtils.bind(this, function(evt) {
        if (this.isContainerEvent(evt)) {
          graph.fireMouseEvent(MxEvent.MOUSE_UP, new MxMouseEvent(evt))
        }
      })
    )

    // Adds listener for double click handling on background, this does always
    // use native event handler, we assume that the DOM of the background
    // does not change during the double click
    MxEvent.addListener(
      container,
      'dblclick',
      MxUtils.bind(this, function(evt) {
        if (this.isContainerEvent(evt)) {
          graph.dblClick(evt)
        }
      })
    )

    // Workaround for touch events which started on some DOM node
    // on top of the container, in which case the cells under the
    // mouse for the move and up events are not detected.
    let getState = function(evt) {
      let state = null

      // Workaround for touch events which started on some DOM node
      // on top of the container, in which case the cells under the
      // mouse for the move and up events are not detected.
      if (MxClient.IS_TOUCH) {
        let x = MxEvent.getClientX(evt)
        let y = MxEvent.getClientY(evt)

        // Dispatches the drop event to the graph which
        // consumes and executes the source function
        let pt = MxUtils.convertPoint(container, x, y)
        state = graph.view.getState(graph.getCellAt(pt.x, pt.y))
      }

      return state
    }

    // Adds basic listeners for graph event dispatching outside of the
    // container and finishing the handling of a single gesture
    // Implemented via graph event dispatch loop to avoid duplicate events
    // in Firefox and Chrome
    graph.addMouseListener({
      mouseDown: function(sender, me) {
        graph.popupMenuHandler.hideMenu()
      },
      mouseMove: function() {},
      mouseUp: function() {}
    })

    this.moveHandler = MxUtils.bind(this, function(evt) {
      // Hides the tooltip if mouse is outside container
      if (
        graph.tooltipHandler !== null &&
        graph.tooltipHandler.isHideOnHover()
      ) {
        graph.tooltipHandler.hide()
      }

      if (
        this.captureDocumentGesture &&
        graph.isMouseDown &&
        graph.container !== null &&
        !this.isContainerEvent(evt) &&
        graph.container.style.display !== 'none' &&
        graph.container.style.visibility !== 'hidden' &&
        !MxEvent.isConsumed(evt)
      ) {
        graph.fireMouseEvent(
          MxEvent.MOUSE_MOVE,
          new MxMouseEvent(evt, getState(evt))
        )
      }
    })

    this.endHandler = MxUtils.bind(this, function(evt) {
      if (
        this.captureDocumentGesture &&
        graph.isMouseDown &&
        graph.container !== null &&
        !this.isContainerEvent(evt) &&
        graph.container.style.display !== 'none' &&
        graph.container.style.visibility !== 'hidden'
      ) {
        graph.fireMouseEvent(MxEvent.MOUSE_UP, new MxMouseEvent(evt))
      }
    })

    MxEvent.addGestureListeners(
      document,
      null,
      this.moveHandler,
      this.endHandler
    )
  }
}

/**
 * Function: create
 *
 * Creates the DOM nodes for the HTML display.
 */
MxGraphView.prototype.createHtml = function() {
  let container = this.graph.container

  if (container !== null) {
    this.canvas = this.createHtmlPane('100%', '100%')
    this.canvas.style.overflow = 'hidden'

    // Uses minimal size for inner DIVs on Canvas. This is required
    // for correct event processing in IE. If we have an overlapping
    // DIV then the events on the cells are only fired for labels.
    this.backgroundPane = this.createHtmlPane('1px', '1px')
    this.drawPane = this.createHtmlPane('1px', '1px')
    this.overlayPane = this.createHtmlPane('1px', '1px')
    this.decoratorPane = this.createHtmlPane('1px', '1px')

    this.canvas.appendChild(this.backgroundPane)
    this.canvas.appendChild(this.drawPane)
    this.canvas.appendChild(this.overlayPane)
    this.canvas.appendChild(this.decoratorPane)

    container.appendChild(this.canvas)
    this.updateContainerStyle(container)

    // Implements minWidth/minHeight in quirks mode
    if (MxClient.IS_QUIRKS) {
      let onResize = MxUtils.bind(this, function(evt) {
        let bounds = this.getGraphBounds()
        let width = bounds.x + bounds.width + this.graph.border
        let height = bounds.y + bounds.height + this.graph.border

        this.updateHtmlCanvasSize(width, height)
      })

      MxEvent.addListener(window, 'resize', onResize)
    }
  }
}

/**
 * Function: updateHtmlCanvasSize
 *
 * Updates the size of the HTML canvas.
 */
MxGraphView.prototype.updateHtmlCanvasSize = function(width, height) {
  if (this.graph.container !== null) {
    let ow = this.graph.container.offsetWidth
    let oh = this.graph.container.offsetHeight

    if (ow < width) {
      this.canvas.style.width = width + 'px'
    } else {
      this.canvas.style.width = '100%'
    }

    if (oh < height) {
      this.canvas.style.height = height + 'px'
    } else {
      this.canvas.style.height = '100%'
    }
  }
}

/**
 * Function: createHtmlPane
 *
 * Creates and returns a drawing pane in HTML (DIV).
 */
MxGraphView.prototype.createHtmlPane = function(width, height) {
  let pane = document.createElement('DIV')

  if (width !== null && height !== null) {
    pane.style.position = 'absolute'
    pane.style.left = '0px'
    pane.style.top = '0px'

    pane.style.width = width
    pane.style.height = height
  } else {
    pane.style.position = 'relative'
  }

  return pane
}

/**
 * Function: create
 *
 * Creates the DOM nodes for the VML display.
 */
MxGraphView.prototype.createVml = function() {
  let container = this.graph.container

  if (container !== null) {
    let width = container.offsetWidth
    let height = container.offsetHeight
    this.canvas = this.createVmlPane(width, height)
    this.canvas.style.overflow = 'hidden'

    this.backgroundPane = this.createVmlPane(width, height)
    this.drawPane = this.createVmlPane(width, height)
    this.overlayPane = this.createVmlPane(width, height)
    this.decoratorPane = this.createVmlPane(width, height)

    this.canvas.appendChild(this.backgroundPane)
    this.canvas.appendChild(this.drawPane)
    this.canvas.appendChild(this.overlayPane)
    this.canvas.appendChild(this.decoratorPane)

    container.appendChild(this.canvas)
  }
}

/**
 * Function: createVmlPane
 *
 * Creates a drawing pane in VML (group).
 */
MxGraphView.prototype.createVmlPane = function(width, height) {
  let pane = document.createElement(MxClient.VML_PREFIX + ':group')

  // At this point the width and height are potentially
  // uninitialized. That's OK.
  pane.style.position = 'absolute'
  pane.style.left = '0px'
  pane.style.top = '0px'

  pane.style.width = width + 'px'
  pane.style.height = height + 'px'

  pane.setAttribute('coordsize', width + ',' + height)
  pane.setAttribute('coordorigin', '0,0')

  return pane
}

/**
 * Function: create
 *
 * Creates and returns the DOM nodes for the SVG display.
 */
MxGraphView.prototype.createSvg = function() {
  let container = this.graph.container
  this.canvas = document.createElementNS(MxConstants.NS_SVG, 'g')

  // For background image
  this.backgroundPane = document.createElementNS(MxConstants.NS_SVG, 'g')
  this.canvas.appendChild(this.backgroundPane)

  // Adds two layers (background is early feature)
  this.drawPane = document.createElementNS(MxConstants.NS_SVG, 'g')
  this.canvas.appendChild(this.drawPane)

  this.overlayPane = document.createElementNS(MxConstants.NS_SVG, 'g')
  this.canvas.appendChild(this.overlayPane)

  this.decoratorPane = document.createElementNS(MxConstants.NS_SVG, 'g')
  this.canvas.appendChild(this.decoratorPane)

  let root = document.createElementNS(MxConstants.NS_SVG, 'svg')
  //  root.style.position = 'relative';
  //  root.style.left = '0px';
  //  root.style.top = '0px';
  root.style.width = '100%'
  root.style.height = '100%'

  // NOTE: In standards mode, the SVG must have block layout
  // in order for the container DIV to not show scrollbars.
  root.style.display = 'block'
  root.appendChild(this.canvas)

  // Workaround for scrollbars in IE11 and below
  if (MxClient.IS_IE || MxClient.IS_IE11) {
    root.style.overflow = 'hidden'
  }

  if (container !== null) {
    container.appendChild(root)
    this.updateContainerStyle(container)
  }
}

/**
 * Function: updateContainerStyle
 *
 * Updates the style of the container after installing the SVG DOM elements.
 */
MxGraphView.prototype.updateContainerStyle = function(container) {
  // Workaround for offset of container
  let style = MxUtils.getCurrentStyle(container)

  if (style !== null && style.position === 'static') {
    container.style.position = 'relative'
  }

  // Disables built-in pan and zoom in IE10 and later
  if (MxClient.IS_POINTER) {
    container.style.touchAction = 'none'
  }
}

/**
 * Function: destroy
 *
 * Destroys the view and all its resources.
 */
MxGraphView.prototype.destroy = function() {
  let root = this.canvas !== null ? this.canvas.ownerSVGElement : null

  if (root === null) {
    root = this.canvas
  }

  if (root !== null && root.parentNode !== null) {
    this.clear(this.currentRoot, true)
    MxEvent.removeGestureListeners(
      document,
      null,
      this.moveHandler,
      this.endHandler
    )
    MxEvent.release(this.graph.container)
    root.parentNode.removeChild(root)

    this.moveHandler = null
    this.endHandler = null
    this.canvas = null
    this.backgroundPane = null
    this.drawPane = null
    this.overlayPane = null
    this.decoratorPane = null
  }
}

/**
 * Class: mxCurrentRootChange
 *
 * Action to change the current root in a view.
 *
 * Constructor: mxCurrentRootChange
 *
 * Constructs a change of the current root in the given view.
 */
function mxCurrentRootChange(view, root) {
  this.view = view
  this.root = root
  this.previous = root
  this.isUp = root === null

  if (!this.isUp) {
    let tmp = this.view.currentRoot
    let model = this.view.graph.getModel()

    while (tmp !== null) {
      if (tmp === root) {
        this.isUp = true
        break
      }

      tmp = model.getParent(tmp)
    }
  }
}

/**
 * Function: execute
 *
 * Changes the current root of the view.
 */
mxCurrentRootChange.prototype.execute = function() {
  let tmp = this.view.currentRoot
  this.view.currentRoot = this.previous
  this.previous = tmp

  let translate = this.view.graph.getTranslateForRoot(this.view.currentRoot)

  if (translate !== null) {
    this.view.translate = new MxPoint(-translate.x, -translate.y)
  }

  if (this.isUp) {
    this.view.clear(this.view.currentRoot, true)
    this.view.validate()
  } else {
    this.view.refresh()
  }

  let name = this.isUp ? MxEvent.UP : MxEvent.DOWN
  this.view.fireEvent(
    new MxEventObject(
      name,
      'root',
      this.view.currentRoot,
      'previous',
      this.previous
    )
  )
  this.isUp = !this.isUp
}
