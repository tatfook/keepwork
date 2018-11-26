import _ from 'lodash'
const getters = {
  websiteContents: state => {
    console.log(state)
    return state.websiteContents
  },
  kevin: state => 'kevin ---->',
  websiteConfigs: state => state.websiteConfigs,
  getModListByFullPath: (state, { websiteContents }) => fullPath =>
    _.get(websiteContents, fullPath, {}),
  getPagesByProjectName: (state, { websiteConfigs }) => projectName =>
    _.get(websiteConfigs, [projectName, 'pages'], []),
  getPageLayout: (state, { getPagesByProjectName }) => (
    projectName,
    fileName
  ) => {
    const pages = getPagesByProjectName(projectName)
    let layoutId = _.get(pages, [fileName, 'layout'], '')
    if (!layoutId) return {}
    return _.find(
      _.get(this.layoutConfig, ['layouts'], []),
      item => item.id === layoutId
    )
  }
}

export default getters
