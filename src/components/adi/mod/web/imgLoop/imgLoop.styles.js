export default [
  // style 0
  {
    data: {
      // 定义mod根div的样式
      root: {
        position: 'relative',
        overflow: 'hidden',
        zoom: 1
      },
      media: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        'z-index': -1
      },
      group: {
        width: '50%',
        float: 'left',
        'margin-left': '5px'
      }
    },
    theme: {
      root: ['font_0', 'color_0'],
      paragraph: ['color_3']
    },
    options: {
      theme: {},
      config: {
        imgLoop: {
          height: '150px'
        }
      }
    },
    cover:
      'http://git.keepwork.com/gitlab_rls_kaitlyn/keepworkdatasource/raw/master/kaitlyn_images/img_1522231482952.png'
  },
  // style2
  {
    cover:
      'http://git.keepwork.com/gitlab_rls_kaitlyn/keepworkdatasource/raw/master/kaitlyn_images/img_1522231747641.jpeg'
  }
]
