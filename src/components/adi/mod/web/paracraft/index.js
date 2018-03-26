import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './paracraft.styles'
import templates from './paracraft.templates'

const name = 'ModParacraft'

const components = {
  preview: 'AdiMedia',
  worldName: 'AdiTitle',
  author: 'AdiDescLabel',
  version: 'AdiDescLabel',
  updateTime: 'AdiLabel',
  viewTimesImg: 'AdiMedia',
  viewTimes: 'AdiDescLabel',
  size: 'AdiDescLabel',
  download: 'AdiButton',
  enter: 'AdiButton'
}

const properties = generateProperties(name, components)

properties.preview.src =
  'http://git.keepwork.com/gitlab_rls_testv2/world_base32_5g5zr2foutszbdpfvwltg/raw/master/preview.jpg'

properties.worldName.name = '默认名字'

properties.author.text = '你的名字'
properties.author.desc = '作者:'

properties.version.text = '0.0.0'
properties.version.desc = '版本'

properties.updateTime.text = '2018-1-10-14-30'
properties.updateTime.link = '#'

properties.viewTimesImg.src =
  'http://keepwork.com/wiki/js/mod/adi/assets/imgs/icon/world3D_eye.png'

properties.viewTimes.text = '0'
properties.viewTimes.desc = '浏览量'

properties.size.text = '31KB'
properties.size.desc = '大小'

properties.download.name = '下载'
properties.download.link = 'http://keepwork.com'

properties.enter.name = '进入'
properties.enter.link = 'http://keepwork.com'

export default { mod, name, components, properties, styles, templates }
