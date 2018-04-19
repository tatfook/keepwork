/*doc
---
title: imgLoop Mod
name: imgLoop Mod
category: Adi Mod
---

## @ImgLoop

## 参数说明

```
- styleID :  //样式ID

# imgLoop

# imgLoop.data

# imgLoop.data.0
- img : // 轮播图1 图片地址
- link : // 轮播图1 图片链接

# imgLoop.data.1
- img : // 轮播图2 图片地址
- link : // 轮播图2 图片链接
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
