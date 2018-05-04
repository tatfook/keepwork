import { generateProperties } from '@/components/adi/mod/base/base.utils'
import styles from './qq.styles'
import templates from './qq.templates'
import mod from './QQ'

const name = 'ModQQ'

const components = {
  qq: 'AdiNumber',
  pic: 'AdiMedia',
  desc: 'AdiButton'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
