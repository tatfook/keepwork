<template>
  <iframe
    v-if="isIframePattern"
    :id="id"
    :src="iframeUrl"
    width="100%"
    height="100%"
    frameborder="0"
    @load="reset"
    scrolling="no"
  ></iframe>
  <div
    v-else-if="isHtmlPattern"
    v-html="html"
    :class="customClass"
  >
  </div>
  <div
    class="combo-box-container"
    v-else
  >
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
import { locale } from '@/lib/utils/i18n'
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
    autoWidth: {
      type: Boolean,
      default: false
    },
    enableScript: {
      type: Boolean,
      default: true
    },
    id: {
      type: String,
      default: 'combo'
    },
    customClass: {
      type: String,
      default: 'combo-html'
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
      routeFilePath: '',
      timer: null
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
    clearTimeout(this.timer)
    if (this.isRoutesPattern) {
      const { params: { [this.routeKey]: command } } = this.$route
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
    }),
    reset() {
      // FIXME: firame.height bug
      this.$nextTick(() => {
        this.timer = setTimeout(() => {
          this.resetHeight()
          this.resetLink()
        }, 3000)
      })
    },
    resetHeight() {
      let ele = document.getElementById(this.id)
      let iframe = ele.contentDocument ? ele.contentDocument : ele.contentWindow.document
      let html = iframe.documentElement
      let body = iframe.body
      let height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      ele.height = 'auto'
      ele.height = height + 300
    },
    resetLink() {
      let iframe = document.getElementById(this.id)
      let links = iframe.contentWindow.document.querySelectorAll('a')
      links.forEach(a => a.setAttribute('target', '_blank'))
    }
  },
  computed: {
    ...mapGetters({
      getContentsByFullPath: 'combo/getContentsByFullPath',
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
    isHtmlPattern() {
      return this.pattern === 'html'
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
      if (this.isEn) {
        return /.md$/.test(this._filePath) ? `${this._filePath}_EN` : `${this._filePath}_EN.md`
      }
      return /.md$/.test(this._filePath) ? this._filePath : `${this._filePath}.md`
    },
    iframeUrl() {
      return `/bx?projectName=${this._projectName}&fileName=${
        this._fileName
        }`
    },
    contents() {
      return this.getContentsByFullPath(this.fullPath)
    },
    originalModList() {
      return _.get(this.contents, 'modList', [])
    },
    modList() {
      return this.originalModList.map(i => ({ ...i, enableScript: this.enableScript }))
    },
    html() {
      return _.get(this.content, 'content', '')
    },
    isEn() {
      return locale === 'en-US'
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
.combo-box-container {
  .el-row {
    width: auto;
    max-width: 1080px;
  }
}
</style>
