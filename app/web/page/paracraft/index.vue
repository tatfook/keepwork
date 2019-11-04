<template>
  <router-view></router-view>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import paracraftModule from '@/store/paracraft'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import router from './paracraft.router'
import ba from 'vue-ba'
import Cookies from 'js-cookie'
import { language } from '@/lib/utils'

Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(ba, process.env.BAIDU_SITE_ID)

const store = new Vuex.Store({
  modules: {
    paracraft: paracraftModule
  }
})

export default {
  router,
  store
}

router.beforeEach((to, from, next) => {
  const { token = '', port = '8099', lang = '' } = to.query
  if (token) {
    Cookies.set('token', token)
  }
  Cookies.set('port', port)
  language.switchTo(lang)
  next()
})
</script>
<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
</style>
