<template>
  <el-menu mode='horizontal'>
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
</template>

<script>
export default {
  name: 'CommonHeader'
}
</script>

<style scoped>
.pull-right{
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

.user-profile{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
</style>


