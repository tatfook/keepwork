import _ from 'lodash'

let emptyData = {
  imgLoop: {
    emptyGallery: {
      img: require('@/assets/adi/imgLoop/imgCarouselOne.jpg'),
      webHeight: '153px',
      link: '',
      target: '_blank',
      autoplay: true,
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
            defaultWebHeight: '300px',
            defaultMobileHeight: '300px'
          }
        })
      }
    },
    cover: ''
  }
]
