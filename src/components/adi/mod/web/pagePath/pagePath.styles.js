let emptyData = {}

export default [
  // style 0
  {
    data: {
      root: {},
      colPageRoute: {},
      pageRoute: {}
    },
    props: {
      rootRow: {},
      colPageRoute: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width']
    },
    options: {
      theme: {
        pageRoute: {
          nameFontSize: 'font_3',
          nameFontColor: 'color_6',
          labelFontColor: 'color_3',
          commonSize: 'font_5',
          pageFontColor: 'color_8'
        }
      },
      config: {
        ...emptyData
      }
    },
    preview: {
      outter: {
        height: '16px'
      }
    }
  }
]
