<template>
  <div class="common-header">
    <el-menu mode='horizontal' :default-active="activeIndex" class="common-header-menu">
      <el-menu-item class="home-page right-icon-item" @click="goHomePage">
        <img class="brand" src="@/assets/img/logo_old.svg" alt="KeepWork">
      </el-menu-item>
      <el-menu-item class="hidden-xxs-only" index='1' @click="goCreativityPage">
        {{$t('common.creativity')}}
      </el-menu-item>
      <el-menu-item class="hidden-xxs-only" index='2' @click="goExplorationPage">
        {{$t('common.explore')}}
      </el-menu-item>
      <el-menu-item class="hidden-xxs-only" index='4' @click="goStudyPage">
        {{$t('common.study')}}
      </el-menu-item>
      <el-menu-item class="pull-right user-menu right-icon-item" v-if="isLogin">
        <el-dropdown placement="bottom-end">
          <span class="el-dropdown-link">
            <user-portrait :user="userProfile" :width="40" size="small"></user-portrait>
          </span>
          <el-dropdown-menu slot="dropdown" class="user-menu-dropdown">
            <div class="greeting">{{$t("common.hello")}}，{{username}}
            </div>
            <el-dropdown-item divided>
              <a :href="`/u/${userProfile.username}`"><i class="iconfont icon-user"></i>{{$t('common.myHomePage')}}</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="/a/account"><i class="iconfont icon-account1"></i>{{$t("account.myAccount")}}</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="#" @click.stop.prevent="goCreativityPage"><i class="iconfont icon-folder-open"></i>{{$t("common.myProject")}}</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a :href='myOrgUrl'><i class="iconfont icon-jigou"></i>{{$t("common.myOrganization")}}</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a :href='myLessonUrl'><i class="iconfont icon-read"></i>{{$t("common.myLesson")}}</a>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <a href="/u/p/userData"><i class="iconfont icon-settings1"></i>{{$t("common.settings")}}</a>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <a @click.stop="logout"><i class="iconfont icon-ziyuan"></i>{{$t('common.logout')}}</a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu-item>
      <el-menu-item v-if="isLogin" class="pull-right user-message-menu-item right-icon-item">
        <message-box @toMessageCenter="toMessageCenter" @toMessageDetail="toMessageDetail"></message-box>
      </el-menu-item>
      <el-menu-item class="pull-right right-icon-item" v-if="isLogin">
        <el-dropdown placement="bottom">
          <span class="el-dropdown-link tool-menu">
            <i class="iconfont icon-wrench-fill"></i>
            <span class="hidden-xs-only">{{$t('common.tools')}}</span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span @click="toEditPage"><i class="iconfont icon-brush"></i>{{$t('common.websiteEditor')}}</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span @click.stop.prevent="openSkyDriveManagerDialog"><i class="iconfont icon-save3"></i>{{$t('common.myWebDisk')}}</span>
            </el-dropdown-item>
            <el-dropdown-item><a href="http://paracraft.keepwork.com/download?lang=zh" target="_blank"><i class="iconfont icon-video2"></i>{{$t('common.paracraft')}}</a></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu-item>
      <el-menu-item index='8' class="pull-right register-button" v-if="!isLogin">
        <a @click.stop.prevent="goJoin" class="register-btn">{{$t('common.register')}}</a>
      </el-menu-item>
      <el-menu-item index='9' class="pull-right login-button" v-if="!isLogin">
        <a @click.stop.prevent="goLogin" class="login-btn">{{$t('common.login')}}</a>
      </el-menu-item>
      <el-menu-item index="5" class="pull-right hidden-sm-and-up">
        <el-dropdown placement="bottom">
          <span class="el-dropdown-link tool-menu">
            <i class="iconfont icon-menu"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="hidden-xs-and-up"><a href="" @click.stop.prevent="goCreativityPage">{{$t('common.creativity')}}</a></el-dropdown-item>
            <el-dropdown-item class="hidden-xs-and-up"><a href="" @click.stop.prevent="goExplorationPage">{{$t('common.explore')}}</a></el-dropdown-item>
            <el-dropdown-item class="hidden-xs-and-up"><a href="" @click.stop.prevent="goStudyPage">{{$t('common.study')}}</a></el-dropdown-item>
            <el-dropdown-item><a href="/ranking">{{$t('common.ranking')}}</a></el-dropdown-item>
            <el-dropdown-item><a href="http://paracraft.keepwork.com/download?lang=zh">{{$t('project.downloadParacraft')}}</a></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu-item>
      <el-menu-item class="hidden-xs-only pull-right common-header-menu-download right-icon-item" @click="downloadParacraft()">
        <i class="iconfont icon-xiazai"></i>{{$t('common.download')}}
      </el-menu-item>
      <el-menu-item class="hidden-xs-only pull-right common-header-menu-ranking right-icon-item" @click="goRanking">
        <i class="iconfont icon-trophy-fill"></i>{{$t('common.ranking')}}
      </el-menu-item>
      <el-menu-item class="menu-searchbar" index='10'>
        <search-bar></search-bar>
      </el-menu-item>
    </el-menu>
    <div @click.stop v-if='isPersonalCenterShow'>
      <personal-center-dialog :show='isPersonalCenterShow' :sitePath='userProfile.username' @close='closePersonalCenterDialog'></personal-center-dialog>
    </div>
    <div @click.stop v-if='isSkyDriveManagerDialogShow'>
      <sky-drive-manager-dialog :show='isSkyDriveManagerDialogShow' @close='closeSkyDriveManagerDialog'></sky-drive-manager-dialog>
    </div>
    <div @click.stop v-if="isLoginDialogShow">
      <login-dialog :show="isLoginDialogShow" @close="closeLoginDialog" @isRegisterShow='goJoin'></login-dialog>
    </div>
    <div @click.stop v-if="isRegisterDialogShow" class="register-dialog">
      <el-dialog :visible.sync="isRegisterDialogShow">
        <register-dialog @close="closeRegisterDialog"></register-dialog>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import moment from 'moment'
