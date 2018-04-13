import modFactory from '@/lib/mod/factory'
import Parser from '@/lib/mod/parser'
import { gUndoManager } from '@/lib/global'
import { props } from './mutations'
import { getFileFullPathByPath } from '@/lib/utils/gitlab'

const {
  RESET_STATE,
  SET_ACTIVE_PAGE,

  ADD_MOD,
  DELETE_MOD,
  MOVE_MOD,

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
  UPDATE_PROPERTY_TAB_TYPE,
  RESET_SHOWING_COL,

  UPDATE_FILEMANAGER_TREE_NODE_EXPANDED,

  UPDATE_OPENED_FILE,
  CLOSE_OPENED_FILE
} = props

const actions = {
  async setActivePage(context, path) {
    let { getters, commit, dispatch } = context

    if (getters.activePage === path) return
    commit(RESET_STATE)
    commit(SET_ACTIVE_PAGE, path)

    if (path === '/') return

    let { activePageCacheAvailable } = getters
    if (activePageCacheAvailable) return

    await dispatch('refreshOpenedFile', { path })
    let { code } = getters
    let payload = { code, historyDisabled: true }
    dispatch('updateMarkDown', payload)
  },
  async saveActivePage({ getters, dispatch }) {
    let { activePage: path } = getters
    dispatch('savePageByPath', path)
  },
  async savePageByPath({ getters: { getOpenedFileByPath }, dispatch }, path) {
    if (!path) return
    let { content } = getOpenedFileByPath(path)
    await dispatch('gitlab/saveFile', { content, path }, { root: true })
    dispatch('updateOpenedFile', { saved: true, path })
  },
  updateCode({ dispatch, getters }, { code: newCode, historyDisabled }) {
    let { code: oldCode, activePage: path } = getters
    if (newCode === oldCode) return
    dispatch('updateOpenedFile', { content: newCode, path })
    !historyDisabled && gUndoManager.save(newCode)
  },
  refreshCode({ dispatch, getters: { modList } }) {
    const code = Parser.buildMarkdown(modList)
    dispatch('updateCode', { code })
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
    commit(UPDATE_WIN_TYPE, 'ModPropertyManager')
    commit(SET_ACTIVE_PROPERTY, null)
    commit(REFRESH_MOD_ATTRIBUTES, payload)
  },
  moveMod({ commit, dispatch }, payload) {
    commit(SET_ACTIVE_MOD, null)
    commit(SET_ACTIVE_PROPERTY, null)
    commit(MOVE_MOD, payload)
    commit(UPDATE_WIN_TYPE, 'ModPropertyManager')
    dispatch('refreshCode')
  },
  addMod({ commit, dispatch }, payload) {
    const modProperties = modFactory.generate(payload.modName)
    var modPropertiesStyle
    if (payload.styleID) {
      modPropertiesStyle = modProperties
      modPropertiesStyle.styleID = payload.styleID
    }
    commit(SET_ACTIVE_MOD, null)
    commit(SET_ACTIVE_PROPERTY, null)
    commit(ADD_MOD, {
      modProperties: modPropertiesStyle || modProperties,
      key: payload.preModKey,
      cmd: Parser.getCmd(payload.modName)
    })
    commit(UPDATE_WIN_TYPE, 'ModPropertyManager')
    dispatch('refreshCode')
  },
  setActiveMod({ commit }, key) {
    commit(SET_ACTIVE_MOD, key)
    commit(SET_ACTIVE_PROPERTY, null)
    commit(UPDATE_WIN_TYPE, 'ModPropertyManager')
  },
  setActiveProperty({ commit, dispatch }, payload) {
    commit(SET_ACTIVE_MOD, payload.key)
    commit(SET_ACTIVE_PROPERTY, payload.property)
    commit(UPDATE_WIN_TYPE, 'ModPropertyManager')
    dispatch('setActivePropertyTabType', 'attr')
  },
  setActivePropertyTabType({ commit }, type) {
    commit(UPDATE_PROPERTY_TAB_TYPE, type)
  },
  setActivePropertyData(
    { commit, dispatch, getters: { activePropertyData } },
    { data }
  ) {
    commit(SET_ACTIVE_PROPERTY_DATA, { activePropertyData, data })
    dispatch('refreshCode')
  },
  deleteMod({ commit, dispatch, state }, key) {
    commit(DELETE_MOD, key)
    if (key === state.activeMod.key) {
      commit(SET_ACTIVE_MOD, null)
      commit(SET_ACTIVE_PROPERTY, null)
      commit(UPDATE_WIN_TYPE, 'ModsList')
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

  undo({ dispatch }) {
    gUndoManager.undo((code = '') =>
      dispatch('updateMarkDown', { code, historyDisabled: true })
    )
  },
  redo({ dispatch }) {
    gUndoManager.redo((code = '') =>
      dispatch('updateMarkDown', { code, historyDisabled: true })
    )
  },
  setNewModPosition({ commit }, position) {
    commit('SET_NEW_MOD_POSITION', position)
  },

  async refreshOpenedFile({ dispatch, rootGetters }, { path }) {
    await dispatch(
      'gitlab/readFile',
      { path, editorMode: true },
      { root: true }
    )
    let { 'gitlab/getFileByPath': gitlabGetFileByPath } = rootGetters
    let file = gitlabGetFileByPath(path)
    if (!file) return

    let { content } = file
    await dispatch('updateOpenedFile', { path, content })
  },
  updateOpenedFile(context, payload) {
    let { path } = payload
    let fullPath = getFileFullPathByPath(path)
    let { commit, rootGetters } = context
    let { 'user/username': username } = rootGetters

    let timestamp = Date.now()
    let commitPayload = {
      username,
      path: fullPath,
      partialUpdatedFileInfo: { timestamp, ...payload }
    }
    commit(UPDATE_OPENED_FILE, commitPayload)
  },
  closeOpenedFile(context, { path }) {
    let fullPath = getFileFullPathByPath(path)
    let { commit, rootGetters: { 'user/username': username } } = context
    commit(CLOSE_OPENED_FILE, { username, path: fullPath })
  }
}

export default actions
