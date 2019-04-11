<template>
  <div class="account-page" v-loading="loading">
    <div class="account-page-header">
      <common-header class="container"></common-header>
    </div>
    <div class="account-page-main-content">
      <router-view v-if="!loading" class="account-page-main-content-center" id="account-page" />
    </div>
    <div class="account-page-footer">
      <common-footer class="container"></common-footer>
    </div>
    <div @click.stop v-if="isShowLoginDialog">
      <login-dialog :show="isShowLoginDialog" @close="handleLoginDialogClose" :forceLogin="true"></login-dialog>
    </div>
  </div>

</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import router from './account.router'
import userModule from '@/store/user'
import accountModule from '@/store/account'
import ElementUI from 'element-ui'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import { mapActions, mapGetters } from 'vuex'
import LoginDialog from '@/components/common/LoginDialog'
import CommonHeader from '@/components/common/CommonHeader'
import CommonFooter from '@/components/common/CommonFooter'

Vue.use(Vuex)
Vue.use(VueI18n)

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
    account: accountModule
  }
})

router.beforeEach(async (to, from, next) => {
  if (to.name === 'OrderConfirm' && to.query.token) {
    let { token, ..._query } = to.query
    Cookies.set('token', token)
    return next({ name: 'OrderConfirm', query: _query })
  }
  if (Cookies.get('token')) {
    return next()
  }
  store.dispatch('user/toggleLoginDialog', true)
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
    await this.loadAccountPresets()
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
    async loadAccountPresets() {
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
  margin: 0;
}

.account-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  &-header {
    height: 60px;
    border-bottom: 1px solid #e6e6e6;
  }
  &-main-content {
    flex: 1;
    width: 100%;
    background: #f5f5f5;
  }

  &-footer {
    background-color: #f5f5f5;
  }

  .container {
    width: 1200px;
    margin: 0 auto;
  }
}
</style>

