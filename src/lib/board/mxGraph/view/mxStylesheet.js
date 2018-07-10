/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxStylesheet
 *
 * Defines the appearance of the cells in a graph. See <putCellStyle> for an
 * example of creating a new cell style. It is recommended to use objects, not
 * arrays for holding cell styles. Existing styles can be cloned using
 * <MxUtils.clone> and turned into a string for debugging using
 * <MxUtils.toString>.
 *
 * Default Styles:
 *
 * The stylesheet contains two built-in styles, which are used if no style is
 * defined for a cell:
 *
 *   defaultVertex - Default style for vertices
 *   defaultEdge - Default style for edges
 *
 * Example:
 *
 * (code)
 * let vertexStyle = stylesheet.getDefaultVertexStyle();
 * vertexStyle[MxConstants.ROUNDED] = true;
 * let edgeStyle = stylesheet.getDefaultEdgeStyle();
 * edgeStyle[MxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
 * (end)
 *
 * Modifies the built-in default styles.
 *
 * To avoid the default style for a cell, add a leading semicolon
 * to the style definition, eg.
 *
 * (code)
 * ;shadow=1
 * (end)
 *
 * Removing keys:
 *
 * For removing a key in a cell style of the form [stylename;|key=value;] the
 * special value none can be used, eg. highlight;fillColor=none
 *
 * See also the helper methods in MxUtils to modify strings of this format,
 * namely <MxUtils.setStyle>, <MxUtils.indexOfStylename>,
 * <MxUtils.addStylename>, <MxUtils.removeStylename>,
 * <MxUtils.removeAllStylenames> and <MxUtils.setStyleFlag>.
 *
 * Constructor: MxStylesheet
 *
 * Constructs a new stylesheet and assigns default styles.
 */
import MxConstants from '../util/MxConstants'
import MxPerimeter from './MxPerimeter'
import MxUtils from '../util/MxUtils'

export default class MxStylesheet {
  constructor() {
    this.styles = {}

    this.putDefaultVertexStyle(this.createDefaultVertexStyle())
    this.putDefaultEdgeStyle(this.createDefaultEdgeStyle())
  };
}

/**
 * Function: styles
 *
 * Maps from names to cell styles. Each cell style is a map of key,
 * value pairs.
 */
MxStylesheet.prototype.styles = function() {}

/**
 * Function: createDefaultVertexStyle
 *
 * Creates and returns the default vertex style.
 */
MxStylesheet.prototype.createDefaultVertexStyle = function() {
  let style = {}

  style[MxConstants.STYLE_SHAPE] = MxConstants.SHAPE_RECTANGLE
  style[MxConstants.STYLE_PERIMETER] = MxPerimeter.RectanglePerimeter
  style[MxConstants.STYLE_VERTICAL_ALIGN] = MxConstants.ALIGN_MIDDLE
  style[MxConstants.STYLE_ALIGN] = MxConstants.ALIGN_CENTER
  style[MxConstants.STYLE_FILLCOLOR] = '#C3D9FF'
  style[MxConstants.STYLE_STROKECOLOR] = '#6482B9'
  style[MxConstants.STYLE_FONTCOLOR] = '#774400'

  return style
}

/**
 * Function: createDefaultEdgeStyle
 *
 * Creates and returns the default edge style.
 */
MxStylesheet.prototype.createDefaultEdgeStyle = function() {
  let style = {}

  style[MxConstants.STYLE_SHAPE] = MxConstants.SHAPE_CONNECTOR
  style[MxConstants.STYLE_ENDARROW] = MxConstants.ARROW_CLASSIC
  style[MxConstants.STYLE_VERTICAL_ALIGN] = MxConstants.ALIGN_MIDDLE
  style[MxConstants.STYLE_ALIGN] = MxConstants.ALIGN_CENTER
  style[MxConstants.STYLE_STROKECOLOR] = '#6482B9'
  style[MxConstants.STYLE_FONTCOLOR] = '#446299'

  return style
}

/**
 * Function: putDefaultVertexStyle
 *
 * Sets the default style for vertices using defaultVertex as the
 * stylename.
 *
 * Parameters:
 * style - Key, value pairs that define the style.
 */
MxStylesheet.prototype.putDefaultVertexStyle = function(style) {
  this.putCellStyle('defaultVertex', style)
}

/**
 * Function: putDefaultEdgeStyle
 *
 * Sets the default style for edges using defaultEdge as the stylename.
 */
MxStylesheet.prototype.putDefaultEdgeStyle = function(style) {
  this.putCellStyle('defaultEdge', style)
}

/**
 * Function: getDefaultVertexStyle
 *
 * Returns the default style for vertices.
 */
MxStylesheet.prototype.getDefaultVertexStyle = function() {
  return this.styles['defaultVertex']
}

/**
 * Function: getDefaultEdgeStyle
 *
 * Sets the default style for edges.
 */
MxStylesheet.prototype.getDefaultEdgeStyle = function() {
  return this.styles['defaultEdge']
}

/**
 * Function: putCellStyle
 *
 * Stores the given map of key, value pairs under the given name in
 * <styles>.
 *
 * Example:
 *
 * The following example adds a new style called 'rounded' into an
 * existing stylesheet:
 *
 * (code)
 * let style = new Object();
 * style[MxConstants.STYLE_SHAPE] = MxConstants.SHAPE_RECTANGLE;
 * style[MxConstants.STYLE_PERIMETER] = MxPerimeter.RectanglePerimeter;
 * style[MxConstants.STYLE_ROUNDED] = true;
 * graph.getStylesheet().putCellStyle('rounded', style);
 * (end)
 *
 * In the above example, the new style is an object. The possible keys of
 * the object are all the constants in <MxConstants> that start with STYLE
 * and the values are either JavaScript objects, such as
 * <MxPerimeter.RightAngleRectanglePerimeter> (which is in fact a function)
 * or expressions, such as true. Note that not all keys will be
 * interpreted by all shapes (eg. the line shape ignores the fill color).
 * The final call to this method associates the style with a name in the
 * stylesheet. The style is used in a cell with the following code:
 *
 * (code)
 * model.setStyle(cell, 'rounded');
 * (end)
 *
 * Parameters:
 *
 * name - Name for the style to be stored.
 * style - Key, value pairs that define the style.
 */
MxStylesheet.prototype.putCellStyle = function(name, style) {
  this.styles[name] = style
}

/**
 * Function: getCellStyle
 *
 * Returns the cell style for the specified stylename or the given
 * defaultStyle if no style can be found for the given stylename.
 *
 * Parameters:
 *
 * name - String of the form [(stylename|key=value);] that represents the
 * style.
 * defaultStyle - Default style to be returned if no style can be found.
 */
MxStylesheet.prototype.getCellStyle = function(name, defaultStyle) {
  let style = defaultStyle

  if (name !== null && name.length > 0) {
    let pairs = name.split(';')

    if (style !== null && name.charAt(0) !== ';') {
      style = MxUtils.clone(style)
    } else {
      style = {}
    }

    // Parses each key, value pair into the existing style
    for (let i = 0; i < pairs.length; i++) {
      let tmp = pairs[i]
      let pos = tmp.indexOf('=')

      if (pos >= 0) {
        let key = tmp.substring(0, pos)
        let value = tmp.substring(pos + 1)

        if (value === MxConstants.NONE) {
          delete style[key]
        } else if (MxUtils.isNumeric(value)) {
          style[key] = parseFloat(value)
        } else {
          style[key] = value
        }
      } else {
        // Merges the entries from a named style
        let tmpStyle = this.styles[tmp]

        if (tmpStyle !== null) {
          for (let key in tmpStyle) {
            style[key] = tmpStyle[key]
          }
        }
      }
    }
  }

  return style
}
