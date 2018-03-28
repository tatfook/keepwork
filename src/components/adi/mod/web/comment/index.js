import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './comment.styles'
import templates from './comment.templates'

const name = 'ModComment'

const components = {
  comment: 'AdiComment'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
