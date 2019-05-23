import Vue from 'vue'
import _ from 'lodash'
import Parser from '@/lib/mod/parser'
import UndoHelper from '@/lib/utils/undo/undoHelper'
import LayoutHelper from '@/lib/mod/layout'
import {
  getFileFullPathByPath,
  getFileSitePathByPath
} from '@/lib/utils/gitlab'

const SET_ACTIVE_PAGE = 'SET_ACTIVE_PAGE'
const SET_ACTIVE_PAGE_URL = 'SET_ACTIVE_PAGE_URL'

const ADD_MOD = 'ADD_MOD'
const DELETE_MOD = 'DELETE_MOD'
const MOVE_MOD = 'MOVE_MOD'
const SET_PRE_MOD_KEY = 'SET_PRE_MOD_KEY'
const SET_IS_MULTIPLE_TEXT_DIALOG_SHOW = 'SET_IS_MULTIPLE_TEXT_DIALOG_SHOW'

const SET_ACTIVE_MOD = 'SET_ACTIVE_MOD'
const SET_ACTIVE_SUB_MOD = 'SET_ACTIVE_SUB_MOD'
const SET_ACTIVE_PROPERTY = 'SET_ACTIVE_PROPERTY'
const SET_ACTIVE_PROPERTY_OPTIONS = 'SET_ACTIVE_PROPERTY_OPTIONS'
const SET_ACTIVE_PROPERTY_DATA = 'SET_ACTIVE_PROPERTY_DATA'
const SET_ACTIVE_AREA = 'SET_ACTIVE_AREA'

const UPDATE_ACTIVE_MOD_ATTRIBUTES = 'UPDATE_ACTIVE_MOD_ATTRIBUTES'
const UPDATE_ACTIVE_MOD_ATTRIBUTES_LIST = 'UPDATE_ACTIVE_MOD_ATTRIBUTES_LIST'
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

const LOAD_PAGE_DATA = 'LOAD_PAGE_DATA'
const ADD_OPENED_FILE = 'ADD_OPENED_FILE'
const UPDATE_OPENED_FILE = 'UPDATE_OPENED_FILE'
const CLOSE_OPENED_FILE = 'CLOSE_OPENED_FILE'
const CLOSE_ALL_OPENED_FILE = 'CLOSE_ALL_OPENED_FILE'

const REFRESH_SITE_SETTINGS = 'REFRESH_SITE_SETTINGS'
const UPDATE_OPENED_LAYOUT_FILE = 'UPDATE_OPENED_LAYOUT_FILE'

const UPDATE_CURSOR_POSITION = 'UPDATE_CURSOR_POSITION'

const UNDO = 'UNDO'
const REDO = 'REDO'
const SAVE_HISTORY = 'SAVE_HISTORY'
const INIT_UNDO = 'INIT_UNDO'
const TOGGLE_SKY_DRIVE = 'TOGGLE_SKY_DRIVE'
const ADD_RECENT_OPENED_SITE = 'ADD_RECENT_OPENED_SITE'
const TOGGLE_FILE_HISTORY = 'TOGGLE_FILE_HISTORY'
const TOGGLE_ANGLES = 'TOGGLE_ANGLES'
const TOGGLE_IFRAME_DIALOG = 'TOGGLE_IFRAME_DIALOG'

export const props = {
  SET_ACTIVE_PAGE,
  SET_ACTIVE_PAGE_URL,

  ADD_MOD,
  DELETE_MOD,
  MOVE_MOD,
  SET_PRE_MOD_KEY,
  SET_IS_MULTIPLE_TEXT_DIALOG_SHOW,

  SET_ACTIVE_MOD,
  SET_ACTIVE_SUB_MOD,
  SET_ACTIVE_PROPERTY,
  SET_ACTIVE_PROPERTY_OPTIONS,
  SET_ACTIVE_PROPERTY_DATA,
  SET_ACTIVE_AREA,

  UPDATE_ACTIVE_MOD_ATTRIBUTES,
  UPDATE_ACTIVE_MOD_ATTRIBUTES_LIST,
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

  LOAD_PAGE_DATA,
  ADD_OPENED_FILE,
  UPDATE_OPENED_FILE,
  CLOSE_OPENED_FILE,
  CLOSE_ALL_OPENED_FILE,

  REFRESH_SITE_SETTINGS,
  UPDATE_OPENED_LAYOUT_FILE,

  UPDATE_CURSOR_POSITION,

  UNDO,
  REDO,
  SAVE_HISTORY,
  INIT_UNDO,
  TOGGLE_SKY_DRIVE,
  ADD_RECENT_OPENED_SITE,
  TOGGLE_FILE_HISTORY,
  TOGGLE_ANGLES,
  TOGGLE_IFRAME_DIALOG
}

