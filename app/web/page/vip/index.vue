<template>
  <div class="vip-page" v-loading="isLoading">
    <div class="vip-page-header">
      <common-header class="container"></common-header>
    </div>
    <lesson-vip class="vip-page-main"></lesson-vip>
    <perfect-common-footer class="vip-page-footer"></perfect-common-footer>
    <div @click.stop v-if="isShowLoginDialog">
      <login-dialog :show="isShowLoginDialog" @close="handleLoginDialogClose"></login-dialog>
    </div>
    <real-name />
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import 'element-ui/lib/theme-chalk/index.css'
import vipModule from '@/store/vip'
import userModule from '@/store/user'
import skydriveModule from '@/store/skydrive'
import ElementUI from 'element-ui'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import { mapActions, mapGetters } from 'vuex'
import CommonHeader from '@/components/common/CommonHeader'
import PerfectCommonFooter from '@/components/common/PerfectCommonFooter'
import LoginDialog from '@/components/common/LoginDialog'
import LessonVip from '@/components/vip/LessonVip'
import ba from 'vue-ba'
import RealName from '@/components/common/RealName'

Vue.use(ba, process.env.BAIDU_SITE_ID)
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
    skydrive: skydriveModule,
    vip: vipModule,
    user: userModule
  }
})

export default {
  name: 'Vip',
  store,
  i18n,
  components: {
    RealName,
    CommonHeader,
    PerfectCommonFooter,
    LoginDialog,
    LessonVip
  },
  data() {
    return {
      isLoading: true
    }
  },
  computed: {
    ...mapGetters({
      isShowLoginDialog: 'vip/isShowLoginDialog'
    })
  },
  async created() {
    await this.loadVipPresets()
  },
  methods: {
    ...mapActions({
      getUserProfile: 'user/getProfile',
      toggleLoginDialog: 'vip/toggleLoginDialog'
    }),
    async loadVipPresets() {
      await this.getUserProfile({ force: false, useCache: false }).catch(
        err => {
          console.error(err)
        }
      )
      this.isLoading = false
    },
    handleLoginDialogClose() {
      this.toggleLoginDialog(false)
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
.vip-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  &-header {
    height: 60px;
    border-bottom: 1px solid #e6e6e6;
  }
  &-main {
    flex: 1;
  }
  &-footer {
    text-align: center;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
</style>
