import _ from 'lodash'

let emptyData = {
  media: {
    emptyMedia: require('@/assets/adi/mixPosition/picture-mod.png'),
    link: '',
    target: '_blank',
    autoplay: true,
    playloop: false,
    poster: ''
  },
  title: {
    emptyInput: 'adi.mixPosition.title',
    emptyLink: '',
    emptyInputPlaceholder: 'titleText',
    emptyLinkTarget: '_blank'
  },
  subtitle: {
    emptyInput: 'adi.mixPosition.subtitle',
    emptyLink: '',
    emptyInputPlaceholder: 'subTitleText',
    emptyLinkTarget: '_blank'
  },
  paragraph: {
    emptyAutoSizeInput: 'adi.mixPosition.paragraph'
  },
  button: {
    emptyInput: 'adi.mixPosition.button',
    emptyInputPlaceholder: 'buttonText',
    emptyLink: '',
    emptyLinkTarget: '_blank'
  }
}

export default [
  // style 0 左图右文
  {
    templateID: 0,
    data: {
      // 定义mod根div的样式
      colGroupARow: {
        display: 'flex',
        'align-items': 'center'
      },
      colGroupAA: {
        'word-wrap': 'break-word',
        height: '100%'
      },
      title: {
        'margin-top': '20px'
      },
      subtitle: {
        'margin-top': '10px'
      },
      paragraph: {
        'margin-top': '15px'
      },
      button: {
        'margin-top': '20px'
      },
      '@media only screen and (max-width: 767px)': {
        colGroupARow: {
          display: 'block'
        }
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
      title: ['bigtitle', 'tColor'],
      subtitle: ['subtitle', 'sColor'],
      paragraph: ['paragraphType', 'phoneFontsColor'],
      button: ['buttonText', 'fontsColor']
    },
    options: {
      theme: {
        button: {
          buttonStyle: {
            'background-color': 'tColor'
          }
        }
      },
      config: {
        ...emptyData,
        media: _.merge({}, emptyData.media, {
          img: {
            defaultWebHeight: '611px',
            defaultMobileHeight: '300px',
            defaultWebWidth: 'auto',
            defaultMobileWidth: 'auto'
          }
        })
      }
    },
    cover: ''
  },

  // style 1 左文右图
  {
    templateID: 1,
    data: {
      '@media only screen and (min-width: 767px)': {
        colGroupARow: {
          display: 'flex',
          'align-items': 'center'
        },
        colGroupAA: {
          'word-wrap': 'break-word'
        }
      },
      '@media only screen and (max-width: 767px)': {
        colGroupARow: {
          display: 'block'
        },
        title: {
          'margin-top': '0'
        },
        colMedia: {
          'margin-top': '20px'
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
      title: ['font_1', 'tColor'],
      subtitle: ['font_3', 'sColor'],
      paragraph: ['font_9', 'phoneFontsColor'],
      button: ['font_10', 'fontsColor']
    },
    options: {
      theme: {
        button: {
          buttonStyle: {
            'background-color': 'tColor'
          }
        }
      },
      config: {
        ...emptyData,
        media: _.merge({}, emptyData.media, {
          img: {
            defaultWebHeight: '611px',
            defaultMobileHeight: '300px',
            defaultWebWidth: 'auto',
            defaultMobileWidth: 'auto'
          }
        })
      }
    },
    cover: ''
  },

  // style 2  左文右图（文字竖排）
  {
    templateID: 2,
    data: {
      colMedia: { 'float': 'right' },
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
          'float': 'right',
          'margin-top': '15px',
          'max-width': '396px',
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
      title: ['font_1', 'tColor'],
      subtitle: ['font_3', 'sColor'],
      paragraph: ['font_9', 'phoneFontsColor'],
      button: ['font_10', 'fontsColor']
    },
    options: {
      theme: {
        button: {
          buttonStyle: {
            'background-color': 'tColor'
          }
        }
      },
      config: {
        ...emptyData,
        media: _.merge({}, emptyData.media, {
          img: {
            defaultWebHeight: '700px',
            defaultMobileHeight: '300px',
            defaultWebWidth: 'auto',
            defaultMobileWidth: 'auto'
          }
        })
      }
    },
    cover: ''
  },

  // style 3 上图下文
  {
    templateID: 0,
    data: {
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
      title: ['font_1', 'tColor'],
      subtitle: ['font_3', 'sColor'],
      paragraph: ['font_9', 'phoneFontsColor']
    },
    options: {
      theme: {},
      config: {
        ...emptyData,
        media: _.merge({}, emptyData.media, {
          img: {
            defaultWebHeight: '550px',
            defaultMobileHeight: '300px',
            defaultWebWidth: 'auto',
            defaultMobileWidth: 'auto'
          }
        })
      }
    },
    cover: ''
  },

  // style 4 上文下图
  {
    templateID: 1,
    data: {
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
      title: ['font_1', 'tColor'],
      subtitle: ['font_3', 'sColor'],
      paragraph: ['font_9', 'phoneFontsColor']
    },
    options: {
      theme: {},
      config: {
        ...emptyData,
        media: _.merge({}, emptyData.media, {
          img: {
            defaultWebHeight: '611px',
            defaultMobileHeight: '300px',
            defaultWebWidth: 'auto',
            defaultMobileWidth: 'auto'
          }
        })
      }
    },
    cover: ''
  }
]
