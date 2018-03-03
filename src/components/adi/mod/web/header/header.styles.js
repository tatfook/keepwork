import templates from './header.templates'

const style1 = {
  id: 1,
  template: 'template1',
  style: {}
}

const style2 = {
  id: 2,
  template: 'template2',
  style: {}
}

const styles = [style1, style2]

const renderStyle = (h, mod, styleID) => {
  let style = styles[styleID]
  let template = templates[style.template]
  return template.render(h, mod)
}

export default renderStyle
