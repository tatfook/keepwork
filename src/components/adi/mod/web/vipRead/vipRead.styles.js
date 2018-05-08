export default [
  // style 0
  {
    data: {
      root: {}
    },
    props: {},
    theme: {
      root: [],
      rootRow: ['mod-full-width'],
      title: ['color_0']
    },
    options: {
      theme: {},
      config: {
        vipRead: {
          onlyVip: 'adi.vipRead.onlyVip',
          on: 'adi.vipRead.on',
          off: 'adi.vipRead.off',
          becomeVip: 'adi.vipRead.becomeVip',
          login: 'adi.vipRead.login'
        }
      }
    },
    useImage: true,
    cover: require('@/../static/adi/vipRead/VIP.png'),
    preview: {
      outter: {
        height: '40px'
      }
    }
  }
]
