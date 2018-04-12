<template>
  <div mod-container>
    <template v-for='mod in modList'>
      <mod-loader :mod='mod' :theme='theme' :key='mod.key'> </mod-loader>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ModLoader from './ModLoader'
import themeFactory from '@/lib/theme/theme.factory'

export default {
  components: {
    ModLoader
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
  }
}
</script>
