<template>
  <div class="study-page" v-loading="loading">
    <div class="study-page-header">
      <common-header class="container"></common-header>
    </div>
    <study-header></study-header>
    <router-view class="study-page-main-content"></router-view>
    <perfect-common-footer></perfect-common-footer>
    <div @click.stop v-if="isShowLoginDialog">
      <login-dialog :show="isShowLoginDialog" @close="handleLoginDialogClose"></login-dialog>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './study.router'
import appModule from '@/store/app'
import userModule from '@/store/user'
import orgModule from '@/store/org'
import lessonModule from '@/store/lesson'
import pblModule from '@/store/pbl'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import CommonHeader from '@/components/common/CommonHeader'
import PerfectCommonFooter from '@/components/common/PerfectCommonFooter'
import LoginDialog from '@/components/common/LoginDialog'
import '@/components/common/thirdAuth'
import StudyHeader from '@/components/study/StudyHeader'
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'

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
    app: appModule,
    user: userModule,
    lesson: lessonModule,
    org: orgModule,
    pbl: pblModule
  }
})
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (!Cookies.get('token')) {
      store.dispatch(
        'lesson/toggleLoginDialog',
        { show: true, to },
        { root: true }
      )
      if (!from.name) {
        return next({ name: 'StudyHome' })
      }
      return next(false)
    }
  }
  next()
})

export default {
  name: 'StudyPage',
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
  computed: {
    ...mapGetters({
      isShowLoginDialog: 'pbl/isShowLoginDialog'
    })
  },
  components: {
    CommonHeader,
    StudyHeader,
    PerfectCommonFooter,
    LoginDialog
  },
  methods: {
    ...mapActions({
      pblToggleLoginDialog: 'pbl/toggleLoginDialog',
      getUserProfile: 'user/getProfile'
    }),
    async loadPblPresets() {
      await this.getUserProfile({ force: false, useCache: false }).catch(err =>
        console.error(err)
      )
      this.loading = false
    },
    handleLoginDialogClose() {
      this.pblToggleLoginDialog(false)
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
.study-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
  &-header {
    height: 60px;
    border-bottom: 1px solid #e6e6e6;
    background: #fff;
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
  }
  &-main-content {
    flex: 1;
    background: #f8f8f8;
    min-height: auto;
  }
}
</style>


