import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './quizz.styles'
import templates from './quizz.templates'

const name = 'ModQuizz'

const components = {
  quizz: 'AdiQuizz'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
