import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './button.styles'
import templates from './button.templates'

const name = 'ModButton'

const components = {
  button: 'AdiButton'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
