export default [
  // style 0
  {
    data: {
      root: {}
    },
    props: {},
    theme: {
      root: ['mod-space'],
      rootRow: ['mod-full-width']
    },
    options: {
      theme: {},
      config: {
        comment: {
          title: 'adi.comment.title',
          delete: 'adi.comment.delete',
          commit: 'adi.comment.commit',
          close: 'adi.comment.close',
          notice: 'adi.comment.notice'
        }
      }
    },
    preview: {
      outter: {
        height: '28px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
  },
  // style 1
  {
    data: {
      root: {}
    },
    props: {},
    theme: {
      root: ['mod-space'],
      rootRow: ['mod-full-width']
    },
    options: {
      theme: {},
      config: {
        comment: {
          styleId: 1,
          title: 'Work review',
          delete: 'adi.comment.delete',
          commit: 'Publish',
          close: 'adi.comment.close',
          notice: 'adi.comment.notice'
        }
      }
    },
    preview: {
      outter: {
        height: '28px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
  }
]
