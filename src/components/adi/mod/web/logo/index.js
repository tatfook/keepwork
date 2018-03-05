import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './logo.styles'

const name = 'ModLogo'

const components = {
  media: 'AdiMedia',
  label1: 'AdiLabel',
  label2: 'AdiLabel'
}

const properties = generateProperties(name, components)

export default { mod, name, properties, styles }
