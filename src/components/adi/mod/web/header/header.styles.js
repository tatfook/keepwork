export default [
  // style1
  {
    data: {
      // 定义mod根div的样式
      root: {
        margin: '30px'
      },
      // 定义子组件menu的wrapper样式
      menu: {
        width: '100%'
      }
    },
    theme: {
      root: ['font_0', 'color_1']
    },
    options: {
      theme: {
        // 子组件的style参数
        menu: {
          bgColor1: 'bg_color_1'
        }
      },
      config: {
        // 子组件配置参数
        menu: {
          mode: 'horizontal'
        }
      }
    }
  },
  // style2
  {
    data: {
      'mod-header-menu': {
        margin: '50px 0'
      },
      'mod-header-media': {
        width: '20%',
        'min-width': '30px',
        margin: 'auto'
      }
    },
    theme: {
      'mod-header-label': ['font_0', 'color_0']
    },
    options: {
      // theme: optionTheme1,
      // config: childDataOption1
    }
  },
  // style3
  {
    data: {
      'mod-header-menu': {
        margin: '20px 0'
      },
      'mod-header-media': {
        width: '40%',
        'min-width': '30px'
      },
      'mod-header-label': {
        width: '60%',
        'min-width': '80px'
      }
    },
    theme: {
      'mod-header-label': ['font_0', 'color_0']
    }
  }
]
