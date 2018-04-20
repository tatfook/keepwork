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
      root: ['mod-space'],
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
        menu: {
          mode: 'horizontal',
          emptyData: [
            {
              name: '菜单1',
              link: 'http://keepwork.com'
            }
          ],
          emptyTarget: '_blank'
        },
        logo: {
          emptySrc: require('@/../static/adi/title/bear.svg'),
          emptyLink: 'http://keepwork.com',
          emptyTarget: '_blank'
        },
        businessName: {
          emptyName: 'BUSINESS NAME',
          emptyLink: 'http://keepwork.com',
          emptyTarget: '_blank'
        },
        tagline: {
          emptyName: 'TAG LINE',
          emptyLink: 'http://keepwork.com',
          emptyTarget: '_blank'
        }
      }
    },
    cover: require('@/../static/adi/title/titleOne.jpeg')
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
      root: ['mod-space'],
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
        menu: {
          mode: 'horizontal',
          emptyData: [
            {
              name: '菜单1',
              link: 'http://keepwork.com'
            }
          ],
          emptyTarget: '_blank'
        },
        logo: {
          emptySrc: require('@/../static/adi/title/bear.svg'),
          emptyLink: 'http://keepwork.com',
          emptyTarget: '_blank'
        },
        businessName: {
          emptyName: 'BUSINESS NAME',
          emptyLink: 'http://keepwork.com',
          emptyTarget: '_blank'
        },
        tagline: {
          emptyName: 'TAG LINE',
          emptyLink: 'http://keepwork.com',
          emptyTarget: '_blank'
        }
      }
    },
    cover: require('@/../static/adi/title/titleTwo.jpeg')
  }
]
