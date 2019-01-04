const yaml = require('js-yaml')

const mdToJson = (md) => {
  let result
  try {
    result = yaml.safeLoad(md)
  } catch (e) {
    console.error(e)
  }
  return result || {}
}

const jsonToMd = (json) => {
  return yaml.safeDump(json)
}

module.exports = {
  mdToJson,
  jsonToMd
}
