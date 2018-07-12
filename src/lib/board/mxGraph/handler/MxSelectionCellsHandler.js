/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxSelectionCellsHandler
 *
 * An event handler that manages cell handlers and invokes their mouse event
 * processing functions.
 *
 * Group: Events
 *
 * Event: MxEvent.ADD
 *
 * Fires if a cell has been added to the selection. The <code>state</code>
 * property contains the <mxCellState> that has been added.
 *
 * Event: MxEvent.REMOVE
 *
 * Fires if a cell has been remove from the selection. The <code>state</code>
 * property contains the <mxCellState> that has been removed.
 *
 * Parameters:
 *
 * graph - Reference to the enclosing <mxGraph>.
 */
import MxEventSource from '../util/MxEventSource'
import MxDictionary from '../util/MxDictionary'
import MxUtils from '../util/MxUtils'
import MxEvent from '../util/MxEvent'
import MxEventObject from '../util/MxEventObject'
export default class MxSelectionCellsHandler {
  constructor(graph) {
    MxEventSource.call(this)

    this.graph = graph
    this.handlers = new MxDictionary()
    this.graph.addMouseListener(this)

    this.refreshHandler = MxUtils.bind(this, function(sender, evt) {
      if (this.isEnabled()) {
        this.refresh()
      }
    })

    this.graph.getSelectionModel().addListener(MxEvent.CHANGE, this.refreshHandler)
    this.graph.getModel().addListener(MxEvent.CHANGE, this.refreshHandler)
    this.graph.getView().addListener(MxEvent.SCALE, this.refreshHandler)
    this.graph.getView().addListener(MxEvent.TRANSLATE, this.refreshHandler)
    this.graph.getView().addListener(MxEvent.SCALE_AND_TRANSLATE, this.refreshHandler)
    this.graph.getView().addListener(MxEvent.DOWN, this.refreshHandler)
    this.graph.getView().addListener(MxEvent.UP, this.refreshHandler)
  };
}

/**
 * Extends MxEventSource.
 */
MxUtils.extend(MxSelectionCellsHandler, MxEventSource)

/**
 * Variable: graph
 *
 * Reference to the enclosing <mxGraph>.
 */
MxSelectionCellsHandler.prototype.graph = null

/**
 * Variable: enabled
 *
 * Specifies if events are handled. Default is true.
 */
MxSelectionCellsHandler.prototype.enabled = true

/**
 * Variable: refreshHandler
 *
 * Keeps a reference to an event listener for later removal.
 */
MxSelectionCellsHandler.prototype.refreshHandler = null

/**
 * Variable: maxHandlers
 *
 * Defines the maximum number of handlers to paint individually. Default is 100.
 */
MxSelectionCellsHandler.prototype.maxHandlers = 100

/**
 * Variable: handlers
 *
 * <MxDictionary> that maps from cells to handlers.
 */
MxSelectionCellsHandler.prototype.handlers = null

/**
 * Function: isEnabled
 *
 * Returns <enabled>.
 */
MxSelectionCellsHandler.prototype.isEnabled = function() {
  return this.enabled
}

/**
 * Function: setEnabled
 *
 * Sets <enabled>.
 */
MxSelectionCellsHandler.prototype.setEnabled = function(value) {
  this.enabled = value
}

/**
 * Function: getHandler
 *
 * Returns the handler for the given cell.
 */
MxSelectionCellsHandler.prototype.getHandler = function(cell) {
  return this.handlers.get(cell)
}

/**
 * Function: reset
 *
 * Resets all handlers.
 */
MxSelectionCellsHandler.prototype.reset = function() {
  this.handlers.visit(function(key, handler) {
    handler.reset.apply(handler)
  })
}

/**
 * Function: refresh
 *
 * Reloads or updates all handlers.
 */
MxSelectionCellsHandler.prototype.refresh = function() {
  // Removes all existing handlers
  let oldHandlers = this.handlers
  this.handlers = new MxDictionary()

  // Creates handles for all selection cells
  let tmp = this.graph.getSelectionCells()

  for (let i = 0; i < tmp.length; i++) {
    let state = this.graph.view.getState(tmp[i])

    if (state !== null) {
      let handler = oldHandlers.remove(tmp[i])

      if (handler !== null) {
        if (handler.state !== state) {
          handler.destroy()
          handler = null
        } else if (!this.isHandlerActive(handler)) {
          if (handler.refresh !== null) {
            handler.refresh()
          }

          handler.redraw()
        }
      }

      if (handler === null) {
        handler = this.graph.createHandler(state)
        this.fireEvent(new MxEventObject(MxEvent.ADD, 'state', state))
      }

      if (handler !== null) {
        this.handlers.put(tmp[i], handler)
      }
    }
  }

  // Destroys all unused handlers
  oldHandlers.visit(MxUtils.bind(this, function(key, handler) {
    this.fireEvent(new MxEventObject(MxEvent.REMOVE, 'state', handler.state))
    handler.destroy()
  }))
}

/**
 * Function: isHandlerActive
 *
 * Returns true if the given handler is active and should not be redrawn.
 */
MxSelectionCellsHandler.prototype.isHandlerActive = function(handler) {
  return handler.index !== null
}

/**
 * Function: updateHandler
 *
 * Updates the handler for the given shape if one exists.
 */
MxSelectionCellsHandler.prototype.updateHandler = function(state) {
  let handler = this.handlers.remove(state.cell)

  if (handler !== null) {
    handler.destroy()
    handler = this.graph.createHandler(state)

    if (handler !== null) {
      this.handlers.put(state.cell, handler)
    }
  }
}

/**
 * Function: mouseDown
 *
 * Redirects the given event to the handlers.
 */
MxSelectionCellsHandler.prototype.mouseDown = function(sender, me) {
  if (this.graph.isEnabled() && this.isEnabled()) {
    let args = [sender, me]

    this.handlers.visit(function(key, handler) {
      handler.mouseDown.apply(handler, args)
    })
  }
}

/**
 * Function: mouseMove
 *
 * Redirects the given event to the handlers.
 */
MxSelectionCellsHandler.prototype.mouseMove = function(sender, me) {
  if (this.graph.isEnabled() && this.isEnabled()) {
    let args = [sender, me]

    this.handlers.visit(function(key, handler) {
      handler.mouseMove.apply(handler, args)
    })
  }
}

/**
 * Function: mouseUp
 *
 * Redirects the given event to the handlers.
 */
MxSelectionCellsHandler.prototype.mouseUp = function(sender, me) {
  if (this.graph.isEnabled() && this.isEnabled()) {
    let args = [sender, me]

    this.handlers.visit(function(key, handler) {
      handler.mouseUp.apply(handler, args)
    })
  }
}

/**
 * Function: destroy
 *
 * Destroys the handler and all its resources and DOM nodes.
 */
MxSelectionCellsHandler.prototype.destroy = function() {
  this.graph.removeMouseListener(this)

  if (this.refreshHandler !== null) {
    this.graph.getSelectionModel().removeListener(this.refreshHandler)
    this.graph.getModel().removeListener(this.refreshHandler)
    this.graph.getView().removeListener(this.refreshHandler)
    this.refreshHandler = null
  }
}
