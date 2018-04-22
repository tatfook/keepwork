import { gConst } from '@/lib/global'
import SimpleUndo from '@/lib/utils/undo/simpleUndo'

export const initPageState = () => {
  return {
    modList: [],
    activeMod: null,
    activeProperty: null,
    activeArea: 'main',
    displayLayout: true,
    layout: {
      styleID: 1,
      header: null,
      footer: null,
      sidebar: null
    },
    undoManager: new SimpleUndo(),
    activeComponentType: '',
    newModPosition: gConst.POSITION_AFTER // after active mod
  }
}

export const initLayoutPageState = () => {
  return {
    modList: [],
    activeMod: null,
    activeProperty: null,
    undoManager: new SimpleUndo(),
    activeComponentType: '',
    newModPosition: gConst.POSITION_AFTER // after active mod
  }
}

export const initSiteState = () => {
  return {
    layoutConfig: [],
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
  siteSettings: {}, // user -> site -> {layouts, header, footer, sidebar}
  filemanagerTreeNodeExpandMapByPath: {},

  showingCol: {
    isManagerShow: true,
    isCodeShow: true,
    isPreviewShow: true
  }
})

export default state
