<template>
  <div class="profile-page" v-loading="loading">
    <div class="profile-page-header">
      <common-header class="container"></common-header>
    </div>
    <router-view v-if="!loading" class="profile-page-main-content" id="profile-page" />
    <div class="profile-page-footer">
      <common-footer class="container"></common-footer>
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
import 'element-ui/lib/theme-chalk/display.css'
import VueClipboard from 'vue-clipboard2'
import router from './profile.router'
import userModule from '@/store/user'
import pblModule from '@/store/pbl'
import lessonModule from '@/store/lesson'
import profileModule from '@/store/profile'
import ElementUI from 'element-ui'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import { mapActions, mapGetters } from 'vuex'
import LoginDialog from '@/components/common/LoginDialog'
import CommonHeader from '@/components/common/CommonHeader'
import CommonFooter from '@/components/common/CommonFooter'
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
    profile: profileModule,
    lesson: lessonModule
  }
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
    await this.loadProfilePresets()
  },
  components: {
    LoginDialog,
    CommonHeader,
    CommonFooter
  },
  computed: {
    ...mapGetters({
      isShowLoginDialog: 'user/isShowLoginDialog'
    }),
    nowPagename() {
      return this.$route.name
    }
  },
  methods: {
    ...mapActions({
      toggleLoginDialog: 'user/toggleLoginDialog',
      getUserProfile: 'user/getProfile'
    }),
    handleLoginDialogClose() {
      this.toggleLoginDialog(false)
    },
    async loadProfilePresets() {
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
.profile-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  &-header {
    height: 60px;
    border-bottom: 1px solid #e6e6e6;
  }
  &-main-content {
    flex: 1;
  }
  &-footer {
    background-color: #f5f5f5;
  }
  .container {
    width: 1200px;
    max-width: 100%;
    margin: 0 auto;
  }
}
</style>
