export default [
  {
    templateID: 0,
    data: {
      // 定义mod根div的样式
      animation: {
        height: '160px'
      },
      '@media only screen and (max-width: 767px)': {
        animation: {
          height: '160px'
        }
      },
      colGroupAA: {
        display: 'flex',
        'align-items': ' flex-start'
      },
      lessonGoals: {
        color: 'black',
        'margin-top': '15px',
        'text-indent': '28px',
        'word-wrap': 'break-word',
        'white-space': 'pre-wrap'
      },
      button: {
        'margin-top': '20px'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colGroupARow: { gutter: 24 },
      colMedia: {
        xs: { span: 10 },
        sm: { span: 8 }
      },
      colGroupAA: {
        xs: { span: 14 },
        sm: { span: 16 }
      },
      colButton: {
        xs: {
          span: 6,
          push: 18
        },
        sm: {
          span: 3,
          push: 21
        }
      }
    },
    theme: {
      root: ['font_0', 'color_7', 'mod-space'],
      colGroupRow: ['mod-full-width'],
      paragraph: ['color_8']
    },
    options: {
      theme: {
        title: {
          fontSize: 'font_5',
          fontColor: 'color_8'
        },
        subtitle: {
          fontSize: 'font_2',
          fontColor: 'color_8'
        },
        button: {
          fontSize: 'font_0',
          fontColor: 'color_7',
          bgColor: 'color_0'
        }
      },
      config: {}
    },
    cover: './static/adi/mixPosition/cover/projectOne.png'
  }
]
