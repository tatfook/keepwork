<template>
  <div class="org-page" v-loading="loading">
    <router-view class="org-page-main-content" id="org-page" />
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex, { mapGetters, mapActions } from 'vuex'
import VueI18n from 'vue-i18n'
import VueAnalytics from 'vue-analytics'
import 'element-ui/lib/theme-chalk/index.css'
import createPersistedState from '@/store/createPersistedState'
import router from './org.router'
import appModule from '@/store/app'
import userModule from '@/store/user'
import orgModule from '@/store/org'
import ElementUI from 'element-ui'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'

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
    app: appModule,
    user: userModule,
    org: orgModule
  },
  plugins: [
    createPersistedState({
      paths: ['org.currentOrg', 'org.userinfo']
    })
  ]
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
  computed: {
    ...mapGetters({
      userIsLogined: 'user/isLogined',
      currentOrg: 'org/currentOrg'
    }),
    routeLoginUrl() {
      return _.get(this.$route, 'params.orgLoginUrl')
    },
    isUserLoginForOrg() {
      let currentOrgloginUrl = _.get(this.currentOrg, 'loginUrl')
      return (
        this.userIsLogined &&
        currentOrgloginUrl &&
        currentOrgloginUrl === this.routeLoginUrl
      )
    },
    orgId() {
      return _.get(this.currentOrg, 'id')
    }
  },
  methods: {
    ...mapActions({
      getOrgUserCountsByGraphql: 'org/getOrgUserCountsByGraphql',
      getUserProfile: 'user/getProfile'
    }),
    async loadOrgPresets() {
      await this.getUserProfile({ force: false, useCache: false }).catch(err =>
        console.error(err)
      )
      this.orgId &&
        (await this.getOrgUserCountsByGraphql({
          orgId: this.orgId
        }))
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
  background: #f5f5f5;
}
</style>
