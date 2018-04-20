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
  activePageInfo: (state, { activePageUrl, openedFiles }) => {
    let pageInfos = activePageUrl.split('/').filter(x => x)
    let [username, sitename] = pageInfos
    let isLegal = (username && sitename)
    let sitepath = isLegal ? `${username}/${sitename}` : ''
    let fullPath = isLegal ? getFileFullPathByPath(activePageUrl) : ''
    let [, , ...paths] = fullPath.split('/').filter(x => x)
    let { saved } = openedFiles[fullPath] || {}
    return { username, sitename, isLegal, fullPath, sitepath, paths, saved }
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
