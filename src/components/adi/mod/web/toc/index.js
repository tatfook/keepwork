import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './toc.styles'
import templates from './toc.templates'

const name = 'ModToc'

const components = {
  toc: 'AdiToc'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
