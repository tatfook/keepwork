/*doc
---
title: PagePath Mod
name: PagePath Mod
category: Adi Mod
---
This is the PagePath Mod for usage.
```@PagePath
styleID: // 样式ID
pagePath:
  pageData:
    - name: //一级目录名字
      link: //一级目录链接
    - name: //二级目录名字
      link: //二级目录链接
    - name: //三级目录名字
      link: //三级目录链接
    ......
    - name: //当前页面名字
      link: //当前页面链接
  target: // 链接从新窗口打开或本窗口打开
```
*/

import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './pagePath.styles'
import templates from './pagePath.templates'
import themeData from './pagePath.theme'

const name = 'ModPagePath'

const components = {
  pagePath: 'AdiPagePath'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates, themeData }
