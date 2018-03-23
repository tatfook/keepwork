export default [
  // style1
  {
    data: {
      // 定义mod根div的样式
      root: {},
      media: {
        width: '100%',
        height: '694px'
      },
      colEmptyDiv: {
        width: '0.1px',
        height: '0.1px'
      },
      colPhoto: {
        width: '100%',
        float: 'left'
      },
      colCouple: {
        'min-width': '200px',
        'margin-top': '-500px',
        display: 'flex',
        'align-items': 'center',
        float: 'left'
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
