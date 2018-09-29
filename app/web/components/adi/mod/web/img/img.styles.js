import _ from 'lodash'

let emptyData = {
  img: {
    emptySrc: require('@/assets/adi/img/imgTwo.png'),
    emptyLink: process.env.KEEPWORK,
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
        ...emptyData,
        img: _.merge({}, emptyData.img, {
          img: {
            styleId: 0,
            defaultWebHeight: '600px',
            defaultMobileHeight: '160px',
            defaultWebWidth: 'auto',
            defaultMobileWidth: 'auto'
          }
        })
      }
    },
    cover: ''
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
            styleId: 0,
            defaultWebHeight: '800px',
            defaultMobileHeight: '240px',
            defaultWebWidth: 'auto',
            defaultMobileWidth: 'auto'
          }
        })
      }
    },
    cover: ''
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
      root: ['mod-full-width', 'mod-space']
    },
    options: {
      theme: {},
      config: {
        ...emptyData,
        img: {
          styleId: 1
        }
      }
    },
    cover: ''
  }
]
