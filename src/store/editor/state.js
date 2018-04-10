import SimpleUndo from '@/lib/utils/simpleUndo'
import { gConst } from '@/lib/global'

export const resetPartialState = () => {
  const UndoManager = new SimpleUndo()

  return {
    activePage: '',
    code: '',
    modList: [],
    activeMod: null,
    activeProperty: null,
    // layout: {
    //   header: {},
    //   footer: {},
    //   siderbar: {}
    // },
    theme: {
      name: 'classic',
      colorID: 0,
      fontID: 0
    },
    activeComponentType: '',
    undoManager: UndoManager
  }
}

const state = () => ({
  openedFiles: {},
  filemanagerTreeNodeExpandMapByPath: {},

  showingCol: {
    isManagerShow: true,
    isCodeShow: true,
    isPreviewShow: true
  },
  newModPosition: gConst.POSITION_AFTER, // after active mod

  ...resetPartialState()
})

export default state
