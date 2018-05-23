/*doc
---
title: BigFile Mod
name: BigFile Mod
category: Adi Mod
---

This is the BigFile Mod for usage.

```@BigFile
styleID: //样式ID
bigFile:
  fileId: //大文件ID
  fileType: //大文件类型
  extraMsg: //大文件额外信息
  channel: //大文件传输渠道

```

*/

import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './bigFile.styles'
import templates from './bigFile.templates'

const name = 'ModBigFile'

const components = {
  bigFile: 'AdiBigFile'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
