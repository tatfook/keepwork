import { generateProperties } from '@/components/adi/mod/base/base.utils'
import styles from './mixLayerList.styles'
import templates from './mixLayerList.templates'
import mod from '@/components/adi/mod/base/Base'

const name = 'ModMixLayerList'

const components = {
  list: 'AdiList'
}
const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
