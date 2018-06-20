<template>
  <div>
    <el-menu mode='horizontal' class="hidden-xs-only">
      <el-menu-item index='0'>
        <img class="brand" src="http://keepwork.com/wiki/assets/imgs/icon/logo.svg" alt="KeepWork">
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
      <el-menu-item index='6'>
        <a href='http://iicc.keepwork.com' target="_blank">
          <img class="iicc-logo" src="http://keepwork.com/wiki/assets/imgs/iicc_logo.png" alt="">{{$t('common.iicc')}}
        </a>
      </el-menu-item>
      
      <el-menu-item index="10" class="pull-right" v-if="isLogin">
        <a href="#">历史</a>
      </el-menu-item>
      <el-menu-item index="11" class="pull-right" v-if="isLogin">
        <a href="#">关注</a>
      </el-menu-item>
      <el-menu-item index="12" class="pull-right" v-if="isLogin">
        <a href="#">动态(0)</a>
      </el-menu-item>
      <el-menu-item index="13" class="pull-right" v-if="isLogin">
        <el-dropdown placement="bottom-start">
          <span class="el-dropdown-link">
          <img class="user-profile" :src='userProfile.portrait' alt="username">
              <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><a :href='"/" + userProfile.username'>{{$t('common.myHomePage')}}</a></el-dropdown-item>
            <el-dropdown-item><a href="#" @click.stop.prevent="goPersonalCenter">个人中心</a></el-dropdown-item>
            <el-dropdown-item><a href="#">服务商城</a></el-dropdown-item>
            <el-dropdown-item><a href="/wiki/wikieditor" @click.stop.prevent="backEditArea">{{$t('common.pageEditor')}}</a></el-dropdown-item>
            <el-dropdown-item><a href="">我的网盘</a></el-dropdown-item>
            <el-dropdown-item><a href="#">邀请注册</a></el-dropdown-item>
            <el-dropdown-item divided><a href="#">退出登录</a></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-menu-item>

      <el-menu-item index='8' class="pull-right" v-if="!isLogin">
        <a href="/wiki/join">注册</a>
      </el-menu-item>
      <el-menu-item index='9' class="pull-right" v-if="!isLogin">
        <a href="/wiki/login" class="login-btn">登录</a>
      </el-menu-item>

    </el-menu>

    <el-menu mode='horizontal' class="hidden-sm-and-up">
      <el-menu-item index='0' class="profile-menu-item">
        <img class="brand" src="http://keepwork.com/wiki/assets/imgs/icon/logo.svg" alt="KeepWork">
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
        <a href="/wiki/join">注册</a>
      </el-menu-item>
      <el-menu-item index='4' class="pull-right" v-if="!isLogin">
        <a href="/wiki/login" class="login-btn">登录</a>
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
        <el-menu-item index='2-6'>
          <a href='http://iicc.keepwork.com' target="_blank">{{$t('common.iicc')}}</a>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <div @click.stop v-if='isPersonalCenterShow'>
      <PersonalCenterDialog :show='isPersonalCenterShow' :sitePath='userProfile.username' @close='closePersonalCenterDialog' />
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
import { mapGetters, mapActions } from 'vuex'
import PersonalCenterDialog from '@/components/common/PersonalCenterDialog'
export default {
  name: 'CommonHeader',
  data() {
    return {
      isPersonalCenterShow: false
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
      userGetProfile: 'user/getProfile'
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
    }
  },
  components: {
    PersonalCenterDialog
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
  .profile-menu-item {
    padding-left: 0;
  }
  .el-menu .login-btn {
    margin-right: -20px;
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
@media (max-width: 768px) {
  .el-submenu__title {
    padding: 0 15px;
  }
}
</style>



