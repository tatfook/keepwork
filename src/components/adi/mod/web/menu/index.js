/*doc
---
title: Menu Mod
name: Menu Mod
category: Adi Mod
---

This is the Menu Mod for usage.

```@Menu
styleID: // 样式ID
menu:
  data:
    - name: // 菜单1名称
      link: // 菜单1点击跳转链接
      child:
        - name: // 子菜单1.1名称
          link: // 子菜单1.1点击跳转链接
        - name: // 子菜单1.2名称
          link: // 子菜单1.2点击跳转链接
    - name: // 菜单2名称
      link: // 菜单2点击跳转链接
      child:
        - name: // 子菜单2.1名称
          link: // 子菜单2.1点击跳转链接
        - name: // 子菜单2.2名称
          link: // 子菜单2.2点击跳转链接
  target: // 链接从新窗口打开或本窗口打开
footer:
  data:
    - name: // 菜单1名称
      link: // 菜单1点击跳转链接
      child:
        - name: // 子菜单1.1名称
          link: // 子菜单1.1点击跳转链接
        - name: // 子菜单1.2名称
          link: // 子菜单1.2点击跳转链接
    - name: // 菜单2名称
      link: // 菜单2点击跳转链接
      child:
        - name: // 子菜单2.1名称
          link: // 子菜单2.1点击跳转链接
        - name: // 子菜单2.2名称
          link: // 子菜单2.2点击跳转链接
  target: // 链接从新窗口打开或本窗口打开

```

*/

import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './menu.styles'
import templates from './menu.templates'

const name = 'ModMenu'

const components = {
  menu: 'AdiMenu',
  footer: 'AdiFooter'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
