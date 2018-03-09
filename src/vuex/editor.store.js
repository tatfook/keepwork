import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import modFactory from '@/lib/mod/factory'
import mdParser from '@/lib/mod/mdParser/mdParser'

Vue.use(Vuex)

const state = {
  activePage: '',
  code: '',
  modList: [],
  activeMod: null,
  activeProperty: null,
  // layout: {
  //   header: {},
  //   footer: {},
  //   siderbar: {}
  // },
  theme: {
    name: 'light',
    colorID: 0,
    fontID: 0
  }
}

const getters = {
  activePage: state => state.activePage,
  code: state => state.code,
  themeConf: state => state.theme,
  modList: state => state.modList,
  activeMod: state => state.activeMod,
  activeProperty: state => state.activeProperty,
  hasActiveMod: state => !!state.activeMod,
  hasActiveProperty: state => !!state.activeProperty
}

const actions = {
  setActivePage({ commit }, path) {
    commit('SET_ACTIVE_PAGE', path)
    // TODO load page data via api service
  },
  updateMarkDown({ commit }, code) {
    commit('UPDATE_CODE', code)
    commit('SET_ACTIVE_MOD', null)
    commit('SET_ACTIVE_PROPERTY', null)
    const data = mdParser.mdToJson(code)
    commit('UPDATE_MODS', data)
  },
  addMod({ commit }, params) {
    const mod = modFactory.generate(params.modName)
    commit('ADD_MOD', {
      mod: mod,
      key: params.preModKey
    })
    commit('SET_ACTIVE_MOD', mod)
    const md = mdParser.jsonToMd(state.modList)
    commit('UPDATE_CODE', md)
  },
  setActiveMod({ commit }, mod) {
    commit('SET_ACTIVE_MOD', mod)
    commit('SET_ACTIVE_PROPERTY', null)
  },
  setActiveProperty({ commit }, params) {
    commit('SET_ACTIVE_MOD', params.mod)
    commit('SET_ACTIVE_PROPERTY', params.property)
  },
  deleteMod({ commit }, mod) {
    commit('DELETE_MOD', mod)
    if (mod === state.activeMod) {
      commit('SET_ACTIVE_MOD', null)
      commit('SET_ACTIVE_PROPERTY', null)
    }
    const md = mdParser.jsonToMd(state.modList)
    commit('UPDATE_CODE', md)
  },
  updateActiveModStyle({ commit }, styleID) {
    commit('UPDATE_ACTIVE_MOD_STYLE', styleID)
  },
  changeTheme({ commit }, themeName) {
    commit('UPDATE_THEME_NAME', themeName)
    commit('UPDATE_THEME_COLOR', 0)
    commit('UPDATE_THEME_FONT', 0)
    commit('UPDATE_THEME_BG_COLOR', 0)
  },
  changeThemeColor({ commit }, colorID) {
    commit('UPDATE_THEME_COLOR', colorID)
  },
  changeThemeBgColor({ commit }, bgColorID) {
    commit('UPDATE_THEME_BG_COLOR', bgColorID)
  },
  changeThemeFont({ commit }, fontID) {
    commit('UPDATE_THEME_FONT', fontID)
  }
}

const mutations = {
  SET_ACTIVE_PAGE(state, path) {
    Vue.set(state, 'activePage', path)
  },
  UPDATE_CODE(state, code) {
    Vue.set(state, 'code', code)
  },
  ADD_MOD(state, { mod, key }) {
    let index = -1
    if (key) index = state.modList.map(el => el.key).indexOf(key)
    state.modList.splice(index + 1, 0, mod)
  },
  DELETE_MOD(state, mod) {
    let index = state.modList.map(el => el.key).indexOf(mod.key)
    Vue.delete(state.modList, index)
  },
  SET_ACTIVE_MOD(state, mod) {
    if (state.activeMod === mod) return
    if (state.activeMod) Vue.set(state.activeMod, 'isActive', false)
    if (mod) Vue.set(mod, 'isActive', true)
    Vue.set(state, 'activeMod', mod)
  },
  SET_ACTIVE_PROPERTY(state, property) {
    if (!state.activeMod) return
    Vue.set(state, 'activeProperty', property)
  },
  UPDATE_ACTIVE_MOD_ATTRIBUTES(state, { key, value }) {
    state.activeMod.key = value
  },
  UPDATE_ACTIVE_MOD_STYLE(state, styleID) {
    Vue.set(state.activeMod, 'styleID', styleID)
  },
  UPDATE_MODS(state, mods) {
    _.forEach(mods, (el, newIndex) => {
      let oldIndex = _.indexOf(
        _.map(state.modList, el => {
          return el.key
        }),
        el.key
      )

      if (oldIndex) {
        // oldIndex will always >= newIndex
        if (oldIndex > newIndex) {
          state.modList.splice(newIndex, oldIndex - newIndex - 1)
        }
      }
    })
    Vue.set(state, 'modList', mods)
  },
  UPDATE_THEME_NAME(state, themeName) {
    Vue.set(state.theme, 'name', themeName)
  },
  UPDATE_THEME_COLOR(state, colorID) {
    Vue.set(state.theme, 'colorID', colorID)
  },
  UPDATE_THEME_BG_COLOR(state, bgColorID) {
    Vue.set(state.theme, 'bgColorID', bgColorID)
  },
  UPDATE_THEME_FONT(state, fontID) {
    Vue.set(state.theme, 'fontID', fontID)
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
