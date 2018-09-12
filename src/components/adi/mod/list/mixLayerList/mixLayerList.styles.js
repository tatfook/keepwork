const emptyData = {
  list: {
    gutter: 5,
    colSize: 2,
    modType: 'ModMixLayer'
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