import PersonalCenterDialog from '@/components/common/PersonalCenterDialog'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
import LoginDialog from '@/components/common/LoginDialog'
import RegisterDialog from '@/components/common/RegisterComp'
import MessageBox from '@/components/common/message/MessageBox'
import SearchBar from './SearchBar'
import UserPortrait from '@/components/common/UserPortrait'
const IS_GLOBAL_VERSION = !!process.env.IS_GLOBAL_VERSION
const CREATE_REG = /^\/create/
const EXPLORATION_REG = /^\/explore/
const RANKING_REG = /^\/ranking/
const STUDY_REG = /^\/s/

export default {
  name: 'CommonHeader',
  data() {
    return {
      IS_GLOBAL_VERSION,
      isPersonalCenterShow: false,
      isSkyDriveManagerDialogShow: false,
      isLoginDialogShow: false,
      isRegisterDialogShow: false,
      locationOrigin: window.location.origin,
      activeIndex: '0',
      msgScroll: null,
      perPage: 10,
      loadingMore: false
    }
  },
  computed: {
    ...mapGetters({
      isRealNamed: 'user/isRealNamed',
      userProfile: 'user/profile',
      userIsLogined: 'user/isLogined',
      username: 'user/username',
      unreadMessagesCount: 'message/unreadMessagesCount',
      messagesBox: 'message/messagesBox'
    }),
    isLogin: {
      get() {
        return this.userIsLogined
      },
      set() {}
    },
    hostname() {
      return window.location.hostname
    },
    myOrgUrl() {
      return '/s/myOrganization'
    },
    myLessonUrl() {
      return '/s/createPackage/lessonManager'
    },
    currentRouteName() {
      return this.$route.name
    }
  },
  async mounted() {
    this.checkCurrentTab()
    if (!this.userIsLogined) {
      this.userGetProfile({ forceLogin: false })
        .then(() => {
          this.isLogin = true
        })
        .catch(() => {
          this.isLogin = false
        })
    }
  },
  watch: {
    $route(route) {
      this.checkCurrentTab()
    }
  },
  methods: {
    ...mapActions({
      toggleRealName: 'user/toggleRealName',
      userGetProfile: 'user/getProfile',
      userLogout: 'user/logout'
    }),
    toEditPage() {
      if (!this.isRealNamed) {
        return this.toggleRealName(true)
      }
      window.open('/ed', '_blank')
    },
    checkCurrentTab() {
      let pathname = window.location.pathname
      if (CREATE_REG.test(pathname)) {
        return (this.activeIndex = '1')
      }
      if (EXPLORATION_REG.test(pathname)) {
        return (this.activeIndex = '2')
      }
      if (STUDY_REG.test(pathname)) {
        return (this.activeIndex = '4')
      }
    },
    goKnowledgeManagement() {
      this.$alert('开发中~~~~~~', '', {
        confirmButtonText: '确定'
      })
    },
    goCreativityPage() {
      if (this.$route.name !== 'CreativityPage') {
        window.location.href = `${this.locationOrigin}/create`
      }
    },
    goExplorationPage() {
      if (this.$route.name !== 'ExplorationPage') {
        window.location.href = `${this.locationOrigin}/explore?tab=allProjects`
      }
    },
    goRanking() {
      if (this.$route.name !== 'Ranking') {
        window.location.href = `${this.locationOrigin}/ranking`
      }
    },
    downloadParacraft() {
      window.open('http://paracraft.keepwork.com/download?lang=zh')
    },
    goStudyPage() {
      return (window.location.href = `${this.locationOrigin}/s`)
    },
    goHomePage() {
      if (this.$route.name !== 'HomePage') {
        window.location.href = `/`
      }
    },
    goUserProfilePage() {
      return (window.location.href = `${this.locationOrigin}/u/${this.username}`)
    },
    goPersonalCenter() {
      this.isPersonalCenterShow = true
    },
    closePersonalCenterDialog() {
      this.isPersonalCenterShow = false
    },
    openSkyDriveManagerDialog() {
      if (!this.isRealNamed) {
        return this.toggleRealName(true)
      }
      this.isSkyDriveManagerDialogShow = true
    },
    closeSkyDriveManagerDialog({ file, url }) {
      this.isSkyDriveManagerDialogShow = false
      if (url) {
        let filename = file.filename || url
        let isImage = /^image\/.*/.test(file.type)
        isImage
          ? this.$refs.codemirror.insertFile(filename, url)
          : this.$refs.codemirror.insertLink(filename, url)
      }
    },
    goLogin() {
      this.isLoginDialogShow = true
    },
    closeLoginDialog() {
      this.isLoginDialogShow = false
    },
    async logout() {
      this.userLogout()
      this.$emit('callback')
    },
    goJoin() {
      this.isRegisterDialogShow = true
    },
    closeRegisterDialog() {
      this.isRegisterDialogShow = false
    },
    toMessageCenter() {
      window.location.href = `${window.location.origin}/msg`
    },
    toMessageDetail(query) {
      const queryStr = _.reduce(
        query,
        (result, value, key) => {
          result += `${key}=${value}&`
          return result
        },
        ''
      )
      const msgUrl = `${window.location.origin}/msg?${queryStr}`
      window.location.href = msgUrl
    }
  },
  filters: {
    formatDate(date) {
      const _date = moment(date)
      return _date.isSame(moment(), 'day')
        ? _date.format('H:mm')
        : _date.format('MM/DD')
    }
  },
  components: {
    PersonalCenterDialog,
    SkyDriveManagerDialog,
    LoginDialog,
    RegisterDialog,
    SearchBar,
    UserPortrait,
    MessageBox
  }
}
</script>
<style lang="scss" scoped>
.pull-right {
  float: right !important;
}
.tool-menu {
  display: inline-block;
  width: 100%;
  height: 100%;
  &:hover {
    color: #218efc;
  }
  .icon-wrench-fill {
    font-size: 30px;
  }
}
.el-menu {
  .brand {
    width: 115px;
  }
  .login-btn {
    background: #f5f5f5;
    border: solid 1px #dddddd;
    padding: 7px 11px;
    border-radius: 3px;
    &:hover {
      background-color: #218efc;
      color: #fff;
    }
  }
  .register-btn {
    background-color: #409eff;
    color: #fff;
    padding: 8px 12px;
    border-radius: 3px;
    &:hover {
      color: #fff;
    }
  }
  .is-active {
    color: #409eff;
  }
}
.menu-left {
  flex: 1;
}
.el-dropdown-menu__item--divided:before {
  margin: 0px;
}
.el-menu-item {
  padding: 0 12px;
  color: #909399;
  &:hover {
    color: #409eff !important;
  }
  .right-icon {
    font-size: 13px;
    width: 0;
    position: relative;
    left: 1px;
  }
}
.el-menu--horizontal .el-menu-item:not(.is-disabled):focus {
  color: #909399;
}
.home-page {
  padding-left: 0;
}
.register-button {
  padding: 0;
}
.user-menu {
  padding-right: 5px;
}
.el-dropdown {
  height: 60px;
  line-height: 57px;
  color: #909399;
}
.el-dropdown-menu {
  font-size: 14px;
}
.el-dropdown-menu__item {
  display: flex;
  padding: 0;
}
.el-dropdown-menu .iconfont {
  margin-right: 14px;
  font-size: 20px;
}
.right-icon-item {
  border-bottom: none;
  &:hover {
    i {
      color: #409eff;
    }
  }
  .tool-menu:hover {
    i {
      color: #409eff;
    }
  }
  .right-icon-tool {
    font-size: 13px;
    width: 0;
    position: relative;
    left: -6px;
  }
}

