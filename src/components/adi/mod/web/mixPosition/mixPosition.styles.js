export default [
  // style 0 左图右文
  {
    templateID: 0,
    data: {
      // 定义mod根div的样式
      root: {
        overflow: 'hidden',
        padding: '15px'
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
        'text-indent': '28px',
        'word-wrap': 'break-word',
        'white-space': 'pre-wrap'
      },
      button: {
        'margin-top': '20px'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colMedia: {
        xs: { span: 10 },
        sm: { span: 9 },
        md: { span: 8 },
        lg: { span: 7 }
      },
      colGroup: {
        xs: { span: 14 },
        sm: { span: 15 },
        md: { span: 16 },
        lg: { span: 17 }
      },
      colButton: {
        xs: {
          span: 6,
          push: 18
        },
        sm: {
          span: 4,
          push: 20
        },
        md: {
          span: 2,
          push: 22
        },
        lg: {
          span: 2,
          push: 22
        }
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
    cover: './static/adi/mixPosition/cover/projectOne.png'
  },

  // style 1 左文右图
  {
    templateID: 1,
    data: {
      root: {
        overflow: 'hidden',
        padding: '15px'
      },
      media: {
        height: '300px'
      },
      colMedia: {},
      subtitle: {
        'margin-top': '10px'
      },
      paragraph: {
        'margin-top': '15px',
        'text-indent': '28px',
        'word-wrap': 'break-word',
        'white-space': 'pre-wrap'
      },
      button: {
        'margin-top': '20px'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colMedia: {
        xs: { span: 10 },
        sm: { span: 9 },
        md: { span: 8 },
        lg: { span: 7 }
      },
      colGroup: {
        xs: { span: 14 },
        sm: { span: 15 },
        md: { span: 16 },
        lg: { span: 17 }
      },
      colButton: {
        xs: {
          span: 6,
          push: 18
        },
        sm: {
          span: 4,
          push: 20
        },
        md: {
          span: 2,
          push: 22
        },
        lg: {
          span: 2,
          push: 22
        }
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
    cover: './static/adi/mixPosition/cover/projectTwo.png'
  },

  // style 2  左文右图（文字竖排）
  {
    templateID: 1,
    data: {
      root: {
        overflow: 'hidden',
        padding: '15px'
      },
      media: {
        height: '350px'
      },
      colMedia: {},
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
        xs: { span: 10 },
        sm: { span: 9 },
        md: { span: 8 },
        lg: { span: 7 }
      },
      colGroup: {
        xs: { span: 14 },
        sm: { span: 15 },
        md: { span: 16 },
        lg: { span: 17 }
      },
      colGroupItem: { span: 24 },
      colTitle: { span: 4 },
      colSubtitle: { span: 4 },
      colParagraph: { span: 16 },
      colButton: {
        xs: {
          span: 6,
          push: 18
        },
        sm: {
          span: 4,
          push: 20
        },
        md: {
          span: 2,
          push: 22
        },
        lg: {
          span: 2,
          push: 22
        }
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
    cover: './static/adi/mixPosition/cover/projectThree.png'
  },

  // style 3 上图下文
  {
    templateID: 0,
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
        'margin-top': '20px',
        'text-align': 'center'
      },
      subtitle: {
        'margin-top': '10px',
        'text-align': 'center'
      },
      paragraph: {
        'margin-top': '15px',
        'text-indent': '28px',
        'word-wrap': 'break-word',
        'white-space': 'pre-wrap'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colMedia: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: {
          span: 18,
          offset: 3
        },
        lg: {
          span: 18,
          offset: 3
        }
      },
      colGroup: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: {
          span: 18,
          offset: 3
        },
        lg: {
          span: 18,
          offset: 3
        }
      },
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
    },
    cover: './static/adi/mixPosition/cover/projectFour.png'
  },

  // style 4 上文下图
  {
    templateID: 1,
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
        'margin-top': '20px',
        'text-align': 'center'
      },
      subtitle: {
        'margin-top': '10px',
        'text-align': 'center'
      },
      paragraph: {
        'margin-top': '15px',
        'text-indent': '28px',
        'word-wrap': 'break-word',
        'white-space': 'pre-wrap'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colMedia: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: {
          span: 18,
          offset: 3
        },
        lg: {
          span: 18,
          offset: 3
        }
      },
      colGroup: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: {
          span: 18,
          offset: 3
        },
        lg: {
          span: 18,
          offset: 3
        }
      },
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
    },
    cover: './static/adi/mixPosition/cover/projectFive.png'
  }
]
