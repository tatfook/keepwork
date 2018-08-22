let emptyData = {
  titleA: {
    emptyName: 'adi.text.titleA',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  titleB: {
    emptyName: 'adi.text.titleB',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  titleC: {
    emptyName: 'adi.text.titleC',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  titleD: {
    emptyName: 'adi.text.titleD',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  subtitleA: {
    emptyName: 'adi.text.subtitleA',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  subtitleB: {
    emptyName: 'adi.text.subtitleB',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  subtitleC: {
    emptyName: 'adi.text.subtitleC',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  subtitleD: {
    emptyName: 'adi.text.subtitleD',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  paragraphA: {
    emptyData: 'adi.text.paragraphA'
  },
  paragraphB: {
    emptyData: 'adi.text.paragraphB'
  },
  paragraphC: {
    emptyData: 'adi.text.paragraphC'
  },
  paragraphD: {
    emptyData: 'adi.text.paragraphD'
  },
  buttonA: {
    emptyName: 'adi.text.button',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  buttonB: {
    emptyName: 'adi.text.button',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  buttonC: {
    emptyName: 'adi.text.button',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  buttonD: {
    emptyName: 'adi.text.button',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  title: {
    emptyName: 'adi.text.title',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  paragraph: {
    emptyData: 'adi.text.paragraph'
  }
}

export default [
  // style 0
  {
    data: {
      title: {
        'text-align': 'left',
        'margin-bottom': '20px'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width'],
      title: ['bigtitle', 'title'],
      paragraph: ['auxiliaryText', 'paragraph']
    },
    options: {
      theme: {},
      config: { ...emptyData }
    },
    cover: require('@/../static/adi/text/text1.png'),
    preview: {
      outter: {
        height: '70px'
      }
    }
  },
  // style 1
  {
    data: {
      title: {
        'text-align': 'center',
        'margin-bottom': '20px'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width'],
      title: ['bigtitle', 'title'],
      paragraph: ['auxiliaryText', 'paragraph']
    },
    options: {
      theme: {},
      config: { ...emptyData }
    },
    cover: require('@/../static/adi/text/text2.png'),
    preview: {
      outter: {
        height: '70px'
      }
    }
  },
  // style 2
  {
    data: {},
    props: {},
    theme: {
      root: ['mod-space', 'rootColor', 'fontsColor'],
      paragraph: ['mod-full-width', 'auxiliaryText']
    },
    options: {
      theme: {},
      config: {
        paragraph: emptyData.paragraph
      }
    },
    preview: {
      outter: {
        height: '70px'
      }
    }
  },
  // style 3
  {
    templateID: 2,
    data: {
      colGroupRow: {
        display: 'flex',
        'flex-direction': 'row',
        'align-items': 'flex-start',
        'justify-content': 'center'
      },
      colGroupA: {
        width: '22%'
      },
      colGroupB: {
        width: '22%',
        margin: '0 2% 0 2%'
      },
      colGroupC: {
        width: '22%',
        margin: '0 2% 0 0'
      },
      colGroupD: {
        width: '22%'
      },
      buttonA: {
        width: '60%',
        height: '32px',
        'text-align': 'center',
        border: '1px solid',
        'box-shadow': '1px 1px'
      },
      buttonB: {
        width: '60%',
        height: '32px',
        'text-align': 'center',
        border: '1px solid',
        'box-shadow': '1px 1px'
      },
      buttonC: {
        width: '60%',
        height: '32px',
        'text-align': 'center',
        border: '1px solid',
        'box-shadow': '1px 1px'
      },
      buttonD: {
        width: '60%',
        height: '32px',
        'text-align': 'center',
        border: '1px solid',
        'box-shadow': '1px 1px'
      },
      '@media only screen and (max-width: 767px)': {
        colGroupRow: {
          display: 'block'
        },
        colGroupA: {
          width: '100%'
        },
        colGroupB: {
          width: '100%',
          margin: '20px 0 10px 0'
        },
        colGroupC: {
          width: '100%',
          margin: '10px 0 20px 0'
        },
        colGroupD: {
          width: '100%'
        },
        buttonA: {
          width: '30%',
          height: '32px',
          'text-align': 'center',
          border: '1px solid',
          'box-shadow': '1px 1px'
        },
        buttonB: {
          width: '30%',
          height: '32px',
          'text-align': 'center',
          border: '1px solid',
          'box-shadow': '1px 1px'
        },
        buttonC: {
          width: '30%',
          height: '32px',
          'text-align': 'center',
          border: '1px solid',
          'box-shadow': '1px 1px'
        },
        buttonD: {
          width: '30%',
          height: '32px',
          'text-align': 'center',
          border: '1px solid',
          'box-shadow': '1px 1px'
        }
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width'],
      titleA: ['bigtitle', 'title'],
      titleB: ['bigtitle', 'title'],
      titleC: ['bigtitle', 'title'],
      titleD: ['bigtitle', 'title'],
      subtitleA: ['subtitle', 'title'],
      subtitleB: ['subtitle', 'title'],
      subtitleC: ['subtitle', 'title'],
      subtitleD: ['subtitle', 'title'],
      paragraphA: ['auxiliaryText', 'paragraph'],
      paragraphB: ['auxiliaryText', 'paragraph'],
      paragraphC: ['auxiliaryText', 'paragraph'],
      paragraphD: ['auxiliaryText', 'paragraph'],
      buttonA: ['buttonText', 'title'],
      buttonB: ['buttonText', 'title'],
      buttonC: ['buttonText', 'title'],
      buttonD: ['buttonText', 'title']
    },
    options: {
      theme: {
        buttonA: {
          buttonAStyle: {
            'border-color': 'title',
            'box-shadow': 'title'
          }
        },
        buttonB: {
          buttonBStyle: {
            'border-color': 'title',
            'box-shadow': 'title'
          }
        },
        buttonC: {
          buttonCStyle: {
            'border-color': 'title',
            'box-shadow': 'title'
          }
        },
        buttonD: {
          buttonDStyle: {
            'border-color': 'title',
            'box-shadow': 'title'
          }
        }
      },
      config: { ...emptyData }
    },
    cover: require('@/../static/adi/text/text1.png'),
    preview: {
      outter: {
        height: '70px'
      }
    }
  },
  // style 4
  {
    templateID: 3,
    data: {
      colGroupRow: {
        display: 'flex',
        'flex-direction': 'row',
        'align-items': 'flex-start',
        'justify-content': 'center'
      },
      colGroupA: {
        width: '45%',
        'margin-right': '2.5%'
      },
      colGroupB: {
        width: '45%',
        'margin-left': '2.5%'
      },
      buttonA: {
        width: '40%',
        height: '32px',
        'text-align': 'center',
        border: '1px solid',
        'box-shadow': '1px 1px'
      },
      buttonB: {
        width: '40%',
        height: '32px',
        'text-align': 'center',
        border: '1px solid',
        'box-shadow': '1px 1px'
      },
      '@media only screen and (max-width: 767px)': {
        colGroupRow: {
          display: 'block'
        },
        colGroupA: {
          width: '100%'
        },
        colGroupB: {
          width: '100%',
          'margin-top': '20px'
        },
        buttonA: {
          width: '30%',
          height: '32px',
          'text-align': 'center'
          // border: '1px solid',
          // 'box-shadow': '1px 1px'
        },
        buttonB: {
          width: '30%',
          height: '32px',
          'text-align': 'center'
          // border: '1px solid',
          // 'box-shadow': '1px 1px'
        }
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width'],
      titleA: ['bigtitle', 'title'],
      titleB: ['bigtitle', 'title'],
      subtitleA: ['subtitle', 'title'],
      subtitleB: ['subtitle', 'title'],
      paragraphA: ['auxiliaryText', 'paragraph'],
      paragraphB: ['auxiliaryText', 'paragraph'],
      buttonA: ['buttonText', 'title'],
      buttonB: ['buttonText', 'title']
    },
    options: {
      theme: {
        buttonA: {
          buttonAStyle: {
            // 'border-color': 'title',
            border: '1px solid title',
            'box-shadow': '1px 1px title'
          }
        },
        buttonB: {
          buttonBStyle: {
            // 'border-color': 'title',
            border: '1px solid title',
            'box-shadow': '1px 1px title'
          }
        }
      },
      config: { ...emptyData }
    },
    cover: require('@/../static/adi/text/text1.png'),
    preview: {
      outter: {
        height: '70px'
      }
    }
  }
]
