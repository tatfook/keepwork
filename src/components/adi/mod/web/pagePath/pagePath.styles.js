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
          nameFontSize: 'bigtitle',
          nameFontColor: 'nameFontColor',
          labelFontColor: 'labelFontColor',
          commonSize: 'subtitle',
          pageFontColor: 'pageFontColor',

          nameMobileSize: 'auxiliaryText',
          commonMobileSize: 'auxiliaryText'
        }
      },
      config: {
        ...emptyData
      }
    }
  }
]
