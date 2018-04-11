// add global variables here
import SimpleUndo from '@/lib/utils/simpleUndo'

export const gClasses = {
  compActive: 'comp-active',
  compHover: 'comp-hover',
  modActive: 'mod-active',
  modHover: 'mod-hover'
}

export const gConst = {
  POSITION_BEFORE: 'before',
  POSITION_AFTER: 'after'
}

export const gUndoManager = new SimpleUndo()

export default {
  gClasses,
  gConst,
  gUndoManager
}
