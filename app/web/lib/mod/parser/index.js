const _ = require('lodash')
const ModBlock = require('./block')
const BlockHelper = require('./blockHelper')
const CmdHelper = require('./cmdHelper')
const {
  gConst
} = require('../../global')

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
  let preModBlock = null
  const beginModBlock = (line, lineNumber) => {
    let cmd = CmdHelper.parseCmd(line)
    if (!cmd) {
      let mdBegin = preModBlock ? BlockHelper.endLine(preModBlock) + 1 : 1
      curModBlock = new ModBlock(cmd, mdBegin)
      // keep the blank lines for markdown mod
      for (let i = mdBegin; i < lineNumber; i++) {
        BlockHelper.addLine(curModBlock, mdLines[i - 1])
      }

      BlockHelper.addLine(curModBlock, line)
    } else {
      // dismiss all blank lines between two general mods
      curModBlock = new ModBlock(cmd, lineNumber)
    }
  }
  const endModBlock = () => {
    BlockHelper.buildJson(curModBlock)
    BlockHelper.buildKey(curModBlock)
    blockList.push(_.cloneDeep(curModBlock))
    preModBlock = curModBlock
    curModBlock = null
  }
  _.forEach(mdLines, (line, lineNumber) => {
    if (curModBlock) {
      if (
        CmdHelper.isCmdEnd(line) &&
        !BlockHelper.isMarkdownMod(curModBlock)
      ) { // markdown mod will ignore the cmd end
        endModBlock()
      } else if (CmdHelper.isCmdLine(line)) {
        endModBlock()
        beginModBlock(line, lineNumber + 1)
      } else {
        BlockHelper.addLine(curModBlock, line)
      }
    } else if (line.trim() !== '') {
      beginModBlock(line, lineNumber + 1)
    }
  })

  if (curModBlock) endModBlock()
  return blockList
}

const updateBlockList = (blockList, newBlockList) => {
  if (newBlockList.length === 0) {
    blockList.splice(0, blockList.length)
    return
  }

  const matchWithModKey = (newBlock, begin) => {
    for (let index = begin; index < blockList.length; index++) {
      if (blockList[index].modKey === newBlock.modKey) return index
    }
    return -1
  }

  const matchWithModType = (newBlock, begin) => {
    for (let index = begin; index < blockList.length; index++) {
      if (blockList[index].modType === newBlock.modType) return index
    }
    return -1
  }

  let unmatchList = []
  // insert new blocks and store the unmatch blocks
  for (let index = 0; index < newBlockList.length; index++) {
    let newBlock = newBlockList[index]
    let matchedIndex = matchWithModKey(newBlock, index)
    if (matchedIndex !== -1) {
      let block = blockList[matchedIndex]
      BlockHelper.modifyBegin(block, newBlock.lineBegin - block.lineBegin)

      // rearrange if the index doesn't match
      if (matchedIndex !== index) {
        blockList.splice(matchedIndex, 1)
        blockList.splice(index, 0, block)
      }
    } else {
      let unmatchBlock = _.cloneDeep(newBlock)
      blockList.splice(index, 0, unmatchBlock)
      unmatchList.push(unmatchBlock)
    }
  }

  // replace the unmatch mods' uuid with the old unmatched uuids
  for (let index = 0; index < unmatchList.length; index++) {
    let unmatchBlock = unmatchList[index]
    let matchedIndex = matchWithModType(unmatchBlock, newBlockList.length)
    if (matchedIndex !== -1) {
      BlockHelper.updateUUID(unmatchBlock, blockList[matchedIndex].uuid)
      blockList.splice(matchedIndex, 1)
    }
  }

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
    let line = mdLines[i]
    if (
      (CmdHelper.isCmdEnd(line) && !BlockHelper.isMarkdownMod(block)) ||
      CmdHelper.isCmdLine(line)
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

let deleteBlock

const tryToMergeBlock = (blockList, index) => {
  let block = blockList[index]
  let nextBlock = blockList[index + 1]

  if (!BlockHelper.isMarkdownMod(block) || !BlockHelper.isMarkdownMod(nextBlock)) return

  BlockHelper.updateMarkdown(block, _.concat([], block.md, nextBlock.md))
  deleteBlock(blockList, nextBlock.key)
  updateBlocksBeginLine(blockList, index + 1, block.lengthDiff)
}

deleteBlock = (blockList, key) => {
  let blockIndex = blockList.map(el => el.key).indexOf(key)
  let block = blockList[blockIndex]
  updateBlocksBeginLine(
    blockList,
    blockIndex + 1, -1 - BlockHelper.textLength(block)
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
    let position = preBlock ? BlockHelper.endLine(preBlock) + 2 : 1
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
    if (!BlockHelper.isMarkdownMod(preBlock)) beginLine += 2
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

const getBlockByCursorLine = (blockList, beginLine) => {
  if (beginLine === 0) return false
  return blockList.find(mod => {
    return BlockHelper.isOnCursor(mod, beginLine)
  })
}

const addBlockToMarkdown = (code, position = 0, modName, content) => {
  if (CmdHelper.isMarkdownCmd(getCmd(modName))) return code

  let mdLines = code.split('\n')
  let cmdCode = '```@' + getCmd(modName) + '\n'
  if (content) cmdCode += content
  cmdCode += '\n```\n'
  mdLines.splice(position, 0, cmdCode)
  return mdLines.join('\n')
}

const addBlockToMarkdownWithoutHeadAndTail = (code, position = 0, modName, content) => {
  if (CmdHelper.isMarkdownCmd(getCmd(modName))) return code

  let mdLines = code.split('\n')
  mdLines.splice(position, 0, content)
  return mdLines.join('\n')
}

module.exports = {
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
  addBlockToMarkdownWithoutHeadAndTail,
  getCmd,
  getActiveBlock,
  getBlockByCursorLine
}
