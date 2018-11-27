import { props } from './mutations'
import { showRawForGuest as gitlabShowRawForGuest } from '@/api/gitlab'
import Parser from '@/lib/mod/parser'

const { GET_WEBSITE_CONTENT_SUCCESS, GET_WEBSITE_CONFIG_SUCCESS } = props
const API_URL = 'https://api.keepwork.com/git/v0'

const actions = {
  async getContent(
    { commit },
    { url = API_URL, projectName, fileName, section = 'main' }
  ) {
    let fullPath = `${projectName}/${fileName}`
    let content = await gitlabShowRawForGuest(url, projectName, fullPath)
    let modList = Parser.buildBlockList(content)
    console.warn('modList ------------->')
    commit(GET_WEBSITE_CONTENT_SUCCESS, {
      projectName,
      fullPath,
      section,
      modList
    })
    return Promise.resolve(modList)
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
