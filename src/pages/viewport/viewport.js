// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import '@/assets/iconfont/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import Viewport from './Viewport'
import createPersistedState from 'vuex-persistedstate'
import { editorModule, userModule, gitlabModule } from '@/store'
import ElementUI from 'element-ui'
import { transfer } from 'vuex-iframe-sync'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(ElementUI)

const store = new Vuex.Store({
  modules: {
    user: userModule,
    gitlab: gitlabModule,
    editor: editorModule
  },
  plugins: [
    createPersistedState({
      paths: ['user', 'gitlab']
    }),
    transfer()
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#viewport',
  store,
  components: { Viewport },
  template: '<Viewport/>'
})
