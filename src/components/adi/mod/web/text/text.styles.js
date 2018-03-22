export default [
  // style 1
  {
    data: {
      root: {},
      title: {
        'text-align': 'left'
      },
      paragraph: {
        'text-indent': '28px'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: ['font_0', 'color_0'],
      title: ['color_0']
    },
    options: {
      theme: {
        title: {
          fontSize: 'font_5',
          fontColor: 'color_0'
        }
      },
      config: {}
    }
  },
  // style 2
  {
    data: {
      root: {},
      title: {
        'text-align': 'center'
      },
      paragraph: {
        'text-indent': '28px'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: ['font_0', 'color_0'],
      title: ['color_0']
    },
    options: {
      theme: {
        title: {
          fontSize: 'font_5',
          fontColor: 'color_0'
        }
      },
      config: {}
    }
  }
]
