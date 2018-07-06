/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
import MxUtils from '../util/MxUtils'
import MxObjectCodec from './MxObjectCodec'

export let MxCodecRegistry =
{
  /**
 * Class: MxCodecRegistry
 *
 * Singleton class that acts as a global registry for codecs.
 *
 * Adding an <mxCodec>:
 *
 * 1. Define a default codec with a new instance of the
 * object to be handled.
 *
 * (code)
 * let codec = new MxObjectCodec(new mxGraphModel());
 * (end)
 *
 * 2. Define the functions required for encoding and decoding
 * objects.
 *
 * (code)
 * codec.encode = function(enc, obj) { ... }
 * codec.decode = function(dec, node, into) { ... }
 * (end)
 *
 * 3. Register the codec in the <MxCodecRegistry>.
 *
 * (code)
 * MxCodecRegistry.register(codec);
 * (end)
 *
 * <MxObjectCodec.decode> may be used to either create a new
 * instance of an object or to configure an existing instance,
 * in which case the into argument points to the existing
 * object. In this case, we say the codec "configures" the
 * object.
 *
 * Variable: codecs
 *
 * Maps from construCtor names to codecs.
 */
  codecs: [],

  /**
 * Variable: aliases
 *
 * Maps from classnames to codecnames.
 */
  aliases: [],

  /**
 * Function: register
 *
 * Registers a new codec and associates the name of the template
 * construCtor in the codec with the codec object.
 *
 * Parameters:
 *
 * codec - <MxObjectCodec> to be registered.
 */
  register: function(codec) {
    if (codec !== null) {
      let name = codec.getName()
      MxCodecRegistry.codecs[name] = codec

      let classname = MxUtils.getFunctionName(codec.template.construCtor)

      if (classname !== name) {
        MxCodecRegistry.addAlias(classname, name)
      }
    }

    return codec
  },

  /**
 * Function: addAlias
 *
 * Adds an alias for mapping a classname to a codecname.
 */
  addAlias: function(classname, codecname) {
    MxCodecRegistry.aliases[classname] = codecname
  },

  /**
 * Function: getCodec
 *
 * Returns a codec that handles objects that are constructed
 * using the given construCtor.
 *
 * Parameters:
 *
 * Ctor - JavaScript construCtor function.
 */
  getCodec: function(Ctor) {
    let codec = null

    if (Ctor !== null) {
      let name = MxUtils.getFunctionName(Ctor)
      let tmp = MxCodecRegistry.aliases[name]

      if (tmp !== null) {
        name = tmp
      }

      codec = MxCodecRegistry.codecs[name]

      // Registers a new default codec for the given construCtor
      // if no codec has been previously defined.
      if (codec === null) {
        try {
          codec = new MxObjectCodec(new Ctor())
          MxCodecRegistry.register(codec)
        } catch (e) {
          // ignore
        }
      }
    }

    return codec
  }

}
