const ThemeHelper = {
  defaultTheme: {
    fontFamily: 'inherit',
    fontID: 0,
    colorID: 0,
    name: 'classic'
  },
  themeRootPath(sitePath) {
    return `${sitePath}/_config/`
  },
  themeFilePath(sitePath) {
    return `${this.themeRootPath(sitePath)}/theme.json`
  }
}

export default ThemeHelper
