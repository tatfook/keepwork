// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import 'element-ui/lib/theme-chalk/index.css'
import LessonPage from './LessonPage'
import router from './lesson.router'
import { userModule, lessonModule, createPersistedState } from '@/store'
import ElementUI from 'element-ui'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'

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
    lesson: lessonModule
  },
  plugins: [
    createPersistedState({
      paths: [
        'user.profile',
        'user.webTemplateConfig',
        'user.skyDrive'
      ]
    })
  ]
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
