export default [
  // style 1
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
        width: '87px'
      },
      couple: {},
      colCouple: {
        height: '87px',
        display: 'flex',
        'align-items': 'center'
      }
    },
    layout: {
      colLogo: ['el-col-xs-8', 'el-col-sm-8', 'el-col-8'],
      colCouple: ['el-col-xs-16', 'el-col-sm-16', 'el-col-16']
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
    }
  }
]
