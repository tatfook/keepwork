const testData = {
  modList: [
    {
      key: 'abcd',
      type: 'ModHeader',
      styleID: 1,
      components: {
        menu: {
          type: 'AdiMenu',
          data: {
            mode: 'horizontal',
            backgroundColor: '#545c64',
            textColor: '#fff',
            activeTextColor: '#ffd04b',
            data: [
              {
                title: 'Home',
                link: ''
              },
              {
                title: 'About Us',
                link: ''
              }
            ]
          }
        },
        media: {
          type: 'AdiMedia',
          data: {
            src: 'http://keepwork.com/wiki/assets/imgs/icon/logo.svg',
            link: 'http://keepwork.com'
          }
        },
        label: {
          type: 'AdiLabel',
          data: {
            text: 'keepwork'
          }
        }
      }
    }
  ],
  theme: {},
  layout: {}
}

export default testData
