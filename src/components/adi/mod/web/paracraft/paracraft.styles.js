export default [
  // style 0
  {
    templateID: 0,
    data: {
      root: {
        position: 'relative'
      },
      colGroup: {
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
      '@media only screen and (max-width: 787px)': {
        preview: {
          height: '250px'
        }
      }
    },
    props: {
      colGroupRow: { gutter: 10 },
      colPreview: {
        sm: {
          span: 6
        },
        xs: {
          span: 24
        }
      },
      colGroupLeft: {
        sm: { span: 14 },
        xs: { span: 24 }
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
      root: ['font_0', 'color_0', 'mod-space'],
      rootRow: ['mod-full-width'],
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
      config: {
        innerModal: {
          width: '70%',
          height: '80%',
          'background-color': 'white'
        }
      }
    },
    cover: 'http://keepwork.com/wiki/js/mod/adi/assets/images/paracraft1.png'
  },
  // style 1
  {
    templateID: 1,
    data: {
      preview: {
        height: '314px'
      },
      '@media only screen and (max-width: 767px)': {
        colPreview: {
          'margin-top': '10px'
        },
        colGroupAB: {
          'margin-top': '10px'
        },
        colDesc: {
          'margin-top': '10px'
        }
      }
    },
    props: {
      colGroupAA: {
        sm: {
          span: 8
        }
      },
      colWorldName: {
        sm: {
          span: 10
        }
      },
      colAuthor: {
        sm: {
          span: 8
        }
      },
      colGroupAB: {
        sm: {
          offset: 10,
          span: 6
        }
      },
      colGroupABRow: {
        gutter: 20
      },
      colDownload: {
        span: 12
      },
      colEnter: {
        span: 12
      },
      colGroupBRow: {
        gutter: 30
      },
      colPreview: {
        sm: {
          span: 8
        },
        xs: {
          span: 24
        }
      },
      colDesc: {
        sm: {
          span: 16
        },
        xs: {
          span: 24
        }
      }
    },
    theme: {
      root: ['font_0', 'color_0', 'mod-space'],
      rootRow: ['mod-full-width'],
      title: ['color_0']
    },
    options: {
      theme: {
        download: {
          fontSize: 'font_0'
        },
        enter: {
          fontSize: 'font_0',
          fontColor: 'color_7',
          bgColor: 'color_0'
        }
      },
      config: {
        download: {
          elBtn: 'default',
          img: {
            width: '20px',
            height: '20px',
            src: 'http://keepwork.com/wiki/js/mod/adi/assets/imgs/down.png'
          }
        },
        innerModal: {
          width: '70%',
          height: '80%',
          'background-color': 'white'
        }
      }
    },
    cover: 'http://keepwork.com/wiki/js/mod/adi/assets/images/paracraft2.png'
  },
  // style 2
  {
    templateID: 2,
    data: {
      preview: {
        height: '314px'
      },
      '@media only screen and (max-width: 767px)': {
        colGroupA: {
          'margin-top': '10px'
        },
        colAuthor: {
          'margin-top': '10px'
        },
        colDesc: {
          'margin-top': '10px'
        },
        colGroupAA: {
          'margin-top': '10px'
        }
      },
      '@media only screen and (min-width: 768px)': {
        colGroupAA: {
          'margin-top': '40px'
        }
      }
    },
    props: {
      colGroupRow: {
        gutter: 30
      },
      colPreview: {
        sm: {
          span: 9
        }
      },
      colGroupA: {
        sm: {
          span: 15
        }
      },
      colGroupAA: {
        sm: {
          span: 9
        }
      },
      colGroupAARow: {
        gutter: 10
      },
      colDownload: {
        span: 12
      },
      colEnter: {
        span: 12
      }
    },
    theme: {
      root: ['font_0', 'color_0', 'mod-space'],
      rootRow: ['mod-full-width'],
      title: ['color_0']
    },
    options: {
      theme: {
        download: {
          fontSize: 'font_0'
        },
        enter: {
          fontSize: 'font_0',
          fontColor: 'color_7',
          bgColor: 'color_0'
        }
      },
      config: {
        download: {
          elBtn: 'default',
          img: {
            width: '20px',
            height: '20px',
            src: 'http://keepwork.com/wiki/js/mod/adi/assets/imgs/down.png'
          }
        },
        innerModal: {
          width: '70%',
          height: '80%',
          'background-color': 'white'
        }
      }
    },
    cover: 'http://keepwork.com/wiki/js/mod/adi/assets/images/paracraft3.png'
  }
]
