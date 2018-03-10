import _ from 'lodash'
import themeData from './theme.data'
import jss from 'jss'
import preset from 'jss-preset-default'

jss.setup(preset())

const buildFontClasses = fonts => {
  let fontClasses = {}
  _.forEach(fonts, (el, index) => {
    fontClasses['font_' + index] = { 'font-size': el + 'px' }
  })
  return fontClasses
}

const buildColorClasses = colors => {
  let colorClasses = {}
  _.forEach(colors, (el, index) => {
    colorClasses['color_' + index] = { color: el }
  })
  return colorClasses
}

const buildBgColorClasses = bgColors => {
  let bgColorClasses = {}
  _.forEach(bgColors, (el, index) => {
    bgColorClasses['bg_color_' + index] = { 'background-color': el }
  })
  return bgColorClasses
}

const buildOrigin = themeClasses => {
  let originData = {}
  _.forEach(themeClasses, (el, key) => {
    originData[key] = _.map(el, ele => {
      return ele
    })[0]
  })
  return originData
}

const generate = conf => {
  let theme = themeData[conf.name] || 'classic'
  let colors = theme.colors[conf.colorID || 0]
  let fonts = theme.fonts[conf.fontID || 0]
  let themeBgColors = theme.bgColors || theme.colors
  let bgColors = themeBgColors[conf.colorID || 0]

  let themeClasses = _.assign(
    buildFontClasses(fonts),
    buildColorClasses(colors),
    buildBgColorClasses(bgColors)
  )

  let data = buildOrigin(themeClasses)
  let sheet = jss.createStyleSheet(themeClasses)

  return { data, sheet }
}

export default {
  generate
}
