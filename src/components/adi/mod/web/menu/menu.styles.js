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
      root: ['mod-space'],
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
          emptyData: [
            {
              name: '菜单1',
              link: 'http://keepwork.com'
            }
          ],
          emptyTarget: '_blank'
        }
      }
    },
    cover: require('@/../static/adi/menu/menu.jpeg')
  }
]
