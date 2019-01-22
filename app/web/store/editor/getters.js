import _ from 'lodash'
import {
  getFileFullPathByPath,
  getFileSitePathByPath,
  getPageInfoByPath
} from '@/lib/utils/gitlab'
import UndoHelper from '@/lib/utils/undo/undoHelper'
import LayoutHelper from '@/lib/mod/layout'

const getters = {
  openedPages: (state) =>
    state.openedPages || {},
  openedFiles: (state, { 'user/username': username }) =>
    state.openedFiles[username] || {},
  showOpenedFiles: (state, { openedFiles, 'user/personalAndContributedSiteNameList': allSiteNameList }) => {
    let _openedKeys = _.filter(_.keys(openedFiles), key => allSiteNameList.includes(key.split('/')[1]))
    let _openedFiles = _.pick(openedFiles, _openedKeys)
    return _openedFiles
  },
  getOpenedFileByPath: (state, { openedFiles }) => path =>
    openedFiles[getFileFullPathByPath(path)] || { saved: true },
  hasOpenedFiles: (state, { openedFiles }) => _.values(openedFiles).length > 0,
  activePage: state => state.activePage,
  activePageUrl: state => state.activePageUrl,
  activePageInfo: (state, { activePageUrl, openedPages }) => {
    let pageInfo = getPageInfoByPath(activePageUrl)
    let { fullPath } = pageInfo
    let { saved } = openedPages[fullPath] || {}
    return { ...pageInfo, saved }
  },
  activePageUsername: (state, { activePageInfo: { username } }) => username,
  code: (state, { activeAreaFile }) => {
    return (activeAreaFile && activeAreaFile.content) || ''
  },
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
  activeAreaFile: (state, { activeAreaData }) => {
    return activeAreaData && (activeAreaData.file || activeAreaData)
  },
  modList: (state, { activeAreaData }) =>
    activeAreaData && activeAreaData.modList,
  activeMod: state => state.activePage && state.activePage.activeMod,
  activeSubMod: state => state.activePage && state.activePage.activeSubMod,
  activeProperty: state => {
    if (state.activePage) {
      if (state.activePage.activeSubMod) {
        return state.activePage.activeSubMod.activeProperty
      }
      return state.activePage.activeProperty
    }
  },
  isMultipleTextDialogShow: state => {
    return state.isMultipleTextDialogShow
  },
  activePropertyOptions: state => {
    if (state.activePropertyOptions) return state.activePropertyOptions
  },
  activePropertyData: (state, { activeProperty, activeSubMod }) => {
    if (activeSubMod) {
      return _.get(state, ['activePage', 'activeSubMod', 'data', activeProperty], {})
    }
    return _.get(state, ['activePage', 'activeMod', 'data', activeProperty], {})
  },
  preModKey: state => state.activePage && state.activePage.preModKey,

  hasActiveProperty: state =>
    state.activePage && state.activePage.activeProperty,

  activeManagePaneComponent: state => state.activeManagePaneComponent,
  activeManagePaneComponentName: (state, { activeManagePaneComponent = {} }) => activeManagePaneComponent.name,
  activeManagePaneComponentProps: (state, { activeManagePaneComponent = {} }) => activeManagePaneComponent.props,

  activePropertyTabType: state => {
    if (state.activePage) return state.activePage.activePropertyTabType
  },
  showingCol: state => state.showingCol,
  isCodeShow: (state, { showingCol }) => {
    const isCodeShow = _.get(showingCol, 'isCodeShow')

    if (typeof isCodeShow !== 'boolean') {
      return true
    } else {
      return isCodeShow
    }
  },
  isPreviewShow: (state, { showingCol }) => {
    const isPreviewShow = _.get(showingCol, 'isPreviewShow')

    if (typeof isPreviewShow !== 'boolean') {
      return true
    } else {
      return isPreviewShow
    }
  },
  isManagerShow: (state, { showingCol }) => {
    const isManagerShow = _.get(showingCol, 'isManagerShow')

    if (typeof isManagerShow !== 'boolean') {
      return true
    } else {
      return isManagerShow
    }
  },
  isZenMode: (state, { showingCol }) => {
    const isZenMode = _.get(showingCol, 'isZenMode')

    if (typeof isZenMode !== 'boolean') {
      return false
    } else {
      return isZenMode
    }
  },
  canUndo: (state, { activeAreaData }) =>
    activeAreaData && UndoHelper.canUndo(activeAreaData.undoManager),
  canRedo: (state, { activeAreaData }) =>
    activeAreaData && UndoHelper.canRedo(activeAreaData.undoManager),
  filemanagerTreeNodeExpandMapByPath: state =>
    state.filemanagerTreeNodeExpandMapByPath,
  cursorPos: state => state.activePage && (state.activePage.cursorPos),
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
  sidebarModList: (state, { sidebar }) => sidebar && sidebar.modList,
  showSkyDrive: state => state.isSkyDriveManagerDialogShow,
  updateRecentUrlList: (state, getters, rootState, { 'user/username': username }) => state.updateRecentUrlList[username] || [],
  recentOpenedList: (state, { updateRecentUrlList, 'user/personalAndContributedSiteNameList': allSiteNameList }) => _.filter(updateRecentUrlList, ({ path }) => allSiteNameList.includes(path.split('/')[2])),
  showAngle: state => state.isAnglesToggle,
  iframeDialog: state => state.iframeDialog
}

export default getters
