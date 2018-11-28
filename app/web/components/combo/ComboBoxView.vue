<template>
  <div class="combo-box-view-container">
    <mod-loader
      v-for="mod in modList"
      :mod="mod"
      :theme="theme"
      :key="mod.key"
    ></mod-loader>
  </div>
</template>
<script>
import ModLoader from "@/components/viewer/ModLoader"
import themeFactory from "@/lib/theme/theme.factory"
import ThemeHelper from "@/lib/theme"
import { mapGetters, mapActions } from "vuex"
import _ from "lodash"
export default {
  name: "ComboBoxView",
  components: {
    ModLoader
  },
  computed: {
    ...mapGetters({
      getContentsByFullPath: "combo/getContentsByFullPath",
      websiteContents: "combo/websiteContents",
      websiteConfigs: "combo/websiteConfigs"
    }),
    fullPath() {
      const {
        query: { projectName, fileName }
      } = this.$route
      return `${projectName}/${fileName}`
    },
    contents() {
      return this.getContentsByFullPath(this.fullPath)
    },
    modList() {
      return _.get(this.contents, 'modList', [])
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
}
</script>

<style lang="scss">
</style>

