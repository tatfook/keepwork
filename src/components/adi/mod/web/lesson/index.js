import { generateProperties } from '@/components/adi/mod/base/base.utils'

import styles from './lesson.styles'
import templates from './lesson.templates'
import mod from './Lesson'

const name = 'ModLesson'

const components = {
  // 这里的 `Adi*` 会指向 src/components/adi/common
  animation: 'AdiMedia',
  topic: 'AdiTitle',
  lessonGoals: 'AdiMarkdown',
  button: 'AdiButton'
}

// propertis 为页面上的值
const properties = generateProperties(name, components)

properties.topic.name = 'Lesson Topic'

properties.lessonGoals.data = 'Lesson Goals'

properties.Animations = []

properties.animation.src = 'http://static.qiakr.com/movie/0060201.mp4'

properties.button.name = 'Play Paracraft'

export default { mod, name, components, properties, styles, templates }
