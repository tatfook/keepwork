import {
  generateProperties
} from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './lessonShare.styles'
import templates from './lessonShare.templates'

const name = 'ModLessonShare'

const components = {
  lessonShare: 'AdiLessonShare'
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
