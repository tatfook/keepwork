import {
  generateProperties
} from '@/components/adi/mod/base/base.utils'

import styles from './lesson.styles'
import templates from './lesson.templates'
import mod from '@/components/adi/mod/base/Base'
const name = 'ModLesson'
const components = {
  lesson: 'AdiLesson'
}
const properties = generateProperties(name, components)
// properties.lesson.animations = []
export default {
  mod,
  name,
  components,
  properties,
  styles,
  templates
}
