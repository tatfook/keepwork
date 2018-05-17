import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './bigFile.styles'
import templates from './bigFile.templates'

const name = 'ModBigFile'

const components = {
  bigFile: 'AdiBigFile'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
