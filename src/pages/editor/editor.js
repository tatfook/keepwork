// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import EditorPage from './EditorPage'
import router from './editor.router'
import store from '@/vuex/editor.store'
import ElementUI from 'element-ui'
import JsonEditor from 'vue-json-editor-block-view'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(JsonEditor)

/* eslint-disable no-new */
new Vue({
  el: '#editor',
  router,
  store,
  components: { EditorPage },
  template: '<EditorPage/>'
})
