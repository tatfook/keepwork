import SimpleUndo from '@/lib/utils/simpleUndo'

export const UndoManager = new SimpleUndo()

const state = () => ({
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
  showingCol: {
    isManagerShow: true,
    isCodeShow: true,
    isPreviewShow: true
  },
  filemanagerTreeNodeExpandMapByPath: {},
  undoManager: UndoManager
})

export const initialState = state

export default state
