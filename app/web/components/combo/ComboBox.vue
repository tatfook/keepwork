<template>
  <iframe :src="iframeUrl" frameborder="0" width="100%" height="100%"></iframe>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ComboBox',
  props: {
    projectName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    filterContentToShow: {
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
      type: Array,
      default() {
        return []
      }
    }
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
    await this.getWebsiteConfig({ projectName: this.projectName })
    await this.getContent({
      projectName: this.projectName,
      fileName: this.fileName
    }).catch(e => console.error(e))
    console.warn("mounted------>")
  },
  methods: {
    ...mapActions({
      getContent: 'combo/getContent',
      getWebsiteConfig: 'combo/getWebsiteConfig'
    })
  },
  computed: {
    fullFilePath() {
      return `${this.projectName}/${this.fileName}`
    },
    fileName() {
      return /.md$/.test(this.filePath) ? this.filePath : `${this.filePath}.md`
    },
    iframeUrl() {
      return `/combo?projectName=${this.projectName}&fileName=${
        this.fileName
      }, `
    },
    // layout() {
    //   let layoutId = _.get(this.pages, [this.fileName, 'layout'], '')
    //   if (!layoutId) return {}
    //   return _.find(
    //     _.get(this.layoutConfig, ['layouts'], []),
    //     item => item.id === layoutId
    //   )
    // },
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
