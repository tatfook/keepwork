import MxGraphLayout from './MxGraphLayout'
import MxRectangle from '../util/MxRectangle'
import mxUtils from '../util/mxUtils'
import MxConstants from '../util/MxConstants'

/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxStackLayout
 *
 * Extends <MxGraphLayout> to create a horizontal or vertical stack of the
 * child vertices. The children do not need to be connected for this layout
 * to work.
 *
 * Example:
 *
 * (code)
 * let layout = new MxStackLayout(graph, true);
 * layout.execute(graph.getDefaultParent());
 * (end)
 *
 * Constructor: MxStackLayout
 *
 * Constructs a new stack layout layout for the specified graph,
 * spacing, orientation and offset.
 */

export default class MxStackLayout {
  constructor(graph, horizontal, spacing, x0, y0, border) {
    MxGraphLayout.call(this, graph)
    this.horizontal = (horizontal !== null) ? horizontal : true
    this.spacing = (spacing !== null) ? spacing : 0
    this.x0 = (x0 !== null) ? x0 : 0
    this.y0 = (y0 !== null) ? y0 : 0
    this.border = (border !== null) ? border : 0
  };
}

/**
 * Extends MxGraphLayout.
 */
MxStackLayout.prototype = new MxGraphLayout()
MxStackLayout.prototype.constructor = MxStackLayout

/**
 * Variable: horizontal
 *
 * Specifies the orientation of the layout. Default is true.
 */
MxStackLayout.prototype.horizontal = null

/**
 * Variable: spacing
 *
 * Specifies the spacing between the cells. Default is 0.
 */
MxStackLayout.prototype.spacing = null

/**
 * Variable: x0
 *
 * Specifies the horizontal origin of the layout. Default is 0.
 */
MxStackLayout.prototype.x0 = null

/**
 * Variable: y0
 *
 * Specifies the vertical origin of the layout. Default is 0.
 */
MxStackLayout.prototype.y0 = null

/**
 * Variable: border
 *
 * Border to be added if fill is true. Default is 0.
 */
MxStackLayout.prototype.border = 0

/**
 * Variable: marginTop
 *
 * Top margin for the child area. Default is 0.
 */
MxStackLayout.prototype.marginTop = 0

/**
 * Variable: marginLeft
 *
 * Top margin for the child area. Default is 0.
 */
MxStackLayout.prototype.marginLeft = 0

/**
 * Variable: marginRight
 *
 * Top margin for the child area. Default is 0.
 */
MxStackLayout.prototype.marginRight = 0

/**
 * Variable: marginBottom
 *
 * Top margin for the child area. Default is 0.
 */
MxStackLayout.prototype.marginBottom = 0

/**
 * Variable: keepFirstLocation
 *
 * Boolean indicating if the location of the first cell should be
 * kept, that is, it will not be moved to x0 or y0.
 */
MxStackLayout.prototype.keepFirstLocation = false

/**
 * Variable: fill
 *
 * Boolean indicating if dimension should be changed to fill out the parent
 * cell. Default is false.
 */
MxStackLayout.prototype.fill = false

/**
 * Variable: resizeParent
 *
 * If the parent should be resized to match the width/height of the
 * stack. Default is false.
 */
MxStackLayout.prototype.resizeParent = false

/**
 * Variable: resizeParentMax
 *
 * Use maximum of existing value and new value for resize of parent.
 * Default is false.
 */
MxStackLayout.prototype.resizeParentMax = false

/**
 * Variable: resizeLast
 *
 * If the last element should be resized to fill out the parent. Default is
 * false. If <resizeParent> is true then this is ignored.
 */
MxStackLayout.prototype.resizeLast = false

/**
 * Variable: wrap
 *
 * Value at which a new column or row should be created. Default is null.
 */
MxStackLayout.prototype.wrap = null

/**
 * Variable: borderCollapse
 *
 * If the strokeWidth should be ignored. Default is true.
 */
MxStackLayout.prototype.borderCollapse = true

/**
 * Function: isHorizontal
 *
 * Returns <horizontal>.
 */
MxStackLayout.prototype.isHorizontal = function() {
  return this.horizontal
}

/**
 * Function: moveCell
 *
 * Implements <MxGraphLayout.moveCell>.
 */
MxStackLayout.prototype.moveCell = function(cell, x, y) {
  let model = this.graph.getModel()
  let parent = model.getParent(cell)
  let horizontal = this.isHorizontal()

  if (cell !== null && parent !== null) {
    let i = 0
    let last = 0
    let childCount = model.getChildCount(parent)
    let value = (horizontal) ? x : y
    let pstate = this.graph.getView().getState(parent)

    if (pstate !== null) {
      value -= (horizontal) ? pstate.x : pstate.y
    }

    value /= this.graph.view.scale

    for (i = 0; i < childCount; i++) {
      let child = model.getChildAt(parent, i)

      if (child !== cell) {
        let bounds = model.getGeometry(child)

        if (bounds !== null) {
          let tmp = (horizontal)
            ? bounds.x + bounds.width / 2
            : bounds.y + bounds.height / 2

          if (last <= value && tmp > value) {
            break
          }

          last = tmp
        }
      }
    }

    // Changes child order in parent
    let idx = parent.getIndex(cell)
    idx = Math.max(0, i - ((i > idx) ? 1 : 0))

    model.add(parent, cell, idx)
  }
}

/**
 * Function: getParentSize
 *
 * Returns the size for the parent container or the size of the graph
 * container if the parent is a layer or the root of the model.
 */
MxStackLayout.prototype.getParentSize = function(parent) {
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

  return pgeo
}

