<template>
  <div class="common-header">
    <el-menu mode='horizontal' class="hidden-xs-only">
      <el-menu-item index='0' @click="goHomePage">
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
      <!-- <el-menu-item v-if="!IS_GLOBAL_VERSION" index='6'>
        <a href='//iicc.keepwork.com' target="_blank">
          <img class="iicc-logo" src="@/assets/img/iicc_logo.png" alt="">{{$t('common.iicc')}}
        </a>
      </el-menu-item> -->

      <el-menu-item index="10" class="pull-right" v-if="isLogin">
        <a href="/wiki/user_center?userCenterContentType=userProfile&userCenterSubContentType=myHistory">{{$t('common.history')}}</a>
      </el-menu-item>
      <el-menu-item index="11" class="pull-right" v-if="isLogin">
        <a href="/wiki/user_center?userCenterContentType=userProfile&userCenterSubContentType=myCollection">{{$t('common.attention')}}</a>
      </el-menu-item>
      <el-menu-item index="12" class="pull-right" v-if="isLogin">
        <a href="/wiki/user_center?userCenterContentType=userProfile&userCenterSubContentType=myTrends">{{$t('common.dynamic')}}(0)</a>
      </el-menu-item>
      <el-menu-item index="13" class="pull-right" v-if="isLogin">
        <el-dropdown placement="bottom-start">
          <span class="el-dropdown-link">
            <img class="user-profile" :src='userProfile.portrait | defaultPortrait' alt="username">
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="user-menu-dropdown">
            <el-dropdown-item>
              <a :href='"/" + userProfile.username'>{{$t('common.myHomePage')}}</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="#" @click.stop.prevent="goPersonalCenter">{{$t('common.personalCenter')}}</a>
            </el-dropdown-item>
            <!-- <el-dropdown-item><a href="#">{{$t('common.serviceMall')}}</a></el-dropdown-item> -->
            <el-dropdown-item>
              <a href="ed" @click.stop.prevent="backEditArea">{{$t('common.pageEditor')}}</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="#" @click.stop.prevent="openSkyDriveManagerDialog">{{$t('common.myWebDisk')}}</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="/wiki/user_center?userCenterContentType=invite&userCenterSubContentType=addFriend">{{$t('common.invitationToRegister')}}</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a :href='lessonCenterUrl'>{{$t('lesson.lessonsCenter')}}</a>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <a @click.stop="logout">{{$t('common.logout')}}</a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu-item>

      <el-menu-item index='8' class="pull-right" v-if="!isLogin">
        <a @click.stop.prevent="goJoin" class="register-btn">{{$t('common.register')}}</a>
      </el-menu-item>
      <el-menu-item index='9' class="pull-right" v-if="!isLogin">
        <a @click.stop.prevent="goLogin" class="login-btn">{{$t('common.login')}}</a>
      </el-menu-item>
      <el-menu-item index='10'>
        <search-bar></search-bar>
      </el-menu-item>
    </el-menu>

    <el-menu mode='horizontal' class="hidden-sm-and-up">
      <el-menu-item index='0' class="profile-menu-item">
        <img class="brand" src="@/assets/img/logo_old.svg" alt="KeepWork">
      </el-menu-item>
      <el-submenu index='1' class="pull-right" v-if="isLogin">
        <template slot="title">
          <img class="user-profile" :src='userProfile.portrait | defaultPortrait' alt="username">
        </template>
        <el-menu-item index='1-1'>
          <a :href='"/" + userProfile.username'>{{$t('common.myHomePage')}}</a>
        </el-menu-item>
        <el-menu-item index='1-2'>
          <a href="/wiki/user_center?userCenterContentType=websiteManager">{{$t('common.websiteManagement')}}</a>
        </el-menu-item>
        <el-menu-item index='1-3'>
          <a href="ed">{{$t('common.pageEditor')}}</a>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index='3' class="pull-right" v-if="!isLogin">
        <a @click.stop.prevent="goJoin" class="register-btn">{{$t('common.register')}}</a>
      </el-menu-item>
      <el-menu-item index='4' class="pull-right" v-if="!isLogin">
        <a @click.stop.prevent="goLogin" class="login-btn">{{$t('common.login')}}</a>
      </el-menu-item>
      <el-submenu index='2' class="pull-right">
        <template slot="title">
          <i class="el-icon-menu"></i>
        </template>
        <el-menu-item index='2-1'>
          <a href="/wiki/home">{{$t('common.features')}}</a>
        </el-menu-item>
        <el-menu-item index='2-2'>
          <a href="/wiki/apps">{{$t('common.applicationCenter')}}</a>
        </el-menu-item>
        <el-menu-item index='2-3'>
          <a href='/official/help/index'>{{$t('common.help')}}</a>
        </el-menu-item>
        <el-menu-item v-if="!IS_GLOBAL_VERSION" index='2-6'>
          <a href='//iicc.keepwork.com' target="_blank">{{$t('common.iicc')}}</a>
        </el-menu-item>
      </el-submenu>
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
import PersonalCenterDialog from '@/components/common/PersonalCenterDialog'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
import LoginDialog from '@/components/common/LoginDialog'
import RegisterDialog from '@/components/common/RegisterDialog'
import SearchBar from './SearchBar'
const IS_GLOBAL_VERSION = !!process.env.IS_GLOBAL_VERSION
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
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/profile',
      userIsLogined: 'user/isLogined'
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
    lessonCenterUrl() {
      return '/l/student/center'
    }
  },
  mounted() {
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
  methods: {
    ...mapActions({
      userGetProfile: 'user/getProfile',
      userLogout: 'user/logout'
    }),
    goCreativityPage(){
      // this.$router.push('creativity')
      window.location.href=`${this.locationOrigin}/creativity`
    },
    goExplorationPage(){
      // this.$router.push('exploration')
      window.location.href=`${this.locationOrigin}/exploration`
    },
    goStudyPage(){
      // this.$router.push('study')
      window.location.href=`${this.locationOrigin}/study`
    },
    goHomePage(){
      this.$router.push('/')
    },
    backEditArea() {
      window.open(`${origin}/ed`)
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
    logout() {
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
      str.trim() || require('@/assets/img/default_portrait.png')
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
.el-menu .brand {
  width: 115px;
}
.el-menu a {
  text-decoration: none;
  color: inherit;
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
.user-menu-dropdown li {
  padding: 0;
}
.user-menu-dropdown a {
  display: block;
  padding: 0 20px;
}
.el-dropdown-menu__item--divided:before {
  margin: 0px;
}
@media (max-width: 768px) {
  .hidden-sm-and-up .user-profile {
    width: 36px;
    height: 36px;
  }
  .hidden-sm-and-up .el-icon-menu {
    font-size: 30px;
  }
  .hidden-sm-and-up .el-submenu {
    margin: 0 -10px;
  }
  .el-menu-item {
    padding: 0 10px;
  }
  .profile-menu-item {
    padding-left: 0;
  }
  .el-menu .login-btn {
    padding: 0;
    background-color: transparent;
    color: #3977ad;
  }
}
</style>
<style lang="scss">
.el-menu-item {
  padding: 0 15px;
}
.el-menu-item [class^='el-icon-'] {
  width: 20px;
  font-size: 18px;
  position: absolute;
  bottom: 8px;
  right: -18px;
}
.profile-submenu,
.el-popper {
  a {
    color: inherit;
    text-decoration: none;
  }
}
.iicc-logo {
  width: 30px;
  height: 30px;
  margin-right: 5px;
}
.register-dialog{
  max-width: 352px;
  .el-dialog__body{
    padding: 0;
  }
}
@media (max-width: 768px) {
  .el-submenu__title {
    padding: 0 15px;
  }
}
@media print {
  .common-header {
    display: none;
  }
}
</style>
