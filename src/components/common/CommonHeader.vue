<template>
  <div>
    <el-menu mode='horizontal' class="hidden-xs-only">
      <el-menu-item index='0'>
        <img class="brand" src="@/assets/img/logo_old.svg" alt="KeepWork">
      </el-menu-item>
      <el-menu-item index='1'>
        <a href="/wiki/home">{{$t('common.features')}}</a>
      </el-menu-item>
      <el-menu-item index='2'>
        <a href="/wiki/apps">{{$t('common.applicationCenter')}}</a>
      </el-menu-item>
      <el-menu-item index='4'>
        <a href='/official/help/index'>{{$t('common.help')}}</a>
      </el-menu-item>
      <el-menu-item v-if="!IS_GLOBAL_VERSION" index='6'>
        <a href='//iicc.keepwork.com' target="_blank">
          <img class="iicc-logo" src="@/assets/img/iicc_logo.png" alt="">{{$t('common.iicc')}}
        </a>
      </el-menu-item>

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
            <img class="user-profile" :src='userProfile.portrait' alt="username">
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
              <a href="/wiki/wikieditor" @click.stop.prevent="backEditArea">{{$t('common.pageEditor')}}</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="#" @click.stop.prevent="openSkyDriveManagerDialog">{{$t('common.myWebDisk')}}</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="/wiki/user_center?userCenterContentType=invite&userCenterSubContentType=addFriend">{{$t('common.invitationToRegister')}}</a>
            </el-dropdown-item>
            <el-dropdown-item divided><a @click.stop="logout">{{$t('common.logout')}}</a></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu-item>

      <el-menu-item index='8' class="pull-right" v-if="!isLogin">
        <a @click.stop.prevent="goJoin">{{$t('common.signIn')}}</a>
      </el-menu-item>
      <el-menu-item index='9' class="pull-right" v-if="!isLogin">
        <a @click.stop.prevent="goLogin" class="login-btn">{{$t('common.login')}}</a>
      </el-menu-item>
    </el-menu>

    <el-menu mode='horizontal' class="hidden-sm-and-up">
      <el-menu-item index='0' class="profile-menu-item">
        <img class="brand" src="@/assets/img/logo_old.svg" alt="KeepWork">
      </el-menu-item>
      <el-submenu index='1' class="pull-right" v-if="isLogin">
        <template slot="title">
          <img class="user-profile" :src='userProfile.portrait' alt="username">
        </template>
        <el-menu-item index='1-1'>
          <a :href='"/" + userProfile.username'>{{$t('common.myHomePage')}}</a>
        </el-menu-item>
        <el-menu-item index='1-2'>
          <a href="/wiki/user_center?userCenterContentType=websiteManager">{{$t('common.websiteManagement')}}</a>
        </el-menu-item>
        <el-menu-item index='1-3'>
          <a href="/wiki/wikieditor">{{$t('common.pageEditor')}}</a>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index='3' class="pull-right" v-if="!isLogin">
        <a @click.stop.prevent="goJoin">{{$t('common.signIn')}}</a>
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
      <PersonalCenterDialog :show='isPersonalCenterShow' :sitePath='userProfile.username' @close='closePersonalCenterDialog' />
    </div>
    <div @click.stop v-if='isSkyDriveManagerDialogShow'>
      <SkyDriveManagerDialog :show='isSkyDriveManagerDialogShow' @close='closeSkyDriveManagerDialog' />
    </div>
    <div @click.stop v-if="isLoginDialogShow" class="login-dialog">
      <el-dialog title="" :visible.sync="isLoginDialogShow">
        <el-form class="login-dialog-form" :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
           <el-form-item prop="password">
            <el-input type="password" v-model="ruleForm.password"></el-input>
          </el-form-item>
          <div class="login-dialog-form-operate"><a href="/wiki/find_pwd">{{$t('common.forgetPassword')}}?</a></div>
          <el-form-item>
            <el-button class="login-btn" type="primary" @click="login('ruleForm')">{{$t('common.login')}}</el-button>
          </el-form-item>
          <div class="login-dialog-form-operate_signIn">{{$t('common.noAccount')}}?<a href="/wiki/join">{{$t('common.signIn')}}</a></div>
          <div class="login-dialog-form-three-login">
            <div class="title">{{$t('common.usingFollowingAccount')}}</div>
            <a>
              <img src="https://stage.keepwork.com/wiki/assets/imgs/icon/wiki_qq.png" alt="">
            </a>
            <a>
              <img src="https://stage.keepwork.com/wiki/assets/imgs/icon/wiki_wechat.png" alt="">
            </a>
            <a>
              <img src="https://stage.keepwork.com/wiki/assets/imgs/icon/wiki_sina_weibo.png" alt="">
            </a>
            <a>
              <img src="https://stage.keepwork.com/wiki/assets/imgs/icon/wiki_github_logo.png" alt="">
            </a>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
