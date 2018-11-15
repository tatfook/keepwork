let emptyData = {
  title: {
    emptyInput: 'adi.text.title',
    emptyLink: '',
    emptyLinkTarget: '_blank',
    emptyInputPlaceholder: 'titleText',
  },
  paragraph: {
    emptyAutoSizeInput: 'adi.text.paragraph',
    emptyInputPlaceholder: 'descText'
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
      title: ['bigtitle', 'title'],
      paragraph: ['auxiliaryText', 'paragraph']
    },
    options: {
      theme: {},
      config: { ...emptyData }
    },
    cover: ''
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
      title: ['bigtitle', 'title'],
      paragraph: ['auxiliaryText', 'paragraph']
    },
    options: {
      theme: {},
      config: { ...emptyData }
    },
    cover: ''
  },
  // style 2
  {
    data: {},
    props: {},
    theme: {
      root: ['mod-space', 'rootColor', 'fontsColor'],
      paragraph: ['mod-full-width', 'auxiliaryText']
    },
    options: {
      theme: {},
      config: {
        paragraph: emptyData.paragraph
      }
    }
  }
]
