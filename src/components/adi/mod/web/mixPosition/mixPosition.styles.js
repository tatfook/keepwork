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
        width: '370px'
      },
      paragraph: {
        'text-indent': '28px'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colMedia: { span: 12 },
      colGroup: { sapn: 12 },
      colButton: { span: 6.5, push: 18 }
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
        width: 'auto'
      },
      group: {},
      colGroup: {
        width: '340px'
      },
      paragraph: {
        'text-indent': '28px'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colMedia: { span: 10, push: 15 },
      colGroup: { sapn: 10, pull: 8 },
      colButton: { span: 6.5, push: 18 }
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
