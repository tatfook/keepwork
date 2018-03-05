<template>
  <div>
    <template v-for='mod in source.modList'>
      <mod-loader :mod='mod' :theme='theme' :key='mod.key'> </mod-loader>
    </template>
  </div>
</template>

<script>
import testData from './testData'
import ModLoader from './ModLoader'
import themeFactory from '@/lib/theme/theme.factory'

export default {
  data() {
    return {
      source: testData
    }
  },
  components: {
    ModLoader
  },
  computed: {
    theme() {
      let newTheme = themeFactory.generate(this.source.theme)
      if (this.storedTheme === newTheme) return this.storedTheme
      if (this.storedTheme) this.storedTheme.detach()
      this.storedTheme = newTheme
      this.storedTheme.attach()
      return this.storedTheme
    }
  }
}
</script>