const activeAreaData = state => {
  const area = state.activePage.activeArea
  if (area === LayoutHelper.Const.MAIN_AREA) return state.activePage

  const sitePath = getFileSitePathByPath(state.activePageUrl)
  const siteSetting = state.siteSettings[sitePath]
  const layout = LayoutHelper.getLayoutByPath(
    siteSetting.siteLayoutConfig,
    state.activePageUrl
  )

  let targetLayoutContentFileName = _.get(layout, ['content', area])
  let targetLayoutContentFilePath = `${area}s/${targetLayoutContentFileName}`
  if (targetLayoutContentFileName && targetLayoutContentFilePath) {
    return siteSetting.pages[targetLayoutContentFilePath]
  }
  console.error('invalid active area')
}

const activeModList = state => {
  return activeAreaData(state).modList
}

const mutations = {
  [SET_ACTIVE_PAGE_URL](state, { path }) {
    Vue.set(state, 'activePageUrl', path)
  },
  [SET_ACTIVE_PAGE](state, { username, path }) {
    Vue.set(state, 'activePageUrl', path)
    const pageData = state.openedPages[getFileFullPathByPath(path)]
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
    if (state.activePage && state.activePage.activeMod && state.activePage.activeMod.key === key) {
      return
    }
    const modList = activeModList(state)
    const index = modList.map(el => el.key).indexOf(key)
    if (index !== -1) {
      Vue.set(state.activePage, 'activeMod', modList[index])
    }
  },
  [SET_ACTIVE_SUB_MOD](state, payload) {
    let subMod = state.activePage.activeSubMod
    if (!payload || !payload.modType) {
      Vue.set(state.activePage, 'activeSubMod', null)
      if (subMod) {
        Vue.set(state.activePage, 'activeProperty', subMod.parentProperty)
      }
    } else {
      Vue.set(state.activePage, 'activeSubMod', payload)
    }
  },
  [SET_PRE_MOD_KEY](state, key) {
    Vue.set(state.activePage, 'preModKey', key)
  },
  [SET_IS_MULTIPLE_TEXT_DIALOG_SHOW](state, isShow) {
    Vue.set(state, 'isMultipleTextDialogShow', isShow)
  },
  [SET_ACTIVE_PROPERTY](state, property) {
    if (!state.activePage || !state.activePage.activeMod) return
    if (state.activePage.activeSubMod) {
      Vue.set(state.activePage.activeSubMod, 'activeProperty', property)
    } else {
      Vue.set(state.activePage, 'activeProperty', property)
    }
  },
  [SET_ACTIVE_PROPERTY_OPTIONS](state, payload) {
    Vue.set(state, 'activePropertyOptions', payload)
  },
  [SET_ACTIVE_PROPERTY_DATA](state, { activePropertyData, data, updateSubMod }) {
    let newData = { ...activePropertyData, ...data }
    const modList = activeModList(state)
    let activeProperty = state.activePage.activeProperty
    if (updateSubMod) {
      let subMod = state.activePage.activeSubMod
      activeProperty = subMod.parentProperty
      let propertyData = _.cloneDeep(state.activePage.activeMod.data[activeProperty])
      if (subMod.childProperty !== undefined) {
        _.merge(propertyData.collection[subMod.childProperty], { [subMod.activeProperty]: newData })
      } else {
        _.merge(propertyData, { [subMod.activeProperty]: newData })
      }
      newData = propertyData
    }
    Parser.updateBlockAttribute(
      modList,
      state.activePage.activeMod.key,
      activeProperty,
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
  [UPDATE_ACTIVE_MOD_ATTRIBUTES_LIST](state, { key, action, index }) {
    const modList = activeModList(state)
    let list = state.activePage.activeMod.data[key]
    action = _.upperCase(action)
    if (action === 'ADD') {
      list.collection.splice(list.collection.length, 0, { isSubmodShow: true })
    } else if (action === 'DELETE') {
      list.collection.splice(index, 1)
    }
    Parser.updateBlockAttribute(
      modList,
      state.activePage.activeMod.key,
      key,
      list
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
    if (typeof showingColObj !== 'object') {
      return false
    }

    if (typeof showingColObj.isManagerShow === 'boolean') {
      Vue.set(state.showingCol, 'isManagerShow', showingColObj.isManagerShow)
    }

    if (typeof showingColObj.isPreviewShow === 'boolean') {
      Vue.set(state.showingCol, 'isPreviewShow', showingColObj.isPreviewShow)
    }

    if (typeof showingColObj.isCodeShow === 'boolean') {
      Vue.set(state.showingCol, 'isCodeShow', showingColObj.isCodeShow)
    }

    if (typeof showingColObj.isZenMode === 'boolean') {
      Vue.set(state.showingCol, 'isZenMode', showingColObj.isZenMode)
    }
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
  [LOAD_PAGE_DATA](state, { path, pageData }) {
    Vue.set(state.openedPages, path, pageData)
  },
  [ADD_OPENED_FILE](state, { username, path, data }) {
    let _path = path.split('/')
    if (!_path[0] && !_path[1]) return
    Vue.set(state.openedFiles, username, {
      ...state.openedFiles[username],
      [path]: data
    })
  },
  [UPDATE_OPENED_FILE](state, { username, path, data }) {
    let _path = path.split('/')
    if (!_path[0] && !_path[1]) return
    _.merge(state.openedFiles, {
      [username]: {
        [path]: {
          ...data
        }
      }
    })
  },
  [CLOSE_OPENED_FILE](state, { username, path, file }) {
    Vue.set(state, 'openedFiles', {
      ...state.openedFiles,
      [username]: _.omit(_.get(state, ['openedFiles', username], {}), path)
    })
    Vue.set(state, 'openedPages', _.omit(state.openedPages, path))
    // _.omit(state.openedPages, path)
  },
  [CLOSE_ALL_OPENED_FILE](state, { username }) {
    Vue.set(state, 'openedFiles', {
      ...state.openedFiles,
      [username]: {}
    })
    Vue.set(state, 'openedPages', {})
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
  },
  [UNDO](state) {
    UndoHelper.undo(activeAreaData(state).undoManager)
  },
  [REDO](state) {
    UndoHelper.redo(activeAreaData(state).undoManager)
  },
  [SAVE_HISTORY](state, payload) {
    UndoHelper.save(
      activeAreaData(state).undoManager,
      payload
    )
  },
  [INIT_UNDO](state, payload) {
    UndoHelper.init(activeAreaData(state).undoManager, payload)
  },
  [TOGGLE_SKY_DRIVE](state, { showSkyDrive = false }) {
    Vue.set(state, 'isSkyDriveManagerDialogShow', showSkyDrive)
  },
  [ADD_RECENT_OPENED_SITE](state, { updateRecentUrlList, username }) {
    Vue.set(state, 'updateRecentUrlList', {
      ...state.updateRecentUrlList,
      [username]: updateRecentUrlList
    })
  },
  [TOGGLE_ANGLES](state, { showAngle = false }) {
    Vue.set(state, 'isAnglesToggle', showAngle)
  },
  [TOGGLE_FILE_HISTORY](state, { isVisible }) {
    Vue.set(state, 'isFileHistoryVisible', isVisible)
  },
  [TOGGLE_IFRAME_DIALOG](state, payload) {
    Vue.set(state, 'iframeDialog', payload)
  },
}

export default mutations
