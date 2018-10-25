import axios from 'axios'
import _ from 'lodash'

export const showRawForGuest = async (
  rawBaseUrl,
  // dataSourceUsername,
  // projectName,
  fullPath
) => {
  // let url = `${rawBaseUrl}/${dataSourceUsername}/${projectName}/raw/master/${fullPath}?_random=${Math.random()}`
  const _projectName = fullPath
    .split('/')
    .splice(0, 2)
    .join('/')
  const [ projectName, path ] = [_projectName, fullPath].map(encodeURIComponent)
  let url = `${rawBaseUrl}/projects/${projectName}/files/${path}`
  let res = await axios.get(url)
  return _.get(res, 'data.content', '')
}

export default {
  showRawForGuest
}