import { mapGetters, mapActions } from 'vuex'
import PersonalCenterDialog from '@/components/common/PersonalCenterDialog'
import SkyDriveManagerDialog from '@/components/common/SkyDriveManagerDialog'
import Cookies from 'js-cookie'
const IS_GLOBAL_VERSION = !!process.env.IS_GLOBAL_VERSION

export default {
  name: 'CommonHeader',
  data() {
    return {
      IS_GLOBAL_VERSION,
      isPersonalCenterShow: false,
      isSkyDriveManagerDialogShow: false,
      isLoginDialogShow: false,
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: this.$t('common.inputUsername'), trigger: 'blur' }
        ],
        password: [{ required: true, message: this.$t('common.inputPassword'), trigger: 'blur' }]
      }
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
      userLogin: 'user/login',
      userLogout: 'user/logout'
    }),
    backEditArea() {
      this.$router.push('/wiki/wikieditor/#/' + this.$route.path)
      window.location.reload()
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
    async login(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let payload = {
            username: this.ruleForm.username,
            password: this.ruleForm.password
          }
          let info = await this.userLogin(payload)
          if (info.error.id === 0) {
            this.isLoginDialogShow = false
          } else if (info.error.message === '用户不存在') {
            this.$message({
              message: this.$t('common.usernameNotExist'),
              type:'error',
              showClose: true
            })
          }else if (info.error.message === '密码错误'){
            this.$message({
              message:  this.$t('common.wrongPassword'),
              type:'error',
              showClose: true
            })
          }
        } else {
          return false
        }
      })
    },
    logout() {
      this.userLogout()
      // window.location.reload()
    },
    goJoin() {
      window.location = '/wiki/join?redirect=' + window.location.href
    }
  },
  components: {
    PersonalCenterDialog,
    SkyDriveManagerDialog
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
  background-color: #3977ad;
  color: #fff;
  padding: 8px 12px;
  border-radius: 3px;
}

.el-menu .login-btn:hover {
  background-color: #286090;
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
.el-menu-item [class^='el-icon-'] {
  width: 20px;
  font-size: 18px;
  position: absolute;
  bottom: 8px;
  right: -18px;
}
.el-menu-item i {
  color: #2b6da8 !important;
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
.login-dialog {
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog {
    width: 478px;
    height: 580px;
    padding: 40px 0 60px 0;
  }
  &-form {
    width: 68%;
    margin: 0 auto;
    .el-form-item__content {
      .el-input__inner {
        &:focus {
          box-shadow: 1px 1px 3px #daeaf6, -1px -1px 3px #daeaf6;
        }
      }
    }
    &-operate {
      text-align: right;
      cursor: pointer;
      a{
        text-decoration: none;
        color: inherit;
      }
    }
    &-operate_signIn {
      text-align: right;
      a {
        display: inline-block;
        text-decoration: none;
        height: 20px;
        border-bottom: 1px solid #3977ad;
        color: #286090;
        cursor: pointer;
      }
    }
    &-three-login {
      a {
        display: inline-block;
        width: 24%;
        text-align: center;
        img {
          cursor: pointer;
        }
      }
      .title {
        margin: 40px 0;
        padding: 20px 0 35px;
        text-align: center;
        position: relative;
        &::before {
          content: '';
          height: 2px;
          width: 16%;
          position: absolute;
          right: 0;
          top: 40%;
          background-color: #d6e6f4;
        }
        &::after {
          content: '';
          height: 2px;
          width: 16%;
          position: absolute;
          left: 0;
          top: 40%;
          background-color: #d6e6f4;
        }
      }
    }
    .login-btn {
      width: 100%;
      margin: 20px 0;
      height: 44px;
      padding: 10px 16px;
      font-size: 18px;
      border-radius: 6px;
    }
  }
}
@media (max-width: 768px) {
  .el-submenu__title {
    padding: 0 15px;
  }
}
</style>



