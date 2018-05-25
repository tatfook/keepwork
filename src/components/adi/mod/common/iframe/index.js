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
  width: //宽度，默认100%
  height: //高度，默认300px

```

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
    cover: require('@/../static/adi/markdown.png')
  }
]
const templates = [[{ colIframe: 'iframe' }]]

const properties = generateProperties(name, components)
properties.styleID = undefined

export default { mod, name, components, properties, styles, templates }
