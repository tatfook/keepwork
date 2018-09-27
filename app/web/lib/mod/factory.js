import modLoader from '@/components/adi/mod/index.async'
import _ from 'lodash'

export const generate = modName => {
  let modProperties = _.cloneDeep(modLoader.load(modName).default.properties)
  return modProperties
}

export default {
  generate
}
