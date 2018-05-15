import _ from 'lodash'
import ModBlock from './block'
import BlockHelper from './blockHelper'
import { gConst } from '@/lib/global'

const MOD_CMD_BEGIN_REG = /^```@\w*$/
const MOD_CMD_END_REG = /^```$/

const beginModBlock = (line, lineNumber) => {
  let cmd
  if (line.match(MOD_CMD_BEGIN_REG)) {
    cmd = line.split('@')[1]
  }
  let curModBlock = new ModBlock(cmd, lineNumber)
  if (!cmd) BlockHelper.addLine(curModBlock, line)

  return curModBlock
}

const endModBlock = (blockList, curModBlock) => {
  BlockHelper.buildJson(curModBlock)
  BlockHelper.buildKey(curModBlock)
  blockList.push(_.cloneDeep(curModBlock))
}

const buildBlockList = mdText => {
  if (!mdText) return []
  let mdLines = mdText.trim().split('\n')
  let blockList = []
  let curModBlock = null
  _.forEach(mdLines, (line, lineNumber) => {
    if (curModBlock) {
      if (
        line.match(MOD_CMD_END_REG) &&
        !BlockHelper.isMarkdownMod(curModBlock)
      ) {
        endModBlock(blockList, curModBlock)
        curModBlock = null
      } else if (line.match(MOD_CMD_BEGIN_REG)) {
        endModBlock(blockList, curModBlock)
        curModBlock = beginModBlock(line, lineNumber + 1)
      } else {
        BlockHelper.addLine(curModBlock, line)
      }
    } else if (line.trim() !== '') {
      curModBlock = beginModBlock(line, lineNumber + 1)
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
          BlockHelper.modifyBegin(block, newBlock.lineBegin - block.lineBegin)
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
      BlockHelper.modifyBegin(blockList[i], lengthDiff)
    }
  }
}

const getBlockLines = (mdText, block) => {
  let mdLines = mdText.trim().split('\n')
  let blockLines = []
  for (let i = BlockHelper.contentBegin(block) - 1; i < mdLines.length; i++) {
    if (
      (mdLines[i].match(MOD_CMD_END_REG) &&
        !BlockHelper.isMarkdownMod(block)) ||
      mdLines[i].match(MOD_CMD_BEGIN_REG)
    ) {
      break
    }
    blockLines.push(mdLines[i])
  }
  return blockLines
}

const updateBlock = (blockList, key, mdText) => {
  let blockIndex = blockList.map(el => el.key).indexOf(key)
  if (blockIndex === -1) return
  let block = blockList[blockIndex]
  let blockLines = getBlockLines(mdText, block)

  BlockHelper.updateMarkdown(block, blockLines)
  updateBlocksBeginLine(blockList, blockIndex + 1, block.lengthDiff)

  return block
}

const updateBlockAttribute = (blockList, blockKey, key, value) => {
  let blockIndex = blockList.map(el => el.key).indexOf(blockKey)
  if (blockIndex === -1) return
  let block = blockList[blockIndex]
  BlockHelper.updateJsonValue(block, key, value)
  return block
}

const deleteBlock = (blockList, key) => {
  let blockIndex = blockList.map(el => el.key).indexOf(key)
  let block = blockList[blockIndex]
  updateBlocksBeginLine(
    blockList,
    blockIndex + 1,
    -1 - BlockHelper.textLength(block)
  )
  blockList.splice(blockIndex, 1)

  return block
}

const moveBlock = (blockList, oldIndex, newIndex) => {
  let block = _.cloneDeep(blockList[oldIndex])

  if (!block || oldIndex === newIndex) return

  // step 1 move block to the new index

  if (oldIndex > newIndex) {
    blockList.splice(newIndex, 0, block)
    blockList.splice(oldIndex + 1, 1)
  } else {
    blockList.splice(newIndex + 1, 0, block)
    blockList.splice(oldIndex, 1)
  }

  // step 2 recount block line number

  let tempIndex = oldIndex
  let endIndex = newIndex

  if (oldIndex > newIndex) {
    tempIndex = newIndex
    endIndex = oldIndex
  }

  while (tempIndex <= endIndex) {
    let curBlock = blockList[tempIndex]
    let preBlock = blockList[tempIndex - 1]
    let position = preBlock ? BlockHelper.endLine(preBlock) + 1 : 1
    BlockHelper.modifyBegin(curBlock, position - curBlock.lineBegin)
    tempIndex++
  }
}

const addBlockAfterIndex = (blockList, index, jsonData, cmd) => {
  let preBlock = blockList[index]
  let beginLine = 1
  if (preBlock) {
    beginLine = BlockHelper.endLine(preBlock)
    // just for beautify, see also in buildMarkdown function(line 196)
    if (!BlockHelper.isMarkdownMod(preBlock)) beginLine += 1
  }
  let block = new ModBlock(cmd, beginLine)
  BlockHelper.updateJson(block, jsonData)
  blockList.splice(index + 1, 0, block)
  updateBlocksBeginLine(blockList, index + 2, BlockHelper.textLength(block) + 1)

  return block
}

const addBlockByKey = (blockList, key, jsonData, cmd, position) => {
  let index = -1
  if (key) index = blockList.map(el => el.key).indexOf(key)
  if (position === gConst.POSITION_BEFORE) index = index - 1
  return addBlockAfterIndex(blockList, index, jsonData, cmd)
}

const buildMarkdown = blockList => {
  let lines = []
  _.forEach(blockList, block => {
    lines.push(BlockHelper.lines(block))
    if (!BlockHelper.isMarkdownMod(block)) lines.push('')
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
    if (BlockHelper.isOnEdit(blockList[i], beginLine)) {
      return blockList[i]
    }
  }
}

const willAffectModData = (block, mdLines) => {
  for (let i = 0; i < mdLines.length; i++) {
    let line = mdLines[i]
    if (
      (line.match(MOD_CMD_END_REG) && !BlockHelper.isMarkdownMod(block)) ||
      line.match(MOD_CMD_BEGIN_REG)
    ) {
      return true
    }
  }
  return false
}

const addBlockToMarkdown = (code, position = 0, modName, styleID) => {
  let mdLines = code.trim().split('\n')
  let cmdCode = '```@' + getCmd(modName) + '\n'
  // TODO: hard code here
  cmdCode += '- styleID : ' + styleID + '\n'
  cmdCode += '```\n'
  mdLines.splice(position + 1, 0, cmdCode)
  return mdLines.join('\n')
}

export default {
  buildBlockList,
  buildMarkdown,
  buildJsonData,
  updateBlockList,
  updateBlock,
  updateBlockAttribute,
  deleteBlock,
  moveBlock,
  addBlockAfterIndex,
  addBlockByKey,
  getCmd,
  getActiveBlock,
  willAffectModData,
  addBlockToMarkdown
}
