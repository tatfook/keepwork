import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './paracraft.styles'
import templates from './paracraft.templates'

const name = 'ModParacraft'

const components = {
  preview: 'AdiMedia',
  worldName: 'AdiTitle',
  author: 'AdiLable',
  version: 'AdiLable',
  updateTime: 'AdiLable',
  viewTimesImg: 'AdiMedia',
  size: 'AdiLable',
  download: 'AdiButton',
  enter: 'AdiButton'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
