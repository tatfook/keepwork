import { gConst } from '@/lib/global'
import SimpleUndo from '@/lib/utils/undo/simpleUndo'

export const initPageState = () => {
  return {
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
    undoManager: new SimpleUndo(),
    activeComponentType: '',
    newModPosition: gConst.POSITION_AFTER // after active mod
  }
}

const state = () => ({
  activePage: null,
  activePageUrl: '',
  openedFiles: {},
  filemanagerTreeNodeExpandMapByPath: {},

  showingCol: {
    isManagerShow: true,
    isCodeShow: true,
    isPreviewShow: true
  }
})

export default state
