<template>
  <el-container id='app' class="index-page-container">
    <el-header height='61px' class="index-page-header" v-if="!isSystemCompShow.isSystemHeaderHide">
      <common-header class="container"></common-header>
    </el-header>
    <el-main class="index-page-main">
      <tool-header class="container" v-if="!isSystemCompShow.isSystemHeaderHide && !isHomePage"></tool-header>
      <router-view :pageLoading="pageLoading" v-if="presetLoaded"></router-view>
    </el-main>
    <el-aside></el-aside>
    <el-footer height='auto' class="index-page-footer" v-if="!isSystemCompShow.isSystemFooterHide && !isHomePage">
      <common-footer class="container"></common-footer>
    </el-footer>
    <el-footer class="home-page-footer" v-if='isHomePage'>
      <perfect-common-footer></perfect-common-footer>
    </el-footer>
  </el-container>
</template>

<script>

import Vue from 'vue'
import Vuex from 'vuex'
import VueAnalytics from 'vue-analytics'
import { sync } from 'vuex-router-sync'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import router from './viewer.router'
import VueI18n from 'vue-i18n'
import VueClipboard from 'vue-clipboard2'
import appModule from '@/store/app'
import userModule from '@/store/user'
import pblModule from '@/store/pbl'
import gitlabModule from '@/store/gitlab'
import ElementUI from 'element-ui'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import 'element-ui/lib/theme-chalk/index.css'
import '@/components/common/thirdAuth'
import CommonHeader from '../../components/common/CommonHeader'
import CommonFooter from '../../components/common/CommonFooter'
import ToolHeader from '../../components/common/ToolHeader'
import PerfectCommonFooter from '../../components/common/PerfectCommonFooter'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(ElementUI.Popover)

Vue.use(VueI18n)
Vue.use(VueClipboard)
Vue.use(VueAnalytics, {
  id: process.env.GOOGLE_ANALYTICS_UA,
  router,
  batch: {
    enabled: true, // enable/disable
    amount: 2, // amount of events fired
    delay: 500 // delay in milliseconds
  }
})

const i18n = new VueI18n({
  locale,
  messages: i18nMessages
})

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

const store = new Vuex.Store({
  modules: {
    app: appModule,
    user: userModule,
    gitlab: gitlabModule,
    pbl: pblModule
  }
})

sync(store, router)

export default {
  name: 'App',
  router,
  store,
  i18n,
  data() {
    return {
      pageLoading: false,
      presetLoaded: false
    }
  },
  async created() {
    await this.loadEditorPresets()
    this.presetLoaded = true
    await this.updateActivePage()
  },
  watch: {
    $route: 'updateActivePage'
  },
  components: {
    CommonHeader,
    CommonFooter,
    ToolHeader,
    PerfectCommonFooter
  },
  methods: {
    ...mapActions({
      setActivePage: 'setActivePage',
      userGetProfile: 'user/getProfile',
      gitlabGetRepositoryTree: 'gitlab/getRepositoryTree',
      getAllPersonalAndContributedSite: 'user/getAllPersonalAndContributedSite'
    }),
    async getPathWithPagename(path) {
      let originPath = path
      path = path.split('/').filter(x => x).join('/')
      await this.gitlabGetRepositoryTree({
        path,
        editorMode: false
      }).catch(e => console.error(e))
      let children = this.gitlabChildrenByPath(path)
      let indexChild = children.filter(file => file.name === 'index.md')[0]
      let firstFileTypeChild = children.filter(
        file => file.type === 'blob'
      )[0]
      let targetFile = indexChild || firstFileTypeChild
      return targetFile && targetFile.path ? '/' + targetFile.path.replace(/\.md$/, '') : `${originPath}/index`
    },
    async loadEditorPresets() {
      await this.userGetProfile({ useCache: false }).catch(err => {
        console.error(err)
      })
      await this.getAllPersonalAndContributedSite({ useCache: false }).catch(err => {
        console.error(err)
      })
    },
    async updateActivePage() {
      if (!this.presetLoaded) return
      this.pageLoading = true
      let path = this.$router.currentRoute.path
      try {
        let pathItemArr = _.without(_.split(path, '/'), '')
        let isLackPagename = pathItemArr.length === 2
        if (isLackPagename) {
          path = await this.getPathWithPagename(path)
          this.$router.replace({ path })
        }
        await this.setActivePage({ path, editorMode: false })
        this.setDocumentTitle()
      } catch (error) {
        console.log(error)
      }
      this.pageLoading = false
    },
    setDocumentTitle() {
      let { username, sitename, pagename } = this.activePageInfo
      document.title = this.activePageDisplayName || pagename || sitename || username || 'KeepWork'
    }
  },
  computed: {
    ...mapGetters({
      activePageUrl: 'activePageUrl',
      username: 'user/username',
      userSiteLayoutConfigBySitePath: 'user/siteLayoutConfigBySitePath',
      gitlabChildrenByPath: 'gitlab/childrenByPath',
      activePageInfo: 'activePageInfo'
    }),
    isHomePage() {
      return this.$route.name === 'HomePage'
    },
    userSiteLayoutConfig() {
      let sitePath = _.get(this.activePageInfo, 'sitepath', '')
      return this.userSiteLayoutConfigBySitePath(sitePath)
    },
    activePageConfig() {
      let relativePath = _.get(this.activePageInfo, 'relativePath', '')
      return _.get(this.userSiteLayoutConfig, ['pages', relativePath])
    },
    activePageDisplayName() {
      return _.get(this.activePageConfig, 'displayName')
    },
    isSystemCompShow() {
      let userSiteLayoutConfig = this.userSiteLayoutConfig
      return {
        isSystemHeaderHide: _.get(
          userSiteLayoutConfig,
          'layoutConfig.isSystemHeaderHide',
          false
        ),
        isSystemFooterHide: _.get(
          userSiteLayoutConfig,
          'layoutConfig.isSystemFooterHide',
          false
        )
      }
    }
  }
}
</script>

<style>
html,
body {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.index-page-header {
  border-bottom: 1px solid #e6e6e6;
}
.index-page-footer {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
}
.home-page-footer {
  padding: 0;
}
.index-page-container {
  min-height: 100%;
}
.index-page-main {
  padding: 0;
}
.index-page-container .el-main.index-page-main {
  background-color: transparent;
}
[mod-container] {
  overflow: hidden;
}
@media print {
  .index-page-header {
    display: none;
  }
  @media (max-width: 767px) {
    .hidden-xs-only {
      display: none !important;
    }
  }
  @media (min-width: 768px) {
    .hidden-sm-and-up {
      display: none !important;
    }
  }
}
@media (max-width: 768px) {
  .index-page-header {
    padding: 0 15px;
  }
}
</style>
