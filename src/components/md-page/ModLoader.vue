<template>
  <component :is='modComponent' :mod='mod' :key='mod.key'> </component>
</template>

<script>
import AsyncComponents from '@/components/adi/adi-mod/asyncPac'

export default {
  props: {
    mod: Object
  },
  data() {
    return {}
  },
  computed: {
    modComponent() {
      return AsyncComponents[this.mod.modType]
    }
  }
}
</script>
