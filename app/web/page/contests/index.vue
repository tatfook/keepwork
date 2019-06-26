<template>
  <div class="contests-page">
    <div class="contests-page-header">
      <common-header class="contests-page-container"></common-header>
    </div>
    <div class="contests-page-main">
      <router-view></router-view>
    </div>
    <div @click.stop v-if="isShowLoginDialog">
      <login-dialog :show="isShowLoginDialog" @close="handleLoginDialogClose"></login-dialog>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Vuex, { mapActions, mapGetters } from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './contests.router'
import VueI18n from 'vue-i18n'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import userModule from '@/store/user'
import CommonHeader from '@/components/common/CommonHeader'
import messageModule from '@/store/message'
import pblModule from '@/store/pbl'
import { socket, socketMixin } from '@/socket'
import LoginDialog from '@/components/common/LoginDialog'
import ba from 'vue-ba'

Vue.use(ba, process.env.BAIDU_SITE_ID)
Vue.use(Vuex)
Vue.use(VueI18n)
Vue.use(socket)

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
    message: messageModule,
    pbl: pblModule
  }
})

export default {
  name: 'ContestsPage',
  router,
  i18n,
  store,
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      isShowLoginDialog: 'pbl/isShowLoginDialog'
    })
  },
  components: {
    CommonHeader,
    LoginDialog
  },
  async mounted() {
    await this.loadUerInfo()
  },
  methods: {
    ...mapActions({
      toggleLoginDialog: 'pbl/toggleLoginDialog',
      getUserProfile: 'user/getProfile'
    }),
    handleLoginDialogClose() {
      this.toggleLoginDialog(false)
    },
    async loadUerInfo() {
      await this.getUserProfile({ force: false, useCache: false }).catch(err =>
        console.error(err)
      )
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
html,
body {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
}
.contests-page {
  &-header {
    height: 60px;
    background: #fff;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-weight: normal;
  }
  &-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }
}
</style>

