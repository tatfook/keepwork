let emptyData = {
  media: {
    emptySrc: require('@/../static/adi/mixPosition/picture-mod.png'),
    emptyLink: 'http://keepwork.com'
  },
  title: {
    emptyName: '一个人，一条路，人在途中',
    emptyLink: 'http://keepwork.com'
  },
  subtitle: {
    emptyName: '我们一直在旅行',
    emptyLink: 'http://keepwork.com'
  },
  paragraph: {
    emptyData: `一个人去旅行，而且是去故乡的山水间徜徉。临行之前，面对太多的疑问和不解：为何是一个人？也有善意的提醒：何不去远方！昆明呀——赶一个花海；三亚呀——赴一个蓝天碧海。只是微笑地固执自己的坚持，不做任何解释。没有人明白，这一次是一个告别，或者一个永远的告别，以后我会去到很多很繁华或苍凉，辽远或偏僻的地方，而会常常想起这一次的旅行，想起那座山，那个城，那些人……`
  },
  button: {
    emptyName: '查看更多',
    emptyLink: 'http://keepwork.com'
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
      colGroupARow: { gutter: 24 },
      colMedia: {
        xs: { span: 10 },
        sm: { span: 8 }
      },
      colGroupAA: {
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
      colGroupRow: ['mod-full-width'],
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
      config: {
        ...emptyData
      }
    },
    cover: require('@/../static/adi/mixPosition/cover/projectOne.png')
  },

  // style 1 左文右图
  {
    templateID: 1,
    data: {
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
      colGroupARow: { gutter: 24 },
      colMedia: {
        xs: { span: 10 },
        sm: { span: 8 }
      },
      colGroupAA: {
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
      colGroupRow: ['mod-full-width'],
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
      config: {
        ...emptyData
      }
    },
    cover: require('@/../static/adi/mixPosition/cover/projectTwo.png')
  },

  // style 2  左文右图（文字竖排）
  {
    templateID: 2,
    data: {
      colTitle: {
        height: '700px'
      },
      colSubtitle: {
        height: '700px'
      },
      colGroupAA: {
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
        colGroupAA: {
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
      colGroupARow: { gutter: 14 },
      colTitle: {
        xs: { span: 2 },
        sm: { span: 1 }
      },
      colSubtitle: {
        xs: { span: 1 },
        sm: { span: 1 }
      },
      colGroupAA: {
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
      colGroupRow: ['mod-full-width'],
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
      config: {
        ...emptyData
      }
    },
    cover: require('@/../static/adi/mixPosition/cover/projectThree.png')
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
      colGroupAA: {
        xs: { span: 24 },
        sm: { span: 24 }
      },
      colButton: { span: 0 }
    },
    theme: {
      root: ['font_0', 'color_7', 'mod-space'],
      colGroupRow: ['mod-full-width'],
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
      config: {
        ...emptyData
      }
    },
    cover: require('@/../static/adi/mixPosition/cover/projectFour.png')
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
      colGroupAA: {
        xs: { span: 24 },
        sm: { span: 24 }
      },
      colButton: { span: 0 }
    },
    theme: {
      root: ['font_0', 'color_7', 'mod-space'],
      colGroupRow: ['mod-full-width'],
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
      config: {
        ...emptyData
      }
    },
    cover: require('@/../static/adi/mixPosition/cover/projectFive.png')
  }
]
