/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
let MxClipboard = {
  /**
   * Class: MxClipboard
   *
   * Singleton that implements a clipboard for graph cells.
   *
   * Example:
   *
   * (code)
   * MxClipboard.copy(graph);
   * MxClipboard.paste(graph2);
   * (end)
   *
   * This copies the selection cells from the graph to the clipboard and
   * pastes them into graph2.
   *
   * For fine-grained control of the clipboard data the <mxGraph.canExportCell>
   * and <mxGraph.canImportCell> functions can be overridden.
   *
   * To restore previous parents for pasted cells, the implementation for
   * <copy> and <paste> can be changed as follows.
   *
   * (code)
   * MxClipboard.copy = function(graph, cells)
   * {
   *   cells = cells || graph.getSelectionCells();
   *   let result = graph.getExportableCells(cells);
   *
   *   MxClipboard.parents = new Object();
   *
   *   for (let i = 0; i < result.length; i++)
   *   {
   *     MxClipboard.parents[i] = graph.model.getParent(cells[i]);
   *   }
   *
   *   MxClipboard.insertCount = 1;
   *   MxClipboard.setCells(graph.cloneCells(result));
   *
   *   return result;
   * };
   *
   * MxClipboard.paste = function(graph)
   * {
   *   if (!MxClipboard.isEmpty())
   *   {
   *     let cells = graph.getImportableCells(MxClipboard.getCells());
   *     let delta = MxClipboard.insertCount * MxClipboard.STEPSIZE;
   *     let parent = graph.getDefaultParent();
   *
   *     graph.model.beginUpdate();
   *     try
   *     {
   *       for (let i = 0; i < cells.length; i++)
   *       {
   *         let tmp = (MxClipboard.parents !== null && graph.model.contains(MxClipboard.parents[i])) ?
   *              MxClipboard.parents[i] : parent;
   *         cells[i] = graph.importCells([cells[i]], delta, delta, tmp)[0];
   *       }
   *     }
   *     finally
   *     {
   *       graph.model.endUpdate();
   *     }
   *
   *     // Increments the counter and selects the inserted cells
   *     MxClipboard.insertCount++;
   *     graph.setSelectionCells(cells);
   *   }
   * };
   * (end)
   *
   * Variable: STEPSIZE
   *
   * Defines the step size to offset the cells after each paste operation.
   * Default is 10.
   */
  STEPSIZE: 10,

  /**
   * Variable: insertCount
   *
   * Counts the number of times the clipboard data has been inserted.
   */
  insertCount: 1,

  /**
   * Variable: cells
   *
   * Holds the array of <mxCells> currently in the clipboard.
   */
  cells: null,

  /**
   * Function: setCells
   *
   * Sets the cells in the clipboard. Fires a <mxEvent.CHANGE> event.
   */
  setCells: function(cells) {
    MxClipboard.cells = cells
  },

  /**
   * Function: getCells
   *
   * Returns  the cells in the clipboard.
   */
  getCells: function() {
    return MxClipboard.cells
  },

  /**
   * Function: isEmpty
   *
   * Returns true if the clipboard currently has not data stored.
   */
  isEmpty: function() {
    return MxClipboard.getCells() === null
  },

  /**
   * Function: cut
   *
   * Cuts the given array of <mxCells> from the specified graph.
   * If cells is null then the selection cells of the graph will
   * be used. Returns the cells that have been cut from the graph.
   *
   * Parameters:
   *
   * graph - <mxGraph> that contains the cells to be cut.
   * cells - Optional array of <mxCells> to be cut.
   */
  cut: function(graph, cells) {
    cells = MxClipboard.copy(graph, cells)
    MxClipboard.insertCount = 0
    MxClipboard.removeCells(graph, cells)

    return cells
  },

  /**
   * Function: removeCells
   *
   * Hook to remove the given cells from the given graph after
   * a cut operation.
   *
   * Parameters:
   *
   * graph - <mxGraph> that contains the cells to be cut.
   * cells - Array of <mxCells> to be cut.
   */
  removeCells: function(graph, cells) {
    graph.removeCells(cells)
  },

  /**
   * Function: copy
   *
   * Copies the given array of <mxCells> from the specified
   * graph to <cells>. Returns the original array of cells that has
   * been cloned. Descendants of cells in the array are ignored.
   *
   * Parameters:
   *
   * graph - <mxGraph> that contains the cells to be copied.
   * cells - Optional array of <mxCells> to be copied.
   */
  copy: function(graph, cells) {
    cells = cells || graph.getSelectionCells()
    let result = graph.getExportableCells(graph.model.getTopmostCells(cells))
    MxClipboard.insertCount = 1
    MxClipboard.setCells(graph.cloneCells(result))

    return result
  },

  /**
   * Function: paste
   *
   * Pastes the <cells> into the specified graph restoring
   * the relation to <parents>, if possible. If the parents
   * are no longer in the graph or invisible then the
   * cells are added to the graph's default or into the
   * swimlane under the cell's new location if one exists.
   * The cells are added to the graph using <mxGraph.importCells>
   * and returned.
   *
   * Parameters:
   *
   * graph - <mxGraph> to paste the <cells> into.
   */
  paste: function(graph) {
    let cells = null

    if (!MxClipboard.isEmpty()) {
      cells = graph.getImportableCells(MxClipboard.getCells())
      let delta = MxClipboard.insertCount * MxClipboard.STEPSIZE
      let parent = graph.getDefaultParent()
      cells = graph.importCells(cells, delta, delta, parent)

      // Increments the counter and selects the inserted cells
      MxClipboard.insertCount++
      graph.setSelectionCells(cells)
    }

    return cells
  }
}

export default MxClipboard
