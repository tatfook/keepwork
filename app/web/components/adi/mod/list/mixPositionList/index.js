import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './mixPositionList.styles'
import templates from './mixPositionList.templates'
import modSettings from './mixPositionList.settings'

const name = 'ModMixPositionList'

const components = {
  list: 'AdiList'
}
const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates, modSettings }
