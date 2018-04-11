import { generateProperties } from '@/components/adi/mod/base/base.utils'
import styles from './qq.styles'
import templates from './qq.templates'
import mod from './QQ'

const name = 'ModQQ'

const components = {
  pic: 'AdiMedia',
  desc: 'AdiTitle'
}

const properties = generateProperties(name, components)

properties.pic.name = '图片点击跳转qq聊天链接'
properties.pic.src = './static/adi/qq/qqMod.png'
properties.pic.link =
  'http://wpa.qq.com/msgrd?v=3&uin=123456789&site=qq&menu=yes'

properties.desc.name = '客服中心'

export default { mod, name, components, properties, styles, templates }
