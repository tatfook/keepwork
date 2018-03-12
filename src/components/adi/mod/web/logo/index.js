import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './logo.styles'

const name = 'ModLogo'

const components = {
  media: 'AdiMedia',
  labelA: 'AdiLabel',
  labelB: 'AdiLabel'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles }
