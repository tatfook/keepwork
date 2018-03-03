import AdiMenu from './AdiMenu'

const menu = (h, mod, property) => {
  return <AdiMenu menu={mod.childData(property)} />
}

const edMenu = (h, mod, property) => {
  return (
    <AdiMenu
      menu={mod.childData(property)}
      editorMode={true}
      sign={property}
      isActive={mod.isChildActive(property)}
      onEditProperty={mod.onEditProperty}
    />
  )
}

const create = (h, mod, property) => {
  let func = mod.editMode ? edMenu : menu
  return func(h, mod, property)
}

export default {
  create
}
