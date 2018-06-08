import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './pageSwitching.styles'
import templates from './pageSwitching.templates'

const name = 'ModPageSwitching'

const components = {
  pageSwitching: 'AdiPageSwitching'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
