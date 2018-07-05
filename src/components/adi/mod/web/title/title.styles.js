import _ from 'lodash'

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
  },
  logoB: {
    emptySrc: require('@/../static/adi/title/bear.svg'),
    emptyLink: '#',
    emptyTarget: '_blank'
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
      logo: {
        height: '87px',
        width: '87px'
      },
      colLogo: {
        width: 'auto'
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
        height: '50px',
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
      businessName: ['font_1', 'color_4'],
      tagline: ['font_3', 'color_2'],
      menu: ['mod-full-width'],
      colMenu: ['bg_color_7']
    },
    options: {
      theme: {
        // 子组件的style参数
        menu: {
          menuBackground: 'bg_color_7',
          fontColor: 'color_0'
        },
        logo: {
          svgFillColor: 'color_7'
        }
      },
      config: {
        // 子组件配置参数
        ...defaultData
      }
    },
    cover: require('@/../static/adi/title/title1.png'),
    preview: {
      outter: {
        height: '47px'
      }
    }
  },
  // style 1
  {
    templateID: 0,
    data: {
      // 定义mod根div的样式
      colGroup: {
        'margin-top': '20px'
      },
      logo: {
        height: '87px',
        width: '87px'
      },
      colLogo: {
        width: 'auto'
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
        height: '50px',
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
      businessName: ['font_1', 'color_4'],
      tagline: ['font_3', 'color_2'],
      menu: ['mod-full-width'],
      colMenu: ['bg_color_7']
    },
    options: {
      theme: {
        menu: {
          menuBackground: 'bg_color_7',
          fontColor: 'color_0'
        },
        logo: {
          svgFillColor: 'color_7'
        }
      },
      config: {
        ...defaultData,
        menu: _.merge({}, defaultData.menu, { itemStyle: { float: 'right' } })
      }
    },
    cover: require('@/../static/adi/title/title1.png'),
    preview: {
      outter: {
        height: '47px'
      }
    }
  },
  // style 2
  {
    templateID: 1,
    data: {
      // 定义mod根div的样式
      logo: {
        height: '87px',
        width: '87px',
        margin: 'auto'
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
        height: '50px',
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
      businessName: ['font_1', 'color_4'],
      tagline: ['font_3', 'color_2'],
      menu: ['mod-full-width'],
      colMenu: ['bg_color_7']
    },
    options: {
      theme: {
        // 子组件的style参数
        menu: {
          menuBackground: 'bg_color_7',
          fontColor: 'color_0'
        },
        logo: {
          svgFillColor: 'color_7'
        }
      },
      config: {
        // 子组件配置参数
        ...defaultData
      }
    },
    cover: require('@/../static/adi/title/title2.png'),
    preview: {
      outter: {
        height: '63px'
      }
    }
  },
  // style 3
  {
    templateID: 1,
    data: {
      // 定义mod根div的样式
      logo: {
        height: '87px',
        width: '87px',
        margin: 'auto'
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
        height: '50px',
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
      businessName: ['font_1', 'color_4'],
      tagline: ['font_3', 'color_2'],
      menu: ['mod-full-width'],
      colMenu: ['bg_color_7']
    },
    options: {
      theme: {
        // 子组件的style参数
        menu: {
          menuBackground: 'bg_color_7',
          fontColor: 'color_0'
        },
        logo: {
          svgFillColor: 'color_7'
        }
      },
      config: {
        ...defaultData,
        menu: _.merge({}, defaultData.menu, { itemStyle: { float: 'right' } })
      }
    },
    cover: require('@/../static/adi/title/title2.png'),
    preview: {
      outter: {
        height: '63px'
      }
    }
  },
  // style 4
  {
    templateID: 2,
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
      logoB: {
        height: '64px',
        width: '64px'
      },
      colMenuB: {
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
      colMenuB: {
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
          fontSize: 'font_6',
          fontColor: 'color_3',
          color: 'color_7',
          backgroundColor: 'color_5',
          borderBottomColor: 'color_7'
        },
        logoB: {
          svgFillColor: 'color_7'
        }
      },
      config: {
        ...defaultData
      }
    },
    preview: {
      outter: {
        height: '5px'
      }
    }
  }
]
