<template>
  <component :is='modComponent' :mod='mod' :conf='modConf' :theme='theme' :key='key'> </component>
</template>

<script>
import AsyncMods from '@/components/adi/mod/index.async'

export default {
  props: {
    mod: Object,
    theme: Object
  },
  data() {
    return {
      modComponent: undefined,
      modConf: undefined
    }
  },
  created() {
    this.loadComponent()
  },
  methods: {
    async loadComponent() {
      let data = await AsyncMods[this.mod.type]()
      this.modConf = data.default
      this.modComponent = this.modConf.mod
    }
  }
}
</script>
