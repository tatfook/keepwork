export default [
  // template 0
  [
    { colGroup: 'media' },
    {
      colCouple: [
        { colTitle: 'title' },
        { colSubtitle: 'subtitle' },
        { colParagraph: 'paragraph' }
      ]
    }
  ],

  // template 1
  [
    {
      colGroup: [
        {
          colGroupA: [
            { colMedia: 'media' },
            {
              colGroupAA: [
                { colTitle: 'title' },
                { colSubtitle: 'subtitle' },
                { colParagraph: 'paragraph' },
                { colButton: 'button' }
              ]
            }
          ]
        },
        {
          colGroupB: [
            { colMedia: 'media2' },
            {
              colGroupBA: [
                { colTitle: 'title2' },
                { colSubtitle: 'subtitle2' },
                { colParagraph: 'paragraph2' },
                { colButton: 'button2' }
              ]
            }
          ]
        }
      ]
    }
  ]
]
