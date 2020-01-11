import { props } from './mutations'
import { showRawForGuest as gitlabShowRawForGuest } from '@/api/gitlab'
import Parser from '@/lib/mod/parser'
import _ from 'lodash'

const { GET_WEBSITE_CONTENT_SUCCESS, GET_WEBSITE_CONFIG_SUCCESS } = props
const API_URL = 'https://api.keepwork.com/core/v0'

const actions = {
  async getContent(
    {
      commit,
      getters: { getContentsByFullPath }
    },
    { url = API_URL, projectName, fileName, section = 'main' }
  ) {
    let fullPath = `${projectName}/${fileName}`
    if (!_.isEmpty(getContentsByFullPath(fullPath))) return
    let content = await gitlabShowRawForGuest(url, projectName, fullPath)
    let modList = Parser.buildBlockList(content)
    commit(GET_WEBSITE_CONTENT_SUCCESS, {
      projectName,
      fullPath,
      section,
      modList,
      content
    })
  },
  async getWebsiteConfig({ commit }, { url = API_URL, projectName }) {
    const layoutConfigPath = '_config/layout.json'
    const config = await gitlabShowRawForGuest(
      url,
      projectName,
      `${projectName}/${layoutConfigPath}`
    )
    commit(GET_WEBSITE_CONFIG_SUCCESS, { projectName, config })
  }
}

export default actions
