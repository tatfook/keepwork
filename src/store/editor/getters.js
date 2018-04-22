import _ from 'lodash'
import {
  getFileFullPathByPath,
  getFileSitePathByPath
} from '@/lib/utils/gitlab'
import UndoHelper from '@/lib/utils/undo/undoHelper'
import LayoutHelper from '@/lib/mod/layout'

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
    let isLegal = username && sitename
    let sitepath = isLegal ? `${username}/${sitename}` : ''
    let fullPath = isLegal ? getFileFullPathByPath(activePageUrl) : ''
    let [, , ...paths] = fullPath.split('/').filter(x => x)
    let { saved } = openedFiles[fullPath] || {}
    return { username, sitename, isLegal, fullPath, sitepath, paths, saved }
  },
  activePageUsername: (state, { activePageInfo: { username } }) => username,
  code: (state, { activePage }) => (activePage && activePage.content) || '',
  themeConf: (state, { siteSetting }) => {
    if (siteSetting) return siteSetting.theme
    return {}
  },
  activeArea: (state, { activePage }) => activePage && activePage.activeArea,
  modList: (state, { mainModList, layout, activeArea, siteSetting }) => {
    if (activeArea === 'main') return mainModList
    else if (layout && layout[activeArea]) {
      return siteSetting.pages[layout.header].modList
    }
    return []
  },
  activeMod: state => {
    if (state.activePage) return state.activePage.activeMod
  },
  activeProperty: state => {
    if (state.activePage) return state.activePage.activeProperty
  },
  activePropertyData: (state, { activeProperty }) => {
    return _.get(state, ['activePage', 'activeMod', 'data', activeProperty], {})
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
    state.activePage && UndoHelper.canUndo(state.activePage.undoManager),
  canRedo: state =>
    state.activePage && UndoHelper.canRedo(state.activePage.undoManager),
  filemanagerTreeNodeExpandMapByPath: state =>
    state.filemanagerTreeNodeExpandMapByPath,

  allSiteSettings: state => state.siteSettings,
  sitePath: state => getFileSitePathByPath(state.activePageUrl),
  siteSetting: (state, { allSiteSettings, sitePath }) =>
    allSiteSettings[sitePath],
  layout: (state, { allSiteSettings, sitePath, activePageUrl }) => {
    if (allSiteSettings[sitePath]) {
      return LayoutHelper.getLayout(allSiteSettings[sitePath], activePageUrl)
    }
  },
  headerModList: (state, { siteSetting, layout }) =>
    layout && layout.header ? siteSetting.pages[layout.header].modList : [],
  footerModList: (state, { siteSetting, layout }) =>
    layout && layout.footer ? siteSetting.pages[layout.footer].modList : [],
  sidebarModList: (state, { siteSetting, layout }) =>
    layout && layout.sidebar ? siteSetting.pages[layout.sidebar].modList : [],
  mainModList: state => (state.activePage ? state.activePage.modList : [])
}

export default getters
