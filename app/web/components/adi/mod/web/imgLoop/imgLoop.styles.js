import _ from 'lodash'

let emptyData = {
  imgLoop: {
    emptyGallery: {
      img: require('@/assets/adi/imgLoop/imgCarouselOne.jpg'),
      link: '',
      target: '_blank',
      autoplay: false,
      playloop: false,
      poster: ''
    }
  }
}

export default [
  // style 0
  {
    data: {
      // 定义mod根div的样式
      root: {
        position: 'relative',
        overflow: 'hidden',
        zoom: 1
      }
    },
    theme: {
      root: []
    },
    options: {
      theme: {},
      config: {
        ...emptyData,
        imgLoop: _.merge({}, emptyData.imgLoop, {
          img: {
            shrink: '1',
            numerator: '9',
            denominator: '21',
            defaultWebHeight: '150px',
            defaultMobileHeight: '150px'
          }
        })
      }
    },
    cover: ''
  },

  // style 1
  {
    theme: {
      root: []
    },
    options: {
      theme: {},
      config: {
        ...emptyData,
        imgLoop: _.merge({}, emptyData.imgLoop, {
          img: {
            shrink: '0.8',
            numerator: '9',
            denominator: '21',
            defaultWebHeight: '150px',
            defaultMobileHeight: '150px'
          }
        })
      }
    },
    cover: ''
  },

  // style 2
  {
    theme: {
      root: []
    },
    options: {
      theme: {},
      config: {
        ...emptyData,
        imgLoop: _.merge({}, emptyData.imgLoop, {
          img: {
            shrink: '1',
            numerator: '9',
            denominator: '16',
            defaultWebHeight: '150px',
            defaultMobileHeight: '150px'
          }
        })
      }
    },
    cover: ''
  },

  // style 3
  {
    theme: {
      root: []
    },
    options: {
      theme: {},
      config: {
        ...emptyData,
        imgLoop: _.merge({}, emptyData.imgLoop, {
          img: {
            shrink: '0.8',
            numerator: '9',
            denominator: '16',
            defaultWebHeight: '150px',
            defaultMobileHeight: '150px'
          }
        })
      }
    },
    cover: ''
  },

  // style 4
  {
    theme: {
      root: []
    },
    options: {
      theme: {},
      config: {
        ...emptyData,
        imgLoop: _.merge({}, emptyData.imgLoop, {
          img: {
            shrink: '1',
            numerator: '3',
            denominator: '4',
            defaultWebHeight: '150px',
            defaultMobileHeight: '150px'
          }
        })
      }
    },
    cover: ''
  },

  // style 5
  {
    theme: {
      root: []
    },
    options: {
      theme: {},
      config: {
        ...emptyData,
        imgLoop: _.merge({}, emptyData.imgLoop, {
          img: {
            shrink: '0.8',
            numerator: '3',
            denominator: '4',
            defaultWebHeight: '150px',
            defaultMobileHeight: '150px'
          }
        })
      }
    },
    cover: ''
  },

  // style 6
  {
    theme: {
      root: []
    },
    options: {
      theme: {},
      config: {
        ...emptyData,
        imgLoop: _.merge({}, emptyData.imgLoop, {
          img: {
            shrink: '1',
            numerator: '1',
            denominator: '1',
            defaultWebHeight: '150px',
            defaultMobileHeight: '150px'
          }
        })
      }
    },
    cover: ''
  },

  // style 7
  {
    theme: {
      root: []
    },
    options: {
      theme: {},
      config: {
        ...emptyData,
        imgLoop: _.merge({}, emptyData.imgLoop, {
          img: {
            shrink: '0.8',
            numerator: '1',
            denominator: '1',
            defaultWebHeight: '150px',
            defaultMobileHeight: '150px'
          }
        })
      }
    },
    cover: ''
  }
]
