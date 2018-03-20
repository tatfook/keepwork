export default [
  // style1
  {
    data: {
      // 定义mod根div的样式
      root: {},
      media: {
        width: '200px',
        height: '200px'
      },
      colMedia: {
        width: '200px',
        height: '200px'
      },
      colGroup: {
        width: '300px'
      },
      button: {
        float: 'right'
      }
    },
    // props: {
    //   colMedia: { span: 12 },
    //   colGroup: { sapn: 12 }
    // },
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
