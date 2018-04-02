<template>
  <div class='viewport-container'>
    <el-button @click='openModSelector'> + </el-button>
    <template v-for='(mod, index) in modList'>
      <editor-mod-selector :key='index' :mod='mod' :theme='theme' @onAddMod='openModSelector'></editor-mod-selector>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EditorModSelector from './EditorModSelector'
import themeFactory from '@/lib/theme/theme.factory'
import mods from '@/components/adi/mod'

export default {
  name: 'EditorViewport',
  data() {
    return {
      mods
    }
  },
  components: {
    EditorModSelector
  },
  computed: {
    ...mapGetters({
      modList: 'modList',
      themeConf: 'themeConf'
    }),
    theme() {
      let newTheme = themeFactory.generate(this.themeConf)
      if (this.storedTheme === newTheme) return this.storedTheme
      if (this.storedTheme) this.storedTheme.sheet.detach()
      this.storedTheme = newTheme
      this.storedTheme.sheet.attach()
      return this.storedTheme
    }
  },
  methods: {
    openModSelector(key) {
      this.$store.dispatch('setActiveWinType', 'ModsList')
    }
  }
}
</script>
<style scoped>
.viewport-container {
  flex: 1;
  background-color: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
}
</style>
