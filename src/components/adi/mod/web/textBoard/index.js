import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './textBoard.styles'
import templates from './textBoard.templates'

const name = 'ModTextBoard'

const components = {
  paragraph: 'AdiMarkdown',
  board: 'AdiBoard',
  title: 'AdiTitle',
  subtitle: 'AdiTitle'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
