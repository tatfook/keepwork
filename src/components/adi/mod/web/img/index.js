import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './img.styles'
import templates from './img.templates'

const name = 'ModImg'

const components = {
  img: 'AdiMedia'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
