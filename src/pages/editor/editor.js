// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import fullscreen from 'vue-fullscreen'
import VueClipboard from 'vue-clipboard2'
// import '@/assets/iconfont/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import EditorPage from './EditorPage'
import router from './editor.router'
import { editorModule, userModule, gitlabModule, createPersistedState } from '@/store'
import ElementUI from 'element-ui'
import { broadcast } from 'vuex-iframe-sync'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'

Vue.use(fullscreen)
Vue.use(VueClipboard)

Vue.config.productionTip = false
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
    gitlab: gitlabModule,
    editor: editorModule
  },
  plugins: [
    createPersistedState({
      paths: ['user'] // , 'gitlab', 'editor']
    }),
    broadcast('frameViewport')
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#editor',
  router,
  store,
  i18n,
  components: { EditorPage },
  template: '<EditorPage/>'
})
