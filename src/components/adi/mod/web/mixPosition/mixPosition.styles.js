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
        width: 'auto'
      },
      group: {},
      colGroup: {
        width: '340px'
      },
      paragraph: {
        'text-indent': '28px'
      },
      button: {
        float: 'right'
      }
    },
    props: {
      colMedia: { span: 12 },
      colGroup: { sapn: 12 },
      rootRow: { gutter: 10 }
    },
    theme: {
      root: ['font_0', 'color_7'],
      paragraph: ['color_3']
    },
    options: {
      theme: {
        title: {
          fontSize: 'font_5',
          fontColor: 'color_3'
        },
        subtitle: {
          fontSize: 'font_2',
          fontColor: 'color_2'
        },
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
  {
    data: {
      // 定义mod根div的样式
      root: {},
      media: {
        width: '200px',
        height: '200px'
      },
      colMedia: {
        width: 'auto',
        float: 'right'
      },
      group: {},
      colGroup: {
        width: '340px',
        float: 'left'
      },
      paragraph: {
        'text-indent': '28px'
      },
      button: {
        float: 'right'
      }
    },
    props: {
      colMedia: { span: 12 },
      colGroup: { sapn: 12 },
      rootRow: { gutter: 10 }
    },
    theme: {
      root: ['font_0', 'color_7'],
      paragraph: ['color_3']
    },
    options: {
      theme: {
        title: {
          fontSize: 'font_5',
          fontColor: 'color_3'
        },
        subtitle: {
          fontSize: 'font_2',
          fontColor: 'color_2'
        },
        button: {
          fontSize: 'font_0',
          fontColor: 'color_7',
          bgColor: 'color_0'
        }
      },
      config: {}
    }
  }
]
