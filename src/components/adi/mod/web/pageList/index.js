import { generateProperties } from '@/components/adi/mod/base/base.utils'
import styles from './mixPosition.styles'
import templates from './mixPosition.templates'
import mod from './mixPosition'

const name = 'ModPageList'

const components = {}

const properties = generateProperties(name, components)

export {
  mod,
  name,
  components,
  properties,
  styles,
  templates
}
