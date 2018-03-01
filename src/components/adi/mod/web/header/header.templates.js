import { AdiMenu } from '@/components/adi/common'

const menu = (h, comp) => {
  return (
    <AdiMenu menu={comp.menuData} />
  )
}

const edMenu = (h, comp) => {
  return (
    <AdiMenu
      menu={comp.menuData}
      editorMode={true}
      sign={'menu'}
      isActive={comp.isChildActive('menu')}
      onEditProperty={comp.onEditProperty}
    />
  )
}

const template1 = {
  render: (h, comp) => {
    if (comp.editMode) {
      return (
        <div class="header-menu-bar">
          {edMenu(h, comp)}
        </div>
      )
    }
    else {
      return (
        <div class="header-menu-bar">
          {menu(h, comp)}
        </div>
      )
    }
  }
}

const templates = [template1]

let RenderTemplate = (h, style, comp) => {
  let template = templates[style.templateID - 1]
  return template.render(h, comp)
}

export default RenderTemplate
