export default [
  // style1
  {
    data: {
      // 定义mod根div的样式
      root: {},
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
      colMenu: {
        'padding-top': '5px',
        'padding-bottom': '5px'
      },
      // 定义子组件menu的wrapper样式
      menu: {
        width: '100%',
        height: '50px'
      }
    },
    props: {
      colLogo: { span: 10 },
      colCouple: { span: 16 },
      rootRow: { gutter: 10 }
    },
    theme: {
      root: ['font_0', 'color_7']
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
          mode: 'horizontal',
          itemStyle: `float: left`
        }
      }
    }
  },
  // style2
  {
    data: {
      root: {},
      menu: {
        width: '100%',
        height: '50px'
      }
    },
    theme: {
      root: ['font_0', 'color_7']
    },
    options: {
      theme: {
        // 子组件的style参数
        menu: {
          menuBackground: 'bg_color_0',
          fontColor: 'color_7'
        }
      },
      config: {
        // 子组件配置参数
        menu: {
          mode: 'horizontal',
          itemStyle: `float: right`
        }
      }
    }
  }
]
