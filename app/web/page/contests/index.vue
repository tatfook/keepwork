<template>
  <div class="contests-page">
    <contests-header></contests-header>
    <router-view></router-view>
    <contests-footer></contests-footer>
  </div>
</template>
<script>
import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './contests.router'
import ContestsHeader from '@/components/contests/ContestsHeader'
import ContestsFooter from '@/components/contests/ContestsFooter'

Vue.use(Vuex)

export default {
  name: 'ContestsPage',
  router,
  data() {},
  components: {
    ContestsHeader,
    ContestsFooter
  }
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
  &-main-content {
    border: 1px solid red;
    height: 300px;
    width: 300px;
  }
}
</style>

