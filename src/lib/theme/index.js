// import _ from 'lodash'
// import { getPageInfoByPath } from '@/lib/utils/gitlab'
// import uuid = from '@/lib/utils/uuid'

const ThemeHelper = {
  defaultTheme() {
    return {
      fontFamily: 'inherit',
      fontId: 0,
      colorsId: 0
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
