import axios from 'axios'
import _ from 'lodash'

const API = 'https://api.keepwork.com/git/v0/projects'

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
  let content = _.get(res, 'data.content', '')
  try {
    return JSON.parse(content)
  } catch (error) {
    return content
  }
}

export const getConfig = async () => {
  let url = `${API}/official%2Fkeepwork-template-v2/files/config.json`
  let res = await axios.get(url)
  let content = _.get(res, 'data.content', '')
  try {
    return JSON.parse(content)
  } catch (error) {
    return content
  }
}

export const getWebPageConfig = async () => {
  let url = `${API}/official%2Fkeepwork-template-v2/files/webpage%2Fconfig.json`
  let res = await axios.get(url)
  let content = _.get(res, 'data.content', '')
  try {
    return JSON.parse(content)
  } catch (error) {
    return content
  }
}

export const getTemplateList = async (folder = 'basic') => {
  let res = await axios.get(`${API}/official%2Fkeepwork-template-v2/tree/templates%2F${folder}?recursive=true`)
  try {
    return JSON.parse(res.data)
  } catch (error) {
    return res.data
  }
}

export const getPageTemplateContent = async (contentPath) => {
  const url = `${API}/official%2Fkeepwork-template-v2/files/webpage%2${contentPath}`
  const content = await axios.get(url)
  try {
    return JSON.parse(content)
  } catch (error) {
    return content
  }
}

export default {
  showRawForGuest,
  getTemplate,
  getConfig,
  getWebPageConfig,
  getTemplateList,
  getPageTemplateContent
}
