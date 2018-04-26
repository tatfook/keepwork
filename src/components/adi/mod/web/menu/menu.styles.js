export default [
  // style 0
  {
    templateID: 0,
    data: {
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
          emptyData: [
            {
              name: 'adi.menu.menu',
              link: 'http://keepwork.com'
            }
          ],
          emptyTarget: '_blank'
        }
      }
    },
    cover: require('@/../static/adi/menu/menu.png'),
    preview: {
      outter: {
        height: '14px'
      }
    }
  }
]
