/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxImageExport
 *
 * Creates a new image export instance to be used with an export canvas. Here
 * is an example that uses this class to create an image via a backend using
 * <mxXmlExportCanvas>.
 *
 * (code)
 * let xmlDoc = MxUtils.createXmlDocument();
 * let root = xmlDoc.createElement('output');
 * xmlDoc.appendChild(root);
 *
 * let xmlCanvas = new mxXmlCanvas2D(root);
 * let imgExport = new MxImageExport();
 * imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas);
 *
 * let bounds = graph.getGraphBounds();
 * let w = Math.ceil(bounds.x + bounds.width);
 * let h = Math.ceil(bounds.y + bounds.height);
 *
 * let xml = MxUtils.getXml(root);
 * new mxXmlRequest('export', 'format=png&w=' + w + '&h=' + h + '&bg=#F9F7ED&xml=' + encodeURIComponent(xml)).simulate(document, '_blank');
 * (end)
 *
 * Constructor: MxImageExport
 *
 * Constructs a new image export.
 */

import MxShape from '@/lib/board/mxGraph/shape/MxShape'
import MxUtils from './MxUtils'

export default class MxImageExport {}

/**
 * Variable: includeOverlays
 *
 * Specifies if overlays should be included in the export. Default is false.
 */
MxImageExport.prototype.includeOverlays = false

/**
 * Function: drawState
 *
 * Draws the given state and all its descendants to the given canvas.
 */
MxImageExport.prototype.drawState = function(state, canvas) {
  if (state !== null) {
    this.visitStatesRecursive(
      state,
      canvas,
      MxUtils.bind(this, function() {
        this.drawCellState.apply(this, arguments)
      })
    )

    // Paints the overlays
    if (this.includeOverlays) {
      this.visitStatesRecursive(
        state,
        canvas,
        MxUtils.bind(this, function() {
          this.drawOverlays.apply(this, arguments)
        })
      )
    }
  }
}

/**
 * Function: drawState
 *
 * Draws the given state and all its descendants to the given canvas.
 */
MxImageExport.prototype.visitStatesRecursive = function(
  state,
  canvas,
  visitor
) {
  if (state !== null) {
    visitor(state, canvas)

    let graph = state.view.graph
    let childCount = graph.model.getChildCount(state.cell)

    for (let i = 0; i < childCount; i++) {
      let childState = graph.view.getState(
        graph.model.getChildAt(state.cell, i)
      )
      this.visitStatesRecursive(childState, canvas, visitor)
    }
  }
}

/**
 * Function: getLinkForCellState
 *
 * Returns the link for the given cell state and canvas. This returns null.
 */
MxImageExport.prototype.getLinkForCellState = function(state, canvas) {
  return null
}

/**
 * Function: drawCellState
 *
 * Draws the given state to the given canvas.
 */
MxImageExport.prototype.drawCellState = function(state, canvas) {
  // Experimental feature
  let link = this.getLinkForCellState(state, canvas)

  if (link !== null) {
    canvas.setLink(link)
  }

  // Paints the shape and text
  this.drawShape(state, canvas)
  this.drawText(state, canvas)

  if (link !== null) {
    canvas.setLink(null)
  }
}

/**
 * Function: drawShape
 *
 * Draws the shape of the given state.
 */
MxImageExport.prototype.drawShape = function(state, canvas) {
  if (state.shape instanceof MxShape && state.shape.checkBounds()) {
    canvas.save()
    state.shape.paint(canvas)
    canvas.restore()
  }
}

/**
 * Function: drawText
 *
 * Draws the text of the given state.
 */
MxImageExport.prototype.drawText = function(state, canvas) {
  if (state.text !== null && state.text.checkBounds()) {
    canvas.save()
    state.text.paint(canvas)
    canvas.restore()
  }
}

/**
 * Function: drawOverlays
 *
 * Draws the overlays for the given state. This is called if <includeOverlays>
 * is true.
 */
MxImageExport.prototype.drawOverlays = function(state, canvas) {
  if (state.overlays !== null) {
    state.overlays.visit(function(id, shape) {
      if (shape instanceof MxShape) {
        shape.paint(canvas)
      }
    })
  }
}
