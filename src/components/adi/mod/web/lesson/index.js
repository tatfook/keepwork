import { generateProperties } from '@/components/adi/mod/base/base.utils'

import styles from './lesson.styles'
import templates from './lesson.templates'
import mod from './Lesson'

const name = 'ModLesson'

const components = {
  // 这里的 `Adi*` 会指向 src/components/adi/common
  lesson: 'AdiLesson'
}

// propertis 为页面上的默认值
const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
