import Vue from 'vue'
import _ from 'lodash'
import modFactory from '@/lib/mod/factory'
import Parser from '@/lib/mod/parser'
import SimpleUndo from '@/lib/utils/simpleUndo'

const UndoManager = new SimpleUndo()

const initialState = () => {
  return {
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
      name: 'classic',
      colorID: 0,
      fontID: 0
    },
    activeComponentType: '',
    showingCol: {
      isManagerShow: true,
      isCodeShow: true,
      isPreviewShow: true
    },
    filemanagerTreeNodeExpandMapByPath: {},
    undoManager: UndoManager
  }
}

const resetIgnoreKeys = ['filemanagerTreeNodeExpandMapByPath']

const getters = {
  activePage: state => state.activePage,
  activePageInfo: (state, { activePage }) => {
    let [username, sitename] = activePage.split('/').filter(x => x)
    return { username, sitename }
  },
  activePageUsername: (state, { activePageInfo: { username } }) => username,

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
  showingCol: state => state.showingCol,
  filemanagerTreeNodeExpandMapByPath: state =>
    state.filemanagerTreeNodeExpandMapByPath,
  undoManager: state => state.undoManager,
  canUndo: (state, { undoManager }) => undoManager.canUndo(),
  canRedo: (state, { undoManager }) => undoManager.canRedo()
}

const actions = {
  async setActivePage(context, path) {
    let { getters, rootGetters, commit, dispatch } = context

    if (getters.activePage === path) return
    commit('RESET_STATE')
    commit('SET_ACTIVE_PAGE', path)

    if (path !== '/') {
      await dispatch('gitlab/readFile', { path }, { root: true })
    }

    let { content = '' } = rootGetters['gitlab/getFileByPath'](path)
    let payload = { code: content, historyDisabled: true }
    content && dispatch('updateMarkDown', payload)
  },
  async saveActivePage({ getters, dispatch }) {
    let { code: content, activePage: path } = getters
    await dispatch('gitlab/saveFile', { content, path }, { root: true })
  },
  // rebuild all mods, will takes a little bit more time
  updateMarkDown({ commit, dispatch }, payload) {
    if (payload.code === undefined) payload = { code: payload }
    commit('SET_ACTIVE_MOD', null)
    commit('SET_ACTIVE_PROPERTY', null)
    commit('UPDATE_MODS', payload.code)
    commit('UPDATE_CODE', payload)
  },
  // only update a particular mod
  updateMarkDownBlock({ commit, dispatch }, payload) {
    dispatch('updateCode', { code: payload.code })
    commit('SET_ACTIVE_MOD', payload.key)
    commit('SET_ACTIVE_PROPERTY', null)
    commit('REFRESH_MOD_ATTRIBUTES', payload.key)
  },
  updateCode(context, { code }) {
    let { commit, dispatch, getters: { activePage: path } } = context
    commit('UPDATE_CODE', { code })
    dispatch('gitlab/cacheUnsavedFile', { content: code, path })
  },
  addMod({ commit }, payload) {
    const modProperties = modFactory.generate(payload.modName)
    var modPropertiesStyle
    if (payload.styleID) {
      modPropertiesStyle = modProperties
      modPropertiesStyle.styleID = payload.styleID
    }
    commit('ADD_MOD', {
      modProperties: modPropertiesStyle || modProperties,
      key: payload.preModKey,
      cmd: Parser.getCmd(payload.modName)
    })
    commit('SET_ACTIVE_MOD', null)
    commit('SET_ACTIVE_PROPERTY', null)
    commit('REFRESH_CODE')
  },
  setActiveMod({ commit }, key) {
    commit('SET_ACTIVE_MOD', key)
    commit('SET_ACTIVE_PROPERTY', null)
    commit('UPDATE_WIN_TYPE', 'ModPropertyManager')
  },
  setActiveProperty({ commit }, payload) {
    commit('SET_ACTIVE_MOD', payload.key)
    commit('SET_ACTIVE_PROPERTY', payload.property)
    commit('UPDATE_WIN_TYPE', 'ModPropertyManager')
  },
  setActivePropertyData({ commit, getters: { activePropertyData } }, { data }) {
    commit('SET_ACTIVE_PROPERTY_DATA', activePropertyData, data)
    commit('REFRESH_CODE')
  },
  deleteMod({ commit, state }, key) {
    commit('DELETE_MOD', key)
    if (key === state.activeMod.key) {
      commit('SET_ACTIVE_MOD', null)
      commit('SET_ACTIVE_PROPERTY', null)
    }
    commit('REFRESH_CODE')
  },
  updateActiveModStyle({ commit }, styleID) {
    commit('UPDATE_ACTIVE_MOD_ATTRIBUTES', {
      key: 'styleID',
      value: styleID
    })
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
  },
  updateFilemanagerTreeNodeExpandMapByPath({ commit }, payload) {
    commit('UPDATE_FILEMANAGER_TREE_NODE_EXPANDED', payload)
  },
  undo({ dispatch, getters: { undoManager } }) {
    undoManager.undo((code = '') =>
      dispatch('updateMarkDown', { code, historyDisabled: true })
    )
  },
  redo({ dispatch, getters: { undoManager } }) {
    undoManager.redo((code = '') =>
      dispatch('updateMarkDown', { code, historyDisabled: true })
    )
  }
}

