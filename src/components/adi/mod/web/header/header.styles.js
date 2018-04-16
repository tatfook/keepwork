export default [
  // style 0
  {
    templateID: 0,
    data: {
      // 定义mod根div的样式
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
        'align-items': 'center'
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
      root: ['font_0', 'color_7', 'mod-space'],
      colGroupRow: ['mod-full-width'],
      menu: ['mod-full-width'],
      colMenu: ['bg_color_0']
    },
    options: {
      theme: {
        // 子组件的style参数
        menu: {
          menuBackground: 'bg_color_0',
          fontColor: 'color_7'
        },
        businessName: {
          fontSize: 'font_5',
          fontColor: 'color_3'
        },
        tagline: {
          fontSize: 'font_2',
          fontColor: 'color_2'
        }
      },
      config: {
        // 子组件配置参数
        menu: {
          mode: 'horizontal'
        },
        logo: {
          emptySrc: require('@/../static/adi/logo.png')
        },
        businessName: {
          emptyName: 'BUSINESS NAME'
        },
        tagline: {
          emptyName: 'TAG LINE'
        }
      }
    },
    cover:
      'http://git.keepwork.com/gitlab_rls_kaitlyn/keepworkdatasource/raw/master/kaitlyn_images/img_1522232384706.jpeg'
  },
  {
    // style 1
    templateID: 1,
    data: {
      // 定义mod根div的样式
      logo: {
        height: '87px',
        width: '87px',
        margin: 'auto'
      },
      colCouple: {
        'min-width': '200px',
        height: '60px',
        display: 'flex',
        'align-items': 'center'
      },
      colCoupleRow: {
        margin: 'auto',
        'text-align': 'center'
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
      root: ['font_0', 'color_7', 'mod-space'],
      menu: ['mod-full-width'],
      colMenu: ['bg_color_0']
    },
    options: {
      theme: {
        // 子组件的style参数
        menu: {
          menuBackground: 'bg_color_0',
          fontColor: 'color_7'
        },
        businessName: {
          fontSize: 'font_5',
          fontColor: 'color_3'
        },
        tagline: {
          fontSize: 'font_2',
          fontColor: 'color_2'
        }
      },
      config: {
        // 子组件配置参数
        menu: {
          mode: 'horizontal'
        },
        logo: {
          emptySrc: require('@/../static/adi/logo.png')
        }
      }
    },
    cover:
      'http://git.keepwork.com/gitlab_rls_kaitlyn/keepworkdatasource/raw/master/kaitlyn_images/img_1522232391869.jpeg'
  }
]
