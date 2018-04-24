import Vue from 'vue'
import Parser from '@/lib/mod/parser'
import LayoutHelper from '@/lib/mod/layout'
import {
  getFileFullPathByPath,
  getFileSitePathByPath
} from '@/lib/utils/gitlab'

const state = () => ({
  activePageUrl: '',
  modList: [],
  siteSetting: {
    layoutConfig: [],
    pages: {},
    theme: {
      name: 'classic',
      colorID: 0,
      fontID: 0
    }
  }
})

const getters = {
  activePageUrl: state => state.activePageUrl,
  activePageInfo: (state, { activePageUrl }) => {
    let pageInfos = activePageUrl.split('/').filter(x => x)
    let [username, sitename] = pageInfos
    let isLegal = username && sitename
    let sitepath = isLegal ? `${username}/${sitename}` : ''
    let fullPath = isLegal ? getFileFullPathByPath(activePageUrl) : ''
    let [, , ...paths] = fullPath.split('/').filter(x => x)
    return { username, sitename, isLegal, fullPath, sitepath, paths }
  },
  themeConf: state => state.siteSetting.theme,
  modList: state => state.modList,
  siteSetting: state => state.siteSetting,
  layout: (state, { siteSetting, activePageUrl }) =>
    LayoutHelper.getLayout(siteSetting.layoutConfig.layouts, activePageUrl),
  header: (state, { siteSetting, layout }) =>
    layout && layout.header && siteSetting.pages[layout.header],
  footer: (state, { siteSetting, layout }) =>
    layout && layout.footer && siteSetting.pages[layout.footer],
  sidebar: (state, { siteSetting, layout }) =>
    layout && layout.sidebar && siteSetting.pages[layout.sidebar],
  headerModList: (state, { header }) => header && header.modList,
  footerModList: (state, { footer }) => footer && footer.modList,
  sidebarModList: (state, { sidebar }) => sidebar && sidebar.modList
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
    const sitePath = getFileSitePathByPath(path)
    const layoutFilePath = LayoutHelper.layoutFilePath(sitePath)
    await dispatch(
      'gitlab/readFile',
      { path: layoutFilePath, editorMode: true },
      { root: true }
    )
    let { 'gitlab/getFileByPath': gitlabGetFileByPath } = rootGetters
    let file = gitlabGetFileByPath(layoutFilePath) || ''
    if (!file) return
    let { content } = file
    let layoutConfig = LayoutHelper.buildLayouts(content)
    commit('UPDATE_LAYOUT_CONFIG', { layoutConfig })

    let layout = LayoutHelper.getLayout(layoutConfig.layouts, path)
    await dispatch('loadLayoutPage', { sitePath, fileName: layout.header })
    await dispatch('loadLayoutPage', { sitePath, fileName: layout.footer })
    await dispatch('loadLayoutPage', { sitePath, fileName: layout.sidebar })
  },

  async loadLayoutPage(
    { commit, dispatch, rootGetters },
    { sitePath, fileName }
  ) {
    if (!fileName) return
    let pageFilePath = LayoutHelper.layoutPagePath(sitePath, fileName)
    await dispatch(
      'gitlab/readFile',
      { path: pageFilePath, editorMode: true },
      { root: true }
    )
    let { 'gitlab/getFileByPath': gitlabGetFileByPath } = rootGetters
    const file = gitlabGetFileByPath(pageFilePath) || ''
    const { content } = file
    commit('UPDATE_LAYOUT_PAGE', { content, fileName })
  }
}

const mutations = {
  SET_ACTIVE_PAGE(state, path) {
    Vue.set(state, 'activePageUrl', path)
  },
  UPDATE_MODS(state, code) {
    let blockList = Parser.buildBlockList(code)
    Parser.updateBlockList(state.modList, blockList)
  },
  UPDATE_LAYOUT_CONFIG(state, { layoutConfig }) {
    console.log(layoutConfig)
    Vue.set(state.siteSetting, 'layoutConfig', layoutConfig)
  },
  UPDATE_LAYOUT_PAGE(state, { content, fileName }) {
    let blockList = Parser.buildBlockList(content)
    Vue.set(state.siteSetting.pages, fileName, {
      modList: blockList,
      name: fileName
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
