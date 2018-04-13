export default [
  // style 0 左图右文
  {
    templateID: 0,
    data: {
      // 定义mod根div的样式
      root: {
        overflow: 'hidden'
      },
      media: {
        height: '611px'
      },
      '@media only screen and (max-width: 767px)': {
        media: {
          height: '300px'
        }
      },
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
      colModItemRow: { gutter: 24 },
      colMedia: {
        xs: { span: 10 },
        sm: { span: 8 }
      },
      colGroup: {
        xs: { span: 14 },
        sm: { span: 16 }
      },
      colButton: {
        xs: {
          span: 6,
          push: 18
        },
        sm: {
          span: 3,
          push: 21
        }
      }
    },
    theme: {
      root: ['font_0', 'color_7', 'mod-space'],
      colModRow: ['mod-full-width'],
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
        overflow: 'hidden'
      },
      media: {
        height: '611px'
      },
      '@media only screen and (max-width: 767px)': {
        media: {
          height: '300px'
        }
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
      colModItemRow: { gutter: 24 },
      colMedia: {
        xs: { span: 10 },
        sm: { span: 8 }
      },
      colGroup: {
        xs: { span: 14 },
        sm: { span: 16 }
      },
      colButton: {
        xs: {
          span: 6,
          push: 18
        },
        sm: {
          span: 3,
          push: 21
        }
      }
    },
    theme: {
      root: ['font_0', 'color_7', 'mod-space'],
      colModRow: ['mod-full-width'],
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
    templateID: 2,
    data: {
      root: {
        overflow: 'hidden'
      },
      colTitle: {
        height: '700px'
      },
      colSubtitle: {
        height: '700px'
      },
      colGroup: {
        height: '700px'
      },
      colParagraph: {
        height: '646px'
      },
      media: {
        height: '700px'
      },
      '@media only screen and (max-width: 767px)': {
        colTitle: {
          height: '350px'
        },
        colSubtitle: {
          height: '350px'
        },
        colGroup: {
          height: '350px'
        },
        colParagraph: {
          height: '300px'
        },
        media: {
          height: '350px'
        },
        paragraph: {
          'max-width': '180px'
        }
      },
      title: {
        'writing-mode': 'vertical-rl',
        overflow: 'hidden'
      },
      subtitle: {
        'writing-mode': 'vertical-rl',
        overflow: 'hidden'
      },
      paragraph: {
        float: 'right',
        'max-width': '420px',
        'text-indent': '28px',
        'writing-mode': 'vertical-rl'
      },
      colButton: {
        'margin-top': '18px'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colModItemRow: { gutter: 14 },
      colTitle: {
        xs: { span: 2 },
        sm: { span: 1 }
      },
      colSubtitle: {
        xs: { span: 1 },
        sm: { span: 1 }
      },
      colGroup: {
        xs: { span: 9 },
        sm: { span: 9 }
      },
      colMedia: {
        xs: { span: 12 },
        sm: { span: 13 }
      },
      colParagraph: { span: 24 },
      colButton: {
        xs: {
          span: 10,
          push: 14
        },
        sm: {
          span: 4,
          push: 20
        }
      }
    },
    theme: {
      root: ['font_0', 'color_7', 'mod-space'],
      colModRow: ['mod-full-width'],
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
        overflow: 'hidden'
      },
      media: {
        height: '550px'
      },
      '@media only screen and (max-width: 767px)': {
        media: {
          height: '300px'
        }
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
        sm: { span: 24 }
      },
      colGroup: {
        xs: { span: 24 },
        sm: { span: 24 }
      },
      colButton: { span: 0 }
    },
    theme: {
      root: ['font_0', 'color_7', 'mod-space'],
      colModRow: ['mod-full-width'],
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
        overflow: 'hidden'
      },
      media: {
        height: '550px'
      },
      '@media only screen and (max-width: 767px)': {
        media: {
          height: '300px'
        }
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
        sm: { span: 24 }
      },
      colGroup: {
        xs: { span: 24 },
        sm: { span: 24 }
      },
      colButton: { span: 0 }
    },
    theme: {
      root: ['font_0', 'color_7', 'mod-space'],
      colModRow: ['mod-full-width'],
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
