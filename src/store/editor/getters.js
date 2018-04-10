import _ from 'lodash'

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

export default getters
