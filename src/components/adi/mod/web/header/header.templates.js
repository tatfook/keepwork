import { AdiMenu, AdiMedia } from '@/components/adi/common'

const menu = (h, comp) => {
  return <AdiMenu menu={comp.menuData} />
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

const media = (h, comp) => {
  return <AdiMedia media={comp.mediaData} />
}

const edMedia = (h, comp) => {
  return (
    <AdiMedia
      media={comp.mediaData}
      editorMode={true}
      sign={'media'}
      isActive={comp.isChildActive('media')}
      onEditProperty={comp.onEditProperty}
    />
  )
}

const template1 = {
  render: (h, comp) => {
    let editable = comp.editMode
    return (
      <div class="kp-header">
        <div class="kp-header-media">
          {editable ? edMedia(h, comp) : media(h, comp)}
        </div>
        <div class="kp-header-menu">
          {editable ? edMenu(h, comp) : menu(h, comp)}
        </div>
      </div>
    )
  }
}

const template2 = {
  render: (h, comp) => {
    let editable = comp.editMode
    return (
      <div class="kp-header">
        <div class="kp-header-menu">
          {editable ? edMenu(h, comp) : menu(h, comp)}
        </div>
        <div class="kp-header-media">
          {editable ? edMedia(h, comp) : media(h, comp)}
        </div>
      </div>
    )
  }
}

const templates = {
  template1,
  template2
}

let RenderTemplate = (h, style, comp) => {
  let template = templates[style.template]
  return template.render(h, comp)
}

export default RenderTemplate
