/*doc
---
title: menu Mod
name: menu Mod
category: Adi Mod
---

This is the menu for usage.

## @menu

## 参数说明

```
- styleID : //当前样式id

# menu
- target : //是否在新窗口

# menu.data //菜单数据

```

*/

import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './menu.styles'
import templates from './menu.templates'

const name = 'ModMenu'

const components = {
  menu: 'AdiMenu'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
