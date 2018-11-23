<template>
  <div class="combo-box">
    <mod-loader :mod="mod" v-for="mod in modList" :key="mod.key" :theme="theme"></mod-loader>
  </div>
</template>
<script>
import { showRawForGuest as gitlabShowRawForGuest } from '@/api/gitlab'
import ModLoader from '@/components/viewer/ModLoader'
import themeFactory from '@/lib/theme/theme.factory'
import ThemeHelper from '@/lib/theme'
import Parser from '@/lib/mod/parser'
import _ from 'lodash'
export default {
  name: 'ComboBox',
  components: {
    ModLoader
  },
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
    showContent: {
      type: Array,
      default() {
        return []
      },
      validator(arr) {
        if (arr.length === 0) return true
        const TAGS = ['footer', 'header', 'sidebar']
        arr = [...new Set(arr)]
        return arr.every(item => TAGS.includes(item))
      }
    },
    filterMod: {
      // 传入过滤的mod
      type: Array,
      default() {
        return []
      }
    },
    markdown: {
      type: String
    }
    // modList: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // }
  },
  data() {
    return {
      websiteConfig: {},
      mainContent: '',
      headerContent: '',
      footerContent: '',
      sidebarContent: ''
    }
  },
  async mounted() {
    console.warn(
      `📦: combo box, projectName: ${this.projectName}, fileName: ${
        this.fileName
      } `
    )
    await this.getWebsiteConfig()
    await this.getMainContent()
  },
  methods: {
    async getWebsiteConfig() {
      const layoutConfigPath = '_config/layout.json'
      const websiteConfig = await this.gitlabFetch(
        this.projectName,
        `${this.projectName}/${layoutConfigPath}`
      )
      this.websiteConfig = websiteConfig
    },
    async getMainContent() {
      let content = await this.getContentByFilePath(this.fullFilePath).catch(
        e => console.warn(e)
      )
      this.mainContent = content
    },
    async getContentByFilePath(filePath) {
      return this.gitlabFetch(this.projectName, filePath)
    },
    markdownToModList(content) {
      return Parser.buildBlockList(content)
    },
    async gitlabFetch(projectName, filePath) {
      return gitlabShowRawForGuest(this.prefixUrl, projectName, filePath)
    }
  },
  computed: {
    layoutConfig() {
      return _.get(this.websiteConfig, 'layoutConfig', {})
    },
    modList() {
      return Parser.buildBlockList(this.mainContent)
    },
    hasShowContent() {
      return this.showContent.length > 0
    },
    pages() {
      return _.get(this.websiteConfig, 'pages', {})
    },
    fullFilePath() {
      return `${this.projectName}/${this.fileName}`
    },
    fileName() {
      return /.md$/.test(this.filePath) ? this.filePath : `${this.filePath}.md`
    },
    layout() {
      let layoutId = _.get(this.pages, [this.fileName, 'layout'], '')
      if (!layoutId) return {}
      return _.find(
        _.get(this.layoutConfig, ['layouts'], []),
        item => item.id === layoutId
      )
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

