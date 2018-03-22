import _ from 'lodash'
import BaseCompProperties from '@/components/adi/common/comp.properties'

export const generateProperties = (name, components) => {
  let mod = {
    styleID: 0
  }

  _.each(components, (comp, key) => {
    mod[key] = _.cloneDeep(BaseCompProperties[comp])
  })
  return mod
}
