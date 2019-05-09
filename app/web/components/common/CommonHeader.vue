<template>
  <div class="common-header">
    <el-menu mode='horizontal' :default-active="activeIndex" class="hidden-xs-only common-header-menu">
      <el-menu-item index='0' class="home-page" @click="goHomePage">
        <img class="brand" src="@/assets/img/logo_old.svg" alt="KeepWork">
      </el-menu-item>
      <el-menu-item index='1' @click="goCreativityPage">
        {{$t('common.creativity')}}
      </el-menu-item>
      <el-menu-item index='2' @click="goExplorationPage">
        {{$t('common.explore')}}
      </el-menu-item>
      <el-menu-item index='4' @click="goStudyPage">
        {{$t('common.study')}}
      </el-menu-item>
      <el-menu-item index="13" class="pull-right user-menu" v-if="isLogin">
        <el-dropdown placement="bottom-end" trigger="click">
          <span class="el-dropdown-link">
            <img class="user-profile" :src='userProfile.portrait | defaultPortrait' alt="username"><i class="el-icon-caret-bottom right-icon"></i>
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
              <a :href='myOrgUrl'><i class="iconfont icon-read"></i>{{$t("common.myOrganization")}}</a>
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
      <el-menu-item index="11" class="pull-right" v-if="isLogin">
        <el-dropdown placement="bottom" trigger="click">
          <span class="el-dropdown-link tool-menu">
            <i class="iconfont icon-wrench-fill"></i>{{$t('common.tools')}}<i class="el-icon-caret-bottom right-icon"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><a href="/ed" target="_blank"><i class="iconfont icon-brush"></i>{{$t('common.websiteEditor')}}</a></el-dropdown-item>
            <el-dropdown-item><a href="#" @click.stop.prevent="openSkyDriveManagerDialog"><i class="iconfont icon-save3"></i>{{$t('common.myWebDisk')}}</a></el-dropdown-item>
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

      <el-menu-item index='14' class="pull-right common-header-menu-download" @click="downloadParacraft()">
        <i class="iconfont icon-xiazai"></i><span class="common-header-menu-download-text">{{$t('project.downloadParacraft')}}</span>
      </el-menu-item>

      <el-menu-item index='12' class="pull-right common-header-menu-ranking" @click="goRanking">
        <img class="common-header-menu-ranking-img" src="@/assets/pblImg/ranking.png" alt="排行榜"><span class="common-header-menu-ranking-text">{{$t('common.ranking')}}</span>
      </el-menu-item>

      <el-menu-item class="menu-searchbar" index='10'>
        <search-bar></search-bar>
      </el-menu-item>
    </el-menu>

    <el-menu mode='horizontal' class="hidden-sm-and-up">
      <el-menu-item index='0' class="profile-menu-item" @click="goHomePage">
        <img class="brand" src="@/assets/img/logo_old.svg" alt="KeepWork">
      </el-menu-item>

      <el-menu-item index='1' class="pull-right" v-if="!isLogin">
        <a @click.stop.prevent="goJoin" class="register-btn">{{$t('common.register')}}</a>
      </el-menu-item>

      <el-menu-item index='2' class="pull-right" v-if="!isLogin">
        <a @click.stop.prevent="goLogin" class="login-btn">{{$t('common.login')}}</a>
      </el-menu-item>

      <el-menu-item index="3" class="pull-right user-menu" v-if="isLogin">
        <el-dropdown placement="bottom-end" trigger="click">
          <span class="el-dropdown-link">
            <img class="user-profile" :src='userProfile.portrait | defaultPortrait' alt="username"><i class="el-icon-caret-bottom right-icon"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="user-menu-dropdown">
            <div class="greeting">{{$t("common.hello")}}，{{username}}</div>
            <el-dropdown-item divided>
              <a :href="`/u/${userProfile.username}`"><i class="iconfont icon-user"></i>{{$t('common.myHomePage')}}</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="#" @click.stop.prevent="goCreativityPage"><i class="iconfont icon-folder-open"></i>{{$t("common.myProject")}}</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a :href='myOrgUrl'><i class="iconfont icon-read"></i>{{$t("common.myOrganization")}}</a>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <a href="#" @click.stop.prevent="goPersonalCenter"><i class="iconfont icon-settings1"></i>{{$t("common.settings")}}</a>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <a @click.stop="logout"><i class="iconfont icon-ziyuan"></i>{{$t('common.logout')}}</a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu-item>

      <el-menu-item index="4" class="pull-right" v-if="isLogin">
        <el-dropdown placement="bottom" trigger="click">
          <span class="el-dropdown-link tool-menu">
            <i class="iconfont icon-wrench-fill"></i><i class="el-icon-caret-bottom right-icon"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><a href="/ed" target="_blank"><i class="iconfont icon-brush"></i>{{$t('common.websiteEditor')}}</a></el-dropdown-item>
            <el-dropdown-item><a href="#" @click.stop.prevent="openSkyDriveManagerDialog"><i class="iconfont icon-save3"></i>{{$t('common.myWebDisk')}}</a></el-dropdown-item>
            <el-dropdown-item><a href="http://paracraft.keepwork.com/download?lang=zh" target="_blank"><i class="iconfont icon-video2"></i>{{$t('common.paracraft')}}</a></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu-item>

      <el-menu-item index="5" class="pull-right" v-if="isLogin">
        <el-dropdown placement="bottom" trigger="click">
          <span class="el-dropdown-link tool-menu">
            <i class="iconfont icon-menu"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><a href="" @click.stop.prevent="goCreativityPage">{{$t('common.creativity')}}</a></el-dropdown-item>
            <el-dropdown-item><a href="" @click.stop.prevent="goExplorationPage">{{$t('common.explore')}}</a></el-dropdown-item>
            <el-dropdown-item><a href="" @click.stop.prevent="goStudyPage">{{$t('common.study')}}</a></el-dropdown-item>
            <el-dropdown-item><a href="/ranking">{{$t('common.ranking')}}</a></el-dropdown-item>
            <el-dropdown-item><a href="http://paracraft.keepwork.com/download?lang=zh">{{$t('project.downloadParacraft')}}</a></el-dropdown-item>
            <el-dropdown-item><a href="/wiki/apps">{{$t('common.applicationCenter')}}</a></el-dropdown-item>
            <el-dropdown-item><a href='/official/help/index'>{{$t('common.help')}}</a></el-dropdown-item>
            <el-dropdown-item v-if="!IS_GLOBAL_VERSION"><a href='//keepwork.com/official/creativeTimes/latest' target="_blank">{{$t('common.creatTimes')}}</a></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu-item>
    </el-menu>

    <div @click.stop v-if='isPersonalCenterShow'>
      <personal-center-dialog :show='isPersonalCenterShow' :sitePath='userProfile.username' @close='closePersonalCenterDialog'></personal-center-dialog>
    </div>
    <div @click.stop v-if='isSkyDriveManagerDialogShow'>
      <sky-drive-manager-dialog :insertable='false' :show='isSkyDriveManagerDialogShow' @close='closeSkyDriveManagerDialog'></sky-drive-manager-dialog>
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
import PersonalCenterDialog from '@/components/common/PersonalCenterDialog'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
import LoginDialog from '@/components/common/LoginDialog'
import RegisterDialog from '@/components/common/RegisterComp'
import SearchBar from './SearchBar'
const IS_GLOBAL_VERSION = !!process.env.IS_GLOBAL_VERSION
const CREATE_REG = /^\/creativity/
const EXPLORATION_REG = /^\/exploration/
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
      activeIndex: '0'
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
      userIsLogined: 'user/isLogined',
      username: 'user/username',
      isBeInClassroom: 'lesson/student/isBeInClassroom'
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
    currentRouteName() {
      return this.$route.name
    }
  },
  mounted() {
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
      userGetProfile: 'user/getProfile',
      userLogout: 'user/logout',
      uploadLearnRecords: 'lesson/student/uploadLearnRecords',
      changeStatus: 'lesson/student/changeStatus'
    }),
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
      if (RANKING_REG.test(pathname)) {
        return (this.activeIndex = '12')
      }
      this.activeIndex = '0'
    },
    goKnowledgeManagement() {
      this.$alert('开发中~~~~~~', '', {
        confirmButtonText: '确定'
      })
    },
    goCreativityPage() {
      if (this.$route.name !== 'CreativityPage') {
        window.location.href = `${this.locationOrigin}/creativity`
      }
    },
    goExplorationPage() {
      if (this.$route.name !== 'ExplorationPage') {
        window.location.href = `${
          this.locationOrigin
        }/exploration?tab=allProjects`
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
      return (window.location.href = `${this.locationOrigin}/u/${
        this.username
      }`)
    },
    goPersonalCenter() {
      this.isPersonalCenterShow = true
    },
    closePersonalCenterDialog() {
      this.isPersonalCenterShow = false
    },
    openSkyDriveManagerDialog() {
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
      if (this.isBeInClassroom) {
        this.changeStatus(0)
        await this.uploadLearnRecords().catch(e => console.error(e))
      }
      this.userLogout()
      this.$emit('callback')
    },
    goJoin() {
      this.isRegisterDialogShow = true
    },
    closeRegisterDialog() {
      this.isRegisterDialogShow = false
    }
  },
  filters: {
    defaultPortrait: (str = '') =>
      (str && str.trim()) || require('@/assets/img/default_portrait.png')
  },
  components: {
    PersonalCenterDialog,
    SkyDriveManagerDialog,
    LoginDialog,
    RegisterDialog,
    SearchBar
  }
}
</script>

