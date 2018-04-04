import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './mixLayer.styles'
import templates from './mixLayer.templates'

const name = 'ModMixLayer'

const components = {
  media: 'AdiMedia',
  title: 'AdiTitle',
  subtitle: 'AdiTitle',
  paragraph: 'AdiMarkdown'
}

const properties = generateProperties(name, components)

properties.media.src = './static/adi/mixLayer/mix-layer.png'
properties.title.name = '加利福尼亚大学'
properties.subtitle.name = '顶尖研究型大学'
properties.paragraph.data =
  '加利福尼亚大学伯克利分校是美国最负盛名且是最顶尖的一所公立研究型大学，位于旧金山东湾伯克利市的山丘上。1868年由加利福尼亚学院以及农业、矿业和机械学院合并而成，1873年迁至圣弗朗西斯科（旧金山）附近的伯克利市。伯克利加大是加利福尼亚大学中最老的一所。它也是美国大学协会（Association of American Universities）创始会员之一。其吉祥物蜕变自加州徽号，故其学生亦常自称“金色小熊”。加州大学伯克利分校与斯坦福大学、麻省理工学院等一同被誉为美国工程科技界的学术领袖。'

export default { mod, name, components, properties, styles, templates }
