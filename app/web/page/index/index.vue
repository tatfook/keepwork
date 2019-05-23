<template>
  <el-container id='app' class="index-page-container">
    <el-header height='61px' class="index-page-header" >
      <common-header class="container"></common-header>
    </el-header>
    <el-main class="index-page-main">
      <router-view :pageLoading="pageLoading" v-if="presetLoaded" />
    </el-main>
    <el-footer class="home-page-footer">
      <perfect-common-footer></perfect-common-footer>
    </el-footer>
    <div @click.stop v-if="isShowLoginDialog">
      <login-dialog :show="isShowLoginDialog" @close="handleLoginDialogClose"></login-dialog>
    </div>
  </el-container>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import VueLazyload from 'vue-lazyload'
import VueAnalytics from 'vue-analytics'
import { sync } from 'vuex-router-sync'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import router from './viewer.router'
import VueI18n from 'vue-i18n'
import userModule from '@/store/user'
import pblModule from '@/store/pbl'
import lessonModule from '@/store/lesson'
import VueClipboard from 'vue-clipboard2'
import ElementUI, { Progress } from 'element-ui'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import 'element-ui/lib/theme-chalk/index.css'
import '@/components/common/thirdAuth'
import CommonHeader from '@/components/common/CommonHeader'
import CommonFooter from '@/components/common/CommonFooter'
import ToolHeader from '@/components/common/ToolHeader'
import PerfectCommonFooter from '@/components/common/PerfectCommonFooter'
import LoginDialog from '@/components/common/LoginDialog'
// message push
import messageModule from '@/store/message'
import { socket, socketMixin } from '@/socket'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(VueClipboard)
// use socket
Vue.use(socket)

Vue.use(VueI18n)
Vue.use(VueLazyload)
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
    user: userModule,
    pbl: pblModule,
    lesson: lessonModule,
    message: messageModule
  }
})

sync(store, router)

export default {
  name: 'App',
  router,
  store,
  i18n,
  mixins: [socketMixin],
  data() {
    return {
      pageLoading: false,
      presetLoaded: false
    }
  },
  watch: {
    socketMessage(value) {
      store.dispatch('message/refreshMessagesBox')
    }
  },
  async created() {
    await this.loadEditorPresets()
    this.presetLoaded = true
  },
  components: {
    CommonHeader,
    CommonFooter,
    ToolHeader,
    PerfectCommonFooter,
    LoginDialog
  },
  methods: {
    ...mapActions({
      userGetProfile: 'user/getProfile',
      gitlabGetRepositoryTree: 'gitlab/getRepositoryTree',
      pblToggleLoginDialog: 'pbl/toggleLoginDialog'
    }),
    handleLoginDialogClose() {
      this.pblToggleLoginDialog(false)
    },
    async loadEditorPresets() {
      await this.userGetProfile({ useCache: false }).catch(err => {
        console.error(err)
      })
    },
  },
  computed: {
    ...mapGetters({
      username: 'user/username',
      userSiteLayoutConfigBySitePath: 'user/siteLayoutConfigBySitePath',
      gitlabChildrenByPath: 'gitlab/childrenByPath',
      isShowLoginDialog: 'pbl/isShowLoginDialog'
    }),
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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
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
.el-footer.home-page-footer {
  padding: 0;
}
.index-page-container {
  min-height: 100%;
}
.el-main.index-page-main {
  font-family: 'SF Pro SC', 'SF Pro Display', 'SF Pro Icons', 'PingFang SC',
    'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  padding: 0;
  background: #f6f7f8;
}
[mod-container] {
  overflow: hidden;
}
@media print {
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
