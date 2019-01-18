/*doc
---
title: PPT Mod
name: PPT Mod
category: Adi Mod
---

*/
import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'

const name = 'ModPpt'

const components = {
  ppt: 'AdiPpt'
}

const styles = [
  {
    theme: {
      root: [],
      rootRow: ['mod-full-width']
    }
  }
]
const templates = [[{ colPpt: 'ppt' }]]

const properties = generateProperties(name, components)
properties.styleID = 0

export default { mod, name, components, properties, styles, templates }
