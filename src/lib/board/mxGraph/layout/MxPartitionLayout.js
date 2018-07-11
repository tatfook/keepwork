import MxGraphLayout from './MxGraphLayout'
import MxRectangle from '../util/MxRectangle'

/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxPartitionLayout
 *
 * Extends <MxGraphLayout> for partitioning the parent cell vertically or
 * horizontally by filling the complete area with the child cells. A horizontal
 * layout partitions the height of the given parent whereas a a non-horizontal
 * layout partitions the width. If the parent is a layer (that is, a child of
 * the root node), then the current graph size is partitioned. The children do
 * not need to be connected for this layout to work.
 *
 * Example:
 *
 * (code)
 * let layout = new MxPartitionLayout(graph, true, 10, 20);
 * layout.execute(graph.getDefaultParent());
 * (end)
 *
 * Constructor: MxPartitionLayout
 *
 * Constructs a new stack layout layout for the specified graph,
 * spacing, orientation and offset.
 */

export default class MxPartitionLayout {
  constructor(graph, horizontal, spacing, border) {
    MxGraphLayout.call(this, graph)
    this.horizontal = (horizontal !== null) ? horizontal : true
    this.spacing = spacing || 0
    this.border = border || 0
  };
}

/**
 * Extends MxGraphLayout.
 */
MxPartitionLayout.prototype = new MxGraphLayout()
MxPartitionLayout.prototype.constructor = MxPartitionLayout

/**
 * Variable: horizontal
 *
 * Boolean indicating the direction in which the space is partitioned.
 * Default is true.
 */
MxPartitionLayout.prototype.horizontal = null

/**
 * Variable: spacing
 *
 * Integer that specifies the absolute spacing in pixels between the
 * children. Default is 0.
 */
MxPartitionLayout.prototype.spacing = null

/**
 * Variable: border
 *
 * Integer that specifies the absolute inset in pixels for the parent that
 * contains the children. Default is 0.
 */
MxPartitionLayout.prototype.border = null

/**
 * Variable: resizeVertices
 *
 * Boolean that specifies if vertices should be resized. Default is true.
 */
MxPartitionLayout.prototype.resizeVertices = true

/**
 * Function: isHorizontal
 *
 * Returns <horizontal>.
 */
MxPartitionLayout.prototype.isHorizontal = function() {
  return this.horizontal
}

/**
 * Function: moveCell
 *
 * Implements <MxGraphLayout.moveCell>.
 */
MxPartitionLayout.prototype.moveCell = function(cell, x, y) {
  let model = this.graph.getModel()
  let parent = model.getParent(cell)

  if (cell !== null && parent !== null) {
    let i = 0
    let last = 0
    let childCount = model.getChildCount(parent)

    // Finds index of the closest swimlane
    // TODO: Take into account the orientation
    for (i = 0; i < childCount; i++) {
      let child = model.getChildAt(parent, i)
      let bounds = this.getVertexBounds(child)

      if (bounds !== null) {
        let tmp = bounds.x + bounds.width / 2

        if (last < x && tmp > x) {
          break
        }

        last = tmp
      }
    }

    // Changes child order in parent
    let idx = parent.getIndex(cell)
    idx = Math.max(0, i - ((i > idx) ? 1 : 0))

    model.add(parent, cell, idx)
  }
}

/**
 * Function: execute
 *
 * Implements <MxGraphLayout.execute>. All children where <isVertexIgnored>
 * returns false and <isVertexMovable> returns true are modified.
 */
MxPartitionLayout.prototype.execute = function(parent) {
  let horizontal = this.isHorizontal()
  let model = this.graph.getModel()
  let pgeo = model.getGeometry(parent)

  // Handles special case where the parent is either a layer with no
  // geometry or the current root of the view in which case the size
  // of the graph's container will be used.
  if (this.graph.container !== null && ((pgeo === null && model.isLayer(parent)) || parent === this.graph.getView().currentRoot)) {
    let width = this.graph.container.offsetWidth - 1
    let height = this.graph.container.offsetHeight - 1
    pgeo = new MxRectangle(0, 0, width, height)
  }

  if (pgeo !== null) {
    let children = []
    let childCount = model.getChildCount(parent)

    for (let i = 0; i < childCount; i++) {
      let child = model.getChildAt(parent, i)

      if (!this.isVertexIgnored(child) && this.isVertexMovable(child)) {
        children.push(child)
      }
    }

    let n = children.length

    if (n > 0) {
      let x0 = this.border
      let y0 = this.border
      let other = (horizontal) ? pgeo.height : pgeo.width
      other -= 2 * this.border

      let size = (this.graph.isSwimlane(parent))
        ? this.graph.getStartSize(parent)
        : new MxRectangle()

      other -= (horizontal) ? size.height : size.width
      x0 = x0 + size.width
      y0 = y0 + size.height

      let tmp = this.border + (n - 1) * this.spacing
      let value = (horizontal)
        ? ((pgeo.width - x0 - tmp) / n)
        : ((pgeo.height - y0 - tmp) / n)

      // Avoids negative values, that is values where the sum of the
      // spacing plus the border is larger then the available space
      if (value > 0) {
        model.beginUpdate()
        try {
          for (let i = 0; i < n; i++) {
            let child = children[i]
            let geo = model.getGeometry(child)

            if (geo !== null) {
              geo = geo.clone()
              geo.x = x0
              geo.y = y0

              if (horizontal) {
                if (this.resizeVertices) {
                  geo.width = value
                  geo.height = other
                }

                x0 += value + this.spacing
              } else {
                if (this.resizeVertices) {
                  geo.height = value
                  geo.width = other
                }

                y0 += value + this.spacing
              }

              model.setGeometry(child, geo)
            }
          }
        } finally {
          model.endUpdate()
        }
      }
    }
  }
}
