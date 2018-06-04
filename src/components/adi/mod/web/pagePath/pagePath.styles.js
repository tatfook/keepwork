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
      root: [],
      colGroupRow: ['mod-full-width']
    },
    options: {
      theme: {
        pageRoute: {
          nameFontSize: 'font_2',
          nameFontColor: 'color_6',
          labelFontColor: 'color_3',
          commonSize: 'font_4',
          pageFontColor: 'color_9'
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
