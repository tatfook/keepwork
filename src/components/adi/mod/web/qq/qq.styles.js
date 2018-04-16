let emptyData = {
  pic: {
    emptySrc: require('@/../static/adi/qq/qqMod.png'),
    emptyLink: 'http://keepwork.com'
  },
  desc: {
    emptyName: '客服中心',
    emptyLink: 'http://keepwork.com'
  }
}

export default [
  // style 0 上图下文
  {
    data: {
      root: {
        'z-index': '3',
        position: 'fixed',
        height: '120px'
      },
      colGroup: {
        position: 'fixed',
        right: '40px',
        top: '15%',
        'padding-top': '15px'
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
        'min-width': '70px',
        display: 'flex',
        'justify-content': 'flex-end'
      }
    },
    props: {
      colGroup: {
        xs: {
          span: 8,
          offset: 16
        },
        sm: {
          span: 4,
          offset: 20
        }
      },
      colPic: { span: 24 },
      colDesc: { span: 24 }
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
      config: {
        ...emptyData
      }
    },
    cover: require('@/../static/adi/qq/cover/qqCoverOne.png')
  },

  // style 1 左图右文
  {
    data: {
      root: {
        'z-index': '3',
        position: 'fixed',
        height: '120px'
      },
      colGroup: {
        display: 'flex',
        'justify-content': 'flex-end',
        position: 'fixed',
        right: '40px',
        top: '15%',
        'padding-top': '15px'
      },
      pic: {
        width: '70px',
        height: '70px',
        'border-radius': '50%'
      },
      colPic: {
        'min-width': '70px'
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
        'min-width': '70px',
        'margin-top': '48px'
      }
    },
    props: {
      colGroup: {
        xs: {
          span: 12,
          offset: 12
        },
        sm: {
          span: 6,
          offset: 18
        }
      },
      colPic: { span: 12 },
      colDesc: { span: 12 }
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
      config: {
        ...emptyData
      }
    },
    cover: require('@/../static/adi/qq/cover/qqCoverTwo.png')
  }
]
