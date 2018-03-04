import BasicComponents from './index'

const normal = (h, BasicComp, mod, property) => {
  return <BasicComp source={mod.childData(property)} />
}

const edit = (h, BasicComp, mod, property) => {
  return (
    <BasicComp
      source={mod.childData(property)}
      editorMode={true}
      property={property}
      isActive={mod.isChildActive(property)}
      isHidden={mod.isChildHidden(property)}
      onEditProperty={mod.onEditProperty}
    />
  )
}

const create = (h, mod, property) => {
  const component = BasicComponents[mod.childComponentType(property)]
  let func = mod.editMode ? edit : normal
  return func(h, component, mod, property)
}

export default {
  create
}
