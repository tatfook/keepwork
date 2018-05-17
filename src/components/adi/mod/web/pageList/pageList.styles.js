export default [
  // style 0
  {
    templateID: 0,
    data: {
      pageList: {
        float: 'left'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width']
    },
    options: {},
    // cover: require('@/../static/adi/'),
    preview: {
      outter: {
        height: '30px'
      }
    }
  },

  // style 1
  {
    templateID: 0,
    data: {
      pageList: {
        display: 'flex',
        'justify-content': 'center'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width']
    },
    options: {},
    // cover: require('@/../static/adi/'),
    preview: {
      outter: {
        height: '30px'
      }
    }
  },

  // style 2
  {
    templateID: 0,
    data: {
      pageList: {
        float: 'right'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width']
    },
    options: {},
    // cover: require('@/../static/adi/'),
    preview: {
      outter: {
        height: '30px'
      }
    }
  }
]
