<template>
  <component :is='modComponent' :mod='mod' :key='mod.key'> </component>
</template>

<script>
import AsyncMods from '@/components/adi/mod/index.async'

export default {
  props: {
    mod: Object
  },
  data() {
    return {}
  },
  computed: {
    modComponent() {
      return AsyncMods[this.mod.modType]
    }
  }
}
</script>
