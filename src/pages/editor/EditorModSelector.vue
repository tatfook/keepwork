<template>
  <div :class="{ 'mod-active': mod.isActive }" @click='setActive'>
    <div class='mod'>
      <component :is='modComponent' :mod='mod' :theme='theme' :editMode='true'> </component>
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
    }
  },
  methods: {
    newMod() {
      this.$store.dispatch('addMod', {
        modName: 'ModHeader',
        preModKey: this.mod.key
      })
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

<style scoped>
.mod-active {
  border: 3px solid rgb(228, 37, 37);
}
.mod {
  border: 1px dashed rgb(87, 55, 231);
}
</style>
