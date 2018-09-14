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
          title: 'adi.comment.work_review',
          delete: 'adi.comment.delete',
          commit: 'adi.comment.publish',
          close: 'adi.comment.close',
          notice: 'adi.comment.notice'
        }
      }
    }
  }
]
