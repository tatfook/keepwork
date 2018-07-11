import MxGraphLayout from './MxGraphLayout'
/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxCompositeLayout
 *
 * Allows to compose multiple layouts into a single layout. The master layout
 * is the layout that handles move operations if another layout than the first
 * element in <layouts> should be used. The <master> layout is not executed as
 * the code assumes that it is part of <layouts>.
 *
 * Example:
 * (code)
 * var first = new mxFastOrganicLayout(graph);
 * var second = new mxParallelEdgeLayout(graph);
 * var layout = new MxCompositeLayout(graph, [first, second], first);
 * layout.execute(graph.getDefaultParent());
 * (end)
 *
 * Constructor: MxCompositeLayout
 *
 * Constructs a new layout using the given layouts. The graph instance is
 * required for creating the transaction that contains all layouts.
 *
 * Arguments:
 *
 * graph - Reference to the enclosing <mxGraph>.
 * layouts - Array of <MxGraphLayouts>.
 * master - Optional layout that handles moves. If no layout is given then
 * the first layout of the above array is used to handle moves.
 */

export default class MxCompositeLayout {
  constructor(graph, layouts, master) {
    MxGraphLayout.call(this, graph)
    this.layouts = layouts
    this.master = master
  };
}

/**
 * Extends MxGraphLayout.
 */
MxCompositeLayout.prototype = new MxGraphLayout()
MxCompositeLayout.prototype.constructor = MxCompositeLayout

/**
 * Variable: layouts
 *
 * Holds the array of <MxGraphLayouts> that this layout contains.
 */
MxCompositeLayout.prototype.layouts = null

/**
 * Variable: layouts
 *
 * Reference to the <MxGraphLayouts> that handles moves. If this is null
 * then the first layout in <layouts> is used.
 */
MxCompositeLayout.prototype.master = null

/**
 * Function: moveCell
 *
 * Implements <MxGraphLayout.moveCell> by calling move on <master> or the first
 * layout in <layouts>.
 */
MxCompositeLayout.prototype.moveCell = function(cell, x, y) {
  if (this.master != null) {
    this.master.move.apply(this.master, arguments)
  } else {
    this.layouts[0].move.apply(this.layouts[0], arguments)
  }
}

/**
 * Function: execute
 *
 * Implements <MxGraphLayout.execute> by executing all <layouts> in a
 * single transaction.
 */
MxCompositeLayout.prototype.execute = function(parent) {
  var model = this.graph.getModel()

  model.beginUpdate()
  try {
    for (var i = 0; i < this.layouts.length; i++) {
      this.layouts[i].execute.apply(this.layouts[i], arguments)
    }
  } finally {
    model.endUpdate()
  }
}
