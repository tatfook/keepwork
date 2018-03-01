import modFactory from '@/lib/mod/factory'
import Vue from 'vue'

const state = {
  activePage: '',
  modList: [],
  activeMod: null,
  activeProperty: null,
  // layout: {
  //   header: {},
  //   footer: {},
  //   siderbar: {}
  // },
  theme: {
    name: '',
    themeID: 1,
    colorsID: 1,
    fontsID: 1
  }
}

const getters = {
  theme: state => state.theme,
  modList: state => state.modList,
  activeMod: state => state.activeMod,
  activeProperty: state => state.activeProperty
}

const actions = {
  addMod({ commit }, params) {
    const mod = modFactory.generate(params.modName)
    commit('ADD_MOD', { mod: mod, key: params.preModKey })
    commit('SET_ACTIVE_MOD', mod)
  },
  setActiveMod({ commit }, mod) {
    commit('SET_ACTIVE_MOD', mod)
  },
  setActiveProperty({ commit }, params) {
    commit('SET_ACTIVE_MOD', params.mod)
    commit('SET_ACTIVE_PROPERTY', params.property)
  },
  deleteMod({ commit }, mod) {
    commit('DELETE_MOD', mod)
  }
}

const mutations = {
  ADD_MOD(state, { mod, key }) {
    let index = 0
    if (key) index = state.modList.map(el => el.key).indexOf(key)
    state.modList.splice(index, 0, mod)
  },
  DELETE_MOD(state, mod) {
    if (mod === state.activeMod) state.activeMod = null
    let index = state.modList.map(el => el.key).indexOf(mod.key)
    state.modList.splice(index, 1)
  },
  SET_ACTIVE_MOD(state, mod) {
    if (state.activeMod === mod) return
    if (state.activeMod) Vue.set(state.activeMod, 'isActive', false)
    state.activeMod = mod
    Vue.set(state.activeMod, 'isActive', true)
  },
  SET_ACTIVE_PROPERTY(state, property) {
    if (!state.activeMod) return
    state.activeProperty = property
  },
  UPDATE_ATTRIBUTES(state, { key, value }) {
    state.activeMod.key = value
  },
  UPDATE_LAYOUT(state, layout) {
    state.layout = layout
  },
  UPDATE_THEME(state, theme) {
    state.theme = theme
  },
  UPDATE_MODS(state, mods) {
    state.modList = mods
    state.activeMod = {}
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
