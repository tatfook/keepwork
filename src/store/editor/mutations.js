import Vue from 'vue'
import _ from 'lodash'
import Parser from '@/lib/mod/parser'
import LayoutHelper from '@/lib/mod/layout'
import {
  getFileFullPathByPath,
  getFileSitePathByPath
} from '@/lib/utils/gitlab'

const SET_ACTIVE_PAGE = 'SET_ACTIVE_PAGE'

const ADD_MOD = 'ADD_MOD'
const DELETE_MOD = 'DELETE_MOD'
const MOVE_MOD = 'MOVE_MOD'

const SET_ACTIVE_MOD = 'SET_ACTIVE_MOD'
const SET_ACTIVE_PROPERTY = 'SET_ACTIVE_PROPERTY'
const SET_ACTIVE_PROPERTY_OPTIONS = 'SET_ACTIVE_PROPERTY_OPTIONS'
const REFRESH_MOD_ATTRIBUTES = 'REFRESH_MOD_ATTRIBUTES'
const SET_ACTIVE_PROPERTY_DATA = 'SET_ACTIVE_PROPERTY_DATA'
const SET_ACTIVE_AREA = 'SET_ACTIVE_AREA'

const UPDATE_ACTIVE_MOD_ATTRIBUTES = 'UPDATE_ACTIVE_MOD_ATTRIBUTES'
const UPDATE_MODS = 'UPDATE_MODS'
const UPDATE_THEME_NAME = 'UPDATE_THEME_NAME'
const UPDATE_THEME_COLOR = 'UPDATE_THEME_COLOR'
const UPDATE_THEME_BG_COLOR = 'UPDATE_THEME_BG_COLOR'
const UPDATE_THEME_FONT = 'UPDATE_THEME_FONT'

const UPDATE_MANAGE_PANE_COMPONENT = 'UPDATE_MANAGE_PANE_COMPONENT'
const UPDATE_PROPERTY_TAB_TYPE = 'UPDATE_PROPERTY_TAB_TYPE'
const RESET_SHOWING_COL = 'RESET_SHOWING_COL'

const UPDATE_FILEMANAGER_TREE_NODE_EXPANDED =
  'UPDATE_FILEMANAGER_TREE_NODE_EXPANDED'

const SET_NEW_MOD_POSITION = 'SET_NEW_MOD_POSITION'
const SET_EDITING_AREA = 'SET_EDITING_AREA'

const RESET_OPENED_FILE = 'RESET_OPENED_FILE'
const UPDATE_OPENED_FILE = 'UPDATE_OPENED_FILE'
const CLOSE_OPENED_FILE = 'CLOSE_OPENED_FILE'

const REFRESH_SITE_SETTINGS = 'REFRESH_SITE_SETTINGS'
const UPDATE_OPENED_LAYOUT_FILE = 'UPDATE_OPENED_LAYOUT_FILE'

const UPDATE_CURSOR_POSITION = 'UPDATE_CURSOR_POSITION'

export const props = {
  SET_ACTIVE_PAGE,

  ADD_MOD,
  DELETE_MOD,
  MOVE_MOD,

  SET_ACTIVE_MOD,
  SET_ACTIVE_PROPERTY,
  SET_ACTIVE_PROPERTY_OPTIONS,
  REFRESH_MOD_ATTRIBUTES,
  SET_ACTIVE_PROPERTY_DATA,
  SET_ACTIVE_AREA,

  UPDATE_ACTIVE_MOD_ATTRIBUTES,
  UPDATE_MODS,
  UPDATE_THEME_NAME,
  UPDATE_THEME_COLOR,
  UPDATE_THEME_BG_COLOR,
  UPDATE_THEME_FONT,

  UPDATE_MANAGE_PANE_COMPONENT,
  UPDATE_PROPERTY_TAB_TYPE,
  RESET_SHOWING_COL,

  UPDATE_FILEMANAGER_TREE_NODE_EXPANDED,

  SET_NEW_MOD_POSITION,
  SET_EDITING_AREA,

  RESET_OPENED_FILE,
  UPDATE_OPENED_FILE,
  CLOSE_OPENED_FILE,

  REFRESH_SITE_SETTINGS,
  UPDATE_OPENED_LAYOUT_FILE,

  UPDATE_CURSOR_POSITION
}

const activeModList = state => {
  const area = state.activePage.activeArea
  if (area === LayoutHelper.Const.MAIN_AREA) return state.activePage.modList

  const sitePath = getFileSitePathByPath(state.activePageUrl)
  const siteSetting = state.siteSettings[sitePath]
  const layout = LayoutHelper.getLayoutByPath(
    siteSetting.siteLayoutConfig,
    state.activePageUrl
  )

  let targetLayoutContentFileName = _.get(layout, ['content', area])
  let targetLayoutContentFilePath = `${area}s/${targetLayoutContentFileName}`
  if (targetLayoutContentFileName && targetLayoutContentFilePath) {
    return siteSetting.pages[targetLayoutContentFilePath].modList
  }
  console.error('invalid active mod list')
}

