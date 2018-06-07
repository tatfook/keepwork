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
    props: {
      rootRow: { gutter: 10 }
    },
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
    cover: require('@/../static/adi/text/text1.png'),
    preview: {
      outter: {
        height: '70px'
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
    props: {
      rootRow: { gutter: 10 }
    },
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
    cover: require('@/../static/adi/text/text2.png'),
    preview: {
      outter: {
        height: '70px'
      }
    }
  },
  // style 2
  {
    data: {},
    props: {},
    theme: {
      root: ['mod-space', 'bg_color_4', 'color_2'],
      paragraph: ['mod-full-width', 'font_9']
    },
    options: {
      theme: {},
      config: {
        paragraph: emptyData.paragraph
      }
    },
    preview: {
      outter: {
        height: '70px'
      }
    }
  }
]
