import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './tab.styles'
import templates from './tab.templates'

const name = 'ModTab'

const components = {
  tab: 'AdiTab'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
