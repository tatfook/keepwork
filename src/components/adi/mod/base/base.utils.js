import _ from 'lodash'
import BaseCompProperties from '@/components/adi/common/comp.properties'

export const generateProperties = (name, components, subMods = {}) => {
  let mod = {
    styleID: 0
  }

  _.each(components, (comp, key) => {
    mod[key] = _.cloneDeep(BaseCompProperties[comp])
  })

  _.each(subMods, (subMod, key) => {
    mod[key] = {data: 'subMod'}
  })
  return mod
}
