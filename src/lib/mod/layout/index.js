import _ from 'lodash'
// import { mdToJson } from '../parser/mdParser'
import {
  getRelativePathByPath
} from '@/lib/utils/gitlab'
import Const from './const'

export default {
  Const,

  buildLayouts(content) {
    return _.isString(content) ? JSON.parse(content) : content
  },

  getLayout(layouts, path) {
    if (!layouts) return
    let index = _.findIndex(layouts, layout => {
      return layout.paths && _.indexOf(layout.paths, path) !== -1
    })
    if (index > -1) return layouts[index]
    index = _.findIndex(layouts, layout => {
      return !!layout.default
    })
    if (index > -1) return layouts[index]
    console.error('missing default layout!')
  },

  // {
  //   "layoutConfig": {
  //     "defaultLayoutId": 0,
  //     "layouts": [
  //       {
  //         "id": 0,
  //         "name": "Basic",
  //         "styleName": "basic",
  //         "match": "",
  //         "content": {
  //           "footer": "footer.md",
  //           "header": "header.md",
  //           "sidebar": "sidebar.md"
  //         }
  //       }
  //     ]
  //   },
  //   "pages": {
  //     "index.md": {
  //       "layout": 0
  //     }
  //   }
  // }
  getLayoutByPath(siteLayoutConfig, path) {
    let defaultLayoutId = _.get(siteLayoutConfig, ['layoutConfig', 'defaultLayoutId'], 0)
    let allLayouts = _.get(siteLayoutConfig, ['layoutConfig', 'layouts'], [])
    let relativePath = getRelativePathByPath(path)
    let targetPageLayoutId = _.get(siteLayoutConfig, ['pages', relativePath, 'layout'], defaultLayoutId)
    let targetLayout = _.keyBy(allLayouts, 'id')[targetPageLayoutId]
    return targetLayout
  },

  layoutRootPath(sitePath) {
    return sitePath + '/_config/'
  },

  layoutFilePath(sitePath) {
    return this.layoutRootPath(sitePath) + 'layout.json'
  },

  layoutPagePath(sitePath, pageName) {
    return this.layoutRootPath(sitePath) + 'pages/' + pageName
  }
}
