/*doc
---
title: Title Mod
name: Title Mod
category: Adi Mod
---

This is the Title Mod for usage.

```@Title
styleID: // 样式ID
logo:
  src: // logo图片来源地址链接
  link: // logo图片点击跳转链接
  target: // 链接从新窗口打开或本窗口打开
businessName:
  name: // 公司名称
  link: // 公司网址
  target: // 链接从新窗口打开或本窗口打开
tagline:
  name: // 宣传词名称
  link: // 宣传词点击跳转链接
  target: // 链接从新窗口打开或本窗口打开
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

```

*/

import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './title.styles'
import templates from './title.templates'

const name = 'ModTitle'

const components = {
  logo: 'AdiMedia',
  businessName: 'AdiTitle',
  tagline: 'AdiTitle',
  menu: 'AdiMenu'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
