import listSettings from './mixLayerList.settings'

const emptyData = {
  list: {
    gutter: 5,
    colSize: 2,
    modType: listSettings['list'].type,
    modSettings: listSettings['list'].default
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
