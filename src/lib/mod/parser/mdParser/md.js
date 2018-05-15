const escapeChar = '@'
const escapeCharList = '@`-+#'

const mdEscape = text => {
  if (typeof text !== 'string') return text

  text = text || ''
  let lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    if (escapeCharList.indexOf(line[0]) >= 0) {
      lines[i] = escapeChar + line
    }
  }

  return lines.join('\n')
}

const mdUnescape = text => {
  text = text || ''

  let lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    if (line[0] === escapeChar && escapeCharList.indexOf(line[1]) >= 0) {
      lines[i] = line.substring(1)
    }
  }

  return lines.join('\n')
}

// md 转json对象
export const mdToJson = text => {
  if (typeof text !== 'string') return text

  text = mdUnescape(text)

  var tempLines = text.trim().split('\n')
  let lines = []
  let conf = {}
  let curConf = conf

  let getObj = function(key) {
    if (!key) {
      return conf
    }
    let keys = key.split('.')
    let tmpConf = conf
    for (let i = 0; i < keys.length; i++) {
      tmpConf[keys[i]] = tmpConf[keys[i]] || {}

      if (keys[i].match(/\d+/)) {
        let tmp = parseInt(keys[i])
        tmpConf.length = tmpConf.length || -1
        if (tmpConf.length <= tmp) {
          tmpConf.length = tmp + 1
        }
      }
      tmpConf = tmpConf[keys[i]]
    }

    return tmpConf
  }

  let confConvert = function(c) {
    if (typeof c !== 'object') return c

    let nc = c.length ? [] : {}

    if (c.length) {
      for (let i = 0; i < c.length; i++) {
        nc.push(confConvert(c[i + '']))
      }
    } else {
      for (let key in c) {
        nc[key] = confConvert(c[key])
      }
    }

    return nc
  }

  let _mdToJson = function(line) {
    let temp = line.match(/^([-+#]) (.*)/)
    if (!temp) return
    let flag = temp[1]
    let content = line.substring(flag.length + 1).trim()
    let key, value

    if (flag === '#') {
      curConf = getObj(content)
    }

    if (flag === '+' || flag === '-') {
      temp = content.indexOf(':')

      if (temp > 0) {
        key = content.substring(0, temp).trim()
        value = content.substring(temp + 1).trim()

        if (value === 'true') {
          value = true
        } else if (value === 'false') {
          value = false
        }

        curConf[key] = value
      }
    }
  }

  let isComment = false
  let line = ''
  for (let i = 0; i < tempLines.length; i++) {
    if (tempLines[i].match(/^<!--.*-->\s*$/)) {
      continue
    }
    if (tempLines[i].match(/^<!--/)) {
      isComment = true
      continue
    }
    if (isComment) {
      if (tempLines[i].match(/-->\s*$/)) {
        isComment = false
      }
      continue
    }
    if (!tempLines[i].match(/^[-+#] .*/)) {
      line += '\n' + tempLines[i]
      continue
    }
    if (line) {
      lines.push(line)
    }
    line = tempLines[i]
  }

  if (line) {
    lines.push(line)
  }

  if (lines.length === 0) {
    return ''
  } else if (lines.length === 1 && !lines[0].match(/^[-+#] .*/)) {
    return lines[0]
  } else {
    for (let i = 0; i < lines.length; i++) {
      _mdToJson(lines[i])
    }
  }

  return confConvert(conf)
}

// json对象转markdown文本
export const jsonToMd = obj => {
  let text = ''
  let value

  // 非对象直接写入
  if (typeof obj !== 'object') {
    text += obj + '\n'
    return text
  }

  let _jsonToMd = function(obj, keyPrefix) {
    keyPrefix = keyPrefix ? keyPrefix + '.' : ''
    if (obj.length === undefined) {
      // 单对象对应列表
      for (let key in obj) {
        // 优先写非对象值
        value = obj[key]
        if (
          value === null ||
          value === undefined ||
          key.indexOf('$') === 0 ||
          typeof value === 'object'
        ) {
          continue
        }
        text += '- ' + key + ' : ' + mdEscape(value) + '\n'
      }
      for (let key in obj) {
        // 写对象值
        value = obj[key]
        if (
          value === null ||
          key.indexOf('$') === 0 ||
          typeof value !== 'object'
        ) {
          continue
        }

        text += '\n# ' + keyPrefix + key + '\n'
        _jsonToMd(value, keyPrefix + key)
      }
    } else {
      for (let i = 0; i < obj.length; i++) {
        value = obj[i]
        if (typeof value !== 'object') {
          text += '- ' + obj[i] + '\n'
          continue
        }

        text += '\n# ' + keyPrefix + i + '\n'
        _jsonToMd(value, keyPrefix + i)
      }
    }
  }

  _jsonToMd(obj)
  return text
}

export default {
  jsonToMd,
  mdToJson
}
