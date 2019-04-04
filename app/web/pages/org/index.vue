<template>
  <div class="org-page" v-loading="loading">
    <router-view class="org-page-main-content" id="org-page" />
    <el-footer class="org-page-footer" height="auto">
      <perfect-common-footer></perfect-common-footer>
    </el-footer>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex, { mapGetters, mapActions } from 'vuex'
import VueI18n from 'vue-i18n'
import VueAnalytics from 'vue-analytics'
import jsrsasign from 'jsrsasign'
import Cookies from 'js-cookie'
import 'element-ui/lib/theme-chalk/index.css'
import createPersistedState from '@/store/createPersistedState'
import router from './org.router'
import appModule from '@/store/app'
import userModule from '@/store/user'
import orgModule from '@/store/org'
import lessonModule from '@/store/lesson'
import ElementUI from 'element-ui'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import Vhistogram from 'v-charts/lib/histogram.common'
import PerfectCommonFooter from '../../components/common/PerfectCommonFooter'

Vue.use(Vuex)
Vue.use(VueI18n)
Vue.component(Vhistogram.name, Vhistogram)
Vue.use(VueAnalytics, {
  id: process.env.GOOGLE_ANALYTICS_UA,
  router,
  batch: {
    enabled: true, // enable/disable
    amount: 2, // amount of events fired
    delay: 500 // delay in milliseconds
  }
})

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
    lesson: lessonModule,
    org: orgModule
  },
  plugins: [
    createPersistedState({
      paths: ['org.currentOrg', 'org.userinfo']
    })
  ]
})

const OrgLoginPageName = 'OrgLogin'
const OrgAdminPageName = 'OrgPackages'
const OrgTeacherPageName = 'OrgTeacher'
const OrgStudentPageName = 'OrgStudent'
const OrgContactPageName = 'OrgContact'
const OrgNotFoundPageName = 'OrgNotFound'
const OrgIndexPageName = 'OrgIndex'

const checkIsLogined = function(name, next, params) {
  let nowToken = Cookies.get('token')
  if (nowToken) return true
  let isNowLoginPage = name == OrgLoginPageName
  if (isNowLoginPage) {
    next()
    return false
  }
  next({
    name: OrgLoginPageName,
    params
  })
  return false
}

const checkIsOrgExist = async function(
  name,
  next,
  params,
  orgLoginUrl,
  nowPageRole
) {
  let orgDetail = await store
    .dispatch('org/getOrgDetailByLoginUrl', { orgLoginUrl })
    .catch(err => console.log(err))
  if (orgDetail && orgDetail.id) {
    store.dispatch('org/setCurrentOrg', { orgDetail })
    return { isContinue: true, orgId: orgDetail.id }
  }
  if (nowPageRole != 'notfound') {
    next({
      name: OrgNotFoundPageName,
      params
    })
    return { isContinue: false }
  } else {
    next()
    return { isContinue: false }
  }
}

const checkIsOrgMember = async function(
  name,
  next,
  params,
  orgId,
  nowPageRole
) {
  let orgToken = await store
    .dispatch('org/getOrgToken', { orgId })
    .catch(err => console.log(err))
  if (orgToken) {
    Cookies.set('token', orgToken)
    return { isContinue: true, orgToken }
  }
  if (nowPageRole != 'contact') {
    next({
      name: OrgContactPageName,
      params
    })
    return false
  } else {
    next()
    return false
  }
}

const handleDifferentRole = function(name, next, params, roleId, nowPageRole) {
  if (roleId == 1 && nowPageRole != 'student') {
    return next({
      name: OrgStudentPageName,
      params
    })
  }
  if (roleId == 2 && nowPageRole != 'teacher') {
    return next({
      name: OrgTeacherPageName,
      params
    })
  }
  if (roleId == 64 && nowPageRole != 'admin') {
    return next({
      name: OrgAdminPageName,
      params
    })
  }
  if (_.isUndefined(roleId) && nowPageRole != 'contact') {
    return next({
      name: OrgContactPageName,
      params
    })
  }
  next()
}

router.beforeEach(async (to, from, next) => {
  let { query, params, name, path } = to
  let isContinue, result
  let pathArr = path.split('/')
  let nowPageRole = pathArr && pathArr.length >= 3 && pathArr[2]

  isContinue = checkIsLogined(name, next, params)
  if (!isContinue) return

  let orgLoginUrl = params.orgLoginUrl
  result = await checkIsOrgExist(name, next, params, orgLoginUrl, nowPageRole)
  if (!result.isContinue) return

  let orgId = result.orgId
  result = await checkIsOrgMember(name, next, params, orgId, nowPageRole)
  if (!result.isContinue) return

  let orgToken = result.orgToken
  let tokenParams = jsrsasign.KJUR.jws.JWS.readSafeJSONString(
    jsrsasign.b64utoutf8(orgToken.split('.')[1])
  )
  let { roleId } = tokenParams
  handleDifferentRole(name, next, params, roleId, nowPageRole)

  next()
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
    await this.loadOrgPresets()
  },
  computed: {
    ...mapGetters({
      userIsLogined: 'user/isLogined',
      currentOrg: 'org/currentOrg'
    }),
    routeLoginUrl() {
      return _.get(this.$route, 'params.orgLoginUrl')
    },
    isUserLoginForOrg() {
      let currentOrgloginUrl = _.get(this.currentOrg, 'loginUrl')
      return (
        this.userIsLogined &&
        currentOrgloginUrl &&
        currentOrgloginUrl === this.routeLoginUrl
      )
    },
    orgId() {
      return _.get(this.currentOrg, 'id')
    }
  },
  methods: {
    ...mapActions({
      getOrgUserCountsByGraphql: 'org/getOrgUserCountsByGraphql',
      getUserProfile: 'user/getProfile'
    }),
    async loadOrgPresets() {
      await this.getUserProfile({ force: false, useCache: false }).catch(err =>
        console.error(err)
      )
      this.loadUserCounts()
      this.loading = false
    },
    async loadUserCounts() {
      this.orgId &&
        (await this.getOrgUserCountsByGraphql({
          orgId: this.orgId
        }))
    }
  },
  components: {
    PerfectCommonFooter
  },
  watch: {
    $route() {
      this.loadUserCounts()
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
.org-page {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  &-main-content {
    flex: 1;
  }
  &-footer {
    padding: 0;
    margin-top: 40px;
  }
}
</style>
