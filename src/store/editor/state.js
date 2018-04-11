import { gConst } from '@/lib/global'

export const resetPartialState = () => {
  return {
    activePage: '',
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
    newModPosition: gConst.POSITION_AFTER // after active mod
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

  ...resetPartialState()
})

export default state
