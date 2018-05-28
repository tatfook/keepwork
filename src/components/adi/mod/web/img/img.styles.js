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
      root: []
    },
    options: {
      theme: {},
      config: { ...emptyData }
    },
    preview: {
      outter: {
        height: '190.56px'
      }
    }
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
      root: []
    },
    options: {
      theme: {},
      config: { ...emptyData }
    },
    preview: {
      outter: {
        height: '260.74px'
      }
    }
  }
]
