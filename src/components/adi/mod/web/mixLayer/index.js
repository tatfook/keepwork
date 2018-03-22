import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from './MixLayer'
import styles from './mixLayer.styles'

const name = 'ModMixLayer'

const components = {
  media: 'AdiMedia',
  title: 'AdiTitle',
  subtitle: 'AdiSubtitle',
  paragraph: 'AdiParagraph'
}

const properties = generateProperties(name, components)

properties.media.data = `{
  "src": "./static/adi/mix-layer.png",
  "name": "MEDIA",
  "link": "http://keepwork.com"
}`

export default { mod, name, components, properties, styles }
