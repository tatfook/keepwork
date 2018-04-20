let emptyData = {
  img: {
    emptySrc: require('@/../static/adi/img/imgTwo.png'),
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  }
}
export default [
  // style 0
  {
    templateID: 0,
    data: {
      img: {
        width: '100%',
        height: '600px'
      },
      '@media only screen and (max-width: 767px)': {
        img: {
          width: '100%',
          height: '160px'
        }
      }
    },
    props: {
      root: {},
      colImg: { span: 24 }
    },
    theme: {
      root: ['mod-space']
    },
    options: {
      theme: {},
      config: { ...emptyData }
    },
    cover: require('@/../static/adi/img/cover/imgOne.png')
  },

  // style 1
  {
    templateID: 0,
    data: {
      img: {
        width: '100%',
        height: '800px'
      },
      '@media only screen and (max-width: 767px)': {
        img: {
          width: '100%',
          height: '240px'
        }
      }
    },
    props: {
      root: {},
      colImg: { span: 24 }
    },
    theme: {
      root: ['mod-space']
    },
    options: {
      theme: {},
      config: { ...emptyData }
    },
    cover: require('@/../static/adi/img/cover/imgTwo.png')
  }
]
