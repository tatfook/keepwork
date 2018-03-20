import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './title.styles'
import templates from './title.templates'

const name = 'ModTitle'

const components = {
  logo: 'AdiLogo',
  businessName: 'AdiTitle',
  tagline: 'AdiTitle'
}

const properties = generateProperties(name, components)

properties.businessName.name = 'BUSINESS NAME'
properties.tagline.name = 'TAG LINE'

export default { mod, name, components, properties, styles, templates }
