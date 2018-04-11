<template>
  <div :class="{ 'mod-active': isActive }" class='kp-mod-selector' @click='setActive'>
    <div class='mod'>
      <component :is='modComponent' :mod='mod' :conf='modConf' :theme='theme' :editMode='true' :active='isActive'></component>
      <span v-if='invalid'> 错误的Mod指令 </span>
    </div>
    <div class='operator' v-if='isActive'>
      <el-button class="add-mod-btn add-before" @click.stop.prevent='newMod(gConst.POSITION_BEFORE)'> + </el-button>
      <el-button class="add-mod-btn add-after" @click.stop.prevent='newMod(gConst.POSITION_AFTER)'> + </el-button>
    </div>
  </div>
</template>

<script>
import mods from '@/components/adi/mod'
import { mapGetters } from 'vuex'
import { gConst } from '@/lib/global'

export default {
  props: {
    mod: Object,
    theme: Object
  },
  data() {
    return {
      gConst
    }
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
    newMod(position) {
      this.$store.dispatch('setNewModPosition', position)
      this.$emit('onAddMod', this.mod.key)
    },
    setActive() {
      this.$store.dispatch('setActiveMod', this.mod.key)
    }
  }
}
</script>

<style scoped>
.mod-active {
  border: 2px dashed #69b9ff;
  position: relative;
}
.add-mod-btn {
  width: 38px;
  height: 38px;
  background-color: #7fc3ff;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  padding: 0;
  font-size: 30px;
  border: none;
  position: absolute;
  left: 50%;
  margin-left: -19px;
  z-index: 11111;
}
.add-before {
  top: -19px;
}
.add-after {
  bottom: -19px;
}
.add-mod-btn:hover {
  transform: scale(1.211);
  background-color: #7fc3ff;
  color: #fff;
}
</style>

<style>
.kp-mod-selector .comp {
  position: relative;
}
.kp-mod-selector .comp:hover::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  background-color: rgba(127, 195, 255, 0.4);
}
</style>

