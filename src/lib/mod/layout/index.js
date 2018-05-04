import _ from 'lodash'
// import { mdToJson } from '../parser/mdParser'
import { getRelativePathByPath } from '@/lib/utils/gitlab'
import uuid from '@/lib/utils/uuid'
import Const from './const'

export default {
  Const,
  newLayout(index) {
    return {
      id: uuid(),
      name: `New layout ${index}`,
      styleName: 'basic',
      match: '',
      content: {
        footer: 'footer.md',
        header: 'header.md',
        sidebar: 'sidebar.md'
      }
    }
  },

  buildLayouts(content) {
    return _.isString(content) ? JSON.parse(content) : content
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
    let defaultLayoutId = _.get(siteLayoutConfig, ['layoutConfig', 'defaultLayoutId'], 0).toString()
    let allLayouts = _.get(siteLayoutConfig, ['layoutConfig', 'layouts'], [])
    let allLayoutsMap = _.keyBy(allLayouts, 'id')

    // try to find targetLayout in config.pages
    let relativePath = getRelativePathByPath(path)
    let targetPageLayoutId = _.get(siteLayoutConfig, ['pages', relativePath, 'layout'])
    let targetLayout = allLayoutsMap[targetPageLayoutId]
    if (targetLayout) return targetLayout

    // try to find matched layout
    let relativeMatchPath = relativePath.replace(/\.md$/, '')
    targetLayout = _.last(allLayouts.filter(
      ({match = ''}) => match.split('\n').map(s => s.trim()).indexOf(relativeMatchPath) > -1
    ))
    if (targetLayout) return targetLayout

    // try to use default layout
    targetLayout = allLayoutsMap[defaultLayoutId]
    if (targetLayout) return targetLayout

    // return empty config
    return { styleName: 'basic', content: {} }
  },

  layoutRootPath(sitePath) {
    return sitePath + '/_config/'
  },

  layoutFilePath(sitePath) {
    return this.layoutRootPath(sitePath) + 'layout.json'
  },

  layoutPagePath(sitePath, pageName) {
    return this.layoutRootPath(sitePath) + 'pages/' + pageName
  },

  layoutContentFolderPath(sitePath, contentKey) {
    return this.layoutPagePath(sitePath, `${contentKey}s`)
  }
}
