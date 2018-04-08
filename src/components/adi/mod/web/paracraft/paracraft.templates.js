export default [
  // template 0
  [
    { colPreview: 'preview' },
    {
      colGroupLeft: [
        {
          colGroupA: [
            { colWorldName: 'worldName' },
            {
              colGroupVersionAndUpdateTime: [
                { colVersion: 'version' },
                { colUpdateTime: 'updateTime' }
              ]
            }
          ]
        },
        {
          colGroupB: [{ colAuthor: 'author' }]
        },
        {
          colGroupC: [
            {
              colGroupCA: [
                { colViewTimesImg: 'viewTimesImg' },
                { colViewTimes: 'viewTimes' },
                { colSize: 'size' }
              ]
            },
            {
              colGroupCB: [{ colDownload: 'download' }, { colEnter: 'enter' }]
            }
          ]
        }
      ]
    },
    {
      colInnerModal: 'innerModal'
    }
  ],
  // template 1
  [
    {
      colGroupA: [
        {
          colGroupAA: [{ colWorldName: 'worldName' }, { colAuthor: 'author' }]
        },
        {
          colGroupAB: [{ colDownload: 'download' }, { colEnter: 'enter' }]
        }
      ]
    },
    {
      colGroupB: [{ colPreview: 'preview' }, { colDesc: 'desc' }]
    },
    {
      colInnerModal: 'innerModal'
    }
  ],
  // template 2
  [
    {
      colPreview: 'preview',
      colGroupA: [
        { colWorldName: 'worldName' },
        { colAuthor: 'author' },
        { colDesc: 'desc' },
        {
          colGroupAA: [{ colDownload: 'download' }, { colEnter: 'enter' }]
        }
      ]
    },
    {
      colInnerModal: 'innerModal'
    }
  ]
]
