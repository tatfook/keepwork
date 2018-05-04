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
  code: (state, { activeAreaData }) =>
    (activeAreaData && activeAreaData.content) || '',
  themeConf: (state, { siteSetting }) => {
    if (siteSetting) return siteSetting.theme
    return {}
  },
  activeArea: (state, { activePage }) => activePage && activePage.activeArea,
  activeAreaData: (state, { activePage, layout, activeArea, siteSetting }) => {
    let targetLayoutContentFileName = _.get(layout, ['content', activeArea])
    let targetLayoutContentFilePath = `${activeArea}s/${targetLayoutContentFileName}`
    if (targetLayoutContentFileName && targetLayoutContentFilePath) {
      return siteSetting.pages[targetLayoutContentFilePath]
    }
    return activePage
  },
  modList: (state, { activeAreaData }) =>
    activeAreaData && activeAreaData.modList,
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
  canUndo: (state, { activeAreaData }) =>
    activeAreaData && UndoHelper.canUndo(activeAreaData.undoManager),
  canRedo: (state, { activeAreaData }) =>
    activeAreaData && UndoHelper.canRedo(activeAreaData.undoManager),
  filemanagerTreeNodeExpandMapByPath: state =>
    state.filemanagerTreeNodeExpandMapByPath,

  allSiteSettings: state => state.siteSettings,
  sitePath: state => getFileSitePathByPath(state.activePageUrl),
  siteSetting: (state, { allSiteSettings, sitePath }) =>
    allSiteSettings[sitePath],
  layout: (state, { siteSetting, activePageUrl }) => {
    if (siteSetting) {
      return LayoutHelper.getLayoutByPath(
        siteSetting.siteLayoutConfig,
        activePageUrl
      )
    }
  },
  header: (state, { siteSetting, layout }) => {
    let headerFileName = _.get(layout, ['content', 'header'])
    if (!headerFileName) return
    let headerFilePath = `headers/${headerFileName}`
    return siteSetting.pages[headerFilePath]
  },
  footer: (state, { siteSetting, layout }) => {
    let footerFileName = _.get(layout, ['content', 'footer'])
    if (!footerFileName) return
    let footerFilePath = `footers/${footerFileName}`
    return siteSetting.pages[footerFilePath]
  },
  sidebar: (state, { siteSetting, layout }) => {
    let sidebarFileName = _.get(layout, ['content', 'sidebar'])
    if (!sidebarFileName) return
    let sidebarFilePath = `sidebars/${sidebarFileName}`
    return siteSetting.pages[sidebarFilePath]
  },
  layoutPages: (state, { header, footer, sidebar }) => {
    let pages = []
    if (header) pages.push(header)
    if (footer) pages.push(footer)
    if (sidebar) pages.push(sidebar)
    return pages
  },
  mainModList: state => (state.activePage ? state.activePage.modList : []),
  headerModList: (state, { header }) => header && header.modList,
  footerModList: (state, { footer }) => footer && footer.modList,
  sidebarModList: (state, { sidebar }) => sidebar && sidebar.modList
}

export default getters
