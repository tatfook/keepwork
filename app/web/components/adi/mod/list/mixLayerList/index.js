import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './mixLayerList.styles'
import templates from './mixLayerList.templates'
import modSettings from './mixLayerList.settings'

const name = 'ModMixLayerList'

const components = {
  list: 'AdiList'
}
const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates, modSettings }
