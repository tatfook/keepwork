import Vue from 'vue'
import Parser from '@/lib/mod/parser'

const state = () => ({
  activePage: '',
  modList: [],
  // layout: {
  //   header: {},
  //   footer: {},
  //   siderbar: {}
  // },
  theme: {
    name: 'classic',
    colorID: 0,
    fontID: 0
  }
})

const getters = {
  themeConf: state => state.theme,
  modList: state => state.modList
}

const actions = {
  async setActivePage(context, path) {
    let { getters, rootGetters, commit, dispatch } = context

    if (getters.activePage === path) return
    if (path === '/') return
    commit('SET_ACTIVE_PAGE', path)

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
    Vue.set(state, 'activePage', path)
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
