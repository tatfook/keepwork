export const MOD_CMD_BEGIN_REG = /^```@[\w/]*$/
export const MOD_CMD_END_REG = /^```$/
export const MARKDOWN_CMD = 'Markdown'
export const MOD_CMD_BEGIN = '```@'
export const MOD_CMD_END = '```'

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
  'BigFile'
]

export const oldCmdMapper = {
  'paracraft': 'Paracraft',
  'wiki/js/world3D': 'Paracraft',
  'board/main': 'Board',
  'wiki/js/bigfile': 'BigFile'
}

export const isValidCmd = (cmd) => {
  return cmdList.includes(cmd) || !!oldCmdMapper[cmd]
}

export const isNewCmd = (cmd) => {
  return cmdList.includes(cmd)
}

export const isOldCmd = (cmd) => {
  return !!oldCmdMapper[cmd]
}

export const isMarkdownCmd = (cmd) => {
  return cmd === MARKDOWN_CMD
}

export const targetCmd = (cmd) => {
  return oldCmdMapper[cmd]
}

export const isCmdLine = (line) => {
  if (line.match(MOD_CMD_BEGIN_REG)) {
    const cmd = line.split('@')[1]
    if (isValidCmd(cmd)) return true
  }
  return false
}

export const isCmdEnd = (line) => {
  return line.match(MOD_CMD_END_REG)
}

export default {
  isValidCmd,
  isOldCmd,
  isMarkdownCmd,
  targetCmd,
  isCmdLine,
  isCmdEnd
}
