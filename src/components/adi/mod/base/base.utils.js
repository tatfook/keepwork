import _ from 'lodash'
import BaseCompProperties from '@/components/adi/common/comp.properties'

export const generateProperties = (name, components) => {
  let componentProperties = {}
  _.each(components, (comp, key) => {
    componentProperties[key] = { type: comp, data: BaseCompProperties[comp] }
  })
  return {
    type: name,
    styleID: 0,
    components: componentProperties
  }
}
