import _ from 'lodash'

let emptyData = {
  img: {
    emptyMedia: require('@/assets/adi/img/imgTwo.png'),
    emptyLink: '',
    emptyLinkTarget: '_blank'
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
        ...emptyData,
        img: _.merge({}, emptyData.img, {
          img: {
            defaultWebHeight: '600px',
            defaultMobileHeight: '160px',
            defaultWebWidth: 'auto',
            defaultMobileWidth: 'auto'
          }
        })
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
        ...emptyData,
        img: _.merge({}, emptyData.img, {
          img: {
            defaultWebHeight: '800px',
            defaultMobileHeight: '240px',
            defaultWebWidth: 'auto',
            defaultMobileWidth: 'auto'
          }
        })
      }
    }
  },
  // style 2
  {
    templateID: 0,
    componentID: 1,
    data: {},
    props: {},
    theme: {},
    options: {
      theme: {},
      config: {
        ...emptyData
      }
    }
  }
]
