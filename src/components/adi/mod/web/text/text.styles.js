let emptyData = {
  title: {
    emptyName: 'adi.text.title',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  paragraph: {
    emptyData: 'adi.text.paragraph'
  }
}

export default [
  // style 0
  {
    data: {
      title: {
        'text-align': 'left',
        'margin-bottom': '20px'
      }
    },
    props: {},
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width'],
      title: ['font_1', 'color_7'],
      paragraph: ['font_9', 'color_4']
    },
    options: {
      theme: {},
      config: { ...emptyData }
    },
    preview: {
      outter: {
        height: '28.78px'
      },
      inner: {
        'margin-top': '-21.06px'
      }
    }
  },
  // style 1
  {
    data: {
      title: {
        'text-align': 'center',
        'margin-bottom': '20px'
      }
    },
    props: {},
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width'],
      title: ['font_1', 'color_7'],
      paragraph: ['font_9', 'color_4']
    },
    options: {
      theme: {},
      config: { ...emptyData }
    },
    preview: {
      outter: {
        height: '28.78px'
      },
      inner: {
        'margin-top': '-21.06px'
      }
    }
  }
]
