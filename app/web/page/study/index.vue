<template>
  <div class="study-page" v-loading="loading">
    <div class="study-page-header">
      <common-header class="container"></common-header>
    </div>
    <study-header></study-header>
    <router-view class="study-page-main-content"></router-view>
    <div class="study-page-footer">
      <perfect-common-footer></perfect-common-footer>
    </div>
    <div @click.stop v-if="isShowLoginDialog">
      <login-dialog :show="isShowLoginDialog" @close="handleLoginDialogClose"></login-dialog>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import VueLazyload from 'vue-lazyload'
import Cookies from 'js-cookie'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './study.router'
import appModule from '@/store/app'
import skydriveModule from '@/store/skydrive'
import userModule from '@/store/user'
import gitlabModule from '@/store/gitlab'
import orgModule from '@/store/org'
import lessonModule from '@/store/lesson'
import pblModule from '@/store/pbl'
import messageModule from '@/store/message'
import { messages as i18nMessages, locale } from '@/lib/utils/i18n'
import CommonHeader from '@/components/common/CommonHeader'
import PerfectCommonFooter from '@/components/common/PerfectCommonFooter'
import LoginDialog from '@/components/common/LoginDialog'
import '@/components/common/thirdAuth'
import StudyHeader from '@/components/study/StudyHeader'
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import { lesson } from '@/api'
import axios from 'axios'
import jsrsasign from 'jsrsasign'
import { MessageBox } from 'element-ui'
import { socket, socketMixin } from '@/socket'
import comboModule from '@/store/combo'
import ba from 'vue-ba'

Vue.use(ba, process.env.BAIDU_SITE_ID)
Vue.use(Vuex)
Vue.use(VueI18n)
Vue.use(VueLazyload)
Vue.use(socket)

const i18n = new VueI18n({
  locale,
  messages: i18nMessages
})

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

const store = new Vuex.Store({
  modules: {
    skydrive: skydriveModule,
    app: appModule,
    user: userModule,
    gitlab: gitlabModule,
    lesson: lessonModule,
    org: orgModule,
    pbl: pblModule,
    message: messageModule,
    combo: comboModule
  }
})

const keepworkInstance = axios.create({
  baseURL: process.env.KEEPWORK_API_PREFIX
})
keepworkInstance.interceptors.response.use(res =>
  res ? res.data.data || res.data : res.data
)
const lessonInstance = axios.create({
  baseURL: process.env.LESSON_API_PREFIX
})
lessonInstance.interceptors.response.use(res =>
  res ? res.data.data || res.data : res.data
)

const getIncludeTheLessonOrgs = async ({
  token,
  packageId,
  lessonId,
  resetUrl = false
}) => {
  const { userId } = jsrsasign.KJUR.jws.JWS.readSafeJSONString(
    jsrsasign.b64utoutf8(token.split('.')[1])
  )
  const userOrgs = await keepworkInstance.post('graphql', {
    query:
      'query($userId: Int){organizationClasses(userId: $userId) {id,roleId, organizationId,organization{name, loginUrl}, name, organizationPackages{packageId,lessonNos} }}',
    variables: {
      userId: userId
    }
  })
  const userOrgClasses = _.filter(
    _.get(userOrgs, 'organizationClasses', []),
    item => (item.roleId & 1) > 0
  )
  const includeTheLessonOrgs = _.filter(userOrgClasses, item => {
    if (item.organizationPackages.length === 0) {
      return false
    }
    const org = _.find(
      item.organizationPackages,
      i => i.packageId === _.toNumber(packageId)
    )
    const lessons = _.get(org, 'lessonNos', [])
    if (lessons.length === 0) {
      return false
    }
    const theLesson = _.find(
      lessons,
      item => item.lessonId === _.toNumber(lessonId)
    )
    if (!theLesson) {
      return false
    }
    return true
  })
  const orgName = _.get(includeTheLessonOrgs, '[0].organization.loginUrl', '')
  if (orgName) {
    window.location.href = `${
      window.location.origin
    }/org/${orgName}/student/package/${packageId}/lesson/${lessonId}`
  } else if (resetUrl) {
    if (window.history && history.replaceState) {
      setTimeout(
        () => window.history.replaceState({}, '', `?fromParacraft=1`),
        0
      )
    }
  }
  return includeTheLessonOrgs
}

