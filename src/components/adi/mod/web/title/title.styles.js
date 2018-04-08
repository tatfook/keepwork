export default [
  // style 0
  {
    data: {
      // 定义mod根div的样式
      root: {
        // height: '147px',
        // position: 'relative'
      },
      logo: {
        height: '87px',
        width: '87px'
      },
      colLogo: {
        width: 'auto'
      },
      couple: {},
      colCouple: {
        height: '87px',
        display: 'flex',
        'align-items': 'center'
      }
    },
    props: {
      colLogo: { span: 8 },
      colCouple: { span: 16 },
      rootRow: { gutter: 10 }
    },
    theme: {
      root: ['font_0', 'color_7']
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
    },
    cover:
      'http://git.keepwork.com/gitlab_rls_kaitlyn/keepworkdatasource/raw/master/kaitlyn_images/img_1522232589267.jpeg'
  }
]
