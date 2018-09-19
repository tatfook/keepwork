/*doc
---
title: Img Mod
name: Img Mod
category: Adi Mod
---

This is the Img Mod for usage.

```@Img
styleID: // 样式ID
img:
  src: // 图像来源地址链接
  link: // 图像点击跳转链接
  target: // 链接从新窗口打开或本窗口打开

```

*/

import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './img.styles'
import templates from './img.templates'

const name = 'ModImg'

const components = {
  img: 'AdiMedia'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
