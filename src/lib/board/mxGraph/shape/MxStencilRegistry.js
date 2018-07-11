/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 *
 * Code to add stencils.
 *
 * (code)
 * let req = mxUtils.load('test/stencils.xml');
 * let root = req.getDocumentElement();
 * let shape = root.firstChild;
 *
 * while (shape != null)
 * {
 *  if (shape.nodeType == mxConstants.NODETYPE_ELEMENT)
 *   {
 *     MxStencilRegistry.addStencil(shape.getAttribute('name'), new mxStencil(shape));
 *   }
 *
 *   shape = shape.nextSibling;
 * }
 * (end)
 */
const MxStencilRegistry =
{
  /**
 * Class: MxStencilRegistry
 *
 * A singleton class that provides a registry for stencils and the methods
 * for painting those stencils onto a canvas or into a DOM.
 */
  stencils: {},

  /**
 * Function: addStencil
 *
 * Adds the given <mxStencil>.
 */
  addStencil: function(name, stencil) {
    MxStencilRegistry.stencils[name] = stencil
  },

  /**
 * Function: getStencil
 *
 * Returns the <mxStencil> for the given name.
 */
  getStencil: function(name) {
    return MxStencilRegistry.stencils[name]
  }

}
export default MxStencilRegistry
