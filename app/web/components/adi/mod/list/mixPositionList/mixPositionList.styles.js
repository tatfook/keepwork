import _ from 'lodash'
import modSettings from './mixPositionList.settings'

const defaultData = {
  list: {
    gutter: 5,
    colSize: 2,
    modType: modSettings['list'].modType,
    modSettings: modSettings['list'].modSettings
  }
}

export default [
  {
    templateID: 0,
    data: {
      root: {}
    },
    props: {},
    theme: {
      root: ['mod-full-width', 'mod-space']
    },
    options: {
      config: {
        ...defaultData,
        list: _.merge({}, defaultData.list, {
          modSettings: _.merge({}, defaultData.list.modSettings, {
            styleID: 4
          })
        })
      }
    },
    useImage: false,
    cover: '',
    preview: {
      outter: {},
      inner: {}
    }
  },
  {
    templateID: 0,
    data: {
      root: {}
    },
    props: {},
    theme: {
      root: ['mod-full-width', 'mod-space']
    },
    options: {
      config: {
        ...defaultData
      }
    },
    useImage: false,
    cover: '',
    preview: {
      outter: {},
      inner: {}
    }
  }
]
