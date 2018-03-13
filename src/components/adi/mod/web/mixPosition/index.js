import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from './MixPosition'
import styles from './mixPosition.styles'

const name = 'ModMixPosition'

const components = {
  media: 'AdiMedia',
  button: 'AdiButton',
  title: 'AdiTitle',
  subtitle: 'AdiSubtitle',
  paragraph: 'AdiParagraph'
}

const properties = generateProperties(name, components)

export default { mod, name, properties, styles }
