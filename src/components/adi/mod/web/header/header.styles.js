const style1 = {
  name: 1,
  template: 'template1',
  data: {}
}

const style2 = {
  name: 2,
  template: 'template2',
  data: {
    'mod-header-menu': {
      margin: '50px 0'
    },
    'mod-header-media': {
      width: '20%',
      'min-width': '30px',
      margin: 'auto'
    }
  }
}

const style3 = {
  name: 3,
  template: 'template2',
  data: {
    'mod-header-menu': {
      margin: '20px 0'
    },
    'mod-header-media': {
      width: '40%',
      'min-width': '30px'
    }
  }
}

const styles = [style1, style2, style3]

export default styles
