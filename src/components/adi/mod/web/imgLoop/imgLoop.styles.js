let emptyData = {
  imgLoop: [
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
      root: ['mod-space']
    },
    options: {
      theme: {},
      config: {
        ...emptyData,
        imgLoop: {
          emptydata: emptyData,
          height: '150px'
        }
      }
    },
    cover: require('@/../static/adi/imgLoop/thumbnail.png')
  },

  // style 1
  {
    theme: {
      root: ['mod-space']
    },
    options: {
      theme: {},
      config: { ...emptyData }
    },
    cover: require('@/../static/adi/imgLoop/thumbnail.png')
  }
]
