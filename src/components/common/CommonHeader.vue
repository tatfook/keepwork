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

      <!-- <el-menu-item index='7' class="pull-right">历史</el-menu-item>
      <el-menu-item index='8' class="pull-right">关注</el-menu-item>
      <el-menu-item index='6' class="pull-right">动态(0)</el-menu-item> -->
      <el-submenu index="5" class="pull-right" popper-class='profile-submenu'>
        <template slot="title">
          <img class="user-profile" :src='userProfile.portrait' alt="username">
        </template>
        <el-menu-item index="5-1">
          <a :href='"/" + userProfile.username'>{{$t('common.myHomePage')}}</a>
        </el-menu-item>
        <el-menu-item index="5-2">
          <a href="/wiki/user_center?userCenterContentType=websiteManager">{{$t('common.websiteManagement')}}</a>
        </el-menu-item>
        <el-menu-item index="5-3">
          <a href="/wiki/wikieditor" @click.stop.prevent="backEditArea">{{$t('common.pageEditor')}}</a>
        </el-menu-item>
        <!-- <el-menu-item index="5-3">我的网盘</el-menu-item> -->
      </el-submenu>
    </el-menu>

    <el-menu mode='horizontal' class="hidden-sm-and-up">
      <el-menu-item index='0'>
        <img class="brand" src="http://keepwork.com/wiki/assets/imgs/icon/logo.svg" alt="KeepWork">
      </el-menu-item>
      <el-submenu index='1' class="pull-right">
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
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css'
import { mapGetters } from 'vuex'
export default {
  name: 'CommonHeader',
  computed: {
    ...mapGetters({
      userProfile: 'user/profile'
    })
  },
  methods: {
    backEditArea(){
      this.$router.push('/wiki/wikieditor/#/'+this.$route.path)
      window.location.reload();
    }
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
}
</style>
<style lang="scss">
.profile-submenu {
  a {
    color: inherit;
  }
}
.iicc-logo{
  width: 30px;
  height: 30px;
  margin-right: 5px;
}
</style>



