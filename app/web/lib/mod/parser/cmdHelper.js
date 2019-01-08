const MOD_CMD_BEGIN_REG = /^```@[\w/]*$/
const MOD_CMD_END_REG = /^```$/
const MARKDOWN_CMD = 'Markdown'
const MOD_CMD_BEGIN = '```@'
const MOD_CMD_END = '```'
const MARKDOWN_CMD_END = '----'
const MOD_PARACRAFT = 'Paracraft'

const cmdList = [
  'Markdown',
  'IFrame',
  'Title',
  'MixPosition',
  'MixLayer',
  'Img',
  'Menu',
  'ImgLoop',
  'Paracraft',
  'QQ',
  'Text',
  'Board',
  'VipRead',
  'Comment',
  'TextBoard',
  'PageList',
  'Toc',
  'BigFile',
  'Tab',
  'Button',
  'PagePath',
  'CategoryList',
  'PageSwitching',
  'Lesson',
  'Quiz',
  'Hint',
  'Project'
]

const oldCmdMapper = {
  'paracraft': 'Paracraft',
  'wiki/js/world3D': 'Paracraft',
  'board/main': 'Board',
  'wiki/js/bigfile': 'BigFile'
}

const isNewCmd = (cmd) => {
  for (let key in cmdList) {
    if (cmdList[key].toLowerCase() === cmd.toLowerCase()) return true
  }
  return false
}

const isOldCmd = (cmd) => {
  if (cmd === MOD_PARACRAFT) {
    return false
  }

  for (let key in oldCmdMapper) {
    if (key === cmd) return true
  }
  return false
}

const isValidCmd = (cmd) => {
  return isOldCmd(cmd) || isNewCmd(cmd)
}

const isMarkdownCmd = (cmd) => {
  return cmd === MARKDOWN_CMD
}

const standardCmd = (cmd) => {
  for (let key in oldCmdMapper) {
    if (key === cmd) return key
  }
  for (let key in cmdList) {
    if (cmdList[key].toLowerCase() === cmd.toLowerCase()) return cmdList[key]
  }
  return ''
}

const targetCmd = (cmd) => {
  for (let key in oldCmdMapper) {
    if (key === cmd) return oldCmdMapper[key]
  }
  return ''
}

const isCmdLine = (line) => {
  if (line && line.match(MOD_CMD_BEGIN_REG)) {
    const cmd = line.split('@')[1]
    if (isValidCmd(cmd)) return true
  }
  return false
}

const parseCmd = (line) => {
  if (line && line.match(MOD_CMD_BEGIN_REG)) {
    const cmd = line.split('@')[1]
    if (isValidCmd(cmd)) return standardCmd(cmd)
  }
}

const isCmdEnd = (line) => {
  return line && line.match(MOD_CMD_END_REG)
}

module.exports = {
  isValidCmd,
  isOldCmd,
  isMarkdownCmd,
  targetCmd,
  isCmdLine,
  isCmdEnd,
  parseCmd,
  MOD_CMD_BEGIN_REG,
  MOD_CMD_END_REG,
  MARKDOWN_CMD,
  MOD_CMD_BEGIN,
  MOD_CMD_END,
  MARKDOWN_CMD_END,
  MOD_PARACRAFT,
}
