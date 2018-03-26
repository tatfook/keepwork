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
        width: '300px',
        height: '200px'
      },
      colPreview: {
        width: 'auto'
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
      colGroupB: {
        'margin-top': '60px'
      },
      colGroupC: {
        'margin-top': '10px'
      }
    },
    props: {
      rootRow: { gutter: 10 },
      colGroupLeft: { span: 14 },
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
        span: 12
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
        span: 12
      },
      colGroupCBRow: {
        gutter: 10
      },
      colDownload: {
        span: 8
      },
      colEnter: {
        span: 8
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
    }
  }
]
