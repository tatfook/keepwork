import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './vipRead.styles'
import templates from './vipRead.templates'

const name = 'ModVipRead'

const components = {
  vipRead: 'AdiVipRead'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
