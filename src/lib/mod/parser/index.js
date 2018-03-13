import _ from 'lodash'
import ModBlock from './block'

const MOD_CMD_BEGIN_REG = /^```@\w*$/
const MOD_CMD_END_REG = /^```$/

const buildBlockList = mdText => {
  let mdLines = mdText.trim().split('\n')
  let blockList = []
  let curModBlock = null
  _.forEach(mdLines, (line, lineNumber) => {
    if (curModBlock) {
      if (line.match(MOD_CMD_END_REG)) {
        curModBlock.buildJson()
        blockList.push(curModBlock)
        curModBlock = null
      } else {
        curModBlock.addLine(line)
      }
    } else if (line.trim() !== '') {
      let cmd
      if (line.match(MOD_CMD_BEGIN_REG)) {
        cmd = line.split('@')[1]
      }
      curModBlock = new ModBlock(cmd, lineNumber)
      if (!cmd) curModBlock.addLine(line)
    }
  })

  if (curModBlock) {
    curModBlock.buildJson()
    blockList.push(curModBlock)
    curModBlock = null
  }

  return blockList
}

const updateBlocksBeginLine = (blockList, beginIndex, lengthDiff) => {
  if (lengthDiff !== 0) {
    for (let i = beginIndex; i < blockList.length; i++) {
      blockList[i].modifyBegin(lengthDiff)
    }
  }
}

const updateBlock = (blockList, blockIndex, jsonData) => {
  let block = blockList[blockIndex]
  block.updateJson(jsonData)
  updateBlocksBeginLine(blockList, blockIndex + 1, block.lengthDiff)

  return block
}

const deleteBlock = (blockList, blockIndex) => {
  let block = blockList[blockIndex]
  updateBlocksBeginLine(blockList, blockIndex + 1, -block.textLength())
  blockList.splice(blockIndex, 1)

  return block
}

const addBlockByIndex = (blockList, index, jsonData, cmd) => {
  let nextBlock = blockList[index]
  let beginLine = nextBlock ? nextBlock.beginLine : 0
  let block = new ModBlock(cmd, beginLine)
  block.updateJson(jsonData)
  blockList.splice(index, 0, block)
  updateBlocksBeginLine(blockList, index + 1, -block.textLength())

  return block
}

const addBlockByKey = (blockList, key, jsonData, cmd) => {
  let index = -1
  if (key) index = blockList.map(el => el.key).indexOf(key)
  return addBlockByIndex(blockList, index + 1, jsonData, cmd)
}

const buildMarkdown = blockList => {
  let lines = []
  _.forEach(blockList, block => {
    lines.push(block.lines())
    lines.push('')
  })
  return _.flatten(lines).join('\n')
}

const buildJsonData = blockList => {
  let modList = []
  _.forEach(blockList, block => {
    modList.push(block.jsonData)
  })
  return modList
}

const getCmd = modName => {
  return modName.slice(3, modName.length)
}

export default {
  buildBlockList,
  buildMarkdown,
  buildJsonData,
  updateBlock,
  deleteBlock,
  addBlockByIndex,
  addBlockByKey,
  getCmd
}
