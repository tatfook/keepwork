<template>
  <iframe
    v-if="isIframePattern"
    id="combo"
    :src="iframeUrl"
    frameborder="0"
    width="100%"
    height="100%"
  ></iframe>
  <div v-else>
    <mod-loader
      v-for="mod in modList"
      :mod="mod"
      :theme="theme"
      :key="mod.key"
    ></mod-loader>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ModLoader from '@/components/viewer/ModLoader'
import themeFactory from '@/lib/theme/theme.factory'
import ThemeHelper from '@/lib/theme'
import _ from 'lodash'
export default {
  name: 'ComboBox',
  components: {
    ModLoader
  },
  props: {
    pattern: {
      type: String,
      default: ''
    },
    projectName: {
      type: String,
    },
    filePath: {
      type: String,
    },
    routes: {
      type: Object,
      default() {
        return {}
      }
    },
    routeKey: {
      type: String,
      default: 'command'
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
      routeProjectName: '',
      routeFilePath: ''
    }
  },
  watch: {
    async $route(to) {
      if (!_.isEmpty(this.routes)) {
        const { params: { [this.routeKey]: command } } = to
        const { projectName, filePath } = this.routes[command]
        this.routeProjectName = projectName
        this.routeFilePath = filePath
        await this.getContent({
          projectName: this._projectName,
          fileName: this._fileName
        })
      }
    }
  },
  async mounted() {
    if (this.isRoutesPattern) {
      const { params: { [this.routeKey]: command }} = this.$route
      const { projectName, filePath } = this.routes[command]
      this.routeProjectName = projectName
      this.routeFilePath = filePath
    }
    await this.getContent({
        projectName: this._projectName,
        fileName: this._fileName
      }).catch(e => console.error(e))
  },
  methods: {
    ...mapActions({
      getContent: 'combo/getContent',
      getWebsiteConfig: 'combo/getWebsiteConfig'
    })
  },
  computed: {
    ...mapGetters({
      getModListByFullPath: 'combo/getModListByFullPath',
      websiteContents: 'combo/websiteContents',
      websiteConfigs: 'combo/websiteConfigs'
    }),
    isRoutesPattern() {
      return !_.isEmpty(this.routes)
    },
    isPropsPattern() {
      return !!(this.projectName && this.filePath)
    },
    isIframePattern() {
      return this.pattern === 'iframe'
    },
    fullPath() {
      return `${this._projectName}/${this._fileName}`
    },
    _projectName() {
      return this.isRoutesPattern ? this.routeProjectName : this.projectName
    },
    _filePath() {
      return this.isRoutesPattern ? this.routeFilePath : this.filePath
    },
    _fileName() {
      return /.md$/.test(this._filePath) ? this._filePath : `${this._filePath}.md`
    },
    iframeUrl() {
      return `/bx?projectName=${this._projectName}&fileName=${
        this._fileName
      }`
    },
    contents() {
      return this.getModListByFullPath(this.fullPath)
    },
    modList() {
      return _.get(this.contents, 'main', [])
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
