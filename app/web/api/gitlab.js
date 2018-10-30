import axios from 'axios'
import _ from 'lodash'

export const showRawForGuest = async (
  rawBaseUrl,
  // dataSourceUsername,
  _projectName,
  _path
) => {
  const [projectName, path] = [_projectName, _path].map(encodeURIComponent)
  let url = `${rawBaseUrl}/projects/${projectName}/files/${path}`
  let res = await axios.get(url)
  let content = _.get(res, 'data.content', '')
  try {
    return JSON.parse(content)
  } catch (error) {
    return content
  }
}

export default {
  showRawForGuest
}
