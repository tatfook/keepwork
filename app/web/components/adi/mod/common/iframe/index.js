/*doc
---
title: IFrame Mod
name: IFrame Mod
category: Adi Mod
---

This is the IFrame Mod for usage.

```@IFrame
iframe:
  src: //url地址
  ratio: //宽高比， 比如16/9； 或者高/宽的值，比如0.5625
  width: //宽度，可以为百分比（80%）或者像素（800px）
  height： //高度，只能为像素(900px)
```
注：width和height只有在ratio为空的时候才生效。

*/
import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'

const name = 'ModIFrame'

const components = {
  iframe: 'AdiIFrame'
}

const styles = [
  {
    theme: {
      root: [],
      rootRow: ['mod-full-width']
    },
    useImage: true,
    cover: require('@/assets/adi/IFrame.png')
  }
]
const templates = [[{ colIframe: 'iframe' }]]

const properties = generateProperties(name, components)
properties.styleID = 0

export default { mod, name, components, properties, styles, templates }
