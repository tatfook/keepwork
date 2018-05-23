import _ from 'lodash'
import Vue from 'vue'
import Parser from '@/lib/mod/parser'
import LayoutHelper from '@/lib/mod/layout'
import {
  getFileSitePathByPath,
  getPageInfoByPath,
  CONFIG_FOLDER_NAME
} from '@/lib/utils/gitlab'

const state = () => ({
  activePageUrl: '',
  modList: [],
  siteSettings: {}
})

const initSiteState = () => {
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

const initLayoutPageState = () => {
  return {
    modList: []
  }
}

const getters = {
  activePageUrl: state => state.activePageUrl,
  activePageInfo: (state, { activePageUrl }) => getPageInfoByPath(activePageUrl),
  modList: state => state.modList,
  themeConf: (state, {siteSetting}) => _.get(siteSetting, 'theme', {}),

  allSiteSettings: state => state.siteSettings,
  sitePath: (state, { activePageInfo }) => activePageInfo.sitepath,
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
  code: (state) => state && state.code
}

const actions = {
  async setActivePage(context, { path }) {
    let { rootGetters, commit, dispatch } = context
    commit('SET_ACTIVE_PAGE', path)

    if (path === '/') return
    await dispatch('loadLayout', { path })
    await dispatch('gitlab/readFile', { path }, { root: true })
    let { content } = rootGetters['gitlab/getFileByPath'](path)
    let payload = { code: content, historyDisabled: true }
    content && dispatch('updateMarkDown', payload)
  },
  // rebuild all mods, will takes a little bit more time
  updateMarkDown({ commit }, payload) {
    if (payload.code === undefined) payload = { code: payload }
    commit('UPDATE_MODS', payload.code)
  },

  async loadLayout({ commit, dispatch, rootGetters }, { path }) {
    let siteSetting = initSiteState()
    const sitePath = getFileSitePathByPath(path)
    await dispatch('user/getSiteLayoutConfig', { path: sitePath, editorMode: false })
    let {
      'user/siteLayoutConfigBySitePath': siteLayoutConfigBySitePath,
      'user/layoutContentFilePathsByPath': layoutContentFilePathsByPath,
      'gitlab/getFileByPath': gitlabGetFileByPath
    } = rootGetters
    siteSetting.siteLayoutConfig = siteLayoutConfigBySitePath(sitePath)
    let layoutContentFilePaths = layoutContentFilePathsByPath(path)

    await Promise.all(layoutContentFilePaths.map(async layoutContentFilePath => {
      let fileName = layoutContentFilePath.split('/').slice(1).join('/')
      let filePath = `${sitePath}/${CONFIG_FOLDER_NAME}/pages/${layoutContentFilePath}`
      await dispatch(
        'gitlab/readFile',
        { path: filePath, editorMode: false },
        { root: true }
      )
      let { content } = gitlabGetFileByPath(filePath)
      siteSetting.pages[layoutContentFilePath] = initLayoutPageState()
      _.merge(siteSetting.pages[layoutContentFilePath], {
        content,
        modList: Parser.buildBlockList(content),
        path: filePath,
        fileName: fileName
      })
    }))

    commit('REFRESH_SITE_SETTINGS', { sitePath, siteSetting })
  }
}

const mutations = {
  SET_ACTIVE_PAGE(state, path) {
    Vue.set(state, 'activePageUrl', path)
  },
  UPDATE_MODS(state, code) {
    Vue.set(state, 'code', code)
    let blockList = Parser.buildBlockList(code)
    Parser.updateBlockList(state.modList, blockList)
  },
  REFRESH_SITE_SETTINGS(state, { sitePath, siteSetting }) {
    Vue.set(state.siteSettings, sitePath, siteSetting)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
