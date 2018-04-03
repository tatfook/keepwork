<template>
  <div>
    <img class="style-item" :class='{active: isActive(index)}' v-for='(style, index) in styles' :key='style.name' @click='changeStyle(index)' :src="style.cover" :alt="index">
  </div>
</template>

<script>
import mods from '@/components/adi/mod'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    mod: Object
  },
  computed: {
    styles() {
      return mods[this.mod.modType].styles
    }
  },
  methods: {
    ...mapActions({
      updateActiveModStyle: 'updateActiveModStyle'
    }),
    changeStyle(styleID) {
      this.updateActiveModStyle(styleID)
    },
    isActive(styleID) {
      let curStyle = Number(this.mod.data.styleID) || 0
      return curStyle === styleID
    }
  }
}
</script>

<style scoped>
.style-item {
  width: 100%;
  box-sizing: border-box;
  border: 2px solid transparent;
  display: block;
  margin-bottom: 12px;
}
.style-item.active {
  border-color: #3da4fd;
}
</style>
