/*doc
---
title: Comment Mod
name: Comment Mod
category: Adi Mod
---

This is the Comment Mod for usage.

```@Comment
styleID: // 样式ID
comment:
  switch:
    desc: // 评论开关描述
    value: // 评论开关与否

```

*/

import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './comment.styles'
import templates from './comment.templates'

const name = 'ModComment'

const components = {
  comment: 'AdiComment'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
