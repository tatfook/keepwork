import _ from 'lodash'

let defaultData = {
  button: {
    emptyInputPlaceholder: 'buttonText'
  }
}
export default [
  {
    templateID: 0,
    data: {
      root: {},
      colButton: {
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center'
      },
      button: {}
    },
    props: {},
    theme: {
      root: ['mod-full-width'],
      button: ['fontsColor']
    },
    options: {
      config: {
        ...defaultData
      }
    },
    useImage: false,
    cover: ''
  }
]
