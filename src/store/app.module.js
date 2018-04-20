import Vue from 'vue'
import Parser from '@/lib/mod/parser'
import { getFileFullPathByPath } from '@/lib/utils/gitlab'

const state = () => ({
  activePageUrl: '',
  modList: [],
  theme: {
    name: 'classic',
    colorID: 0,
    fontID: 0
  }
})

const getters = {
  activePageUrl: state => state.activePageUrl,
  activePageInfo: (state, { activePageUrl }) => {
    let pageInfos = activePageUrl.split('/').filter(x => x)
    let [username, sitename] = pageInfos
    let isLegal = (username && sitename)
    let sitepath = isLegal ? `${username}/${sitename}` : ''
    let fullPath = isLegal ? getFileFullPathByPath(activePageUrl) : ''
    let [, , ...paths] = fullPath.split('/').filter(x => x)
    return { username, sitename, isLegal, fullPath, sitepath, paths }
  },
  themeConf: state => state.theme,
  modList: state => state.modList
}

const actions = {
  async setActivePage(context, { path }) {
    let { rootGetters, commit, dispatch } = context
    commit('SET_ACTIVE_PAGE', path)

    if (path === '/') return
    await dispatch('gitlab/readFile', { path }, { root: true })
    let { content } = rootGetters['gitlab/getFileByPath'](path)
    let payload = { code: content, historyDisabled: true }
    content && dispatch('updateMarkDown', payload)
  },
  // rebuild all mods, will takes a little bit more time
  updateMarkDown({ commit }, payload) {
    if (payload.code === undefined) payload = { code: payload }
    commit('UPDATE_MODS', payload.code)
  }
}

const mutations = {
  SET_ACTIVE_PAGE(state, path) {
    Vue.set(state, 'activePageUrl', path)
  },
  UPDATE_MODS(state, code) {
    let blockList = Parser.buildBlockList(code)
    Parser.updateBlockList(state.modList, blockList)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
