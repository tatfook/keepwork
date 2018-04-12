import Vue from 'vue'
import _ from 'lodash'
import Parser from '@/lib/mod/parser'
import { resetPartialState } from './state'

const RESET_STATE = 'RESET_STATE'
const SET_ACTIVE_PAGE = 'SET_ACTIVE_PAGE'

const ADD_MOD = 'ADD_MOD'
const DELETE_MOD = 'DELETE_MOD'
const MOVE_MOD = 'MOVE_MOD'

const SET_ACTIVE_MOD = 'SET_ACTIVE_MOD'
const SET_ACTIVE_PROPERTY = 'SET_ACTIVE_PROPERTY'
const REFRESH_MOD_ATTRIBUTES = 'REFRESH_MOD_ATTRIBUTES'
const SET_ACTIVE_PROPERTY_DATA = 'SET_ACTIVE_PROPERTY_DATA'

const UPDATE_ACTIVE_MOD_ATTRIBUTES = 'UPDATE_ACTIVE_MOD_ATTRIBUTES'
const UPDATE_MODS = 'UPDATE_MODS'
const UPDATE_THEME_NAME = 'UPDATE_THEME_NAME'
const UPDATE_THEME_COLOR = 'UPDATE_THEME_COLOR'
const UPDATE_THEME_BG_COLOR = 'UPDATE_THEME_BG_COLOR'
const UPDATE_THEME_FONT = 'UPDATE_THEME_FONT'

const UPDATE_WIN_TYPE = 'UPDATE_WIN_TYPE'
const UPDATE_PROPERTY_TAB_TYPE = 'UPDATE_PROPERTY_TAB_TYPE'
const RESET_SHOWING_COL = 'RESET_SHOWING_COL'

const UPDATE_FILEMANAGER_TREE_NODE_EXPANDED =
  'UPDATE_FILEMANAGER_TREE_NODE_EXPANDED'

const SET_NEW_MOD_POSITION = 'SET_NEW_MOD_POSITION'

const UPDATE_OPENED_FILE = 'UPDATE_OPENED_FILE'
const CLOSE_OPENED_FILE = 'CLOSE_OPENED_FILE'

export const props = {
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

  SET_NEW_MOD_POSITION,

  UPDATE_OPENED_FILE,
  CLOSE_OPENED_FILE
}

const mutations = {
  [RESET_STATE](state) {
    const resettedPartialState = resetPartialState()
    _.keys(resettedPartialState).forEach(key => {
      Vue.set(state, key, resettedPartialState[key])
    })
  },
  [SET_ACTIVE_PAGE](state, path) {
    Vue.set(state, 'activePage', path)
  },
  [ADD_MOD](state, { modProperties, key, cmd }) {
    const mod = Parser.addBlockByKey(
      state.modList,
      key,
      modProperties,
      cmd,
      state.newModPosition
    )
    Vue.set(state, 'activeMod', mod)
  },
  [DELETE_MOD](state, key) {
    Parser.deleteBlock(state.modList, key)
  },
  [MOVE_MOD](state, { oldIndex, newIndex }) {
    Parser.moveBlock(state.modList, oldIndex, newIndex)
    Vue.set(state, 'activeMod', state.modList[newIndex])
  },
  [SET_ACTIVE_MOD](state, key) {
    if (state.activeMod && state.activeMod.key === key) return
    const index = state.modList.map(el => el.key).indexOf(key)
    if (index !== -1) Vue.set(state, 'activeMod', state.modList[index])
  },
  [SET_ACTIVE_PROPERTY](state, property) {
    if (!state.activeMod) return
    Vue.set(state, 'activeProperty', property)
  },
  [REFRESH_MOD_ATTRIBUTES](state, { key, code }) {
    Parser.updateBlock(state.modList, key, code)
  },
  [SET_ACTIVE_PROPERTY_DATA](state, { activePropertyData, data }) {
    let newData = { ...activePropertyData, ...data }
    Parser.updateBlockAttribute(
      state.modList,
      state.activeMod.key,
      state.activeProperty,
      newData
    )
  },
  [UPDATE_ACTIVE_MOD_ATTRIBUTES](state, { key, value }) {
    Parser.updateBlockAttribute(state.modList, state.activeMod.key, key, value)
  },
  [UPDATE_MODS](state, code) {
    let blockList = Parser.buildBlockList(code)
    Parser.updateBlockList(state.modList, blockList)
  },
  [UPDATE_THEME_NAME](state, themeName) {
    Vue.set(state.theme, 'name', themeName)
  },
  [UPDATE_THEME_COLOR](state, colorID) {
    Vue.set(state.theme, 'colorID', colorID)
  },
  [UPDATE_THEME_BG_COLOR](state, bgColorID) {
    Vue.set(state.theme, 'bgColorID', bgColorID)
  },
  [UPDATE_THEME_FONT](state, fontID) {
    Vue.set(state.theme, 'fontID', fontID)
  },
  [UPDATE_WIN_TYPE](state, componentType) {
    Vue.set(state, 'activeWinType', componentType)
  },
  [UPDATE_PROPERTY_TAB_TYPE](state, componentType) {
    Vue.set(state, 'activePropertyTabType', componentType)
  },
  [RESET_SHOWING_COL](state, showingColObj) {
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
  [UPDATE_FILEMANAGER_TREE_NODE_EXPANDED](state, { path, expanded }) {
    Vue.set(state, 'filemanagerTreeNodeExpandMapByPath', {
      ...state.filemanagerTreeNodeExpandMapByPath,
      [path]: expanded
    })
  },
  [SET_NEW_MOD_POSITION](state, position) {
    state.newModPosition = position
  },

  [UPDATE_OPENED_FILE](state, { username, path, partialUpdatedFileInfo }) {
    Vue.set(state, 'openedFiles', {
      ...state.openedFiles,
      [username]: {
        ..._.get(state, ['openedFiles', username]),
        [path]: {
          ..._.get(state, ['openedFiles', username, path]),
          ...partialUpdatedFileInfo
        }
      }
    })
  },
  [CLOSE_OPENED_FILE](state, { username, path, file }) {
    Vue.set(state, 'openedFiles', {
      ...state.openedFiles,
      [username]: _.omit(_.get(state, ['openedFiles', username], {}), path)
    })
  }
}

export default mutations
