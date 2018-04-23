let emptyData = {
  pic: {
    emptySrc: require('@/../static/adi/qq/qqOne.svg'),
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  desc: {
    emptyName: 'adi.qq.desc',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
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
        'text-align': 'center'
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
      root: [],
      desc: ['font_9', 'color_7']
    },
    options: {
      theme: {
        pic: {
          svgFillColor: 'color_4'
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
        'line-height': '19px',
        border: '1px solid #3ba4ff',
        'border-radius': '8px'
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
      root: [],
      desc: ['font_9', 'color_7']
    },
    options: {
      theme: {
        pic: {
          svgFillColor: 'color_7'
        }
      },
      config: {
        ...emptyData
      }
    },
    cover: require('@/../static/adi/qq/cover/qqCoverTwo.png')
  }
]
