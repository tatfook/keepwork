import { generateProperties } from '@/components/adi/mod/base/base.utils'

import styles from './lesson.styles'
import templates from './lesson.templates'
import mod from './Lesson'
const name = 'ModLesson'
const components = {
  lesson: 'AdiLesson'
}
const properties = generateProperties(name, components)
export default {
  mod,
  name,
  components,
  properties,
  styles,
  templates
}
