import modSettings from './settings'

const emptyData = {
  ...modSettings
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
