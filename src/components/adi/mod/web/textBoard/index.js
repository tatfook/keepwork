/*doc
---
title: TextBoard Mod
name: TextBoard Mod
category: Adi Mod
---

This is the TextBoard Mod for usage.

```@TextBoard
styleID: // 样式ID
paragraph:
  data: // 文章内容
board:
  data: // 绘图板数据内容
title:
  name: // 标题名称
  link: // 标题点击跳转链接
  target: // 链接从新窗口打开或本窗口打开
subtitle:
  name: // 副标题名称
  link: // 副标题点击跳转链接
  target: // 链接从新窗口打开或本窗口打开

```

*/

import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './textBoard.styles'
import templates from './textBoard.templates'

const name = 'ModTextBoard'

const components = {
  paragraph: 'AdiMarkdown',
  board: 'AdiBoard',
  title: 'AdiTitle',
  subtitle: 'AdiTitle'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
