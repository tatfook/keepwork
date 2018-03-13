<template>
  <div>
    <el-menu mode='horizontal' class="hidden-xs-only">
      <el-menu-item index='0'>
        <img class="brand" src="http://keepwork.com/wiki/assets/imgs/icon/logo.svg" alt="KeepWork">
      </el-menu-item>
      <el-menu-item index='1'>功能</el-menu-item>
      <el-menu-item index='2'>
        <a href="http://keepwork.com/wiki/apps" target="_blank">应用中心</a>
      </el-menu-item>
      <el-menu-item index='4'>
        <a href='http://keepwork.com/official/help/index' target='_blank'>帮助</a>
      </el-menu-item>

      <el-menu-item index='7' class="pull-right">历史</el-menu-item>
      <el-menu-item index='8' class="pull-right">关注</el-menu-item>
      <el-menu-item index='6' class="pull-right">动态(0)</el-menu-item>
      <el-submenu index="5" class="pull-right">
        <template slot="title">
          <img class="user-profile" src="http://git.keepwork.com/gitlab_rls_kaitlyn/keepworkdatasource/raw/master/kaitlyn_images/img_1518086126317.png" alt="username">
        </template>
        <el-menu-item index="5-1">我的主页</el-menu-item>
        <el-menu-item index="5-2">网站管理</el-menu-item>
        <el-menu-item index="5-3">页面编辑器</el-menu-item>
        <el-menu-item index="5-3">我的网盘</el-menu-item>
      </el-submenu>
    </el-menu>

    <el-menu mode='horizontal' class="hidden-sm-and-up">
      <el-menu-item index='0'>
        <img class="brand" src="http://keepwork.com/wiki/assets/imgs/icon/logo.svg" alt="KeepWork">
      </el-menu-item>
      <el-submenu index='1' class="pull-right">
        <template slot="title">
          <img class="user-profile" src="http://git.keepwork.com/gitlab_rls_kaitlyn/keepworkdatasource/raw/master/kaitlyn_images/img_1518086126317.png" alt="username">
        </template>
        <el-menu-item index='1-1'>功能</el-menu-item>
        <el-menu-item index='1-2'>应用中心</el-menu-item>
        <el-menu-item index='1-3'>帮助</el-menu-item>
        <el-menu-item index='1-4'>动态</el-menu-item>
        <el-menu-item index='1-5'>关注</el-menu-item>
        <el-menu-item index='1-6'>历史</el-menu-item>
      </el-submenu>
      <el-submenu index='2' class="pull-right">
        <template slot="title">
          <i class="el-icon-menu"></i>
        </template>
        <el-menu-item index='2-1'>我的主页</el-menu-item>
        <el-menu-item index='2-2'>网站管理</el-menu-item>
        <el-menu-item index='2-3'>页面编辑器</el-menu-item>
        <el-menu-item index='2-4'>我的网盘</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/display.css';
export default {
  name: 'CommonHeader'
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

@media(max-width: 768px){
  .hidden-sm-and-up .user-profile{
    width: 36px;
    height: 36px;
  }
  .hidden-sm-and-up .el-icon-menu{
    font-size: 30px;
  }
  .hidden-sm-and-up .el-submenu{
    margin: 0 -10px;
  }
}
</style>


