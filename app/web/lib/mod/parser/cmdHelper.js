export const MOD_CMD_BEGIN_REG = /^```@[\w/]*$/
export const MOD_CMD_END_REG = /^```$/
export const MARKDOWN_CMD = 'Markdown'
export const MOD_CMD_BEGIN = '```@'
export const MOD_CMD_END = '```'
export const MARKDOWN_CMD_END = '----'
export const MOD_PARACRAFT = 'Paracraft'

export const cmdList = [
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

export const oldCmdMapper = {
  'paracraft': 'Paracraft',
  'wiki/js/world3D': 'Paracraft',
  'board/main': 'Board',
  'wiki/js/bigfile': 'BigFile'
}

export const isNewCmd = (cmd) => {
  for (let key in cmdList) {
    if (cmdList[key].toLowerCase() === cmd.toLowerCase()) return true
  }
  return false
}

export const isOldCmd = (cmd) => {
  if (cmd === MOD_PARACRAFT) {
    return false
  }

  for (let key in oldCmdMapper) {
    if (key === cmd) return true
  }
  return false
}

export const isValidCmd = (cmd) => {
  return isOldCmd(cmd) || isNewCmd(cmd)
}

export const isMarkdownCmd = (cmd) => {
  return cmd === MARKDOWN_CMD
}

export const standardCmd = (cmd) => {
  for (let key in oldCmdMapper) {
    if (key === cmd) return key
  }
  for (let key in cmdList) {
    if (cmdList[key].toLowerCase() === cmd.toLowerCase()) return cmdList[key]
  }
  return ''
}

export const targetCmd = (cmd) => {
  for (let key in oldCmdMapper) {
    if (key === cmd) return oldCmdMapper[key]
  }
  return ''
}

export const isCmdLine = (line) => {
  if (line && line.match(MOD_CMD_BEGIN_REG)) {
    const cmd = line.split('@')[1]
    if (isValidCmd(cmd)) return true
  }
  return false
}

export const parseCmd = (line) => {
  if (line && line.match(MOD_CMD_BEGIN_REG)) {
    const cmd = line.split('@')[1]
    if (isValidCmd(cmd)) return standardCmd(cmd)
  }
}

export const isCmdEnd = (line) => {
  return line && line.match(MOD_CMD_END_REG)
}

export default {
  isValidCmd,
  isOldCmd,
  isMarkdownCmd,
  targetCmd,
  isCmdLine,
  isCmdEnd,
  parseCmd
}