const mutations = {
  [SET_ACTIVE_PAGE](state, { username, path }) {
    Vue.set(state, 'activePageUrl', path)
    if (!state.openedFiles[username]) return
    const pageData = state.openedFiles[username][getFileFullPathByPath(path)]
    Vue.set(state, 'activePage', pageData)
    if (pageData) {
      Vue.set(state.activePage, 'activeMod', null)
      Vue.set(state.activePage, 'activeProperty', null)
    }
  },
  [ADD_MOD](state, { newMod, key }) {
    const mod = Parser.addBlockByKey(
      activeModList(state),
      key,
      newMod,
      state.activePage.newModPosition
    )
    Vue.set(state.activePage, 'activeMod', mod)
  },
  [DELETE_MOD](state, key) {
    Parser.deleteBlock(activeModList(state), key)
  },
  [MOVE_MOD](state, { oldIndex, newIndex }) {
    const modList = activeModList(state)
    Parser.moveBlock(modList, oldIndex, newIndex)
    Vue.set(state.activePage, 'activeMod', modList[newIndex])
  },
  [SET_ACTIVE_MOD](state, key) {
    if (!key) {
      return Vue.set(state.activePage, 'activeMod', null)
    }
    if (state.activePage.activeMod && state.activePage.activeMod.key === key) {
      return
    }
    const modList = activeModList(state)
    const index = modList.map(el => el.key).indexOf(key)
    if (index !== -1) {
      Vue.set(state.activePage, 'activeMod', modList[index])
    }
  },
  [SET_ACTIVE_PROPERTY](state, property) {
    if (!state.activePage.activeMod) return
    Vue.set(state.activePage, 'activeProperty', property)
  },
  [SET_ACTIVE_PROPERTY_OPTIONS](state, payload) {
    Vue.set(state, 'activePropertyOptions', payload)
  },
  [REFRESH_MOD_ATTRIBUTES](state, { key, code }) {
    const modList = activeModList(state)
    Parser.updateBlockCode(modList, key, code)
  },
  [SET_ACTIVE_PROPERTY_DATA](state, { activePropertyData, data }) {
    let newData = { ...activePropertyData, ...data }
    const modList = activeModList(state)
    Parser.updateBlockAttribute(
      modList,
      state.activePage.activeMod.key,
      state.activePage.activeProperty,
      newData
    )
  },
  [SET_ACTIVE_AREA](state, area) {
    Vue.set(state.activePage, 'activeArea', area)
  },
  [SET_EDITING_AREA](state, payload) {
    Vue.set(state.activePage, 'addingArea', payload.area)
    Vue.set(state.activePage, 'cursorPosition', payload.cursorPosition)
  },
  [UPDATE_ACTIVE_MOD_ATTRIBUTES](state, { key, value }) {
    const modList = activeModList(state)
    Parser.updateBlockAttribute(
      modList,
      state.activePage.activeMod.key,
      key,
      value
    )
  },
  [UPDATE_MODS](state, blockList) {
    const modList = activeModList(state)
    Parser.updateBlockList(modList, blockList)
  },
  [UPDATE_THEME_NAME](state, themeName) {
    Vue.set(state.theme, 'name', themeName)
  },
  [UPDATE_THEME_COLOR](state, colorID) {
    Vue.set(state.activePage.theme, 'colorID', colorID)
  },
  [UPDATE_THEME_BG_COLOR](state, bgColorID) {
    Vue.set(state.activePage.theme, 'bgColorID', bgColorID)
  },
  [UPDATE_THEME_FONT](state, fontID) {
    Vue.set(state.activePage.theme, 'fontID', fontID)
  },
  [UPDATE_MANAGE_PANE_COMPONENT](state, payload) {
    // for the usage of manage pane component
    // payload should be {name, props}
    payload = _.isString(payload) ? { name: payload } : payload
    Vue.set(state, 'activeManagePaneComponent', payload)
  },
  [UPDATE_PROPERTY_TAB_TYPE](state, componentType) {
    Vue.set(state.activePage, 'activePropertyTabType', componentType)
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
  [UPDATE_FILEMANAGER_TREE_NODE_EXPANDED](state, payload) {
    payload = _.isArray(payload) ? payload : [payload]
    let updatedInfo = {}
    payload.forEach(({ path, expanded }) => (updatedInfo[path] = expanded))
    Vue.set(state, 'filemanagerTreeNodeExpandMapByPath', {
      ...state.filemanagerTreeNodeExpandMapByPath,
      ...updatedInfo
    })
  },
  [SET_NEW_MOD_POSITION](state, position) {
    state.activePage.newModPosition = position
  },
  [UPDATE_CURSOR_POSITION](state, cursor) {
    Vue.set(state.activePage, 'cursorPos', cursor)
  },
  [RESET_OPENED_FILE](state, { username, path, data }) {
    Vue.set(state.openedFiles, username, {
      ..._.get(state, ['openedFiles', username]),
      [path]: data
    })
  },
  [UPDATE_OPENED_FILE](state, { username, path, partialUpdatedFileInfo }) {
    _.merge(state.openedFiles, {
      [username]: {
        [path]: {
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
  },
  [REFRESH_SITE_SETTINGS](state, { sitePath, siteSetting }) {
    Vue.set(state.siteSettings, sitePath, siteSetting)
  },
  [UPDATE_OPENED_LAYOUT_FILE](
    state,
    { sitePath, layoutContentFilePath, data }
  ) {
    let siteSetting = state.siteSettings[sitePath]
    _.merge(siteSetting.pages[layoutContentFilePath], data)
  }
}

export default mutations
