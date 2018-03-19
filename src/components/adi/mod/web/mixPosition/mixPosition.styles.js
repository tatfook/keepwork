export default [
  // style1
  {
    data: {
      // 定义mod根div的样式
      root: {
        // position: 'relative',
        // overflow: 'hidden',
        // zoom: 1
      },
      media: {
        width: '200px'
      },
      colMedia: {
        width: '200px'
      },
      // group: {
      //   width: '300px'
      //   float: 'left'
      //   'margin-left': '1rem'
      // },
      colGroup: {
        width: '300px',
        display: 'flex',
        'align-items': 'center'
      },
      button: {
        float: 'right'
      }
    },
    layout: {
      colMedia: ['el-col-xs-12', 'el-col-sm-12'],
      colGroup: ['el-col-xs-12', 'el-col-sm-12']
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
