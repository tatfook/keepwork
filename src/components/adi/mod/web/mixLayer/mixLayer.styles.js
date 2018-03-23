export default [
  // style1
  {
    data: {
      // 定义mod根div的样式
      root: {
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      },
      media: {
        width: '100%',
        height: '450px'
      },
      colGroup: {
        width: '100%'
      },
      colCouple: {
        'min-width': '200px',
        display: 'flex',
        'margin-top': '-400px',
        'align-items': 'center'
      }
    },
    props: {
      colPhoto: { span: 10 },
      colCouple: { span: 16 },
      rootRow: { gutter: 100 }
    },
    theme: {
      root: ['font_0', 'color_7'],
      paragraph: ['color_3']
    },
    options: {
      theme: {
        businessName: {
          fontSize: 'font_5',
          fontColor: 'color_3'
        },
        tagline: {
          fontSize: 'font_2',
          fontColor: 'color_2'
        }
      },
      config: {}
    }
  }
]
