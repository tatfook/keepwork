<template>
  <div class="combo-box-view-container">
    <div v-show="true">{{comoboWebsiteContents}}</div>
    <mod-loader v-for="mod in modList" :mod="mod" :theme="theme" :key="mod.key"></mod-loader>
  </div>
</template>
<script>
import ModLoader from '@/components/viewer/ModLoader'
import themeFactory from '@/lib/theme/theme.factory'
import ThemeHelper from '@/lib/theme'
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'ComboBoxView',
  components: {
    ModLoader
  },
  async mounted() {
    const {
      query: { projectName, fileName }
    } = this.$route
    console.warn('fullPath:', this.fullPath)
    console.warn(this.comoboWebsiteContents)
    console.warn(this.comoboWebsiteContents["official/paracraft/offline-courses.md"])
    console.warn(this.websiteConfigs)
  },
  computed: {
    ...mapGetters({
      getModListByFullPath: 'combo/getModListByFullPath',
      comoboWebsiteContents: 'combo/websiteContents',
      websiteConfigs: 'combo/websiteConfigs'
    }),
    fullPath() {
      const {
        query: { projectName, fileName }
      } = this.$route
      return `${projectName}/${fileName}`
    },
    content() {
      return this.getModListByFullPath(this.fullPath)
    },
    modList() {
      return _.get(this.content, 'main')
    }
  },
  theme() {
    let newTheme = themeFactory.generate(ThemeHelper.defaultTheme)
    if (this.storedTheme === newTheme) return this.storedTheme
    if (this.storedTheme) this.storedTheme.sheet.detach()
    this.storedTheme = newTheme
    this.storedTheme.sheet.attach()
    return this.storedTheme
  }
}
</script>

<style lang="scss">
</style>

