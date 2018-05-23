let emptyData = {
  media: {
    emptySrc: require('@/../static/adi/mixPosition/picture-mod.png'),
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  title: {
    emptyName: 'adi.mixPosition.title',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  subtitle: {
    emptyName: 'adi.mixPosition.subtitle',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  paragraph: {
    emptyData: 'adi.mixPosition.paragraph'
  },
  button: {
    emptyName: 'adi.mixPosition.button',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  }
}

export default [
  // style 0 左图右文
  {
    templateID: 0,
    data: {
      // 定义mod根div的样式
      media: {
        height: '611px'
      },
      '@media only screen and (max-width: 767px)': {
        media: {
          height: '300px'
        }
      },
      colGroupAA: {
        'word-wrap': 'break-word'
      },
      title: {
        'margin-top': '20px'
      },
      subtitle: {
        'margin-top': '10px'
      },
      paragraph: {
        'margin-top': '15px',
        'text-indent': '28px',
        'white-space': 'pre-wrap'
      },
      button: {
        'margin-top': '20px'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colGroupARow: { gutter: 24 },
      colMedia: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      colGroupAA: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      colButton: {
        xs: { span: 24 },
        sm: {
          span: 3,
          push: 21
        }
      }
    },
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width'],
      title: ['font_1', 'color_7'],
      subtitle: ['font_3', 'color_2'],
      paragraph: ['font_9', 'color_4'],
      button: ['font_10', 'color_0']
    },
    options: {
      theme: {
        button: {
          buttonStyle: {
            'background-color': 'color_7'
          }
        }
      },
      config: {
        ...emptyData
      }
    },
    cover: require('@/../static/adi/mixPosition/cover/projectOne.png'),
    preview: {
      outter: {
        height: '155px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
  },

  // style 1 左文右图
  {
    templateID: 0,
    data: {
      colMedia: {
        float: 'right'
      },
      media: {
        height: '611px'
      },
      colGroupAA: {
        'word-wrap': 'break-word'
      },
      '@media only screen and (max-width: 767px)': {
        media: {
          height: '300px'
        }
      },
      title: {
        'margin-top': '20px'
      },
      subtitle: {
        'margin-top': '10px'
      },
      paragraph: {
        'margin-top': '15px',
        'text-indent': '28px',
        'white-space': 'pre-wrap'
      },
      button: {
        'margin-top': '20px'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colGroupARow: { gutter: 24 },
      colMedia: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      colGroupAA: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      colButton: {
        xs: { span: 24 },
        sm: {
          span: 3,
          push: 21
        }
      }
    },
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width'],
      title: ['font_1', 'color_7'],
      subtitle: ['font_3', 'color_2'],
      paragraph: ['font_9', 'color_4'],
      button: ['font_10', 'color_0']
    },
    options: {
      theme: {
        button: {
          buttonStyle: {
            'background-color': 'color_7'
          }
        }
      },
      config: {
        ...emptyData
      }
    },
    cover: require('@/../static/adi/mixPosition/cover/projectTwo.png'),
    preview: {
      outter: {
        height: '155px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
  },

  // style 2  左文右图（文字竖排）
  {
    templateID: 2,
    data: {
      colMedia: { float: 'right' },
      media: {
        height: '300px'
      },
      colGroupA: {
        'word-wrap': 'break-word'
      },
      title: {
        'margin-top': '20px'
      },
      subtitle: {
        'margin-top': '10px'
      },
      paragraph: {
        'margin-top': '15px',
        'text-indent': '28px',
        'white-space': 'pre-wrap'
      },
      colButton: {
        'margin-top': '18px'
      },
      '@media only screen and (min-width: 768px)': {
        colTitle: { height: '700px' },
        colSubtitle: { height: '700px' },
        colGroupAA: { height: '700px' },
        colParagraph: { height: '646px' },
        media: { height: '700px' },
        colGroupA: {
          'word-wrap': 'normal',
          overflow: 'hidden'
        },
        title: {
          'margin-top': '0',
          'max-width': '45px',
          'line-height': '45px',
          'writing-mode': 'tb-rl',
          'overflow-x': 'auto'
        },
        subtitle: {
          'margin-top': '0',
          'max-width': '30px',
          'line-height': '30px',
          'writing-mode': 'tb-rl',
          'overflow-x': 'auto'
        },
        paragraph: {
          float: 'right',
          'margin-top': '15px',
          'max-width': '396px',
          'text-indent': '28px',
          'writing-mode': 'tb-rl',
          'overflow-x': 'auto'
        }
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colGroupARow: { gutter: 14 },
      colTitle: {
        xs: { span: 24 },
        sm: { span: 2 }
      },
      colSubtitle: {
        xs: { span: 24 },
        sm: { span: 1 }
      },
      colGroupAA: {
        xs: { span: 24 },
        sm: { span: 9 }
      },
      colMedia: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      colParagraph: { span: 24 },
      colButton: {
        xs: { span: 24 },
        sm: {
          span: 4,
          push: 20
        }
      }
    },
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width'],
      title: ['font_1', 'color_7'],
      subtitle: ['font_3', 'color_2'],
      paragraph: ['font_9', 'color_4'],
      button: ['font_10', 'color_0']
    },
    options: {
      theme: {
        button: {
          buttonStyle: {
            'background-color': 'color_7'
          }
        }
      },
      config: {
        ...emptyData
      }
    },
    cover: require('@/../static/adi/mixPosition/cover/projectThree.png'),
    preview: {
      outter: {
        height: '155px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
  },

  // style 3 上图下文
  {
    templateID: 0,
    data: {
      media: {
        height: '550px'
      },
      '@media only screen and (max-width: 767px)': {
        media: {
          height: '300px'
        }
      },
      colGroupAA: {
        'word-wrap': 'break-word'
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
        'white-space': 'pre-wrap'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colMedia: {
        xs: { span: 24 },
        sm: { span: 24 }
      },
      colGroupAA: {
        xs: { span: 24 },
        sm: { span: 24 }
      },
      colButton: { span: 0 }
    },
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width'],
      title: ['font_1', 'color_7'],
      subtitle: ['font_3', 'color_2'],
      paragraph: ['font_9', 'color_4']
    },
    options: {
      theme: {},
      config: {
        ...emptyData
      }
    },
    cover: require('@/../static/adi/mixPosition/cover/projectFour.png'),
    preview: {
      outter: {
        height: '186px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
  },

  // style 4 上文下图
  {
    templateID: 1,
    data: {
      media: {
        height: '550px'
      },
      '@media only screen and (max-width: 767px)': {
        media: {
          height: '300px'
        }
      },
      colGroupAA: {
        'word-wrap': 'break-word'
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
        'margin-bottom': '20px',
        'text-indent': '28px',
        'white-space': 'pre-wrap'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colMedia: {
        xs: { span: 24 },
        sm: { span: 24 }
      },
      colGroupAA: {
        xs: { span: 24 },
        sm: { span: 24 }
      },
      colButton: { span: 0 }
    },
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width'],
      title: ['font_1', 'color_7'],
      subtitle: ['font_3', 'color_2'],
      paragraph: ['font_9', 'color_4']
    },
    options: {
      theme: {},
      config: {
        ...emptyData
      }
    },
    cover: require('@/../static/adi/mixPosition/cover/projectFive.png'),
    preview: {
      outter: {
        height: '189px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
  }
]
