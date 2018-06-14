/*doc
---
title: PagePath Mod
name: PagePath Mod
category: Adi Mod
---
This is the PagePath Mod for usage.
```@PagePath
styleID: 0
pageRoute:
  target: // 链接从新窗口打开或本窗口打开
```
*/

import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './pagePath.styles'
import templates from './pagePath.templates'

const name = 'ModPagePath'

const components = {
  pageRoute: 'AdiPagePath'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
