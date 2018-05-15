import { gConst } from '@/lib/global'
import SimpleUndo from '@/lib/utils/undo/simpleUndo'

export const initPageState = () => {
  return {
    modList: [],
    saved: true,
    activeMod: null,
    activeProperty: null,
    activeArea: 'main',
    undoManager: new SimpleUndo(),
    addingArea: gConst.ADDING_AREA_ADI,
    cursorPosition: 0,
    newModPosition: gConst.POSITION_AFTER // after active mod
  }
}

export const initLayoutPageState = () => {
  return {
    modList: [],
    saved: true,
    undoManager: new SimpleUndo(),
    newModPosition: gConst.POSITION_AFTER // after active mod
  }
}

export const initSiteState = () => {
  return {
    siteLayoutConfig: {},
    pages: {},
    theme: {
      name: 'classic',
      colorID: 0,
      fontID: 0
    }
  }
}

const state = () => ({
  activePage: null,
  activePageUrl: '',
  openedFiles: {},
  siteSettings: {},
  filemanagerTreeNodeExpandMapByPath: {},

  activeManagePaneComponent: {
    name: '',
    props: {}
  },

  showingCol: {
    isManagerShow: true,
    isCodeShow: true,
    isPreviewShow: true
  }
})

export default state
