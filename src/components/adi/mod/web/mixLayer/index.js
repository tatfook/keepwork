import { generateProperties } from '@/components/adi/mod/base/base.utils'
import styles from './mixLayer.styles'
import templates from './mixLayer.templates'
import mod from './mixLayer'

const name = 'ModMixLayer'

const components = {
  media: 'AdiMedia',
  title: 'AdiTitle',
  subtitle: 'AdiTitle',
  paragraph: 'AdiMarkdown',
  button: 'AdiButton',
  media2: 'AdiMedia',
  title2: 'AdiTitle',
  subtitle2: 'AdiTitle',
  paragraph2: 'AdiMarkdown',
  button2: 'AdiButton'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
