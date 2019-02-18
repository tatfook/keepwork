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
          colSize: 1,
          modSettings: _.merge({}, defaultData.list.modSettings, {
            styleID: 0
          })
        })
      }
    },
    useImage: true,
    cover: require('@/assets/adi/mixPositionList/styleCover1.png'),
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
        ...defaultData,
        list: _.merge({}, defaultData.list, {
          colSize: 2,
          modSettings: _.merge({}, defaultData.list.modSettings, {
            styleID: 3
          })
        })
      }
    },
    useImage: true,
    cover: require('@/assets/adi/mixPositionList/styleCover2.png'),
    preview: {
      outter: {},
      inner: {}
    }
  }
]
