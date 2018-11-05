import _ from 'lodash'

let emptyData = {
  imgLoop: {
    emptyGallery: {
      img: require('@/assets/adi/imgLoop/imgCarouselOne.jpg'),
      link: ''
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
          height: '150px'
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
      config: { ...emptyData }
    },
    cover: ''
  }
]
