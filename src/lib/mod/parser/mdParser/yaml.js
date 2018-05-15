import yaml from 'js-yaml'

export const mdToJson = (md) => {
  let result
  try {
    result = yaml.safeLoad(md)
  } catch (e) {
    console.error(e)
  }
  return result || {}
}

export const jsonToMd = (json) => {
  return yaml.safeDump(json)
}

export default {
  mdToJson,
  jsonToMd
}
