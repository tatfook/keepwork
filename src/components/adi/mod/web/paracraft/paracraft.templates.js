export default [
  // template 1
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
  ]
]