@media (min-width: 768px) and (max-width: 1180px) {
  .menu-searchbar {
    display: none;
  }
}
@media (max-width: 768px) {
  .hidden-sm-and-up .user-profile {
    width: 36px;
    height: 36px;
  }
  .hidden-sm-and-up .el-icon-menu {
    font-size: 30px;
  }
  .el-menu-item {
    padding: 0 10px;
  }
  .profile-menu-item {
    padding-left: 0;
  }
  .el-menu .login-btn {
    padding-right: 8px;
    background-color: transparent;
    color: #3977ad;
    border: none;
  }
  .el-menu .register-btn {
    padding: 6px;
  }
}
</style>
<style lang="scss">
.common-header {
  .user-message-icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 58px;
    .user-message-badge {
      line-height: 22px;
      .el-badge__content {
        height: 16px;
        line-height: 16px;
        padding: 0 4px;
        font-size: 12px;
      }
    }
    .user-message-icon {
      font-size: 30px;
    }
  }
  &-menu-ranking {
    padding-right: 4px !important;
    .icon-trophy-fill {
      font-size: 30px;
      color: #909399;
    }
  }
  &-menu-download {
    padding-right: 4px !important;
    .iconfont.icon-xiazai {
      font-size: 30px;
    }
  }
}
.user-menu-dropdown {
  li {
    padding: 0;
  }
  a {
    padding: 0 50px 0 20px;
  }
}
.el-dropdown-menu__item a {
  padding: 0 20px;
  width: 100%;
}
.el-dropdown-menu__item span {
  display: inline-block;
  padding: 0 20px;
  width: 100%;
  cursor: pointer;
}
.greeting {
  padding: 0 20px;
  height: 36px;
  line-height: 36px;
}
.register-dialog {
  max-width: 352px;
  /deep/.el-dialog__body {
    padding: 0;
  }
  /deep/.register-dialog-form {
    margin: 0;
    box-shadow: none;
  }
  /deep/.register-title {
    padding: 0;
  }
}
.el-popper {
  a {
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;
  }
}
@media (max-width: 1180px) {
  .menu-searchbar {
    display: none;
  }
}
@media (max-width: 499px) {
  .hidden-xxs-only {
    display: none;
  }
}
@media (min-width: 500px) {
  .hidden-xs-and-up {
    display: none;
  }
}
@media print {
  .common-header {
    display: none;
  }
}
</style>
