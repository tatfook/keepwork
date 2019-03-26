import _ from 'lodash'

let defaultData = {
  menu: {
    mode: 'horizontal',
    emptyData: [
      {
        name: 'adi.title.menu',
        link: ''
      }
    ],
    emptyLinkTarget: '_blank'
  },
  logo: {
    emptyMedia: require('@/assets/adi/menu/whiteBear.svg'),
    link: '',
    target: '_blank',
    autoplay: false,
    playloop: false,
    poster: ''
  },
  businessName: {
    emptyInput: 'adi.title.businessName',
    emptyLink: '',
    emptyInputPlaceholder: 'titleText',
    emptyLinkTarget: '_blank'
  },
  tagline: {
    emptyInput: 'adi.title.tagLine',
    emptyLink: '',
    emptyLinkTarget: '_blank'
  }
}
export default [
  // style 0
  {
    templateID: 0,
    data: {
      menu: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      menu: ['mod-full-width', 'auxiliaryText'],
      colMenu: ['bgColor']
    },
    options: {
      theme: {
        menu: {
          menuBackground: 'bgColor',
          fontColor: 'fontsColor'
        }
      },
      config: {
        menu: {
          type: 'menu',
          mode: 'horizontal',
          emptyLinkTarget: '_blank'
        }
      }
    }
  },
  // style 1
  {
    templateID: 0,
    data: {
      menu: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      menu: ['mod-full-width', 'auxiliaryText'],
      colMenu: ['bgColor']
    },
    options: {
      theme: {
        menu: {
          menuBackground: 'bgColor',
          fontColor: 'fontsColor'
        }
      },
      config: {
        menu: {
          type: 'menu',
          mode: 'horizontal',
          emptyLinkTarget: '_blank',
          menuStyle: {
            display: 'flex',
            'flex-wrap': 'wrap',
            'justify-content': 'center'
          }
        }
      }
    }
  },
  // style 2
  {
    templateID: 0,
    data: {
      menu: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      menu: ['mod-full-width', 'auxiliaryText'],
      colMenu: ['bgColor']
    },
    options: {
      theme: {
        menu: {
          menuBackground: 'bgColor',
          fontColor: 'fontsColor'
        }
      },
      config: {
        menu: {
          type: 'menu',
          mode: 'horizontal',
          emptyLinkTarget: '_blank',
          itemStyle: {
            'float': 'right'
          }
        }
      }
    }
  },
  // style 3
  {
    templateID: 0,
    data: {
      menu: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      menu: ['mod-full-width', 'auxiliaryText'],
      colMenu: ['bg_color_4']
    },
    options: {
      theme: {
        menu: {
          menuBackground: 'bg_color_4',
          fontColor: 'fontsColor'
        }
      },
      config: {
        menu: {
          type: 'menu',
          mode: 'horizontal',
          emptyLinkTarget: '_blank'
        }
      }
    }
  },
  // style 4
  {
    templateID: 0,
    data: {
      menu: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      menu: ['mod-full-width', 'auxiliaryText'],
      colMenu: ['bg_color_4']
    },
    options: {
      theme: {
        menu: {
          menuBackground: 'bg_color_4',
          fontColor: 'fontsColor'
        }
      },
      config: {
        menu: {
          type: 'menu',
          mode: 'horizontal',
          emptyLinkTarget: '_blank',
          menuStyle: {
            display: 'flex',
            'flex-wrap': 'wrap',
            justifyContent: 'center'
          }
        }
      }
    }
  },
  // style 5
  {
    templateID: 0,
    data: {
      menu: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      menu: ['mod-full-width', 'auxiliaryText'],
      colMenu: ['bg_color_4']
    },
    options: {
      theme: {
        menu: {
          menuBackground: 'bg_color_4',
          fontColor: 'fontsColor'
        }
      },
      config: {
        menu: {
          type: 'menu',
          mode: 'horizontal',
          emptyLinkTarget: '_blank',
          itemStyle: {
            'float': 'right'
          }
        }
      }
    }
  },
  // style 6
  {
    templateID: 0,
    data: {
      menu: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      menu: ['mod-full-width', 'auxiliaryText'],
      colMenu: ['bg_color_0']
    },
    options: {
      theme: {
        menu: {
          menuBackground: 'bg_color_0',
          fontColor: 'color_4'
        }
      },
      config: {
        menu: {
          type: 'menu',
          mode: 'horizontal',
          emptyLinkTarget: '_blank'
        }
      }
    }
  },
  // style 7
  {
    templateID: 0,
    data: {
      menu: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      menu: ['mod-full-width', 'auxiliaryText'],
      colMenu: ['bg_color_0']
    },
    options: {
      theme: {
        menu: {
          menuBackground: 'bg_color_0',
          fontColor: 'color_4'
        }
      },
      config: {
        menu: {
          type: 'menu',
          mode: 'horizontal',
          emptyLinkTarget: '_blank',
          menuStyle: {
            display: 'flex',
            'flex-wrap': 'wrap',
            justifyContent: 'center'
          }
        }
      }
    }
  },
  // style 8
  {
    templateID: 0,
    data: {
      menu: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      menu: ['mod-full-width', 'auxiliaryText'],
      colMenu: ['bg_color_0']
    },
    options: {
      theme: {
        menu: {
          menuBackground: 'bg_color_0',
          fontColor: 'color_4'
        }
      },
      config: {
        menu: {
          type: 'menu',
          mode: 'horizontal',
          emptyLinkTarget: '_blank',
          itemStyle: {
            'float': 'right'
          }
        }
      }
    }
  },
  // style 9
  {
    templateID: 0,
    data: {
      menu: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      colFooterRow: [],
      menu: ['mod-full-width', 'auxiliaryText', 'color_0'],
      colMenu: ['bg_color_4']
    },
    options: {
      theme: {
        menu: {
          footerBackground: 'bg_color_4',
          itemTop: 'font_5',
          itemOther: 'font_8'
        }
      },
      config: {
        menu: {
          type: 'footer',
          emptyLinkTarget: '_blank',
          display: 'flex',
          justifyContent: 'flex-start'
        }
      }
    }
  },
  // style 10
  {
    templateID: 0,
    data: {
      menu: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      menu: ['mod-full-width', 'auxiliaryText', 'color_0'],
      colMenu: ['bg_color_4']
    },
    options: {
      theme: {
        menu: {
          footerBackground: 'bg_color_4',
          itemTop: 'font_5',
          itemOther: 'font_8'
        }
      },
      config: {
        menu: {
          type: 'footer',
          emptyLinkTarget: '_blank',
          display: 'flex',
          justifyContent: 'center'
        }
      }
    }
  },
  // style 11
  {
    templateID: 0,
    data: {
      menu: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      menu: ['mod-full-width', 'auxiliaryText', 'color_0'],
      colMenu: ['bg_color_4']
    },
    options: {
      theme: {
        menu: {
          footerBackground: 'bg_color_4',
          itemTop: 'font_5',
          itemOther: 'font_8'
        }
      },
      config: {
        menu: {
          type: 'footer',
          emptyLinkTarget: '_blank',
          display: 'flex',
          justifyContent: 'flex-end'
        }
      }
    }
  },
  // style 12
  {
    templateID: 0,
    data: {
      menu: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      menu: ['mod-full-width', 'auxiliaryText', 'color_4'],
      colMenu: ['bg_color_0']
    },
    options: {
      theme: {
        menu: {
          footerBackground: 'bg_color_0',
          itemTop: 'font_5',
          itemOther: 'font_8'
        }
      },
      config: {
        menu: {
          type: 'footer',
          emptyLinkTarget: '_blank',
          display: 'flex',
          justifyContent: 'flex-start'
        }
      }
    }
  },
  // style 13
  {
    templateID: 0,
    data: {
      menu: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      menu: ['mod-full-width', 'auxiliaryText', 'color_4'],
      colMenu: ['bg_color_0']
    },
    options: {
      theme: {
        menu: {
          footerBackground: 'bg_color_0',
          itemTop: 'font_5',
          itemOther: 'font_8'
        }
      },
      config: {
        menu: {
          type: 'footer',
          emptyLinkTarget: '_blank',
          display: 'flex',
          justifyContent: 'center'
        }
      }
    }
  },
  // style 14
  {
    templateID: 0,
    data: {
      menu: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      menu: ['mod-full-width', 'auxiliaryText', 'color_4'],
      colMenu: ['bg_color_0']
    },
    options: {
      theme: {
        menu: {
          footerBackground: 'bg_color_0',
          itemTop: 'font_5',
          itemOther: 'font_8'
        }
      },
      config: {
        menu: {
          type: 'footer',
          emptyLinkTarget: '_blank',
          display: 'flex',
          justifyContent: 'flex-end'
        }
      }
    }
  },
  // style 15
  {
    templateID: 1,
    data: {
      root: {},
      colGroupRow: {
        display: 'flex',
        'align-items': 'center',
        padding: '5px 0'
      },
      colLogo: {
        'float': 'left',
        width: 'auto',
        'margin-left': '5px'
      },
      logo: {
        height: '64px',
        width: '64px'
      },
      colBusinessName: {
        'float': 'left',
        width: 'auto',
        'margin-left': '5px'
      },
      colMenu: {
        'float': 'left'
      },
      menu: {
        width: 'auto'
      },
      '@media only screen and (max-width: 767px)': {
        menu: {
          'min-width': '40px'
        }
      }
    },
    props: {},
    theme: {
      root: [],
      colGroupRow: ['mod-full-width'],
      colGroup: ['styleFourBackground'],
      businessName: ['fontsColor']
    },
    options: {
      theme: {
        menu: {
          menuBackground: 'styleFourBackground',
          fontColor: 'fontsColor'
        }
      },
      config: {
        ...defaultData,
        menu: _.merge({}, defaultData.menu, {
          type: 'menu'
        }),
        logo: _.merge({}, defaultData.logo, {
          img: {
            defaultWebWidth: '64px'
          }
        })
      }
    }
  },
  // style 16
  {
    templateID: 0,
    data: {
      menu: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      menu: ['mod-full-width', 'auxiliaryText'],
      colMenu: ['bgColor']
    },
    options: {
      theme: {
        menu: {
          menuBackground: 'bgColor',
          fontColor: 'fontsColor'
        }
      },
      config: {
        menu: {
          type: 'menu',
          mode: 'vertical',
          emptyLinkTarget: '_blank'
        }
      }
    }
  },
  // style 17
  {
    templateID: 0,
    data: {
      menu: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      menu: ['mod-full-width', 'auxiliaryText'],
      colMenu: ['bg_color_4']
    },
    options: {
      theme: {
        menu: {
          menuBackground: 'bg_color_4',
          fontColor: 'fontsColor'
        }
      },
      config: {
        menu: {
          type: 'menu',
          mode: 'vertical',
          emptyLinkTarget: '_blank'
        }
      }
    }
  },
  // style 18
  {
    templateID: 0,
    data: {
      menu: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      menu: ['mod-full-width', 'auxiliaryText'],
      colMenu: ['bg_color_0']
    },
    options: {
      theme: {
        menu: {
          menuBackground: 'bg_color_0',
          fontColor: 'color_4'
        }
      },
      config: {
        menu: {
          type: 'menu',
          mode: 'vertical',
          emptyLinkTarget: '_blank'
        }
      }
    }
  },
]
