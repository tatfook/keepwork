<template>
  <div class="pbl-page" v-loading="loading">
    <div class="pbl-page-header">
      <common-header class="container"></common-header>
    </div>
    <router-view class="pbl-page-main-content" id="pbl-page" />
    <div class="pbl-page-footer">
      <perfect-common-footer></perfect-common-footer>
    </div>
    <div @click.stop v-if="isShowLoginDialog">
      <login-dialog :show="isShowLoginDialog" @close="handleLoginDialogClose"></login-dialog>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import VueAnalytics from 'vue-analytics'
import 'element-ui/lib/theme-chalk/index.css'
import VueClipboard from 'vue-clipboard2'
import router from './pbl.router'
import userModule from '@/store/user'
import pblModule from '@/store/pbl'
import gitlabModule from '@/store/gitlab'
import Cookies from 'js-cookie'
import ElementUI from 'element-ui'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import { mapActions, mapGetters } from 'vuex'
import LoginDialog from '@/components/common/LoginDialog'
import CommonHeader from '@/components/common/CommonHeader'
import PerfectCommonFooter from '@/components/common/PerfectCommonFooter'
import '@/components/common/thirdAuth'

Vue.use(Vuex)
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
    user: userModule,
    pbl: pblModule,
    gitlab: gitlabModule
  }
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (!Cookies.get('token')) {
      return window.location.replace('/')
    }
  }
  next()
})

export default {
  router,
  store,
  i18n,
  data() {
    return {
      loading: true
    }
  },
  async created() {
    await this.loadPblPresets()
  },
  components: {
    LoginDialog,
    CommonHeader,
    PerfectCommonFooter
  },
  computed: {
    ...mapGetters({
      isShowLoginDialog: 'pbl/isShowLoginDialog'
    }),
    nowPagename() {
      return this.$route.name
    }
  },
  methods: {
    ...mapActions({
      toggleLoginDialog: 'pbl/toggleLoginDialog',
      getUserProfile: 'user/getProfile'
    }),
    handleLoginDialogClose() {
      this.toggleLoginDialog(false)
    },
    async loadPblPresets() {
      await this.getUserProfile({ force: false, useCache: false }).catch(err =>
        console.error(err)
      )
      this.loading = false
    }
  }
}
</script>

<style lang="scss">
html,
body {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
}
.pbl-page {
  min-height: 100%;
  display: table;
  width: 100%;
  border-collapse: collapse;
  &-header {
    display: table-row;
    height: 60px;
    border-bottom: 1px solid #e6e6e6;
    .el-menu.el-menu--horizontal {
      border: none;
    }
    .el-menu-item {
      overflow: hidden;
    }
  }
  &-main-content {
    display: table-row;
    height: 100%;
  }
  &-footer {
    background-color: #f5f5f5;
    display: table-row;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
</style>
