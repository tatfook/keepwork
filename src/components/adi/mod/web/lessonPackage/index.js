import {
  generateProperties
} from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './lessonPackage.styles'
import templates from './lessonPackage.templates'

const name = 'ModLessonPackage'

const components = {
  lessonPackage: 'AdiLessonPackage'
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
