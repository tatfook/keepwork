<template>
  <div class="editor-header">
    <el-menu mode='horizontal'>
      <el-submenu index='1'>
        <template slot='title'>
          <img src="http://keepwork.com/wiki/assets/imgs/icon/logo_sm.png" alt="Menu">
        </template>
        <el-submenu index='1-1'>
          <template slot="title">系统</template>
          <el-menu-item index='1-1-1'>新建网站</el-menu-item>
          <el-menu-item index='1-1-2'>新建页面</el-menu-item>
          <el-menu-item index='1-1-3'>保存</el-menu-item>
          <el-menu-item index='1-1-4'>网站设置</el-menu-item>
          <el-menu-item index='1-1-5'>网站备份</el-menu-item>
          <el-menu-item index='1-1-6'>版本管理</el-menu-item>
        </el-submenu>
        <el-submenu index='1-2'>
            <template slot='title'>页面</template>
            <el-menu-item index='1-2-1'>数据源</el-menu-item>
        </el-submenu>
        <el-submenu index='1-3'>
            <template slot='title'>编辑</template>
            <el-menu-item index='1-3-1'>撤销</el-menu-item>
            <el-menu-item index='1-3-2'>重做</el-menu-item>
            <el-menu-item index='1-3-3'>搜索</el-menu-item>
            <el-menu-item index='1-3-4'>替换</el-menu-item>
        </el-submenu>
        <el-submenu index='1-4'>
            <template slot='title'>插入</template>
            <el-menu-item index='1-4-1'>模块</el-menu-item>
            <el-menu-item index='1-4-2'>网盘</el-menu-item>
        </el-submenu>
        <el-submenu index='1-5'>
            <template slot='title'>显示</template>
            <el-menu-item index='1-5-1'>预览</el-menu-item>
            <el-menu-item index='1-5-2'>代码</el-menu-item>
            <el-menu-item index='1-5-3'>分屏</el-menu-item>
            <el-menu-item index='1-5-4'>全屏</el-menu-item>
            <el-submenu index='1-5-5'>
                <template slot='title'>页面模式</template>
                <el-menu-item index='1-5-5-1'>电脑</el-menu-item>
                <el-menu-item index='1-5-5-2'>手机</el-menu-item>
            </el-submenu>
        </el-submenu>
        <el-menu-item index='1-6'>帮助</el-menu-item>
        <el-menu-item index='1-7'>
            <a href="/">返回首页</a>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index='2'>{{pathname}}</el-menu-item>
      <el-menu-item index='3'>
        <el-button plain size='small'>新建</el-button>
      </el-menu-item>
      <el-menu-item index='4'>
        <el-button plain size='small'>保存</el-button>
      </el-menu-item>
      <el-menu-item index='5'>
        <el-button plain size='small'>网盘</el-button>
      </el-menu-item>
      <el-menu-item index='6'>
        <el-button plain size='small'>模块</el-button>
      </el-menu-item>

      <el-menu-item index='7' class="pull-right">
        <img class="user-profile" src="http://git.keepwork.com/gitlab_rls_kaitlyn/keepworkdatasource/raw/master/kaitlyn_images/img_1518086126317.png" alt="">
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'EditorHeader',
  data: function() {
    return {
      pathname: window.location.pathname
    }
  }
}
</script>

<style>
.pull-right{
  float: right !important;
}
.user-profile{
  width: 46px;
  height: 46px;
  border-radius: 50%;
}
</style>

