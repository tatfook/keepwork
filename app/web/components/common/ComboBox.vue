<template>

</template>
<script>
import { showRawForGuest as gitlabShowRawForGuest } from '@/api/gitlab'
import ModLoader from '@/components/viewer/ModLoader'
import themeFactory from '@/lib/theme/theme.factory'
import ThemeHelper from '@/lib/theme'
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
export default {
  name: 'ComboBox',
  props: {
    prefixUrl: {
      type: String,
      default: 'https://api.keepwork.com/git/v0'
    },
    projectName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    filterLayout: {
      type: Array,
      default() {
        return []
      }
    },
    filterMod: {
      type: Array,
      default() {
        return []
      }
    },
    markdown: {
      type: String
    },
    modList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  async mounted() {
    console.warn('📦: combo box')
  },
  methods: {
    async getWebsiteInfo() {
      await gitlabShowRawForGuest(
        this.prefixUrl,
        this.projectName,
        this.filePath
      )
    }
  },
  computed: {
    ...mapGetters({
      modList: 'modList',
      headerModList: 'headerModList',
      footerModList: 'footerModList',
      sidebarModList: 'sidebarModList',
      mainModList: 'mainModList'
    }),
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

