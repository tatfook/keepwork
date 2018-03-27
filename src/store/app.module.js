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
    if (context.getters.activePage === path) return

    context.commit('SET_ACTIVE_PAGE', path)

    if (path === '/') {
      return Promise.resolve()
    }

    await context.dispatch('gitlab/getFileContent', path, { root: true })

    let { content } = context.rootGetters['gitlab/files'][path]
    if (content) {
      context.dispatch('updateMarkDown', { code: content })
    }
  },
  async saveActivePage({ getters, dispatch }) {
    let { code: content, activePage: path } = getters
    await dispatch('gitlab/saveFileContent', { content, path }, { root: true })
  },
  // rebuild all mods, will takes a little bit more time
  updateMarkDown({ commit }, payload) {
    if (payload.code === undefined) payload = { code: payload }
    let blockList = Parser.buildBlockList(payload.code)
    commit('UPDATE_MODS', blockList)
  }
}

const mutations = {
  SET_ACTIVE_PAGE(state, path) {
    Vue.set(state, 'activePage', path)
  },
  UPDATE_MODS(state, mods) {
    Parser.updateBlockList(state.modList, mods)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
