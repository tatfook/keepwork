
let defaultData = {
  menu: {
    mode: 'horizontal',
    emptyData: [
      {
        name: 'adi.title.menu',
        link: '#'
      }
    ],
    emptyTarget: '_blank'
  },
  logo: {
    emptySrc: require('@/../static/adi/title/bear.svg'),
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  businessName: {
    emptyName: 'adi.title.businessName',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  tagline: {
    emptyName: 'adi.title.tagLine',
    emptyLink: '#',
    emptyTarget: '_blank'
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
          mode: 'horizontal',
          emptyTarget: '_blank'
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
          mode: 'horizontal',
          emptyTarget: '_blank',
          menuStyle: {
            display: 'flex',
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
          mode: 'horizontal',
          emptyTarget: '_blank',
          itemStyle: {
            float: 'right'
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
          mode: 'horizontal',
          emptyTarget: '_blank'
        }
      }
    }
    // cover: require('@/../static/adi/menu/menu.png'),
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
          mode: 'horizontal',
          emptyTarget: '_blank',
          menuStyle: {
            display: 'flex',
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
          mode: 'horizontal',
          emptyTarget: '_blank',
          itemStyle: {
            float: 'right'
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
          mode: 'horizontal',
          emptyTarget: '_blank'
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
          mode: 'horizontal',
          emptyTarget: '_blank',
          menuStyle: {
            display: 'flex',
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
          mode: 'horizontal',
          emptyTarget: '_blank',
          itemStyle: {
            float: 'right'
          }
        }
      }
    }
  },
  // style 9
  {
    templateID: 1,
    data: {
      footer: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      colFooterRow: [],
      footer: ['mod-full-width', 'auxiliaryText', 'color_0'],
      colFooter: ['bg_color_4']
    },
    options: {
      theme: {
        footer: {
          footerBackground: 'bg_color_4',
          itemTop: 'font_5',
          itemOther: 'font_8'
        }
      },
      config: {
        footer: {
          emptyTarget: '_blank',
          display: 'flex',
          justifyContent: 'flex-start'
        }
      }
    }
  },
  // style 10
  {
    templateID: 1,
    data: {
      footer: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      footer: ['mod-full-width', 'auxiliaryText', 'color_0'],
      colFooter: ['bg_color_4']
    },
    options: {
      theme: {
        footer: {
          footerBackground: 'bg_color_4',
          itemTop: 'font_5',
          itemOther: 'font_8'
        }
      },
      config: {
        footer: {
          emptyTarget: '_blank',
          display: 'flex',
          justifyContent: 'center'
        }
      }
    }
  },
  // style 11
  {
    templateID: 1,
    data: {
      footer: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      footer: ['mod-full-width', 'auxiliaryText', 'color_0'],
      colFooter: ['bg_color_4']
    },
    options: {
      theme: {
        footer: {
          footerBackground: 'bg_color_4',
          itemTop: 'font_5',
          itemOther: 'font_8'
        }
      },
      config: {
        footer: {
          emptyTarget: '_blank',
          display: 'flex',
          justifyContent: 'flex-end'
        }
      }
    }
  },
  // style 12
  {
    templateID: 1,
    data: {
      footer: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      footer: ['mod-full-width', 'auxiliaryText', 'color_4'],
      colFooter: ['bg_color_0']
    },
    options: {
      theme: {
        footer: {
          footerBackground: 'bg_color_0',
          itemTop: 'font_5',
          itemOther: 'font_8'
        }
      },
      config: {
        footer: {
          emptyTarget: '_blank',
          display: 'flex',
          justifyContent: 'flex-start'
        }
      }
    }
  },
  // style 13
  {
    templateID: 1,
    data: {
      footer: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      footer: ['mod-full-width', 'auxiliaryText', 'color_4'],
      colFooter: ['bg_color_0']
    },
    options: {
      theme: {
        footer: {
          footerBackground: 'bg_color_0',
          itemTop: 'font_5',
          itemOther: 'font_8'
        }
      },
      config: {
        footer: {
          emptyTarget: '_blank',
          display: 'flex',
          justifyContent: 'center'
        }
      }
    }
  },
  // style 14
  {
    templateID: 1,
    data: {
      footer: {
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      footer: ['mod-full-width', 'auxiliaryText', 'color_4'],
      colFooter: ['bg_color_0']
    },
    options: {
      theme: {
        footer: {
          footerBackground: 'bg_color_0',
          itemTop: 'font_5',
          itemOther: 'font_8'
        }
      },
      config: {
        footer: {
          emptyTarget: '_blank',
          display: 'flex',
          justifyContent: 'flex-end'
        }
      }
    }
  },
  // style 15
  {
    templateID: 2,
    data: {
      root: {},
      colGroupRow: {
        display: 'flex',
        'align-items': 'center',
        padding: '5px 0'
      },
      colLogo: {
        float: 'left',
        'max-width': '64px',
        'margin-left': '5px'
      },
      logo: {
        height: '64px',
        width: '64px'
      },
      colBusinessName: {
        float: 'left',
        width: 'auto',
        'margin-left': '5px'
      },
      colMenu: {
        float: 'left'
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
        },
        logo: {
          svgFillColor: 'fontsColor'
        }
      },
      config: {
        ...defaultData
      }
    }
  }
]
