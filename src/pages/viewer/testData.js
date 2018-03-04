const testData = {
  modList: [
    {
      key: 'abcd',
      modType: 'AdiHeader',
      styleID: 1,
      data: {
        menu: {
          componentType: 'AdiMenu',
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
          componentType: 'AdiMedia',
          data: {
            src: 'http://keepwork.com/wiki/assets/imgs/icon/logo.svg',
            link: 'http://keepwork.com'
          }
        }
      }
    }
  ],
  theme: {},
  layout: {}
}

export default testData
