/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
import MxConstants from '../util/MxConstants'
import MxEdgeStyle from './MxEdgeStyle'
import MxPerimeter from './MxPerimeter'

const MxStyleRegistry =
{
  /**
   * Class: MxStyleRegistry
   *
   * Singleton class that acts as a global converter from string to object values
   * in a style. This is currently only used to perimeters and edge styles.
   *
   * Variable: values
   *
   * Maps from strings to objects.
   */
  values: [],

  /**
   * Function: putValue
   *
   * Puts the given object into the registry under the given name.
   */
  putValue: function(name, obj) {
    MxStyleRegistry.values[name] = obj
  },

  /**
   * Function: getValue
   *
   * Returns the value associated with the given name.
   */
  getValue: function(name) {
    return MxStyleRegistry.values[name]
  },

  /**
   * Function: getName
   *
   * Returns the name for the given value.
   */
  getName: function(value) {
    for (var key in MxStyleRegistry.values) {
      if (MxStyleRegistry.values[key] === value) {
        return key
      }
    }

    return null
  }

}

MxStyleRegistry.putValue(MxConstants.EDGESTYLE_ELBOW, MxEdgeStyle.ElbowConnector)
MxStyleRegistry.putValue(MxConstants.EDGESTYLE_ENTITY_RELATION, MxEdgeStyle.EntityRelation)
MxStyleRegistry.putValue(MxConstants.EDGESTYLE_LOOP, MxEdgeStyle.Loop)
MxStyleRegistry.putValue(MxConstants.EDGESTYLE_SIDETOSIDE, MxEdgeStyle.SideToSide)
MxStyleRegistry.putValue(MxConstants.EDGESTYLE_TOPTOBOTTOM, MxEdgeStyle.TopToBottom)
MxStyleRegistry.putValue(MxConstants.EDGESTYLE_ORTHOGONAL, MxEdgeStyle.OrthConnector)
MxStyleRegistry.putValue(MxConstants.EDGESTYLE_SEGMENT, MxEdgeStyle.SegmentConnector)

MxStyleRegistry.putValue(MxConstants.PERIMETER_ELLIPSE, MxPerimeter.EllipsePerimeter)
MxStyleRegistry.putValue(MxConstants.PERIMETER_RECTANGLE, MxPerimeter.RectanglePerimeter)
MxStyleRegistry.putValue(MxConstants.PERIMETER_RHOMBUS, MxPerimeter.RhombusPerimeter)
MxStyleRegistry.putValue(MxConstants.PERIMETER_TRIANGLE, MxPerimeter.TrianglePerimeter)
MxStyleRegistry.putValue(MxConstants.PERIMETER_HEXAGON, MxPerimeter.HexagonPerimeter)

export default MxStyleRegistry
