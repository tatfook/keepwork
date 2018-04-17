import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './lesson.styles'
import templates from './lesson.templates'

const name = 'ModLesson'

const components = {
  // 这里的 `AdiLesson` 会指向 src/components/adi/common
  lesson: 'AdiLesson'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
