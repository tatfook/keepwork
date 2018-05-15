export default [
  // style 0
  {
    data: {
      root: {
        width: '100%'
      }
    },
    props: {
      colBoard: { span: 24 }
    },
    theme: {
      root: ['font_0', 'color_0'],
      rootRow: ['mod-full-width'],
      title: ['color_0']
    },
    options: {
      theme: {},
      config: {
        board: {
          desc: 'adi.board.desc'
        }
      }
    },
    useImage: true,
    cover: require('@/../static/adi/board/wiki_board.png')
  }
]
