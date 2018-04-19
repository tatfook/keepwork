import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './text.styles'
import templates from './text.templates'

const name = 'ModText'

const components = {
  title: 'AdiTitle',
  paragraph: 'AdiMarkdown'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
