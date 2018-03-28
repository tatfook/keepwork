export default [
  // style1
  {
    data: {
      // 定义mod根div的样式
      root: {
        overflow: 'hidden'
      },
      media: {
        width: '200px',
        height: '200px'
      },
      colMedia: {
        width: 'auto'
      },
      group: {},
      colGroup: {},
      paragraph: {
        'text-indent': '28px'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colGroup: { span: 15 },
      colButton: { span: 6, push: 18 }
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
    },
    cover: 'http://git.keepwork.com/gitlab_rls_kaitlyn/keepworkdatasource/raw/master/kaitlyn_images/img_1522233836994.jpeg'
  },

  // style2
  {
    data: {
      // 定义mod根div的样式
      root: {
        overflow: 'hidden'
      },
      media: {
        width: '200px',
        height: '200px'
      },
      colMedia: {
        float: 'right',
        width: 'auto'
      },
      group: {},
      colGroup: {},
      paragraph: {
        'text-indent': '28px'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colMedia: { span: 12 },
      colGroup: { span: 12 },
      colButton: { span: 6, push: 18 }
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
    },
    cover: 'http://git.keepwork.com/gitlab_rls_kaitlyn/keepworkdatasource/raw/master/kaitlyn_images/img_1522233831478.jpeg'
  }
]
