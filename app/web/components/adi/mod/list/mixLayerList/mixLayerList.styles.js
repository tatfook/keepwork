import modSettings from './mixLayerList.settings'

const emptyData = {
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
      config: { ...emptyData }
    },
    useImage: false,
    cover: '',
    preview: {
      outter: {},
      inner: {}
    }
  }
]
