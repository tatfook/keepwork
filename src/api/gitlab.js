import axios from 'axios'

export const showRawForGuest = async (
  rawBaseUrl,
  dataSourceUsername,
  projectName,
  fullPath
) => {
  let url = `${rawBaseUrl}/${dataSourceUsername}/${projectName}/raw/master/${fullPath}?_random=${Math.random()}`
  let { data: content = '' } = await axios.get(url)
  return content
}

export default {
  showRawForGuest
}
