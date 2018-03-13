const escapeCh = '@'
// let specialStr = '`*_{}[]()#+-.!>\\' + '\'"<>&'; // 覆盖html禁止字符
const specialStr = '~`*_{}[]()#+-.!<>\\' // 覆盖html禁止字符

// markdown 特殊字符转义
function mdSpecialCharEscape(text) {
  let newText = ''
  for (let i = 0; i < text.length; i++) {
    let ch = text[i]
    let nextch = text[i + 1]
    if (ch === escapeCh) {
      newText += escapeCh + escapeCh
      continue
    }
    if (ch === '\\' && nextch && specialStr.indexOf(nextch) >= 0) {
      newText += nextch
      i++
      continue
    }
    if (specialStr.indexOf(ch) >= 0) {
      newText += escapeCh + ch
      continue
    }
    newText += ch
  }

  return newText
}

function mdSpecialCharUnescape(text) {
  let newText = ''
  for (let i = 0; i < text.length; i++) {
    let ch = text[i]
    let nextch = text[i + 1]
    if (ch === escapeCh && nextch === escapeCh) {
      newText += escapeCh
      i++
      continue
    }
    if (ch === escapeCh && nextch && specialStr.indexOf(nextch) >= 0) {
      newText += nextch
      i++
      continue
    }
    newText += ch
  }
  return newText
}

// 是否是空行
function isEmptyLine(line) {
  if (line.trim() === '') {
    return true
  }
  return false
}

// 是否是水平线
function isHr(line) {
  // if (line.match(/^-{3,}[-\s]*$/) || line.match(/^\*{3,}[\*\s]*$/)) {
  // return true;
  // }

  let lineTrim = line.trim()
  if (lineTrim === '@*@*@*' && line.indexOf('@*@*@*') === 0) {
    return true
  }
  if (lineTrim === '@-@-@-' && line.indexOf('@-@-@-') === 0) {
    return true
  }

  return false
}

// 是否是列表
function isList(line) {
  // if (line.indexOf("* ") === 0 ||
  // line.indexOf("- ") === 0 ||
  // line.indexOf("+ ") === 0 ||
  // line.match(/^\d+\./)) {
  // return true;
  // }

  if (
    line.indexOf('@* ') === 0 ||
    line.indexOf('@- ') === 0 ||
    line.indexOf('@+ ') === 0 ||
    line.match(/^\d+\. /)
  ) {
    return true
  }
  return false
}

// 是否是引用
function isBlockquote(line) {
  // if (line.indexOf(">") === 0) {
  // return true;
  // }
  if (line.indexOf('@>') === 0) {
    return true
  }
  return false
}

