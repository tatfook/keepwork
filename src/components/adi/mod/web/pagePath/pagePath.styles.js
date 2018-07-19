let emptyData = {}

export default [
  // style 0
  {
    data: {
      root: {},
      colPagePath: {},
      pagePath: {}
    },
    props: {
      rootRow: {},
      colPagePath: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width']
    },
    options: {
      theme: {
        pagePath: {
          nameFontSize: 'font_3',
          nameFontColor: 'color_6',
          labelFontColor: 'color_3',
          commonSize: 'font_5',
          pageFontColor: 'color_8',

          nameMobileSize: 'font_7',
          commonMobileSize: 'font_8'
        }
      },
      config: {
        ...emptyData
      }
    },
    preview: {
      inner: {
        'margin-top': '-20px'
      }
    }
  }
]
