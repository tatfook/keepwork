import { generateProperties } from '@/components/adi/mod/base/base.utils'
import styles from './paracraft.styles'
import templates from './paracraft.templates'
import mod from './Paracraft'

const name = 'ModParacraft'

const components = {
  preview: 'AdiMedia',
  desc: 'AdiMarkdown',
  worldName: 'AdiTitle',
  author: 'AdiDescLabel',
  version: 'AdiDescLabel',
  updateTime: 'AdiLabel',
  viewTimesImg: 'AdiMedia',
  viewTimes: 'AdiDescLabel',
  size: 'AdiDescLabel',
  download: 'AdiButton',
  enter: 'AdiButton',
  innerModal: 'AdiInnerModal',
  paracraftInfo: 'AdiLabel'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