const mutations = {
  RESET_STATE(state) {
    UndoManager.clear()
    const newState = initialState()
    for (let key in newState) {
      let resettable = !resetIgnoreKeys.includes(key)
      resettable && Vue.set(state, key, newState[key])
    }
  },
  SET_ACTIVE_PAGE(state, path) {
    Vue.set(state, 'activePage', path)
  },
  UPDATE_CODE(state, { code, historyDisabled }) {
    Vue.set(state, 'code', code)
    if (!historyDisabled) UndoManager.save(code)
  },
  REFRESH_CODE(state) {
    const code = Parser.buildMarkdown(state.modList)
    Vue.set(state, 'code', code)
    UndoManager.save(code)
  },
  ADD_MOD(state, { modProperties, key, cmd }) {
    return Parser.addBlockByKey(state.modList, key, modProperties, cmd)
  },
  DELETE_MOD(state, key) {
    return Parser.deleteBlock(state.modList, key)
  },
  SET_ACTIVE_MOD(state, key) {
    if (state.activeMod && state.activeMod.key === key) return
    const index = state.modList.map(el => el.key).indexOf(key)
    if (index !== -1) Vue.set(state, 'activeMod', state.modList[index])
  },
  SET_ACTIVE_PROPERTY(state, property) {
    if (!state.activeMod) return
    Vue.set(state, 'activeProperty', property)
  },
  REFRESH_MOD_ATTRIBUTES(state, key) {
    Parser.updateBlock(state.modList, key, state.code)
  },
  SET_ACTIVE_PROPERTY_DATA(state, activePropertyData, data) {
    let newData = _.merge({}, activePropertyData, data)
    Parser.updateBlockAttribute(
      state.modList,
      state.activeMod.key,
      state.activeProperty,
      newData
    )
  },
  UPDATE_ACTIVE_MOD_ATTRIBUTES(state, { key, value }) {
    Parser.updateBlockAttribute(state.modList, state.activeMod.key, key, value)
  },
  UPDATE_MODS(state, code) {
    let blockList = Parser.buildBlockList(code)
    Parser.updateBlockList(state.modList, blockList)
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
    Vue.set(
      state.showingCol,
      'isManagerShow',
      showingColObj.isManagerShow === undefined
        ? true
        : showingColObj.isManagerShow
    )
    Vue.set(
      state.showingCol,
      'isPreviewShow',
      showingColObj.isPreviewShow === undefined
        ? true
        : showingColObj.isPreviewShow
    )
    Vue.set(
      state.showingCol,
      'isCodeShow',
      showingColObj.isCodeShow === undefined ? true : showingColObj.isCodeShow
    )
  },
  UPDATE_FILEMANAGER_TREE_NODE_EXPANDED(state, { path, expanded }) {
    Vue.set(state, 'filemanagerTreeNodeExpandMapByPath', {
      ...state.filemanagerTreeNodeExpandMapByPath,
      [path]: expanded
    })
  }
}

export default {
  state: initialState,
  getters,
  actions,
  mutations
}
