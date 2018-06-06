import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './categoryList.styles'
import templates from './categoryList.templates'

const name = 'ModCategroyList'

const components = {
  categroyList: 'AdiCategroyList'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
