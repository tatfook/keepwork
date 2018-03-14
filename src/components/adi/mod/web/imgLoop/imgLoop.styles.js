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
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        'z-index': -1
      },
      group: {
        width: '50%',
        float: 'left',
        'margin-left': '5px'
      }
    },
    theme: {
      root: ['font_0', 'color_0'],
      paragraph: ['color_3']
    },
    options: {
      theme: {},
      config: {}
    }
  },
  // style2
  {}
]
