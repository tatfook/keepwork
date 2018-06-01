let emptyData = {
  media: {
    emptySrc: require('@/../static/adi/mixLayer/mix-layer.png'),
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  title: {
    emptyName: 'adi.mixLayer.title',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  subtitle: {
    emptyName: 'adi.mixLayer.subtitle',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  paragraph: {
    emptyData: 'adi.mixLayer.paragraph'
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
      },
      '@media only screen and (min-width: 768px)': {
        colParagraph: {
          height: '490px',
          'overflow': 'auto'
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
    cover: require('@/../static/adi/mixLayer/mix1.png'),
    preview: {
      outter: {
        height: '176px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
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
      },
      '@media only screen and (min-width: 768px)': {
        colParagraph: {
          height: '490px',
          'overflow': 'auto'
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
    cover: require('@/../static/adi/mixLayer/mix2.png'),
    preview: {
      outter: {
        height: '176px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
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
      },
      '@media only screen and (min-width: 768px)': {
        colParagraph: {
          height: '490px',
          'overflow': 'auto'
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
    cover: require('@/../static/adi/mixLayer/mix3.png'),
    preview: {
      outter: {
        height: '176px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
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
      },
      '@media only screen and (min-width: 768px)': {
        colParagraph: {
          height: '300px',
          'overflow': 'auto'
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
    cover: require('@/../static/adi/mixLayer/mix4.png'),
    preview: {
      outter: {
        height: '176px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
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
      },
      '@media only screen and (min-width: 768px)': {
        colParagraph: {
          height: '300px',
          'overflow': 'auto'
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
    cover: require('@/../static/adi/mixLayer/mix5.png'),
    preview: {
      outter: {
        height: '176px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
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
      },
      '@media only screen and (min-width: 768px)': {
        colParagraph: {
          height: '300px',
          'overflow': 'auto'
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
    cover: require('@/../static/adi/mixLayer/mix6.png'),
    preview: {
      outter: {
        height: '176px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
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
      },
      '@media only screen and (min-width: 768px)': {
        colParagraph: {
          height: '150px',
          'overflow': 'auto'
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
    cover: require('@/../static/adi/mixLayer/mix7.png'),
    preview: {
      outter: {
        height: '176px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
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
      },
      '@media only screen and (min-width: 768px)': {
        colParagraph: {
          height: '150px',
          'overflow': 'auto'
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
    cover: require('@/../static/adi/mixLayer/mix8.png'),
    preview: {
      outter: {
        height: '176px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
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
      },
      '@media only screen and (min-width: 768px)': {
        colParagraph: {
          height: '150px',
          'overflow': 'auto'
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
    cover: require('@/../static/adi/mixLayer/mix9.png'),
    preview: {
      outter: {
        height: '176px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
  }
]
