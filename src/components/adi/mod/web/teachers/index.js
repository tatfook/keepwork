import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './teachers.styles'
import templates from './teachers.templates'

const name = 'ModTeachers'

const components = {
  teachers: 'AdiTeachers'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
