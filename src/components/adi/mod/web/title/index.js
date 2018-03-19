import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './title.styles'
import templates from './title.templates'

const name = 'ModTitle'

const components = {
  logo: 'AdiLogo',
  businessName: 'AdiBusinessName',
  tagline: 'AdiTagline'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
