/*doc
---
title: WideScreen Mod
name: WideScreen Mod
category: Adi Mod
---

This is the WideScreen Mod for usage.

```@WideScreen
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

const name = 'ModWideScreen'

const components = {
  img: 'AdiMedia'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
