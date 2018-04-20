// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
// import '@/assets/iconfont/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
// import createPersistedState from 'vuex-persistedstate'
import EditorPage from './EditorPage'
import router from './editor.router'
import { editorModule, userModule, gitlabModule } from '@/store'
import ElementUI from 'element-ui'
import { broadcast } from 'vuex-iframe-sync'
import { messages as i18nMessages } from '@/lib/utils/i18n'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh-CN',
  messages: {
    ...i18nMessages
  }
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
    // createPersistedState({
    //   paths: ['user', 'gitlab', 'editor']
    // }),
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
