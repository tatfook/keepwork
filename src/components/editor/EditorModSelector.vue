<template>
  <div :class="{ 'mod-active': isActive }" @click='setActive'>
    <div class='mod'>
      <component :is='modComponent' :mod='mod' :conf='modConf' :theme='theme' :editMode='true' :active='isActive'></component>
      <span v-if='invalid'> 错误的Mod指令 </span>
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
      if (this.modConf) return this.modConf.mod
    },
    modConf() {
      return mods[this.mod.modType]
    },
    isActive() {
      return this.activeMod && this.mod.key === this.activeMod.key
    },
    invalid() {
      return !this.modConf
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

<style>
.mod-active {
  border: 2px solid rgb(240, 15, 15);
}
.comp-active {
  border: 3px dashed rgb(43, 11, 221);
}
</style>

