<template>
  <div class='viewport-container'>
    <el-button @click='newMod'> + </el-button>
    <template v-for='mod in modList'>
      <editor-mod-selector :key='mod.key' :mod='mod' :theme='theme'></editor-mod-selector>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EditorModSelector from './EditorModSelector'
import themeFactory from '@/lib/theme/theme.factory'

export default {
  name: 'EditorViewport',
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
      if (this.storedTheme) this.storedTheme.detach()
      this.storedTheme = newTheme
      this.storedTheme.attach()
      return this.storedTheme
    }
  },
  methods: {
    newMod() {
      this.$store.dispatch('addMod', { modName: 'ModHeader' })
    }
  }
}
</script>
