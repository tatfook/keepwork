import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  modList: [],
  modKeys: [],
  activeMod: {},
  activeSidebar: '',
  layout: {
    header: {},
    footer: {},
    siderbar: {}
  },
  theme: {
    name: '',
    colorsID: 1,
    fontsID: 1
  }
}

const mutations = {
  ADD_MOD(state, modName, index) {
    // const newMod = GenerateMod(modName, key)
    // state.modList.insert(newMod, index)
  },
  DELETE_MOD(state) {
    state.modList.$remove(state.activeMod)
    state.activeMod = {}
  },
  SET_ACTIVE_MOD(state, mod) {
    state.activeMod = mod
  },
  UPDATE_ATTRIBUTES(state, key, value) {
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

export default new Vuex.Store({
  state,
  mutations
})
