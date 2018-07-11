/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
import MxCodecRegistry from './MxCodecRegistry'
import MxObjectCodec from './MxObjectCodec'
import MxGraph from '../view/MxGraph'

MxCodecRegistry.register(function() {
  /**
 * Class: MxGraphCodec
 *
 * Codec for <MxGraph>s. This class is created and registered
 * dynamically at load time and used implicitely via <mxCodec>
 * and the <MxCodecRegistry>.
 *
 * Transient Fields:
 *
 * - graphListeners
 * - eventListeners
 * - view
 * - container
 * - cellRenderer
 * - editor
 * - selection
 */
  return new MxObjectCodec(new MxGraph(),
    ['graphListeners', 'eventListeners', 'view', 'container',
      'cellRenderer', 'editor', 'selection'])
}())
