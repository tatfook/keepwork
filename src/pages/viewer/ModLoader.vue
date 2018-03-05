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
    return {
      modComponent: undefined
    }
  },
  created() {
    this.loadComponent()
  },
  methods: {
    async loadComponent() {
      let modConf = await AsyncMods[this.mod.type]()
      this.modComponent = modConf.default.mod
    }
  }
}
</script>
