import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './text.styles'
import templates from './text.templates'

const name = 'ModText'

const components = {
  title: 'AdiTitle',
  paragraph: 'AdiMarkdown'
}

const properties = generateProperties(name, components)

properties.title.name = '卢布尔雅那'
properties.paragraph.data = `一个人去旅行，而且是去故乡的山水间徜徉。临行之前，面对太多的疑问和不解：为何是一个人？也有善意的提醒：何不去远方！昆明呀——赶一个花海；三亚呀——赴一个蓝天碧海。只是微笑地固执自己的坚持，不做任何解释。没有人明白，这一次是一个告别，或者一个永远的告别，以后我会去到很多很繁华或苍凉，辽远或偏僻的地方，而会常常想起这一次的旅行，想起那座山，那个城，那些人……`

export default { mod, name, components, properties, styles, templates }
