<template>
  <div class="org-page" v-loading="loading">
    <!-- <div class="org-page-header">
      <org-header class="container"></org-header>
    </div> -->
    <router-view class="org-page-main-content" id="org-page" />
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import VueAnalytics from 'vue-analytics'
import 'element-ui/lib/theme-chalk/index.css'
import router from './org.router'
import userModule from '@/store/user'
import orgModule from '@/store/org'
import ElementUI from 'element-ui'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import OrgHeader from '@/components/org/common/OrgHeader'

Vue.use(Vuex)
Vue.use(VueI18n)
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
    org: orgModule
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
    await this.loadOrgPresets()
  },
  components: {
    OrgHeader
  },
  methods: {
    async loadOrgPresets() {
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
.org-page {
  width: 100%;
  height: 100%;
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
</style>
