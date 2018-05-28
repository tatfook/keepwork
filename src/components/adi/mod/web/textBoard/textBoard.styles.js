let emptyData = {
  subtitle: {
    emptyName: 'adi.mixPosition.subtitle',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  title: {
    emptyName: 'adi.text.title',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  paragraph: {
    emptyData: 'adi.text.paragraph'
  },
  board: {
    desc: 'adi.board.desc'
  }
}
export default [
  {
    templateID: 0,
    data: {
      colBoard: {
        'margin-bottom': '10px'
      },
      title: {
        'text-align': 'center',
        'margin-bottom': '10px'
      },
      subtitle: {
        'text-align': 'center',
        'margin-bottom': '10px'
      },
      paragraph: {
        'text-align': 'center'
      }
    },
    props: {},
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width'],
      title: ['font_2', 'color_4'],
      subtitle: ['font_4', 'color_4'],
      paragraph: ['font_9', 'color_4']
    },
    options: {
      theme: {},
      config: { ...emptyData }
    },
    preview: {
      outter: {
        height: '198.98px'
      },
      inner: {
        'margin-top': '-21.06px'
      }
    }
  },
  {
    templateID: 1,
    data: {
      title: {
        'text-align': 'center',
        'margin-bottom': '10px'
      },
      subtitle: {
        'text-align': 'center',
        'margin-bottom': '10px'
      },
      paragraph: {
        'text-align': 'center',
        'margin-bottom': '10px'
      }
    },
    props: {},
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width'],
      title: ['font_2', 'color_4'],
      subtitle: ['font_4', 'color_4'],
      paragraph: ['font_9', 'color_4']
    },
    options: {
      theme: {},
      config: { ...emptyData }
    },
    preview: {
      outter: {
        height: '198.98px'
      },
      inner: {
        'margin-top': '-21.06px'
      }
    }
  },
  {
    templateID: 2,
    data: {
      title: {
        'text-align': 'center',
        'margin-bottom': '10px'
      },
      subtitle: {
        'text-align': 'center',
        'margin-bottom': '10px'
      },
      paragraph: {
        'text-align': 'center'
      },
      colBoard: {
        width: '50%',
        'overflow-y': 'auto'
      },
      colGroupAA: {
        width: '50%'
      },
      '@media only screen and (max-width: 768px)': {
        colBoard: {
          width: '100%',
          'overflow-y': 'visible'
        },
        colGroupAA: {
          width: '100%'
        }
      }
    },
    props: {},
    theme: {
      root: ['mod-space'],
      colGroupARow: ['mod-full-width'],
      title: ['font_2', 'color_4'],
      subtitle: ['font_4', 'color_4'],
      paragraph: ['font_9', 'color_4']
    },
    options: {
      theme: {},
      config: { ...emptyData }
    },
    preview: {
      outter: {
        height: '141.78px'
      },
      inner: {
        'margin-top': '-21.06px'
      }
    }
  },
  {
    templateID: 3,
    data: {
      title: {
        'text-align': 'center',
        'margin-bottom': '10px'
      },
      subtitle: {
        'text-align': 'center',
        'margin-bottom': '10px'
      },
      paragraph: {
        'text-align': 'center'
      },
      colBoard: {
        width: '50%',
        'overflow-y': 'auto'
      },
      colGroupAA: {
        width: '50%'
      },
      '@media only screen and (max-width: 768px)': {
        colBoard: {
          width: '100%',
          'overflow-y': 'visible'
        },
        colGroupAA: {
          width: '100%'
        }
      }
    },
    props: {},
    theme: {
      root: ['mod-space'],
      colGroupARow: ['mod-full-width'],
      title: ['font_2', 'color_4'],
      subtitle: ['font_4', 'color_4'],
      paragraph: ['font_9', 'color_4']
    },
    options: {
      theme: {},
      config: { ...emptyData }
    },
    preview: {
      outter: {
        height: '141.78px'
      },
      inner: {
        'margin-top': '-21.06px'
      }
    }
  }
]
