import _ from 'lodash'
import ModBlock from './block'
import BlockHelper from './blockHelper'
import CmdHelper from './cmdHelper'
import { gConst } from '@/lib/global'

const beginModBlock = (line, lineNumber) => {
  let cmd
  if (CmdHelper.isCmdLine(line)) {
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

const buildBlock = (cmd, jsonData, beginLine) => {
  let block = new ModBlock(cmd, beginLine || 1)
  if (jsonData) BlockHelper.updateJson(block, jsonData)
  return block
}

const buildBlockList = mdText => {
  if (!mdText) return []
  let mdLines = mdText.split('\n')
  let blockList = []
  let curModBlock = null
  _.forEach(mdLines, (line, lineNumber) => {
    if (curModBlock) {
      if (
        CmdHelper.isCmdEnd(line) &&
        !BlockHelper.isMarkdownMod(curModBlock)
      ) { // markdown mod will ignore the cmd end
        endModBlock(blockList, curModBlock)
        curModBlock = null
      } else if (CmdHelper.isCmdLine(line)) {
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
          // if block data wasn't changed, keep the old mod and old uuid, just update the lineBegin value
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
  return blockList
}

const updateBlocksBeginLine = (blockList, beginIndex, lengthDiff) => {
  if (lengthDiff !== 0) {
    for (let i = beginIndex; i < blockList.length; i++) {
      BlockHelper.modifyBegin(blockList[i], lengthDiff)
    }
  }
}

const getBlockLines = (mdText, block) => {
  let mdLines = mdText.split('\n')
  let blockLines = []
  for (let i = BlockHelper.contentBegin(block) - 1; i < mdLines.length; i++) {
    if (
      (CmdHelper.isCmdEnd(mdLines[i]) &&
        !BlockHelper.isMarkdownMod(block)) ||
        CmdHelper.isCmdLine(mdLines[i])
    ) {
      break
    }
    blockLines.push(mdLines[i])
  }
  return blockLines
}

// make sure to check this func before update block code
// ONLY update block code if the changed lines are safe(no insert and no delete)
const willAffectModData = (block, mdLines) => {
  for (let i = 0; i < mdLines.length; i++) {
    if (
      (CmdHelper.isCmdEnd(mdLines[i]) &&
        !BlockHelper.isMarkdownMod(block)) ||
        CmdHelper.isCmdLine(mdLines[i])
    ) {
      return true
    }
  }
  return false
}

const updateBlockCode = (blockList, key, mdText) => {
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
  updateBlocksBeginLine(blockList, blockIndex + 1, block.lengthDiff)
  return block
}

const tryToMergeBlock = (blockList, index) => {
  let block = blockList[index]
  let nextBlock = blockList[index + 1]

  if (!BlockHelper.isMarkdownMod(block) || !BlockHelper.isMarkdownMod(nextBlock)) return

  BlockHelper.updateMarkdown(block, _.concat([], block.md, nextBlock.md))
  deleteBlock(blockList, nextBlock.key)
  updateBlocksBeginLine(blockList, index + 1, block.lengthDiff)
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
  if (!BlockHelper.isMarkdownMod(block)) tryToMergeBlock(blockList, blockIndex - 1)
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

  // step 3 try to merge mods
  tryToMergeBlock(blockList, newIndex)
  tryToMergeBlock(blockList, newIndex - 1)
  tryToMergeBlock(blockList, oldIndex)
  tryToMergeBlock(blockList, oldIndex - 1)
}

const addBlockAfterIndex = (blockList, index, newBlock) => {
  let preBlock = blockList[index]
  let beginLine = 1
  if (preBlock) {
    beginLine = BlockHelper.endLine(preBlock)
    // just for beautify, see also in buildMarkdown function
    if (!BlockHelper.isMarkdownMod(preBlock)) beginLine += 1
  }
  BlockHelper.modifyBegin(newBlock, beginLine - newBlock.lineBegin)
  blockList.splice(index + 1, 0, newBlock)
  updateBlocksBeginLine(blockList, index + 2, BlockHelper.textLength(newBlock) + 1)

  if (BlockHelper.isMarkdownMod(newBlock)) {
    tryToMergeBlock(blockList, index)
    tryToMergeBlock(blockList, index + 1)
  }
  return newBlock
}

const addBlockByKey = (blockList, key, newBlock, position) => {
  let index = -1
  if (key) index = blockList.map(el => el.key).indexOf(key)
  if (position === gConst.POSITION_BEFORE) index = index - 1
  return addBlockAfterIndex(blockList, index, newBlock)
}

const buildMarkdown = blockList => {
  let lines = []
  _.forEach(blockList, block => {
    while (block.lineBegin > lines.length + 1) lines.push('') // keep the empty lines
    lines = _.concat(lines, BlockHelper.lines(block))
  })
  return _.flatten(lines).join('\n')
}

const getCmd = modName => {
  let cmd = modName.slice(3, modName.length)
  return CmdHelper.isValidCmd(cmd) ? cmd : ''
}

const getActiveBlock = (blockList, beginLine) => {
  for (let i = 0; i < blockList.length; i++) {
    if (BlockHelper.isOnEdit(blockList[i], beginLine)) {
      return blockList[i]
    }
  }
}

const addBlockToMarkdown = (code, position = 0, modName, styleID) => {
  if (CmdHelper.isMarkdownCmd(getCmd(modName))) return code

  let mdLines = code.split('\n')
  let cmdCode = '```@' + getCmd(modName) + '\n'
  if (styleID) cmdCode += 'styleID: ' + styleID
  cmdCode += '\n```\n'
  mdLines.splice(position + 1, 0, cmdCode)
  return mdLines.join('\n')
}

export default {
  buildBlock,
  buildBlockList,
  buildMarkdown,
  updateBlockList,
  willAffectModData,
  updateBlockCode,
  updateBlockAttribute,
  deleteBlock,
  moveBlock,
  addBlockAfterIndex,
  addBlockByKey,
  addBlockToMarkdown,
  getCmd,
  getActiveBlock
}
