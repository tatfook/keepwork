export default [
  // style 0
  {
    templateID: 0,
    data: {
      // 定义mod根div的样式
      menu: {
        height: '50px',
        margin: 'auto'
      },
      colMenu: {
        'margin-top': '20px'
      }
    },
    props: {
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
        }
      },
      config: {
        // 子组件配置参数
        menu: {
          mode: 'horizontal'
        }
      }
    },
    cover: require('@/../static/adi/menu/menu.jpeg')
  }
]
