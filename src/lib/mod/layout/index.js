import _ from 'lodash'
import { mdToJson } from '../parser/mdParser'
import Const from './const'

export default {
  Const,

  buildLayouts(content) {
    return mdToJson(content) || []
  },

  getLayout(siteSetting, path) {
    const layouts = siteSetting.layoutConfig.layouts
    let index = _.findIndex(layouts, layout => {
      return layout.rules && _.indexOf(layout.paths, path) !== -1
    })
    if (index > -1) return layouts[index]
    index = _.findIndex(layouts, layout => {
      return !!layout.default
    })
    if (index > -1) return layouts[index]
    console.error('missing default layout!')
  },

  layoutRootPath(sitePath) {
    return sitePath + '/_config/'
  },

  layoutFilePath(sitePath) {
    return this.layoutRootPath(sitePath) + 'layout'
  },

  layoutPagePath(sitePath, pageName) {
    return this.layoutRootPath(sitePath) + 'pages/' + pageName
  }
}
