import MxGraphLayout from './MxGraphLayout'
import MxObjectIdentity from '../util/MxObjectIdentity'
import MxPoint from '../util/MxPoint'

/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxParallelEdgeLayout
 *
 * Extends <MxGraphLayout> for arranging parallel edges. This layout works
 * on edges for all pairs of vertices where there is more than one edge
 * connecting the latter.
 *
 * Example:
 *
 * (code)
 * let layout = new MxParallelEdgeLayout(graph);
 * layout.execute(graph.getDefaultParent());
 * (end)
 *
 * To run the layout for the parallel edges of a changed edge only, the
 * following code can be used.
 *
 * (code)
 * let layout = new MxParallelEdgeLayout(graph);
 *
 * graph.addListener(mxEvent.CELL_CONNECTED, function(sender, evt)
 * {
 *   let model = graph.getModel();
 *   let edge = evt.getProperty('edge');
 *   let src = model.getTerminal(edge, true);
 *   let trg = model.getTerminal(edge, false);
 *
 *   layout.isEdgeIgnored = function(edge2)
 *   {
 *     let src2 = model.getTerminal(edge2, true);
 *     let trg2 = model.getTerminal(edge2, false);
 *
 *     return !(model.isEdge(edge2) && ((src === src2 && trg === trg2) || (src === trg2 && trg === src2)));
 *   };
 *
 *   layout.execute(graph.getDefaultParent());
 * });
 * (end)
 *
 * Constructor: mxCompactTreeLayout
 *
 * Constructs a new fast organic layout for the specified graph.
 */

export default class MxParallelEdgeLayout {
  constructor(graph) {
    MxGraphLayout.call(this, graph)
  };
}

/**
 * Extends MxGraphLayout.
 */
MxParallelEdgeLayout.prototype = new MxGraphLayout()
MxParallelEdgeLayout.prototype.constructor = MxParallelEdgeLayout

/**
 * Variable: spacing
 *
 * Defines the spacing between the parallels. Default is 20.
 */
MxParallelEdgeLayout.prototype.spacing = 20

/**
 * Function: execute
 *
 * Implements <MxGraphLayout.execute>.
 */
MxParallelEdgeLayout.prototype.execute = function(parent) {
  let lookup = this.findParallels(parent)

  this.graph.model.beginUpdate()
  try {
    for (let i in lookup) {
      let parallels = lookup[i]

      if (parallels.length > 1) {
        this.layout(parallels)
      }
    }
  } finally {
    this.graph.model.endUpdate()
  }
}

/**
 * Function: findParallels
 *
 * Finds the parallel edges in the given parent.
 */
MxParallelEdgeLayout.prototype.findParallels = function(parent) {
  let model = this.graph.getModel()
  let lookup = []
  let childCount = model.getChildCount(parent)

  for (let i = 0; i < childCount; i++) {
    let child = model.getChildAt(parent, i)

    if (!this.isEdgeIgnored(child)) {
      let id = this.getEdgeId(child)

      if (id !== null) {
        if (lookup[id] === null) {
          lookup[id] = []
        }

        lookup[id].push(child)
      }
    }
  }

  return lookup
}

/**
 * Function: getEdgeId
 *
 * Returns a unique ID for the given edge. The id is independent of the
 * edge direction and is built using the visible terminal of the given
 * edge.
 */
MxParallelEdgeLayout.prototype.getEdgeId = function(edge) {
  let view = this.graph.getView()

  // Cannot used cached visible terminal because this could be triggered in BEFORE_UNDO
  let src = view.getVisibleTerminal(edge, true)
  let trg = view.getVisibleTerminal(edge, false)

  if (src !== null && trg !== null) {
    src = MxObjectIdentity.get(src)
    trg = MxObjectIdentity.get(trg)

    return (src > trg) ? trg + '-' + src : src + '-' + trg
  }

  return null
}

/**
 * Function: layout
 *
 * Lays out the parallel edges in the given array.
 */
MxParallelEdgeLayout.prototype.layout = function(parallels) {
  let edge = parallels[0]
  let view = this.graph.getView()
  let model = this.graph.getModel()
  let src = model.getGeometry(view.getVisibleTerminal(edge, true))
  let trg = model.getGeometry(view.getVisibleTerminal(edge, false))

  // Routes multiple loops
  if (src === trg) {
    let x0 = src.x + src.width + this.spacing
    let y0 = src.y + src.height / 2

    for (let i = 0; i < parallels.length; i++) {
      this.route(parallels[i], x0, y0)
      x0 += this.spacing
    }
  } else if (src !== null && trg !== null) {
    // Routes parallel edges
    let scx = src.x + src.width / 2
    let scy = src.y + src.height / 2

    let tcx = trg.x + trg.width / 2
    let tcy = trg.y + trg.height / 2

    let dx = tcx - scx
    let dy = tcy - scy

    let len = Math.sqrt(dx * dx + dy * dy)

    if (len > 0) {
      let x0 = scx + dx / 2
      let y0 = scy + dy / 2

      let nx = dy * this.spacing / len
      let ny = dx * this.spacing / len

      x0 += nx * (parallels.length - 1) / 2
      y0 -= ny * (parallels.length - 1) / 2

      for (let i = 0; i < parallels.length; i++) {
        this.route(parallels[i], x0, y0)
        x0 -= nx
        y0 += ny
      }
    }
  }
}

/**
 * Function: route
 *
 * Routes the given edge via the given point.
 */
MxParallelEdgeLayout.prototype.route = function(edge, x, y) {
  if (this.graph.isCellMovable(edge)) {
    this.setEdgePoints(edge, [new MxPoint(x, y)])
  }
}
