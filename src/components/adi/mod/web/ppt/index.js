/*doc
---
title: Ppt Mod
name: Ppt Mod
category: Adi Mod
---

This is the Ppt Mod for usage.

*/

import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './ppt.styles'
import templates from './ppt.templates'

const name = 'ModPpt'

const components = {
  ppt: 'AdiPpt'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
