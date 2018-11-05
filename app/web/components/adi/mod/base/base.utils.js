import _ from 'lodash'
import BaseCompProperties from '@/components/adi/common/comp.properties'

export const generateProperties = (name, components) => {
  let mod = {
    styleID: 0
  }

  _.each(components, (comp, key) => {
    if (Array.isArray(comp)) {
      let properties = {}

      _.forEach(comp, (cKey, cIndex) => {
        let curProperties = BaseCompProperties[cKey]
        _.merge(properties, curProperties)
      })

      mod[key] = properties
    } else {
      mod[key] = _.cloneDeep(BaseCompProperties[comp])
    }
  })

  return mod
}
