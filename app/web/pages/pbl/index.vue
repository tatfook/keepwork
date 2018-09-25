<template>
  <div class="pbl-page" v-loading="loading">
    <div class="pbl-page-header">
      <common-header class="container"></common-header>
    </div>
    <router-view class="pbl-page-main-content" id="pbl-page" />
    <common-footer class="container"></common-footer>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import 'element-ui/lib/theme-chalk/index.css'
import router from './pbl.router'
import {
  appModule,
  userModule,
  lessonModule,
  pblModule,
  createPersistedState
} from '@/store'
import ElementUI from 'element-ui'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import { mapActions, mapGetters } from 'vuex'
import CommonHeader from '@/components/common/CommonHeader'
import CommonFooter from '@/components/common/CommonFooter'

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
    app: appModule,
    user: userModule,
    pbl: pblModule
  },
  plugins: [
    createPersistedState({
      paths: ['user.profile']
    })
  ]
})

export default {
  router,
  store,
  i18n,
  data() {
    return {
      loading: true
    }
  },
  async created() {
    await this.loadPblPresets()
  },
  components: {
    CommonHeader,
    CommonFooter
  },
  computed: {
    nowPagename() {
      return this.$route.name
    }
  },
  methods: {
    ...mapActions({
      getUserProfile: 'user/getProfile'
    }),
    async loadPblPresets() {
      await this.getUserProfile({ force: false, useCache: false }).catch(err =>
        console.error(err)
      )
      this.loading = false
    }
  }
}
</script>

<style lang="scss">
html,
body {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
}
.pbl-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  &-header {
    height: 60px;
    border-bottom: 1px solid #e6e6e6;
  }
  &-main-content {
    flex: 1;
  }
  .container {
    width: 1200px;
    margin: 0 auto;
  }
}
</style>
