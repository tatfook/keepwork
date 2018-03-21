import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './qq.styles'
import templates from './qq.templates'

const name = 'ModVipRead'

const components = {
  logo: 'AdiTitle',
  desc: 'AdiLable'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