// 是否是标题
function isHeader(line) {
  // if (line.match(/^#{1,6} /)) {
  // return true;
  // }
  if (line.match(/^(@#){1,6} /)) {
    return true
  }
  return false
}

function link(obj) {
  let text = obj.text
  let regStr = /@\[(.*?)@\]@\((.*?)@\)/
  let regs = text.match(regStr)

  if (!regs) {
    return text
  }

  let matchStr = regs[0]
  let linkText = regs[1]
  let linkHref = regs[2]
  let linkStr = '<a href="' + linkHref + '">' + linkText + '</a>'
  if (linkHref.indexOf('http://') === 0 || linkHref.indexOf('https://') === 0) {
    linkStr = '<a target="_blank" href="' + linkHref + '">' + linkText + '</a>'
  }
  let linkRender = obj.md.ruleRender['a']
  if (linkRender) {
    linkStr =
      linkRender({
        md: obj.md,
        text: matchStr,
        linkText: linkText,
        linkHref: linkHref
      }) || linkStr
  }

  text = text.replace(regStr, linkStr)

  obj.text = text
  return link(obj)
}

function image(obj) {
  let text = obj.text
  let regStr = /@!@\[(.*?)@\]@\((.*?)@\)/
  let regs = text.match(regStr)

  if (!regs) {
    return text
  }

  let matchStr = regs[0]
  let imageText = regs[1]
  let imageHref = regs[2]
  let imageStr = '<img src="' + imageHref + '" alt="' + imageText + '"/>'

  let imageRender = obj.md.ruleRender['img']
  if (imageRender) {
    imageStr =
      imageRender({
        md: obj.md,
        text: matchStr,
        imageHref: imageHref,
        imageText: imageText
      }) || imageStr
  }
  text = text.replace(regStr, imageStr)

  obj.text = text
  return image(obj)
}

function imageLink(obj) {
  obj.text = image(obj)
  return link(obj)
}

function em(obj) {
  let text = obj.text
  let regStr = / @\*(.+?)@\* /
  let regs = text.match(regStr)
  let htmlstr = ''
  let emRender
  if (regs) {
    htmlstr = '<em>' + regs[1] + '</em>'
    emRender = obj.md.ruleRender['em']
    if (emRender) {
      htmlstr =
        emRender({ md: obj.md, content: regs[1], text: regs[0] }) || htmlstr
    }
    text = text.replace(regStr, htmlstr)
    obj.text = text
    return em(obj)
  }

  regStr = / @_(.*?)@_ /
  regs = text.match(regStr)
  if (regs) {
    htmlstr = '<em>' + regs[1] + '</em>'
    emRender = obj.md.ruleRender['em']
    if (emRender) {
      htmlstr =
        emRender({ md: obj.md, content: regs[1], text: regs[0] }) || htmlstr
    }
    text = text.replace(regStr, htmlstr)
    obj.text = text
    return em(obj)
  }

  return text
}

// 删除线
function del(obj) {
  let text = obj.text
  let regStr = / @~@~(.+?)@~@~ /
  let regs = text.match(regStr)
  let htmlstr = ''
  let defRender
  if (regs) {
    htmlstr = '<del>' + regs[1] + '</del>'
    defRender = obj.md.ruleRender['del']
    if (defRender) {
      htmlstr =
        defRender({ md: obj.md, content: regs[1], text: regs[0] }) || htmlstr
    }
    text = text.replace(regStr, htmlstr)
    obj.text = text
    return del(obj)
  }

  return text
}

// 强调
function strong(obj) {
  let text = obj.text
  let regStr = / @\*@\*(.+?)@\*@\* /
  let regs = text.match(regStr)
  let htmlstr = ''
  let strongRender
  if (regs) {
    htmlstr = '<strong>' + regs[1] + '</strong>'
    strongRender = obj.md.ruleRender['strong']
    if (strongRender) {
      htmlstr =
        strongRender({ md: obj.md, content: regs[1], text: regs[0] }) || htmlstr
    }
    text = text.replace(regStr, htmlstr)
    obj.text = text
    return strong(obj)
  }

  regStr = / @_@_(.*?)@_@_ /
  regs = text.match(regStr)
  if (regs) {
    htmlstr = '<strong>' + regs[1] + '</strong>'
    strongRender = obj.md.ruleRender['strong']
    if (strongRender) {
      htmlstr =
        strongRender({ md: obj.md, content: regs[1], text: regs[0] }) || htmlstr
    }
    text = text.replace(regStr, htmlstr)
    obj.text = text
    return strong(obj)
  }

  return text
}

function strongEm(obj) {
  obj.text = strong(obj)
  return em(obj)
}

function inlineCode(obj) {
  let text = obj.text
  let regStr = /@`(.*?)@`/
  let regs = text.match(regStr)
  if (regs) {
    let htmlstr = '<code>' + regs[1] + '</code>'
    let codeRender = obj.md.ruleRender['code']
    if (codeRender) {
      htmlstr =
        codeRender({ md: obj.md, content: regs[1], text: regs[0] }) || htmlstr
    }
    text = text.replace(regStr, htmlstr)
    obj.text = text
    return inlineCode(obj)
  }

  return text
}

// 代码块
function blockCode(obj) {
  let curLine = obj.lines[obj.start]
  let flagStr = '@`@`@`'
  if (curLine.indexOf(flagStr) !== 0) {
    return
  }
  let text = curLine
  let codeContent = ''
  let i = 0
  for (i = obj.start + 1; i < obj.lines.length; i++) {
    let line = obj.lines[i]
    text += '\n' + line
    if (line.indexOf(flagStr) === 0) {
      i++
      break
    }
    codeContent += '\n' + line
  }

  let preRender = obj.md.ruleRender['pre']
  let htmlContent = '<pre>' + codeContent + '</pre>'
  if (preRender) {
    htmlContent =
      preRender({ md: obj.md, content: codeContent, text: text }) || htmlContent
  }

  return {
    tag: 'pre',
    text: text,
    content: codeContent,
    start: obj.start,
    end: i,
    htmlContent: htmlContent
  }
}

function blockCodeTab(obj) {
  let lastLine = obj.start > 0 ? obj.lines[obj.start - 1] : ''
  let curLine = obj.lines[obj.start]
  let isBlockcodeFlag = function(line) {
    if (line.indexOf('\t') === 0 || line.indexOf('    ') === 0) {
      return true
    }
    return false
  }

  if (!isEmptyLine(lastLine) || !isBlockcodeFlag(curLine)) {
    return
  }

  let content = curLine[0] === ' ' ? curLine.substring(4) : curLine.substring(1)
  let i = 0
  let text = curLine
  for (i = obj.start + 1; i < obj.lines.length; i++) {
    let line = obj.lines[i]
    if (!isBlockcodeFlag(line)) {
      break
    }
    content += '\n' + (line[0] === ' ' ? line.substring(4) : line.substring(1))
    text += '\n' + line
  }

  let preRender = obj.md.ruleRender['pre']
  let htmlContent = '<pre>' + content + '</pre>'
  if (preRender) {
    htmlContent =
      preRender({ md: obj.md, content: content, text: text }) || htmlContent
  }

  return {
    tag: 'pre',
    content: content,
    text: text,
    start: obj.start,
    end: i,
    htmlContent: htmlContent
  }
}

// 头部判断
function header(obj) {
  let curLine = obj.lines[obj.start]
  let headerList = [
    '@# ',
    '@#@# ',
    '@#@#@# ',
    '@#@#@#@# ',
    '@#@#@#@#@# ',
    '@#@#@#@#@#@# '
  ]
  let i = 0

  for (i = 0; i < headerList.length; i++) {
    if (curLine.indexOf(headerList[i]) === 0) {
      break
    }
  }

  if (i === headerList.length) {
    return
  }
  let content = curLine.substring(headerList[i].length)
  let text = curLine
  let tag = 'h' + (i + 1)
  let hnRender = obj.md.ruleRender['hn']
  let htmlContent =
    '<' + tag + '>' + obj.md.lineParse(content) + '</' + tag + '>'
  if (hnRender) {
    htmlContent =
      hnRender({ md: obj.md, content: content, text: text }) || htmlContent
  }
  let token = {
    tag: tag,
    content: content,
    text: text,
    start: obj.start,
    end: obj.start + 1,
    htmlContent: htmlContent
  }

  return token
}

// 换行
function br(obj) {
  let curLine = obj.lines[obj.start]
  let i = 0
  let htmlContent = ''
  let text = curLine
  let content = ''
  if (
    !isEmptyLine(curLine) ||
    obj.lines.length === obj.start + 1 ||
    !isEmptyLine(obj.lines[obj.start + 1])
  ) {
    return
  }

  for (i = obj.start + 1; i < obj.lines.length; i++) {
    if (!isEmptyLine(obj.lines[i])) {
      break
    }
    htmlContent += '<br/>'
    text += '\n' + obj.lines[i]
    content += '\n' + obj.lines[i]
  }

  return {
    tag: 'div',
    text: text,
    content: content,
    htmlContent: htmlContent,
    start: obj.start + 1,
    end: i
  }
}

// html代码
function htmlcode(obj, env) {
  let curLine = obj.lines[obj.start]

  // console.log(curLine);
  if (curLine.indexOf('@<') !== 0) {
    return
  }

  let text = curLine
  let i = 0
  for (i = obj.start + 1; i < obj.lines.length; i++) {
    let line = obj.lines[i]
    if (isEmptyLine(line)) {
      break
    }
    text += '\n' + line
  }

  let token = {
    tag: 'html',
    content: text,
    text: text,
    htmlContent: text,
    start: obj.start,
    end: i
  }

  return token
}

// 段落
function paragraph(obj, env) {
  let isParagraphLine = function(line) {
    if (
      isHr(line) ||
      isList(line) ||
      isBlockquote(line) ||
      isHeader(line) ||
      line.indexOf('@`@`@`') === 0 ||
      isEmptyLine(line)
    ) {
      return false
    }

    return true
  }

  let curLine = obj.lines[obj.start]
  if (!isParagraphLine(curLine)) {
    return
  }

  let i = 0
  let text = curLine
  let htmlContent = curLine
  for (i = obj.start + 1; i < obj.lines.length; i++) {
    let line = obj.lines[i]
    if (!isParagraphLine(line)) {
      break
    }
    text += '\n' + line
    htmlContent += '<br/>' + line
  }

  let token = {
    tag: 'p',
    htmlContent: htmlContent,
    content: text,
    text: text,
    start: obj.start,
    end: i
  }

  if (env && env.isSubTag) {
    token.htmlContent = obj.md.lineParse(token.htmlContent)
  } else {
    token.htmlContent =
      '<' +
      token.tag +
      '>' +
      obj.md.lineParse(token.htmlContent) +
      '</' +
      token.tag +
      '>'
  }

  let paragraphRender = obj.md.ruleRender['paragraph']
  if (paragraphRender) {
    token.htmlContent =
      paragraphRender({
        md: obj.md,
        content: text,
        text: text,
        isSubTag: env.isSubTag
      }) || token.htmlContent
  }

  return token
}

// 引用
function blockquote(obj) {
  let curLine = obj.lines[obj.start]
  if (curLine.indexOf('@>') !== 0) {
    return
  }

  let content = curLine.substring(2)
  let i = 0
  let text = curLine
  for (i = obj.start + 1; i < obj.lines.length; i++) {
    let line = obj.lines[i]
    if (isEmptyLine(line)) {
      break
    }
    text += '\n' + line
    line = line.trim()
    content += '\n' + (line.indexOf('@>') === 0 ? line.substring(2) : line)
  }

  let blockquoteRender = obj.md.ruleRender['blockquote']
  let htmlContent
  if (blockquoteRender) {
    htmlContent = blockquoteRender({
      md: obj.md,
      content: content,
      text: text
    })
  }
  return {
    tag: 'blockquote',
    text: text,
    content: content,
    start: obj.start,
    end: i,
    subtokens: obj.md.blockParse(content, {
      start: obj.start,
      isSubTag: true
    }),
    htmlContent: htmlContent
  }
}

// 列表
function list(obj) {
  let curLine = obj.lines[obj.start]
  let isList = function(line) {
    if (
      line.indexOf('@* ') === 0 ||
      line.indexOf('@- ') === 0 ||
      line.indexOf('@+ ') === 0
    ) {
      return { isList: true, isSort: false }
    }
    if (line.match(/^\d+\. /)) {
      return { isList: true, isSort: true }
    }

    return { isList: false, isSort: false }
  }

  let curRet = isList(curLine)
  if (!curRet.isList) {
    return
  }

  let content = ''
  let text = curLine
  let i = 0
  let subtokens = []
  let token = {
    tag: 'li',
    start: obj.start,
    content: curLine.substring(3).trim()
  }
  for (i = obj.start + 1; i <= obj.lines.length; i++) {
    let line = obj.lines[i] || ''
    let ret = isList(line)
    if (isEmptyLine(line)) {
      token.end = i
      token.subtokens = obj.md.blockParse(token.content, {
        start: i,
        isSubTag: true
      })
      subtokens.push(token)
      content += (content === '' ? '' : '\n') + token.content
      break
    }
    if (ret.isList) {
      token.end = i
      token.subtokens = obj.md.blockParse(token.content, {
        start: i,
        isSubTag: true
      })
      subtokens.push(token)
      content += (content === '' ? '' : '\n') + token.content
      if (curRet.isSort !== ret.isSort) {
        break
      } else {
        token = {
          tag: 'li',
          start: i,
          content: line.substring(3).trim()
        }
      }
    } else {
      token.content += '\n' + line.trim()
    }
    text += '\n' + line
  }

  let tag =
    curLine[1] === '*' || curLine[1] === '+' || curLine[1] === '-' ? 'ul' : 'ol'
  let listRender = obj.md.ruleRender[tag]
  let htmlContent
  if (listRender) {
    htmlContent = listRender({ md: obj.md, text: text, content: content })
  }
  return {
    tag: tag,
    content: content,
    text: text,
    start: obj.start,
    end: i,
    subtokens: subtokens,
    htmlContent: htmlContent
  }
}

// 分割线
function horizontalLine(obj) {
  let curLine = obj.lines[obj.start]
  if (!isHr(curLine)) {
    return
  }

  let hrRender = obj.md.ruleRender['hr']
  let htmlContent = '<hr>'
  if (hrRender) {
    htmlContent = hrRender({ md: obj.md, text: curLine }) || htmlContent
  }

  return {
    tag: 'div',
    content: curLine,
    text: curLine,
    htmlContent: htmlContent,
    start: obj.start,
    end: obj.start + 1
  }
}

// 表
function table(obj) {
  let curLine = obj.lines[obj.start]
  let nextLine = obj.lines[obj.start + 1] || ''
  let formatLine = function(line) {
    line = line[0] === '|' ? line.substring(1) : line
    line = line.trim()
    line =
      line[line.length - 1] === '|' ? line.substring(0, line.length - 1) : line

    return line
  }

  curLine = formatLine(curLine)
  nextLine = formatLine(nextLine)

  let curLineFields = curLine.split('|')
  let nextLineFields = nextLine.split('|')
  let i = 0
  let lineFields
  let field
  let htmlField
  let line
  let styleList = []
  if (
    curLineFields.length !== nextLineFields.length ||
    curLineFields.length === 1
  ) {
    return
  }
  for (let i = 0; i < nextLineFields.length; i++) {
    field = nextLineFields[i].trim()
    if (!field.match(/^:?(@-)+:?$/)) {
      return
    }
    if (field[0] === ':' && field[field.length - 1] !== ':') {
      styleList.push('style="text-align:left"')
    } else if (field[0] !== ':' && field[field.length - 1] === ':') {
      styleList.push('style="text-align:right"')
    } else if (field[0] === ':' && field[field.length - 1] === ':') {
      styleList.push('style="text-align:center"')
    } else {
      styleList.push('style="text-align:left"')
    }
  }

  let text = obj.lines[obj.start] + '\n' + obj.lines[obj.start + 1]
  let content = curLine + '\n' + nextLine
  let htmlContent = '<table><thead><tr>'
  for (let i = 0; i < curLineFields.length; i++) {
    field = curLineFields[i].trim()
    htmlField = obj.md.lineParse(field)
    htmlContent += '<th>' + htmlField + '</th>'
  }
  htmlContent += '</tr></thead><tbody>'

  for (i = obj.start + 2; i < obj.lines.length; i++) {
    line = obj.lines[i]
    line = formatLine(line)
    lineFields = line.split('|')
    if (lineFields.length !== curLineFields.length) {
      break
    }

    htmlContent += '<tr>'
    for (let j = 0; j < lineFields.length; j++) {
      field = lineFields[j].trim()
      htmlField = obj.md.lineParse(field)
      htmlContent += '<td ' + styleList[j] + '>' + htmlField + '</td>'
    }
    htmlContent += '</tr>'
    content += '\n' + line
    text += '\n' + obj.lines[i]
  }

  htmlContent += '</tbody></table>'

  let tableRender = obj.md.ruleRender['table']
  if (tableRender) {
    htmlContent =
      tableRender({ md: obj.md, content: content, text: text }) || htmlContent
  }

  return {
    tag: 'table',
    content: content,
    text: text,
    htmlContent: htmlContent,
    start: obj.start,
    end: i
  }
}

// 渲染token
function renderToken(token) {
  let htmlContent = ''

  if (token.htmlContent) {
    return token.htmlContent
  }

  htmlContent += '<' + token.tag + '>'

  let subtokens = token.subtokens || []
  for (let i = 0; i < subtokens.length; i++) {
    htmlContent += renderToken(subtokens[i])
  }
  htmlContent += '</' + token.tag + '>'

  return htmlContent
}

function markdown(options) {
  let md = {
    blockRuleList: [],
    inlineRuleList: [],
    ruleRender: {},
    options: options
  }

  md.mdSpecialCharEscape = mdSpecialCharEscape
  md.mdSpecialCharUnescape = mdSpecialCharUnescape

  md.registerInlineRule = function(rule) {
    this.inlineRuleList.push(rule)
  }

  md.registerBlockRule = function(rule) {
    this.blockRuleList.push(rule)
  }

  md.registerRuleRender = function(tag, render) {
    this.ruleRender[tag] = render
  }

  md.registerInlineRule(del)
  md.registerInlineRule(imageLink)
  md.registerInlineRule(strongEm)
  md.registerInlineRule(inlineCode)

  md.registerBlockRule(horizontalLine)
  md.registerBlockRule(br)
  md.registerBlockRule(header)
  md.registerBlockRule(blockCode)
  md.registerBlockRule(blockCodeTab)
  md.registerBlockRule(blockquote)
  md.registerBlockRule(list)
  md.registerBlockRule(table)

  md.registerBlockRule(htmlcode)
  // 段落需放最后
  md.registerBlockRule(paragraph)

  md.lineParse = function(text) {
    for (let i = 0; i < md.inlineRuleList.length; i++) {
      let rule = md.inlineRuleList[i]
      text = rule({ text: text, md: md })
    }
    return text
  }

  md.blockParse = function(text, env) {
    let self = this
    let params = {}
    let tokens = []
    let lines = text.split('\n')
    let start = 0
    // console.log(lines);
    while (start < lines.length && start >= 0) {
      params.start = start
      params.lines = lines
      params.md = self

      for (let i = 0; i < md.blockRuleList.length; i++) {
        let blockRule = md.blockRuleList[i]
        let token = blockRule(params, env)
        if (token) {
          tokens.push(token)
          start = token.end - 1
          break
        }
      }
      start++
    }

    return tokens
  }

  md.parse = function(text) {
    text = mdSpecialCharEscape(text || '')
    let tokens = this.blockParse(text)
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i]
      token.htmlContent = renderToken(token)
      token.content = md.mdSpecialCharUnescape(token.content)
      token.text = md.mdSpecialCharUnescape(token.text)
      // token.start++;
      // token.end++;
      token.htmlContent = md.mdSpecialCharUnescape(token.htmlContent)
    }
    return tokens
  }

  md.render = function(text) {
    let tokens = this.parse(text)

    console.log(tokens)

    let htmlContent = ''
    for (let i = 0; i < tokens.length; i++) {
      htmlContent += tokens[i].htmlContent
    }

    return htmlContent
  }

  return md
}

export default markdown
