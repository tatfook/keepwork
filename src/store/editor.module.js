import Vue from 'vue'
import _ from 'lodash'
import modFactory from '@/lib/mod/factory'
import Parser from '@/lib/mod/parser'

const state = () => ({
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
  },
  activeComponentType: '',
  showingCol: {
    isManagerShow: true,
    isCodeShow: true,
    isPreviewShow: true
})

const getters = {
  activePage: state => state.activePage,
  code: state => state.code,
  themeConf: state => state.theme,
  modList: state => state.modList,
  activeMod: state => state.activeMod,
  activeProperty: state => state.activeProperty,
  activePropertyData: state => {
    return _.get(state, ['activeMod', 'data', state.activeProperty], {})
  },
  hasActiveMod: state => !!state.activeMod,
  hasActiveProperty: state => !!state.activeProperty,
  activeComponentType: state => state.activeWinType,
  showingCol: state => state.showingCol
}

const actions = {
  setActivePage({ commit }, path) {
    commit('SET_ACTIVE_PAGE', path)
    // TODO load page data via api service
  },
  // rebuild all mods, will takes a little bit more time
  updateMarkDown({ commit }, code) {
    let blockList = Parser.buildBlockList(code)
    commit('SET_ACTIVE_MOD', null)
    commit('SET_ACTIVE_PROPERTY', null)
    commit('UPDATE_MODS', blockList)
    commit('UPDATE_CODE', code)
  },
  // only update a particular mod
  updateMarkDownBlock({ commit }, payload) {
    commit('UPDATE_CODE', payload.code)
    commit('SET_ACTIVE_MOD', payload.mod)
    commit('SET_ACTIVE_PROPERTY', null)
    commit('REFRESH_MOD_ATTRIBUTES', payload.mod)
  },
  addMod({ commit }, payload) {
    const modProperties = modFactory.generate(payload.modName)
    commit('ADD_MOD', {
      modProperties: modProperties,
      key: payload.preModKey,
      cmd: Parser.getCmd(payload.modName)
    })
    commit('SET_ACTIVE_MOD', null)
    commit('SET_ACTIVE_PROPERTY', null)
    commit('REFRESH_CODE')
  },
  setActiveMod({ commit }, mod) {
    commit('SET_ACTIVE_MOD', mod)
    commit('SET_ACTIVE_PROPERTY', null)
  },
  setActiveProperty({ commit }, payload) {
    commit('SET_ACTIVE_MOD', payload.mod)
    commit('SET_ACTIVE_PROPERTY', payload.property)
    commit('UPDATE_WIN_TYPE', 'ModPropertyManager')
  },
  setActivePropertyData({ commit }, params) {
    commit('SET_ACTIVE_PROPERTY_DATA', params.data)
    commit('REFRESH_CODE')
  },
  deleteMod({ commit }, mod) {
    commit('DELETE_MOD', mod)
    if (mod.key === state.activeMod.key) {
      commit('SET_ACTIVE_MOD', null)
      commit('SET_ACTIVE_PROPERTY', null)
    }
    commit('REFRESH_CODE')
  },
  updateActiveModStyle({ commit }, styleID) {
    commit('UPDATE_ACTIVE_MOD_STYLE', styleID)
    commit('REFRESH_CODE')
  },
  updateActiveModAttribute({ commit }, payload) {
    commit('UPDATE_ACTIVE_MOD_ATTRIBUTES', payload)
    commit('REFRESH_CODE')
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
  },
  setActiveWinType({ commit }, componentType) {
    commit('UPDATE_WIN_TYPE', componentType)
  },
  resetShowingCol({ commit }, showingColObj) {
    commit('RESET_SHOWING_COL', showingColObj)
  }
}

const mutations = {
  SET_ACTIVE_PAGE(state, path) {
    Vue.set(state, 'activePage', path)
  },
  UPDATE_CODE(state, code) {
    Vue.set(state, 'code', code)
  },
  REFRESH_CODE(state) {
    Vue.set(state, 'code', Parser.buildMarkdown(state.modList))
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
  REFRESH_MOD_ATTRIBUTES(state, mod) {
    Parser.updateBlock(state.modList, mod, state.code)
  },
  SET_ACTIVE_PROPERTY_DATA(state, data) {
    if (!state.activeMod) return
    if (!state.activeProperty) return
    if (!state.activeMod.data) return
    if (!state.activeMod.data[state.activeProperty]) return
    let originalData = state.activeMod.data[state.activeProperty]

    // only assign the value if the key is in original keys
    // drop other information in data
    let resultData = _.keys(originalData).reduce((prev, key) => {
      prev[key] = _.has(data, key) ? data[key] : originalData[key]
      return prev
    }, {})

    Parser.updateBlockAttribute(
      state.activeMod,
      state.activeProperty,
      resultData
    )
  },
  UPDATE_ACTIVE_MOD_ATTRIBUTES(state, { key, value }) {
    Parser.updateBlockAttribute(state.activeMod, key, value)
  },
  UPDATE_ACTIVE_MOD_STYLE(state, styleID) {
    Parser.updateBlockAttribute(state.activeMod, 'styleID', styleID)
  },
  UPDATE_MODS(state, mods) {
    Parser.updateBlockList(state.modList, mods)
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
  },
  UPDATE_WIN_TYPE(state, componentType) {
    Vue.set(state, 'activeWinType', componentType)
  },
  RESET_SHOWING_COL(state, showingColObj) {
    Vue.set(state.showingCol, 'isManagerShow', (showingColObj.isManagerShow === undefined ? true : showingColObj.isManagerShow))
    Vue.set(state.showingCol, 'isPreviewShow', (showingColObj.isPreviewShow === undefined ? true : showingColObj.isPreviewShow))
    Vue.set(state.showingCol, 'isCodeShow', (showingColObj.isCodeShow === undefined ? true : showingColObj.isCodeShow))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
