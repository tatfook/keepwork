import { generateProperties } from '@/components/adi/mod/base/base.utils'

import styles from './lesson.styles'
import templates from './lesson.templates'
import mod from './Lesson'

const name = 'ModLesson'

const components = {
  // 这里的 `Adi*` 会指向 src/components/adi/common
  animation: 'AdiMedia',
  lessonNo: 'AdiMarkdown',
  topic: 'AdiTitle',
  lessonGoals: 'AdiMarkdown',
  button: 'AdiButton',
  tabs: 'AdiTabs'
}

// propertis 为页面上的默认值
const properties = generateProperties(name, components)

properties.topic.name = 'Lesson Topic'

properties.topic.link = 'javascript:;'

properties.lessonGoals.data = 'Lesson Goals'

properties.Animations = []

properties.animation.src = 'http://static.qiakr.com/movie/0060201.mp4'

properties.button.name = 'Play Paracraft'

properties.lessonNo.data = 'ch1'

properties.tabs = {
  data: [
    {
      name: 'Overview'
    },
    {
      name: 'Related Animations'
    },
    {
      name: "Student's Performance"
    },
    {
      name: 'Summary'
    }
  ]
}

export default { mod, name, components, properties, styles, templates }
