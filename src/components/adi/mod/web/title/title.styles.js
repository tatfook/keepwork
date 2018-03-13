export default [
  // style 1
  {
    data: {
      // 定义mod根div的样式
      root: {
        height: '147px',
        position: 'relative'
      },
      logo: {
        height: '87px',
        width: '87px',
        'padding-left': '28px',
        'padding-right': '28px',
        'padding-top': '30px',
        'padding-bottom': '30px',
        position: 'absolute',
        top: 0,
        left: 0
      },
      couple: {
        position: 'absolute',
        top: '50%',
        left: '145px',
        transform: 'translateY(-50%)'
      }
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
