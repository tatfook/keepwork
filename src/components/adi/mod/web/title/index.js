import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from './Title'
import styles from './title.styles'

const name = 'ModTitle'

const components = {
  logo: 'AdiLogo',
  businessName: 'AdiBusinessName',
  tagline: 'AdiTagline'
}

const properties = generateProperties(name, components)

export default { mod, name, properties, styles }
