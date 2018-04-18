import _ from 'lodash'
import { getFileFullPathByPath } from '@/lib/utils/gitlab'
import undoHelper from '@/lib/utils/undo/undoHelper'

const getters = {
  openedFiles: (state, getters, rootState, { 'user/username': username }) =>
    state.openedFiles[username] || {},
  getOpenedFileByPath: (state, { openedFiles }) => path =>
    openedFiles[getFileFullPathByPath(path)] || {},

  activePage: state => state.activePage,
  activePageUrl: state => state.activePageUrl,
  activePageInfo: (state, { activePageUrl }) => {
    let pageInfos = activePageUrl.split('/')
    let username = pageInfos[1]
    let sitename = pageInfos[2]
    let paths = pageInfos.slice(3)
    return { username, sitename, paths }
  },
  activePageUsername: (state, { activePageInfo: { username } }) => username,
  code: (state, { activePage = {} }) =>
    (activePage && activePage.content) || '',

  themeConf: state => {
    if (state.activePage) return state.activePage.theme
    return {}
  },
  modList: state => {
    if (state.activePage) return state.activePage.modList
    return []
  },
  activeMod: state => {
    if (state.activePage) return state.activePage.activeMod
  },
  activeProperty: state => {
    if (state.activePage) return state.activePage.activeProperty
  },
  activePropertyData: state => {
    return _.get(
      state,
      ['activePage', 'activeMod', 'data', state.activeProperty],
      {}
    )
  },

  hasActiveMod: state => state.activePage && state.activePage.activeMod,
  hasActiveProperty: state =>
    state.activePage && state.activePage.activeProperty,
  activeComponentType: state => state.activeWinType,
  activePropertyTabType: state => {
    if (state.activePage) return state.activePage.activePropertyTabType
  },
  showingCol: state => state.showingCol,
  canUndo: state =>
    state.activePage && undoHelper.canUndo(state.activePage.undoManager),
  canRedo: state =>
    state.activePage && undoHelper.canRedo(state.activePage.undoManager),
  filemanagerTreeNodeExpandMapByPath: state =>
    state.filemanagerTreeNodeExpandMapByPath
}

export default getters
