import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './mixPosition.styles'
import templates from './mixPosition.templates'

const name = 'ModMixPosition'

const components = {
  media: 'AdiMedia',
  button: 'AdiButton',
  title: 'AdiTitle',
  subtitle: 'AdiSubtitle',
  paragraph: 'AdiParagraph'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
