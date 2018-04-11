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

  activePageOpenedFile: (state, { getOpenedFileByPath, activePage }) => getOpenedFileByPath(activePage),
  activePageCacheAvailable: (state, { activePageOpenedFile }) => {
    if (_.isEmpty(activePageOpenedFile)) return false

    let savedExpires = 5 * 60 * 1000 // 5 mins
    let unsavedExpires = 2 * 24 * 60 * 60 * 1000 // 2 days
    let now = Date.now()

    let { timestamp, saved } = activePageOpenedFile
    let cachedTime = now - timestamp

    let saveExpired = cachedTime > savedExpires
    let unsavedExpired = cachedTime > unsavedExpires

    if (saved && !saveExpired) return true
    if (!saved && !unsavedExpired) return true

    return false
  },
  code: (state, { activePageOpenedFile = {} }) => activePageOpenedFile.content || '',

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
    state.filemanagerTreeNodeExpandMapByPath
}

export default getters
