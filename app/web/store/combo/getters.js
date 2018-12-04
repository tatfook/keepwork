import _ from 'lodash'
const getters = {
  websiteContents: state => state.websiteContents,
  websiteConfigs: state => state.websiteConfigs,
  getContentsByFullPath: (state, { websiteContents }) => fullPath =>
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
