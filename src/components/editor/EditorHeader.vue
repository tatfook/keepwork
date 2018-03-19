<template>
  <div class="editor-header">
    <el-menu mode='horizontal'>
      <el-submenu index='1'>
        <template slot='title'>
          <img class="kp-logo" src="@/assets/img/logo.svg" alt="Menu">
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
      <el-menu-item index='3' class="li-btn">
        <span class="btn icon-save" title="保存"></span>
      </el-menu-item>
      <el-menu-item index='4' class="li-btn">
        <span class="btn icon-undo" title="撤销"></span>
      </el-menu-item>
      <el-menu-item index='5' class="li-btn">
        <span class="btn icon-redo" title="重做"></span>
      </el-menu-item>
      <el-menu-item index='6' class="li-btn">
        <span class="btn icon-full-screen" title="全屏"></span>
      </el-menu-item>
      <el-menu-item index='2'>
        <span class="input-link-copy-box">
          <a :href="pathname" target="_blank">{{pathname}}</a>
        </span>
      </el-menu-item>

      <el-menu-item index='7' class="pull-right user-profile-box">
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

<style scoped>
.kp-logo {
  width: 127px;
}
.li-btn {
  padding: 0 8px;
}
.btn {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 50%;
}
.pull-right {
  float: right !important;
}
.user-profile-box {
  padding-right: 0;
}
.user-profile {
  width: 46px;
  height: 46px;
  border-radius: 50%;
}
.input-link-copy-box {
  display: inline-block;
  width: 367px;
  border: 1px solid #dcdfe6;
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  padding: 0 16px;
}
.input-link-copy-box a{
  color: #288ce9;
  text-decoration: none;
}
</style>

<style lang="scss" scoped>
$spriteUrl: '../../assets/img/editor_sprites.png';

.icon-save {
  background: url($spriteUrl) -194px 6px no-repeat;
}
.icon-undo {
  background: url($spriteUrl) -246px 6px no-repeat;
}
.icon-redo {
  background: url($spriteUrl) -295px 6px no-repeat;
}
.icon-full-screen {
  background: url($spriteUrl) -346px 6px no-repeat;
}
</style>



