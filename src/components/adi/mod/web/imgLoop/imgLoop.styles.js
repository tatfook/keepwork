import _ from 'lodash'

let emptyData = {
  imgLoop: {
    data: [
      {
        img: require('@/../static/adi/imgLoop/imgCarouselOne.jpg'),
        link: 'http://keepwork.com'
      },
      {
        img: require('@/../static/adi/imgLoop/imgCarouselTwo.jpg'),
        link: 'http://keepwork.com'
      }
    ]
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
        imgLoop: _.merge({}, { height: '150px' }, emptyData.imgLoop)
      }
    },
    cover: require('@/../static/adi/imgLoop/thumbnail.png')
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
    cover: require('@/../static/adi/imgLoop/thumbnail.png')
  }
]
