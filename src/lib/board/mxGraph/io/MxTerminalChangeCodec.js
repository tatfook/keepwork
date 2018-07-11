/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
import mxCodecRegistry from './mxCodecRegistry'
import MxObjectCodec from './MxObjectCodec'
import { MxTerminalChange } from '../model/MxGraphModel'

mxCodecRegistry.register(function() {
  /**
 * Class: mxTerminalChangeCodec
 *
 * Codec for <MxTerminalChange>s. This class is created and registered
 * dynamically at load time and used implicitely via <mxCodec> and
 * the <mxCodecRegistry>.
 *
 * Transient Fields:
 *
 * - model
 * - previous
 *
 * Reference Fields:
 *
 * - cell
 * - terminal
 */
  let codec = new MxObjectCodec(new MxTerminalChange(),
    ['model', 'previous'], ['cell', 'terminal'])

  /**
 * Function: afterDecode
 *
 * Restores the state by assigning the previous value.
 */
  codec.afterDecode = function(dec, node, obj) {
    obj.previous = obj.terminal

    return obj
  }

  // Returns the codec into the registry
  return codec
}())
