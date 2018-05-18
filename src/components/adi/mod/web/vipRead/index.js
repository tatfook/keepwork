/*doc
---
title: VipRead Mod
name: VipRead Mod
category: Adi Mod
---

This is the VipRead Mod for usage.

```@VipRead
styleID: // 样式ID
vipRead:
  switch:
    desc: // vip权限开关描述
    value: // vip权限开关与否

```

*/

import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './vipRead.styles'
import templates from './vipRead.templates'

const name = 'ModVipRead'

const components = {
  vipRead: 'AdiVipRead'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
