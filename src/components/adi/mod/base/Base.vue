<script>
/*doc
---
title: Base Mod
name: Base Mod
category: Adi Mod
---

This is the default Mod for common usage.

With Base Mod, you only need 4 steps to create a new mod:

1. name your mod with format 'ModExample'
2. define the basic component list
3. generate properties and change some default values if you have to
4. create templates and styles

### Example

```javascript
import { generateProperties } from '@/components/adi/mod/base/base.utils'
import mod from '@/components/adi/mod/base/Base'
import styles from './example.styles'
import templates from './example.templates'

const name = 'ModExample'

const components = {
  titleA: 'AdiTitle',
  titleB: 'AdiTitle'
}

const properties = generateProperties(name, components)

export default { mod, name, components, properties, styles, templates }
```

If your requirements were so complicated, for example, have to exchange data with backend server via api calls,
you can create a new vue file for your mod, and import it like bellow.

```javascript
import mod from './Example'
```

**Important**: You should always add baseMixin to your customize *mod.vue file.
*/

import baseMixin from './base.mixin'

export default {
  mixins: [baseMixin]
}
</script>
