import axios from 'axios'
import _ from 'lodash'


// export const webTemplateProject = {
//   rawBaseUrl: 'https://api.keepwork.com/git/v0',
//   dataSourceUsername: 'gitlab_rls_official',
//   projectName: 'official/keepwork-template-v2',
//   projectId: 36332,
//   configFullPath: 'config.json',
//   pageTemplateRoot: 'webpage',
//   pageTemplateConfigFullPath: 'webpage/config.json'
// }

// const API = 'https://api.keepwork.com/git/v0/projects'
// const TEMPLATE = 'official%2Fkeepwork-template-v2'
const API = process.env.KEEPWORK_API_PREFIX + '/repos'
const TEMPLATE = 'official%2Fkeepwork-template-v2'

const instance = axios.create({
  baseURL: API
})
instance.interceptors.response.use(response => response.data)

export const showRawForGuest = async (
  rawBaseUrl,
  projectName,
  path
) => {
  path = path
    .split('/')
    .filter(i => i)
    .join('/')
  projectName =
    projectName ||
    path
      .split('/')
      .splice(0, 2)
      .join('/')
  projectName = encodeURIComponent(projectName)
  path = encodeURIComponent(path)
  let url = `${rawBaseUrl}/repos/${projectName}/files/${path}/raw`
  let res = await axios.get(url)
  let content = _.get(res, 'data', '')
  try {
    return _.isObject(content) ? JSON.stringify(content) : _.toString(content)
  } catch (error) {
    return content
  }
}

export const getTemplate = async (rawBaseUrl,
  projectName,
  path) => {
  path = path
    .split('/')
    .filter(i => i)
    .join('/')
  projectName =
    projectName ||
    path
      .split('/')
      .splice(0, 2)
      .join('/')
  projectName = encodeURIComponent(projectName)
  path = encodeURIComponent(path)
  let url = `${rawBaseUrl}/projects/${projectName}/files/${path}`
  let res = await axios.get(url)
  let content = _.get(res, 'data', '')
  try {
    return JSON.parse(content)
  } catch (error) {
    return content
  }
}

export const getConfig = async () => {
  let url = `${TEMPLATE}/files/config.json/raw`
  let res = await instance.get(url)
  return res
}

export const getWebPageConfig = async () => {
  let url = `${TEMPLATE}/files/webpage%2Fconfig.json/raw`
  let res = await instance.get(url)
  return res
}

export const getTemplateList = async (folder = 'basic') => {
  let res = await instance.get(`${API}/${TEMPLATE}/tree?folderPath=templates/${folder}&recursive=true`)
  return res
}

export const getPageTemplateContent = async contentPath => {
  const url = `${TEMPLATE}/files/webpage%2${contentPath}/raw`
  let res = await instance.get(url)
  return res
}

export const getTemplateFile = async (path) => {
  path = path
    .split('/')
    .filter(i => i)
    .join('/')
  const url = `${TEMPLATE}/files/${encodeURIComponent(`templates/basic/${path}`)}/raw`
  let res = await instance.get(url)
  return res
}

export default {
  showRawForGuest,
  getTemplate,
  getConfig,
  getWebPageConfig,
  getTemplateList,
  getPageTemplateContent,
  getTemplateFile
}
