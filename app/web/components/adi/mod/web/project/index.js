import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './project.styles'
import templates from './project.templates'
// import mod from './Project'
// import themeData from './qq.theme'

const name = 'ModProject'

const components = {
  project: 'AdiProject'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
