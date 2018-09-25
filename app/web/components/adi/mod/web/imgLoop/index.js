/*doc
---
title: ImgLoop Mod
name: ImgLoop Mod
category: Adi Mod
---

This is the ImgLoop Mod for usage.

```@ImgLoop
styleID: // 样式ID
imgLoop:
  data:
    - img: // 轮播图1来源地址链接
      link: // 轮播图1点击跳转链接
    - img: // 轮播图2来源地址链接
      link: // 轮播图2点击跳转链接
  target: // 链接从新窗口打开或本窗口打开

```

*/

import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './imgLoop.styles'
import templates from './imgLoop.templates'

const name = 'ModImgLoop'

const components = {
  imgLoop: 'AdiImgLoop'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
