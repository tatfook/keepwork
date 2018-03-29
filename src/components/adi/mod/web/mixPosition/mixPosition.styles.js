export default [
  // style 1 左图右文
  {
    data: {
      // 定义mod根div的样式
      root: {
        overflow: 'hidden',
        'margin-top': '20px'
      },
      media: {
        height: '300px'
      },
      colMedia: {},
      colGroup: {
        display: 'flex',
        'align-items': ' flex-start'
      },
      subtitle: {
        'margin-top': '10px'
      },
      paragraph: {
        'margin-top': '15px',
        'text-indent': '28px'
      },
      button: {
        'margin-top': '20px'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colMedia: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 10 },
        lg: { span: 10 }
      },
      colGroup: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 13 },
        lg: { span: 13 }
      },
      colButton: {
        span: 6,
        push: 18
      }
    },
    theme: {
      root: ['font_0', 'color_7'],
      paragraph: ['color_8']
    },
    options: {
      theme: {
        title: {
          fontSize: 'font_5',
          fontColor: 'color_8'
        },
        subtitle: {
          fontSize: 'font_2',
          fontColor: 'color_8'
        },
        button: {
          fontSize: 'font_0',
          fontColor: 'color_7',
          bgColor: 'color_0'
        }
      },
      config: {}
    },
    cover:
      'http://git.keepwork.com/gitlab_rls_kaitlyn/keepworkdatasource/raw/master/kaitlyn_images/img_1522233836994.jpeg'
  },

  // style 2 左文右图
  {
    data: {
      root: {
        overflow: 'hidden',
        'margin-top': '20px'
      },
      media: {
        height: '300px'
      },
      colMedia: {
        float: 'right'
      },
      subtitle: {
        'margin-top': '10px'
      },
      paragraph: {
        'margin-top': '15px',
        'text-indent': '28px'
      },
      button: {
        'margin-top': '20px'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colMedia: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 10 },
        lg: { span: 10 }
      },
      colGroup: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 13 },
        lg: { span: 13 }
      },
      colButton: {
        span: 6,
        push: 18
      }
    },
    theme: {
      root: ['font_0', 'color_7'],
      paragraph: ['color_8']
    },
    options: {
      theme: {
        title: {
          fontSize: 'font_5',
          fontColor: 'color_8'
        },
        subtitle: {
          fontSize: 'font_2',
          fontColor: 'color_8'
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

  // style 3  左文右图（文字竖排）
  {
    data: {
      root: {
        overflow: 'hidden',
        'margin-top': '20px'
      },
      media: {
        height: '350px'
      },
      colMedia: {
        float: 'right'
      },
      colGroup: {
        height: '350px'
      },
      colGroupItem: {
        height: '300px'
      },
      title: {
        'writing-mode': 'vertical-rl',
        overflow: 'hidden'
      },
      subtitle: {
        'margin-top': '10px',
        'writing-mode': 'vertical-rl',
        overflow: 'hidden'
      },
      paragraph: {
        float: 'right',
        'margin-top': '15px',
        'text-indent': '28px',
        'writing-mode': 'vertical-rl'
      },
      colButton: {
        'margin-top': '20px'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colMedia: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 10 },
        lg: { span: 10 }
      },
      colGroup: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 14 },
        lg: { span: 14 }
      },
      colGroupItem: { span: 24 },
      colTitle: { span: 4 },
      colSubtitle: { span: 4 },
      colParagraph: { span: 16 },
      colButton: {
        span: 6,
        push: 18
      }
    },
    theme: {
      root: ['font_0', 'color_7'],
      paragraph: ['color_8']
    },
    options: {
      theme: {
        title: {
          fontSize: 'font_5',
          fontColor: 'color_8'
        },
        subtitle: {
          fontSize: 'font_2',
          fontColor: 'color_8'
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

  // style 4 上图下文
  {
    data: {
      root: {
        overflow: 'hidden',
        'margin-top': '20px'
      },
      colGroup: {},
      media: {
        height: '300px'
      },
      title: {
        'text-align': 'center'
      },
      subtitle: {
        'margin-top': '10px',
        'text-align': 'center'
      },
      paragraph: {
        'margin-top': '15px',
        'text-indent': '28px'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colMedia: { span: 24 },
      colGroup: { span: 24 },
      colButton: { span: 0 }
    },
    theme: {
      root: ['font_0', 'color_7'],
      paragraph: ['color_8']
    },
    options: {
      theme: {
        title: {
          fontSize: 'font_5',
          fontColor: 'color_8'
        },
        subtitle: {
          fontSize: 'font_2',
          fontColor: 'color_8'
        }
      },
      config: {}
    }
  }
]
