const _ = require('lodash')
const modSearchableConfig = require('./_searchableConfig')
const { buildBlockList } = require('../index')

const trimContent = content => {
  return _.trim(content, '\n')
}

const getBlockAttrContent = ({ blockItem, config }) => {
  let content = ''
  for (let i = 0; i < config.length; i++) {
    let configItem = config[i]
    content += _.get(
      blockItem,
      `data.${configItem.attr}.${configItem.value}`,
      ''
    )
    content = trimContent(content)
    if (content !== '') {
      content += '\n'
    }
  }
  return content
}

const getBlockContent = blockItem => {
  let content = ''
  let cmd = blockItem.cmd
  let config = modSearchableConfig[cmd]
  if (config && config.length > 0) {
    content += getBlockAttrContent({ blockItem, config })
  }
  return content
}

const getSearchableContent = md => {
  let content = ''
  let blockList = buildBlockList(md)
  for (let i = 0; i < blockList.length; i++) {
    const blockItem = blockList[i]
    content += getBlockContent(blockItem)
  }
  return content
}

module.exports = { getSearchableContent }
