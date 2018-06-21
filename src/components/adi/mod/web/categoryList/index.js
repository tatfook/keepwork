import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './categoryList.styles'
import templates from './categoryList.templates'

const name = 'ModCategoryList'

const components = {
  categoryList: 'AdiCategoryList'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
