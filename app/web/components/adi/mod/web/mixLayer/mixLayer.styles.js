import _ from 'lodash'

let emptyData = {
  media: {
    emptyMedia: require('@/assets/adi/mixLayer/mix-layer.jpg'),
    link: '',
    target: '_blank',
    autoplay: false,
    playloop: false,
    poster: '',
    isVideoTabShow: false
  },
  title: {
    emptyInput: 'adi.mixLayer.title',
    emptyLink: '',
    emptyInputPlaceholder: 'titleText',
    emptyLinkTarget: '_blank'
  },
  subtitle: {
    emptyInput: 'adi.mixLayer.subtitle',
    emptyLink: '',
    emptyInputPlaceholder: 'subTitleText',
    emptyLinkTarget: '_blank'
  },
  paragraph: {
    emptyAutoSizeInput: 'adi.mixLayer.paragraph'
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
      colGroup: {
        'background-color': '#000',
        'float': 'none',
        padding: 0
      },
      media: {
        position: 'relative',
        'z-index': 1,
        opacity: '0.5'
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
          opacity: '1'
        },
        colGroup: {
          'background-color': 'rgba(0,0,0,0)',
          'float': 'none'
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
      colMedia: { span: 24 },
      colCouple: { span: 24 },
      colGroup: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      media: ['mod-full-width'],
      colGroup: ['mod-full-width'],
      title: ['bigtitle', 'fontsColor'],
      subtitle: ['subtitle', 'fontsColor'],
      colCoupleRow: ['mod-full-width'],
      paragraph: ['paragraphType', 'fontsColor']
    },
    options: {
      config: {
        ...emptyData,
        media: _.merge({}, emptyData.media, {
          img: {
            defaultWebHeight: '689px',
            defaultMobileHeight: '344px'
          }
        })
      }
    },
    cover: ''
  },
  // style 1
  {
    templateID: 0,
    data: {
      root: {
        overflow: 'hidden',
        position: 'relative'
      },
      colGroup: {
        'background-color': '#000',
        'float': 'none',
        padding: 0
      },
      media: {
        position: 'relative',
        'z-index': 1,
        opacity: '0.5'
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
          opacity: '1'
        },
        colGroup: {
          'background-color': 'rgba(0,0,0,0)',
          'float': 'none'
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
      colMedia: { span: 24 },
      colCouple: { span: 24 },
      colGroup: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      media: ['mod-full-width'],
      colGroup: ['mod-full-width'],
      title: ['bigtitle', 'fontsColor'],
      subtitle: ['subtitle', 'fontsColor'],
      colCoupleRow: ['mod-full-width'],
      paragraph: ['paragraphType', 'fontsColor']
    },
    options: {
      config: {
        ...emptyData,
        media: _.merge({}, emptyData.media, {
          img: {
            defaultWebHeight: '689px',
            defaultMobileHeight: '344px'
          }
        })
      }
    },
    cover: ''
  },
  // style 2
  {
    templateID: 0,
    data: {
      root: {
        overflow: 'hidden',
        position: 'relative'
      },
      colGroup: {
        'background-color': '#000',
        'float': 'none',
        padding: 0
      },
      media: {
        position: 'relative',
        'z-index': 1,
        opacity: '0.5'
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
          opacity: '1'
        },
        colGroup: {
          'background-color': 'rgba(0,0,0,0)',
          'float': 'none'
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
      colMedia: { span: 24 },
      colCouple: { span: 24 },
      colGroup: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      media: ['mod-full-width'],
      colGroup: ['mod-full-width'],
      title: ['bigtitle', 'fontsColor'],
      subtitle: ['subtitle', 'fontsColor'],
      colCoupleRow: ['mod-full-width'],
      paragraph: ['paragraphType', 'fontsColor']
    },
    options: {
      config: {
        ...emptyData,
        media: _.merge({}, emptyData.media, {
          img: {
            defaultWebHeight: '689px',
            defaultMobileHeight: '344px'
          }
        })
      }
    },
    cover: ''
  },
  // style 3
  {
    templateID: 0,
    data: {
      root: {
        overflow: 'hidden',
        position: 'relative'
      },
      colGroup: {
        'background-color': '#000',
        'float': 'none',
        padding: 0
      },
      media: {
        position: 'relative',
        'z-index': 1,
        opacity: '0.5'
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
          opacity: '1'
        },
        colGroup: {
          'background-color': 'rgba(0,0,0,0)',
          'float': 'none'
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
      colMedia: { span: 24 },
      colCouple: { span: 24 },
      colGroup: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      media: ['mod-full-width'],
      colGroup: ['mod-full-width'],
      title: ['bigtitle', 'fontsColor'],
      subtitle: ['subtitle', 'fontsColor'],
      colCoupleRow: ['mod-full-width'],
      paragraph: ['paragraphType', 'fontsColor']
    },
    options: {
      config: {
        ...emptyData,
        media: _.merge({}, emptyData.media, {
          img: {
            defaultWebHeight: '689px',
            defaultMobileHeight: '344px'
          }
        })
      }
    },
    cover: ''
  },
  // style 4
  {
    templateID: 0,
    data: {
      root: {
        overflow: 'hidden',
        position: 'relative'
      },
      colGroup: {
        'background-color': '#000',
        'float': 'none',
        padding: 0
      },
      media: {
        position: 'relative',
        'z-index': 1,
        opacity: '0.5'
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
          opacity: '1'
        },
        colGroup: {
          'background-color': 'rgba(0,0,0,0)',
          'float': 'none'
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
      colMedia: { span: 24 },
      colCouple: { span: 24 },
      colGroup: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      media: ['mod-full-width'],
      colGroup: ['mod-full-width'],
      title: ['bigtitle', 'fontsColor'],
      subtitle: ['subtitle', 'fontsColor'],
      colCoupleRow: ['mod-full-width'],
      paragraph: ['paragraphType', 'fontsColor']
    },
    options: {
      config: {
        ...emptyData,
        media: _.merge({}, emptyData.media, {
          img: {
            defaultWebHeight: '689px',
            defaultMobileHeight: '344px'
          }
        })
      }
    },
    cover: ''
  },
  // style 5
  {
    templateID: 0,
    data: {
      root: {
        overflow: 'hidden',
        position: 'relative'
      },
      colGroup: {
        'background-color': '#000',
        'float': 'none',
        padding: 0
      },
      media: {
        position: 'relative',
        'z-index': 1,
        opacity: '0.5'
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
          opacity: '1'
        },
        colGroup: {
          'background-color': 'rgba(0,0,0,0)',
          'float': 'none'
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
      colMedia: { span: 24 },
      colCouple: { span: 24 },
      colGroup: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      media: ['mod-full-width'],
      colGroup: ['mod-full-width'],
      title: ['bigtitle', 'fontsColor'],
      subtitle: ['subtitle', 'fontsColor'],
      colCoupleRow: ['mod-full-width'],
      paragraph: ['paragraphType', 'fontsColor']
    },
    options: {
      config: {
        ...emptyData,
        media: _.merge({}, emptyData.media, {
          img: {
            defaultWebHeight: '689px',
            defaultMobileHeight: '344px'
          }
        })
      }
    },
    cover: ''
  },
  // style 6
  {
    templateID: 0,
    data: {
      root: {
        overflow: 'hidden',
        position: 'relative'
      },
      colGroup: {
        'background-color': '#000',
        'float': 'none',
        padding: 0
      },
      media: {
        position: 'relative',
        'z-index': 1,
        opacity: '0.5'
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
          opacity: '1'
        },
        colGroup: {
          'background-color': 'rgba(0,0,0,0)',
          'float': 'none'
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
      colMedia: { span: 24 },
      colCouple: { span: 24 },
      colGroup: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      media: ['mod-full-width'],
      colGroup: ['mod-full-width'],
      title: ['bigtitle', 'fontsColor'],
      subtitle: ['subtitle', 'fontsColor'],
      colCoupleRow: ['mod-full-width'],
      paragraph: ['paragraphType', 'fontsColor']
    },
    options: {
      config: {
        ...emptyData,
        media: _.merge({}, emptyData.media, {
          img: {
            defaultWebHeight: '689px',
            defaultMobileHeight: '344px'
          }
        })
      }
    },
    cover: ''
  },
  // style 7
  {
    templateID: 0,
    data: {
      root: {
        overflow: 'hidden',
        position: 'relative'
      },
      colGroup: {
        'background-color': '#000',
        'float': 'none',
        padding: 0
      },
      media: {
        position: 'relative',
        'z-index': 1,
        opacity: '0.5'
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
          opacity: '1'
        },
        colGroup: {
          'background-color': 'rgba(0,0,0,0)',
          'float': 'none'
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
      colMedia: { span: 24 },
      colCouple: { span: 24 },
      colGroup: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      media: ['mod-full-width'],
      colGroup: ['mod-full-width'],
      title: ['bigtitle', 'fontsColor'],
      subtitle: ['subtitle', 'fontsColor'],
      colCoupleRow: ['mod-full-width'],
      paragraph: ['paragraphType', 'fontsColor']
    },
    options: {
      config: {
        ...emptyData,
        media: _.merge({}, emptyData.media, {
          img: {
            defaultWebHeight: '689px',
            defaultMobileHeight: '344px'
          }
        })
      }
    },
    cover: ''
  },
  // style 8
  {
    templateID: 0,
    data: {
      root: {
        overflow: 'hidden',
        position: 'relative'
      },
      colGroup: {
        'background-color': '#000',
        'float': 'none',
        padding: 0
      },
      media: {
        position: 'relative',
        'z-index': 1,
        opacity: '0.5'
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
          opacity: '1'
        },
        colGroup: {
          'background-color': 'rgba(0,0,0,0)',
          'float': 'none'
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
      colMedia: { span: 24 },
      colCouple: { span: 24 },
      colGroup: { span: 24 }
    },
    theme: {
      root: ['mod-space'],
      media: ['mod-full-width'],
      colGroup: ['mod-full-width'],
      title: ['bigtitle', 'fontsColor'],
      subtitle: ['subtitle', 'fontsColor'],
      colCoupleRow: ['mod-full-width'],
      paragraph: ['paragraphType', 'fontsColor']
    },
    options: {
      config: {
        ...emptyData,
        media: _.merge({}, emptyData.media, {
          img: {
            defaultWebHeight: '689px',
            defaultMobileHeight: '344px'
          }
        })
      }
    },
    cover: ''
  }
]
