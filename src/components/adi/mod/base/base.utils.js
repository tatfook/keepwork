import _ from 'lodash'
import BaseCompProperties from '@/components/adi/common/comp.properties'

export const generateProperties = (name, components) => {
  let mod = {
    type: name,
    styleID: 0
  }
  _.each(components, (comp, key) => {
    mod[key] = BaseCompProperties[comp]
  })
  return mod
}
