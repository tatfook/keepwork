<template>
  <div class="lesson-page" :class="{'lesson-page-scroll-all': isIE && !isHeaderFooterFixed}">
    <router-view class="lesson-page-main-content" id="lesson-page" />
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
import LoginDialog from '@/components/common/LoginDialog'
import '@/components/common/thirdAuth'
import { broadcast } from 'vuex-iframe-sync'
import { MessageBox } from 'element-ui'
import { lesson } from '@/api'
import ba from 'vue-ba'
import RealName from '@/components/common/RealName'

Vue.use(ba, process.env.BAIDU_SITE_ID)
Vue.use(Vuex)
Vue.use(VueI18n)
Vue.use(VueLazyload)
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
    app: appModule,
    user: userModule,
    gitlab: gitlabModule,
    lesson: lessonModule,
    pbl: pblModule
  },
  plugins: [
    createPersistedState({
      paths: ['user.webTemplateConfig']
    }),
    broadcast('combo')
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.auto)) {
    const params = { ...to.params, ...to.query }
    const { packageId, lessonId, key = '', token = '' } = params
    if (token) {
      const res = await lesson.users
        .verifyToken({ token })
        .catch(e => console.error(e))
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
          beforeClose: () =>
            (window.location.href = `${window.location.origin}/s`)
        })
        next(false)
        return
      }
    }
    if (Number(key)) {
      window.location.href = `${window.location.origin}/s/lesson/package/${packageId}/lesson/${lessonId}?key=${key}&token=${token}`
    } else {
      window.location.href = `${window.location.origin}/s/lesson/package/${packageId}/lesson/${lessonId}?token=${token}`
    }
    next(false)
  }
  next()
})

export default {
  name: 'LessonPage',
  router,
  store,
  i18n,
  data() {
    return {
      isIE: !!window.ActiveXObject || 'ActiveXObject' in window
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
