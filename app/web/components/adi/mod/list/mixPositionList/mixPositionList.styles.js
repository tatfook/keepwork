import _ from 'lodash'
import modSettings from './mixPositionList.settings'

const defaultData = {
  list: {
    gutter: 5,
    colSize: 2,
    modType: modSettings['list'].modType,
    modSettings: modSettings['list'].modSettings
  },
  media: {
    emptyMedia: require('@/assets/adi/mixPosition/picture-mod.png'),
    link: '',
    target: '_blank',
    autoplay: true,
    playloop: false,
    poster: ''
  },
  title: {
    emptyInput: 'adi.mixPosition.title',
    emptyLink: '',
    emptyInputPlaceholder: 'titleText',
    emptyLinkTarget: '_blank'
  },
  subtitle: {
    emptyInput: 'adi.mixPosition.subtitle',
    emptyLink: '',
    emptyInputPlaceholder: 'subTitleText',
    emptyLinkTarget: '_blank'
  },
  paragraph: {
    emptyAutoSizeInput: 'adi.mixPosition.paragraph'
  },
  button: {
    emptyInput: 'adi.mixPosition.button',
    emptyInputPlaceholder: 'buttonText',
    emptyLink: '',
    emptyLinkTarget: '_blank'
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
