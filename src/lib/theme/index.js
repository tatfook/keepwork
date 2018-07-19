const ThemeHelper = {
  defaultTheme() {
    return {
      fontFamily: 'inherit',
      fontId: 0,
      colorId: 0
    }
  },
  themeRootPath(sitePath) {
    return `${sitePath}/_config/`
  },
  themeFilePath(sitePath) {
    return `${this.themeRootPath(sitePath)}/theme.json`
  }
}

export default ThemeHelper
