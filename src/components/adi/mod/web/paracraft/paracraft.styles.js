export default [
  // style 1
  {
    data: {
      root: {
        overflow: 'hidden',
        'background-color': '#F9F9F9',
        'box-shadow': '0 0 5px 0 rgba(44,62,80,.35)'
      },
      preview: {
        height: '200px'
      },
      colGroupLeft: {
        padding: '20px'
      },
      viewTimesImg: {
        width: '24px',
        height: '17px'
      },
      colViewTimesImg: {
        width: 'auto'
      },
      colGroupA: {
        'padding-left': '10px'
      },
      colGroupB: {
        'margin-top': '40px',
        'padding-left': '10px'
      },
      colGroupC: {
        'margin-top': '10px',
        'padding-left': '10px'
      },
      colDialog: {}
    },
    props: {
      rootRow: { gutter: 10 },
      colPreview: {
        lg: {
          span: 6
        },
        md: {
          span: 24
        }
      },
      colGroupLeft: {
        lg: { span: 14 },
        md: { span: 24 }
      },
      colWorldName: {
        span: 8
      },
      colGroupVersionAndUpdateTime: {
        offset: 8,
        span: 8
      },
      colAuthor: {
        span: 8
      },
      colGroupCA: {
        span: 15
      },
      colGroupCARow: {
        gutter: 5
      },
      colViewTimes: {
        span: 6
      },
      colSize: {
        span: 6
      },
      colGroupCB: {
        span: 9
      },
      colGroupCBRow: {
        gutter: 10
      },
      colDownload: {
        span: 11
      },
      colEnter: {
        span: 11
      }
    },
    theme: {
      root: ['font_0', 'color_0'],
      title: ['color_0']
    },
    options: {
      theme: {
        download: {
          fontSize: 'font_0',
          fontColor: 'color_7',
          bgColor: 'color_0'
        },
        enter: {
          fontSize: 'font_0',
          fontColor: 'color_7',
          bgColor: 'color_0'
        }
      },
      config: {}
    },
    cover: 'http://keepwork.com/wiki/js/mod/wiki/assets/imgs/3DWorld_model.jpg'
  }
]
