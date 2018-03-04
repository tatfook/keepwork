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

const generate = conf => {
  let theme = themeData[conf.name]
  let colors = theme.colors[conf.colorID]
  let fonts = theme.fonts[conf.fontID]

  let themeClasses = Object.assign(
    buildFontClasses(fonts),
    buildColorClasses(colors)
  )

  return jss.createStyleSheet(themeClasses)
}

export default {
  generate
}
