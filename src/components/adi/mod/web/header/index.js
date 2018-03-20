import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './header.styles'
import templates from './header.templates'

const name = 'ModHeader'

const components = {
  logo: 'AdiMedia',
  businessName: 'AdiTitle',
  tagline: 'AdiTitle',
  menu: 'AdiMenu'
}

const properties = generateProperties(name, components)

properties.logo.src = './static/adi/logo.png'
properties.businessName.name = 'BUSINESS NAME'
properties.tagline.name = 'TAG LINE'

export default { mod, name, components, properties, styles, templates }