/**
 * Function: execute
 *
 * Implements <MxGraphLayout.execute>.
 *
 * Only children where <isVertexIgnored> returns false are taken into
 * account.
 */
MxStackLayout.prototype.execute = function(parent) {
  if (parent !== null) {
    let pgeo = this.getParentSize(parent)
    let horizontal = this.isHorizontal()
    let model = this.graph.getModel()
    let fillValue = null

    if (pgeo !== null) {
      fillValue = (horizontal) ? pgeo.height - this.marginTop - this.marginBottom
        : pgeo.width - this.marginLeft - this.marginRight
    }

    fillValue -= 2 * this.border
    let x0 = this.x0 + this.border + this.marginLeft
    let y0 = this.y0 + this.border + this.marginTop

    // Handles swimlane start size
    if (this.graph.isSwimlane(parent)) {
      // Uses computed style to get latest
      let style = this.graph.getCellStyle(parent)
      let start = mxUtils.getNumber(style, MxConstants.STYLE_STARTSIZE, MxConstants.DEFAULT_STARTSIZE)
      let horz = mxUtils.getValue(style, MxConstants.STYLE_HORIZONTAL, true) === 1

      if (pgeo !== null) {
        if (horz) {
          start = Math.min(start, pgeo.height)
        } else {
          start = Math.min(start, pgeo.width)
        }
      }

      if (horizontal === horz) {
        fillValue -= start
      }

      if (horz) {
        y0 += start
      } else {
        x0 += start
      }
    }

    model.beginUpdate()
    try {
      let tmp = 0
      let last = null
      let lastValue = 0
      let lastChild = null
      let childCount = model.getChildCount(parent)

      for (let i = 0; i < childCount; i++) {
        let child = model.getChildAt(parent, i)

        if (!this.isVertexIgnored(child) && this.isVertexMovable(child)) {
          let geo = model.getGeometry(child)

          if (geo !== null) {
            geo = geo.clone()

            if (this.wrap !== null && last !== null) {
              if ((horizontal && last.x + last.width + geo.width + 2 * this.spacing > this.wrap) || (!horizontal && last.y + last.height + geo.height + 2 * this.spacing > this.wrap)) {
                last = null

                if (horizontal) {
                  y0 += tmp + this.spacing
                } else {
                  x0 += tmp + this.spacing
                }

                tmp = 0
              }
            }

            tmp = Math.max(tmp, (horizontal) ? geo.height : geo.width)
            let sw = 0

            if (!this.borderCollapse) {
              let childStyle = this.graph.getCellStyle(child)
              sw = mxUtils.getNumber(childStyle, MxConstants.STYLE_STROKEWIDTH, 1)
            }

            if (last !== null) {
              if (horizontal) {
                geo.x = lastValue + this.spacing + Math.floor(sw / 2)
              } else {
                geo.y = lastValue + this.spacing + Math.floor(sw / 2)
              }
            } else if (!this.keepFirstLocation) {
              if (horizontal) {
                geo.x = x0
              } else {
                geo.y = y0
              }
            }

            if (horizontal) {
              geo.y = y0
            } else {
              geo.x = x0
            }

            if (this.fill && fillValue !== null) {
              if (horizontal) {
                geo.height = fillValue
              } else {
                geo.width = fillValue
              }
            }

            this.setChildGeometry(child, geo)
            lastChild = child
            last = geo

            if (horizontal) {
              lastValue = last.x + last.width + Math.floor(sw / 2)
            } else {
              lastValue = last.y + last.height + Math.floor(sw / 2)
            }
          }
        }
      }

      if (this.resizeParent && pgeo !== null && last !== null && !this.graph.isCellCollapsed(parent)) {
        this.updateParentGeometry(parent, pgeo, last)
      } else if (this.resizeLast && pgeo !== null && last !== null && lastChild !== null) {
        if (horizontal) {
          last.width = pgeo.width - last.x - this.spacing - this.marginRight - this.marginLeft
        } else {
          last.height = pgeo.height - last.y - this.spacing - this.marginBottom
        }

        this.setChildGeometry(lastChild, last)
      }
    } finally {
      model.endUpdate()
    }
  }
}

/**
 * Function: execute
 *
 * Implements <MxGraphLayout.execute>.
 *
 * Only children where <isVertexIgnored> returns false are taken into
 * account.
 */
MxStackLayout.prototype.setChildGeometry = function(child, geo) {
  let geo2 = this.graph.getCellGeometry(child)

  if (geo2 === null || geo.x !== geo2.x || geo.y !== geo2.y || geo.width !== geo2.width || geo.height !== geo2.height) {
    this.graph.getModel().setGeometry(child, geo)
  }
}

/**
 * Function: execute
 *
 * Implements <MxGraphLayout.execute>.
 *
 * Only children where <isVertexIgnored> returns false are taken into
 * account.
 */
MxStackLayout.prototype.updateParentGeometry = function(parent, pgeo, last) {
  let horizontal = this.isHorizontal()
  let model = this.graph.getModel()

  let pgeo2 = pgeo.clone()

  if (horizontal) {
    let tmp = last.x + last.width + this.marginRight + this.border

    if (this.resizeParentMax) {
      pgeo2.width = Math.max(pgeo2.width, tmp)
    } else {
      pgeo2.width = tmp
    }
  } else {
    let tmp = last.y + last.height + this.marginBottom + this.border

    if (this.resizeParentMax) {
      pgeo2.height = Math.max(pgeo2.height, tmp)
    } else {
      pgeo2.height = tmp
    }
  }

  if (pgeo.x !== pgeo2.x || pgeo.y !== pgeo2.y || pgeo.width !== pgeo2.width || pgeo.height !== pgeo2.height) {
    model.setGeometry(parent, pgeo2)
  }
}
