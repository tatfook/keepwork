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

properties.components.media.data.data = `{
  "src": "./static/adi/mix-layer.png",
  "name": "MEDIA",
  "link": "http://keepwork.com"
}`

export default { mod, name, properties, styles }
