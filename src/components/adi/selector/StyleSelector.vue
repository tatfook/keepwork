<template>
  <div class='kp-mod-styles'>
    <div v-for='style in styles' :key='style.id' class='kp-mod-style' :class='{active: isActive(style.id)}' @click='changeStyle(style.id)'>
      {{style.template}}
    </div>
  </div>
</template>

<script>
import modStyles from '@/components/adi/mod/mod.styles'

export default {
  props: {
    mod: Object
  },
  computed: {
    styles() {
      return modStyles[this.mod.modType]
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