<style scoped>
.pull-right {
  float: right !important;
}
.tool-menu {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.el-menu .brand {
  width: 115px;
}
.el-menu .login-btn {
  background: #f5f5f5;
  border: solid 1px #dddddd;
  padding: 7px 11px;
  border-radius: 3px;
}
.el-menu .register-btn {
  background-color: #409eff;
  color: #fff;
  padding: 8px 12px;
  border-radius: 3px;
}
.el-menu .register-btn:hover {
  background-color: #218efc;
  color: #fff;
}
.menu-left {
  flex: 1;
}
.user-profile {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
.el-dropdown-menu__item--divided:before {
  margin: 0px;
}
.el-menu-item .right-icon {
  font-size: 13px;
  width: 0;
}
.el-dropdown-menu {
  font-size: 14px;
}
.el-dropdown-menu__item {
  display: flex;
  padding: 0;
}
.el-dropdown-menu__item a {
  padding: 0 20px;
  width: 100%;
}
.el-dropdown-menu .iconfont {
  margin-right: 14px;
  font-size: 20px;
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
.message-dropdown {
  .message {
    position: relative;
    .news {
      width: 10px;
      height: 10px;
      background: red;
      position: absolute;
      border-radius: 50%;
      top: -4px;
      right: -12px;
    }
  }
  &-list {
    .el-dropdown-menu__item {
      display: flex;
      .message-desc {
        flex: 1;
      }
      .detail-time {
        text-align: right;
        width: 38px;
        margin-left: 18px;
      }
    }
  }
}
.common-header {
  &-menu-ranking {
    padding-right: 4px !important;
    &-img {
      margin-right: 10px;
    }
    &-text {
      color: #ffa405;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      padding-right: 18px;
    }
  }
  &-menu-download {
    padding-right: 4px !important;
    .iconfont.icon-xiazai {
      color: #2397f3;
    }
    &-text {
      color: #2397f3;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      padding-right: 18px;
    }
  }
  .register-dialog {
    max-width: 352px;
    .el-dialog__body {
      padding: 0;
      .register-dialog-form {
        margin: 0;
        box-shadow: none;
        .register-title {
          padding: 0;
        }
      }
    }
  }
}
.el-menu-item {
  padding: 0 10px;
}
.user-menu-dropdown {
  .greeting {
    padding: 0 20px;
    height: 36px;
    line-height: 36px;
  }
  li {
    padding: 0;
  }
  a {
    padding: 0 50px 0 20px;
  }
}
.common-header-menu {
  .el-dropdown {
    height: 60px;
    line-height: 60px;
  }
  .el-menu-item {
    padding: 0 15px;
    color: #303133;
    &:hover {
      color: #409eff !important;
    }
    &.home-page {
      padding-left: 0;
    }
    &.register-button {
      padding: 0;
    }
    &.user-menu {
      padding-right: 5px;
    }
    &.is-active {
      color: #409eff;
    }
  }
}
.profile-submenu,
.el-popper {
  a {
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;
  }
}
.iicc-logo {
  width: 30px;
  height: 30px;
  margin-right: 5px;
}
@media (max-width: 768px) {
  .el-submenu__title {
    padding: 0 15px;
  }
  .el-menu--horizontal .greeting {
    padding: 0 10px;
  }
  .el-menu--horizontal .function-menu {
    a {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
}
@media print {
  .common-header {
    display: none;
  }
}
</style>
