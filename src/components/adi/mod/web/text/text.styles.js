let emptyData = {
  title: {
    emptyName: '卢布尔雅那',
    emptyLink: 'http://keepwork.com',
    emptyTarget: '_blank'
  },
  paragraph: {
    emptyData: `一个人去旅行，而且是去故乡的山水间徜徉。临行之前，面对太多的疑问和不解：为何是一个人？也有善意的提醒：何不去远方！昆明呀——赶一个花海；三亚呀——赴一个蓝天碧海。只是微笑地固执自己的坚持，不做任何解释。没有人明白，这一次是一个告别，或者一个永远的告别，以后我会去到很多很繁华或苍凉，辽远或偏僻的地方，而会常常想起这一次的旅行，想起那座山，那个城，那些人……`
  }
}

export default [
  // style 0
  {
    data: {
      title: {
        'text-align': 'left',
        'margin-bottom': '20px'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width'],
      title: ['font_1', 'color_7'],
      paragraph: ['font_9', 'color_4']
    },
    options: {
      theme: {},
      config: { ...emptyData }
    },
    cover: require('@/../static/adi/text/text1.jpeg')
  },
  // style 1
  {
    data: {
      title: {
        'text-align': 'center',
        'margin-bottom': '20px'
      }
    },
    props: {
      rootRow: { gutter: 10 }
    },
    theme: {
      root: ['mod-space'],
      colGroupRow: ['mod-full-width'],
      title: ['font_1', 'color_7'],
      paragraph: ['font_9', 'color_4']
    },
    options: {
      theme: {},
      config: { ...emptyData }
    },
    cover: require('@/../static/adi/text/text2.jpeg')
  }
]
