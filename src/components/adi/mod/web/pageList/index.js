import { generateProperties } from '@/components/adi/mod/base/base.utils'
import styles from './pageList.styles'
import templates from './pageList.templates'
import mod from './pageList'

const name = 'ModPageList'

const components = {
  pageList: 'AdiPageList'
}

const properties = generateProperties(name, components)

export default {
  mod,
  name,
  components,
  properties,
  styles,
  templates
}
