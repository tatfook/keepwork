/*doc
---
title: Title Mod
name: Title Mod
category: Adi Mod
---
## @Title

## 参数说明

```
- styleID :  //样式ID

# logo
- src : // logo 图片地址
- link : // logo 链接

# businessName
- name : // 公司名字
- link : // 公司网址

# tagline
- name : // 宣传词
- link : // 宣传词链接

# menu

# menu.data

# menu.data.0
- name : 菜单1
- link : http://keepwork.com

# menu.data.1
- name : 菜单2
- link : http://keepwork.com

# menu.data.1.child

# menu.data.1.child.0
- name : 菜单2.1
- link : http://keepwork.com

# menu.data.1.child.1
- name : 菜单2.2
- link : http://keepwork.com

# menu.data.1.child.1.child

# menu.data.1.child.1.child.0
- name : 菜单2.2.1
- link : http://keepwork.com

# menu.data.1.child.1.child.1
- name : 菜单2.2.2
- link : http://keepwork.com

# menu.data.1.child.1.child.1.child

# menu.data.1.child.1.child.1.child.0
- name : 菜单2.2.2.1
- link : http://keepwork.com
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
