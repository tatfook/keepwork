export default [
  // style 1
  {
    data: {
      root: {},
      colPicDesc: {
        'z-index': '999'
        // position: 'fixed',
        // right: '10px',
        // top: '20%'
      },
      pic: {
        width: '70px',
        height: '70px',
        'border-radius': '50%'
      },
      colPic: {
        'min-width': '70px',
        display: 'flex',
        'justify-content': 'flex-end'
      },
      desc: {
        width: '70px',
        'text-align': 'center',
        overflow: 'hidden',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis'
      },
      colDesc: {
        display: 'flex',
        'justify-content': 'flex-end'
      }
    },
    props: {
      colPicDesc: {
        xs: { span: 8, offset: 16 },
        sm: { span: 4, offset: 20 },
        md: { span: 4, offset: 20 },
        lg: { span: 4, offset: 20 }
      },
      colPic: {
        span: 24
      },
      colDesc: {
        span: 24
      }
    },
    theme: {
      root: ['font_0', 'color_0']
    },
    options: {
      theme: {
        desc: {
          fontSize: 'font_1',
          fontColor: 'color_0'
        }
      },
      config: {}
    },
    cover: './static/adi/qq/cover/qqCoverOne.png'
  },

  // style 2
  {
    data: {
      root: {},
      colPicDesc: {
        'z-index': '999',
        // position: 'fixed',
        // right: '10px',
        // top: '20%',
        display: 'flex',
        'justify-content': 'flex-end'
      },
      pic: {
        width: '70px',
        height: '70px',
        'border-radius': '50%'
      },
      colPic: {
        'min-width': '70px',
        height: '70px',
        display: 'flex',
        'justify-content': 'center'
      },
      desc: {
        width: '70px',
        'text-align': 'center',
        border: '1px solid #3977AD',
        'border-radius': '8px',
        overflow: 'hidden',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis'
      },
      colDesc: {
        width: '70px',
        height: '70px',
        display: 'flex',
        'align-items': 'flex-end'
      }
    },
    props: {
      colPicDesc: {
        xs: { span: 12, offset: 12 },
        sm: { span: 6, offset: 18 },
        md: { span: 6, offset: 18 },
        lg: { span: 6, offset: 18 }
      },
      colPic: {
        span: 12
      },
      colDesc: {
        span: 12
      }
    },
    theme: {
      root: ['font_0', 'color_0']
    },
    options: {
      theme: {
        desc: {
          fontSize: 'font_1',
          fontColor: 'color_0'
        }
      },
      config: {}
    },
    cover: './static/adi/qq/cover/qqCoverTwo.png'
  }
]
