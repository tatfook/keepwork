import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import modFactory from '@/lib/mod/factory'
import Parser from '@/lib/mod/parser'

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
    let blockList = Parser.buildBlockList(code)

    // commit('UPDATE_CODE', code)
    // commit('SET_ACTIVE_MOD', null)
    // commit('SET_ACTIVE_PROPERTY', null)
    commit('UPDATE_MODS', blockList)
  },
  addMod({ commit }, params) {
    const modProperties = modFactory.generate(params.modName)
    const mod = commit('ADD_MOD', {
      modProperties: modProperties,
      key: params.preModKey,
      cmd: Parser.getCmd(params.modName)
    })
    commit('SET_ACTIVE_MOD', mod)
    commit('UPDATE_CODE', Parser.buildMarkdown(state.modList))
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
  ADD_MOD(state, { modProperties, key, cmd }) {
    return Parser.addBlockByKey(state.modList, key, modProperties, cmd)
  },
  DELETE_MOD(state, mod) {
    let index = state.modList.map(el => el.key).indexOf(mod.key)
    Vue.delete(state.modList, index)
  },
  SET_ACTIVE_MOD(state, mod) {
    if (state.activeMod === mod) return
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
      if (oldIndex >= 0) {
        // oldIndex will always >= newIndex
        state.modList.splice(newIndex, oldIndex - newIndex)
        // console.log(state.modList[newIndex])
        // console.log(el)
        // Vue.set(state.modList, newIndex, _.deepClone(el))
        // _.merge(state.modList[newIndex], el)
      }
      state.modList.splice(newIndex, 0, el) // remove and insert new one
    })
    state.modList.splice(mods.length, state.modList.length - mods.length)
    // Vue.set(state, 'modList', mods)
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
