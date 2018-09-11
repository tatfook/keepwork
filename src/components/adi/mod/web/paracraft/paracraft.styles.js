import _ from 'lodash'

let emptyData = {
  preview: {
    emptySrc: require('@/assets/adi/paracraft/preview.jpg'),
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  worldName: {
    emptyName: 'adi.paracraft.worldName',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  backgroundImage: {
    emptySrc: require('@/assets/adi/paracraft/backgroundImage.png'),
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  titleA: {
    emptyName: 'adi.paracraft.paracraftTitle.titleA',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  subtitleA: {
    emptyName: 'adi.paracraft.paracraftSubTitle.subtitle',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  author: {
    emptyDesc: 'adi.paracraft.author.desc',
    emptyText: 'adi.paracraft.author.text',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  version: {
    emptyDesc: 'adi.paracraft.version.desc',
    emptyText: '0.0.0',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  updateTime: {
    emptyText: '2018-1-10-14-30',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  viewTimesImg: {
    emptySrc: require('@/assets/adi/paracraft/eye.png'),
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  viewTimes: {
    emptyText: '0',
    emptyDesc: 'adi.paracraft.viewTimes.desc',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  size: {
    emptyText: '31KB',
    emptySize: 'adi.paracraft.size.size',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  download: {
    emptyName: 'adi.paracraft.download.name',
    emptyLink: '#',
    emptyTarget: '_blank'
  },
  enter: {
    emptyName: 'adi.paracraft.enter.name',
    emptyLink: '#',
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
      colGroupLeft: {
        'padding-left': '10px',
        'padding-right': '10px'
      },
      colGroupA: {
        'padding-left': '10px'
      },
      colGroupB: {
        'padding-left': '10px'
      },
      colGroupC: {
        'padding-left': '10px'
      },
      colDownload: {
        'min-width': '80px'
      },
      colEnter: {
        'min-width': '80px'
      },
      '@media only screen and (max-width: 767px)': {}
    },
    props: {
      colGroupRow: { gutter: 10 },
      colPreview: {
        sm: { span: 6 },
        xs: { span: 24 }
      },
      colGroupLeft: {
        sm: { span: 14 },
        xs: { span: 24 }
      },
      colWorldName: {
        span: 12
      },
      colGroupVersionAndUpdateTime: {
        xs: {
          offset: 2,
          span: 9
        },
        sm: {
          offset: 1,
          span: 11
        }
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
      colViewTimesImg: {
        xs: { span: 4 },
        sm: { span: 3 }
      },
      colViewTimes: {
        xs: { span: 20 },
        sm: { span: 21 }
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
      root: ['paragraphType', 'mod-space'],
      rootRow: ['mod-full-width'],
      worldName: ['paragraphType', 'fontColor'],
      download: ['buttonText', 'fontColor'],
      enter: ['buttonText', 'enter']
    },
    options: {
      theme: {
        download: {
          buttonStyle: {
            'background-color': 'download'
          }
        },
        enter: {
          buttonStyle: {
            'background-color': 'bgEnter'
          }
        }
      },
      config: {
        ...emptyData,
        preview: _.merge({}, emptyData.preview, {
          img: {
            defaultWebHeight: '196px',
            defaultMobileHeight: '250px'
          }
        }),
        worldName: _.merge({}, emptyData.worldName, {
          space: {
            webMarginTop: '20px',
            mobileMarginTop: '20px'
          }
        }),
        author: _.merge({}, emptyData.author, {
          space: {
            webMarginTop: '40px',
            mobileMarginTop: '40px'
          }
        }),
        version: _.merge({}, emptyData.version, {
          space: {
            webMarginTop: '20px',
            mobileMarginTop: '20px'
          }
        }),
        viewTimesImg: _.merge({}, emptyData.viewTimesImg, {
          img: {
            defaultWebHeight: '17px',
            defaultMobileHeight: '17px',
            defaultWebWidth: '24px',
            defaultMobileWidth: '24px'
          },
          space: {
            webMarginTop: '12px',
            mobileMarginTop: '12px'
          }
        }),
        viewTimes: _.merge({}, emptyData.viewTimes, {
          space: {
            webMarginTop: '10px',
            mobileMarginTop: '10px'
          }
        }),
        size: _.merge({}, emptyData.size, {
          space: {
            webMarginTop: '2px',
            mobileMarginTop: '10px',
            webMarginBottom: '20px',
            mobileMarginBottom: '20px'
          }
        }),
        download: _.merge({}, emptyData.download, {
          img: {
            src: ''
          },
          space: {
            webMarginTop: '10px',
            mobileMarginTop: '10px'
          }
        }),
        enter: _.merge({}, emptyData.enter, {
          img: {
            src: ''
          },
          space: {
            webMarginTop: '10px',
            mobileMarginTop: '5px',
            webMarginBottom: '20px',
            mobileMarginBottom: '20px'
          }
        }),
        innerModal: {
          width: '70%',
          height: '80%',
          'background-color': 'white'
        }
      }
    },
    cover: require('@/assets/adi/paracraft/paracraft1.png'),
    preview: {
      inner: {
        'margin-top': '-5px'
      }
    }
  },
  // style 1
  {
    templateID: 1,
    data: {
      '@media only screen and (max-width: 767px)': {}
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
      root: ['paragraphType', 'mod-space'],
      rootRow: ['mod-full-width'],
      worldName: ['paragraphType', 'worldName'],
      download: ['buttonText'],
      enter: ['buttonText', 'enter'],
      desc: ['buttonText', 'fontColor']
    },
    options: {
      theme: {
        enter: {
          buttonStyle: {
            'background-color': 'bgEnter'
          }
        }
      },
      config: {
        ...emptyData,
        preview: _.merge({}, emptyData.preview, {
          img: {
            defaultWebHeight: '314px',
            defaultMobileHeight: '314px'
          },
          space: {
            mobileMarginTop: '10px'
          }
        }),
        download: _.merge({}, emptyData.download, {
          elBtn: 'default',
          img: {
            width: '20px',
            height: '20px',
            src: require('@/assets/adi/paracraft/down.png')
          },
          space: {
            mobileMarginTop: '10px'
          }
        }),
        enter: _.merge({}, emptyData.enter, {
          img: {
            src: ''
          },
          space: {
            mobileMarginTop: '10px'
          }
        }),
        desc: _.merge({}, emptyData.desc, {
          space: {
            mobileMarginTop: '10px'
          }
        }),
        innerModal: {
          width: '70%',
          height: '80%',
          'background-color': 'white'
        }
      }
    },
    cover: require('@/assets/adi/paracraft/paracraft2.png'),
    preview: {
      inner: {
        'margin-top': '-20px'
      }
    }
  },
  // style 2
  {
    templateID: 2,
    data: {},
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
      root: ['paragraphType', 'mod-space'],
      rootRow: ['mod-full-width'],
      worldName: ['paragraphType', 'worldName'],
      download: ['buttonText'],
      enter: ['buttonText', 'enter'],
      desc: ['buttonText', 'fontColor']
    },
    options: {
      theme: {
        enter: {
          buttonStyle: {
            'background-color': 'bgEnter'
          }
        }
      },
      config: {
        ...emptyData,
        preview: _.merge({}, emptyData.preview, {
          img: {
            defaultWebHeight: '314px',
            defaultMobileHeight: '314px'
          }
        }),
        worldName: _.merge({}, emptyData.worldName, {
          space: {
            mobileMarginTop: '10px'
          }
        }),
        author: _.merge({}, emptyData.author, {
          space: {
            mobileMarginTop: '20px'
          }
        }),
        download: _.merge({}, emptyData.download, {
          elBtn: 'default',
          img: {
            width: '20px',
            height: '20px',
            src: require('@/assets/adi/paracraft/down.png')
          },
          space: {
            webMarginTop: '40px',
            mobileMarginTop: '20px'
          }
        }),
        enter: _.merge({}, emptyData.enter, {
          img: {
            src: ''
          },
          space: {
            webMarginTop: '40px',
            mobileMarginTop: '20px'
          }
        }),
        desc: _.merge({}, emptyData.desc, {
          space: {
            mobileMarginTop: '20px'
          }
        }),
        innerModal: {
          width: '70%',
          height: '80%',
          'background-color': 'white'
        }
      }
    },
    cover: require('@/assets/adi/paracraft/paracraft3.png'),
    preview: {
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
      root: ['paragraphType', 'mod-space'],
      rootRow: ['mod-full-width'],
      worldName: ['paragraphType', 'fontColor'],
      author: ['paragraphType', 'fontColor'],
      version: ['paragraphType', 'fontColor'],
      size: ['paragraphType', 'fontColor'],
      download: ['buttonText', 'enter'],
      titleA: ['bigtitle'],
      subtitleA: ['buttonText', 'color_3'],
      viewTimes: ['paragraphType']
    },
    options: {
      theme: {
        download: {
          buttonStyle: {
            'background-color': 'worldName'
          }
        },
        enter: {
          buttonStyle: {
            'background-color': 'bgEnter'
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
    cover: require('@/assets/adi/paracraft/paracraft1.png'),
    preview: {
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
      root: ['paragraphType', 'mod-space'],
      rootRow: ['mod-full-width'],
      worldName: ['paragraphType', 'fontColor'],
      author: ['paragraphType', 'fontColor'],
      version: ['paragraphType', 'fontColor'],
      size: ['paragraphType', 'fontColor'],
      download: ['buttonText', 'enter'],
      titleA: ['bigtitle'],
      subtitleA: ['buttonText', 'subtitleA'],
      viewTimes: ['paragraphType']
    },
    options: {
      theme: {
        download: {
          buttonStyle: {
            'background-color': 'worldName'
          }
        },
        enter: {
          buttonStyle: {
            'background-color': 'bgEnter'
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
    cover: require('@/assets/adi/paracraft/paracraft1.png'),
    preview: {
      inner: {
        'margin-top': '-20px'
      }
    }
  }
]
