import modFactory from '@/lib/mod/factory'
import Parser from '@/lib/mod/parser'
import { props } from './mutations'
import { getFileFullPathByPath } from '@/lib/utils/gitlab'

const {
  RESET_STATE,
  SET_ACTIVE_PAGE,

  ADD_MOD,
  DELETE_MOD,

  SET_ACTIVE_MOD,
  SET_ACTIVE_PROPERTY,
  REFRESH_MOD_ATTRIBUTES,
  SET_ACTIVE_PROPERTY_DATA,

  UPDATE_ACTIVE_MOD_ATTRIBUTES,
  UPDATE_MODS,
  UPDATE_THEME_NAME,
  UPDATE_THEME_COLOR,
  UPDATE_THEME_BG_COLOR,
  UPDATE_THEME_FONT,

  UPDATE_WIN_TYPE,
  RESET_SHOWING_COL,

  UPDATE_FILEMANAGER_TREE_NODE_EXPANDED,

  CACHE_OPENED_FILE,
  CLEAR_OPENED_FILE
} = props

const actions = {
  async setActivePage(context, path) {
    let { getters, rootGetters, commit, dispatch } = context

    if (getters.activePage === path) return
    commit(RESET_STATE)
    commit(SET_ACTIVE_PAGE, path)

    if (path !== '/') await dispatch('gitlab/readFile', { path, editorMode: true }, { root: true })

    let file = rootGetters['gitlab/getFileByPath'](path)
    if (!file) return
    let { content } = file
    let payload = { code: content, historyDisabled: true }
    content && dispatch('updateMarkDown', payload)
  },
  async saveActivePage({ getters, dispatch }) {
    let { activePage: path } = getters
    dispatch('savePageByPath', path)
  },
  async savePageByPath({ getters: { getOpenedFileByPath }, dispatch }, path) {
    if (!path) return
    let { content } = getOpenedFileByPath(path)
    await dispatch('gitlab/saveFile', { content, path }, { root: true })
    dispatch('clearUnsavedFile', { path })
  },

  updateCode(context, { code, historyDisabled }) {
    let { dispatch, getters: { activePage: path, undoManager } } = context
    // commit(UPDATE_CODE, { code })
    dispatch('cacheUnsavedFile', { content: code, path })
    !historyDisabled && undoManager.save(code)
  },
  refreshCode({ dispatch, getters: { modList } }) {
    const code = Parser.buildMarkdown(modList)
    dispatch('updateCode', {code})
  },

  // rebuild all mods, will takes a little bit more time
  updateMarkDown({ commit, dispatch }, payload) {
    if (payload.code === undefined) payload = { code: payload }
    commit(SET_ACTIVE_MOD, null)
    commit(SET_ACTIVE_PROPERTY, null)
    commit(UPDATE_MODS, payload.code)
    dispatch('updateCode', payload)
  },
  // only update a particular mod
  updateMarkDownBlock({ commit, dispatch }, payload) {
    dispatch('updateCode', payload)
    commit(SET_ACTIVE_MOD, payload.key)
    commit(SET_ACTIVE_PROPERTY, null)
    commit(REFRESH_MOD_ATTRIBUTES, payload)
  },

  addMod({ commit, dispatch }, payload) {
    const modProperties = modFactory.generate(payload.modName)
    var modPropertiesStyle
    if (payload.styleID) {
      modPropertiesStyle = modProperties
      modPropertiesStyle.styleID = payload.styleID
    }
    commit(ADD_MOD, {
      modProperties: modPropertiesStyle || modProperties,
      key: payload.preModKey,
      cmd: Parser.getCmd(payload.modName)
    })
    commit(SET_ACTIVE_MOD, null)
    commit(SET_ACTIVE_PROPERTY, null)
    dispatch('refreshCode')
  },
  setActiveMod({ commit }, key) {
    commit(SET_ACTIVE_MOD, key)
    commit(SET_ACTIVE_PROPERTY, null)
    commit(UPDATE_WIN_TYPE, 'ModPropertyManager')
  },
  setActiveProperty({ commit }, payload) {
    commit(SET_ACTIVE_MOD, payload.key)
    commit(SET_ACTIVE_PROPERTY, payload.property)
    commit(UPDATE_WIN_TYPE, 'ModPropertyManager')
  },
  setActivePropertyData({ commit, dispatch, getters: { activePropertyData } }, { data }) {
    commit(SET_ACTIVE_PROPERTY_DATA, { activePropertyData, data })
    dispatch('refreshCode')
  },
  deleteMod({ commit, dispatch, state }, key) {
    commit(DELETE_MOD, key)
    if (key === state.activeMod.key) {
      commit(SET_ACTIVE_MOD, null)
      commit(SET_ACTIVE_PROPERTY, null)
    }
    dispatch('refreshCode')
  },
  updateActiveModStyle({ commit, dispatch }, styleID) {
    commit(UPDATE_ACTIVE_MOD_ATTRIBUTES, {
      key: 'styleID',
      value: styleID
    })
    dispatch('refreshCode')
  },
  updateActiveModAttribute({ commit, dispatch }, payload) {
    commit(UPDATE_ACTIVE_MOD_ATTRIBUTES, payload)
    dispatch('refreshCode')
  },
  changeTheme({ commit }, themeName) {
    commit(UPDATE_THEME_NAME, themeName)
    commit(UPDATE_THEME_COLOR, 0)
    commit(UPDATE_THEME_FONT, 0)
    commit(UPDATE_THEME_BG_COLOR, 0)
  },
  changeThemeColor({ commit }, colorID) {
    commit(UPDATE_THEME_COLOR, colorID)
  },
  changeThemeBgColor({ commit }, bgColorID) {
    commit(UPDATE_THEME_BG_COLOR, bgColorID)
  },
  changeThemeFont({ commit }, fontID) {
    commit(UPDATE_THEME_FONT, fontID)
  },
  setActiveWinType({ commit }, componentType) {
    commit(UPDATE_WIN_TYPE, componentType)
  },
  resetShowingCol({ commit }, showingColObj) {
    commit(RESET_SHOWING_COL, showingColObj)
  },
  updateFilemanagerTreeNodeExpandMapByPath({ commit }, payload) {
    commit(UPDATE_FILEMANAGER_TREE_NODE_EXPANDED, payload)
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
  },
  setNewModPosition({ commit }, position) {
    commit('SET_NEW_MOD_POSITION', position)
  },

  cacheUnsavedFile(context, { path, content }) {
    let fullPath = getFileFullPathByPath(path)
    let { commit, rootGetters } = context
    let { 'user/username': username } = rootGetters

    let timestamp = Date.now()
    let payload = {username, path: fullPath, file: {content, timestamp}}
    commit(CACHE_OPENED_FILE, payload)
  },
  clearUnsavedFile(context, { path }) {
    let fullPath = getFileFullPathByPath(path)
    let { commit, rootGetters: { 'user/username': username } } = context
    commit(CLEAR_OPENED_FILE, {username, path: fullPath})
  }
}

export default actions
