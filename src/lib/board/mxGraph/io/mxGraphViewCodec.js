/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
import MxCodecRegistry from './MxCodecRegistry'
import MxObjectCodec from './MxObjectCodec'
import MxGraphView from '../view/MxGraphView'
import MxStyleRegistry from '../view/MxStyleRegistry'

MxCodecRegistry.register(function() {
  /**
 * Class: MxGraphViewCodec
 *
 * Custom encoder for <MxGraphView>s. This class is created
 * and registered dynamically at load time and used implicitely via
 * <mxCodec> and the <MxCodecRegistry>. This codec only writes views
 * into a XML format that can be used to create an image for
 * the graph, that is, it contains absolute coordinates with
 * computed perimeters, edge styles and cell styles.
 */
  let codec = new MxObjectCodec(new MxGraphView())

  /**
 * Function: encode
 *
 * Encodes the given <MxGraphView> using <encodeCell>
 * starting at the model's root. This returns the
 * top-level graph node of the recursive encoding.
 */
  codec.encode = function(enc, view) {
    return this.encodeCell(enc, view,
      view.graph.getModel().getRoot())
  }

  /**
 * Function: encodeCell
 *
 * Recursively encodes the specifed cell. Uses layer
 * as the default nodename. If the cell's parent is
 * null, then graph is used for the nodename. If
 * <mxGraphModel.isEdge> returns true for the cell,
 * then edge is used for the nodename, else if
 * <mxGraphModel.isVertex> returns true for the cell,
 * then vertex is used for the nodename.
 *
 * <mxGraph.getLabel> is used to create the label
 * attribute for the cell. For graph nodes and vertices
 * the bounds are encoded into x, y, width and height.
 * For edges the points are encoded into a points
 * attribute as a space-separated list of comma-separated
 * coordinate pairs (eg. x0,y0 x1,y1 ... xn,yn). All
 * values from the cell style are added as attribute
 * values to the node.
 */
  codec.encodeCell = function(enc, view, cell) {
    let model = view.graph.getModel()
    let state = view.getState(cell)
    let parent = model.getParent(cell)
    let node

    if (parent === null || state !== null) {
      let childCount = model.getChildCount(cell)
      let geo = view.graph.getCellGeometry(cell)
      let name = null

      if (parent === model.getRoot()) {
        name = 'layer'
      } else if (parent === null) {
        name = 'graph'
      } else if (model.isEdge(cell)) {
        name = 'edge'
      } else if (childCount > 0 && geo !== null) {
        name = 'group'
      } else if (model.isVertex(cell)) {
        name = 'vertex'
      }

      if (name !== null) {
        node = enc.document.createElement(name)
        let lab = view.graph.getLabel(cell)

        if (lab !== null) {
          node.setAttribute('label', view.graph.getLabel(cell))

          if (view.graph.isHtmlLabel(cell)) {
            node.setAttribute('html', true)
          }
        }

        if (parent === null) {
          let bounds = view.getGraphBounds()

          if (bounds !== null) {
            node.setAttribute('x', Math.round(bounds.x))
            node.setAttribute('y', Math.round(bounds.y))
            node.setAttribute('width', Math.round(bounds.width))
            node.setAttribute('height', Math.round(bounds.height))
          }

          node.setAttribute('scale', view.scale)
        } else if (state !== null && geo !== null) {
          // Writes each key, value in the style pair to an attribute
          for (let i in state.style) {
            let value = state.style[i]

            // Tries to turn objects and functions into strings
            if (typeof (value) === 'function' && typeof (value) === 'object') {
              value = MxStyleRegistry.getName(value)
            }

            if (value !== null && typeof (value) !== 'function' && typeof (value) !== 'object') {
              node.setAttribute(i, value)
            }
          }

          let abs = state.absolutePoints

          // Writes the list of points into one attribute
          if (abs !== null && abs.length > 0) {
            let pts = Math.round(abs[0].x) + ',' + Math.round(abs[0].y)

            for (let i = 1; i < abs.length; i++) {
              pts += ' ' + Math.round(abs[i].x) + ',' + Math.round(abs[i].y)
            }

            node.setAttribute('points', pts)
          } else {
            // Writes the bounds into 4 attributes
            node.setAttribute('x', Math.round(state.x))
            node.setAttribute('y', Math.round(state.y))
            node.setAttribute('width', Math.round(state.width))
            node.setAttribute('height', Math.round(state.height))
          }

          let offset = state.absoluteOffset

          // Writes the offset into 2 attributes
          if (offset !== null) {
            if (offset.x !== 0) {
              node.setAttribute('dx', Math.round(offset.x))
            }

            if (offset.y !== 0) {
              node.setAttribute('dy', Math.round(offset.y))
            }
          }
        }

        for (let i = 0; i < childCount; i++) {
          let childNode = this.encodeCell(enc,
            view, model.getChildAt(cell, i))

          if (childNode !== null) {
            node.appendChild(childNode)
          }
        }
      }
    }

    return node
  }

  // Returns the codec into the registry
  return codec
}())
