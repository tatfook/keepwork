// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import 'element-ui/lib/theme-chalk/index.css'
import LessonPage from './LessonPage'
import router from './lesson.router'
import {
  appModule,
  gitlabModule,
  userModule,
  lessonModule,
  createPersistedState
} from '@/store'
import ElementUI from 'element-ui'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import Vhistogram from 'v-charts/lib/histogram.common'
import Cookies from 'js-cookie'
import '@/components/common/thirdAuth'
import { keepwork } from '@/api'
import VueAnalytics from 'vue-analytics'

Vue.use(Vuex)
Vue.use(VueI18n)
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
    app: appModule,
    user: userModule,
    gitlab: gitlabModule,
    lesson: lessonModule
  },
  plugins: [
    createPersistedState({
      paths: ['user.webTemplateConfig', 'user.skyDrive']
    })
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.auto)) {
    const { query, params } = to
    const { token, key, id } = query
    if (token !== undefined) {
      Cookies.remove('token')
      Cookies.remove('token', { path: '/' })
      window.localStorage.removeItem('satellizer_token')
      store.dispatch('lesson/logout')
      store.dispatch('lesson/student/saveVisitorInfo', {
        id,
        token,
        classId: id,
        key
      })
      // localStorage.setItem('refresh', true)
    }
    if (token && token !== 0) {
      let userInfo = await keepwork.user
        .verifyToken({ token })
        .catch(e => console.error('verify token failure'))
      if (userInfo) {
        Cookies.set('token', token)
        if (key !== undefined && key !== 0) {
          await store
            .dispatch('lesson/student/enterClassRoom', {
              key
            })
            .catch(e => console.error(e))
          return next({
            name: 'LessonStudent',
            params,
            query: { reload: true, dialog: true, device: 'paracraft' }
          })
        }
        return next({ name: 'LessonStudent', params, query: { reload: true } })
      }
    }

    if (id && token) {
      if (Number(id) === 0 && Number(token) === 0) {
        return next({ name: 'Anonymous', params })
      }
      return next({ name: 'Anonymous', params, query })
    }

    if (query.key && query.key !== 0 && Cookies.get('token')) {
      let res = await store
        .dispatch('lesson/student/enterClassRoom', {
          key: query.key
        })
        .catch(e => console.error('join failure'))
      if (res) {
        return next({
          name: 'LessonStudent',
          params: { packageId: res.packageId, lessonId: res.lessonId },
          query: { dialog: true, device: 'paracraft' }
        })
      }
      return next({ name: 'StudentCenter' })
    }
    return next({ name: 'Anonymous', params })
  }

  if (to.matched.some(record => record.meta.requireAuth)) {
    if (!Cookies.get('token')) {
      store.dispatch(
        'lesson/toggleLoginDialog',
        { show: true, to: to },
        { root: true }
      )
      if (!from.name) {
        return next({ name: 'StudentCenter' })
      }
      return next(false)
    }
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#lesson',
  router,
  store,
  i18n,
  components: { LessonPage },
  template: '<LessonPage/>'
})
