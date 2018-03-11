export default [
  // style1
  {
    data: {
      // 定义mod根div的样式
      root: {
        // margin: '30px'
      },
      // 定义子组件menu的wrapper样式
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
