export default [
  // style 0
  {
    templateID: 0,
    data: {
      // 定义mod根div的样式
      menu: {
        height: '50px',
        margin: 'auto'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: [],
      menu: ['mod-full-width', 'font_3'],
      colMenu: ['bg_color_7']
    },
    options: {
      theme: {
        menu: {
          menuBackground: 'bg_color_7',
          fontColor: 'color_0'
        }
      },
      config: {
        menu: {
          mode: 'horizontal',
          emptyTarget: '_blank'
        }
      }
    },
    cover: require('@/../static/adi/menu/menu.png')
  }
]