const redirectToStudyPage = message =>
  MessageBox({
    message: message,
    title: '错误',
    confirmButtonText: '确定',
    type: 'error',
    center: true
  })

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.paracraft)) {
    const params = { ...to.params, ...to.query }
    const { token, key = '' } = params
    const lessonId = _.toNumber(params.lessonId)
    const packageId = _.toNumber(params.packageId)
    const localeToken = Cookies.get('token')
    keepworkInstance.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${token}`
    lessonInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    if (key) {
      try {
        await lessonInstance.post('classrooms/join', { key })
        const classroom = await lessonInstance.get('classrooms/current')
        const { organizationId, packageId, lessonId } = classroom
        const orgs = await keepworkInstance.get('lessonOrganizations')
        const orgName = _.get(
          _.find(orgs, item => item.id === organizationId),
          'loginUrl',
          ''
        )
        window.location.href = `${
          window.location.origin
        }/org/${orgName}/student/package/${packageId}/lesson/${lessonId}`
      } catch (error) {
        const errMsg = _.get(error, 'response.data', '')
        if (_.includes(errMsg, '不是该班级学生')) {
          redirectToStudyPage('不是该班级学生')
        } else if (_.get(errMsg, 'code', '') === 1) {
          redirectToStudyPage('课堂不存在')
        }
        if (window.history && history.replaceState) {
          setTimeout(
            () => window.history.replaceState({}, '', `?fromParacraft=1`),
            0
          )
        }
        next()
      }
    } else if (token) {
      await getIncludeTheLessonOrgs({
        token,
        packageId,
        lessonId,
        resetUrl: true
      })
      return next(true)
    } else if (localeToken) {
      await getIncludeTheLessonOrgs({
        token: localeToken,
        packageId,
        lessonId
      })
    }
    next()
  }

  if (to.matched.some(record => record.meta.requireAuth)) {
    if (!Cookies.get('token')) {
      store.dispatch(
        'lesson/toggleLoginDialog',
        { show: true, to },
        { root: true }
      )
      if (!from.name) {
        return next({ name: 'StudyHome' })
      }
      return next(false)
    }
  }
  next()
})

export default {
  name: 'StudyPage',
  router,
  store,
  i18n,
  mixins: [socketMixin],
  data() {
    return {
      loading: true
    }
  },
  watch: {
    socketMessage(value) {
      store.dispatch('message/refreshMessagesBox')
    }
  },
  async created() {
    document.title = this.$t('org.onlineLearning')
    await this.loadPblPresets()
  },
  computed: {
    ...mapGetters({
      isShowLoginDialog: 'pbl/isShowLoginDialog'
    })
  },
  components: {
    CommonHeader,
    StudyHeader,
    PerfectCommonFooter,
    LoginDialog
  },
  methods: {
    ...mapActions({
      pblToggleLoginDialog: 'pbl/toggleLoginDialog',
      getUserProfile: 'user/getProfile'
    }),
    async loadPblPresets() {
      await this.getUserProfile({ force: false, useCache: false }).catch(err =>
        console.error(err)
      )
      this.loading = false
    },
    handleLoginDialogClose() {
      this.pblToggleLoginDialog(false)
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
.study-page {
  height: 100%;
  display: table;
  width: 100%;
  background: #f8f8f8;
  &-header {
    height: 60px;
    display: table-row;
    border-bottom: 1px solid #e6e6e6;
    background: #fff;
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
  }
  &-main-content {
    background: #f8f8f8;
    display: table-row;
    height: 100%;
  }
  &-footer {
    display: table-row;
  }
}
</style>


