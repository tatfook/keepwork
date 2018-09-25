/*doc
---
title: Button Mod
name: Button Mod
category: Adi Mod
---

This is the Button Mod for usage.

```@Button
styleID: // 样式ID
button:
  name: //按钮名称
  link: // 图片点击跳转链接
  width: // 图片宽度
  height: // 图片高度
  src: // 图片来源地址链接
  fontSize: //文字字体大小
  target: // 链接从新窗口打开或本窗口打开

```

*/

import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './button.styles'
import templates from './button.templates'
import themeData from './button.theme'

const name = 'ModButton'

const components = {
  button: 'AdiButton'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates, themeData }
