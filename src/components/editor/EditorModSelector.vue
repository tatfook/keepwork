<template>
  <div :class="{ 'mod-active': mod.isActive }" @click='setActive'>
    <div class='mod'>
      <component :is='modComponent' :mod='mod' :conf='modConf' :theme='theme' :editMode='true'></component>
    </div>
    <div class='operator' v-if='mod.isActive'>
      <el-button @click.stop.prevent='newMod'> + </el-button>
      <el-button @click.stop.prevent='deleteMod'> - </el-button>
    </div>
  </div>
</template>

<script>
import mods from '@/components/adi/mod'

export default {
  props: {
    mod: Object,
    theme: Object
  },
  data() {
    return {}
  },
  computed: {
    modComponent() {
      return mods[this.mod.type].mod
    },
    modConf() {
      return mods[this.mod.type]
    }
  },
  methods: {
    newMod() {
      this.$emit('onAddMod', this.mod.key)
    },
    setActive() {
      this.$store.dispatch('setActiveMod', this.mod)
    },
    deleteMod() {
      this.$store.dispatch('deleteMod', this.mod)
    }
  }
}
</script>
