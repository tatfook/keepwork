<template>
  <div :class="{ 'mod-active': isActive }" @click='setActive'>
    <div class='mod'>
      <component :is='modComponent' :mod='mod' :conf='modConf' :theme='theme' :editMode='true'></component>
    </div>
    <div class='operator' v-if='isActive'>
      <el-button @click.stop.prevent='newMod'> + </el-button>
      <el-button @click.stop.prevent='deleteMod'> - </el-button>
    </div>
  </div>
</template>

<script>
import mods from '@/components/adi/mod'
import { mapGetters } from 'vuex'

export default {
  props: {
    mod: Object,
    theme: Object
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      activeMod: 'activeMod'
    }),
    modComponent() {
      return mods[this.mod.type].mod
    },
    modConf() {
      return mods[this.mod.type]
    },
    isActive() {
      return this.activeMod && this.mod.key === this.activeMod.key
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
