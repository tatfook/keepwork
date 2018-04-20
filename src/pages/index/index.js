// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'

import App from './App'
import router from './index.router'
// import createPersistedState from 'vuex-persistedstate'
import { appModule, userModule, gitlabModule } from '@/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(ElementUI)

const store = new Vuex.Store({
  modules: {
    app: appModule,
    user: userModule,
    gitlab: gitlabModule
  },
  plugins: [
    // createPersistedState({
    //   paths: ['user', 'gitlab']
    // })
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
