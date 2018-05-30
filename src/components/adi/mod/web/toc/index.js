/*doc
---
title: Toc Mod
name: Toc Mod
category: Adi Mod
---

This is the Toc Mod for usage.

```@Toc
styleID: // 样式ID
toc:
  title: // 输入标题

```

*/

import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './toc.styles'
import templates from './toc.templates'

const name = 'ModToc'

const components = {
  toc: 'AdiToc'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
