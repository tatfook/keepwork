import _ from 'lodash'

let emptyData = {
  preview: {
    emptySrc: require('@/../static/adi/paracraft/preview.jpg'),
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  worldName: {
    emptyName: 'adi.paracraft.worldName',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  backgroundImage: {
    emptySrc: require('@/../static/adi/paracraft/backgroundImage.png'),
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  titleA: {
    emptyName: 'adi.paracraft.paracraftTitle.titleA',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  subtitleA: {
    emptyName: 'adi.paracraft.paracraftSubTitle.subtitle',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  author: {
    emptyDesc: 'adi.paracraft.author.desc',
    emptyText: 'adi.paracraft.author.text',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  version: {
    emptyDesc: 'adi.paracraft.version.desc',
    emptyText: '0.0.0',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  updateTime: {
    emptyText: '2018-1-10-14-30',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  viewTimesImg: {
    emptySrc: require('@/../static/adi/paracraft/eye.png'),
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  viewTimes: {
    emptyText: '0',
    emptyDesc: 'adi.paracraft.viewTimes.desc',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  size: {
    emptyText: '31KB',
    emptySize: 'adi.paracraft.size.size',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  download: {
    emptyName: 'adi.paracraft.download.name',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  enter: {
    emptyName: 'adi.paracraft.enter.name',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  desc: {
    emptyData: 'adi.paracraft.desc.data'
  }
}

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
      colDownload: {
        'min-width': '80px'
      },
      colEnter: {
        'min-width': '80px'
      },
      '@media only screen and (max-width: 767px)': {
        preview: {
          height: '250px'
        },
        colGroupCA: {
          'margin-top': '12px'
        },
        colSize: {
          'margin-top': '10px'
        },
        colEnter: {
          'margin-top': '5px'
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
        span: 12
      },
      colGroupVersionAndUpdateTime: {
        offset: 2,
        span: 9
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
        xs: { span: 20 },
        sm: { span: 11 }
      },
      colSize: {
        xs: { span: 24 },
        sm: { span: 9 }
      },
      colGroupCB: {
        offset: 1,
        span: 11
      },
      colGroupCBRow: {
        gutter: 10
      },
      colDownload: {
        xs: {
          offset: 2,
          span: 14
        },
        sm: { span: 11 }
      },
      colEnter: {
        xs: {
          offset: 2,
          span: 14
        },
        sm: { span: 11 }
      }
    },
    theme: {
      root: ['font_6', 'mod-space'],
      rootRow: ['mod-full-width'],
      worldName: ['font_4', 'color_4'],
      download: ['font_12', 'color_4'],
      enter: ['font_12', 'color_0']
    },
    options: {
      theme: {
        download: {
          buttonStyle: {
            'background-color': 'color_1'
          }
        },
        enter: {
          buttonStyle: {
            'background-color': 'color_8'
          }
        }
      },
      config: {
        ...emptyData,
        innerModal: {
          width: '70%',
          height: '80%',
          'background-color': 'white'
        }
      }
    },
    cover: require('@/../static/adi/paracraft/paracraft1.png'),
    preview: {
      outter: {
        height: '48px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
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
      root: ['font_6', 'mod-space'],
      rootRow: ['mod-full-width'],
      worldName: ['font_4', 'color_7'],
      download: ['font_10'],
      enter: ['font_10', 'color_0'],
      desc: ['font_10', 'color_4']
    },
    options: {
      theme: {
        enter: {
          buttonStyle: {
            'background-color': 'color_8'
          }
        }
      },
      config: {
        ...emptyData,
        download: _.merge({}, emptyData.download, {
          elBtn: 'default',
          img: {
            width: '20px',
            height: '20px',
            src: require('@/../static/adi/paracraft/down.png')
          }
        }),
        innerModal: {
          width: '70%',
          height: '80%',
          'background-color': 'white'
        }
      }
    },
    cover: require('@/../static/adi/paracraft/paracraft2.png'),
    preview: {
      outter: {
        height: '87px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
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
      root: ['font_6', 'mod-space'],
      rootRow: ['mod-full-width'],
      worldName: ['font_4', 'color_7'],
      download: ['font_10'],
      enter: ['font_10', 'color_0'],
      desc: ['font_10', 'color_4']
    },
    options: {
      theme: {
        enter: {
          buttonStyle: {
            'background-color': 'color_8'
          }
        }
      },
      config: {
        ...emptyData,
        download: _.merge({}, emptyData.download, {
          elBtn: 'default',
          img: {
            width: '20px',
            height: '20px',
            src: require('@/../static/adi/paracraft/down.png')
          }
        }),
        innerModal: {
          width: '70%',
          height: '80%',
          'background-color': 'white'
        }
      }
    },
    cover: require('@/../static/adi/paracraft/paracraft3.png'),
    preview: {
      outter: {
        height: '79px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
  },
  // style 3
  {
    templateID: 3,
    data: {
      root: {
        position: 'relative'
      },
      preview: {
        height: '100%',
        'border-radius': '5px',
        overflow: 'hidden'
      },
      colTitle: {
        width: 'auto'
      },
      colViewTimesImg: {
        width: '20px',
        height: '14px',
        'margin-right': '5px'
      },
      viewTimesImg: {
        width: '100%',
        height: '100%'
      },
      '@media only screen and (max-width: 767px)': {
        colPreview: {
          'height': '200px'
        },
        colGroupBA: {
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
        },
        colViewTimes: {
          'margin-top': '-3px'
        },
        colGroupCA: {
          'margin-top': '30px'
        },
        colDownload: {
          'margin-top': '10px'
        }
      },
      '@media only screen and (min-width: 768px)': {
        colGroupB: {
          height: '300px',
          'background-color': 'rgba(255, 255, 255, 0.5)',
          padding: '30px 0',
          'border-top': 'solid 2px #f5f5f5',
          'border-bottom': 'solid 2px #f5f5f5'
        },
        colGroupBRow: {
          height: '100%'
        },
        colGroupBA: {
          height: '100%',
          'padding-left': '30px'
        },
        colGroupBARow: {
          height: '100%',
          position: 'relative'
        },
        colGroupA: {
          'margin-top': '10px',
          'margin-bottom': '10px'
        },
        colParacraft: {
          position: 'relative',
          'margin-top': '-505px'
        },
        backgroundImage: {
          height: '510px'
        },
        colSubtitle: {
          'margin-top': '20px',
          'margin-left': '10px'
        },
        colPreview: {
          height: '100%'
        },
        colGroupAA: {
          'margin-top': '40px'
        },
        colDownload: {
          'margin-top': '30px',
          width: '150px',
          position: 'relative',
          'margin-left': '50%',
          left: '-75px',
          'border-radius': '30px',
          overflow: 'hidden'
        },
        colGroupD: {
          'margin-top': '10px'
        },
        colTitleDA: {
          'margin-top': '10px',
          'text-align': 'center'
        },
        colParagraphDB: {
          'margin-top': '10px'
        },
        colGroupE: {
          'margin-top': '30px'
        },
        colVersion: {
          'margin-top': '10px'
        },
        colSize: {
          'margin-top': '10px'
        },
        colAuthor: {
          'margin-top': '10px'
        },
        colGroupCA: {
          position: 'absolute',
          bottom: 0
        }
      }
    },
    props: {
      colGroupRow: {
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
      colGroupBA: {
        sm: {
          span: 16
        }
      },
      colSubtitle: {
        sm: {
          span: 9
        }
      },
      colViewTimesImg: {
        sm: {
          span: 1
        },
        xs: {
          span: 3
        }
      },
      colViewTimes: {
        sm: {
          span: 5
        },
        xs: {
          span: 20
        }
      }
    },
    theme: {
      root: ['font_6', 'mod-space'],
      rootRow: ['mod-full-width'],
      worldName: ['font_4', 'color_4'],
      author: ['font_7', 'color_4'],
      version: ['font_7', 'color_4'],
      size: ['font_7', 'color_4'],
      download: ['font_20', 'color_0'],
      titleA: ['font_1'],
      subtitleA: ['font_20', 'color_3'],
      viewTimes: ['font_7']
    },
    options: {
      theme: {
        download: {
          buttonStyle: {
            'background-color': 'color_7'
          }
        },
        enter: {
          buttonStyle: {
            'background-color': 'color_8'
          }
        }
      },
      config: {
        ...emptyData,
        innerModal: {
          width: '70%',
          height: '80%',
          'background-color': 'white'
        }
      }
    },
    cover: require('@/../static/adi/paracraft/paracraft1.png'),
    preview: {
      outter: {
        height: '48px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
  },
  // style 4
  {
    templateID: 3,
    data: {
      root: {
        position: 'relative'
      },
      colTitle: {
        width: 'auto'
      },
      colViewTimesImg: {
        width: '20px',
        height: '14px',
        'margin-right': '5px'
      },
      viewTimesImg: {
        width: '100%',
        height: '100%'
      },
      '@media only screen and (max-width: 767px)': {
        preview: {
          height: '80px',
          width: '80px',
          'border-radius': '5px',
          overflow: 'hidden'
        },
        colPreview: {
          width: '100px'
        },
        colGroupB: {
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
        },
        colDownload: {
          'margin-top': '10px'
        },
        colViewTimes: {
          'margin-top': '-3px'
        },
        colGroupCA: {
          'margin-top': '30px'
        }
      },
      '@media only screen and (min-width: 768px)': {
        preview: {
          height: '150px',
          width: '150px',
          'border-radius': '5px',
          overflow: 'hidden'
        },
        colGroupB: {
          height: '300px',
          'background-color': 'rgba(255, 255, 255, 0.5)',
          padding: '30px 0',
          'border-top': 'solid 2px #f5f5f5',
          'border-bottom': 'solid 2px #f5f5f5'
        },
        colGroupBRow: {
          height: '100%'
        },
        colGroupBA: {
          height: '100%',
          'padding-left': '30px'
        },
        colGroupBARow: {
          height: '100%',
          position: 'relative'
        },
        colGroupA: {
          'margin-top': '10px',
          'margin-bottom': '10px'
        },
        colParacraft: {
          position: 'relative',
          'margin-top': '-505px'
        },
        backgroundImage: {
          height: '510px'
        },
        colSubtitle: {
          'margin-top': '20px',
          'margin-left': '10px'
        },
        colPreview: {
          height: '100%'
        },
        colGroupAA: {
          'margin-top': '40px'
        },
        colDownload: {
          'margin-top': '30px',
          width: '150px',
          position: 'relative',
          'margin-left': '50%',
          left: '-75px',
          'border-radius': '30px',
          overflow: 'hidden'
        },
        colGroupD: {
          'margin-top': '10px'
        },
        colTitleDA: {
          'margin-top': '10px',
          'text-align': 'center'
        },
        colParagraphDB: {
          'margin-top': '10px'
        },
        colGroupE: {
          'margin-top': '30px'
        },
        colVersion: {
          'margin-top': '10px'
        },
        colSize: {
          'margin-top': '10px'
        },
        colAuthor: {
          'margin-top': '10px'
        },
        colGroupCA: {
          position: 'absolute',
          bottom: 0
        }
      }
    },
    props: {
      colGroupRow: {
        gutter: 30
      },
      colPreview: {
        sm: {
          span: 4
        },
        xs: {
          span: 7
        }
      },
      colGroupBA: {
        sm: {
          span: 20
        },
        xs: {
          span: 17
        }
      },
      colSubtitle: {
        sm: {
          span: 9
        }
      },
      colViewTimesImg: {
        sm: {
          span: 1
        },
        xs: {
          span: 3
        }
      },
      colViewTimes: {
        sm: {
          span: 5
        },
        xs: {
          span: 20
        }
      }
    },
    theme: {
      root: ['font_6', 'mod-space'],
      rootRow: ['mod-full-width'],
      worldName: ['font_4', 'color_4'],
      author: ['font_7', 'color_4'],
      version: ['font_7', 'color_4'],
      size: ['font_7', 'color_4'],
      download: ['font_20', 'color_0'],
      titleA: ['font_1'],
      subtitleA: ['font_20', 'color_3'],
      viewTimes: ['font_7']
    },
    options: {
      theme: {
        download: {
          buttonStyle: {
            'background-color': 'color_7'
          }
        },
        enter: {
          buttonStyle: {
            'background-color': 'color_8'
          }
        }
      },
      config: {
        ...emptyData,
        innerModal: {
          width: '70%',
          height: '80%',
          'background-color': 'white'
        }
      }
    },
    cover: require('@/../static/adi/paracraft/paracraft1.png'),
    preview: {
      outter: {
        height: '48px'
      },
      inner: {
        'margin-top': '-20px'
      }
    }
  }
]
