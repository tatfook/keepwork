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
    emptyMedia: require('@/assets/adi/title/bear.svg'),
    emptyLink: '',
    emptyLinkTarget: '_blank',
    isVideoTabShow: false
  },
  businessName: {
    emptyInput: 'adi.title.businessName',
    emptyInputPlaceholder: 'titleText',
    emptyLink: '',
    emptyLinkTarget: '_blank'
  },
  tagline: {
    emptyInput: 'adi.title.tagLine',
    emptyInputPlaceholder: 'subTitleText',
    emptyLink: '',
    emptyLinkTarget: '_blank'
  }
}
export default [
  // style 0
  {
    templateID: 0,
    data: {
      // 定义mod根div的样式
      colGroup: {
        'margin-top': '20px'
      },
      colLogo: {
        width: 'auto'
      },
      colGroupARow: {
        display: 'flex',
        'align-items': 'center'
      },
      colCouple: {
        'min-width': '200px',
        height: '87px',
        display: 'flex',
        'align-items': 'center',
        'max-width': '100%'
      },
      // 定义子组件menu的wrapper样式
      menu: {
        margin: 'auto'
      },
      colMenu: {
        'margin-top': '20px'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colLogo: { span: 10 },
      colCouple: { span: 16 },
      colGroupARow: { gutter: 10 }
    },
    theme: {
      root: [],
      colGroupRow: ['mod-full-width'],
      businessName: ['bigtitle', 'sbusinessName'],
      tagline: ['subtitle', 'tagline'],
      menu: ['mod-full-width'],
      colMenu: ['bgColors']
    },
    options: {
      theme: {
        // 子组件的style参数
        menu: {
          menuBackground: 'bgColors',
          fontColor: 'fontsColor'
        }
      },
      config: {
        // 子组件配置参数
        ...defaultData,
        menu: _.merge({}, defaultData.menu, {
          type: 'menu'
        }),
        logo: _.merge({}, defaultData.logo, {
          img: {
            defaultWebWidth: ''
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
      // 定义mod根div的样式
      colGroup: {
        'margin-top': '20px'
      },
      colLogo: {
        width: 'auto'
      },
      colGroupARow: {
        display: 'flex',
        'align-items': 'center'
      },
      colCouple: {
        'min-width': '200px',
        height: '87px',
        display: 'flex',
        'align-items': 'center',
        'max-width': '100%'
      },
      // 定义子组件menu的wrapper样式
      menu: {
        margin: 'auto'
      },
      colMenu: {
        'margin-top': '20px'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colLogo: { span: 10 },
      colCouple: { span: 16 },
      colGroupARow: { gutter: 10 }
    },
    theme: {
      root: [],
      colGroupRow: ['mod-full-width'],
      businessName: ['bigtitle', 'sbusinessName'],
      tagline: ['subtitle', 'tagline'],
      menu: ['mod-full-width'],
      colMenu: ['bgColors']
    },
    options: {
      theme: {
        menu: {
          menuBackground: 'bgColors',
          fontColor: 'fontsColor'
        }
      },
      config: {
        ...defaultData,
        menu: _.merge({}, defaultData.menu, {
          type: 'menu',
          itemStyle: { 'float': 'right' }
        }),
        logo: _.merge({}, defaultData.logo, {
          img: {
            defaultWebWidth: ''
          }
        })
      }
    },
    cover: ''
  },
  // style 2
  {
    templateID: 1,
    data: {
      // 定义mod根div的样式
      logo: {
        display: 'flex',
        'justify-content': 'center'
      },
      colLogo: {
        'margin-top': '20px'
      },
      colCouple: {
        'min-width': '200px',
        display: 'flex',
        'align-items': 'center'
      },
      colCoupleRow: {
        margin: 'auto',
        'text-align': 'center',
        'max-width': '100%'
      },
      businessName: {
        margin: 'auto'
      },
      // 定义子组件menu的wrapper样式
      menu: {
        margin: 'auto'
      }
    },
    props: {
      colLogo: { span: 24 },
      colCouple: { span: 24 },
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      businessName: ['bigtitle', 'sbusinessName'],
      tagline: ['subtitle', 'tagline'],
      menu: ['mod-full-width'],
      colMenu: ['bgColors']
    },
    options: {
      theme: {
        // 子组件的style参数
        menu: {
          menuBackground: 'bgColors',
          fontColor: 'fontsColor'
        }
      },
      config: {
        // 子组件配置参数
        ...defaultData,
        menu: _.merge({}, defaultData.menu, {
          type: 'menu'
        }),
        logo: _.merge({}, defaultData.logo, {
          img: {
            defaultWebWidth: ''
          }
        })
      }
    },
    cover: ''
  },
  // style 3
  {
    templateID: 1,
    data: {
      // 定义mod根div的样式
      logo: {
        display: 'flex',
        'justify-content': 'center'
      },
      colLogo: {
        'margin-top': '20px'
      },
      colCouple: {
        'min-width': '200px',
        display: 'flex',
        'align-items': 'center'
      },
      colCoupleRow: {
        margin: 'auto',
        'text-align': 'center',
        'max-width': '100%'
      },
      businessName: {
        margin: 'auto'
      },
      // 定义子组件menu的wrapper样式
      menu: {
        margin: 'auto'
      }
    },
    props: {
      colLogo: { span: 24 },
      colCouple: { span: 24 },
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      businessName: ['bigtitle', 'sbusinessName'],
      tagline: ['subtitle', 'tagline'],
      menu: ['mod-full-width'],
      colMenu: ['bgColors']
    },
    options: {
      theme: {
        // 子组件的style参数
        menu: {
          menuBackground: 'bgColors',
          fontColor: 'fontsColor'
        }
      },
      config: {
        ...defaultData,
        menu: _.merge({}, defaultData.menu, {
          type: 'menu',
          itemStyle: { 'float': 'right' }
        }),
        logo: _.merge({}, defaultData.logo, {
          img: {
            defaultWebWidth: ''
          }
        })
      }
    },
    cover: ''
  },
  // style 4
  {
    templateID: 3,
    data: {
      root: {},
      colGroupRow: {
        display: 'flex',
        'align-items': 'center',
        padding: '5px 0'
      },
      colLogo: {
        'float': 'left',
        'max-width': '87px',
        'margin-left': '5px'
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
          emptyMedia: require('@/assets/adi/title/whiteBear.svg'),
          img: {
            defaultWebWidth: '64px'
          }
        })
      }
    }
  },
  // style 5
  {
    templateID: 2,
    componentID: 1,
    data: {
      root: {},
      colGroupRow: {
        display: 'flex',
        'align-items': 'center'
      },
      colLogoB: {
        display: 'flex',
        'justify-content': 'flex-start',
        'min-width': '180px'
      },
      colMenu: {
        display: 'flex',
        'justify-content': 'flex-end',
        'align-items': 'center'
      },
      menuB: {
        width: 'auto'
      },
      '@media only screen and (max-width: 767px)': {
        menuB: {
          'min-width': '40px'
        }
      }
    },
    props: {
      colGroupRow: { gutter: 10 },
      colLogoB: {
        xs: { span: 12 },
        sm: { span: 9 }
      },
      colMenu: {
        xs: { span: 12 },
        sm: { span: 15 }
      }
    },
    theme: {
      root: [],
      rootRow: ['mod-full-width']
    },
    options: {
      theme: {
        menuB: {
          fontSize: 'subtitle',
          fontColor: 'color_3',
          color: 'svgFillColor',
          backgroundColor: 'color_5',
          borderBottomColor: 'svgFillColor'
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
  }
]
