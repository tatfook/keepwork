export default [
  // style 1
  {
    data: {
      root: {
        'z-index': '999'
      },
      pic: {
        position: 'fixed',
        right: '10px',
        width: '70px',
        height: '70px',
        'border-radius': '50%'
      },
      colPic: {
        display: 'flex',
        'justify-content': 'flex-end'
      },
      desc: {
        position: 'fixed',
        right: '10px',
        width: '70px',
        'text-align': 'center',
        overflow: 'hidden',
        'white-space': 'nowrap',
        'text-overflow': 'ellipsis'
      },
      colDesc: {
        display: 'flex',
        'justify-content': 'flex-end'
      }
    },
    props: {
      colPic: {
        span: 4,
        offset: 20
      },
      colDesc: {
        span: 4,
        offset: 20
      }
    },
    theme: {
      root: ['font_0', 'color_0'],
      desc: ['color_1']
    },
    options: {
      theme: {
        desc: {
          fontSize: 'font_1',
          fontColor: 'color_0'
        }
      },
      config: {}
    }
  }
]
