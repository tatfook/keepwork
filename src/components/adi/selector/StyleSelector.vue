<template>
  <div class='kp-mod-styles'>
    <div v-for='(style, index) in styles' :key='style.name' class='kp-mod-style' :class='{active: isActive(index)}' @click='changeStyle(index)'>
      {{index}}
    </div>
  </div>
</template>

<script>
import mods from '@/components/adi/mod'

export default {
  props: {
    mod: Object
  },
  computed: {
    styles() {
      return mods[this.mod.type].styles
    }
  },
  methods: {
    changeStyle(styleID) {
      this.$store.dispatch('updateActiveModStyle', styleID)
    },
    isActive(styleID) {
      return this.mod.styleID == styleID
    }
  }
}
</script>

<style lang="scss" scoped>
.kp-mod-style {
  height: 20px;
  width: 100%;
  border-bottom: 3px solid blue;
  &.active {
    background-color: cadetblue;
  }
}
</style>
