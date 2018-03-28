import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './mixLayer.styles'
import templates from './mixLayer.templates'

const name = 'ModMixLayer'

const components = {
  media: 'AdiMedia',
  businessName: 'AdiTitle',
  tagline: 'AdiTitle',
  paragraph: 'AdiMarkdown'
}

const properties = generateProperties(name, components)

properties.media.src = './static/adi/mixLayer/mix-layer.png'

export default { mod, name, components, properties, styles, templates }
