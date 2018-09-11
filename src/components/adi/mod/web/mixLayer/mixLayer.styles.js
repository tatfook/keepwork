let emptyData = {
  media: {
    emptySrc: require('@/assets/adi/mixLayer/mix-layer.jpg'),
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  title: {
    emptyName: 'adi.mixLayer.title',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  subtitle: {
    emptyName: 'adi.mixLayer.subtitle',
    emptyLink: '#',
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
      colGroup: {
        'background-color': '#000',
        float: 'none',
        padding: 0
      },
      colMedia: {
        height: '689px'
      },
      media: {
        height: '689px',
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
          height: '344px',
          opacity: '1'
        },
        colMedia: {
          height: '344px'
        },
        colGroup: {
          'background-color': 'rgba(0,0,0,0)',
          float: 'none'
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
      config: { ...emptyData }
    },
    cover: require('@/assets/adi/mixLayer/mix1.png'),
    preview: {
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
      colGroup: {
        'background-color': '#000',
        float: 'none',
        padding: 0
      },
      colMedia: {
        height: '689px'
      },
      media: {
        height: '689px',
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
          height: '344px',
          opacity: '1'
        },
        colMedia: {
          height: '344px'
        },
        colGroup: {
          'background-color': 'rgba(0,0,0,0)',
          float: 'none'
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
      config: { ...emptyData }
    },
    cover: require('@/assets/adi/mixLayer/mix2.png'),
    preview: {
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
      colGroup: {
        'background-color': '#000',
        float: 'none',
        padding: 0
      },
      colMedia: {
        height: '689px'
      },
      media: {
        height: '689px',
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
          height: '344px',
          opacity: '1'
        },
        colMedia: {
          height: '344px'
        },
        colGroup: {
          'background-color': 'rgba(0,0,0,0)',
          float: 'none'
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
      config: { ...emptyData }
    },
    cover: require('@/assets/adi/mixLayer/mix3.png'),
    preview: {
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
      colGroup: {
        'background-color': '#000',
        float: 'none',
        padding: 0
      },
      colMedia: {
        height: '689px'
      },
      media: {
        height: '689px',
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
          height: '344px',
          opacity: '1'
        },
        colMedia: {
          height: '344px'
        },
        colGroup: {
          'background-color': 'rgba(0,0,0,0)',
          float: 'none'
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
      config: { ...emptyData }
    },
    cover: require('@/assets/adi/mixLayer/mix4.png'),
    preview: {
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
      colGroup: {
        'background-color': '#000',
        float: 'none',
        padding: 0
      },
      colMedia: {
        height: '689px'
      },
      media: {
        height: '689px',
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
          height: '344px',
          opacity: '1'
        },
        colMedia: {
          height: '344px'
        },
        colGroup: {
          'background-color': 'rgba(0,0,0,0)',
          float: 'none'
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
      config: { ...emptyData }
    },
    cover: require('@/assets/adi/mixLayer/mix5.png'),
    preview: {
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
      colGroup: {
        'background-color': '#000',
        float: 'none',
        padding: 0
      },
      colMedia: {
        height: '689px'
      },
      media: {
        height: '689px',
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
          height: '344px',
          opacity: '1'
        },
        colMedia: {
          height: '344px'
        },
        colGroup: {
          'background-color': 'rgba(0,0,0,0)',
          float: 'none'
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
      config: { ...emptyData }
    },
    cover: require('@/assets/adi/mixLayer/mix6.png'),
    preview: {
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
      colGroup: {
        'background-color': '#000',
        float: 'none',
        padding: 0
      },
      colMedia: {
        height: '689px'
      },
      media: {
        height: '689px',
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
          height: '344px',
          opacity: '1'
        },
        colMedia: {
          height: '344px'
        },
        colGroup: {
          'background-color': 'rgba(0,0,0,0)',
          float: 'none'
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
      config: { ...emptyData }
    },
    cover: require('@/assets/adi/mixLayer/mix7.png'),
    preview: {
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
      colGroup: {
        'background-color': '#000',
        float: 'none',
        padding: 0
      },
      colMedia: {
        height: '689px'
      },
      media: {
        height: '689px',
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
          height: '344px',
          opacity: '1'
        },
        colMedia: {
          height: '344px'
        },
        colGroup: {
          'background-color': 'rgba(0,0,0,0)',
          float: 'none'
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
      config: { ...emptyData }
    },
    cover: require('@/assets/adi/mixLayer/mix8.png'),
    preview: {
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
      colGroup: {
        'background-color': '#000',
        float: 'none',
        padding: 0
      },
      colMedia: {
        height: '689px'
      },
      media: {
        height: '689px',
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
          height: '344px',
          opacity: '1'
        },
        colMedia: {
          height: '344px'
        },
        colGroup: {
          'background-color': 'rgba(0,0,0,0)',
          float: 'none'
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
      config: { ...emptyData }
    },
    cover: require('@/assets/adi/mixLayer/mix9.png'),
    preview: {
      inner: {
        'margin-top': '-20px'
      }
    }
  }
]
