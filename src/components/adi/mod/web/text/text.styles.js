let emptyData = {
  title: {
    emptyName: 'adi.text.title',
    emptyLink: '#',
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
      title: ['font_1', 'title'],
      paragraph: ['font_9', 'paragraph']
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
      title: ['font_1', 'title'],
      paragraph: ['font_9', 'paragraph']
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
      root: ['mod-space', 'rootColor', 'fontsColor'],
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
