import AdiMedia from './AdiMedia'

const media = (h, mod, property) => {
  return <AdiMedia media={mod.childData(property)} />
}

const edMedia = (h, mod, property) => {
  return (
    <AdiMedia
      media={mod.childData(property)}
      editorMode={true}
      property={property}
      isActive={mod.isChildActive(property)}
      onEditProperty={mod.onEditProperty}
    />
  )
}

const create = (h, mod, property) => {
  let func = mod.editMode ? edMedia : media
  return func(h, mod, property)
}

export default {
  create
}
