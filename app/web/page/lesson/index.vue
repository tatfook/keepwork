<template>
  <div class="lesson-page" :class="{'lesson-page-scroll-all': isIE && !isHeaderFooterFixed}" v-loading="loading">
    <div v-if="!isPreview" class="lesson-page-header">
      <common-header class="container" @callback="resetPage"></common-header>
    </div>
    <lesson-header v-if="!isPreview"></lesson-header>
    <router-view v-if="!loading" class="lesson-page-main-content" id="lesson-page" />
    <perfect-common-footer v-if="!isPreview"></perfect-common-footer>
    <div @click.stop v-if="isShowLoginDialog.show">
      <login-dialog :show="isShowLoginDialog.show" :to="isShowLoginDialog.to" @close="handleLoginDialogClose"></login-dialog>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import VueLazyload from 'vue-lazyload'
import VueAnalytics from 'vue-analytics'
import Cookies from 'js-cookie'
import 'element-ui/lib/theme-chalk/index.css'
import router from './lesson.router'
import appModule from '@/store/app'
import skydriveModule from '@/store/skydrive'
import userModule from '@/store/user'
import gitlabModule from '@/store/gitlab'
import lessonModule from '@/store/lesson'
import comboModule from '@/store/combo'
import pblModule from '@/store/pbl'
import createPersistedState from '@/store/createPersistedState'
import ElementUI from 'element-ui'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import Vhistogram from 'v-charts/lib/histogram.common'
import VueClipboard from 'vue-clipboard2'
import { mapActions, mapGetters } from 'vuex'
import CommonHeader from '@/components/common/CommonHeader'
import LessonHeader from '@/components/lesson/common/Header'
import PerfectCommonFooter from '@/components/common/PerfectCommonFooter'
import LoginDialog from '@/components/common/LoginDialog'
import '@/components/common/thirdAuth'
import { broadcast } from 'vuex-iframe-sync'
import { MessageBox } from 'element-ui'
import { lesson } from '@/api'

Vue.use(Vuex)
Vue.use(VueI18n)
Vue.use(VueLazyload)
Vue.use(VueClipboard)
Vue.component(Vhistogram.name, Vhistogram)
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
    skydrive: skydriveModule,
    app: appModule,
    user: userModule,
    gitlab: gitlabModule,
    lesson: lessonModule,
    combo: comboModule,
    pbl: pblModule
  },
  plugins: [
    createPersistedState({
      paths: ['user.webTemplateConfig', 'user.skyDrive']
    }),
    broadcast('combo')
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.auto)) {
    const params = { ...to.params, ...to.query }
    const { packageId, lessonId, key = '', token = '' } = params
    if (token) {
      const res = await lesson.users.verifyToken({ token }).catch(e => console.error(e))
      if (res) {
        Cookies.remove('token')
        Cookies.remove('token', { path: '/' })
        window.localStorage.removeItem('satellizer_token')
        Cookies.set('token', token)
      } else {
        MessageBox({
          message: '无效的token',
          showClose: false,
          confirmButtonText: '前往学习页',
          beforeClose: () => window.location.href = `${window.location.origin}/s`
        })
        next(false)
        return
      }
    }
    if (Number(key)) {
      window.location.href = `${
        window.location.origin
      }/s/lesson/package/${packageId}/lesson/${lessonId}?key=${key}&token=${token}`
    } else {
      window.location.href = `${
        window.location.origin
      }/s/lesson/package/${packageId}/lesson/${lessonId}?token=${token}`
    }
    next(false)
  }
  next()
})

const TeacherColumnActivePageNameReg = /^TeacherColumn+/
const HIDE_ROUTE_NAMES = [
  'SingleLessonPreview',
  'PackagePreview',
  'LessonPreview'
]
export default {
  name: 'LessonPage',
  router,
  store,
  i18n,
  async created() {
    await this.loadLessonPresets()
  },
  components: {
    LessonHeader,
    CommonHeader,
    LoginDialog,
    PerfectCommonFooter
  },
  data() {
    return {
      isIE: !!window.ActiveXObject || 'ActiveXObject' in window,
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      isShowLoginDialog: 'lesson/isShowLoginDialog',
      isBeInClassroom: 'lesson/student/isBeInClassroom'
    }),
    nowPagename() {
      return this.$route.name
    },
    isHeaderFooterFixed() {
      return TeacherColumnActivePageNameReg.test(this.nowPagename)
    },
    isPreview() {
      return HIDE_ROUTE_NAMES.includes(this.$route.name)
    }
  },
  methods: {
    ...mapActions({
      getUserProfile: 'user/getProfile',
      getUserDetail: 'lesson/getUserDetail',
      toggleLoginDialog: 'lesson/toggleLoginDialog',
      changeStatus: 'lesson/student/changeStatus',
      uploadLearnRecords: 'lesson/student/uploadLearnRecords',
      resumeClassData: 'lesson/resumeClassData'
    }),
    async loadLessonPresets() {
      await this.getUserProfile({ force: false, useCache: false }).catch(err =>
        console.error(err)
      )
      await this.getUserDetail().catch(err => console.error(err))
      await this.resumeClassData().catch(err => console.error(err))
      this.loading = false
    },
    handleLoginDialogClose() {
      this.toggleLoginDialog(false)
    },
    async resetPage() {
      const { name } = this.$route
      const rules = ['TeacherColumn', 'StudentColumn']
      if (rules.some(i => i === name)) {
        this.$router.push({ name: 'StudentCenter' })
      }
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
.lesson-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  &-scroll-all {
    display: block;
  }
  &-header {
    height: 60px;
    border-bottom: 1px solid #e6e6e6;
  }
  &-main-content {
    background: #f8f8f8;
    min-height: auto;
    flex: 1;
    &-scroll-only {
      overflow: auto;
    }
  }
  &-footer {
    width: 100%;
    text-align: center;
    box-sizing: border-box;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
</style>
<style lang="scss">
@media (max-width: 768px) {
  .lesson-page {
    &-main-content {
      &-scroll-only {
        overflow: unset;
      }
    }
  }
}
</style>
