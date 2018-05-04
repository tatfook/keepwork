import modLoader from '@/components/adi/mod'
import _ from 'lodash'

export const generate = modName => {
  let modProperties = _.cloneDeep(modLoader.load(modName).properties)
  return modProperties
}

export default {
  generate
}
