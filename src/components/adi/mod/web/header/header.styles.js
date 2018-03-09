export default [
  // style1
  {
    data: {
      root: {
        margin: '30px'
      },
      menu: {
        padding: '10px'
      }
    },
    theme: {
      root: ['font_0', 'color_1', 'bg_color_0']
    },
    options: {
      menu: {
        bgColor1: 'bg_color_1'
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
      'mod-header-label': ['font_0', 'color_0', 'bg_color_0']
    },
    options: {
      menu: {
        bgColor1: 'bg_color_0'
      }
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
