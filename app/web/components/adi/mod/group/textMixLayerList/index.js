import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './styles'
import templates from './templates'
import modSettings from './settings'

const name = 'ModTextMixLayerList'

const components = {
  text: 'AdiSubMod'
}
const properties = generateProperties(name, components)

properties.list = {
  list: {
    collection: [{}, {}]
  }
}

export default { mod, name, components, properties, styles, templates, modSettings }
