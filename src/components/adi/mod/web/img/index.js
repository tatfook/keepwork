/*doc
---
title: img Mod
name: img Mod
category: Adi Mod
---

This is the img for usage.

## @Img

## 参数说明

```@Img
- styleID : //当前样式id

# img
- src : //图像地址
- link : //图像点击跳转链接
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
