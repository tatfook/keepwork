/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: MxGenericChangeCodec
 *
 * Codec for <MxValueChange>s, <MxStyleChange>s, <MxGeometryChange>s,
 * <MxCollapseChange>s and <MxVisibleChange>s. This class is created
 * and registered dynamically at load time and used implicitely
 * via <MxCodec> and the <MxCodecRegistry>.
 *
 * Transient Fields:
 *
 * - model
 * - previous
 *
 * Reference Fields:
 *
 * - cell
 *
 * Constructor: MxGenericChangeCodec
 *
 * Factory function that creates a <MxObjectCodec> for
 * the specified change and fieldname.
 *
 * Parameters:
 *
 * obj - An instance of the change object.
 * letiable - The fieldname for the change data.
 */
import MxCodecRegistry from './MxCodecRegistry'
import MxObjectCodec from './MxObjectCodec'
import { MxValueChange, MxStyleChange, MxGeometryChange, MxCollapseChange, MxVisibleChange, MxCellAttributeChange } from '../model/MxGraphModel'
import MxUtils from '../util/MxUtils'

export let MxGenericChangeCodec = function(obj, letiable) {
  let codec = new MxObjectCodec(obj, ['model', 'previous'], ['cell'])

  /**
 * Function: afterDecode
 *
 * Restores the state by assigning the previous value.
 */
  codec.afterDecode = function(dec, node, obj) {
    // Allows forward references in sessions. This is a workaround
    // for the sequence of edits in MxGraph.moveCells and cellsAdded.
    if (MxUtils.isNode(obj.cell)) {
      obj.cell = dec.decodeCell(obj.cell, false)
    }

    obj.previous = obj[letiable]

    return obj
  }

  return codec
}

// Registers the codecs
MxCodecRegistry.register(MxGenericChangeCodec(new MxValueChange(), 'value'))
MxCodecRegistry.register(MxGenericChangeCodec(new MxStyleChange(), 'style'))
MxCodecRegistry.register(MxGenericChangeCodec(new MxGeometryChange(), 'geometry'))
MxCodecRegistry.register(MxGenericChangeCodec(new MxCollapseChange(), 'collapsed'))
MxCodecRegistry.register(MxGenericChangeCodec(new MxVisibleChange(), 'visible'))
MxCodecRegistry.register(MxGenericChangeCodec(new MxCellAttributeChange(), 'value'))
