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
        width: '100%'
      }
    },
    props: {
      root: {},
      colImg: { span: 24 }
    },
    theme: {
      root: []
    },
    options: {
      theme: {},
      config: {
        img: {
          ...emptyData['img'],
          defaultWebHeight: '600px',
          defaultMobileHeight: '160px'
        }
      }
    },
    cover: require('@/../static/adi/img/cover/imgOne.png'),
    preview: {
      outter: {
        height: '157px'
      }
    }
  },

  // style 1
  {
    templateID: 0,
    data: {
      img: {
        width: '100%'
      }
    },
    props: {
      root: {},
      colImg: { span: 24 }
    },
    theme: {
      root: []
    },
    options: {
      theme: {},
      config: {
        img: {
          ...emptyData['img'],
          defaultWebHeight: '800px',
          defaultMobileHeight: '240px'
        }
      }
    },
    cover: require('@/../static/adi/img/cover/imgTwo.png'),
    preview: {
      outter: {
        height: '209px'
      }
    }
  }
]
