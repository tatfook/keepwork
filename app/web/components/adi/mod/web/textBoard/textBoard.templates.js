export default [
  // template 0
  [
    {
      colGroup: [
        { colBoard: 'board' },
        { colTitle: 'title' },
        { colSubTitle: 'subtitle' },
        { colParagraph: 'paragraph' }
      ]
    }
  ],
  // template 1
  [
    {
      colGroup: [
        { colTitle: 'title' },
        { colSubTitle: 'subtitle' },
        { colParagraph: 'paragraph' },
        { colBoard: 'board' }
      ]
    }
  ],
  // template 2
  [
    {
      colGroup: [
        {
          colGroupA: [
            { colBoard: 'board' },
            {
              colGroupAA: [
                { colTitle: 'title' },
                { colSubtitle: 'subtitle' },
                { colParagraph: 'paragraph' }
              ]
            }
          ]
        }
      ]
    }
  ],
  // template 3
  [
    {
      colGroup: [
        {
          colGroupA: [
            {
              colGroupAA: [
                { colTitle: 'title' },
                { colSubtitle: 'subtitle' },
                { colParagraph: 'paragraph' }
              ]
            },
            { colBoard: 'board' }
          ]
        }
      ]
    }
  ]
]
