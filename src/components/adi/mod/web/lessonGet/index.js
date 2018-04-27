import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './lessonGet.styles'
import templates from './lessonGet.templates'

const name = 'ModLessonGet'

const components = {
  lessonGet: 'AdiLessonGet'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
