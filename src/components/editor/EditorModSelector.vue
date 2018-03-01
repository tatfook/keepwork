<template>
  <div :class="{ 'mod-active': mod.isActive }" @click='setActive'>
    <div class='operator' v-if='mod.isActive'>
      <el-button > Styles </el-button>
      <el-button > Properties </el-button>
      <el-button @click='deleteMod'> Delete </el-button>
    </div>
    <div class='mod'>
      <component :is='modComponent' :mod='mod' :editMode='true'> </component>
    </div>
    <el-button @click='newMod'> + </el-button>
  </div>
</template>

<script>
import AdiComponents from '@/components/adi/mod'

export default {
  props: {
    mod: Object
  },
  data() {
    return {
    }
  },
  computed: {
    modComponent() {
      return AdiComponents[this.mod.modType]
    }
  },
  methods: {
    newMod() {
      this.$store.dispatch('addMod', {
        modName: 'AdiHeader',
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
};
</script>

<style scoped>
 .mod-active {
   border: 3px solid rgb(228, 37, 37)
 }
 .mod {
   border: 1px dashed rgb(87, 55, 231)
 }
</style>

