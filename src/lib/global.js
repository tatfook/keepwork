// add global variables here
import SimpleUndo from '@/lib/utils/simpleUndo'

export const gClasses = {
  compActive: 'comp-active',
  compHover: 'comp-hover',
  modActive: 'mod-active',
  modHover: 'mod-hover'
}

export const gThemeData = {
  'mod-full-width': '1080px'
}

export const gTheme = {
  '@media only screen and (min-width: 1080px)': {
    'mod-full-width': {
      width: gThemeData['mod-full-width'],
      margin: 'auto'
    }
  },
  '@media only screen and (max-width: 1080px)': {
    'mod-full-width': {
      padding: '0 20px'
    }
  }
}

export const gConst = {
  POSITION_BEFORE: 'before',
  POSITION_AFTER: 'after'
}

export const gUndoManager = new SimpleUndo()

export default {
  gClasses,
  gUndoManager,
  gThemeData,
  gTheme,
  gConst
}
