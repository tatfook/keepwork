<template>
  <div class="contests-page">
    <router-view></router-view>
  </div>
</template>
<script>
import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './contests.router'
import VueI18n from 'vue-i18n'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import userModule from '@/store/user'

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
  }
})

export default {
  name: 'ContestsPage',
  router,
  i18n,
  store,
  data() {
    return {}
  },
  components: {}
}
</script>

<style lang="scss" scoped>
html,
body {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
}
.contests-page {
}
</style>

