// contribution-calendar.js v0.0.1

// @author  ZhangGuolu <986673640@qq.com>

// depend on moment http://momentjs.com/docs/

// @example
// <pre>
// contributionCalendarGenerator("containerId",{});

// // or

// contributionCalendarGenerator("containerId",{
//   year: "2016",
//   dateCount: {
//     "2016-01-01": 1,
//     "2016-02-01": 2,
//     "2016-03-01"：3,
//     "2016-04-01"：4,
//     "2016-05-01"：5,
//     "2016-06-01":6,
//   }
// });
const moment = require('moment')

let defaults = {
  year: new Date().getFullYear(),
  week: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
  monthChars: Array(12).join().split(',')
    .map(function(x, i) { return (i + 1) + '月' }),
  step: 5,
  stepColor: ['#E8D8F8', '#B5CdE6', '#77A4D0', '#3977AD'],
  defaultColor: '#EBEDF0',
  active: {},
  defaultTextFillColor: '#303133',
  languageLocaleIsForGlobalUser: false
}
let svg, gEle, yearColDates
let languageLocaleIsForGlobalUser = defaults.languageLocaleIsForGlobalUser
let startX = 36
let startY = 45
let year = defaults.year
let month = []
let monthChars = defaults.monthChars
let week = defaults.week
let dateCount = defaults.active
let step = defaults.step
let stepColor = defaults.stepColor
let defaultColor = defaults.defaultColor
let defaultTextFillColor = defaults.defaultTextFillColor

// 格式化数字为固定位数
function fixNum(num, length) {
  return ('' + num).length < length ? ((new Array(length + 1).join('0') + num).slice(-length)) : '' + num
}
// 根据活动次数设置颜色
function getColor(count) {
  let rank = Math.floor(count / step)
  let len = stepColor.length
  let color = count > 0 ? ((rank > len - 1) ? stepColor[len - 1] : stepColor[rank]) : defaultColor
  return color
}
// 获取活动次数
function getCount(date) {
  if (dateCount[date]) {
    return dateCount[date]
  }
  return 0
}
// 根据当前是一年中的第几天返回这天的月份和日期
function getDay(nowDay) {
  let result = {
    'month': 1,
    'day': 0
  }
  while (nowDay > month[result.month]) {
    nowDay -= month[result.month]
    result.month++
  }
  result.day = nowDay
  return result
}

function getYearMondayRow(yearStart, yearEnd) {
  let yearMondayRow = []
  let nextDate = yearStart.day(-6)
  while (nextDate <= yearEnd && nextDate.day(8) <= yearEnd) {
    const date = nextDate.format('YYYY-MM-DD')
    yearMondayRow.push({
      date
    })
  }
  return yearMondayRow
}

function getYearColDates(year) {
  let yearColDates = []
  let yearStart = moment(`${year}-01-01`).day(1)
  let yearEnd = moment(`${year}-12-31`)
  let yearMondayRow = getYearMondayRow(yearStart, yearEnd)
  yearMondayRow.forEach(dateObj => {
    let perCol = []
    for (let i = 1; i <= 7; i++) {
      let waitPushedDate = moment(dateObj.date).day(i)
      if (waitPushedDate > yearEnd) {
        break
      }
      perCol.push({
        date: waitPushedDate.format('YYYY-MM-DD')
      })
    }
    yearColDates.push(perCol)
  })
  return yearColDates
}

// 显示月份
function showMonth(svg) {
  for (let i = 1; i <= 12; i++) {
    let text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', 30 + 52 * (i - 1))
    text.setAttribute('y', -10)
    text.setAttribute('class', 'month')
    text.setAttribute('fill', defaultTextFillColor)
    let textNode = document.createTextNode(monthChars[i - 1])
    text.appendChild(textNode)
    gEle.appendChild(text)
  }
  return svg
}
// 显示星期
function showWeek(svg) {
  for (let i = 0; i < 7; i++) {
    let weekItem = week[i]
    let text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    if (i % 2 !== 0) {
      text.setAttribute('style', 'display:none')
    }
    text.setAttribute('y', 10 + 12 * i)
    text.setAttribute('x', -36)
    text.setAttribute('class', 'month')
    text.setAttribute('fill', defaultTextFillColor)
    let textNode = document.createTextNode(weekItem)
    text.appendChild(textNode)
    gEle.appendChild(text)
  }
  return svg
}
// 显示年贡献小框
function showTables(svg, yearColDates) {
  for (let colIndex = 0; colIndex < yearColDates.length; colIndex++) {
    let g
    g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    g.setAttribute('transform', 'translate(' + (13 * colIndex) + ',0)')
    for (let rowIndex = 0; rowIndex < yearColDates[colIndex].length; rowIndex++) {
      let r = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      let dataDate = yearColDates[colIndex][rowIndex].date
      r.setAttribute('data-date', dataDate)
      let dataCount = getCount(dataDate)
      let color = getColor(dataCount)
      r.setAttribute('data-count', dataCount)
      r.setAttribute('fill', color)
      r.setAttribute('class', 'day')
      r.setAttribute('width', '10')
      r.setAttribute('height', '10')
      r.setAttribute('x', (14 - colIndex))
      r.setAttribute('y', (12 * rowIndex))
      let title = document.createElementNS('http://www.w3.org/2000/svg', 'title')
      let textNode = document.createTextNode(dataDate + ' 的活跃度为 ' + dataCount)
      title.appendChild(textNode)
      r.appendChild(title)
      g.appendChild(r)
    }
    gEle.appendChild(g)
  }
  return svg
}

function destoryCalendar(id) {
  let elem = document.getElementById(id)
  let childNode = elem.childNodes[0]
  console.log(typeof elem, typeof elem.childNodes[0], elem.childNodes)
  childNode && elem.removeChild(childNode)
}

function init() {
  svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  gEle = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  gEle.setAttribute('transform', 'translate(' + startX + ', ' + startY + ')')
  svg.appendChild(gEle)
}

export const contributionCalendarGenerator = (id, options) => {
  options = options || {}
  let elem = document.getElementById(id)
  if (!elem) {
    console.error('传入的ID不存在')
    return
  }
  destoryCalendar(id)
  init()
  if (options.languageLocaleIsForGlobalUser) {
    languageLocaleIsForGlobalUser = options.languageLocaleIsForGlobalUser
  }
  if (options.year) {
    year = options.year
  }

  week = languageLocaleIsForGlobalUser ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : week

  monthChars = languageLocaleIsForGlobalUser
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    : monthChars
  if (options.dateCount) {
    dateCount = options.dateCount
  }
  options.stepColor && (stepColor = options.stepColor)
  options.defaultColor && (defaultColor = options.defaultColor)
  options.defaultTextFillColor && (defaultTextFillColor = options.defaultTextFillColor)
  yearColDates = getYearColDates(year)
  svg = showMonth(svg)
  svg = showWeek(svg)
  svg = showTables(svg, yearColDates)
  if (options.before) {
    let elemSibling = document.getElementById(options.before)
    if (elemSibling) {
      elem.insertBefore(svg, elemSibling)
    } else {
      elem.appendChild(svg)
    }
  } else {
    elem.appendChild(svg)
  }
}

export default {
  contributionCalendarGenerator
}
