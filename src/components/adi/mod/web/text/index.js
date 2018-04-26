/*doc
---
title: Text Mod
name: Text Mod
category: Adi Mod
---

## @Text

## 参数说明

```
- styleID :  //样式ID

# title
- name : // 标题名称
- link : // 标题链接

# paragraph
- data : // 文章内容
```
*/

import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './text.styles'
import templates from './text.templates'

const name = 'ModText'

const components = {
  title: 'AdiTitle',
  paragraph: 'AdiMarkdown'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
