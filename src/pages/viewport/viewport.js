// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import 'element-ui/lib/theme-chalk/index.css'
import Viewport from './Viewport.vue'
import { editorModule, userModule, gitlabModule } from '@/store'
import ElementUI from 'element-ui'
import { transfer } from 'vuex-iframe-sync'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import handleMessage from '@/lib/iframe'

window.addEventListener('message', handleMessage)

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(ElementUI)

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
    // createPersistedState({
    //   paths: ['user', 'gitlab', 'editor']
    // }),
    transfer()
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#viewport',
  store,
  i18n,
  components: { Viewport },
  template: '<Viewport/>'
})
