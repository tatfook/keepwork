let emptyData = {
  media: {
    emptySrc: require('@/../static/adi/mixLayer/mix-layer.png'),
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  title: {
    emptyName: '加利福尼亚大学',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  subtitle: {
    emptyName: '顶尖研究型大学',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  paragraph: {
    emptyData:
      '加利福尼亚大学伯克利分校是美国最负盛名且是最顶尖的一所公立研究型大学，位于旧金山东湾伯克利市的山丘上。1868年由加利福尼亚学院以及农业、矿业和机械学院合并而成，1873年迁至圣弗朗西斯科（旧金山）附近的伯克利市。伯克利加大是加利福尼亚大学中最老的一所。它也是美国大学协会（Association of American Universities）创始会员之一。其吉祥物蜕变自加州徽号，故其学生亦常自称“金色小熊”。加州大学伯克利分校与斯坦福大学、麻省理工学院等一同被誉为美国工程科技界的学术领袖。'
  }
}
export default [
  // style 0
  {
    templateID: 0,
    data: {
      root: {
        overflow: 'hidden',
        position: 'relative'
      },
      media: {
        height: '689px',
        position: 'relative',
        'z-index': 1
      },
      colGroup: {
        height: '689px'
      },
      colCouple: {
        'margin-top': '-600px',
        position: 'relative',
        'word-wrap': 'break-word',
        'z-index': 2
      },
      title: {
        'margin-bottom': '5px'
      },
      colCoupleRow: {
        'padding-left': '5%',
        'padding-right': '15%'
      },
      '@media only screen and (max-width: 768px)': {
        media: {
          height: '344px'
        },
        colGroup: {
          height: '344px'
        },
        colCouple: {
          'margin-top': '20px',
          'text-align': 'left'
        },
        colCoupleRow: {
          'padding-left': '20px',
          'padding-right': '20px'
        }
      }
    },
    props: {
      colGroup: { span: 24 },
      colCouple: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      media: ['mod-full-width'],
      title: ['font_1', 'color_1'],
      subtitle: ['font_3', 'color_1'],
      colCoupleRow: ['mod-full-width'],
      paragraph: ['font_9', 'color_1']
    },
    options: {
      config: { ...emptyData }
    },
    cover: require('@/../static/adi/mixLayer/mix1.png')
  },
  // style 1
  {
    templateID: 0,
    data: {
      root: {
        overflow: 'hidden',
        position: 'relative'
      },
      media: {
        height: '689px',
        position: 'relative',
        'z-index': 1
      },
      colGroup: {
        height: '689px'
      },
      colCouple: {
        'margin-top': '-600px',
        'word-wrap': 'break-word',
        position: 'relative',
        'text-align': 'center',
        'z-index': 2
      },
      title: {
        'margin-bottom': '5px'
      },
      colCoupleRow: {
        'padding-left': '10%',
        'padding-right': '10%'
      },
      '@media only screen and (max-width: 768px)': {
        media: {
          height: '344px'
        },
        colGroup: {
          height: '344px'
        },
        colCouple: {
          'margin-top': '20px',
          'text-align': 'center'
        },
        colCoupleRow: {
          'padding-left': '20px',
          'padding-right': '20px'
        }
      }
    },
    props: {
      colGroup: { span: 24 },
      colCouple: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      media: ['mod-full-width'],
      title: ['font_1', 'color_1'],
      subtitle: ['font_3', 'color_1'],
      colCoupleRow: ['mod-full-width'],
      paragraph: ['font_9', 'color_1']
    },
    options: {
      config: { ...emptyData }
    },
    cover: require('@/../static/adi/mixLayer/mix2.png')
  },
  // style 2
  {
    templateID: 0,
    data: {
      root: {
        overflow: 'hidden',
        position: 'relative'
      },
      media: {
        height: '689px',
        position: 'relative',
        'z-index': 1
      },
      colGroup: {
        height: '689px'
      },
      title: {
        'margin-bottom': '5px'
      },
      colCouple: {
        'margin-top': '-600px',
        'word-wrap': 'break-word',
        'text-align': 'right',
        position: 'relative',
        'z-index': 2
      },
      colCoupleRow: {
        'padding-left': '15%',
        'padding-right': '5%'
      },
      '@media only screen and (max-width: 768px)': {
        media: {
          height: '344px'
        },
        colGroup: {
          height: '344px'
        },
        colCouple: {
          'margin-top': '20px',
          'text-align': 'right'
        },
        colCoupleRow: {
          'padding-left': '20px',
          'padding-right': '20px'
        }
      }
    },
    props: {
      colGroup: { span: 24 },
      colCouple: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      media: ['mod-full-width'],
      title: ['font_1', 'color_1'],
      subtitle: ['font_3', 'color_1'],
      colCoupleRow: ['mod-full-width'],
      paragraph: ['font_9', 'color_1']
    },
    options: {
      config: { ...emptyData }
    },
    cover: require('@/../static/adi/mixLayer/mix3.png')
  },
  // style 3
  {
    templateID: 0,
    data: {
      root: {
        overflow: 'hidden',
        position: 'relative'
      },
      media: {
        height: '689px',
        position: 'relative',
        'z-index': 1
      },
      colGroup: {
        height: '689px'
      },
      colCouple: {
        'margin-top': '-400px',
        position: 'relative',
        'z-index': 2
      },
      title: {
        'margin-bottom': '5px'
      },
      colCoupleRow: {
        'padding-left': '5%',
        'padding-right': '15%'
      },
      '@media only screen and (max-width: 768px)': {
        media: {
          height: '344px'
        },
        colGroup: {
          height: '344px'
        },
        colCouple: {
          'margin-top': '20px',
          'text-align': 'left'
        },
        colCoupleRow: {
          'padding-left': '20px',
          'padding-right': '20px'
        }
      }
    },
    props: {
      colGroup: { span: 24 },
      colCouple: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      media: ['mod-full-width'],
      title: ['font_1', 'color_1'],
      subtitle: ['font_3', 'color_1'],
      colCoupleRow: ['mod-full-width'],
      paragraph: ['font_9', 'color_1']
    },
    options: {
      config: { ...emptyData }
    },
    cover: require('@/../static/adi/mixLayer/mix4.png')
  },
  // style 4
  {
    templateID: 0,
    data: {
      root: {
        overflow: 'hidden',
        position: 'relative'
      },
      media: {
        height: '689px',
        position: 'relative',
        'z-index': 1
      },
      colGroup: {
        height: '689px'
      },
      colCouple: {
        'margin-top': '-400px',
        'text-align': 'center',
        position: 'relative',
        'z-index': 2
      },
      title: {
        'margin-bottom': '5px'
      },
      colCoupleRow: {
        'padding-left': '10%',
        'padding-right': '10%'
      },
      '@media only screen and (max-width: 768px)': {
        media: {
          height: '344px'
        },
        colGroup: {
          height: '344px'
        },
        colCouple: {
          'margin-top': '20px',
          'text-align': 'center'
        },
        colCoupleRow: {
          'padding-left': '20px',
          'padding-right': '20px'
        }
      }
    },
    props: {
      colGroup: { span: 24 },
      colCouple: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      media: ['mod-full-width'],
      title: ['font_1', 'color_1'],
      subtitle: ['font_3', 'color_1'],
      colCoupleRow: ['mod-full-width'],
      paragraph: ['font_9', 'color_1']
    },
    options: {
      config: { ...emptyData }
    },
    cover: require('@/../static/adi/mixLayer/mix5.png')
  },
  // style 5
  {
    templateID: 0,
    data: {
      root: {
        overflow: 'hidden',
        position: 'relative'
      },
      media: {
        height: '689px',
        position: 'relative',
        'z-index': 1
      },
      colGroup: {
        height: '689px'
      },
      colCouple: {
        'margin-top': '-400px',
        'text-align': 'right',
        position: 'relative',
        'z-index': 2
      },
      title: {
        'margin-bottom': '5px'
      },
      colCoupleRow: {
        'padding-left': '15%',
        'padding-right': '5%'
      },
      '@media only screen and (max-width: 768px)': {
        media: {
          height: '344px'
        },
        colGroup: {
          height: '344px'
        },
        colCouple: {
          'margin-top': '20px',
          'text-align': 'right'
        },
        colCoupleRow: {
          'padding-left': '20px',
          'padding-right': '20px'
        }
      }
    },
    props: {
      colGroup: { span: 24 },
      colCouple: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      media: ['mod-full-width'],
      title: ['font_1', 'color_1'],
      subtitle: ['font_3', 'color_1'],
      colCoupleRow: ['mod-full-width'],
      paragraph: ['font_9', 'color_1']
    },
    options: {
      config: { ...emptyData }
    },
    cover: require('@/../static/adi/mixLayer/mix6.png')
  },
  // style 6
  {
    templateID: 0,
    data: {
      root: {
        overflow: 'hidden',
        position: 'relative'
      },
      media: {
        height: '689px',
        position: 'relative',
        'z-index': 1
      },
      colGroup: {
        height: '689px'
      },
      colCouple: {
        'margin-top': '-250px',
        position: 'relative',
        'z-index': 2
      },
      title: {
        'margin-bottom': '5px'
      },
      colCoupleRow: {
        'padding-left': '5%',
        'padding-right': '15%'
      },
      '@media only screen and (max-width: 768px)': {
        media: {
          height: '344px'
        },
        colGroup: {
          height: '344px'
        },
        colCouple: {
          'margin-top': '20px',
          'text-align': 'left'
        },
        colCoupleRow: {
          'padding-left': '20px',
          'padding-right': '20px'
        }
      }
    },
    props: {
      colGroup: { span: 24 },
      colCouple: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      media: ['mod-full-width'],
      title: ['font_1', 'color_1'],
      subtitle: ['font_3', 'color_1'],
      colCoupleRow: ['mod-full-width'],
      paragraph: ['font_9', 'color_1']
    },
    options: {
      config: { ...emptyData }
    },
    cover: require('@/../static/adi/mixLayer/mix7.png')
  },
  // style 7
  {
    templateID: 0,
    data: {
      root: {
        overflow: 'hidden',
        position: 'relative'
      },
      media: {
        height: '689px',
        position: 'relative',
        'z-index': 1
      },
      colGroup: {
        height: '689px'
      },
      colCouple: {
        'margin-top': '-250px',
        'text-align': 'center',
        position: 'relative',
        'z-index': 2
      },
      title: {
        'margin-bottom': '5px'
      },
      colCoupleRow: {
        'padding-left': '10%',
        'padding-right': '10%'
      },
      '@media only screen and (max-width: 768px)': {
        media: {
          height: '344px'
        },
        colGroup: {
          height: '344px'
        },
        colCouple: {
          'margin-top': '20px',
          'text-align': 'center'
        },
        colCoupleRow: {
          'padding-left': '20px',
          'padding-right': '20px'
        }
      }
    },
    props: {
      colGroup: { span: 24 },
      colCouple: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      media: ['mod-full-width'],
      title: ['font_1', 'color_1'],
      subtitle: ['font_3', 'color_1'],
      colCoupleRow: ['mod-full-width'],
      paragraph: ['font_9', 'color_1']
    },
    options: {
      config: { ...emptyData }
    },
    cover: require('@/../static/adi/mixLayer/mix8.png')
  },
  // style 8
  {
    templateID: 0,
    data: {
      root: {
        overflow: 'hidden',
        position: 'relative'
      },
      media: {
        height: '689px',
        position: 'relative',
        'z-index': 1
      },
      colGroup: {
        height: '689px'
      },
      colCouple: {
        'margin-top': '-250px',
        'text-align': 'right',
        position: 'relative',
        'z-index': 2
      },
      title: {
        'margin-bottom': '5px'
      },
      colCoupleRow: {
        'padding-left': '15%',
        'padding-right': '5%'
      },
      '@media only screen and (max-width: 768px)': {
        media: {
          height: '344px'
        },
        colGroup: {
          height: '344px'
        },
        colCouple: {
          'margin-top': '20px',
          'text-align': 'right'
        },
        colCoupleRow: {
          'padding-left': '20px',
          'padding-right': '20px'
        }
      }
    },
    props: {
      colGroup: { span: 24 },
      colCouple: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      media: ['mod-full-width'],
      title: ['font_1', 'color_1'],
      subtitle: ['font_3', 'color_1'],
      colCoupleRow: ['mod-full-width'],
      paragraph: ['font_9', 'color_1']
    },
    options: {
      config: { ...emptyData }
    },
    cover: require('@/../static/adi/mixLayer/mix9.png')
  }
]
