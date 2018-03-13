export default [
  // style1
  {
    data: {
      // 定义mod根div的样式
      root: {
        height: '203px',
        position: 'relative'
      },
      logo: {
        height: '87px',
        width: '87px',
        'padding-left': '28px',
        'padding-right': '28px',
        'padding-top': '30px',
        'padding-bottom': '30px',
        position: 'absolute',
        top: 0,
        left: 0
      },
      couple: {
        position: 'absolute',
        top: '35%',
        left: '145px',
        transform: 'translateY(-50%)'
      },
      // 定义子组件menu的wrapper样式
      menu: {
        width: '100%',
        height: '50px',
        position: 'absolute',
        top: '153px',
        left: 0
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
