export default [
  // style1
  {
    data: {
      // 定义mod根div的样式
      root: {
        position: 'relative',
        overflow: 'hidden',
        zoom: 1
      },
      media: {
        width: '40%',
        float: 'left'
      },
      group: {
        width: '56%',
        float: 'left',
        'margin-left': '1rem'
      },
      button: {
        float: 'right'
      }
    },
    theme: {
      root: ['font_0', 'color_7'],
      paragraph: ['color_3']
    },
    options: {
      theme: {
        button: {
          fontSize: 'font_0',
          fontColor: 'color_7',
          bgColor: 'color_0'
        }
      },
      config: {}
    }
  },
  // style2
  {}
]
