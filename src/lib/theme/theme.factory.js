import _ from 'lodash'
import themeData from './theme.data'
import jss from 'jss'
import preset from 'jss-preset-default'

jss.setup(preset())

const buildFontClasses = fonts => {
  let fontClasses = {}
  fonts.forEach((el, index) => {
    fontClasses['font_' + index] = { 'font-size': el + 'px' }
  })
  return fontClasses
}

const buildColorClasses = colors => {
  let colorClasses = {}
  colors.forEach((el, index) => {
    colorClasses['color_' + index] = { color: el }
  })
  return colorClasses
}

const buildBgColorClasses = bgColors => {
  let bgColorClasses = {}
  bgColors.forEach((el, index) => {
    bgColorClasses['bg_color_' + index] = { 'background-color': el }
  })
  return bgColorClasses
}

const generate = conf => {
  let theme = themeData[conf.name] || 'light'
  let colors = theme.colors[conf.colorID || 0]
  let fonts = theme.fonts[conf.fontID || 0]
  let bgColors = theme.bgColors[conf.bgColorID || 0]

  let themeClasses = _.assign(
    buildFontClasses(fonts),
    buildColorClasses(colors),
    buildBgColorClasses(bgColors)
  )

  return jss.createStyleSheet(themeClasses)
}

export default {
  generate
}
