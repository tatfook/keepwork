import { generateProperties } from '@/components/adi/mod/base/base.utils'
import styles from './qq.styles'
import templates from './qq.templates'
import mod from './QQ'

const name = 'ModQQ'

const components = {
  qq: 'AdiNumber',
  pic: 'AdiMedia',
  desc: 'AdiTitle'
}

const properties = generateProperties(name, components)

properties.pic.src = './static/adi/qq/qqMod.png'
properties.pic.link = ''

properties.desc.name = '客服中心'

export default { mod, name, components, properties, styles, templates }
