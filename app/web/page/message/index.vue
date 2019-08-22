<template>
  <div class="message-page" v-loading="loading">
    <div class="messsage-page-header">
      <common-header class="container"></common-header>
    </div>
    <div class="message-page-main-content">
      <router-view class="message-page-main-content-center" id="message-page" />
    </div>
    <div class="message-page-footer">
      <perfect-common-footer></perfect-common-footer>
    </div>
    <real-name />
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import VueLazyload from 'vue-lazyload'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import router from './message.router'
import skydriveModule from '@/store/skydrive'
import userModule from '@/store/user'
import messageModule from '@/store/message'
import ElementUI from 'element-ui'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import { mapActions, mapGetters } from 'vuex'
import LoginDialog from '@/components/common/LoginDialog'
import CommonHeader from '@/components/common/CommonHeader'
import PerfectCommonFooter from '@/components/common/PerfectCommonFooter'
import { socket, socketMixin } from '@/socket'
import ba from 'vue-ba'
import RealName from '@/components/common/RealName'

Vue.use(ba, process.env.BAIDU_SITE_ID)
Vue.use(Vuex)
Vue.use(VueLazyload)
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
    skydrive: skydriveModule,
    user: userModule,
    message: messageModule
  }
})

export default {
  router,
  store,
  i18n,
  components: {
    RealName,
    CommonHeader,
    PerfectCommonFooter,
    LoginDialog
  },
  mixins: [socketMixin],
  data() {
    return {
      loading: false
    }
  },
  watch: {
    socketMessage(value) {
      store.dispatch('message/refreshMessagesBox')
    }
  },
  computed: {
    ...mapGetters({
      isLogined: 'user/isLogined'
    })
  },
  async created() {
    if (!this.isLogined) {
      return (window.location.href = window.location.origin)
    }
    await this.loadAccountPresets()
  },
  methods: {
    ...mapActions({
      toggleLoginDialog: 'user/toggleLoginDialog',
      getUserProfile: 'user/getProfile'
    }),
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

.message-page {
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
