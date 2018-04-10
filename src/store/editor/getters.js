import _ from 'lodash'
import { getFileFullPathByPath } from '@/lib/utils/gitlab'

const getters = {
  openedFiles: (state, getters, rootState, {'user/username': username}) => state.openedFiles[username] || {},
  getOpenedFileByPath: (state, { openedFiles }) => path => openedFiles[getFileFullPathByPath(path)] || {},

  activePage: state => state.activePage,
  activePageInfo: (state, { activePage }) => {
    let [username, sitename] = activePage.split('/').filter(x => x)
    return { username, sitename }
  },
  activePageUsername: (state, { activePageInfo: { username } }) => username,

  code: (state, { getOpenedFileByPath, activePage }) => getOpenedFileByPath(activePage).content || '',
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
  canUndo: (state, { undoManager }) => undoManager.canUndo && undoManager.canUndo(),
  canRedo: (state, { undoManager }) => undoManager.canRedo && undoManager.canRedo()
}

export default getters
