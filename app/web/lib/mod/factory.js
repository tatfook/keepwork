import modLoader from '@/components/adi/mod/index'
import _ from 'lodash'

export const generateProperties = modName => {
  let modProperties = _.cloneDeep(modLoader.load(modName).properties)
  return modProperties
}

export default {
  generateProperties
}
