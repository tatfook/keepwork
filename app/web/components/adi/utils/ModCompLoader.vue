<template>
  <component :is='modComponent' :rootMod='rootMod' :mod='mod' :conf='modConf' :theme='theme' :editMode='editMode'> </component>
</template>

<script>
import AsyncModLoader from '@/components/adi/mod/index.async'

export default {
  props: {
    rootMod: Object,
    mod: Object,
    theme: Object,
    modType: String,
    editMode: Boolean
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
      let modType = this.modType || 'Mod' + this.mod.cmd
      let data = await AsyncModLoader.load(modType)
      this.modConf = data.default
      this.modComponent = this.modConf.mod
    }
  }
}
</script>
