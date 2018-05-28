let emptyData = {
  imgLoop: {
    data: []
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
        imgLoop: { height: '150px' }
      }
    },
    preview: {
      outter: {
        height: '32.64px'
      }
    }
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
    preview: {
      outter: {
        height: '85.28px'
      }
    }
  }
]
