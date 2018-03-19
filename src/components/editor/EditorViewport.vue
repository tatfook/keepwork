<template>
  <div class='viewport-container'>
    <el-button @click='openModSelector'> + </el-button>
    <template v-for='(mod, index) in modList'>
      <editor-mod-selector :key='index' :mod='mod' :theme='theme' @onAddMod='openModSelector'></editor-mod-selector>
    </template>
    <el-dialog :visible.sync='dialogVisible'>
      <div v-for='mod in mods' :key='mod.name' @click='newMod(mod.name)'>
        {{mod.name}}
      </div>
    </el-dialog>
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
      mods,
      dialogVisible: false,
      selectedModKey: null
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
    newMod(name) {
      this.$store.dispatch('addMod', {
        modName: name,
        preModKey: this.selectedModKey
      })
      this.dialogVisible = false
      this.selectedModKey = null
    },
    openModSelector(key) {
      this.dialogVisible = true
      this.selectedModKey = key
    }
  }
}
</script>
<style scoped>
.viewport-container {
  flex: 1;
  background-color: #FFF;
  overflow: auto;
}
</style>
