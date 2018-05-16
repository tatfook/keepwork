const MOD_CMD_BEGIN_REG = /^```@[\w/]*$/
const MOD_CMD_END_REG = /^```$/

export const cmdList = [
  'Markdown',
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
  'Toc'
]

export const oldCmdMapper = {
  'paracraft': 'Paracraft',
  'board/main': 'Board'
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
  targetCmd,
  isCmdLine,
  isCmdEnd
}
