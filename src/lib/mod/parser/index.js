import _ from 'lodash'
import ModBlock from './block'

const MOD_CMD_BEGIN_REG = /^```@\w*$/
const MOD_CMD_END_REG = /^```$/

const beginModBlock = (line, lineNumber) => {
  let cmd
  if (line.match(MOD_CMD_BEGIN_REG)) {
    cmd = line.split('@')[1]
  }
  let curModBlock = new ModBlock(cmd, lineNumber)
  if (!cmd) curModBlock.addLine(line)

  return curModBlock
}

const endModBlock = (blockList, curModBlock) => {
  curModBlock.buildJson()
  curModBlock.buildKey()
  blockList.push(_.cloneDeep(curModBlock))
}

const buildBlockList = mdText => {
  let mdLines = mdText.trim().split('\n')
  let blockList = []
  let curModBlock = null
  _.forEach(mdLines, (line, lineNumber) => {
    if (curModBlock) {
      if (line.match(MOD_CMD_END_REG) && !curModBlock.isMarkdownMod()) {
        endModBlock(blockList, curModBlock)
        curModBlock = null
      } else if (line.match(MOD_CMD_BEGIN_REG)) {
        endModBlock(blockList, curModBlock)
        curModBlock = beginModBlock(line, lineNumber)
      } else {
        curModBlock.addLine(line)
      }
    } else if (line.trim() !== '') {
      curModBlock = beginModBlock(line, lineNumber)
    }
  })

  if (curModBlock) endModBlock(blockList, curModBlock)
  return blockList
}

const updateBlockList = (blockList, newBlockList) => {
  if (newBlockList.length === 0) {
    blockList.splice(0, blockList.length)
    return
  }
  _.forEach(newBlockList, (newBlock, index) => {
    let block = blockList[index]
    if (!block) {
      // if block doesn't exist, just insert the new one
      blockList.splice(index, 0, _.cloneDeep(newBlock))
    } else if (block.key !== newBlock.key) {
      if (block.modType === newBlock.modType) {
        if (block.modKey === newBlock.modKey) {
          // if block data wasn't changed, update the lineBegin value
          block.modifyBegin(newBlock.lineBegin - block.lineBegin)
        } else {
          // if block data was changed, remove and replace with the new one
          blockList.splice(index, 1, _.cloneDeep(newBlock))
        }
      } else {
        blockList.splice(index, 0, _.cloneDeep(newBlock))
      }
    }
  })

  blockList.splice(newBlockList.length, blockList.length - newBlockList.length)
}

const updateBlocksBeginLine = (blockList, beginIndex, lengthDiff) => {
  if (lengthDiff !== 0) {
    for (let i = beginIndex; i < blockList.length; i++) {
      blockList[i].modifyBegin(lengthDiff)
    }
  }
}

const getBlockLines = (mdText, block) => {
  let mdLines = mdText.trim().split('\n')
  let blockLines = []

  for (let i = block.contentBegin(); i < mdLines.length; i++) {
    if (
      (mdLines[i].match(MOD_CMD_END_REG) && !block.isMarkdownMod()) ||
      mdLines[i].match(MOD_CMD_BEGIN_REG)
    ) {
      break
    }
    blockLines.push(mdLines[i])
  }
  return blockLines
}

const updateBlock = (blockList, block, mdText) => {
  let blockIndex = blockList.map(el => el.key).indexOf(block.key)
  let blockLines = getBlockLines(mdText, block)

  block.updateMarkdown(blockLines)
  updateBlocksBeginLine(blockList, blockIndex + 1, block.lengthDiff)

  return block
}

const updateBlockAttribute = (block, key, value) => {
  block.updateJsonValue(key, value)
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

const getActiveBlock = (blockList, beginLine) => {
  for (let i = 0; i < blockList.length; i++) {
    if (blockList[i].isOnEdit(beginLine)) {
      return blockList[i]
    }
  }
}

const isModMarkdown = (block, mdLines) => {
  for (let i = 0; i < mdLines.length; i++) {
    let line = mdLines[i]
    if (
      (line.match(MOD_CMD_END_REG) && !block.isMarkdownMod()) ||
      line.match(MOD_CMD_BEGIN_REG)
    ) {
      return false
    }
  }
  return true
}

export default {
  buildBlockList,
  buildMarkdown,
  buildJsonData,
  updateBlockList,
  updateBlock,
  updateBlockAttribute,
  deleteBlock,
  addBlockByIndex,
  addBlockByKey,
  getCmd,
  getActiveBlock,
  isModMarkdown
}
