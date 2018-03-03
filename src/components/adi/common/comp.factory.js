import menuFactory from './menu/menu.factory'
import mediaFactory from './media/media.factory'

const factoryList = {
  AdiMenu: menuFactory,
  AdiMedia: mediaFactory
}

const create = (h, mod, property) => {
  const factory = factoryList[mod.childComponentType(property)]
  return factory.create(h, mod, property)
}

export default {
  create
}
