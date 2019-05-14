<template>
    <div class="message-page" v-loading="loading">
    <div class="messsage-page-header">
      <common-header class="container"></common-header>
    </div>
    <div class="message-page-main-content">
      <router-view class="message-page-main-content-center" id="message-page" />
    </div>
    <div class="message-page-footer">
      <common-footer class="container"></common-footer>
    </div>
    <!-- <div @click.stop v-if="isShowLoginDialog">
      <login-dialog :show="isShowLoginDialog" @close="handleLoginDialogClose" :forceLogin="true"></login-dialog>
    </div> -->
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
import userModule from '@/store/user'
import ElementUI from 'element-ui'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import { mapActions, mapGetters } from 'vuex'
import LoginDialog from '@/components/common/LoginDialog'
import CommonHeader from '@/components/common/CommonHeader'
import CommonFooter from '@/components/common/CommonFooter'

Vue.use(Vuex)
Vue.use(VueLazyload)
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
    user: userModule
  }
})

export default {
  router,
  store,
  i18n,
  components: {
    CommonHeader,
    CommonFooter,
    LoginDialog
 },
  data() {
    return {
      loading: false
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