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
    },
    {
      key: 'fdshgdsak',
      type: 'ModLogo',
      styleID: 1,
      components: {
        media: {
          type: 'AdiMedia',
          data: {
            src: 'http://keepwork.com/wiki/assets/imgs/icon/logo.svg',
            link: 'http://keepwork.com'
          }
        },
        label1: {
          type: 'AdiLabel',
          data: {
            text: 'keepwork'
          }
        },
        label2: {
          type: 'AdiLabel',
          data: {
            text: 'keep your work!'
          }
        }
      }
    }
  ],
  theme: {
    name: 'light',
    colorID: 1,
    fontID: 1
  },
  layout: {}
}

export default testData
