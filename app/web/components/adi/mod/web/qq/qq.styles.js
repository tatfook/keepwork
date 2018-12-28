import _ from 'lodash'

let emptyData = {
  pic: {
    emptyMedia: require('@/assets/adi/qq/qqOne.svg'),
    link: '',
    target: '_blank',
    autoplay: false,
    playloop: false,
    poster: '',
    isVideoTabShow: false
  },
  desc: {
    emptyInput: 'adi.qq.desc',
    emptyInputPlaceholder: 'descText',
    emptyLink: '',
    emptyLinkTarget: '_blank'
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
      colPic: {
        'min-width': '100px',
        display: 'flex',
        'justify-content': 'center'
      },
      pic: {
        'border-radius': '50%'
      },
      colDesc: {
        'min-width': '100px',
        display: 'flex',
        'justify-content': 'center'
      },
      desc: {
        'text-align': 'center'
      }
    },
    props: {
      colGroup: {
        xs: {
          span: 3,
          offset: 21
        },
        sm: {
          span: 2,
          offset: 22
        }
      },
      colPic: { span: 24 },
      colDesc: { span: 24 }
    },
    theme: {
      root: [],
      desc: ['auxiliaryText', 'desc']
    },
    options: {
      theme: {},
      config: {
        ...emptyData,
        pic: _.merge({}, emptyData.pic, {
          img: {
            defaultWebHeight: '70px',
            defaultMobileHeight: '70px',
            defaultWebWidth: '70px',
            defaultMobileWidth: '70px'
          }
        })
      }
    },
    cover: ''
  },

  // style 1 左图右文
  {
    data: {
      root: {
        'z-index': '3',
        position: 'fixed',
        height: '100px'
      },
      colGroup: {
        position: 'fixed',
        right: '40px',
        top: '15%',
        'padding-top': '15px',
        display: 'flex',
        'justify-content': 'flex-end'
      },
      colPic: {
        'min-width': '100px',
        'padding-right': '10px',
        display: 'flex',
        'justify-content': 'flex-end'
      },
      pic: {
        'border-radius': '50%'
      },
      colDesc: {
        display: 'flex',
        'min-width': '100px',
        'justify-content': 'flex-start',
        'align-items': 'flex-end',
        height: '100%'
      },
      desc: {}
    },
    props: {
      colGroup: {
        xs: {
          span: 12,
          offset: 12
        },
        sm: {
          span: 9,
          offset: 15
        }
      },
      colPic: { span: 12 },
      colDesc: { span: 12 }
    },
    theme: {
      root: [],
      desc: ['auxiliaryText', 'desc']
    },
    options: {
      theme: {},
      config: {
        ...emptyData,
        desc: {
          ...emptyData.desc,
          buttonStyle: {
            border: '1px solid #3ba4ff',
            'border-radius': '18px',
            padding: '4px'
          }
        },
        pic: {
          ...emptyData.pic,
          emptyMedia: require('@/assets/adi/qq/qqTwo.svg'),
          img: {
            defaultWebHeight: '70px',
            defaultMobileHeight: '70px',
            defaultWebWidth: '70px',
            defaultMobileWidth: '70px'
          }
        }
      }
    },
    cover: ''
  }
]
