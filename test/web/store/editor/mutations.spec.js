import Parser from '@/lib/mod/parser'
import mutations, {
  props
} from '@/store/editor/mutations'
import { initPageState } from '@/store/editor/state'
import {getFileFullPathByPath} from '@/lib/utils/gitlab'

const {
  SET_ACTIVE_PAGE,
  SET_ACTIVE_PAGE_URL

  // ADD_MOD,
  // DELETE_MOD,
  // MOVE_MOD,
  // SET_PRE_MOD_KEY,
  // SET_IS_MULTIPLE_TEXT_DIALOG_SHOW,

  // SET_ACTIVE_MOD,
  // SET_ACTIVE_PROPERTY,
  // SET_ACTIVE_PROPERTY_OPTIONS,
  // REFRESH_MOD_ATTRIBUTES,
  // SET_ACTIVE_PROPERTY_DATA,
  // SET_ACTIVE_AREA,

  // UPDATE_ACTIVE_MOD_ATTRIBUTES,
  // UPDATE_MODS,
  // UPDATE_THEME_NAME,
  // UPDATE_THEME_COLOR,
  // UPDATE_THEME_BG_COLOR,
  // UPDATE_THEME_FONT,

  // UPDATE_MANAGE_PANE_COMPONENT,
  // UPDATE_PROPERTY_TAB_TYPE,
  // RESET_SHOWING_COL,

  // UPDATE_FILEMANAGER_TREE_NODE_EXPANDED,

  // RESET_OPENED_FILE,
  // UPDATE_OPENED_FILE,
  // CLOSE_OPENED_FILE,

  // SET_EDITING_AREA,
  // SET_NEW_MOD_POSITION,

  // REFRESH_SITE_SETTINGS,
  // UPDATE_OPENED_LAYOUT_FILE,

  // UPDATE_CURSOR_POSITION,

  // UNDO,
  // REDO,
  // SAVE_HISTORY,
  // INIT_UNDO,
  // TOGGLE_SKY_DRIVE,
  // CLOSE_ALL_OPENED_FILE,
  // ADD_RECENT_OPENED_SITE
} = props

describe('mutations', () => {
  const username = 'demo'
  const path = '/demo/hello/world'
  const fullPath = getFileFullPathByPath(path)
  const content = 'hello world'

  const getPageState = () => {
    let pageData = initPageState()
    pageData.modList = Parser.buildBlockList(content)
    return pageData
  }

  const getState = () => {
    let file = {
      content,
      path,
      saved: true
    }
    return {
      activePage: null,
      openedFiles: {
        [username]: {
          [fullPath]: {
            ...file
          }
        }
      },
      openedPages: {
        [fullPath]: {
          ...getPageState(),
          file
        }
      }
    }
  }

  it('SET_ACTIVE_PAGE_URL', () => {
    const state = {}
    mutations[SET_ACTIVE_PAGE_URL](state, { path })
    expect(state.activePageUrl).toEqual(path)
  })

  describe('SET_ACTIVE_PAGE', () => {
    it('should have active page data', () => {
      const state = getState()
      mutations[SET_ACTIVE_PAGE](state, { username, path })
      expect(state.activePage).not.toBeNull()
      expect(state.activePage.activeMod).toBeNull()
      expect(state.activePage.modList.length).toEqual(state.openedPages[fullPath].modList.length)
    })
  })
})
